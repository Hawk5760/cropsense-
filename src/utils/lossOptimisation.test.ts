import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateLossOptimisation, convertFarmSizeToAcres } from './lossOptimisation';

test('convertFarmSizeToAcres converts Hectares, Square Metres, and Acres accurately', () => {
  assert.equal(convertFarmSizeToAcres(5, 'Acres'), 5);
  assert.ok(Math.abs(convertFarmSizeToAcres(1, 'Hectares') - 2.47105) < 0.001);
  assert.ok(Math.abs(convertFarmSizeToAcres(4046.8564224, 'Square Metres') - 1) < 0.001);
  assert.equal(convertFarmSizeToAcres(-2, 'Acres'), 0);
});

test('calculateLossOptimisation computes YoY drop, recoverable amount, remaining gap, and 5 strategies', () => {
  const result = calculateLossOptimisation({
    lastYearYieldInr: 125000,
    currentYearYieldInr: 75000,
    farmSizeAcres: 5,
    crop: 'Cotton',
    state: 'Maharashtra',
  });

  assert.equal(result.hasSufficientData, true);
  assert.equal(result.computedYieldDropInr, 50000);
  assert.equal(result.effectiveLossInr, 50000);
  assert.equal(result.yoyChangePct, -40);
  assert.equal(result.strategies.length, 5);
  assert.ok(result.estimatedRecoverableInr > 0);
  assert.ok(result.estimatedRecoverableInr <= result.effectiveLossInr);
  assert.equal(
    result.remainingLossGapInr,
    result.effectiveLossInr - result.estimatedRecoverableInr
  );
  assert.ok(result.recoveryCoveragePct > 0 && result.recoveryCoveragePct <= 95);
});

test('calculateLossOptimisation respects explicit estimatedLossInr override when provided', () => {
  const result = calculateLossOptimisation({
    lastYearYieldInr: 100000,
    currentYearYieldInr: 80000,
    estimatedLossInr: 35000,
    farmSizeAcres: 4,
    crop: 'Wheat',
    state: 'Punjab',
  });

  assert.equal(result.computedYieldDropInr, 20000);
  assert.equal(result.effectiveLossInr, 35000);
  assert.equal(
    result.remainingLossGapInr,
    result.effectiveLossInr - result.estimatedRecoverableInr
  );
});

test('calculateLossOptimisation handles zero loss cleanly without negative values', () => {
  const result = calculateLossOptimisation({
    lastYearYieldInr: 100000,
    currentYearYieldInr: 115000,
    farmSizeAcres: 5,
    crop: 'Rice',
    state: 'Karnataka',
  });

  assert.equal(result.hasSufficientData, false);
  assert.equal(result.effectiveLossInr, 0);
  assert.equal(result.estimatedRecoverableInr, 0);
  assert.equal(result.remainingLossGapInr, 0);
  assert.equal(result.yoyChangePct, 15);
  assert.equal(result.strategies.length, 5);
});
