// International city packages batch 2 index (Round 3 / S2b). BUILD ONLY.
import type { IntlCityPackage } from './types';
import { CITY_ALEXANDRIA } from './alexandria';
import { CITY_BRISBANE } from './brisbane';
import { CITY_CAIRO } from './cairo';
import { CITY_CANBERRA } from './canberra';
import { CITY_GEORGE_TOWN } from './george-town';
import { CITY_KUALA_LUMPUR } from './kuala-lumpur';
import { CITY_KUWAIT_CITY } from './kuwait-city';
import { CITY_MUSCAT } from './muscat';
import { CITY_VANCOUVER } from './vancouver';

export const INTL_CITY_PACKAGES_BATCH2: Record<string, IntlCityPackage> = {
  'alexandria': CITY_ALEXANDRIA,
  'brisbane': CITY_BRISBANE,
  'cairo': CITY_CAIRO,
  'canberra': CITY_CANBERRA,
  'george-town': CITY_GEORGE_TOWN,
  'kuala-lumpur': CITY_KUALA_LUMPUR,
  'kuwait-city': CITY_KUWAIT_CITY,
  'muscat': CITY_MUSCAT,
  'vancouver': CITY_VANCOUVER,
};

export * from './types';
export { CITY_ALEXANDRIA } from './alexandria';
export { CITY_BRISBANE } from './brisbane';
export { CITY_CAIRO } from './cairo';
export { CITY_CANBERRA } from './canberra';
export { CITY_GEORGE_TOWN } from './george-town';
export { CITY_KUALA_LUMPUR } from './kuala-lumpur';
export { CITY_KUWAIT_CITY } from './kuwait-city';
export { CITY_MUSCAT } from './muscat';
export { CITY_VANCOUVER } from './vancouver';
