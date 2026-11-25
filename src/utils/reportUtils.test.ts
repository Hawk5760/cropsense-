import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDiseaseReport,
  createHistoricalReport,
  filterReports,
} from './reportUtils';
import type { DiseaseAnalysisResult, FarmDetails } from '../types/cropsense';

const sampleFarm: FarmDetails = {
  state: 'Maharashtra',
  city: 'Amravati',
  district: 'Amravati',
  latitude: '',
  longitude: '',
  farmSize: '8',
  farmSizeUnit: 'Acres',
  crop: 'Cotton',
  season: 'Kharif',
  lastYearProduction: '60',
  yieldUnit: 'quintal',
  lastYearYield: '150000',
};

const sampleAnalysis: DiseaseAnalysisResult = {
  diseaseName: 'Leaf Blight',
  confidence: 91,
  severity: 'Moderate',
  riskLevel: 'Medium',
  symptoms: ['Brown necrotic leaf lesions'],
  causes: ['High humidity and fungal spores'],
  preventiveMeasures: ['Improve field drainage'],
  suggestedTreatment: ['Inspect nearby plants', 'Consult local KVK before spraying'],
  whenToSeekExpert: 'If lesions spread across >20% of canopy.',
  disclaimer: 'Preliminary assessment only.',
  isDemo: false,
};

test('createDiseaseReport builds structured completed report', () => {
  const report = createDiseaseReport(sampleAnalysis, sampleFarm, 'Summary text');
  assert.equal(report.type, 'disease_analysis');
  assert.equal(report.status, 'Completed');
  assert.equal(report.diseaseDetected, 'Leaf Blight');
  assert.equal(report.location, 'Amravati, Maharashtra');
  assert.equal(report.confidence, 91);
});

test('createDiseaseReport labels demo results accurately', () => {
  const report = createDiseaseReport({ ...sampleAnalysis, isDemo: true }, sampleFarm, 'Demo');
  assert.equal(report.status, 'Demonstration');
});

test('createHistoricalReport sets awaiting satellite provider status', () => {
  const report = createHistoricalReport(sampleFarm, 'Rabi', '2022–2026', ['Vegetation health']);
  assert.equal(report.type, 'historical_analysis');
  assert.equal(report.status, 'Awaiting Satellite Provider');
  assert.equal(report.season, 'Rabi');
});

test('filterReports filters by type and search query', () => {
  const r1 = createDiseaseReport(sampleAnalysis, sampleFarm, 'Summary');
  const r2 = createHistoricalReport({ ...sampleFarm, crop: 'Wheat' }, 'Rabi', '2022–2026', []);

  assert.equal(filterReports([r1, r2], 'all', '').length, 2);
  assert.equal(filterReports([r1, r2], 'disease_analysis', '').length, 1);
  assert.equal(filterReports([r1, r2], 'historical_analysis', '').length, 1);
  assert.equal(filterReports([r1, r2], 'all', 'wheat').length, 1);
  assert.equal(filterReports([r1, r2], 'all', 'blight').length, 1);
});
