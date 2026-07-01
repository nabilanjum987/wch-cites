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
  const { month, year } = now();

  const tempStr = temp ? `${Math.round(temp)}°C · ` : '';
  const goldStr = goldPerGram ? ` · Gold PKR ${Math.round(goldPerGram).toLocaleString()}/g` : '';
  const prayerStr = fajr ? ` · Fajr ${fajr}` : '';

  const title = `${city} Today — Live Weather, Prayer Times & News ${month} ${year} | WorldCityHub`;

  const description = `${city} right now: ${tempStr}${weatherDesc ?? 'current weather'}, prayer times (Fajr ${fajr ?? '--'} · Maghrib ${maghrib ?? '--'})${goldStr}${prayerStr}. Live news, events, gold rates & more for ${city}, ${province}, ${country}.`;

  const canonical = `https://worldcityhub.com/${country.toLowerCase()}/${province.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`;

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
          "text": `${city} is famous for its Mughal-era monuments (Badshahi Mosque, Lahore Fort, Shalimar Gardens), its rich food culture (nihari, karahi, street food of Food Street), its literary and artistic heritage (Allama Iqbal, Faiz Ahmed Faiz), and its role as Pakistan's cultural capital. The city is also Pakistan's second-largest economic hub and home to top universities including LUMS and Punjab University.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the population of ${city} in ${year}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${city}'s population in ${year} is estimated at over 13 million in the metropolitan area, making it Pakistan's second-largest city after Karachi. The city's population has grown rapidly due to rural-to-urban migration and a high birth rate, with growth projected to continue through 2040.`
        }
      },
      {
        "@type": "Question",
        "name": `What language is spoken in ${city}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The primary languages spoken in ${city} are Punjabi (the mother tongue of the majority of residents) and Urdu (the national language used in education, government, and media). English is widely used in business, universities, and upscale neighbourhoods. Many residents are multilingual, switching between Punjabi, Urdu, and English in daily life.`
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
        "item": "https://worldcityhub.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": country,
        "item": `https://worldcityhub.com/${country.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": province,
        "item": `https://worldcityhub.com/${country.toLowerCase()}/${province.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": city,
        "item": `https://worldcityhub.com/${country.toLowerCase()}/${province.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`
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
    "description": `${city} is the capital of ${province}, ${country}. A major cultural, economic, and historical centre with a population of over 13 million.`,
    "url": `https://worldcityhub.com/${country.toLowerCase()}/${province.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`
  };

  return { faqSchema, breadcrumbSchema, citySchema };
}

// Helper: inject all schemas as <script> tags (use in layout or page head)
export function renderSchemas(schemas: object[]): string {
  return schemas
    .map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n');
}
