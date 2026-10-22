// WONDER FAQ BANK (R5-C2) — template-level bank for the golden wonder
// template. Wonder DETAIL pages already carry per-instance FAQs inside
// their data rows (lib/wonders.ts `faqs`) — those are instance data and
// stay untouched. This bank covers the questions every golden page
// answers the same way: slots map onto the Wonder data model
// ({name} {cityName} {regionName} {countryName} {unescoId}
// {unescoYear} {hoursText} {closedDays} {feesSource} {feesChecked} —
// the visitor block's sourceName/lastVerified) and the template's live
// layer (Open-Meteo at the wonder's coordinates).

import type { FaqBank } from './types';

export const WONDER_FAQ_BANK: FaqBank = [
  {
    id: 'wonder-unesco',
    question: 'Is {name} a UNESCO World Heritage Site?',
    answer:
      'Yes. {name} is inscribed on the UNESCO World Heritage List as site {unescoId} (since {unescoYear}). The inscription details on this page are taken from the UNESCO listing itself, which is linked in the page’s sources.',
    slots: ['name', 'unescoId', 'unescoYear'],
    source: 'UNESCO World Heritage List entry stored in the wonder’s data row (unescoId/unescoYear), checked against whc.unesco.org.',
  },
  {
    id: 'wonder-where',
    question: 'Where is {name}?',
    answer:
      '{name} is in {cityName}, {regionName}, {countryName}. The map block on this page shows its exact location, and the Nearby section lists the recognised sights around it with distances calculated from its coordinates.',
    slots: ['name', 'cityName', 'regionName', 'countryName'],
    source: 'The wonder’s data row (Wikidata identity + coordinates) — the same fields the page’s fact grid prints.',
  },
  {
    id: 'wonder-hours-fees',
    question: 'What are the opening hours and ticket prices for {name}?',
    answer:
      '{hoursText} Ticket prices are reproduced from {feesSource}, the official source, and were last verified on {feesChecked}; if the official prices have not been verified, this page hides the fee table rather than guessing. Always re-check the official site before travelling.',
    slots: ['hoursText', 'feesSource', 'feesChecked'],
    source: 'The data row’s visitor block (hoursText/fees/sourceName/lastVerified) — the template hides fees entirely when unverified.',
  },
  {
    id: 'wonder-closed-days',
    question: 'When is {name} closed?',
    answer:
      '{closedDays} The open-or-closed status shown on this page is calculated from that verified rule together with today’s sunrise and sunset at the site — it is never typed in by hand.',
    slots: ['closedDays'],
    source: 'The data row’s visitor block (closedDays) + the golden template’s calculated open-status (blueprint rule).',
  },
  {
    id: 'wonder-weather-now',
    question: 'What is the weather at {name} right now?',
    answer:
      'The live panel on this page shows the current temperature and conditions at {name} from Open-Meteo, read at the site’s exact coordinates, together with today’s sunrise, sunset and golden hours and a what-to-wear verdict derived from them. When the feed is down, the panel is absent rather than stale.',
    slots: ['name'],
    source: 'The golden template’s live layer (Open-Meteo at the wonder’s lat/lng) — the same feed the hub card displays.',
  },
  {
    id: 'wonder-best-light',
    question: 'When is the best light for photographs at {name}?',
    answer:
      'The golden hours — shortly after sunrise and before sunset — are shown for today in this page’s live panel, calculated for the site itself. The photography section points to the recognised viewpoints; the exact times change daily with the sun.',
    slots: ['name'],
    source: 'The live layer’s sunrise/sunset computation (Open-Meteo) + the data row’s photo spots.',
  },
  {
    id: 'wonder-photos-licence',
    question: 'Can I reuse the photographs on this page?',
    answer:
      'Every photograph here comes from Wikimedia Commons under a free licence, and the author and licence are printed with each image. Reuse follows the terms of that licence — the credit line on the photo is the starting point.',
    slots: [],
    source: 'The template’s media rule (blueprint): no image without a free licence and a named author is used; credits travel with the image.',
  },
  {
    id: 'wonder-myths',
    question: 'Are the popular stories about {name} true?',
    answer:
      'Some are, some are legend. This page’s Myth vs Fact cards take the stories people repeat most and check each one against the historical sources named on the card — a claim that cannot be verified is labelled as such, never repeated as fact.',
    slots: ['name'],
    source: 'The data row’s curated Myth vs Fact cards (curated + source-named per the blueprint; never API-guessed).',
  },
  {
    id: 'wonder-verification',
    question: 'How does WorldCityHub verify the facts on this page?',
    answer:
      'Each fact is stored with its source and the date it was checked: identity and dimensions from Wikidata, heritage status from UNESCO, visitor prices and hours from the official site, and live conditions from Open-Meteo. The full list is in the Sources & Credits block at the foot of this page.',
    slots: [],
    source: 'The golden template’s data model (sources[] per data row) + the hub’s published build standard.',
  },
  {
    id: 'wonder-more-guides',
    question: 'Why do some wonders not have a guide yet?',
    answer:
      'A guide opens only when every fact on it can be traced to its source — the same standard this page meets. The Wonders hub lists the remaining wonders as content, deliberately without links, until their guides pass that check.',
    slots: [],
    source: 'The Wonders hub’s published rule (“WorldCityHub never links to an unfinished page”) + the QA gate.',
  },
];
