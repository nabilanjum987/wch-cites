// FAQ bank — shared types (R5-C2).
//
// A bank is a DATA file: verified questions per template, each with an
// answer template and the source that answer is drawn from. Answers use
// {slots} that map 1:1 onto fields the page's own data layer already
// computes (each bank's header comment gives the mapping). A slot with
// no value must shorten or drop the answer — never a placeholder, never
// another city's facts. An answer that would need an unverified fact
// does not belong in a bank.

export interface FaqEntry {
  /** Stable id, unique inside its bank. */
  id: string;
  /** The question as a reader types it; may contain {slots}. */
  question: string;
  /** The answer template; may contain the same {slots}. */
  answer: string;
  /** Every {slot} used in question/answer, in order of first use. */
  slots: string[];
  /** Where this answer's facts come from — the same data the page uses. */
  source: string;
  /** Keyword-bank grounding (~/workspace/worldcityhub/data/keyword), where it applies. */
  demand?: string;
}

export type FaqBank = readonly FaqEntry[];

/** Fill an entry's {slots} from a values map; missing keys stay visible
 *  as {slot} so a wiring bug can never silently publish a wrong fact —
 *  the adopting template must pass every declared slot. */
export function renderFaqText(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? values[k] : m));
}
