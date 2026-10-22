// COUNTRY FAQ BANK (R5-C2) — for the country template. The country
// template renders no FAQ block today (verified: no FAQ in
// CountryClient.tsx or paragraphs/country.ts), so this bank is
// delivered adoption-ready: its slots map onto the country page's own
// data — {country} {capital} display data, {population} + {popYear}
// from the World Bank via the shared country-economy dataset
// (getCountryEconomy, Q7), {provinces} and {liveCities} from the site
// registry the page itself renders. Pakistan is the only published
// country today; entries that are Pakistan-specific say so.

import type { FaqBank } from './types';

export const COUNTRY_FAQ_BANK: FaqBank = [
  {
    id: 'country-capital',
    question: 'What is the capital of {country}?',
    answer:
      'The capital of {country} is {capital}. Its local time and current temperature appear in the World Capitals table on the Countries page, alongside every other sovereign capital.',
    slots: ['country', 'capital'],
    source: 'Country dataset + the capitals dataset (GeoNames) behind the /countries World Capitals table.',
  },
  {
    id: 'country-population',
    question: 'What is the population of {country}?',
    answer:
      'The World Bank’s latest published total for {country} is {population} ({popYear}). This page shows the figure with its data year, and where the Bank has not published a value, the page shows none rather than an estimate.',
    slots: ['country', 'population', 'popYear'],
    source: 'World Bank total population (SP.POP.TOTL) via the shared country-economy dataset — the same figures the economy sections print.',
    demand: 'Population is a standing country-guide query family in the phrase bank (country + population patterns).',
  },
  {
    id: 'country-currency',
    question: 'What currency is used in {country}?',
    answer:
      'The currency of {country} is the {currencyName} ({currencyCode}). Live exchange rates against the dollar, pound, riyal and dirham — interbank and open-market side by side — are on the rates page and in this country’s rates section.',
    slots: ['country', 'currencyName', 'currencyCode'],
    source: 'Rates data layer (ExchangeRate-API) — the currency the country’s own rates pages convert.',
  },
  {
    id: 'country-live-cities',
    question: 'Which cities in {country} have full guides on WorldCityHub?',
    answer:
      'Full, verified city guides are live for {liveCities}. Every other city opens only when its pages render completely from real data — the same rule that governs this country page — and the Countries hub always shows the current state honestly.',
    slots: ['country', 'liveCities'],
    source: 'The published-city registry (the same set the sitemap carries: Lahore, Karachi, Islamabad for Pakistan today).',
  },
  {
    id: 'country-provinces',
    question: 'What are the provinces and regions of {country}?',
    answer:
      '{country} is covered province by province: {provinces}. Each province with a published guide has its own page following the same template as this country page, and the provinces section above lists them with their own data.',
    slots: ['country', 'provinces'],
    source: 'The site’s province registry as rendered in this page’s provinces section (paragraphs/country.ts generators + registry data).',
  },
  {
    id: 'country-timezone',
    question: 'What time zone is {country} in?',
    answer:
      '{country} keeps a single time zone nationwide — {timezoneName} ({utcOffset}) — so the local time shown for every city on this site is the same across the whole country.',
    slots: ['country', 'timezoneName', 'utcOffset'],
    source: 'Registry time zone for the country’s cities (Asia/Karachi, UTC+5 for Pakistan). Pakistan entry — single-zone fact.',
  },
  {
    id: 'country-languages',
    question: 'What languages are spoken in {country}?',
    answer:
      'Urdu is the national language of {country}, used in education, government and media, alongside the regional languages of its provinces; English is widely used in business, universities and government. City pages name the languages of their own province.',
    slots: ['country'],
    source: 'The verified language formulation carried in the live city FAQ set (cityMeta.ts, Q11 pass). Pakistan entry.',
  },
  {
    id: 'country-emergency',
    question: 'What are the emergency numbers in {country}?',
    answer:
      'In {country}, call 15 for Police, 1122 for Rescue and ambulance, and 16 for the Fire Brigade; the Edhi Foundation ambulance is 115 and the women’s helpline is 1043. City pages carry the same numbers in their emergency sections.',
    slots: ['country'],
    source: 'Pakistan emergency numbers as verified in the live city FAQ set and the pages’ emergency-contacts data. Pakistan entry.',
  },
  {
    id: 'country-best-time',
    question: 'When is the best time to visit {country}?',
    answer:
      'October to March generally brings the most comfortable weather across {country}; May to July is the hottest period and the monsoon follows in July to September. Conditions vary by region, so check the live weather on the relevant city page before travelling — this is guidance, not a forecast.',
    slots: ['country'],
    source: 'General Pakistan climate guidance as carried in the verified city FAQ set (cityMeta.ts, Q11 pass). Pakistan entry.',
  },
  {
    id: 'country-data-sources',
    question: 'How is the data on this page sourced?',
    answer:
      'This page is assembled from named public sources: the World Bank for population and economy indicators, Open-Meteo and OpenWeatherMap for weather, Aladhan for prayer times, CoinGecko for gold and crypto, and GNews for headlines — all listed on the Sources page. A figure that cannot be traced to its source is not shown.',
    slots: [],
    source: 'The country page’s own data flow (country-economy dataset + city data layer) + the published /sources page.',
  },
];
