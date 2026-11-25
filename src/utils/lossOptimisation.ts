import type {
  AreaUnit,
  LossOptimisationInput,
  LossOptimisationResult,
  RecoveryStrategy,
} from '../types/cropsense';

/**
 * Convert farm area in Acres, Hectares, or Square Metres into Acres for normalized per-acre estimates.
 */
export function convertFarmSizeToAcres(size: number, unit: AreaUnit): number {
  if (!Number.isFinite(size) || size <= 0) return 0;
  if (unit === 'Hectares') return size * 2.47105;
  if (unit === 'Square Metres') return size / 4046.8564224;
  return size;
}

function roundToHundred(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.round(amount / 100) * 100;
}

/**
 * Computes transparent, conservative Indian agricultural loss-recovery estimates
 * across 5 alternative revenue & financial assistance pathways.
 */
export function calculateLossOptimisation(
  input: LossOptimisationInput
): LossOptimisationResult {
  const lastYear = Math.max(0, Number.isFinite(input.lastYearYieldInr) ? input.lastYearYieldInr : 0);
  const currentYear = Math.max(
    0,
    Number.isFinite(input.currentYearYieldInr) ? input.currentYearYieldInr : 0
  );
  const explicitLoss =
    input.estimatedLossInr !== undefined && Number.isFinite(input.estimatedLossInr)
      ? Math.max(0, input.estimatedLossInr)
      : undefined;

  const computedYieldDropInr = Math.max(0, lastYear - currentYear);
  const effectiveLossInr =
    explicitLoss !== undefined && explicitLoss > 0 ? explicitLoss : computedYieldDropInr;

  const yoyChangePct =
    lastYear > 0 ? Number((((currentYear - lastYear) / lastYear) * 100).toFixed(1)) : 0;

  const acres = Math.max(0.5, Number.isFinite(input.farmSizeAcres) ? input.farmSizeAcres : 0);
  const hasSufficientData = lastYear > 0 && effectiveLossInr > 0;

  const isBiomassRichCrop = ['Cotton', 'Sugarcane', 'Rice', 'Wheat', 'Maize', 'Soybean'].includes(
    input.crop
  );
  const isFodderSafeCrop = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Sugarcane'].includes(input.crop);

  // 1. Agricultural Carbon Credit Programmes (illustrative Indian regenerative carbon pools: ~₹1,400–₹3,200/acre/year)
  const carbonMin = roundToHundred(acres * 1400);
  const carbonMax = roundToHundred(acres * 3200);
  const carbonTypical = roundToHundred((carbonMin + carbonMax) / 2);

  // 2. Composting & Organic Fertilizer from suitable spoiled crops (~8–15% of loss or ₹2,000–₹4,500/acre)
  const compostMin = hasSufficientData
    ? roundToHundred(Math.min(effectiveLossInr * 0.1, acres * 2200))
    : roundToHundred(acres * 1800);
  const compostMax = hasSufficientData
    ? roundToHundred(Math.min(effectiveLossInr * 0.18, acres * 4500))
    : roundToHundred(acres * 3600);
  const compostTypical = roundToHundred((compostMin + compostMax) / 2);

  // 3. Selling Safe Crop Residues as Cattle Feed (dry fodder / bhusa / stover)
  const fodderMultiplier = isFodderSafeCrop ? 1 : 0.45;
  const cattleMin = roundToHundred(acres * 2000 * fodderMultiplier);
  const cattleMax = roundToHundred(acres * 4200 * fodderMultiplier);
  const cattleTypical = roundToHundred((cattleMin + cattleMax) / 2);

  // 4. Agricultural Waste Monetization (bio-briquettes, biomass pellets, mulch, biochar)
  const wasteMultiplier = isBiomassRichCrop ? 1 : 0.6;
  const wasteMin = roundToHundred(acres * 1600 * wasteMultiplier);
  const wasteMax = roundToHundred(acres * 3500 * wasteMultiplier);
  const wasteTypical = roundToHundred((wasteMin + wasteMax) / 2);

  // 5. Eligible Compensation & Financial Assistance (PMFBY / State SDRF calamity relief: ~25–55% of insured loss)
  const compMin = hasSufficientData ? roundToHundred(effectiveLossInr * 0.25) : 0;
  const compMax = hasSufficientData ? roundToHundred(effectiveLossInr * 0.55) : 0;
  const compTypical = hasSufficientData ? roundToHundred(effectiveLossInr * 0.38) : 0;

  const strategies: RecoveryStrategy[] = [
    {
      id: 'compensation',
      estimatedMinInr: compMin,
      estimatedMaxInr: compMax,
      estimatedTypicalInr: compTypical,
      feasibility: hasSufficientData ? 'High' : 'Conditional',
      benefits: [
        'Direct bank transfer under PMFBY localized calamity or post-harvest loss cover',
        'State Disaster Response Fund (SDRF) crop loss input subsidy for notified damage (>=33% loss)',
        'Helps stabilize working capital before the next sowing cycle',
      ],
      eligibility: [
        'Active PMFBY enrollment or Kisan Credit Card (KCC) crop insurance cover for the current season',
        'Crop damage reported within 72 hours of localized weather/pest event via Krishi Rakshak helpline (14447)',
        `Verified land record (7/12 / RTC / Khasra) and Aadhaar-seeded bank account in ${input.state || 'your state'}`,
      ],
      actionSteps: [
        'Photograph damaged plots with date/location timestamps and preserve weekly CropSense health logs',
        'Call 14447 (Krishi Rakshak Portal) or submit loss intimation on the PMFBY Crop Insurance app within 72 hours',
        'Follow up with the Village Agriculture Officer / Patwari for joint panchnama verification',
      ],
    },
    {
      id: 'cattle_feed',
      estimatedMinInr: cattleMin,
      estimatedMaxInr: cattleMax,
      estimatedTypicalInr: cattleTypical,
      feasibility: isFodderSafeCrop ? 'High' : 'Conditional',
      benefits: [
        'Immediate cash flow from nearby dairy cooperatives, gaushalas, and fodder aggregators',
        'Avoids open field burning while converting non-marketable healthy stalks into dry fodder or silage',
        'Strong seasonal demand during dry winter and summer fodder deficit windows',
      ],
      eligibility: [
        `Applies strictly to pesticide-safe, non-toxic, mold-free ${input.crop} crop residues (never feed fungal-rot or freshly sprayed biomass to livestock)`,
        'Requires sun-drying or proper ensiling to prevent mycotoxin contamination',
      ],
      actionSteps: [
        'Separate clean, uninfected stalks/leaves from any diseased or chemically treated plant material',
        'Verify pesticide waiting period (PHI) has passed and check with a local veterinarian if unsure',
        'Contact district dairy union (e.g., Amul/KMF/Mahanand) or local FPO fodder banks for bulk pickup rates',
      ],
    },
    {
      id: 'composting',
      estimatedMinInr: compostMin,
      estimatedMaxInr: compostMax,
      estimatedTypicalInr: compostTypical,
      feasibility: 'High',
      benefits: [
        'Reduces next-season synthetic NPK fertilizer spend by 20–30% while improving soil organic carbon',
        'Generates sellable vermicompost or NADEP compost (₹6–₹10/kg local nursery & FPO demand)',
        'Supports moisture retention and resilience against future dry spells',
      ],
      eligibility: [
        'Suitable for spoiled non-hazardous produce, trimmings, and crop biomass',
        'For diseased plant material, use high-temperature thermophilic composting (>55°C) or keep separate from nursery beds',
      ],
      actionSteps: [
        'Shred suitable organic waste and layer with cow dung slurry and microbial decomposer (e.g., PUSA Decomposer)',
        'Maintain 50–60% moisture and turn the heap every 15 days for 45–60 days',
        'Apply cured compost to next season’s soil preparation or bag surplus for local FPO sale',
      ],
    },
    {
      id: 'waste_monetization',
      estimatedMinInr: wasteMin,
      estimatedMaxInr: wasteMax,
      estimatedTypicalInr: wasteTypical,
      feasibility: isBiomassRichCrop ? 'High' : 'Medium',
      benefits: [
        'Converts woody stalks, husks, and shells into biomass pellets, briquettes, or biochar revenue',
        'Eligible for state crop residue management (CRM) baler subsidies through Custom Hiring Centres',
        'Creates repeat buyer relationships with thermal power co-firing plants and brick kilns',
      ],
      eligibility: [
        `Best suited for high-lignin residues such as Cotton stalks, Sugarcane trash, Rice straw, or Maize cobs`,
        'Requires dry collection/baling via local FPO or Custom Hiring Centre (CHC)',
      ],
      actionSteps: [
        'Book a subsidized shredder/baler through the nearest Krishi Vigyan Kendra or CHC app',
        'Aggregate baled stalks with neighbouring farmers via an FPO to meet buyer truckload minimums',
        'List dry biomass supply with regional pellet manufacturers or biogas/CBG plants under SATAT',
      ],
    },
    {
      id: 'carbon_credit',
      estimatedMinInr: carbonMin,
      estimatedMaxInr: carbonMax,
      estimatedTypicalInr: carbonTypical,
      feasibility: 'Medium',
      benefits: [
        'Recurring annual supplementary income per acre from verified soil organic carbon sequestration',
        'Improves soil structure, water-holding capacity, and long-term crop resilience',
        'Often bundled with free agronomy advisory and reduced tillage inputs from carbon aggregators',
      ],
      eligibility: [
        'Adoption of qualifying regenerative practices: zero/minimum tillage, residue mulching (no burning), cover cropping, or AWD irrigation (for Rice)',
        'Enrollment through a verified Indian FPO or carbon-project aggregator (Verra / Gold Standard / Indian Carbon Market)',
      ],
      actionSteps: [
        'Check with your local FPO or state agriculture extension office for active regenerative carbon pools',
        'Maintain geo-tagged seasonal records of tillage, residue retention, and organic inputs',
        'Enrol acreage before the next Kharif/Rabi sowing window for baseline soil carbon sampling',
      ],
    },
  ];

  // Raw sum capped realistically at 90% of effective loss when loss exists (never promise >100% recovery)
  const rawTypicalSum = strategies.reduce((acc, s) => acc + s.estimatedTypicalInr, 0);
  const rawMinSum = strategies.reduce((acc, s) => acc + s.estimatedMinInr, 0);
  const rawMaxSum = strategies.reduce((acc, s) => acc + s.estimatedMaxInr, 0);

  const estimatedRecoverableInr = hasSufficientData
    ? roundToHundred(Math.min(effectiveLossInr * 0.9, rawTypicalSum))
    : 0;
  const estimatedRecoverableMinInr = hasSufficientData
    ? roundToHundred(Math.min(effectiveLossInr * 0.75, rawMinSum))
    : 0;
  const estimatedRecoverableMaxInr = hasSufficientData
    ? roundToHundred(Math.min(effectiveLossInr * 0.95, rawMaxSum))
    : 0;

  const remainingLossGapInr = hasSufficientData
    ? Math.max(0, effectiveLossInr - estimatedRecoverableInr)
    : 0;

  const recoveryCoveragePct =
    hasSufficientData && effectiveLossInr > 0
      ? Math.min(100, Math.round((estimatedRecoverableInr / effectiveLossInr) * 100))
      : 0;

  return {
    lastYearYieldInr: lastYear,
    currentYearYieldInr: currentYear,
    computedYieldDropInr,
    effectiveLossInr,
    yoyChangePct,
    estimatedRecoverableInr,
    estimatedRecoverableMinInr,
    estimatedRecoverableMaxInr,
    remainingLossGapInr,
    recoveryCoveragePct,
    hasSufficientData,
    strategies,
  };
}
