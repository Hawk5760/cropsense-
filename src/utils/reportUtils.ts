import type {
  CropReport,
  DiseaseAnalysisResult,
  FarmDetails,
  ReportType,
} from '../types/cropsense';
import { getFarmLocationLabel } from './farmValidation';

export function createDiseaseReport(
  analysis: DiseaseAnalysisResult,
  farm: FarmDetails,
  summaryText: string
): CropReport {
  return {
    id: `rep_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: 'disease_analysis',
    createdAt: new Date().toISOString(),
    crop: farm.crop,
    location: getFarmLocationLabel(farm),
    farmSizeLabel: `${farm.farmSize} ${farm.farmSizeUnit}`,
    season: farm.season,
    diseaseDetected: analysis.diseaseName,
    confidence: analysis.confidence,
    severity: analysis.severity,
    riskLevel: analysis.riskLevel,
    status: analysis.isDemo ? 'Demonstration' : 'Completed',
    summary: summaryText,
    symptoms: analysis.symptoms,
    causes: analysis.causes,
    preventiveMeasures: analysis.preventiveMeasures,
    recommendations:
      analysis.suggestedTreatment.length > 0
        ? analysis.suggestedTreatment
        : analysis.preventiveMeasures,
    whenToSeekExpert: analysis.whenToSeekExpert,
    disclaimer: analysis.disclaimer,
  };
}

export function createHistoricalReport(
  farm: FarmDetails,
  season: string,
  yearRange: string,
  parameters: string[]
): CropReport {
  return {
    id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: 'historical_analysis',
    createdAt: new Date().toISOString(),
    crop: farm.crop,
    location: getFarmLocationLabel(farm),
    farmSizeLabel: `${farm.farmSize} ${farm.farmSizeUnit}`,
    season,
    diseaseDetected: `Five-Year Historical Review (${yearRange})`,
    status: 'Awaiting Satellite Provider',
    summary:
      'Historical satellite analysis is queued for this parcel. Verified Sentinel-2 / Landsat imagery and multi-year NDVI metrics will populate once a satellite provider is connected.',
    recommendations: [
      'Confirm farm coordinates (latitude and longitude) on the Dashboard for parcel-accurate satellite clipping.',
      'Continue logging seasonal disease checks in AI Crop Health Assistant to build field ground-truth history.',
      'Connect Sentinel-2, Landsat, or Google Earth Engine credentials in satelliteService.ts to activate live tiles.',
    ],
    parameters,
    yearRange,
  };
}

export function filterReports(
  reports: CropReport[],
  typeFilter: 'all' | ReportType,
  searchQuery: string
): CropReport[] {
  const query = searchQuery.trim().toLowerCase();
  return reports.filter((report) => {
    if (typeFilter !== 'all' && report.type !== typeFilter) {
      return false;
    }
    if (!query) return true;
    return (
      report.crop.toLowerCase().includes(query) ||
      report.location.toLowerCase().includes(query) ||
      report.diseaseDetected.toLowerCase().includes(query) ||
      report.status.toLowerCase().includes(query)
    );
  });
}
