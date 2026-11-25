import type { AreaUnit, CropType, FarmDetails, SeasonType, YieldUnit } from '../types/cropsense';

export const HOME_HERO_IMAGE = '/assets/aistudio/image_a7e5f1f5.png';
export const HOME_HERO_SKY_LAYER = '/assets/aistudio/image_96a7b6fe.png';

export const DASHBOARD_BG_IMAGE =
  '/src/assets/images/dashboard_landscape_bg_1795588452424.jpg';

export const BOTANICAL_LEAF_IMAGE =
  '/src/assets/images/botanical_leaf_card_1795588453996.jpg';

export const TERRACED_FIELD_IMAGE =
  '/src/assets/images/terraced_field_card_1795588457451.jpg';

export const DEFAULT_FARM_DETAILS: FarmDetails = {
  state: 'Maharashtra',
  city: 'Amravati',
  district: 'Amravati',
  latitude: '',
  longitude: '',
  farmSize: '5',
  farmSizeUnit: 'Acres',
  crop: 'Cotton',
  season: 'Kharif',
  lastYearYield: '125000',
  lastYearProduction: '40',
  yieldUnit: 'quintal',
};

export const YIELD_UNITS: YieldUnit[] = ['quintal', 'kg', 'ton', 'bag'];

export const INDIAN_STATES_CITIES: Record<string, string[]> = {
  Maharashtra: ['Amravati', 'Nagpur', 'Nashik', 'Pune', 'Akola', 'Yavatmal', 'Jalgaon', 'Kolhapur', 'Solapur', 'Aurangabad'],
  Karnataka: ['Bengaluru Rural', 'Belagavi', 'Dharwad', 'Kalaburagi', 'Mysuru', 'Mandya', 'Raichur', 'Shivamogga', 'Ballari'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Ujjain', 'Sehore', 'Dewas', 'Jabalpur', 'Hoshangabad', 'Gwalior'],
  Punjab: ['Ludhiana', 'Amritsar', 'Patiala', 'Bathinda', 'Jalandhar', 'Sangrur', 'Firozpur'],
  Haryana: ['Karnal', 'Hisar', 'Sirsa', 'Rohtak', 'Kurukshetra', 'Ambala', 'Panipat'],
  Gujarat: ['Rajkot', 'Junagadh', 'Anand', 'Mehsana', 'Bhavnagar', 'Surat', 'Vadodara'],
  'Uttar Pradesh': ['Lucknow', 'Meerut', 'Varanasi', 'Kanpur', 'Agra', 'Bareilly', 'Gorakhpur', 'Muzaffarnagar'],
  Rajasthan: ['Jaipur', 'Kota', 'Sri Ganganagar', 'Udaipur', 'Jodhpur', 'Alwar', 'Bikaner'],
  'Andhra Pradesh': ['Guntur', 'Krishna', 'Kurnool', 'Anantapur', 'East Godavari', 'Chittoor'],
  Telangana: ['Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Nalgonda', 'Adilabad'],
  'Tamil Nadu': ['Thanjavur', 'Coimbatore', 'Erode', 'Madurai', 'Salem', 'Tiruchirappalli'],
  'West Bengal': ['Bardhaman', 'Hooghly', 'Nadia', 'Murshidabad', 'Medinipur', 'Jalpaiguri'],
  Bihar: ['Patna', 'Muzaffarpur', 'Bhagalpur', 'Gaya', 'Purnia', 'Darbhanga'],
};

export const INDIAN_STATES: string[] = Object.keys(INDIAN_STATES_CITIES);

export const AREA_UNITS: AreaUnit[] = ['Acres', 'Hectares', 'Square Metres'];

export const CROP_OPTIONS: CropType[] = [
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

export const SEASON_OPTIONS: SeasonType[] = ['Kharif', 'Rabi', 'Zaid'];

export const HISTORICAL_PARAMETERS = [
  'vegetationHealth',
  'vegetationIndex',
  'cropCoverage',
  'waterAvailability',
  'soilCondition',
  'environmentalTrends',
] as const;

export type HistoricalParameterKey = (typeof HISTORICAL_PARAMETERS)[number];

export interface HistoricalPreviewRow {
  year: string;
  ndvi: number;
  cropHealthScore: number;
  rainfallMm: number;
  soilMoisturePct: number;
  cropCoveragePct: number;
  avgTempC: number;
}

/**
 * Clearly labeled structural chart schema preview for the five-year historical workspace.
 * Never presented as verified satellite measurements for a user's specific farm.
 */
export const ILLUSTRATIVE_FIVE_YEAR_PREVIEW: Record<SeasonType, HistoricalPreviewRow[]> = {
  Kharif: [
    { year: '2022', ndvi: 0.62, cropHealthScore: 74, rainfallMm: 790, soilMoisturePct: 58, cropCoveragePct: 81, avgTempC: 30.4 },
    { year: '2023', ndvi: 0.58, cropHealthScore: 69, rainfallMm: 675, soilMoisturePct: 51, cropCoveragePct: 78, avgTempC: 31.2 },
    { year: '2024', ndvi: 0.67, cropHealthScore: 79, rainfallMm: 860, soilMoisturePct: 64, cropCoveragePct: 85, avgTempC: 29.8 },
    { year: '2025', ndvi: 0.64, cropHealthScore: 76, rainfallMm: 810, soilMoisturePct: 60, cropCoveragePct: 83, avgTempC: 30.1 },
    { year: '2026', ndvi: 0.71, cropHealthScore: 84, rainfallMm: 885, soilMoisturePct: 66, cropCoveragePct: 88, avgTempC: 29.5 },
  ],
  Rabi: [
    { year: '2022', ndvi: 0.66, cropHealthScore: 78, rainfallMm: 145, soilMoisturePct: 52, cropCoveragePct: 84, avgTempC: 22.8 },
    { year: '2023', ndvi: 0.69, cropHealthScore: 81, rainfallMm: 162, soilMoisturePct: 55, cropCoveragePct: 86, avgTempC: 22.1 },
    { year: '2024', ndvi: 0.63, cropHealthScore: 73, rainfallMm: 118, soilMoisturePct: 47, cropCoveragePct: 80, avgTempC: 23.6 },
    { year: '2025', ndvi: 0.72, cropHealthScore: 85, rainfallMm: 174, soilMoisturePct: 58, cropCoveragePct: 89, avgTempC: 21.9 },
    { year: '2026', ndvi: 0.74, cropHealthScore: 87, rainfallMm: 168, soilMoisturePct: 59, cropCoveragePct: 90, avgTempC: 22.2 },
  ],
  Zaid: [
    { year: '2022', ndvi: 0.49, cropHealthScore: 63, rainfallMm: 68, soilMoisturePct: 39, cropCoveragePct: 64, avgTempC: 35.4 },
    { year: '2023', ndvi: 0.52, cropHealthScore: 66, rainfallMm: 74, soilMoisturePct: 42, cropCoveragePct: 68, avgTempC: 34.9 },
    { year: '2024', ndvi: 0.47, cropHealthScore: 60, rainfallMm: 52, soilMoisturePct: 36, cropCoveragePct: 61, avgTempC: 36.3 },
    { year: '2025', ndvi: 0.55, cropHealthScore: 70, rainfallMm: 82, soilMoisturePct: 45, cropCoveragePct: 71, avgTempC: 34.6 },
    { year: '2026', ndvi: 0.57, cropHealthScore: 72, rainfallMm: 88, soilMoisturePct: 47, cropCoveragePct: 73, avgTempC: 34.2 },
  ],
};

export const SEASONAL_COMPARISON_PREVIEW = [
  { month: 'Jun', ndvi2024: 0.34, ndvi2025: 0.38, ndvi2026: 0.41 },
  { month: 'Jul', ndvi2024: 0.52, ndvi2025: 0.55, ndvi2026: 0.59 },
  { month: 'Aug', ndvi2024: 0.69, ndvi2025: 0.66, ndvi2026: 0.73 },
  { month: 'Sep', ndvi2024: 0.74, ndvi2025: 0.71, ndvi2026: 0.77 },
  { month: 'Oct', ndvi2024: 0.61, ndvi2025: 0.64, ndvi2026: 0.68 },
  { month: 'Nov', ndvi2024: 0.46, ndvi2025: 0.49, ndvi2026: 0.52 },
];
