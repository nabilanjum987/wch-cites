// OCEAN FAQ BANK (R5-C2) — template-level bank for the golden ocean
// template, mirroring the wonder bank. Ocean DETAIL pages carry
// per-instance FAQs inside their data rows (lib/oceans.ts `faqs`);
// this bank covers the template-level questions. Slots map onto the
// Ocean data model ({name} {partOfName} {coastalCity} {lat} {lng} and
// the sourced facts[] entries) and the live marine layer (Open-Meteo
// Marine API at the sea's own point).

import type { FaqBank } from './types';

export const OCEAN_FAQ_BANK: FaqBank = [
  {
    id: 'ocean-part-of',
    question: 'Which ocean is the {name} part of?',
    answer:
      'The {name} is part of the {partOfName}. Its identity, boundaries and headline facts on this page are taken from its Wikidata record and the reference sources listed at the foot of the page.',
    slots: ['name', 'partOfName'],
    source: 'The ocean’s data row (Wikidata identity, partOfName) — the same fields the page’s fact grid prints.',
  },
  {
    id: 'ocean-size',
    question: 'How big is the {name}?',
    answer:
      'The {name} covers {areaText}. Every size and depth figure on this page is stored with the source it came from, in the fact grid and the sources block — no figure is carried without one.',
    slots: ['name', 'areaText'],
    source: 'The data row’s facts[] entry for surface area, with its named source (the hub prints the Arabian Sea’s 3,862,000 km² from the same row).',
  },
  {
    id: 'ocean-depth',
    question: 'How deep is the {name}?',
    answer:
      'This page shows a maximum depth of {maxDepth} ({maxDepthSource}). Where references disagree, the disagreement is documented in the sources and in this page’s own notes rather than hidden — for the Arabian Sea, for example, the shown figure and the alternative figure are both on record.',
    slots: ['name', 'maxDepth', 'maxDepthSource'],
    source: 'The data row’s facts[] depth entry + the documented source-conflict practice from the golden ocean build (PR #10: 5,395 m shown, 5,800 m documented).',
  },
  {
    id: 'ocean-waves-today',
    question: 'What are the wave conditions in the {name} today?',
    answer:
      'The live panel on this page reads today’s wave height, direction and period from the Open-Meteo Marine API at a representative point in the sea ({lat}°, {lng}°), with the weather on its best-known coast — {coastalCity} — beside it. When the marine feed is down, the panel shows nothing rather than an old reading.',
    slots: ['name', 'lat', 'lng', 'coastalCity'],
    source: 'The golden template’s live layer (Open-Meteo Marine API at the data row’s coordinates) — the same values the Oceans hub card displays.',
  },
  {
    id: 'ocean-coastal-city',
    question: 'Which city guide covers the {name}’s coast?',
    answer:
      'This page’s coastal city is {coastalCity}, whose full WorldCityHub guide — weather, prayer times, rates, news and events — is linked from the live panel. Other coastal cities are added only when their own guides pass the same verification standard.',
    slots: ['name', 'coastalCity'],
    source: 'The data row’s coastalCity block (name + published page path).',
  },
  {
    id: 'ocean-monsoon',
    question: 'How does the monsoon affect the {name}?',
    answer:
      'The monsoon section of this page describes the seasonal wind reversal that governs the sea — and it is labelled as climatology: the pattern of the seasons, not today’s conditions. Live conditions are only ever the figures in the live panel.',
    slots: ['name'],
    source: 'The data row’s monsoon[] content + the golden ocean build’s rule (climatology never mixed with live figures, PR #10).',
  },
  {
    id: 'ocean-no-sst',
    question: 'Why is no sea-surface temperature shown for the {name}?',
    answer:
      'Because no verified free source publishes it for this sea in a form this page may use. Rather than estimate it, the page leaves it out — the same rule applied to every figure here.',
    slots: ['name'],
    source: 'The golden ocean build’s recorded limitation (PR #10: no SST — no verified free source).',
  },
  {
    id: 'ocean-photos-licence',
    question: 'Can I reuse the photographs on this page?',
    answer:
      'Every photograph comes from Wikimedia Commons under a free licence, with the author and licence printed beside it. Reuse follows that licence’s terms, starting from the credit line shown with the image.',
    slots: [],
    source: 'The template’s media rule (blueprint): licence + author recorded on every media record.',
  },
  {
    id: 'ocean-verification',
    question: 'How are the facts on this page verified?',
    answer:
      'Identity and geography come from Wikidata and the reference works named in the sources block; live conditions come from the Open-Meteo Marine API. Each stored fact carries its source, and where two sources disagree, both figures are documented openly.',
    slots: [],
    source: 'The data row’s sources[] + the golden ocean build’s documented-conflict practice (PR #10).',
  },
  {
    id: 'ocean-more-guides',
    question: 'Why do some oceans and seas not have a guide yet?',
    answer:
      'A guide opens only when its facts can be traced to their sources and a real live layer exists for it. The Oceans hub lists the rest as content, deliberately without links, until they pass that standard.',
    slots: [],
    source: 'The Oceans hub’s published rule + the QA gate.',
  },
];
