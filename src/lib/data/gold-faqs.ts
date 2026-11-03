// City gold AEO layer (A4, extended 3 Nov 2026).
// ONE source for the city rates page's visible AEO Q&A: CityGoldSeo
// renders the questions visibly AND emits the FAQPage JSON-LD from
// this SAME array, composed from the page's own server-fetched gold
// figures, so visible text and schema can never drift apart.
// Returns an empty array when no live figure is available: no FAQ
// and no schema are shown in place of a missing figure.
import type { AeoFaq } from '@/components/aeo/AnswerLayer';

const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 2 });

/** The exact honesty sentence: the national spot-derived rate is the
 *  same in all five cities this section serves. */
export function goldHonestySentence(cityName: string, perGram: number, perTola: number, feedLabel: string): string {
  return `Gold in ${cityName} today costs PKR ${fmt(perGram)} per gram for 24K, or PKR ${fmt(perTola)} per tola, from the ${feedLabel} converted to rupees. The rate is the national spot-derived figure, so it is the same in Lahore, Karachi, Islamabad, Multan and Peshawar, while jewellers' retail prices for finished pieces may differ. The source and as-of time are shown above.`;
}

/** R3: why this page's figure can differ from the site ticker. */
export const GOLD_TICKER_NOTE =
  'Page figure: live spot-derived; the site ticker refreshes on its own cycle, so the two can differ slightly between refreshes.';

export function buildCityGoldFaqs(
  cityName: string,
  perGram: number | null,
  perTola: number | null,
  feedLabel: string,
): AeoFaq[] {
  if (perGram === null || perTola === null) return [];
  return [
    {
      q: `What is the gold price in ${cityName} today?`,
      a: goldHonestySentence(cityName, perGram, perTola, feedLabel),
    },
    {
      q: `Is the gold price in ${cityName} different from other Pakistani cities?`,
      a: `No. The figure on this page is the national spot-derived rate from the ${feedLabel} converted to rupees, so it is the same in Lahore, Karachi, Islamabad, Multan and Peshawar. This page never claims a separate ${cityName} market quote; jewellers' retail prices for finished pieces may still differ from shop to shop.`,
    },
    {
      q: `Why can the gold figure on this page differ from the site ticker?`,
      a: GOLD_TICKER_NOTE,
    },
  ];
}
