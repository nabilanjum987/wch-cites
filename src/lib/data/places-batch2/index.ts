// Places batch 2 index (Round 3 / S3b). BUILD ONLY — data rows, no pages.
import type { PlaceRow } from './types';
import { PLACE_CHRIST_THE_REDEEMER } from './christ-the-redeemer';
import { PLACE_COLOSSEUM } from './colosseum';
import { PLACE_GOLDEN_GATE_BRIDGE } from './golden-gate-bridge';
import { PLACE_GREAT_WALL_OF_CHINA } from './great-wall-of-china';
import { PLACE_MACHU_PICCHU } from './machu-picchu';
import { PLACE_MOUNT_FUJI } from './mount-fuji';
import { PLACE_PYRAMIDS_OF_GIZA } from './pyramids-of-giza';
import { PLACE_SAGRADA_FAMILIA } from './sagrada-familia';
import { PLACE_ST_PETERS_BASILICA } from './st-peters-basilica';
import { PLACE_TOWER_BRIDGE } from './tower-bridge';

export const PLACES_BATCH2: Record<string, PlaceRow> = {
  'christ-the-redeemer': PLACE_CHRIST_THE_REDEEMER,
  'colosseum': PLACE_COLOSSEUM,
  'golden-gate-bridge': PLACE_GOLDEN_GATE_BRIDGE,
  'great-wall-of-china': PLACE_GREAT_WALL_OF_CHINA,
  'machu-picchu': PLACE_MACHU_PICCHU,
  'mount-fuji': PLACE_MOUNT_FUJI,
  'pyramids-of-giza': PLACE_PYRAMIDS_OF_GIZA,
  'sagrada-familia': PLACE_SAGRADA_FAMILIA,
  'st-peters-basilica': PLACE_ST_PETERS_BASILICA,
  'tower-bridge': PLACE_TOWER_BRIDGE,
};

export * from './types';
export { PLACE_CHRIST_THE_REDEEMER } from './christ-the-redeemer';
export { PLACE_COLOSSEUM } from './colosseum';
export { PLACE_GOLDEN_GATE_BRIDGE } from './golden-gate-bridge';
export { PLACE_GREAT_WALL_OF_CHINA } from './great-wall-of-china';
export { PLACE_MACHU_PICCHU } from './machu-picchu';
export { PLACE_MOUNT_FUJI } from './mount-fuji';
export { PLACE_PYRAMIDS_OF_GIZA } from './pyramids-of-giza';
export { PLACE_SAGRADA_FAMILIA } from './sagrada-familia';
export { PLACE_ST_PETERS_BASILICA } from './st-peters-basilica';
export { PLACE_TOWER_BRIDGE } from './tower-bridge';
