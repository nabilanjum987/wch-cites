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

export function generateCitySchema(props: CityMetaProps) {
  const { city, country, province, temp, fajr, maghrib, goldPerGram } = props;
  const { month, year } = now();

  // FAQ Schema — 8 questions with real data injected
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the weather in ${city} today?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": temp
            ? `Current temperature in ${city} is ${Math.round(temp)}°C with ${props.weatherDesc ?? 'mixed conditions'}. Check the live weather widget on this page for hourly updates, UV index, humidity, and wind speed.`
            : `${city} weather today varies by season. This page shows live weather data updated every hour from OpenWeatherMap. Check the weather section above for current temperature, feels-like, humidity, and UV index.`
        }
      },
      {
        "@type": "Question",
        "name": `What are today's prayer times in ${city}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": fajr
            ? `Today's prayer times in ${city}: Fajr at ${fajr}, Maghrib at ${maghrib ?? '--'}. All five prayer times are shown live on this page, calculated using the Karachi method. A full monthly timetable and Qibla compass are on the Prayer Times page.`
            : `Prayer times in ${city} are calculated daily using the Karachi method (University of Islamic Sciences). Fajr, Zuhr, Asr, Maghrib, and Isha times are shown live on this page with a countdown to the next prayer.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the gold rate in ${city} today?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": goldPerGram
            ? `Gold rate in ${city} today is PKR ${Math.round(goldPerGram).toLocaleString()} per gram for 24-karat gold, which equals PKR ${Math.round(goldPerGram * 11.664).toLocaleString()} per tola. Rates are updated daily from international markets.`
            : `Gold rates in ${city} are updated daily and shown in all karats (24K, 22K, 21K, 18K) in both grams and tolas. Check the Gold & Rates section on this page or visit the full Rates page for detailed charts.`
        }
      },
      {
        "@type": "Question",
        "name": `What is ${city} famous for?`,
        "acceptedAnswer": {
          "@type": "Answer",
          // Q11: this answer previously hard-coded LAHORE's landmarks,
          // people and "cultural capital" claim into every city's
          // schema. It is now city-neutral and factual for any city.
          "text": `${city} is known for its historic landmarks, its food culture, and its people — poets, athletes, scholars and artists who shaped ${props.country ?? 'the country'}. The Famous Places and Famous People sections of this page list the highlights for ${city}, and the full city guide covers its economy, events and daily life.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the population of ${city} in ${year}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": props.population
            ? `${city}'s population is ${props.population} (city dataset figure). Like most large cities in the region it continues to grow through rural-to-urban migration and natural increase.`
            : `${city} is one of the larger cities of ${props.country ?? 'its country'}, and continues to grow through rural-to-urban migration and natural increase.`
        }
      },
      {
        "@type": "Question",
        "name": `What language is spoken in ${city}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Urdu (the national language, used in education, government and media) and the regional language of ${props.province ?? 'the province'} are the primary languages spoken in ${city}. English is widely used in business, universities and government. Many residents are multilingual and switch between languages in daily life.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the emergency number in ${city}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `In ${city}, call 15 for Police, 1122 for Rescue/Ambulance (Rescue 1122 is one of Pakistan's best emergency services), and 16 for the Fire Brigade. The Edhi Foundation ambulance is reachable at 115. Women's helpline: 1043. All numbers are free to call from any mobile or landline.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the best time to visit ${city}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The best time to visit ${city} is October to March when temperatures are pleasant (10°C–25°C), the air quality is better, and major cultural festivals take place. Avoid May–July when temperatures regularly exceed 40°C. The monsoon season (July–September) brings heavy rain and high humidity but also green parks and a vibrant street food atmosphere.`
        }
      }
    ]
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
