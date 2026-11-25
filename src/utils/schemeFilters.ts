import type { FarmDetails, FinancialScheme, SchemeCategory } from '../types/cropsense';

export function isSchemeTailoredToFarm(
  scheme: FinancialScheme,
  farmDetails: Pick<FarmDetails, 'state' | 'crop'>
): boolean {
  const stateMatch =
    scheme.states.includes('All India') ||
    (Boolean(farmDetails.state) &&
      scheme.states.some((s) => s.toLowerCase() === farmDetails.state.toLowerCase()));
  const cropMatch =
    scheme.crops.includes('All Crops') ||
    (Boolean(farmDetails.crop) &&
      scheme.crops.some((c) => c.toLowerCase() === farmDetails.crop.toLowerCase()));

  return stateMatch && cropMatch;
}

export function filterFinancialSchemes(
  schemes: FinancialScheme[],
  options: {
    searchQuery: string;
    category: SchemeCategory | 'All';
    onlyMatchingFarm?: boolean;
    farmDetails?: Pick<FarmDetails, 'state' | 'crop'>;
  }
): FinancialScheme[] {
  const query = options.searchQuery.trim().toLowerCase();

  return schemes
    .filter((scheme) => {
      if (options.category !== 'All' && scheme.category !== options.category) {
        return false;
      }

      if (options.onlyMatchingFarm && options.farmDetails) {
        if (!isSchemeTailoredToFarm(scheme, options.farmDetails)) {
          return false;
        }
      }

      if (!query) return true;

      const haystack = [
        scheme.name,
        scheme.shortName ?? '',
        scheme.authority,
        scheme.category,
        scheme.description,
        ...scheme.states,
        ...scheme.crops,
        ...scheme.benefits,
        ...scheme.eligibility,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    })
    .sort((a, b) => {
      if (!options.farmDetails) return 0;
      const aMatch = isSchemeTailoredToFarm(a, options.farmDetails) ? 1 : 0;
      const bMatch = isSchemeTailoredToFarm(b, options.farmDetails) ? 1 : 0;
      return bMatch - aMatch;
    });
}
