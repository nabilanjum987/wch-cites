// Country packages index (Round 3 / S1). BUILD ONLY.
import type { CountryPackage } from './types';
import { COUNTRY_BANGLADESH } from './bangladesh';
import { COUNTRY_INDIA } from './india';
import { COUNTRY_SAUDI_ARABIA } from './saudi-arabia';
import { COUNTRY_TURKIYE } from './turkiye';
import { COUNTRY_UNITED_ARAB_EMIRATES } from './united-arab-emirates';
import { COUNTRY_UNITED_KINGDOM } from './united-kingdom';
import { COUNTRY_UNITED_STATES } from './united-states';

export const COUNTRY_PACKAGES: Record<string, CountryPackage> = {
  'bangladesh': COUNTRY_BANGLADESH,
  'india': COUNTRY_INDIA,
  'saudi-arabia': COUNTRY_SAUDI_ARABIA,
  'turkiye': COUNTRY_TURKIYE,
  'united-arab-emirates': COUNTRY_UNITED_ARAB_EMIRATES,
  'united-kingdom': COUNTRY_UNITED_KINGDOM,
  'united-states': COUNTRY_UNITED_STATES,
};

export * from './types';
export { COUNTRY_BANGLADESH } from './bangladesh';
export { COUNTRY_INDIA } from './india';
export { COUNTRY_SAUDI_ARABIA } from './saudi-arabia';
export { COUNTRY_TURKIYE } from './turkiye';
export { COUNTRY_UNITED_ARAB_EMIRATES } from './united-arab-emirates';
export { COUNTRY_UNITED_KINGDOM } from './united-kingdom';
export { COUNTRY_UNITED_STATES } from './united-states';
