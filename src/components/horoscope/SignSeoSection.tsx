import type { ZodiacSignData } from '@/types/horoscope';

/**
 * A1 horoscope SEO section (final30-a1-horoscope).
 *
 * Rendered at the foot of every /horoscope/[sign] page, below the tools and
 * above Affiliates. One H2 per page plus two H3 AEO questions, each answered
 * directly underneath in 50–70 words. Copy uses only the sign's own dates,
 * element and ruling planet (from src/types/horoscope.ts) plus what the
 * page's own Daily / Weekly tabs actually show — no invented figures, no
 * dated forecast claims, and readings are framed as entertainment throughout.
 *
 * Targeting split (dispatch):
 * - Easy signs (Low head terms): H2 = "<Sign> Horoscope Today".
 * - Hard signs: the FULL flank phrase ONLY as the H2 below (e.g.
 *   "Gemini Horoscope Tomorrow") — never in the title, description or H1,
 *   and the flank itself never as H1 or title. Tomorrow flanks are answered
 *   honestly: the page has no separate dated tomorrow forecast, so the
 *   answer points at the Weekly Forecast tab (which covers the week ahead)
 *   and the Daily tab's refresh the next morning.
 */

type Faq = { q: string; a: string };
type SeoBlock = { h2: string; faqs: Faq[] };

const EASY_SIGNS = new Set(['aries', 'taurus', 'cancer', 'leo', 'scorpio', 'capricorn']);

function easyBlock(m: ZodiacSignData): SeoBlock {
  return {
    h2: `${m.name} Horoscope Today`,
    faqs: [
      {
        q: `What is ${m.name}'s horoscope today?`,
        a: `Today's ${m.name} reading sits on the Daily tab above, with star ratings for love, career, finance, health and spirituality alongside a short narrative for the day. As a ${m.element} sign ruled by ${m.ruling_planet}, ${m.name} spans ${m.dates} on the zodiac calendar. The ratings and lucky elements are derived from today's computed planetary positions, so the page changes daily. Readings are for entertainment only.`,
      },
      {
        q: `What are ${m.name}'s lucky number and colour today?`,
        a: `Check the Lucky Today card on the Daily tab: it shows ${m.name}'s lucky number, colour, gemstone, direction and best time for today. These are derived from today's computed transits, the Moon's and your ruler's longitudes and the planet in tightest aspect to your ruler, rather than a fixed list. Because the transits move daily, the lucky elements change too, so check back each morning.`,
      },
    ],
  };
}

function tomorrowBlock(m: ZodiacSignData): SeoBlock {
  return {
    h2: `${m.name} Horoscope Tomorrow`,
    faqs: [
      {
        q: `What does tomorrow bring for ${m.name}?`,
        a: `This page does not publish a separate dated forecast for tomorrow; instead, use the Weekly Forecast tab, which covers the week ahead including tomorrow, with an overall rating and best and challenging days. Return tomorrow and the Daily tab refreshes with that day's own reading, ratings and lucky elements. Both views are derived from computed planetary positions, and readings are for entertainment only.`,
      },
      {
        q: `How should ${m.name} prepare for tomorrow?`,
        a: `Start from the Weekly Forecast tab: note its best and challenging days, then compare today's love, career, finance, health and spirituality meters to see which areas need care. Plan demanding tasks for a best day where you can, keep tomorrow flexible elsewhere, and return in the morning for the refreshed daily reading. Readings are for entertainment, not decisions made on your behalf.`,
      },
    ],
  };
}

function weeklyBlock(m: ZodiacSignData): SeoBlock {
  return {
    h2: `${m.name} Horoscope Weekly`,
    faqs: [
      {
        q: `What is ${m.name}'s weekly outlook?`,
        a: `Open the Weekly Forecast tab above: it gives ${m.name}'s overall rating for the week, a summary, and its best and challenging days. As a ${m.element} sign ruled by ${m.ruling_planet} spanning ${m.dates}, ${m.name}'s week is read from the same computed planetary positions as the daily page. Use the best days for demanding plans and the challenging days for lighter tasks. Readings are for entertainment only.`,
      },
      {
        q: `Which days look best for ${m.name} this week?`,
        a: `The Weekly Forecast tab lists ${m.name}'s best days and challenging days for the current week, alongside its overall rating and summary. Best days are the week's stronger days in the forecast, so they suit demanding plans, while challenging days suit lighter tasks and rest. The list refreshes with each new week, so check back weekly. Readings are for entertainment only.`,
      },
    ],
  };
}

function piscesLoveBlock(m: ZodiacSignData): SeoBlock {
  return {
    h2: `${m.name} Horoscope Love Today`,
    faqs: [
      {
        q: `What is ${m.name}'s love outlook today?`,
        a: `Check the Daily tab's love meter and the Today's Compatibility card above: together they show ${m.name}'s love rating for today and its best-match and challenging signs. As a ${m.element} sign ruled by ${m.ruling_planet} spanning ${m.dates}, ${m.name}'s love reading comes from today's computed transits. Use it as lighthearted guidance only, not as a prediction about any real relationship.`,
      },
      {
        q: `Who is ${m.name} most compatible with today?`,
        a: `Today's Compatibility card on the Daily tab names ${m.name}'s best match and its challenging sign for today, both derived from today's computed readings. The Find Your Compatibility tool further down the page also compares ${m.name} with any sign you choose, with strengths and challenges for the pair. Treat the result as entertainment, since real compatibility depends on far more than sun signs alone.`,
      },
    ],
  };
}

export function signSeoBlock(m: ZodiacSignData): SeoBlock {
  if (EASY_SIGNS.has(m.key)) return easyBlock(m);
  switch (m.key) {
    case 'gemini':
    case 'libra':
    case 'sagittarius':
      return tomorrowBlock(m);
    case 'virgo':
    case 'aquarius':
      return weeklyBlock(m);
    case 'pisces':
      return piscesLoveBlock(m);
    default:
      return easyBlock(m);
  }
}

export default function SignSeoSection({ signMeta }: { signMeta: ZodiacSignData }) {
  const block = signSeoBlock(signMeta);
  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-white mb-4">{block.h2}</h2>
      <div className="space-y-6">
        {block.faqs.map((faq) => (
          <div key={faq.q}>
            <h3 className="text-base font-semibold text-white mb-2">{faq.q}</h3>
            <p className="text-gray-300 leading-relaxed text-sm">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
