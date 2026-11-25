import type {
  ChatAssistantMode,
  ChatMessageItem,
  DiseaseAnalysisResult,
  FarmDetails,
  LanguageCode,
  WeeklyCropHealthEntry,
} from '../types/cropsense';
import { CROP_OPTIONS, INDIAN_STATES, INDIAN_STATES_CITIES } from '../data/cropData';

export interface AiChatRequest {
  message: string;
  history: ChatMessageItem[];
  farmDetails: FarmDetails;
  language: LanguageCode;
  imageBase64?: string;
  imageMimeType?: string;
  assistantMode?: ChatAssistantMode;
  weatherSummary?: string;
}

export interface AiChatResponse {
  reply: string;
  diseaseAnalysis?: DiseaseAnalysisResult;
  isDemo?: boolean;
}

export class AiServiceError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export async function sendCropAiMessage(request: AiChatRequest): Promise<AiChatResponse> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: request.message,
      history: request.history
        .filter((m) => !m.isError)
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content })),
      farmDetails: request.farmDetails,
      language: request.language,
      imageBase64: request.imageBase64,
      imageMimeType: request.imageMimeType,
      assistantMode: request.assistantMode ?? 'general',
      weatherSummary: request.weatherSummary ?? '',
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const code = typeof data.error === 'string' ? data.error : 'AI_REQUEST_FAILED';
    const message =
      typeof data.message === 'string'
        ? data.message
        : 'Unable to complete the AI request right now.';
    throw new AiServiceError(code, message);
  }

  return {
    reply: String(data.reply ?? ''),
    diseaseAnalysis: data.diseaseAnalysis,
    isDemo: Boolean(data.diseaseAnalysis?.isDemo),
  };
}

/**
 * Local deterministic fallback parser for spoken farm details when AI backend is unconfigured.
 */
export function parseFarmDetailsLocally(transcript: string): Partial<FarmDetails> {
  const lower = transcript.toLowerCase();
  const extracted: Partial<FarmDetails> = {};

  for (const state of INDIAN_STATES) {
    if (lower.includes(state.toLowerCase())) {
      extracted.state = state;
      break;
    }
  }

  for (const [state, cities] of Object.entries(INDIAN_STATES_CITIES)) {
    for (const city of cities) {
      if (lower.includes(city.toLowerCase())) {
        extracted.city = city;
        if (!extracted.state) extracted.state = state;
        break;
      }
    }
    if (extracted.city) break;
  }

  const cropAliases: Record<string, (typeof CROP_OPTIONS)[number]> = {
    cotton: 'Cotton',
    kapas: 'Cotton',
    कपास: 'Cotton',
    कापूस: 'Cotton',
    ಹತ್ತಿ: 'Cotton',
    wheat: 'Wheat',
    gehu: 'Wheat',
    गेहूं: 'Wheat',
    गहू: 'Wheat',
    ಗೋಧಿ: 'Wheat',
    rice: 'Rice',
    paddy: 'Rice',
    dhan: 'Rice',
    धान: 'Rice',
    भात: 'Rice',
    ಭತ್ತ: 'Rice',
    soybean: 'Soybean',
    सोयाबीन: 'Soybean',
    ಸೋಯಾಬೀನ್: 'Soybean',
    maize: 'Maize',
    corn: 'Maize',
    मक्का: 'Maize',
    मका: 'Maize',
    sugarcane: 'Sugarcane',
    ganna: 'Sugarcane',
    गन्ना: 'Sugarcane',
    ऊस: 'Sugarcane',
    ಕಬ್ಬು: 'Sugarcane',
    tomato: 'Tomato',
    टमाटर: 'Tomato',
    onion: 'Onion',
    pyaz: 'Onion',
    kanda: 'Onion',
    प्याज: 'Onion',
    कांदा: 'Onion',
    ಈರುಳ್ಳಿ: 'Onion',
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

export async function extractFarmDetailsFromVoice(
  transcript: string,
  language: LanguageCode
): Promise<Partial<FarmDetails>> {
  try {
    const response = await fetch('/api/ai/extract-farm-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, language }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.extracted && Object.values(data.extracted).some(Boolean)) {
        return data.extracted as Partial<FarmDetails>;
      }
    }
  } catch {
    // Fall back to deterministic local extraction
  }

  return parseFarmDetailsLocally(transcript);
}

export async function analyzeWeeklyCropHealthImage(params: {
  imageBase64: string;
  imageMimeType: string;
  date: string;
  notes: string;
  farmDetails: FarmDetails;
  weatherSummary: string;
  previousEntries: WeeklyCropHealthEntry[];
  language: LanguageCode;
}): Promise<{
  healthScore: number;
  diseaseOutbreakProbability: number;
  diseaseSeverity: WeeklyCropHealthEntry['diseaseSeverity'];
  irrigationStatus: WeeklyCropHealthEntry['irrigationStatus'];
  stressLevel: WeeklyCropHealthEntry['stressLevel'];
  stressSummary: string;
  explanation: string;
  recommendedActions: string[];
  isIllustrative?: boolean;
}> {
  const response = await fetch('/api/ai/weekly-health', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64: params.imageBase64,
      imageMimeType: params.imageMimeType,
      date: params.date,
      notes: params.notes,
      farmDetails: params.farmDetails,
      weatherSummary: params.weatherSummary,
      previousEntries: params.previousEntries.slice(-4).map((e) => ({
        date: e.date,
        healthScore: e.healthScore,
        diseaseOutbreakProbability: e.diseaseOutbreakProbability,
        diseaseSeverity: e.diseaseSeverity,
      })),
      language: params.language,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (data?.error === 'AI_NOT_CONFIGURED') {
      return {
        healthScore: 74,
        diseaseOutbreakProbability: 28,
        diseaseSeverity: 'Moderate',
        irrigationStatus: 'Optimal',
        stressLevel: 'yellow',
        stressSummary: 'Demonstration Assessment (AI Vision Key Not Configured)',
        explanation:
          'Demonstration output: Weekly photo was logged to your timeline, but server-side GEMINI_API_KEY is not configured for live image pathology scoring.',
        recommendedActions: [
          'Review foliage underside manually in morning light for early spotting',
          'Configure GEMINI_API_KEY in Settings > Secrets to enable live weekly visual scoring',
        ],
        isIllustrative: true,
      };
    }
    throw new AiServiceError(
      typeof data?.error === 'string' ? data.error : 'WEEKLY_HEALTH_FAILED',
      typeof data?.message === 'string'
        ? data.message
        : 'Unable to analyze weekly crop image right now.'
    );
  }

  return data.analysis;
}

/**
 * Clearly labeled demonstration fallback ONLY invoked when the server explicitly returns
 * AI_NOT_CONFIGURED (no server-side API key present). Never presented as a genuine diagnosis.
 */
export function buildUnconfiguredDemoResponse(
  farmDetails: FarmDetails,
  hasImage: boolean,
  assistantMode: ChatAssistantMode = 'general'
): AiChatResponse {
  const crop = farmDetails.crop || 'Cotton';
  const location = [farmDetails.city, farmDetails.state].filter(Boolean).join(', ') || 'your region';

  if (assistantMode === 'financial_assistance' && !hasImage) {
    return {
      isDemo: true,
      reply:
        `[Demonstration Financial Assistance Output — Server AI key is not configured.] Based on your saved profile (${crop}, ${farmDetails.farmSize} ${farmDetails.farmSizeUnit}, ${location}), key programmes to check include PMFBY Crop Insurance, PM-KISAN, Kisan Credit Card (KCC), PMKSY Per Drop More Crop micro-irrigation subsidy, and SDRF calamity compensation. Keep your Aadhaar, 7/12 or RTC land record, and Aadhaar-seeded bank passbook ready.`,
    };
  }

  if (hasImage) {
    return {
      isDemo: true,
      reply:
        `[Demonstration Output — AI vision backend is not configured on this server.] Showing the structured disease report format for ${crop} in ${location}. Connect GEMINI_API_KEY in server settings to run real image diagnostics.`,
      diseaseAnalysis: {
        diseaseName: 'Leaf Blight (Demonstration Placeholder)',
        confidence: 92,
        severity: 'Moderate',
        riskLevel: 'Medium',
        symptoms: [
          'Irregular brown-to-tan lesions along leaf margins (example demonstration item)',
          'Yellowing halo surrounding older spots under humid canopy conditions',
        ],
        causes: [
          'Prolonged leaf wetness and warm humid weather during active vegetative growth',
          'Overcrowded canopy reducing airflow between lower leaves',
        ],
        preventiveMeasures: [
          'Inspect nearby plants across multiple rows in early morning light',
          'Remove severely infected lower leaves where appropriate to limit spread',
          'Improve field drainage and avoid overhead irrigation late in the day',
        ],
        suggestedTreatment: [
          'Inspect nearby plants and mark affected patches before taking action',
          'Consult your local Krishi Vigyan Kendra (KVK) or agronomist regarding suitable fungicide selection and dosage',
          'Follow integrated disease management guidelines before any chemical spray',
        ],
        whenToSeekExpert:
          'Contact a local agricultural officer if lesions spread rapidly across upper foliage or affect more than 15–20% of plants.',
        disclaimer:
          'DEMONSTRATION ONLY: No AI vision key is configured on the server. Image-based disease identification is preliminary and must be verified by an agronomist before applying pesticides or treatments.',
        isDemo: true,
      },
    };
  }

  return {
    isDemo: true,
    reply:
      `[Demonstration Response — Server AI key is not configured.] For ${crop} (${farmDetails.season}) in ${location} (${farmDetails.farmSize} ${farmDetails.farmSizeUnit}), focus on routine morning leaf scouting, balanced drainage, and early inspection of underside foliage for spots or sucking pests. Once GEMINI_API_KEY is configured in Settings > Secrets, live multilingual agronomic guidance will activate automatically.`,
  };
}
