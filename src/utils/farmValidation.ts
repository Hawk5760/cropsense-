import type { FarmDetails } from '../types/cropsense';

export interface FarmValidationErrors {
  location?: 'locationOrCoordsRequired';
  latitude?: 'invalidLatitude';
  longitude?: 'invalidLongitude';
  farmSize?: 'invalidFarmSize';
  crop?: 'cropRequired';
  season?: 'seasonRequired';
  lastYearYield?: 'invalidYield';
  lastYearProduction?: 'invalidProduction';
}

export interface FarmValidationResult {
  valid: boolean;
  errors: FarmValidationErrors;
}

export function validateFarmDetails(details: FarmDetails): FarmValidationResult {
  const errors: FarmValidationErrors = {};

  const hasStateAndCity = Boolean(details.state.trim() && details.city.trim());
  const latRaw = details.latitude.trim();
  const lonRaw = details.longitude.trim();
  const hasAnyCoord = Boolean(latRaw || lonRaw);

  let validCoords = false;
  if (hasAnyCoord) {
    const latNum = Number(latRaw);
    const lonNum = Number(lonRaw);
    const latOk = latRaw !== '' && !Number.isNaN(latNum) && latNum >= -90 && latNum <= 90;
    const lonOk = lonRaw !== '' && !Number.isNaN(lonNum) && lonNum >= -180 && lonNum <= 180;

    if (!latOk) {
      errors.latitude = 'invalidLatitude';
    }
    if (!lonOk) {
      errors.longitude = 'invalidLongitude';
    }
    validCoords = latOk && lonOk;
  }

  if (!hasStateAndCity && !validCoords) {
    errors.location = 'locationOrCoordsRequired';
  }

  const sizeNum = Number(details.farmSize);
  if (!details.farmSize.trim() || Number.isNaN(sizeNum) || sizeNum <= 0) {
    errors.farmSize = 'invalidFarmSize';
  }

  if (!details.crop) {
    errors.crop = 'cropRequired';
  }

  if (!details.season) {
    errors.season = 'seasonRequired';
  }

  if (details.lastYearYield.trim() !== '') {
    const cleanYield = details.lastYearYield.replace(/,/g, '').trim();
    const yieldNum = Number(cleanYield);
    if (Number.isNaN(yieldNum) || yieldNum < 0) {
      errors.lastYearYield = 'invalidYield';
    }
  }

  const prodRaw = String(details.lastYearProduction ?? '').replace(/,/g, '').trim();
  if (prodRaw !== '') {
    const prodNum = Number(prodRaw);
    if (Number.isNaN(prodNum) || prodNum < 0) {
      errors.lastYearProduction = 'invalidProduction';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatIndianCurrency(value: string | number): string {
  const raw = typeof value === 'number' ? String(value) : value.replace(/,/g, '').trim();
  if (!raw) return '';
  const num = Number(raw);
  if (Number.isNaN(num)) return raw;
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num);
}

export function getFarmLocationLabel(details: FarmDetails): string {
  const cityState = [details.city.trim(), details.state.trim()].filter(Boolean).join(', ');
  if (cityState) return cityState;
  if (details.latitude.trim() && details.longitude.trim()) {
    return `${details.latitude.trim()}°, ${details.longitude.trim()}°`;
  }
  return '—';
}
