// Places batch 1 index (Round 3 / S3). BUILD ONLY — data rows, no pages.
import type { PlaceRow } from './types';
import { PLACE_BADSHAHI_MOSQUE } from './badshahi-mosque';
import { PLACE_BIG_BEN } from './big-ben';
import { PLACE_BLUE_MOSQUE } from './blue-mosque';
import { PLACE_CN_TOWER } from './cn-tower';
import { PLACE_EIFFEL_TOWER } from './eiffel-tower';
import { PLACE_FAISAL_MOSQUE } from './faisal-mosque';
import { PLACE_HAGIA_SOPHIA } from './hagia-sophia';
import { PLACE_SHEIKH_ZAYED_GRAND_MOSQUE } from './sheikh-zayed-grand-mosque';
import { PLACE_STATUE_OF_LIBERTY } from './statue-of-liberty';
import { PLACE_SYDNEY_OPERA_HOUSE } from './sydney-opera-house';

export const PLACES_BATCH1: Record<string, PlaceRow> = {
  'badshahi-mosque': PLACE_BADSHAHI_MOSQUE,
  'big-ben': PLACE_BIG_BEN,
  'blue-mosque': PLACE_BLUE_MOSQUE,
  'cn-tower': PLACE_CN_TOWER,
  'eiffel-tower': PLACE_EIFFEL_TOWER,
  'faisal-mosque': PLACE_FAISAL_MOSQUE,
  'hagia-sophia': PLACE_HAGIA_SOPHIA,
  'sheikh-zayed-grand-mosque': PLACE_SHEIKH_ZAYED_GRAND_MOSQUE,
  'statue-of-liberty': PLACE_STATUE_OF_LIBERTY,
  'sydney-opera-house': PLACE_SYDNEY_OPERA_HOUSE,
};

export * from './types';
export { PLACE_BADSHAHI_MOSQUE } from './badshahi-mosque';
export { PLACE_BIG_BEN } from './big-ben';
export { PLACE_BLUE_MOSQUE } from './blue-mosque';
export { PLACE_CN_TOWER } from './cn-tower';
export { PLACE_EIFFEL_TOWER } from './eiffel-tower';
export { PLACE_FAISAL_MOSQUE } from './faisal-mosque';
export { PLACE_HAGIA_SOPHIA } from './hagia-sophia';
export { PLACE_SHEIKH_ZAYED_GRAND_MOSQUE } from './sheikh-zayed-grand-mosque';
export { PLACE_STATUE_OF_LIBERTY } from './statue-of-liberty';
export { PLACE_SYDNEY_OPERA_HOUSE } from './sydney-opera-house';
