import type { FarmDetails, WeatherConditions, WeatherMonitorData } from '../types/cropsense';
import { getFarmLocationLabel } from '../utils/farmValidation';

export class WeatherServiceError extends Error {
  code: string;
  quotaExceeded?: boolean;

  constructor(code: string, message: string, quotaExceeded?: boolean) {
    super(message);
    this.code = code;
    this.quotaExceeded = quotaExceeded;
  }
}

/**
 * Fetches location-specific current weather, 7-day forecast (via Google Weather API proxy),
 * and past 30-day historical weather time series.
 * Triggers Tier 2 Demo Key Quota Defense event ONLY on 429 / RESOURCE_EXHAUSTED.
 */
export async function fetchFarmWeatherMonitor(
  farmDetails: FarmDetails
): Promise<WeatherMonitorData> {
  const params = new URLSearchParams();
  if (farmDetails.city.trim()) params.set('city', farmDetails.city.trim());
  if (farmDetails.state.trim()) params.set('state', farmDetails.state.trim());
  if (farmDetails.latitude.trim() && farmDetails.longitude.trim()) {
    params.set('lat', farmDetails.latitude.trim());
    params.set('lng', farmDetails.longitude.trim());
  }

  const response = await fetch(`/api/weather?${params.toString()}`);
  const data = await response.json().catch(() => ({}));

  if (
    response.status === 429 ||
    data?.error === 'RESOURCE_EXHAUSTED' ||
    data?.quotaExceeded === true
  ) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    }
    if (!response.ok) {
      throw new WeatherServiceError(
        'RESOURCE_EXHAUSTED',
        data?.message || 'Google Maps Platform Weather API quota reached.',
        true
      );
    }
  }

  if (!response.ok) {
    throw new WeatherServiceError(
      typeof data?.error === 'string' ? data.error : 'WEATHER_FETCH_FAILED',
      typeof data?.message === 'string'
        ? data.message
        : 'Unable to fetch weather data for this location right now.'
    );
  }

  return data as WeatherMonitorData;
}

export function buildWeatherSummaryString(weather: WeatherMonitorData | null): string {
  if (!weather) return '';
  const { current, locationLabel } = weather;
  return `${locationLabel}: ${current.conditionText}, ${Math.round(current.temperatureC)}°C, Humidity ${current.humidityPct}%, Rain ${current.rainfallMm}mm (${current.rainProbabilityPct}% chance), Wind ${Math.round(current.windKmh)} km/h.`;
}

/**
 * Backwards-compatible summary helper.
 */
export async function fetchFarmWeatherConditions(
  farmDetails: FarmDetails
): Promise<WeatherConditions> {
  const locationLabel = getFarmLocationLabel(farmDetails);
  try {
    const data = await fetchFarmWeatherMonitor(farmDetails);
    return {
      connected: true,
      providerName: data.currentProvider,
      temperatureC: data.current.temperatureC,
      humidityPct: data.current.humidityPct,
      rainProbabilityPct: data.current.rainProbabilityPct,
      windKmh: data.current.windKmh,
      summary: `${data.current.conditionText} in ${data.locationLabel}`,
    };
  } catch {
    return {
      connected: false,
      providerName: 'Google Weather API',
      summary: `Weather for ${locationLabel} is currently unavailable.`,
    };
  }
}
