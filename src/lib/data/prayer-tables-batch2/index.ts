// Prayer tables batch 2 index (Round 3 / S5b). BUILD ONLY. Method notes + Ramadan hooks: see ../prayer-tables/README.md.
import type { PrayerTable } from './types';
import { PRAYER_ALEXANDRIA } from './alexandria';
import { PRAYER_BRISBANE } from './brisbane';
import { PRAYER_CAIRO } from './cairo';
import { PRAYER_CANBERRA } from './canberra';
import { PRAYER_GEORGE_TOWN } from './george-town';
import { PRAYER_KUALA_LUMPUR } from './kuala-lumpur';
import { PRAYER_KUWAIT_CITY } from './kuwait-city';
import { PRAYER_MUSCAT } from './muscat';
import { PRAYER_VANCOUVER } from './vancouver';

export const PRAYER_TABLES_BATCH2: Record<string, PrayerTable> = {
  'alexandria': PRAYER_ALEXANDRIA,
  'brisbane': PRAYER_BRISBANE,
  'cairo': PRAYER_CAIRO,
  'canberra': PRAYER_CANBERRA,
  'george-town': PRAYER_GEORGE_TOWN,
  'kuala-lumpur': PRAYER_KUALA_LUMPUR,
  'kuwait-city': PRAYER_KUWAIT_CITY,
  'muscat': PRAYER_MUSCAT,
  'vancouver': PRAYER_VANCOUVER,
};

export * from './types';
export { PRAYER_ALEXANDRIA } from './alexandria';
export { PRAYER_BRISBANE } from './brisbane';
export { PRAYER_CAIRO } from './cairo';
export { PRAYER_CANBERRA } from './canberra';
export { PRAYER_GEORGE_TOWN } from './george-town';
export { PRAYER_KUALA_LUMPUR } from './kuala-lumpur';
export { PRAYER_KUWAIT_CITY } from './kuwait-city';
export { PRAYER_MUSCAT } from './muscat';
export { PRAYER_VANCOUVER } from './vancouver';
