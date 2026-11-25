import test from 'node:test';
import assert from 'node:assert/strict';
import type { WeeklyCropHealthEntry } from '../types/cropsense';
import {
  deriveRiskColor,
  sortWeeklyEntriesChronologically,
  summarizeCropHealthTrend,
} from './cropHealthMetrics';

test('deriveRiskColor maps green, yellow, and red thresholds accurately', () => {
  assert.equal(deriveRiskColor(86, 14, 'Low'), 'green');
  assert.equal(deriveRiskColor(70, 35, 'Moderate'), 'yellow');
  assert.equal(deriveRiskColor(48, 68, 'High'), 'red');
  assert.equal(deriveRiskColor(82, 20, 'Critical'), 'red');
});

test('summarizeCropHealthTrend sorts entries and detects declining/improving trends', () => {
  const entries: WeeklyCropHealthEntry[] = [
    {
      id: 'w2',
      weekLabel: 'Week 2',
      date: '2026-10-15',
      healthScore: 68,
      diseaseOutbreakProbability: 42,
      diseaseSeverity: 'Moderate',
      irrigationStatus: 'Excessive',
      stressLevel: 'yellow',
      stressSummary: 'Canopy humidity rising',
      explanation: 'Early leaf spotting noted.',
      recommendedActions: ['Improve drainage'],
    },
    {
      id: 'w1',
      weekLabel: 'Week 1',
      date: '2026-10-08',
      healthScore: 84,
      diseaseOutbreakProbability: 15,
      diseaseSeverity: 'Low',
      irrigationStatus: 'Optimal',
      stressLevel: 'green',
      stressSummary: 'Healthy foliage',
      explanation: 'Uniform vegetative growth.',
      recommendedActions: ['Continue routine scouting'],
    },
  ];

  const sorted = sortWeeklyEntriesChronologically(entries);
  assert.equal(sorted[0].id, 'w1');
  assert.equal(sorted[1].id, 'w2');

  const summary = summarizeCropHealthTrend(entries);
  assert.ok(summary);
  assert.equal(summary.latestHealthScore, 68);
  assert.equal(summary.healthScoreDelta, -16);
  assert.equal(summary.outbreakDelta, 27);
  assert.equal(summary.trendDirection, 'declining');
  assert.equal(summary.overallRiskColor, 'yellow');
  assert.deepEqual(summary.severityProgression, ['Low', 'Moderate']);
});
