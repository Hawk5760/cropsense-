import type { FarmDetails, SatelliteStatus } from '../types/cropsense';

/**
 * API-ready satellite data architecture for Sentinel-2, Landsat, and Google Earth Engine.
 * Explicitly reports connected: false until live credentials and parcel geometry feeds are configured.
 */
export async function getSatelliteProviderStatus(
  _farmDetails: FarmDetails
): Promise<SatelliteStatus> {
  return {
    connected: false,
    supportedProviders: ['Sentinel-2', 'Landsat', 'Google Earth Engine'],
    availableYears: [2022, 2023, 2024, 2025, 2026],
    message:
      'Historical satellite analysis is coming soon. Connect Sentinel-2, Landsat, or Google Earth Engine to retrieve verified parcel imagery.',
  };
}
