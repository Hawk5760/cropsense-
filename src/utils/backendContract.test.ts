import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildChatbotFormData,
  buildHealthMonitoringFormData,
  buildLossOptimizationPayload,
  computeLocalRevenueGap,
  extractFastApiErrorText,
  isChatbotDiagnosisResponse,
  isChatbotTextResponse,
  isValidIsoCalendarDate,
  mapLanguageToBackend,
  normalizeFarmSizeForBackend,
  toSafeHttpUrl,
} from './backendContract.ts';
import type { FarmDetails } from '../types/cropsense.ts';

const SAMPLE_FARM: FarmDetails = {
  state: 'Karnataka',
  city: 'Belagavi',
  district: 'Belagavi',
  latitude: '15.8497',
  longitude: '74.4977',
  farmSize: '5',
  farmSizeUnit: 'Acres',
  crop: 'Tomato',
  season: 'Kharif',
  lastYearYield: '125000',
  lastYearProduction: '80',
  yieldUnit: 'quintal',
};

describe('backendContract helpers', () => {
  it('maps UI languages to exact backend language names', () => {
    assert.equal(mapLanguageToBackend('en'), 'English');
    assert.equal(mapLanguageToBackend('hi'), 'Hindi');
    assert.equal(mapLanguageToBackend('kn'), 'Kannada');
    assert.equal(mapLanguageToBackend('mr'), 'Marathi');
  });

  it('normalizes Acres, Hectares, and Square Metres to backend acre/hectare units', () => {
    assert.deepEqual(normalizeFarmSizeForBackend('5', 'Acres'), {
      farm_size: 5,
      farm_size_unit: 'acre',
    });
    assert.deepEqual(normalizeFarmSizeForBackend('2.5', 'Hectares'), {
      farm_size: 2.5,
      farm_size_unit: 'hectare',
    });
    const converted = normalizeFarmSizeForBackend('4046.8564224', 'Square Metres');
    assert.equal(converted.farm_size_unit, 'acre');
    assert.equal(converted.farm_size, 1);
  });

  it('validates complete ISO calendar dates and rejects incomplete or invalid dates', () => {
    assert.equal(isValidIsoCalendarDate('2026-11-25'), true);
    assert.equal(isValidIsoCalendarDate('2026-11'), false);
    assert.equal(isValidIsoCalendarDate('2026-02-30'), false);
    assert.equal(isValidIsoCalendarDate('25/11/2026'), false);
  });

  it('allows only http/https URLs and blocks javascript/data schemes', () => {
    assert.equal(toSafeHttpUrl('https://pmfby.gov.in/'), 'https://pmfby.gov.in/');
    assert.equal(toSafeHttpUrl('javascript:alert(1)'), null);
    assert.equal(toSafeHttpUrl('data:text/html,<script>'), null);
    assert.equal(toSafeHttpUrl(null), null);
  });

  it('parses all FastAPI detail error shapes (string, array, object)', () => {
    assert.equal(extractFastApiErrorText('Each image must be at most 8 MB'), 'Each image must be at most 8 MB');
    assert.equal(
      extractFastApiErrorText([{ field: ['body', 'date_2'], message: 'Field required', type: 'missing' }]),
      'date_2: Field required'
    );
    assert.equal(
      extractFastApiErrorText([{ loc: ['body', 'farm_size'], msg: 'Input should be greater than 0' }]),
      'farm_size: Input should be greater than 0'
    );
    assert.equal(
      extractFastApiErrorText({ field: 'date_2', received: '2026-11', message: 'Enter a complete valid date' }),
      'date_2: Enter a complete valid date'
    );
  });

  it('builds chatbot FormData using physical production (never rupees) and omits session_id on first turn', () => {
    const res = buildChatbotFormData({
      message: 'How should I water my tomatoes?',
      farmDetails: SAMPLE_FARM,
      language: 'en',
      sessionId: null,
      files: [],
    });
    assert.equal(res.valid, true);
    assert.ok(res.formData);
    assert.equal(res.formData.get('session_id'), null);
    assert.equal(res.formData.get('last_year_yield'), '80');
    assert.equal(res.formData.get('yield_unit'), 'quintal');
    assert.equal(res.formData.get('farm_size_unit'), 'acre');
    assert.equal(res.formData.get('district'), 'Belagavi');
    assert.equal(res.formData.get('language'), 'English');
  });

  it('rejects more than 3 photos in chatbot FormData', () => {
    const file = new File([new Uint8Array([1, 2, 3])], 'leaf.jpg', { type: 'image/jpeg' });
    const res = buildChatbotFormData({
      message: 'Check leaves',
      farmDetails: SAMPLE_FARM,
      language: 'en',
      files: [file, file, file, file],
    });
    assert.equal(res.valid, false);
  });

  it('builds strict loss optimization JSON payload without unknown fields and rejects affected_area > farm_size', () => {
    const invalid = buildLossOptimizationPayload({
      farmDetails: SAMPLE_FARM,
      lastYearValueInr: 125000,
      thisYearValueInr: 35000,
      affectedArea: 6,
      language: 'en',
    });
    assert.equal(invalid.valid, false);

    const valid = buildLossOptimizationPayload({
      farmDetails: SAMPLE_FARM,
      lastYearValueInr: 125000,
      thisYearValueInr: 35000,
      affectedArea: 4,
      recoveryBudgetInr: 10000,
      damageReason: 'Severe fungal disease',
      language: 'kn',
    });
    assert.equal(valid.valid, true);
    assert.ok(valid.payload);
    assert.equal(valid.payload.last_year_yield_value_inr, 125000);
    assert.equal(valid.payload.this_year_yield_value_inr, 35000);
    assert.equal(valid.payload.affected_area, 4);
    assert.equal(valid.payload.language, 'Kannada');
    assert.equal('session_id' in valid.payload, false);
    assert.equal('last_year_yield' in valid.payload, false);
  });

  it('computes local revenue gap exactly per Section 4 example', () => {
    const gap = computeLocalRevenueGap({
      lastYearValueInr: 125000,
      thisYearValueInr: 35000,
      affectedArea: 4,
      farmSize: 5,
      farmSizeUnit: 'acre',
    });
    assert.equal(gap.revenueGapInr, 90000);
    assert.equal(gap.reductionPct, 72);
    assert.equal(gap.affectedPct, 80);
  });

  it('enforces 2-4 photos with at least 2 distinct dates and omits district on monitoring FormData', () => {
    const f1 = new File([new Uint8Array([1])], 'w1.jpg', { type: 'image/jpeg' });
    const f2 = new File([new Uint8Array([2])], 'w2.jpg', { type: 'image/jpeg' });

    const sameDate = buildHealthMonitoringFormData({
      photos: [
        { file: f1, date: '2026-11-15' },
        { file: f2, date: '2026-11-15' },
      ],
      farmDetails: SAMPLE_FARM,
      language: 'en',
    });
    assert.equal(sameDate.valid, false);

    const ok = buildHealthMonitoringFormData({
      photos: [
        { file: f1, date: '2026-11-15' },
        { file: f2, date: '2026-11-25' },
      ],
      farmDetails: SAMPLE_FARM,
      message: 'Compare visible changes',
      language: 'hi',
    });
    assert.equal(ok.valid, true);
    assert.ok(ok.formData);
    assert.equal(ok.formData.get('district'), null);
    assert.equal(ok.formData.get('date_1'), '2026-11-15');
    assert.equal(ok.formData.get('date_2'), '2026-11-25');
    assert.equal(ok.formData.get('last_year_yield_value_inr'), '125000');
    assert.equal(ok.formData.get('language'), 'Hindi');
  });

  it('discriminates text vs diagnosis chatbot responses accurately', () => {
    const textResp = { session_id: 's1', status: 'success' as const, answer: 'Water near roots.' };
    assert.equal(isChatbotTextResponse(textResp), true);
    assert.equal(isChatbotDiagnosisResponse(textResp), false);

    const diagResp = {
      session_id: 's1',
      status: 'partial' as const,
      disease_name: 'Suspected early blight',
      severity: 'high' as const,
      severity_explanation: null,
      symptoms: [],
      treatment: [],
      treatment_options: [],
      precautions: [],
      can_recover: 'conditional' as const,
      recovery_period: null,
      recovery_conditions: [],
      crop_loss_risk: 'high' as const,
      government_schemes: [],
      scheme_status: 'not_verified' as const,
      financial_assistance_guidance: null,
      summary: 'Confirm locally.',
    };
    assert.equal(isChatbotTextResponse(diagResp), false);
    assert.equal(isChatbotDiagnosisResponse(diagResp), true);
  });
});
