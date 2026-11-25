import type {
  AreaUnit,
  BackendAreaUnit,
  BackendLanguage,
  BackendRisk,
  BackendSeverity,
  ChatbotApiResponse,
  ChatbotDiagnosisResponse,
  ChatbotTextResponse,
  DiseaseAnalysisResult,
  DiseaseSeverity,
  FarmDetails,
  LanguageCode,
  LocalRevenueGapSummary,
  LossOptimizationRequest,
} from '../types/cropsense';

const SQ_METRES_PER_ACRE = 4046.8564224;
const MAX_INR_VALUE = 1_000_000_000_000; // 1 trillion INR
const MAX_BUDGET_INR = 1_000_000_000; // 1 billion INR
const MAX_FARM_SIZE = 100_000;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function mapLanguageToBackend(code: LanguageCode): BackendLanguage {
  switch (code) {
    case 'hi':
      return 'Hindi';
    case 'kn':
      return 'Kannada';
    case 'mr':
      return 'Marathi';
    case 'en':
    default:
      return 'English';
  }
}

export function normalizeFarmSizeForBackend(
  rawSize: string | number,
  unit: AreaUnit
): { farm_size: number; farm_size_unit: BackendAreaUnit } {
  const numeric = typeof rawSize === 'number' ? rawSize : Number(String(rawSize).replace(/,/g, '').trim());
  const safeSize = Number.isFinite(numeric) && numeric > 0 ? numeric : 1;

  if (unit === 'Hectares') {
    return {
      farm_size: Number(Math.min(MAX_FARM_SIZE, safeSize).toFixed(4)),
      farm_size_unit: 'hectare',
    };
  }

  if (unit === 'Square Metres') {
    const acres = Math.max(0.01, safeSize / SQ_METRES_PER_ACRE);
    return {
      farm_size: Number(Math.min(MAX_FARM_SIZE, acres).toFixed(4)),
      farm_size_unit: 'acre',
    };
  }

  return {
    farm_size: Number(Math.min(MAX_FARM_SIZE, safeSize).toFixed(4)),
    farm_size_unit: 'acre',
  };
}

export function isValidIsoCalendarDate(value: string): boolean {
  const trimmed = value.trim();
  if (!ISO_DATE_RE.test(trimmed)) return false;
  const [y, m, d] = trimmed.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    !Number.isNaN(dt.getTime()) &&
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

export function toSafeHttpUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export function extractFastApiErrorText(detail: unknown): string {
  if (typeof detail === 'string' && detail.trim()) {
    return detail.trim();
  }
  if (Array.isArray(detail)) {
    const messages = detail
      .map((entry) => {
        if (!entry || typeof entry !== 'object') return String(entry ?? '');
        const item = entry as {
          field?: string[] | string;
          loc?: (string | number)[];
          message?: string;
          msg?: string;
        };
        const rawField = item.field ?? item.loc;
        const label = Array.isArray(rawField)
          ? rawField.filter((seg) => seg !== 'body').join('.')
          : rawField || '';
        const text = item.message ?? item.msg ?? 'Invalid input';
        return label ? `${label}: ${text}` : text;
      })
      .filter(Boolean);
    if (messages.length > 0) return messages.join('\n');
  }
  if (detail && typeof detail === 'object') {
    const obj = detail as { message?: string; error?: string; field?: string };
    const text = obj.message ?? obj.error;
    if (text) {
      return obj.field ? `${obj.field}: ${text}` : String(text);
    }
  }
  return 'Request failed';
}

export function isChatbotTextResponse(response: ChatbotApiResponse): response is ChatbotTextResponse {
  return typeof (response as ChatbotTextResponse).answer === 'string';
}

export function isChatbotDiagnosisResponse(
  response: ChatbotApiResponse
): response is ChatbotDiagnosisResponse {
  return typeof (response as ChatbotDiagnosisResponse).disease_name === 'string';
}

export function mapBackendSeverityToUi(severity: BackendSeverity | string): DiseaseSeverity {
  switch (String(severity).toLowerCase()) {
    case 'healthy':
      return 'Healthy';
    case 'low':
      return 'Low';
    case 'moderate':
      return 'Moderate';
    case 'high':
      return 'High';
    case 'critical':
      return 'Critical';
    default:
      return 'Unknown';
  }
}

export function mapBackendRiskLabel(risk: BackendRisk | string): string {
  switch (String(risk).toLowerCase()) {
    case 'low':
      return 'Low';
    case 'moderate':
      return 'Moderate';
    case 'high':
      return 'High';
    default:
      return 'Unknown';
  }
}

export function mapDiagnosisResponseToUi(diagnosis: ChatbotDiagnosisResponse): DiseaseAnalysisResult {
  return {
    diseaseName: diagnosis.disease_name || 'Suspected crop issue',
    status: diagnosis.status,
    severity: mapBackendSeverityToUi(diagnosis.severity),
    severityExplanation: diagnosis.severity_explanation ?? null,
    riskLevel: mapBackendRiskLabel(diagnosis.crop_loss_risk),
    cropLossRisk: diagnosis.crop_loss_risk,
    canRecover: diagnosis.can_recover,
    recoveryPeriod: diagnosis.recovery_period ?? null,
    recoveryConditions: Array.isArray(diagnosis.recovery_conditions)
      ? diagnosis.recovery_conditions
      : [],
    symptoms: Array.isArray(diagnosis.symptoms) ? diagnosis.symptoms : [],
    causes: [],
    preventiveMeasures: Array.isArray(diagnosis.precautions) ? diagnosis.precautions : [],
    suggestedTreatment: Array.isArray(diagnosis.treatment) ? diagnosis.treatment : [],
    treatmentOptions: Array.isArray(diagnosis.treatment_options) ? diagnosis.treatment_options : [],
    governmentSchemes: Array.isArray(diagnosis.government_schemes)
      ? diagnosis.government_schemes
      : [],
    schemeStatus: diagnosis.scheme_status,
    financialAssistanceGuidance: diagnosis.financial_assistance_guidance ?? null,
    whenToSeekExpert:
      diagnosis.severity === 'high' || diagnosis.severity === 'critical'
        ? 'Confirm this suspected diagnosis promptly with your local Krishi Vigyan Kendra (KVK) or agriculture officer before spraying.'
        : 'Verify locally with an agronomist or agriculture extension officer before applying chemical treatments.',
    disclaimer:
      'Preliminary AI visual assessment. Confirm the diagnosis locally before applying treatments or making financial decisions.',
    isDemo: false,
  };
}

export interface ChatbotFormValidationResult {
  valid: boolean;
  error?: string;
  formData?: FormData;
}

export function buildChatbotFormData(params: {
  message: string;
  farmDetails: FarmDetails;
  language: LanguageCode;
  sessionId?: string | null;
  files?: File[];
}): ChatbotFormValidationResult {
  const files = params.files ?? [];
  if (files.length > 3) {
    return { valid: false, error: 'You can attach at most 3 photos per message.' };
  }

  const trimmedMessage = params.message.trim();
  const effectiveMessage =
    trimmedMessage || (files.length > 0 ? 'Please diagnose these crop photos.' : '');

  if (!effectiveMessage) {
    return { valid: false, error: 'Please enter a message or attach at least one crop photo.' };
  }
  if (effectiveMessage.length > 4000) {
    return { valid: false, error: 'Message must be 4,000 characters or fewer.' };
  }

  const state = params.farmDetails.state.trim().slice(0, 100);
  const city = params.farmDetails.city.trim().slice(0, 100);
  const district = (params.farmDetails.district?.trim() || city).slice(0, 100);
  const crop = params.farmDetails.crop.trim().slice(0, 100);
  const season = params.farmDetails.season.trim().slice(0, 100);
  const { farm_size, farm_size_unit } = normalizeFarmSizeForBackend(
    params.farmDetails.farmSize,
    params.farmDetails.farmSizeUnit
  );

  // IMPORTANT: Physical production quantity only — NEVER map rupees (lastYearYield) into last_year_yield!
  const prodRaw = String(params.farmDetails.lastYearProduction ?? '').replace(/,/g, '').trim();
  const prodNum = prodRaw === '' ? 0 : Number(prodRaw);
  const yieldUnit = (params.farmDetails.yieldUnit || 'quintal').trim().slice(0, 40);

  const sessionId = params.sessionId?.trim().slice(0, 100) || '';

  if (!sessionId) {
    if (!state || !city || !district) {
      return {
        valid: false,
        error: 'Please fill State, City, and District in Farm Details before starting a chat.',
      };
    }
    if (!crop || !season) {
      return {
        valid: false,
        error: 'Please select Crop and Season in Farm Details before starting a chat.',
      };
    }
    if (!Number.isFinite(farm_size) || farm_size <= 0) {
      return { valid: false, error: 'Farm size must be greater than 0.' };
    }
    if (!Number.isFinite(prodNum) || prodNum < 0) {
      return {
        valid: false,
        error: 'Last year physical production must be a valid number (0 or greater).',
      };
    }
  }

  const form = new FormData();
  form.append('message', effectiveMessage);
  form.append('language', mapLanguageToBackend(params.language));

  if (sessionId) {
    form.append('session_id', sessionId);
  }
  if (state) form.append('state', state);
  if (city) form.append('city', city);
  if (district) form.append('district', district);
  if (Number.isFinite(farm_size) && farm_size > 0) {
    form.append('farm_size', String(farm_size));
    form.append('farm_size_unit', farm_size_unit);
  }
  if (crop) form.append('crop', crop);
  if (season) form.append('season', season);
  if (Number.isFinite(prodNum) && prodNum >= 0) {
    form.append('last_year_yield', String(prodNum));
    form.append('yield_unit', yieldUnit);
  }

  files.forEach((file, index) => {
    form.append(`image_${index + 1}`, file, file.name);
  });

  return { valid: true, formData: form };
}

export interface LossPayloadValidationResult {
  valid: boolean;
  error?: string;
  payload?: LossOptimizationRequest;
}

export function buildLossOptimizationPayload(params: {
  farmDetails: FarmDetails;
  lastYearValueInr: number;
  thisYearValueInr: number;
  affectedArea: number;
  recoveryBudgetInr?: number | null;
  damageReason?: string;
  language: LanguageCode;
}): LossPayloadValidationResult {
  const state = params.farmDetails.state.trim().slice(0, 100);
  const city = params.farmDetails.city.trim().slice(0, 100);
  const district = (params.farmDetails.district?.trim() || city).slice(0, 100);
  const crop = params.farmDetails.crop.trim().slice(0, 100);
  const season = params.farmDetails.season.trim().slice(0, 100);

  if (!state || !city) {
    return { valid: false, error: 'State and City in Farm Details are required for loss optimization.' };
  }
  if (!crop || !season) {
    return { valid: false, error: 'Crop and Season in Farm Details are required.' };
  }

  const { farm_size, farm_size_unit } = normalizeFarmSizeForBackend(
    params.farmDetails.farmSize,
    params.farmDetails.farmSizeUnit
  );
  if (!Number.isFinite(farm_size) || farm_size <= 0 || farm_size > MAX_FARM_SIZE) {
    return { valid: false, error: 'Farm size must be greater than 0 and at most 100,000.' };
  }

  const lastVal = params.lastYearValueInr;
  const thisVal = params.thisYearValueInr;
  if (!Number.isFinite(lastVal) || lastVal < 0 || lastVal > MAX_INR_VALUE) {
    return { valid: false, error: "Last year's harvest value must be between ₹0 and ₹1 trillion." };
  }
  if (!Number.isFinite(thisVal) || thisVal < 0 || thisVal > MAX_INR_VALUE) {
    return { valid: false, error: "This year's harvest value must be between ₹0 and ₹1 trillion." };
  }

  const affectedArea = params.affectedArea;
  if (!Number.isFinite(affectedArea) || affectedArea < 0) {
    return { valid: false, error: 'Affected area must be 0 or greater.' };
  }
  if (affectedArea > farm_size) {
    return {
      valid: false,
      error: `Affected area (${affectedArea} ${farm_size_unit}) cannot exceed total farm size (${farm_size} ${farm_size_unit}).`,
    };
  }

  const payload: LossOptimizationRequest = {
    state,
    city,
    farm_size,
    farm_size_unit,
    crop,
    season,
    last_year_yield_value_inr: lastVal,
    this_year_yield_value_inr: thisVal,
    affected_area: Number(affectedArea.toFixed(4)),
    language: mapLanguageToBackend(params.language),
  };

  if (district) {
    payload.district = district;
  }

  const latStr = params.farmDetails.latitude?.trim();
  const lngStr = params.farmDetails.longitude?.trim();
  if (latStr && lngStr) {
    const lat = Number(latStr);
    const lng = Number(lngStr);
    if (Number.isFinite(lat) && lat >= -90 && lat <= 90 && Number.isFinite(lng) && lng >= -180 && lng <= 180) {
      payload.latitude = lat;
      payload.longitude = lng;
    }
  }

  if (
    params.recoveryBudgetInr !== undefined &&
    params.recoveryBudgetInr !== null &&
    Number.isFinite(params.recoveryBudgetInr)
  ) {
    if (params.recoveryBudgetInr < 0 || params.recoveryBudgetInr > MAX_BUDGET_INR) {
      return { valid: false, error: 'Recovery budget must be between ₹0 and ₹1 billion.' };
    }
    payload.recovery_budget_inr = params.recoveryBudgetInr;
  }

  const trimmedReason = params.damageReason?.trim();
  if (trimmedReason) {
    if (trimmedReason.length > 400) {
      return { valid: false, error: 'Damage reason must be 400 characters or fewer.' };
    }
    payload.damage_reason = trimmedReason;
  }

  return { valid: true, payload };
}

export function computeLocalRevenueGap(params: {
  lastYearValueInr: number;
  thisYearValueInr: number;
  affectedArea: number;
  farmSize: number;
  farmSizeUnit: BackendAreaUnit;
}): LocalRevenueGapSummary {
  const lastYear = Math.max(0, Number.isFinite(params.lastYearValueInr) ? params.lastYearValueInr : 0);
  const thisYear = Math.max(0, Number.isFinite(params.thisYearValueInr) ? params.thisYearValueInr : 0);
  const revenueGapInr = Math.max(0, lastYear - thisYear);
  const reductionPct = lastYear > 0 ? Number(((revenueGapInr / lastYear) * 100).toFixed(1)) : null;
  const farmSize = Math.max(0, Number.isFinite(params.farmSize) ? params.farmSize : 0);
  const affectedArea = Math.max(0, Number.isFinite(params.affectedArea) ? params.affectedArea : 0);
  const affectedPct =
    farmSize > 0 ? Number((Math.min(100, (affectedArea / farmSize) * 100)).toFixed(1)) : null;

  return {
    lastYearValueInr: lastYear,
    thisYearValueInr: thisYear,
    revenueGapInr,
    reductionPct,
    affectedArea,
    farmSize,
    farmSizeUnit: params.farmSizeUnit,
    affectedPct,
  };
}

export interface MonitoringFormValidationResult {
  valid: boolean;
  error?: string;
  formData?: FormData;
}

export function buildHealthMonitoringFormData(params: {
  photos: Array<{ file: File; date: string }>;
  farmDetails: FarmDetails;
  message?: string;
  language: LanguageCode;
}): MonitoringFormValidationResult {
  const { photos, farmDetails } = params;

  if (photos.length < 2 || photos.length > 4) {
    return { valid: false, error: 'Select between 2 and 4 dated photos to compare crop health.' };
  }

  for (let i = 0; i < photos.length; i++) {
    const item = photos[i];
    if (!item.file) {
      return { valid: false, error: `Photo #${i + 1} is missing an image file.` };
    }
    if (!isValidIsoCalendarDate(item.date)) {
      return {
        valid: false,
        error: `Photo #${i + 1} needs a complete valid calendar date (YYYY-MM-DD).`,
      };
    }
  }

  const distinctDates = new Set(photos.map((p) => p.date.trim()));
  if (distinctDates.size < 2) {
    return {
      valid: false,
      error: 'Please select photos from at least two different dates to compare changes over time.',
    };
  }

  const crop = farmDetails.crop.trim().slice(0, 80);
  if (!crop) {
    return { valid: false, error: 'Crop name is required in Farm Details.' };
  }

  const form = new FormData();
  photos.forEach((photo, idx) => {
    form.append(`image_${idx + 1}`, photo.file, photo.file.name);
    form.append(`date_${idx + 1}`, photo.date.trim());
  });

  form.append('crop', crop);
  form.append('language', mapLanguageToBackend(params.language));

  // NOTE: 'district' is intentionally NOT appended — monitoring schema does not accept it.
  const state = farmDetails.state.trim().slice(0, 100);
  const city = farmDetails.city.trim().slice(0, 100);
  const season = farmDetails.season.trim().slice(0, 60);

  if (state) form.append('state', state);
  if (city) form.append('city', city);
  if (season) form.append('season', season);

  const { farm_size, farm_size_unit } = normalizeFarmSizeForBackend(
    farmDetails.farmSize,
    farmDetails.farmSizeUnit
  );
  if (Number.isFinite(farm_size) && farm_size > 0) {
    form.append('farm_size', String(farm_size));
    form.append('farm_size_unit', farm_size_unit);
  }

  const yieldValRaw = farmDetails.lastYearYield.replace(/,/g, '').trim();
  if (yieldValRaw !== '') {
    const yieldValNum = Number(yieldValRaw);
    if (Number.isFinite(yieldValNum) && yieldValNum >= 0) {
      form.append('last_year_yield_value_inr', String(yieldValNum));
    }
  }

  const trimmedMsg = params.message?.trim();
  if (trimmedMsg) {
    if (trimmedMsg.length > 2000) {
      return { valid: false, error: 'Comparison note must be 2,000 characters or fewer.' };
    }
    form.append('message', trimmedMsg);
  }

  return { valid: true, formData: form };
}
