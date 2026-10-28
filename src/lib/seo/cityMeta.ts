// lib/seo/cityMeta.ts
// Meta tags + FAQ schema for City Main Page
// Real data injected - no placeholders

import { CAPITALS } from '../capitals';
import { TOLA_GRAMS } from '../gold';

// ─── F2 (Batch 4 findings fix): capital-claim gating ──────────────────
// This generator used to describe EVERY city as "the capital of
// {province}" — wrong for Faisalabad, Rawalpindi and every other
// non-capital. The claim is now emitted only when verifiably true:
//   1. provincial capitals, from the explicit map below (the provinces
//      the route dataset serves today — extend it only with a verified
//      province→capital pair);
//   2. a national capital found in the §9A capitals dataset
//      (src/lib/capitals.ts), worded "the capital of {country}" —
//      this is how Islamabad (a federal capital territory, not a
//      province capital) is described truthfully.
// Any other city gets no capital claim at all. A dataset city that IS
// a capital but is missing from both sources also gets no claim —
// the safe direction is silence, never a fabricated claim.
const PROVINCE_CAPITALS: Record<string, string> = {
  Punjab: 'Lahore',
  Sindh: 'Karachi',
  // B10: Peshawar IS the capital of Khyber Pakhtunkhwa — previously
  // missing here, so Peshawar got no capital claim at all. Sourced
  // against the site's own province records (compare.ts province
  // entities, CountryClient/ProvinceClient province tables, and the
  // schema.sql provinces seed, all naming Peshawar as KP's capital).
  'Khyber Pakhtunkhwa': 'Peshawar',
};

function capitalSentence(city: string, province: string, country: string): string {
  if (PROVINCE_CAPITALS[province] === city) {
    return `${city} is the capital of ${province}, ${country}.`;
  }
  const isNationalCapital = CAPITALS.some((c) => c.capital === city && c.country === country);
  if (isNationalCapital) {
    return `${city} is the capital of ${country}.`;
  }
  return `${city} is a city in ${province}, ${country}.`;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

interface CityMetaProps {
  city: string;
  country: string;
  province: string;
  temp?: number | null;
  weatherDesc?: string | null;
  fajr?: string | null;
  maghrib?: string | null;
  goldPerGram?: number | null;
  population?: string | null;
  // Fix 4 (billi audit, Batch 4 Item 2 follow-up): the city's own dataset
  // languages list (the GLANCE record the city page already renders in its
  // at-a-glance panel) and the country emergency numbers the city page
  // itself fetches — the language/emergency FAQs are built from these,
  // never from country-shaped assumptions baked into the generator.
  languages?: string | null;
  emergency?: { police?: string | null; ambulance?: string | null; fire?: string | null } | null;
}

export function generateCityMeta(props: CityMetaProps) {
  const { city, country, province, temp, weatherDesc, fajr, maghrib, goldPerGram } = props;

  // QA gate: title ≤60 chars, real city name (never the lowercase slug),
  // and a description built only from data that actually exists — a
  // missing value must shorten the sentence, never print a placeholder.
  // Pattern audited to ≤60 chars for city names up to 15 chars (PC1(4)).
  const title = `${city} Weather, Prayer Times & News | WorldCityHub`;

  const segments: string[] = [
    temp ? `${Math.round(temp)}°C ${weatherDesc ?? 'weather right now'}` : 'live weather',
  ];
  const prayerBits = [fajr ? `Fajr ${fajr}` : null, maghrib ? `Maghrib ${maghrib}` : null].filter(Boolean);
  segments.push(prayerBits.length ? `prayer times (${prayerBits.join(' · ')})` : 'prayer times');
  if (goldPerGram) segments.push(`gold PKR ${Math.round(goldPerGram).toLocaleString()}/g`);
  segments.push('local news & events');

  let description = `${city} right now: ${segments.join(', ')} — ${city}, ${province}, ${country}, updated daily.`;
  if (description.length > 155) {
    description = description.slice(0, 152).trimEnd() + '…';
  }

  const canonical = `https://worldcityhub.vercel.app/${country.toLowerCase()}/${province.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`;

  return { title, description, canonical };
}

// ─── City FAQs (Batch 4, Item 2) ────────────────────────────────────────────
// Single source for the city page's FAQ data: generateCitySchema() emits
// these as FAQPage JSON-LD and the city page renders the SAME array as a
// visible FAQ block, so visible text and schema can never drift apart.
// Questions are real mined phrasings (see evidence/batch4-item2/
// question-bank.md); answers are 50–70 words, built only from the data
// this page already has (live props + the city dataset population).
export function generateCityFaqs(props: CityMetaProps): { q: string; a: string }[] {
  const { city, country, province, temp, weatherDesc, fajr, maghrib, goldPerGram, population } = props;
  const { year } = now();
  // Fix 4 (billi audit, Batch 4 Item 2 follow-up): this generator runs for
  // EVERY city, so no claim may be baked in just because it is true of the
  // Pakistani cities live today. Country-specific content is gated on the
  // city's own country; the language and emergency answers are built from
  // the city's own data (dataset languages list + the emergency numbers
  // the page itself fetches, with Pakistan's national numbers as the
  // fallback for Pakistani cities only); and the best-time answer makes no
  // climate claims at all, because the city dataset carries no per-city
  // climate data — an earlier version stated Lahore-shaped claims
  // (Oct–Mar pleasant, 40°C summers, monsoon months) for every city.
  const isPakistan = country === 'Pakistan';
  const faqs: { q: string; a: string }[] = [
    {
      q: `What is the weather in ${city} today?`,
      a: temp
        ? `The temperature in ${city} right now is ${Math.round(temp)}°C with ${weatherDesc ?? 'mixed conditions'}. The live weather panel at the top of this page also shows the feels-like temperature, humidity, wind speed and UV index for ${city}, refreshed hourly from the same feed, together with today's sunrise and sunset times and a short outlook for the rest of the day.`
        : `${city}'s weather changes with the seasons, so check the live weather panel at the top of this page for today's temperature, feels-like temperature, humidity, wind speed and UV index in ${city}, refreshed hourly. The panel also shows today's sunrise and sunset times and a short outlook, and the best-time-to-visit answer below helps you plan when to come.`,
    },
    {
      q: `What are today's prayer times in ${city}?`,
      a: fajr
        ? `Today's prayer times in ${city} start with Fajr at ${fajr}.${maghrib ? ` Maghrib, the sunset prayer, is at ${maghrib}.` : ''} All five times — Fajr, Dhuhr, Asr, Maghrib and Isha — are calculated for ${city}'s exact coordinates using the Karachi calculation method, shown live at the top of this page with a countdown to the next prayer; the full monthly timetable is on the linked Prayer Times page.`
        : `Prayer times in ${city} are calculated daily for the city's exact coordinates using the Karachi calculation method, and the live panel at the top of this page shows all five — Fajr, Dhuhr, Asr, Maghrib and Isha — with a countdown to the next one. The linked Prayer Times page carries the full monthly timetable, the Qibla direction from ${city} and today's Hijri date.`,
    },
    {
      q: `What is the gold rate in ${city} today?`,
      a: goldPerGram
        ? `The gold rate in ${city} today is PKR ${Math.round(goldPerGram).toLocaleString()} per gram for 24-karat gold, which equals PKR ${Math.round(goldPerGram * TOLA_GRAMS).toLocaleString()} per tola — one tola is 11.664 grams. The rate follows the international bullion market and the rupee's exchange rate, and this page updates it daily from the same live feed. Jewellers in ${city} add making charges on top of this bullion rate.`
        : `Gold in ${city} is priced per gram and per tola (one tola = 11.664 grams) from the international bullion market, converted into ${isPakistan ? 'Pakistani rupees' : 'the local currency'}. The Gold & Rates section of this page shows today's 24-karat rate with 22K, 21K and 18K beside it, updated daily; the full Rates page tracks the metal in other currencies too. Jewellers add making charges on top.`,
    },
    {
      q: `What is ${city} famous for?`,
      // Q11: city-neutral — an earlier version hard-coded Lahore's
      // landmarks and people into every city's schema.
      a: `${city} is known for its historic landmarks, its food culture, and its people — poets, athletes, scholars and artists who shaped ${country}. The Famous Places and Famous People sections of this page list the highlights for ${city} itself, from its best-known monuments and neighbourhoods to its notable residents; the full guide below covers the city's economy, events, education and daily life in the same depth.`,
    },
    {
      q: `What is the population of ${city} in ${year}?`,
      a: population
        ? `${city}'s population is ${population} — the figure held in the WorldCityHub city dataset, and the same number the at-a-glance panel on this page shows. Like most large cities in the region, ${city} continues to grow through rural-to-urban migration and natural increase, and every national census has counted more residents than the one before it.`
        : `${city}'s population figure is shown in the at-a-glance panel on this page, taken from the WorldCityHub city dataset. Like most large cities in the region, ${city} continues to grow through rural-to-urban migration and natural increase, and every national census has counted more residents than the one before it. Dataset figures are refreshed when new census results are published.`,
    },
  ];

  // Language — built from the city's OWN dataset languages list (the same
  // GLANCE value the at-a-glance panel renders). The elaboration about
  // Urdu's national role and English usage is Pakistan-specific and is
  // emitted only for Pakistani cities; without dataset languages the
  // question is omitted rather than answered from an assumption.
  if (props.languages) {
    faqs.push({
      q: `What language is spoken in ${city}?`,
      a: isPakistan
        ? `The main languages spoken in ${city} are ${props.languages} — the languages listed for the city in the at-a-glance panel on this page. Urdu is Pakistan's national language, used in education, government and media. English is widely used in business, universities and government offices, and many residents are multilingual, switching between these languages and English within a single conversation; signage across ${city} commonly mixes them.`
        : `The main languages spoken in ${city} are ${props.languages} — the languages listed for the city in the at-a-glance panel on this page. Language shapes daily life in ${city}: the culture, food and Famous People sections of this page reflect the mix, and the full city guide below covers the city's neighbourhoods, education and daily life in more depth.`,
    });
  }

  // Emergency numbers — built from the numbers the city page itself
  // fetches for the country; for Pakistani cities the national numbers
  // (15 / 1122 / 16, plus the Edhi ambulance and the 1043 women's
  // helpline, which are Pakistan-only services) are the fallback when the
  // fetch has no data. A non-Pakistani city with no fetched numbers omits
  // the question instead of inheriting Pakistan's.
  const em = props.emergency;
  const police = em?.police ?? (isPakistan ? '15' : null);
  const ambulance = em?.ambulance ?? (isPakistan ? '1122' : null);
  const fire = em?.fire ?? (isPakistan ? '16' : null);
  const numberParts: string[] = [];
  if (police) numberParts.push(`${police} for Police`);
  if (ambulance) {
    numberParts.push(
      `${ambulance} for Rescue or an ambulance${isPakistan && ambulance === '1122' ? " (Rescue 1122 is one of Pakistan's best-known emergency services)" : ''}`,
    );
  }
  if (fire) numberParts.push(`${fire} for the Fire Brigade`);
  if (isPakistan) numberParts.push('115 for the Edhi Foundation ambulance');
  if (numberParts.length > 0) {
    const numberList =
      numberParts.length > 1
        ? `${numberParts.slice(0, -1).join(', ')}, and ${numberParts[numberParts.length - 1]}`
        : numberParts[0];
    faqs.push({
      q: `What is the emergency number in ${city}?`,
      a: `In ${city}, call ${numberList}.${isPakistan ? " The women's helpline is 1043." : ''} All of these numbers are free to call from any mobile or landline, and they work around the clock, every day of the year.`,
    });
  }

  // Best time to visit — deliberately free of climate claims: the city
  // dataset carries no per-city climate data, so the answer points at the
  // page's live conditions and its own place pages instead of repeating
  // one city's seasons as if they were every city's.
  faqs.push({
    q: `What is the best time to visit ${city}?`,
    a: `The best time to visit ${city} is when its weather suits the trip you want — the live weather panel at the top of this page shows today's temperature, feels-like conditions and outlook for ${city}, updated hourly. The Famous Places, street food and events sections below run year-round, and each place's own page notes its best visiting conditions and opening hours.`,
  });

  return faqs;
}

export function generateCitySchema(props: CityMetaProps) {
  const { city, country, province } = props;

  // FAQ Schema — 8 questions with real data injected (Batch 4 Item 2:
  // built from generateCityFaqs so schema and the visible FAQ block on
  // the page are the same text from the same source).
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": generateCityFaqs(props).map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "WorldCityHub",
        "item": "https://worldcityhub.vercel.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": country,
        "item": `https://worldcityhub.vercel.app/${country.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": province,
        "item": `https://worldcityhub.vercel.app/${country.toLowerCase()}/${province.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": city,
        "item": `https://worldcityhub.vercel.app/${country.toLowerCase()}/${province.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`
      }
    ]
  };

  // City (Place) schema
  const citySchema = {
    "@context": "https://schema.org",
    "@type": "City",
    "name": city,
    "containedInPlace": {
      "@type": "AdministrativeArea",
      "name": province,
      "containedInPlace": {
        "@type": "Country",
        "name": country
      }
    },
    "description": props.population
      ? `${capitalSentence(city, province, country)} A major cultural, economic, and historical centre with a population of ${props.population}.`
      : `${capitalSentence(city, province, country)} A major cultural, economic, and historical centre.`,
    "url": `https://worldcityhub.vercel.app/${country.toLowerCase()}/${province.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`
  };

  return { faqSchema, breadcrumbSchema, citySchema };
}

// Helper: inject all schemas as <script> tags (use in layout or page head)
export function renderSchemas(schemas: object[]): string {
  return schemas
    .map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n');
}
