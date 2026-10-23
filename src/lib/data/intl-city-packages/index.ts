// International city packages index (Round 3 / S2). BUILD ONLY.
import type { IntlCityPackage } from './types';
import { CITY_ABU_DHABI } from './abu-dhabi';
import { CITY_DOHA } from './doha';
import { CITY_DUBAI } from './dubai';
import { CITY_ISTANBUL } from './istanbul';
import { CITY_JEDDAH } from './jeddah';
import { CITY_LONDON } from './london';
import { CITY_NEW_YORK } from './new-york';
import { CITY_RIYADH } from './riyadh';
import { CITY_SHARJAH } from './sharjah';
import { CITY_SYDNEY } from './sydney';
import { CITY_TORONTO } from './toronto';

export const INTL_CITY_PACKAGES: Record<string, IntlCityPackage> = {
  'abu-dhabi': CITY_ABU_DHABI,
  'doha': CITY_DOHA,
  'dubai': CITY_DUBAI,
  'istanbul': CITY_ISTANBUL,
  'jeddah': CITY_JEDDAH,
  'london': CITY_LONDON,
  'new-york': CITY_NEW_YORK,
  'riyadh': CITY_RIYADH,
  'sharjah': CITY_SHARJAH,
  'sydney': CITY_SYDNEY,
  'toronto': CITY_TORONTO,
};

export * from './types';
export { CITY_ABU_DHABI } from './abu-dhabi';
export { CITY_DOHA } from './doha';
export { CITY_DUBAI } from './dubai';
export { CITY_ISTANBUL } from './istanbul';
export { CITY_JEDDAH } from './jeddah';
export { CITY_LONDON } from './london';
export { CITY_NEW_YORK } from './new-york';
export { CITY_RIYADH } from './riyadh';
export { CITY_SHARJAH } from './sharjah';
export { CITY_SYDNEY } from './sydney';
export { CITY_TORONTO } from './toronto';
