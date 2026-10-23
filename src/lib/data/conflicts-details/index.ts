// Conflicts detail data index (Round 3 / S4). BUILD ONLY.
import type { ConflictDetail } from './types';
import { CONFLICT_DR_CONGO } from './dr-congo';
import { CONFLICT_HAITI } from './haiti';
import { CONFLICT_ISRAEL_GAZA } from './israel-gaza';
import { CONFLICT_MYANMAR } from './myanmar';
import { CONFLICT_SUDAN } from './sudan';
import { CONFLICT_UKRAINE_RUSSIA } from './ukraine-russia';

export const CONFLICT_DETAILS: Record<string, ConflictDetail> = {
  'dr-congo': CONFLICT_DR_CONGO,
  'haiti': CONFLICT_HAITI,
  'israel-gaza': CONFLICT_ISRAEL_GAZA,
  'myanmar': CONFLICT_MYANMAR,
  'sudan': CONFLICT_SUDAN,
  'ukraine-russia': CONFLICT_UKRAINE_RUSSIA,
};

export * from './types';
export { CONFLICT_DR_CONGO } from './dr-congo';
export { CONFLICT_HAITI } from './haiti';
export { CONFLICT_ISRAEL_GAZA } from './israel-gaza';
export { CONFLICT_MYANMAR } from './myanmar';
export { CONFLICT_SUDAN } from './sudan';
export { CONFLICT_UKRAINE_RUSSIA } from './ukraine-russia';
