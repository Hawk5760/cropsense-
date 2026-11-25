import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

// Google Maps Platform attribution ID (overriding sub-skill defaults per governance policy)
const GMP_SOLUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi (हिन्दी)',
  mr: 'Marathi (मराठी)',
  kn: 'Kannada (ಕನ್ನಡ)',
};

const VALID_STATES = [
  'Maharashtra',
  'Karnataka',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Gujarat',
  'Uttar Pradesh',
  'Rajasthan',
  'Andhra Pradesh',
  'Telangana',
  'Tamil Nadu',
  'West Bengal',
  'Bihar',
];

const VALID_CROPS = [
  'Cotton',
  'Wheat',
  'Rice',
  'Soybean',
  'Maize',
  'Sugarcane',
  'Tomato',
  'Onion',
  'Other',
];

const VALID_UNITS = ['Acres', 'Hectares', 'Square Metres'];
const VALID_SEASONS = ['Kharif', 'Rabi', 'Zaid'];

// Baseline coordinates for major Indian agricultural districts as resilience fallback if geocoder is offline
const INDIAN_CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  amravati: { lat: 20.932, lng: 77.7523 },
  nagpur: { lat: 21.1458, lng: 79.0882 },
  nashik: { lat: 19.9975, lng: 73.7898 },
  pune: { lat: 18.5204, lng: 73.8567 },
  akola: { lat: 20.7002, lng: 77.0082 },
  yavatmal: { lat: 20.3888, lng: 78.1204 },
  jalgaon: { lat: 21.0077, lng: 75.5626 },
  kolhapur: { lat: 16.705, lng: 74.2433 },
  solapur: { lat: 17.6599, lng: 75.9064 },
  aurangabad: { lat: 19.8762, lng: 75.3433 },
  'bengaluru rural': { lat: 13.2257, lng: 77.575 },
  belagavi: { lat: 15.8497, lng: 74.4977 },
  dharwad: { lat: 15.4589, lng: 75.0078 },
  kalaburagi: { lat: 17.3297, lng: 76.8343 },
  mysuru: { lat: 12.2958, lng: 76.6394 },
  mandya: { lat: 12.5218, lng: 76.8951 },
  raichur: { lat: 16.212, lng: 77.3439 },
  indore: { lat: 22.7196, lng: 75.8577 },
  bhopal: { lat: 23.2599, lng: 77.4126 },
  ludhiana: { lat: 30.901, lng: 75.8573 },
  karnal: { lat: 29.6857, lng: 76.9905 },
  rajkot: { lat: 22.3039, lng: 70.8022 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  guntur: { lat: 16.3067, lng: 80.4365 },
  warangal: { lat: 17.9689, lng: 79.5941 },
  thanjavur: { lat: 10.787, lng: 79.1378 },
  patna: { lat: 25.5941, lng: 85.1376 },
  maharashtra: { lat: 19.7515, lng: 75.7139 },
  karnataka: { lat: 15.3173, lng: 75.7139 },
  'madhya pradesh': { lat: 22.9734, lng: 78.6569 },
  punjab: { lat: 31.1471, lng: 75.3412 },
  haryana: { lat: 29.0588, lng: 76.0856 },
  gujarat: { lat: 22.2587, lng: 71.1924 },
};

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getGoogleMapsApiKey(): string | null {
  const key = (
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    process.env.MAPS_API_KEY ||
    ''
  ).trim();
  if (!key || key === 'MY_GOOGLE_MAPS_API_KEY') return null;
  return key;
}

function isQuotaExhaustedResponse(status: number, body: unknown): boolean {
  if (status === 429) return true;
  if (body && typeof body === 'object') {
    const errObj = (body as { error?: { status?: string; code?: number; message?: string } }).error;
    if (errObj?.status === 'RESOURCE_EXHAUSTED' || errObj?.code === 429) {
      return true;
    }
  }
  return false;
}

const PRIMARY_GEMINI_MODEL = 'gemini-4-hydrogen';
const LITE_GEMINI_MODEL = 'gemini-3.1-flash-lite';
const QUOTA_COOLDOWN_MS = 2 * 60 * 1000;
const MODEL_UNAVAILABLE_COOLDOWN_MS = 60 * 60 * 1000;
const modelCooldownUntil = new Map<string, number>();
let lastQuotaError: unknown = null;

function getErrorStatus(err: unknown): number | undefined {
  if (!err || typeof err !== 'object') return undefined;
  const candidate = err as { status?: number; code?: number; error?: { code?: number } };
  return candidate.status ?? candidate.code ?? candidate.error?.code;
}

function getErrorText(err: unknown): string {
  if (!err) return '';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function isGeminiQuotaOrRateError(err: unknown): boolean {
  const status = getErrorStatus(err);
  if (status === 429) return true;
  const msg = getErrorText(err).toLowerCase();
  return (
    msg.includes('resource_exhausted') ||
    msg.includes('"code":429') ||
    msg.includes('quota') ||
    msg.includes('rate-limits') ||
    msg.includes('too many requests')
  );
}

function isGeminiTransientError(err: unknown): boolean {
  const status = getErrorStatus(err);
  if (status === 500 || status === 502 || status === 503 || status === 504) return true;
  const msg = getErrorText(err).toLowerCase();
  return (
    msg.includes('unavailable') ||
    msg.includes('overloaded') ||
    msg.includes('deadline_exceeded') ||
    msg.includes('"status":"internal"')
  );
}

function isGeminiModelUnavailableError(err: unknown): boolean {
  const status = getErrorStatus(err);
  if (status === 404) return true;
  const msg = getErrorText(err).toLowerCase();
  return (
    msg.includes('not_found') ||
    msg.includes('is not found') ||
    msg.includes('not supported for generatecontent')
  );
}

async function generateContentWithFallback(
  ai: GoogleGenAI,
  request: Omit<Parameters<GoogleGenAI['models']['generateContent']>[0], 'model'>,
  preferredOrder: string[] = [PRIMARY_GEMINI_MODEL, LITE_GEMINI_MODEL]
) {
  const now = Date.now();
  const available = preferredOrder.filter((m) => (modelCooldownUntil.get(m) ?? 0) <= now);

  if (available.length === 0) {
    throw lastQuotaError ?? new Error('RESOURCE_EXHAUSTED: Daily free-tier Gemini API quota exceeded.');
  }

  let quotaError: unknown = null;
  let lastError: unknown = null;

  for (const model of available) {
    try {
      const result = await ai.models.generateContent({
        ...request,
        model,
      });
      modelCooldownUntil.delete(model);
      return result;
    } catch (err) {
      lastError = err;
      if (isGeminiQuotaOrRateError(err)) {
        quotaError = err;
        lastQuotaError = err;
        modelCooldownUntil.set(model, Date.now() + QUOTA_COOLDOWN_MS);
        continue;
      }
      if (isGeminiModelUnavailableError(err)) {
        modelCooldownUntil.set(model, Date.now() + MODEL_UNAVAILABLE_COOLDOWN_MS);
        continue;
      }
      if (isGeminiTransientError(err)) {
        continue;
      }
      continue;
    }
  }

  throw quotaError ?? lastError;
}

function mapWmoCodeToCondition(code: number): { text: string; type: string } {
  if (code === 0) return { text: 'Clear Sky', type: 'CLEAR' };
  if (code <= 2) return { text: 'Partly Cloudy', type: 'PARTLY_CLOUDY' };
  if (code === 3) return { text: 'Overcast', type: 'CLOUDY' };
  if (code >= 45 && code <= 48) return { text: 'Foggy', type: 'FOG' };
  if (code >= 51 && code <= 57) return { text: 'Light Drizzle', type: 'LIGHT_RAIN' };
  if (code >= 61 && code <= 67) return { text: 'Rain', type: 'RAIN' };
  if (code >= 80 && code <= 82) return { text: 'Rain Showers', type: 'RAIN_SHOWERS' };
  if (code >= 95) return { text: 'Thunderstorm', type: 'THUNDERSTORM' };
  return { text: 'Partly Cloudy', type: 'PARTLY_CLOUDY' };
}

function formatShortDateLabel(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', timeZone: 'UTC' });
}

function formatWeekdayLabel(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'UTC' });
}

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

interface FarmPayload {
  state?: string;
  city?: string;
  latitude?: string;
  longitude?: string;
  farmSize?: string;
  farmSizeUnit?: string;
  crop?: string;
  season?: string;
  lastYearYield?: string;
}

interface HistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

function buildFarmPromptContext(farm?: FarmPayload): string {
  if (!farm) return 'No farm profile saved yet.';
  const parts: string[] = [];
  if (farm.city || farm.state) {
    parts.push(`Location: ${[farm.city, farm.state].filter(Boolean).join(', ')}`);
  }
  if (farm.latitude && farm.longitude) {
    parts.push(`Coordinates: ${farm.latitude}, ${farm.longitude}`);
  }
  if (farm.crop) parts.push(`Primary Crop: ${farm.crop}`);
  if (farm.farmSize) parts.push(`Farm Size: ${farm.farmSize} ${farm.farmSizeUnit || 'Acres'}`);
  if (farm.season) parts.push(`Season: ${farm.season}`);
  if (farm.lastYearYield) parts.push(`Last Year Yield Value: INR ${farm.lastYearYield}`);
  return parts.length > 0 ? parts.join(' | ') : 'No farm profile saved yet.';
}

async function resolveCoordinates(
  city: string,
  state: string,
  rawLat: string,
  rawLng: string,
  mapsKey: string | null
): Promise<{
  latitude: number;
  longitude: number;
  locationLabel: string;
  quotaExceeded: boolean;
}> {
  const parsedLat = Number(rawLat);
  const parsedLng = Number(rawLng);
  const label = [city, state].filter(Boolean).join(', ') || 'Farm Location';

  if (
    rawLat.trim() !== '' &&
    rawLng.trim() !== '' &&
    Number.isFinite(parsedLat) &&
    Number.isFinite(parsedLng) &&
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    parsedLng >= -180 &&
    parsedLng <= 180
  ) {
    return {
      latitude: parsedLat,
      longitude: parsedLng,
      locationLabel: label,
      quotaExceeded: false,
    };
  }

  let quotaExceeded = false;
  const queryAddress = [city, state, 'India'].filter(Boolean).join(', ');

  // 1. Primary: Google Maps Platform Geocoding API v4 (server-side proxy avoids CORS CF1)
  if (mapsKey && queryAddress) {
    try {
      const encodedAddress = encodeURIComponent(queryAddress);
      const geoUrl = `https://geocode.googleapis.com/v4/geocode/address/${encodedAddress}?regionCode=in`;
      const geoRes = await fetch(geoUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': mapsKey,
          'X-Goog-FieldMask': 'results.placeId,results.location,results.formattedAddress',
          'X-Goog-Maps-Solution-ID': GMP_SOLUTION_ID,
        },
      });
      const geoJson = await geoRes.json().catch(() => ({}));
      if (isQuotaExhaustedResponse(geoRes.status, geoJson)) {
        quotaExceeded = true;
      } else if (geoRes.ok && Array.isArray(geoJson?.results) && geoJson.results[0]?.location) {
        const loc = geoJson.results[0].location;
        return {
          latitude: Number(loc.latitude),
          longitude: Number(loc.longitude),
          locationLabel: label || geoJson.results[0].formattedAddress || queryAddress,
          quotaExceeded: false,
        };
      }
    } catch {
      // Fall through to open geocoder / baseline lookup
    }
  }

  // 2. Open-Meteo Geocoding fallback (free, no key needed)
  if (city || state) {
    try {
      const searchName = encodeURIComponent(city || state);
      const omGeoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchName}&count=5&language=en&format=json&countryCode=IN`
      );
      if (omGeoRes.ok) {
        const omJson = (await omGeoRes.json()) as {
          results?: Array<{
            latitude: number;
            longitude: number;
            name: string;
            admin1?: string;
          }>;
        };
        const match =
          omJson.results?.find(
            (r) =>
              state &&
              r.admin1 &&
              r.admin1.toLowerCase().includes(state.toLowerCase())
          ) ?? omJson.results?.[0];
        if (match) {
          return {
            latitude: match.latitude,
            longitude: match.longitude,
            locationLabel: label,
            quotaExceeded,
          };
        }
      }
    } catch {
      // Fall through to static regional centroid
    }
  }

  // 3. Regional Indian city/state centroid fallback
  const cityKey = city.trim().toLowerCase();
  const stateKey = state.trim().toLowerCase();
  const fallback =
    INDIAN_CITY_COORDS[cityKey] ??
    INDIAN_CITY_COORDS[stateKey] ?? { lat: 20.932, lng: 77.7523 };

  return {
    latitude: fallback.lat,
    longitude: fallback.lng,
    locationLabel: label,
    quotaExceeded,
  };
}

function buildIllustrativeHistory30d(baseTempC: number): Array<{
  date: string;
  label: string;
  tempMaxC: number;
  tempMinC: number;
  tempAvgC: number;
  rainfallMm: number;
  humidityPct: number;
}> {
  const days = [];
  const today = new Date();
  for (let i = 30; i >= 1; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    const iso = formatIsoDate(d);
    const wave = Math.sin(i * 0.45) * 2.1;
    const maxC = Number((baseTempC + 3.2 + wave).toFixed(1));
    const minC = Number((baseTempC - 5.4 + wave * 0.6).toFixed(1));
    const rain = i % 6 === 0 ? Number((4.5 + (i % 4) * 3.1).toFixed(1)) : 0;
    const hum = Math.min(92, Math.max(38, Math.round(58 + (rain > 0 ? 18 : 0) + Math.cos(i * 0.4) * 8)));
    days.push({
      date: iso,
      label: formatShortDateLabel(iso),
      tempMaxC: maxC,
      tempMinC: minC,
      tempAvgC: Number(((maxC + minC) / 2).toFixed(1)),
      rainfallMm: rain,
      humidityPct: hum,
    });
  }
  return days;
}

const DEFAULT_CROPSENSE_BACKEND_URL = 'https://cropsense-backend-rx8a.onrender.com';
const MAX_MULTIPART_PROXY_BYTES = 36 * 1024 * 1024; // Up to 4 x 8 MiB images + form fields
const BACKEND_PROXY_TIMEOUT_MS = 180_000;

function getCropSenseBackendBaseUrl(): string {
  const raw = (process.env.CROPSENSE_BACKEND_URL || DEFAULT_CROPSENSE_BACKEND_URL).trim();
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return DEFAULT_CROPSENSE_BACKEND_URL;
    }
    return parsed.origin + parsed.pathname.replace(/\/+$/, '');
  } catch {
    return DEFAULT_CROPSENSE_BACKEND_URL;
  }
}

function readRawRequestBody(req: express.Request, maxBytes: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    let settled = false;

    req.on('data', (chunk: Buffer | string) => {
      if (settled) return;
      const buf = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
      total += buf.length;
      if (total > maxBytes) {
        settled = true;
        const err = new Error('PAYLOAD_TOO_LARGE');
        reject(err);
        req.resume();
        return;
      }
      chunks.push(buf);
    });

    req.on('end', () => {
      if (settled) return;
      settled = true;
      resolve(Buffer.concat(chunks));
    });

    req.on('error', (err) => {
      if (settled) return;
      settled = true;
      reject(err);
    });
  });
}

async function forwardBackendResponse(
  upstreamRes: Response,
  res: express.Response
): Promise<void> {
  const rawText = await upstreamRes.text();
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    parsed = null;
  }

  if (parsed !== null) {
    res.status(upstreamRes.status).json(parsed);
    return;
  }

  if (upstreamRes.ok) {
    res.status(502).json({
      detail: 'Upstream CropSense backend returned an unexpected non-JSON response.',
    });
    return;
  }

  const snippet = rawText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
  res.status(upstreamRes.status).json({
    detail: snippet || `Upstream CropSense backend returned HTTP ${upstreamRes.status}.`,
  });
}

async function createServer() {
  const app = express();
  const backendBaseUrl = getCropSenseBackendBaseUrl();

  // Same-origin proxy for CropSense FastAPI multipart/form-data endpoints
  // Mounted before express.json() so raw multipart streams and boundaries remain intact.
  const proxyMultipartBackendRoute = (upstreamPath: '/chatbot/main' | '/health/monitoring') => {
    return async (req: express.Request, res: express.Response) => {
      const contentType = req.headers['content-type'] || '';
      if (!contentType.toLowerCase().includes('multipart/form-data')) {
        res.status(400).json({
          detail: 'Expected multipart/form-data request body.',
        });
        return;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), BACKEND_PROXY_TIMEOUT_MS);
      res.on('close', () => {
        if (!res.writableEnded) {
          controller.abort();
        }
      });

      try {
        const bodyBuffer = await readRawRequestBody(req, MAX_MULTIPART_PROXY_BYTES);
        const upstreamRes = await fetch(`${backendBaseUrl}${upstreamPath}`, {
          method: 'POST',
          headers: {
            'Content-Type': contentType,
            Accept: 'application/json',
          },
          body: new Uint8Array(bodyBuffer),
          signal: controller.signal,
        });
        await forwardBackendResponse(upstreamRes, res);
      } catch (err: unknown) {
        if (err instanceof Error && err.message === 'PAYLOAD_TOO_LARGE') {
          res.status(413).json({
            detail: 'Uploaded images exceed the maximum request size limit. Please use smaller images.',
          });
          return;
        }
        if (err instanceof Error && err.name === 'AbortError') {
          if (!res.writableEnded) {
            res.status(504).json({
              detail: 'The CropSense backend took too long to respond (cold start or slow inference). Please try again.',
            });
          }
          return;
        }
        console.error(`CropSense backend proxy error (${upstreamPath}):`, err instanceof Error ? err.message : err);
        if (!res.writableEnded) {
          res.status(502).json({
            detail: 'Unable to reach the CropSense backend service right now. Please retry shortly.',
          });
        }
      } finally {
        clearTimeout(timeout);
      }
    };
  };

  app.post('/api/backend/chatbot/main', proxyMultipartBackendRoute('/chatbot/main'));
  app.post('/api/backend/health/monitoring', proxyMultipartBackendRoute('/health/monitoring'));

  app.use(express.json({ limit: '12mb' }));

  app.get('/api/backend/health', async (_req, res) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    try {
      const upstreamRes = await fetch(`${backendBaseUrl}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      await forwardBackendResponse(upstreamRes, res);
    } catch {
      res.status(502).json({ detail: 'Unable to reach CropSense backend /health endpoint.' });
    } finally {
      clearTimeout(timeout);
    }
  });

  app.get('/api/backend/health/gemma', async (_req, res) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    try {
      const upstreamRes = await fetch(`${backendBaseUrl}/health/gemma`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      await forwardBackendResponse(upstreamRes, res);
    } catch {
      res.status(502).json({ detail: 'Unable to reach CropSense backend /health/gemma endpoint.' });
    } finally {
      clearTimeout(timeout);
    }
  });

  app.post('/api/backend/loss/optimization', async (req, res) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), BACKEND_PROXY_TIMEOUT_MS);
    res.on('close', () => {
      if (!res.writableEnded) {
        controller.abort();
      }
    });

    try {
      const upstreamRes = await fetch(`${backendBaseUrl}/loss/optimization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(req.body ?? {}),
        signal: controller.signal,
      });
      await forwardBackendResponse(upstreamRes, res);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        if (!res.writableEnded) {
          res.status(504).json({
            detail: 'Loss optimization analysis timed out while contacting the CropSense backend. Please try again.',
          });
        }
        return;
      }
      console.error('CropSense backend proxy error (/loss/optimization):', err instanceof Error ? err.message : err);
      if (!res.writableEnded) {
        res.status(502).json({
          detail: 'Unable to reach the CropSense backend service right now. Please retry shortly.',
        });
      }
    } finally {
      clearTimeout(timeout);
    }
  });

  app.get('/api/health', (_req, res) => {
    const ai = getGeminiClient();
    const mapsKey = getGoogleMapsApiKey();
    res.json({
      status: 'ok',
      aiConfigured: ai !== null,
      mapsWeatherConfigured: mapsKey !== null,
      backendUrl: backendBaseUrl,
      provider: ai !== null ? 'gemini-4-hydrogen' : 'unconfigured',
    });
  });

  // Google Weather API + 30-day Historical Weather proxy
  app.get('/api/weather', async (req, res) => {
    const city = String(req.query.city ?? '').trim();
    const state = String(req.query.state ?? '').trim();
    const rawLat = String(req.query.lat ?? '').trim();
    const rawLng = String(req.query.lng ?? '').trim();

    if (!city && !state && (!rawLat || !rawLng)) {
      res.status(400).json({
        error: 'LOCATION_REQUIRED',
        message: 'Provide city/state or latitude/longitude to fetch weather data.',
      });
      return;
    }

    const mapsKey = getGoogleMapsApiKey();

    try {
      const coords = await resolveCoordinates(city, state, rawLat, rawLng, mapsKey);
      let quotaExceeded = coords.quotaExceeded;

      let currentProvider = 'Google Weather API';
      let isFallbackCurrent = false;
      let current: {
        conditionText: string;
        conditionType: string;
        temperatureC: number;
        feelsLikeC: number;
        humidityPct: number;
        rainfallMm: number;
        rainProbabilityPct: number;
        windKmh: number;
        isDaytime: boolean;
        observedAt: string;
      } | null = null;

      let forecast7d: Array<{
        date: string;
        dayLabel: string;
        conditionText: string;
        conditionType: string;
        tempMaxC: number;
        tempMinC: number;
        rainProbabilityPct: number;
        rainfallMm: number;
        humidityPct: number;
        windKmh: number;
      }> = [];

      // 1. Google Maps Platform Weather API (Current Conditions + 7-Day Daily Forecast)
      if (mapsKey) {
        try {
          const currentUrl = new URL('https://weather.googleapis.com/v1/currentConditions:lookup');
          currentUrl.searchParams.set('key', mapsKey);
          currentUrl.searchParams.set('location.latitude', String(coords.latitude));
          currentUrl.searchParams.set('location.longitude', String(coords.longitude));
          currentUrl.searchParams.set('unitsSystem', 'METRIC');

          const dailyUrl = new URL('https://weather.googleapis.com/v1/forecast/days:lookup');
          dailyUrl.searchParams.set('key', mapsKey);
          dailyUrl.searchParams.set('location.latitude', String(coords.latitude));
          dailyUrl.searchParams.set('location.longitude', String(coords.longitude));
          dailyUrl.searchParams.set('days', '7');
          dailyUrl.searchParams.set('pageSize', '7');
          dailyUrl.searchParams.set('unitsSystem', 'METRIC');

          const [currRes, dailyRes] = await Promise.all([
            fetch(currentUrl.toString(), {
              headers: { 'X-Goog-Maps-Solution-ID': GMP_SOLUTION_ID },
            }),
            fetch(dailyUrl.toString(), {
              headers: { 'X-Goog-Maps-Solution-ID': GMP_SOLUTION_ID },
            }),
          ]);

          const [currJson, dailyJson] = await Promise.all([
            currRes.json().catch(() => ({})),
            dailyRes.json().catch(() => ({})),
          ]);

          if (
            isQuotaExhaustedResponse(currRes.status, currJson) ||
            isQuotaExhaustedResponse(dailyRes.status, dailyJson)
          ) {
            quotaExceeded = true;
          }

          if (currRes.ok && currJson?.temperature?.degrees !== undefined) {
            current = {
              conditionText: currJson.weatherCondition?.description?.text ?? 'Clear',
              conditionType: currJson.weatherCondition?.type ?? 'CLEAR',
              temperatureC: Number(currJson.temperature.degrees),
              feelsLikeC: Number(
                currJson.feelsLikeTemperature?.degrees ?? currJson.temperature.degrees
              ),
              humidityPct: Number(currJson.relativeHumidity ?? 50),
              rainfallMm: Number(currJson.precipitation?.qpf?.quantity ?? 0),
              rainProbabilityPct: Number(currJson.precipitation?.probability?.percent ?? 0),
              windKmh: Number(currJson.wind?.speed?.value ?? 0),
              isDaytime: Boolean(currJson.isDaytime ?? true),
              observedAt: currJson.currentTime ?? new Date().toISOString(),
            };
          }

          if (dailyRes.ok && Array.isArray(dailyJson?.forecastDays)) {
            forecast7d = dailyJson.forecastDays.slice(0, 7).map(
              (day: {
                displayDate?: { year?: number; month?: number; day?: number };
                maxTemperature?: { degrees?: number };
                minTemperature?: { degrees?: number };
                daytimeForecast?: {
                  weatherCondition?: { description?: { text?: string }; type?: string };
                  precipitation?: {
                    probability?: { percent?: number };
                    qpf?: { quantity?: number };
                  };
                  relativeHumidity?: number;
                  wind?: { speed?: { value?: number } };
                };
              }) => {
                const y = day.displayDate?.year ?? new Date().getUTCFullYear();
                const m = String(day.displayDate?.month ?? 1).padStart(2, '0');
                const d = String(day.displayDate?.day ?? 1).padStart(2, '0');
                const iso = `${y}-${m}-${d}`;
                return {
                  date: iso,
                  dayLabel: formatWeekdayLabel(iso),
                  conditionText:
                    day.daytimeForecast?.weatherCondition?.description?.text ?? 'Partly Cloudy',
                  conditionType: day.daytimeForecast?.weatherCondition?.type ?? 'PARTLY_CLOUDY',
                  tempMaxC: Number(day.maxTemperature?.degrees ?? 30),
                  tempMinC: Number(day.minTemperature?.degrees ?? 20),
                  rainProbabilityPct: Number(
                    day.daytimeForecast?.precipitation?.probability?.percent ?? 0
                  ),
                  rainfallMm: Number(day.daytimeForecast?.precipitation?.qpf?.quantity ?? 0),
                  humidityPct: Number(day.daytimeForecast?.relativeHumidity ?? 55),
                  windKmh: Number(day.daytimeForecast?.wind?.speed?.value ?? 8),
                };
              }
            );
          }
        } catch (err) {
          console.error('Google Weather API fetch error:', err);
        }
      }

      if (quotaExceeded && !current) {
        res.status(429).json({
          error: 'RESOURCE_EXHAUSTED',
          quotaExceeded: true,
          message: 'Google Maps Platform Weather API quota reached.',
        });
        return;
      }

      // 2. Open-Meteo live fallback for current + 7-day forecast if Google Weather API did not return data
      if (!current || forecast7d.length === 0) {
        try {
          const omUrl = new URL('https://api.open-meteo.com/v1/forecast');
          omUrl.searchParams.set('latitude', String(coords.latitude));
          omUrl.searchParams.set('longitude', String(coords.longitude));
          omUrl.searchParams.set(
            'current',
            'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m'
          );
          omUrl.searchParams.set(
            'daily',
            'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,relative_humidity_2m_mean'
          );
          omUrl.searchParams.set('forecast_days', '7');
          omUrl.searchParams.set('timezone', 'auto');

          const omRes = await fetch(omUrl.toString());
          if (omRes.ok) {
            const omData = (await omRes.json()) as {
              current?: {
                time?: string;
                temperature_2m?: number;
                apparent_temperature?: number;
                relative_humidity_2m?: number;
                precipitation?: number;
                rain?: number;
                wind_speed_10m?: number;
                weather_code?: number;
                is_day?: number;
              };
              daily?: {
                time?: string[];
                weather_code?: number[];
                temperature_2m_max?: number[];
                temperature_2m_min?: number[];
                precipitation_sum?: number[];
                precipitation_probability_max?: number[];
                wind_speed_10m_max?: number[];
                relative_humidity_2m_mean?: number[];
              };
            };

            if (!current && omData.current) {
              const mapped = mapWmoCodeToCondition(Number(omData.current.weather_code ?? 1));
              currentProvider = 'Open-Meteo (Live Fallback)';
              isFallbackCurrent = true;
              current = {
                conditionText: mapped.text,
                conditionType: mapped.type,
                temperatureC: Number(omData.current.temperature_2m ?? 28),
                feelsLikeC: Number(
                  omData.current.apparent_temperature ?? omData.current.temperature_2m ?? 28
                ),
                humidityPct: Math.round(Number(omData.current.relative_humidity_2m ?? 55)),
                rainfallMm: Number(omData.current.precipitation ?? omData.current.rain ?? 0),
                rainProbabilityPct: Number(
                  omData.daily?.precipitation_probability_max?.[0] ?? 10
                ),
                windKmh: Number(omData.current.wind_speed_10m ?? 9),
                isDaytime: omData.current.is_day !== 0,
                observedAt: omData.current.time ?? new Date().toISOString(),
              };
            }

            if (forecast7d.length === 0 && Array.isArray(omData.daily?.time)) {
              forecast7d = omData.daily.time.slice(0, 7).map((isoDate, idx) => {
                const mapped = mapWmoCodeToCondition(
                  Number(omData.daily?.weather_code?.[idx] ?? 1)
                );
                return {
                  date: isoDate,
                  dayLabel: formatWeekdayLabel(isoDate),
                  conditionText: mapped.text,
                  conditionType: mapped.type,
                  tempMaxC: Number(omData.daily?.temperature_2m_max?.[idx] ?? 31),
                  tempMinC: Number(omData.daily?.temperature_2m_min?.[idx] ?? 20),
                  rainProbabilityPct: Math.round(
                    Number(omData.daily?.precipitation_probability_max?.[idx] ?? 10)
                  ),
                  rainfallMm: Number(omData.daily?.precipitation_sum?.[idx] ?? 0),
                  humidityPct: Math.round(
                    Number(omData.daily?.relative_humidity_2m_mean?.[idx] ?? 55)
                  ),
                  windKmh: Number(omData.daily?.wind_speed_10m_max?.[idx] ?? 10),
                };
              });
            }
          }
        } catch (err) {
          console.error('Open-Meteo forecast fallback error:', err);
        }
      }

      // 3. Past 30 Days Historical Weather (Open-Meteo Historical Archive API)
      let historicalProvider = 'Open-Meteo Historical Archive';
      let isFallbackHistorical = false;
      let history30d: Array<{
        date: string;
        label: string;
        tempMaxC: number;
        tempMinC: number;
        tempAvgC: number;
        rainfallMm: number;
        humidityPct: number;
      }> = [];

      try {
        const endDate = new Date();
        endDate.setUTCDate(endDate.getUTCDate() - 1);
        const startDate = new Date(endDate);
        startDate.setUTCDate(endDate.getUTCDate() - 29);

        const archiveUrl = new URL('https://archive-api.open-meteo.com/v1/archive');
        archiveUrl.searchParams.set('latitude', String(coords.latitude));
        archiveUrl.searchParams.set('longitude', String(coords.longitude));
        archiveUrl.searchParams.set('start_date', formatIsoDate(startDate));
        archiveUrl.searchParams.set('end_date', formatIsoDate(endDate));
        archiveUrl.searchParams.set(
          'daily',
          'temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,relative_humidity_2m_mean'
        );
        archiveUrl.searchParams.set('timezone', 'auto');

        const archRes = await fetch(archiveUrl.toString());
        if (archRes.ok) {
          const archData = (await archRes.json()) as {
            daily?: {
              time?: string[];
              temperature_2m_max?: Array<number | null>;
              temperature_2m_min?: Array<number | null>;
              temperature_2m_mean?: Array<number | null>;
              precipitation_sum?: Array<number | null>;
              relative_humidity_2m_mean?: Array<number | null>;
            };
          };
          if (Array.isArray(archData.daily?.time) && archData.daily.time.length > 0) {
            history30d = archData.daily.time.map((isoDate, idx) => {
              const maxC = Number(archData.daily?.temperature_2m_max?.[idx] ?? 31);
              const minC = Number(archData.daily?.temperature_2m_min?.[idx] ?? 19);
              const avgC = Number(
                archData.daily?.temperature_2m_mean?.[idx] ?? ((maxC + minC) / 2).toFixed(1)
              );
              return {
                date: isoDate,
                label: formatShortDateLabel(isoDate),
                tempMaxC: Number(maxC.toFixed(1)),
                tempMinC: Number(minC.toFixed(1)),
                tempAvgC: Number(avgC.toFixed(1)),
                rainfallMm: Number(Number(archData.daily?.precipitation_sum?.[idx] ?? 0).toFixed(1)),
                humidityPct: Math.round(
                  Number(archData.daily?.relative_humidity_2m_mean?.[idx] ?? 58)
                ),
              };
            });
          }
        }
      } catch (err) {
        console.error('Historical weather archive fetch error:', err);
      }

      // Honest resilience fallback only if external network is unreachable
      if (!current) {
        currentProvider = 'Regional Baseline (Offline Preview)';
        isFallbackCurrent = true;
        current = {
          conditionText: 'Partly Cloudy',
          conditionType: 'PARTLY_CLOUDY',
          temperatureC: 29.5,
          feelsLikeC: 30.8,
          humidityPct: 58,
          rainfallMm: 0.4,
          rainProbabilityPct: 20,
          windKmh: 11,
          isDaytime: true,
          observedAt: new Date().toISOString(),
        };
      }

      if (forecast7d.length === 0) {
        const today = new Date();
        forecast7d = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today);
          d.setUTCDate(today.getUTCDate() + i);
          const iso = formatIsoDate(d);
          return {
            date: iso,
            dayLabel: formatWeekdayLabel(iso),
            conditionText: i % 3 === 0 ? 'Light Rain' : 'Partly Cloudy',
            conditionType: i % 3 === 0 ? 'LIGHT_RAIN' : 'PARTLY_CLOUDY',
            tempMaxC: Number((current!.temperatureC + 3 - (i % 2)).toFixed(1)),
            tempMinC: Number((current!.temperatureC - 7 + (i % 2)).toFixed(1)),
            rainProbabilityPct: i % 3 === 0 ? 45 : 15,
            rainfallMm: i % 3 === 0 ? 4.2 : 0,
            humidityPct: 56 + (i % 3) * 5,
            windKmh: 9 + (i % 4),
          };
        });
      }

      if (history30d.length === 0) {
        historicalProvider = 'Regional Baseline (Illustrative Preview)';
        isFallbackHistorical = true;
        history30d = buildIllustrativeHistory30d(current.temperatureC);
      }

      res.json({
        locationLabel: coords.locationLabel,
        latitude: Number(coords.latitude.toFixed(4)),
        longitude: Number(coords.longitude.toFixed(4)),
        currentProvider,
        historicalProvider,
        isFallbackCurrent,
        isFallbackHistorical,
        quotaExceeded,
        current,
        history30d,
        forecast7d,
        fetchedAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected weather error';
      console.error('CropSense weather proxy error:', message);
      res.status(500).json({
        error: 'WEATHER_FETCH_FAILED',
        message: 'Unable to retrieve weather data for this location right now.',
      });
    }
  });

  function parseFarmDetailsFallback(transcript: string): Record<string, string | undefined> {
    const lower = transcript.toLowerCase();
    const extracted: Record<string, string | undefined> = {};

    for (const state of VALID_STATES) {
      if (lower.includes(state.toLowerCase())) {
        extracted.state = state;
        break;
      }
    }

    const stateCitiesMap: Record<string, string[]> = {
      Maharashtra: ['Amravati', 'Nagpur', 'Nashik', 'Pune', 'Akola', 'Yavatmal', 'Jalgaon', 'Kolhapur', 'Solapur', 'Aurangabad'],
      Karnataka: ['Bengaluru Rural', 'Belagavi', 'Dharwad', 'Kalaburagi', 'Mysuru', 'Mandya', 'Raichur'],
      'Madhya Pradesh': ['Indore', 'Bhopal', 'Ujjain', 'Jabalpur', 'Sehore'],
      Punjab: ['Ludhiana', 'Amritsar', 'Patiala', 'Bathinda'],
      Haryana: ['Karnal', 'Hisar', 'Rohtak', 'Sirsa'],
      Gujarat: ['Rajkot', 'Surat', 'Anand', 'Junagadh'],
      'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Meerut', 'Varanasi'],
      Rajasthan: ['Jaipur', 'Kota', 'Jodhpur', 'Udaipur'],
      'Andhra Pradesh': ['Guntur', 'Krishna', 'Kurnool', 'Anantapur'],
      Telangana: ['Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
      'Tamil Nadu': ['Thanjavur', 'Coimbatore', 'Madurai', 'Salem'],
      'West Bengal': ['Bardhaman', 'Hooghly', 'Nadia', 'Murshidabad'],
      Bihar: ['Patna', 'Muzaffarpur', 'Bhagalpur', 'Gaya'],
    };

    for (const [state, cities] of Object.entries(stateCitiesMap)) {
      for (const city of cities) {
        if (lower.includes(city.toLowerCase())) {
          extracted.city = city;
          if (!extracted.state) extracted.state = state;
          break;
        }
      }
      if (extracted.city) break;
    }

    const cropAliases: Record<string, string> = {
      cotton: 'Cotton', kapas: 'Cotton', 'कपास': 'Cotton', 'कापूस': 'Cotton', 'ಹತ್ತಿ': 'Cotton',
      wheat: 'Wheat', gehu: 'Wheat', 'गेहूं': 'Wheat', 'गहू': 'Wheat', 'ಗೋಧಿ': 'Wheat',
      rice: 'Rice', paddy: 'Rice', dhan: 'Rice', 'धान': 'Rice', 'भात': 'Rice', 'ಭತ್ತ': 'Rice',
      soybean: 'Soybean', 'सोयाबीन': 'Soybean', 'ಸೋಯಾಬೀನ್': 'Soybean',
      maize: 'Maize', corn: 'Maize', 'मक्का': 'Maize', 'मका': 'Maize',
      sugarcane: 'Sugarcane', ganna: 'Sugarcane', 'गन्ना': 'Sugarcane', 'ऊस': 'Sugarcane', 'ಕಬ್ಬು': 'Sugarcane',
      tomato: 'Tomato', 'टमाटर': 'Tomato',
      onion: 'Onion', pyaz: 'Onion', kanda: 'Onion', 'प्याज': 'Onion', 'कांदा': 'Onion', 'ಈರುಳ್ಳಿ': 'Onion',
    };
    for (const [alias, canonical] of Object.entries(cropAliases)) {
      if (lower.includes(alias)) {
        extracted.crop = canonical;
        break;
      }
    }

    if (lower.includes('kharif') || lower.includes('खरीफ') || lower.includes('खरीप') || lower.includes('ಖರೀಫ್')) {
      extracted.season = 'Kharif';
    } else if (lower.includes('rabi') || lower.includes('रबी') || lower.includes('रब्बी') || lower.includes('ರಬಿ')) {
      extracted.season = 'Rabi';
    } else if (lower.includes('zaid') || lower.includes('जायद') || lower.includes('उन्हाळी')) {
      extracted.season = 'Zaid';
    }

    const sizeMatch = lower.match(/(\d+(?:\.\d+)?)\s*(acres?|acre|एकड़|एकर|ಎಕರೆ|hectares?|hectare|हेक्टेयर|ಹೆಕ್ಟೇರ್|sq|square)/i);
    if (sizeMatch) {
      extracted.farmSize = sizeMatch[1];
      const unitToken = sizeMatch[2].toLowerCase();
      if (unitToken.includes('hect') || unitToken.includes('हेक्ट') || unitToken.includes('ಹೆಕ್ಟ')) {
        extracted.farmSizeUnit = 'Hectares';
      } else if (unitToken.includes('sq')) {
        extracted.farmSizeUnit = 'Square Metres';
      } else {
        extracted.farmSizeUnit = 'Acres';
      }
    }

    const lakhMatch = lower.match(/(\d+(?:\.\d+)?)\s*(lakh|lakhs|लाख|ಲಕ್ಷ)/i);
    if (lakhMatch) {
      extracted.lastYearYield = String(Math.round(Number(lakhMatch[1]) * 100000));
    } else {
      const rupeeMatch = lower.match(/(?:rs\.?|₹|rupees?|रुपये|रुपए|ರೂಪಾಯಿ)?\s*(\d{4,7})\s*(?:rs\.?|₹|rupees?|रुपये|रुपए|ರೂಪಾಯಿ)?/i);
      if (rupeeMatch && Number(rupeeMatch[1]) >= 1000) {
        extracted.lastYearYield = rupeeMatch[1];
      }
    }

    return extracted;
  }

  // Multilingual Voice Auto-Fill extraction endpoint
  app.post('/api/ai/extract-farm-details', async (req, res) => {
    const { transcript = '', language = 'en' } = req.body as {
      transcript?: string;
      language?: string;
    };

    const cleaned = transcript.trim();
    if (!cleaned) {
      res.status(400).json({ error: 'EMPTY_TRANSCRIPT', message: 'Voice transcript is empty.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({ extracted: parseFarmDetailsFallback(cleaned), isFallback: true });
      return;
    }

    try {
      const targetLanguage = LANGUAGE_NAMES[language] || 'English';

      const response = await generateContentWithFallback(
        ai,
        {
          contents: [
            `Extract Indian farm details from this spoken farmer statement (spoken in ${targetLanguage} or mixed language):`,
            `"${cleaned}"`,
            `Rules:`,
            `- Match "state" ONLY to one of: ${VALID_STATES.join(', ')} (or empty string if not mentioned).`,
            `- Extract "city" (district/city name in English spelling, e.g. Amravati, Dharwad, Pune, or empty string).`,
            `- Extract numeric "farmSize" as digits only (e.g., "5" or "2.5"), or empty string.`,
            `- Match "farmSizeUnit" ONLY to one of: ${VALID_UNITS.join(', ')} (default "" if not mentioned; map ekad/acre -> Acres, hectare -> Hectares, sq m -> Square Metres).`,
            `- Match "crop" ONLY to one of: ${VALID_CROPS.join(', ')} (map kapas/ಹತ್ತಿ -> Cotton, gehu/ಗೋಧಿ -> Wheat, dhan/rice/ಭತ್ತ -> Rice, ganna/ಕಬ್ಬು -> Sugarcane, makka/ಮೆಕ್ಕೆಜೋಳ -> Maize, tamatar -> Tomato, pyaz/kanda/ಈರುಳ್ಳಿ -> Onion, soybean -> Soybean).`,
            `- Match "season" ONLY to one of: ${VALID_SEASONS.join(', ')} (or empty string).`,
            `- Extract "lastYearYield" as plain numeric INR digits (convert lakh/हजार/लाख appropriately, e.g. 1.5 lakh -> "150000"), or empty string.`,
          ].join('\n'),
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                state: { type: Type.STRING },
                city: { type: Type.STRING },
                farmSize: { type: Type.STRING },
                farmSizeUnit: { type: Type.STRING },
                crop: { type: Type.STRING },
                season: { type: Type.STRING },
                lastYearYield: { type: Type.STRING },
              },
              required: ['state', 'city', 'farmSize', 'farmSizeUnit', 'crop', 'season', 'lastYearYield'],
            },
          },
        },
        [LITE_GEMINI_MODEL, PRIMARY_GEMINI_MODEL]
      );

      const parsed = JSON.parse((response.text ?? '{}').trim()) as Record<string, string>;

      res.json({
        extracted: {
          state: VALID_STATES.includes(parsed.state) ? parsed.state : undefined,
          city: parsed.city?.trim() || undefined,
          farmSize:
            parsed.farmSize && Number.isFinite(Number(parsed.farmSize)) && Number(parsed.farmSize) > 0
              ? String(parsed.farmSize).trim()
              : undefined,
          farmSizeUnit: VALID_UNITS.includes(parsed.farmSizeUnit) ? parsed.farmSizeUnit : undefined,
          crop: VALID_CROPS.includes(parsed.crop) ? parsed.crop : undefined,
          season: VALID_SEASONS.includes(parsed.season) ? parsed.season : undefined,
          lastYearYield:
            parsed.lastYearYield && /^\d+$/.test(parsed.lastYearYield.replace(/[^\d]/g, ''))
              ? parsed.lastYearYield.replace(/[^\d]/g, '')
              : undefined,
        },
      });
    } catch (err: unknown) {
      if (!isGeminiQuotaOrRateError(err)) {
        const message = err instanceof Error ? err.message : 'Voice extraction failed';
        console.warn('Voice extraction Gemini fallback triggered:', message);
      }
      res.json({
        extracted: parseFarmDetailsFallback(cleaned),
        isFallback: true,
      });
    }
  });

  // Weekly Crop Health Monitoring multimodal analysis endpoint
  app.post('/api/ai/weekly-health', async (req, res) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'AI_NOT_CONFIGURED',
        message: 'Gemini API key is not configured on the server.',
      });
      return;
    }

    try {
      const {
        imageBase64,
        imageMimeType,
        date,
        notes = '',
        farmDetails,
        weatherSummary = '',
        previousEntries = [],
        language = 'en',
      } = req.body as {
        imageBase64?: string;
        imageMimeType?: string;
        date?: string;
        notes?: string;
        farmDetails?: FarmPayload;
        weatherSummary?: string;
        previousEntries?: Array<{ date: string; healthScore: number; diseaseOutbreakProbability: number; diseaseSeverity: string }>;
        language?: string;
      };

      if (!imageBase64 || !imageMimeType) {
        res.status(400).json({ error: 'IMAGE_REQUIRED', message: 'Please upload a weekly crop/plant photo.' });
        return;
      }

      const targetLanguage = LANGUAGE_NAMES[language] || 'English';
      const farmContext = buildFarmPromptContext(farmDetails);
      const historyLine =
        previousEntries.length > 0
          ? previousEntries
              .slice(-4)
              .map(
                (e) =>
                  `${e.date}: Health ${e.healthScore}/100, Outbreak ${e.diseaseOutbreakProbability}%, Severity ${e.diseaseSeverity}`
              )
              .join(' ; ')
          : 'First weekly entry';

      const promptText = [
        `You are CropSense's time-series crop health monitoring specialist for Indian farmers.`,
        `Respond with all descriptive text strictly in ${targetLanguage}, while keeping enum fields (diseaseSeverity, irrigationStatus, stressLevel) in exact English enum tokens.`,
        `Farm Profile: ${farmContext}.`,
        weatherSummary ? `Current Weather Context: ${weatherSummary}.` : '',
        `Observation Date: ${date || new Date().toISOString().slice(0, 10)}.`,
        `Previous Weekly Trend: ${historyLine}.`,
        notes ? `Farmer Field Notes: ${notes}.` : '',
        `Analyze this weekly farm/plant image carefully. Assess overall crop health score (0-100), disease outbreak probability (0-100), diseaseSeverity (Low|Moderate|High|Critical), irrigationStatus (Insufficient|Optimal|Excessive), stressLevel (green|yellow|red), a short stressSummary, a clear explanation of what you see and how it compares to prior weeks, and 3-4 practical recommendedActions.`,
        `Be scientifically honest: if the photo is not a plant or is blurry, keep scores conservative and explain clearly in the explanation.`,
      ]
        .filter(Boolean)
        .join('\n');

      const response = await generateContentWithFallback(ai, {
        contents: {
          parts: [
            { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
            { text: promptText },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              healthScore: { type: Type.INTEGER },
              diseaseOutbreakProbability: { type: Type.INTEGER },
              diseaseSeverity: { type: Type.STRING },
              irrigationStatus: { type: Type.STRING },
              stressLevel: { type: Type.STRING },
              stressSummary: { type: Type.STRING },
              explanation: { type: Type.STRING },
              recommendedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'healthScore',
              'diseaseOutbreakProbability',
              'diseaseSeverity',
              'irrigationStatus',
              'stressLevel',
              'stressSummary',
              'explanation',
              'recommendedActions',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      const validSeverities = ['Low', 'Moderate', 'High', 'Critical'];
      const validIrrigation = ['Insufficient', 'Optimal', 'Excessive'];
      const validStress = ['green', 'yellow', 'red'];

      res.json({
        analysis: {
          healthScore: Math.max(0, Math.min(100, Math.round(Number(parsed.healthScore ?? 72)))),
          diseaseOutbreakProbability: Math.max(
            0,
            Math.min(100, Math.round(Number(parsed.diseaseOutbreakProbability ?? 25)))
          ),
          diseaseSeverity: validSeverities.includes(parsed.diseaseSeverity)
            ? parsed.diseaseSeverity
            : 'Moderate',
          irrigationStatus: validIrrigation.includes(parsed.irrigationStatus)
            ? parsed.irrigationStatus
            : 'Optimal',
          stressLevel: validStress.includes(parsed.stressLevel) ? parsed.stressLevel : 'yellow',
          stressSummary: String(parsed.stressSummary ?? 'Weekly assessment completed'),
          explanation: String(parsed.explanation ?? ''),
          recommendedActions: Array.isArray(parsed.recommendedActions)
            ? parsed.recommendedActions.map(String).slice(0, 5)
            : [],
        },
      });
    } catch (err: unknown) {
      if (isGeminiQuotaOrRateError(err)) {
        res.status(429).json({
          error: 'QUOTA_EXHAUSTED',
          message:
            'Daily free-tier Gemini API quota has been reached. Select a billing-enabled API key in Settings > Secrets to increase your quota, or try again after the limit resets.',
        });
        return;
      }
      const message = err instanceof Error ? err.message : 'Weekly health analysis error';
      console.error('Weekly health endpoint error:', message);
      res.status(500).json({
        error: 'WEEKLY_HEALTH_FAILED',
        message: 'Unable to analyze the weekly crop image right now. Please try again.',
      });
    }
  });

  app.post('/api/ai/chat', async (req, res) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'AI_NOT_CONFIGURED',
        message: 'Gemini API key is not configured on the server.',
      });
      return;
    }

    try {
      const {
        message = '',
        history = [],
        farmDetails,
        language = 'en',
        imageBase64,
        imageMimeType,
        assistantMode = 'general',
        weatherSummary = '',
      } = req.body as {
        message?: string;
        history?: HistoryItem[];
        farmDetails?: FarmPayload;
        language?: string;
        imageBase64?: string;
        imageMimeType?: string;
        assistantMode?: 'general' | 'financial_assistance';
        weatherSummary?: string;
      };

      const targetLanguage = LANGUAGE_NAMES[language] || 'English';
      const farmContext = buildFarmPromptContext(farmDetails);

      if (imageBase64 && imageMimeType) {
        const promptText = [
          `You are CropSense, an expert Indian agronomy and plant pathology assistant.`,
          `Respond strictly in ${targetLanguage}.`,
          `Farm Context: ${farmContext}.`,
          weatherSummary ? `Local Weather Context: ${weatherSummary}.` : '',
          `Farmer note: ${message.trim() || 'Please inspect this plant image for possible diseases, severity, causes, preventive measures, and treatment advice.'}`,
          `Carefully analyze the uploaded plant/leaf image. Be scientifically honest: if the image is unclear or does not clearly show a plant disease, state low confidence and explain what is visible.`,
          `Always include a preliminary diagnosis disclaimer reminding the farmer to verify with a local Krishi Vigyan Kendra (KVK) or agronomist before applying chemical pesticides.`,
        ]
          .filter(Boolean)
          .join('\n');

        const response = await generateContentWithFallback(ai, {
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: imageMimeType,
                  data: imageBase64,
                },
              },
              { text: promptText },
            ],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                reply: {
                  type: Type.STRING,
                  description: `Helpful conversational summary in ${targetLanguage} explaining the visual findings.`,
                },
                diseaseAnalysis: {
                  type: Type.OBJECT,
                  properties: {
                    diseaseName: { type: Type.STRING },
                    confidence: { type: Type.INTEGER },
                    severity: { type: Type.STRING },
                    riskLevel: { type: Type.STRING },
                    symptoms: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    causes: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    preventiveMeasures: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    suggestedTreatment: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    whenToSeekExpert: { type: Type.STRING },
                    disclaimer: { type: Type.STRING },
                  },
                  required: [
                    'diseaseName',
                    'confidence',
                    'severity',
                    'riskLevel',
                    'symptoms',
                    'causes',
                    'preventiveMeasures',
                    'suggestedTreatment',
                    'whenToSeekExpert',
                    'disclaimer',
                  ],
                },
              },
              required: ['reply', 'diseaseAnalysis'],
            },
          },
        });

        const rawJson = (response.text ?? '{}').trim();
        const parsed = JSON.parse(rawJson);

        const validSeverities = ['Low', 'Moderate', 'High', 'Critical'];
        const normalizedSeverity = validSeverities.includes(parsed.diseaseAnalysis?.severity)
          ? parsed.diseaseAnalysis.severity
          : 'Moderate';

        res.json({
          reply: parsed.reply || '',
          diseaseAnalysis: {
            ...parsed.diseaseAnalysis,
            severity: normalizedSeverity,
            confidence: Math.max(0, Math.min(100, Number(parsed.diseaseAnalysis?.confidence ?? 0))),
            isDemo: false,
          },
        });
        return;
      }

      const trimmedMessage = message.trim();
      if (!trimmedMessage) {
        res.status(400).json({ error: 'EMPTY_MESSAGE', message: 'Please enter a message or upload an image.' });
        return;
      }

      const recentHistory = Array.isArray(history) ? history.slice(-8) : [];
      const historyTranscript = recentHistory
        .map((item) => `${item.role === 'user' ? 'Farmer' : 'CropSense'}: ${item.content}`)
        .join('\n');

      const financialGuidance =
        assistantMode === 'financial_assistance'
          ? `ACTIVE CONTEXT: The farmer just opened you from the Information & Financial Assistance dashboard. Prioritize matching real Indian agricultural insurance (PMFBY, RWBCIS), central & state schemes (PM-KISAN, KCC, MahaDBT, Karnataka Raita Mitra / FRUITS), subsidies (PMKSY Per Drop More Crop, SMAM/CRM, PKVY), NGO grants (WOTR, BAIF), and SDRF calamity compensation to their saved farm profile (${farmContext}). Always list clear eligibility criteria, required documents (Aadhaar, 7/12 or RTC land record, bank passbook), and practical next steps.`
          : '';

      const systemInstruction = [
        `You are CropSense, a calm, authoritative Indian precision-agriculture, crop health, and farmer financial-assistance advisor.`,
        `Always respond in ${targetLanguage}.`,
        `Use the farmer's saved profile naturally when giving advice: ${farmContext}.`,
        weatherSummary ? `Current local weather context: ${weatherSummary}.` : '',
        financialGuidance,
        `Provide clear, practical, structured guidance (short paragraphs or bullet points, no markdown code blocks).`,
        `Never invent guaranteed clinical diagnoses or fake deadlines. Remind farmers to verify pesticide sprays with local agricultural officers/KVK and verify official scheme deadlines on government portals.`,
      ]
        .filter(Boolean)
        .join(' ');

      const fullPrompt = historyTranscript
        ? `Previous conversation:\n${historyTranscript}\n\nFarmer: ${trimmedMessage}`
        : trimmedMessage;

      const response = await generateContentWithFallback(ai, {
        contents: fullPrompt,
        config: {
          systemInstruction,
        },
      });

      res.json({
        reply: (response.text ?? '').trim(),
      });
    } catch (err: unknown) {
      if (isGeminiQuotaOrRateError(err)) {
        res.status(429).json({
          error: 'QUOTA_EXHAUSTED',
          message:
            'Daily free-tier Gemini API quota has been reached. Select a billing-enabled API key in Settings > Secrets to increase your quota, or try again after the limit resets.',
        });
        return;
      }
      const message = err instanceof Error ? err.message : 'Unexpected AI service error';
      console.error('CropSense AI endpoint error:', message);
      res.status(500).json({
        error: 'AI_REQUEST_FAILED',
        message: 'Unable to complete the AI request right now. Please try again shortly.',
      });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CropSense server listening on http://localhost:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start CropSense server:', err);
  process.exit(1);
});
