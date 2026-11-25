export type LanguageCode = 'en' | 'hi' | 'mr' | 'kn';

export type BackendLanguage = 'English' | 'Hindi' | 'Kannada' | 'Marathi';

export type AreaUnit = 'Acres' | 'Hectares' | 'Square Metres';

export type BackendAreaUnit = 'acre' | 'hectare';

export type YieldUnit = 'quintal' | 'kg' | 'ton' | 'bag';

export type CropType =
  | 'Cotton'
  | 'Wheat'
  | 'Rice'
  | 'Soybean'
  | 'Maize'
  | 'Sugarcane'
  | 'Tomato'
  | 'Onion'
  | 'Other';

export type SeasonType = 'Kharif' | 'Rabi' | 'Zaid';

export type DiseaseSeverity = 'Healthy' | 'Low' | 'Moderate' | 'High' | 'Critical' | 'Unknown';

export type BackendRisk = 'low' | 'moderate' | 'high' | 'unknown';
export type BackendStatus = 'success' | 'partial';
export type BackendSeverity = 'healthy' | 'low' | 'moderate' | 'high' | 'critical' | 'unknown';
export type BackendRecovery = 'likely' | 'conditional' | 'unlikely' | 'unknown';
export type BackendSchemeStatus = 'not_requested' | 'potential_options_found' | 'not_verified';
export type RecoveryCategory =
  | 'biomass'
  | 'land_reuse'
  | 'carbon_credit'
  | 'market_salvage'
  | 'financial_assistance';
export type HealthTrend = 'improving' | 'deteriorating' | 'stable' | 'uncertain';

export type DashboardTabId =
  | 'chatbot'
  | 'crop-health'
  | 'loss-optimisation'
  | 'information';

export type ChatAssistantMode = 'general' | 'financial_assistance';

export interface FarmDetails {
  state: string;
  city: string;
  district: string;
  latitude: string;
  longitude: string;
  farmSize: string;
  farmSizeUnit: AreaUnit;
  crop: CropType;
  season: SeasonType;
  /** Monetary last year's harvest value in INR (sent as last_year_yield_value_inr to loss/monitoring) */
  lastYearYield: string;
  /** Physical production quantity last year (sent as last_year_yield to /chatbot/main — never INR) */
  lastYearProduction: string;
  /** Unit for physical production (sent as yield_unit to /chatbot/main, default 'quintal') */
  yieldUnit: YieldUnit;
  updatedAt?: string;
}

export interface TreatmentOption {
  name: string;
  category: 'cultural' | 'biological' | 'chemical' | 'other';
  explanation: string;
}

export interface GovernmentScheme {
  scheme_name: string;
  description: string | null;
  eligibility: {
    status: 'potentially_eligible' | 'not_eligible' | 'insufficient_information';
    conditions: string[];
  };
  benefits: string | null;
  documents_required: string[];
  application_process: string[];
  application_link: string | null;
  official_reference: string;
}

export interface FinancialAssistanceGuidance {
  message: string;
  next_steps: string[];
  official_reference: string;
}

export interface ChatbotTextResponse {
  session_id: string;
  status: BackendStatus;
  answer: string;
}

export interface ChatbotDiagnosisResponse {
  session_id: string;
  status: BackendStatus;
  disease_name: string;
  severity: BackendSeverity;
  severity_explanation: string | null;
  symptoms: string[];
  treatment: string[];
  treatment_options: TreatmentOption[];
  precautions: string[];
  can_recover: BackendRecovery;
  recovery_period: string | null;
  recovery_conditions: string[];
  crop_loss_risk: BackendRisk;
  government_schemes: GovernmentScheme[];
  scheme_status: BackendSchemeStatus;
  financial_assistance_guidance: FinancialAssistanceGuidance | null;
  summary: string;
}

export type ChatbotApiResponse = ChatbotTextResponse | ChatbotDiagnosisResponse;

export interface DiseaseAnalysisResult {
  diseaseName: string;
  status?: BackendStatus;
  confidence?: number;
  severity: DiseaseSeverity;
  severityExplanation?: string | null;
  riskLevel: string;
  cropLossRisk?: BackendRisk;
  canRecover?: BackendRecovery;
  recoveryPeriod?: string | null;
  recoveryConditions?: string[];
  symptoms: string[];
  causes: string[];
  preventiveMeasures: string[];
  suggestedTreatment: string[];
  treatmentOptions?: TreatmentOption[];
  governmentSchemes?: GovernmentScheme[];
  schemeStatus?: BackendSchemeStatus;
  financialAssistanceGuidance?: FinancialAssistanceGuidance | null;
  whenToSeekExpert: string;
  disclaimer: string;
  isDemo?: boolean;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  status?: BackendStatus;
  imagePreview?: string;
  imagePreviews?: string[];
  diseaseAnalysis?: DiseaseAnalysisResult;
  isError?: boolean;
  isDemo?: boolean;
  savedReportId?: string;
  assistantMode?: ChatAssistantMode;
}

export type ReportType = 'disease_analysis' | 'historical_analysis';

export type ReportStatus = 'Completed' | 'Demonstration' | 'Awaiting Satellite Provider';

export interface CropReport {
  id: string;
  type: ReportType;
  createdAt: string;
  crop: string;
  location: string;
  farmSizeLabel: string;
  season: string;
  diseaseDetected: string;
  confidence?: number;
  severity?: DiseaseSeverity;
  riskLevel?: string;
  status: ReportStatus;
  summary: string;
  symptoms?: string[];
  causes?: string[];
  preventiveMeasures?: string[];
  recommendations: string[];
  whenToSeekExpert?: string;
  disclaimer?: string;
  parameters?: string[];
  yearRange?: string;
}

export interface WeatherConditions {
  connected: boolean;
  providerName: string;
  temperatureC?: number;
  humidityPct?: number;
  rainProbabilityPct?: number;
  windKmh?: number;
  summary: string;
}

export interface CurrentWeatherSnapshot {
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
}

export interface HistoricalWeatherDay {
  date: string;
  label: string;
  tempMaxC: number;
  tempMinC: number;
  tempAvgC: number;
  rainfallMm: number;
  humidityPct: number;
}

export interface ForecastWeatherDay {
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
}

export interface WeatherMonitorData {
  locationLabel: string;
  latitude: number;
  longitude: number;
  currentProvider: string;
  historicalProvider: string;
  isFallbackCurrent: boolean;
  isFallbackHistorical: boolean;
  current: CurrentWeatherSnapshot;
  history30d: HistoricalWeatherDay[];
  forecast7d: ForecastWeatherDay[];
  fetchedAt: string;
}

export type HealthRiskColor = 'green' | 'yellow' | 'red';

export type IrrigationStatus = 'Insufficient' | 'Optimal' | 'Excessive';

export interface WeeklyCropHealthEntry {
  id: string;
  weekLabel: string;
  date: string; // YYYY-MM-DD
  imageUrl?: string;
  notes?: string;
  healthScore: number; // 0-100
  diseaseOutbreakProbability: number; // 0-100
  diseaseSeverity: DiseaseSeverity;
  irrigationStatus: IrrigationStatus;
  stressLevel: HealthRiskColor;
  stressSummary: string;
  explanation: string;
  recommendedActions: string[];
  isIllustrative?: boolean;
}

/** Exact POST /health/monitoring response contract */
export interface MonitoringReport {
  health_trend: HealthTrend;
  growth_changes: string;
  disease_changes: string;
  disease_risk: BackendRisk;
  treatment_progress: string;
  next_steps: string[];
  comparison_limitations: string;
  first_date: string;
  latest_date: string;
  elapsed_days: number;
  images_compared: number;
}

/** Frontend-owned photo entry for dated crop health monitoring comparisons */
export interface MonitoringPhotoItem {
  id: string;
  date: string; // YYYY-MM-DD
  fileName: string;
  mimeType: string;
  dataUrl: string;
  notes?: string;
  file?: File;
}

/** Stored monitoring comparison record (frontend-owned history) */
export interface MonitoringHistoryEntry {
  id: string;
  createdAt: string;
  crop: string;
  locationLabel: string;
  photoDates: string[];
  photoThumbnails: Array<{ date: string; dataUrl?: string; fileName: string }>;
  message?: string;
  report: MonitoringReport;
}

/** Exact POST /loss/optimization request contract */
export interface LossOptimizationRequest {
  state: string;
  city: string;
  district?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  farm_size: number;
  farm_size_unit: BackendAreaUnit;
  crop: string;
  season: string;
  last_year_yield_value_inr: number;
  this_year_yield_value_inr: number;
  affected_area: number;
  recovery_budget_inr?: number | null;
  damage_reason?: string | null;
  language?: BackendLanguage;
}

/** Exact POST /loss/optimization response item contract */
export interface RecoveryMethodSource {
  title: string;
  url: string;
}

export interface RecoveryMethod {
  method: string;
  category: RecoveryCategory;
  how_to_implement: string;
  requirements_and_conditions: string;
  recommended_timing: string;
  sources: RecoveryMethodSource[];
}

export type LossOptimizationResponse = RecoveryMethod[];

export interface LocalRevenueGapSummary {
  lastYearValueInr: number;
  thisYearValueInr: number;
  revenueGapInr: number;
  reductionPct: number | null;
  affectedArea: number;
  farmSize: number;
  farmSizeUnit: BackendAreaUnit;
  affectedPct: number | null;
}

export interface LossOptimisationInput {
  lastYearYieldInr: number;
  currentYearYieldInr: number;
  estimatedLossInr?: number;
  farmSizeAcres: number;
  crop: CropType;
  state: string;
}

export interface RecoveryStrategy {
  id:
    | 'carbon_credit'
    | 'composting'
    | 'cattle_feed'
    | 'waste_monetization'
    | 'compensation';
  estimatedMinInr: number;
  estimatedMaxInr: number;
  estimatedTypicalInr: number;
  feasibility: 'High' | 'Medium' | 'Conditional';
  benefits: string[];
  eligibility: string[];
  actionSteps: string[];
}

export interface LossOptimisationResult {
  lastYearYieldInr: number;
  currentYearYieldInr: number;
  computedYieldDropInr: number;
  effectiveLossInr: number;
  yoyChangePct: number;
  estimatedRecoverableInr: number;
  estimatedRecoverableMinInr: number;
  estimatedRecoverableMaxInr: number;
  remainingLossGapInr: number;
  recoveryCoveragePct: number;
  hasSufficientData: boolean;
  strategies: RecoveryStrategy[];
}

export type SchemeCategory =
  | 'Insurance'
  | 'Central & State Schemes'
  | 'Subsidies'
  | 'NGO Grants'
  | 'Compensation';

export interface FinancialScheme {
  id: string;
  name: string;
  shortName?: string;
  category: SchemeCategory;
  authority: string;
  states: string[]; // ['All India'] or specific state names
  crops: string[]; // ['All Crops'] or specific crop types
  description: string;
  benefits: string[];
  eligibility: string[];
  requiredDocuments: string[];
  applicationUrl: string;
  deadline?: string;
}

export interface SatelliteStatus {
  connected: boolean;
  supportedProviders: string[];
  availableYears: number[];
  message: string;
}

export interface BackendHealthStatus {
  status: string;
  note?: string;
}

export interface BackendGemmaLimits {
  input_tokens: number;
  output_tokens: number;
  images: number;
  verified: boolean;
}
