import type {
  DiseaseSeverity,
  HealthRiskColor,
  WeeklyCropHealthEntry,
} from '../types/cropsense';

export interface CropHealthOverview {
  latestHealthScore: number;
  healthScoreDelta: number;
  latestOutbreakProbability: number;
  outbreakDelta: number;
  overallRiskColor: HealthRiskColor;
  trendDirection: 'improving' | 'stable' | 'declining';
  severityProgression: DiseaseSeverity[];
}

export function deriveRiskColor(
  healthScore: number,
  outbreakProbability: number,
  severity: DiseaseSeverity
): HealthRiskColor {
  if (
    severity === 'Critical' ||
    severity === 'High' ||
    healthScore < 55 ||
    outbreakProbability >= 60
  ) {
    return 'red';
  }
  if (severity === 'Moderate' || healthScore < 78 || outbreakProbability >= 30) {
    return 'yellow';
  }
  return 'green';
}

export function sortWeeklyEntriesChronologically(
  entries: WeeklyCropHealthEntry[]
): WeeklyCropHealthEntry[] {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date));
}

export function summarizeCropHealthTrend(
  entries: WeeklyCropHealthEntry[]
): CropHealthOverview | null {
  if (!entries.length) return null;

  const sorted = sortWeeklyEntriesChronologically(entries);
  const latest = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : latest;

  const healthScoreDelta = latest.healthScore - previous.healthScore;
  const outbreakDelta = latest.diseaseOutbreakProbability - previous.diseaseOutbreakProbability;

  let trendDirection: 'improving' | 'stable' | 'declining' = 'stable';
  if (healthScoreDelta >= 3) trendDirection = 'improving';
  else if (healthScoreDelta <= -3) trendDirection = 'declining';

  const overallRiskColor = deriveRiskColor(
    latest.healthScore,
    latest.diseaseOutbreakProbability,
    latest.diseaseSeverity
  );

  return {
    latestHealthScore: latest.healthScore,
    healthScoreDelta,
    latestOutbreakProbability: latest.diseaseOutbreakProbability,
    outbreakDelta,
    overallRiskColor,
    trendDirection,
    severityProgression: sorted.map((item) => item.diseaseSeverity),
  };
}
