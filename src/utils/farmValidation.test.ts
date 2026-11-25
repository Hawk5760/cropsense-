import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatIndianCurrency,
  getFarmLocationLabel,
  validateFarmDetails,
} from './farmValidation';
import type { FarmDetails } from '../types/cropsense';

const validBase: FarmDetails = {
  state: 'Maharashtra',
  city: 'Amravati',
  district: 'Amravati',
  latitude: '',
  longitude: '',
  farmSize: '5',
  farmSizeUnit: 'Acres',
  crop: 'Cotton',
  season: 'Kharif',
  lastYearProduction: '40',
  yieldUnit: 'quintal',
  lastYearYield: '125000',
};

test('validateFarmDetails accepts valid state/city farm profile', () => {
  const result = validateFarmDetails(validBase);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('validateFarmDetails accepts coordinates when state and city are blank', () => {
  const result = validateFarmDetails({
    ...validBase,
    state: '',
    city: '',
    latitude: '20.932',
    longitude: '77.7523',
  });
  assert.equal(result.valid, true);
});

test('validateFarmDetails rejects missing location and coordinates', () => {
  const result = validateFarmDetails({
    ...validBase,
    state: '',
    city: '',
    latitude: '',
    longitude: '',
  });
  assert.equal(result.valid, false);
  assert.equal(result.errors.location, 'locationOrCoordsRequired');
});

test('validateFarmDetails rejects out-of-range coordinates and non-positive farm size', () => {
  const result = validateFarmDetails({
    ...validBase,
    latitude: '95',
    longitude: '-200',
    farmSize: '0',
    lastYearYield: '-500',
  });
  assert.equal(result.valid, false);
  assert.equal(result.errors.latitude, 'invalidLatitude');
  assert.equal(result.errors.longitude, 'invalidLongitude');
  assert.equal(result.errors.farmSize, 'invalidFarmSize');
  assert.equal(result.errors.lastYearYield, 'invalidYield');
});

test('formatIndianCurrency formats INR grouping cleanly', () => {
  assert.equal(formatIndianCurrency('125000'), '1,25,000');
  assert.equal(formatIndianCurrency(1250000), '12,50,000');
  assert.equal(formatIndianCurrency(''), '');
});

test('getFarmLocationLabel falls back to coordinates if city/state empty', () => {
  assert.equal(getFarmLocationLabel(validBase), 'Amravati, Maharashtra');
  assert.equal(
    getFarmLocationLabel({ ...validBase, state: '', city: '', latitude: '20.93', longitude: '77.75' }),
    '20.93°, 77.75°'
  );
});
