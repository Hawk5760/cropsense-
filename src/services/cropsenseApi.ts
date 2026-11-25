import type {
  BackendGemmaLimits,
  BackendHealthStatus,
  ChatbotApiResponse,
  FarmDetails,
  LanguageCode,
  LossOptimizationResponse,
  MonitoringReport,
} from '../types/cropsense';
import {
  buildChatbotFormData,
  buildHealthMonitoringFormData,
  buildLossOptimizationPayload,
  extractFastApiErrorText,
} from '../utils/backendContract';

const PROXY_BASE = '/api/backend';

export class CropSenseApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'CropSenseApiError';
    this.status = status;
  }
}

async function requestBackend<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${PROXY_BASE}${path}`, options);
  const rawText = await response.text();
  let data: unknown = null;
  try {
    data = JSON.parse(rawText);
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detail =
      data && typeof data === 'object' && 'detail' in data
        ? (data as { detail: unknown }).detail
        : data && typeof data === 'object' && 'message' in data
          ? (data as { message: unknown }).message
          : null;
    const msg = detail ? extractFastApiErrorText(detail) : `HTTP ${response.status}`;
    throw new CropSenseApiError(response.status, msg);
  }

  if (data === null) {
    throw new CropSenseApiError(response.status, 'Unexpected non-JSON or empty response from backend.');
  }

  return data as T;
}

export async function checkBackendHealth(signal?: AbortSignal): Promise<BackendHealthStatus> {
  return requestBackend<BackendHealthStatus>('/health', { method: 'GET', signal });
}

export async function fetchGemmaLimits(signal?: AbortSignal): Promise<BackendGemmaLimits> {
  return requestBackend<BackendGemmaLimits>('/health/gemma', { method: 'GET', signal });
}

export async function postChatbotMain(params: {
  message: string;
  farmDetails: FarmDetails;
  language: LanguageCode;
  sessionId?: string | null;
  files?: File[];
  signal?: AbortSignal;
}): Promise<ChatbotApiResponse> {
  const built = buildChatbotFormData({
    message: params.message,
    farmDetails: params.farmDetails,
    language: params.language,
    sessionId: params.sessionId,
    files: params.files,
  });

  if (!built.valid || !built.formData) {
    throw new CropSenseApiError(422, built.error || 'Invalid chatbot request.');
  }

  // Do NOT manually set multipart Content-Type; browser sets boundary automatically.
  return requestBackend<ChatbotApiResponse>('/chatbot/main', {
    method: 'POST',
    body: built.formData,
    signal: params.signal,
  });
}

export async function postLossOptimization(params: {
  farmDetails: FarmDetails;
  lastYearValueInr: number;
  thisYearValueInr: number;
  affectedArea: number;
  recoveryBudgetInr?: number | null;
  damageReason?: string;
  language: LanguageCode;
  signal?: AbortSignal;
}): Promise<LossOptimizationResponse> {
  const built = buildLossOptimizationPayload({
    farmDetails: params.farmDetails,
    lastYearValueInr: params.lastYearValueInr,
    thisYearValueInr: params.thisYearValueInr,
    affectedArea: params.affectedArea,
    recoveryBudgetInr: params.recoveryBudgetInr,
    damageReason: params.damageReason,
    language: params.language,
  });

  if (!built.valid || !built.payload) {
    throw new CropSenseApiError(422, built.error || 'Invalid loss optimization inputs.');
  }

  const result = await requestBackend<LossOptimizationResponse>('/loss/optimization', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(built.payload),
    signal: params.signal,
  });

  return Array.isArray(result) ? result : [];
}

export async function postHealthMonitoring(params: {
  photos: Array<{ file: File; date: string }>;
  farmDetails: FarmDetails;
  message?: string;
  language: LanguageCode;
  signal?: AbortSignal;
}): Promise<MonitoringReport> {
  const built = buildHealthMonitoringFormData({
    photos: params.photos,
    farmDetails: params.farmDetails,
    message: params.message,
    language: params.language,
  });

  if (!built.valid || !built.formData) {
    throw new CropSenseApiError(422, built.error || 'Invalid crop health monitoring inputs.');
  }

  // Do NOT manually set multipart Content-Type; browser sets boundary automatically.
  return requestBackend<MonitoringReport>('/health/monitoring', {
    method: 'POST',
    body: built.formData,
    signal: params.signal,
  });
}
