import test from 'node:test';
import assert from 'node:assert/strict';
import type { FinancialScheme } from '../types/cropsense';
import { filterFinancialSchemes, isSchemeTailoredToFarm } from './schemeFilters';

const SAMPLE_SCHEMES: FinancialScheme[] = [
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    shortName: 'PMFBY',
    category: 'Insurance',
    authority: 'Ministry of Agriculture',
    states: ['All India'],
    crops: ['All Crops'],
    description: 'Comprehensive crop insurance against natural calamities and pests.',
    benefits: ['Low farmer premium'],
    eligibility: ['All farmers growing notified crops'],
    requiredDocuments: ['Aadhaar', 'Land record'],
    applicationUrl: 'https://pmfby.gov.in',
  },
  {
    id: 'mh-relief',
    name: 'Maharashtra Shetkari Crop Loss Compensation',
    category: 'Compensation',
    authority: 'Government of Maharashtra',
    states: ['Maharashtra'],
    crops: ['Cotton', 'Soybean'],
    description: 'State input subsidy relief for unseasonal rainfall crop damage.',
    benefits: ['Per-hectare direct relief transfer'],
    eligibility: ['Maharashtra farmers with >=33% damage'],
    requiredDocuments: ['7/12 extract'],
    applicationUrl: 'https://mahadbt.maharashtra.gov.in',
  },
  {
    id: 'ka-grant',
    name: 'Karnataka Krishi Bhagya Subsidy',
    category: 'Subsidies',
    authority: 'Government of Karnataka',
    states: ['Karnataka'],
    crops: ['All Crops'],
    description: 'Rainwater harvesting farm pond and drip subsidy.',
    benefits: ['Up to 80% subsidy on farm ponds'],
    eligibility: ['Dryland farmers in Karnataka'],
    requiredDocuments: ['RTC', 'Aadhaar'],
    applicationUrl: 'https://raitamitra.karnataka.gov.in',
  },
];

test('isSchemeTailoredToFarm matches All India and specific state/crop profiles', () => {
  assert.equal(isSchemeTailoredToFarm(SAMPLE_SCHEMES[0], { state: 'Punjab', crop: 'Wheat' }), true);
  assert.equal(
    isSchemeTailoredToFarm(SAMPLE_SCHEMES[1], { state: 'Maharashtra', crop: 'Cotton' }),
    true
  );
  assert.equal(
    isSchemeTailoredToFarm(SAMPLE_SCHEMES[1], { state: 'Karnataka', crop: 'Cotton' }),
    false
  );
});

test('filterFinancialSchemes filters by category, search query, and farm match', () => {
  const insuranceOnly = filterFinancialSchemes(SAMPLE_SCHEMES, {
    searchQuery: '',
    category: 'Insurance',
  });
  assert.equal(insuranceOnly.length, 1);
  assert.equal(insuranceOnly[0].id, 'pmfby');

  const queryMatch = filterFinancialSchemes(SAMPLE_SCHEMES, {
    searchQuery: 'farm pond',
    category: 'All',
  });
  assert.equal(queryMatch.length, 1);
  assert.equal(queryMatch[0].id, 'ka-grant');

  const farmMatched = filterFinancialSchemes(SAMPLE_SCHEMES, {
    searchQuery: '',
    category: 'All',
    onlyMatchingFarm: true,
    farmDetails: { state: 'Maharashtra', crop: 'Cotton' },
  });
  assert.equal(farmMatched.length, 2);
  assert.ok(farmMatched.some((s) => s.id === 'mh-relief'));
  assert.ok(!farmMatched.some((s) => s.id === 'ka-grant'));
});
