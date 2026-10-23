// lib/seo/cityMeta.ts
// Meta tags + FAQ schema for City Main Page
// Real data injected - no placeholders

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
  return [
    {
      q: `What is the weather in ${city} today?`,
      a: temp
        ? `The temperature in ${city} right now is ${Math.round(temp)}°C with ${weatherDesc ?? 'mixed conditions'}. The live weather panel at the top of this page also shows the feels-like temperature, humidity, wind speed and UV index for ${city}, refreshed hourly from the same feed, together with today's sunrise and sunset times and a short outlook for the rest of the day.`
        : `${city}'s weather changes with the seasons, so check the live weather panel at the top of this page for today's temperature, feels-like temperature, humidity, wind speed and UV index in ${city}, refreshed hourly. The panel also shows today's sunrise and sunset times and a short outlook, and the best-time-to-visit answer below explains which months suit a trip to ${city} best.`,
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
        ? `The gold rate in ${city} today is PKR ${Math.round(goldPerGram).toLocaleString()} per gram for 24-karat gold, which equals PKR ${Math.round(goldPerGram * 11.664).toLocaleString()} per tola — one tola is 11.664 grams. The rate follows the international bullion market and the rupee's exchange rate, and this page updates it daily from the same live feed. Jewellers in ${city} add making charges on top of this bullion rate.`
        : `Gold in ${city} is priced per gram and per tola (one tola = 11.664 grams) from the international bullion market, converted into Pakistani rupees. The Gold & Rates section of this page shows today's 24-karat rate with 22K, 21K and 18K beside it, updated daily; the full Rates page tracks the metal in other currencies too. Jewellers add making charges on top.`,
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
    {
      q: `What language is spoken in ${city}?`,
      a: `Urdu (the national language, used in education, government and media) and the regional language of ${province} are the primary languages spoken in ${city}. English is widely used in business, universities and government offices. Many residents are multilingual and switch between Urdu, the regional language and English within a single conversation, and signage across ${city} commonly mixes all three.`,
    },
    {
      q: `What is the emergency number in ${city}?`,
      a: `In ${city}, call 15 for Police, 1122 for Rescue or an ambulance (Rescue 1122 is one of Pakistan's best-known emergency services), 16 for the Fire Brigade, and 115 for the Edhi Foundation ambulance. The women's helpline is 1043. All of these numbers are free to call from any mobile or landline, and they work around the clock, every day of the year.`,
    },
    {
      q: `What is the best time to visit ${city}?`,
      a: `The best time to visit ${city} is October to March, when temperatures are pleasant (10°C–25°C), the air quality is better, and major cultural festivals take place. Avoid May–July, when temperatures regularly exceed 40°C. The monsoon season (July–September) brings heavy rain and high humidity but also green parks and a vibrant street food atmosphere; today's live conditions are at the top of this page.`,
    },
  ];
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
      ? `${city} is the capital of ${province}, ${country}. A major cultural, economic, and historical centre with a population of ${props.population}.`
      : `${city} is the capital of ${province}, ${country}. A major cultural, economic, and historical centre.`,
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
