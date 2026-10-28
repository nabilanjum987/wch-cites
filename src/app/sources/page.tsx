import type { Metadata } from 'next';

// /sources — created in Q8 (link map §24 marks it BUILD: "the sources
// page the trust model needs"). Every provider below actually powers
// part of the live site today; what each one feeds is stated plainly.

export const metadata: Metadata = {
  title: 'Data Sources | WorldCityHub',
  description:
    'Where WorldCityHub data comes from: OpenWeatherMap, Aladhan, CoinGecko, World Bank, GNews, UNHCR, Open-Meteo, FRED and more — and what each source powers.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/sources' },
  openGraph: {
    title: 'Data Sources | WorldCityHub',
    description:
      'The real public data sources behind every figure on WorldCityHub, and what each one powers.',
    url: 'https://worldcityhub.vercel.app/sources',
    siteName: 'WorldCityHub',
    type: 'website',
  },
};

const SOURCES: { name: string; powers: string; url: string }[] = [
  { name: 'OpenWeatherMap', powers: 'Current weather, forecasts and air quality on city pages', url: 'https://openweathermap.org' },
  { name: 'Open-Meteo', powers: 'Weather for the World Capitals table and city extremes (free, keyless)', url: 'https://open-meteo.com' },
  { name: 'Aladhan', powers: 'Prayer times and the Hijri calendar (Karachi method)', url: 'https://aladhan.com' },
  { name: 'sunrise-sunset.org', powers: 'Sunrise, sunset and daylight length', url: 'https://sunrise-sunset.org' },
  { name: 'CoinGecko', powers: 'Cryptocurrency prices, plus the PAX Gold series behind the rates-page gold history and 24h change', url: 'https://www.coingecko.com' },
  { name: 'gold-api.com', powers: 'Gold (XAU) and silver (XAG) spot prices — the canonical metals feed for every surface', url: 'https://gold-api.com' },
  { name: 'ExchangeRate-API (open endpoint)', powers: 'Currency exchange rates — one USD-based snapshot, cross-converted for PKR, AED, SAR, GBP and more', url: 'https://www.exchangerate-api.com' },
  { name: 'Published currency dataset (fawazahmed0/currency-api)', powers: 'Dated daily exchange-rate snapshots behind the day-change figures and rate history charts', url: 'https://github.com/fawazahmed0/exchange-api' },
  { name: 'FRED — Federal Reserve Economic Data', powers: 'Brent crude oil daily spot price', url: 'https://fred.stlouisfed.org' },
  { name: 'Alternative.me', powers: 'Crypto Fear & Greed Index', url: 'https://alternative.me' },
  { name: 'World Bank Open Data', powers: 'Economy indicators (GDP, inflation, unemployment and more, each with its data year) and world population', url: 'https://data.worldbank.org' },
  { name: 'GNews', powers: 'Aggregated news headlines (headline, source and link only)', url: 'https://gnews.io' },
  { name: 'UNHCR', powers: 'Refugee and displacement figures on the conflicts hub', url: 'https://www.unhcr.org' },
  { name: 'Ticketmaster', powers: 'Event listings where its catalogue covers the city (strong in the US/EU; Pakistan coverage is minimal today, and lists say so)', url: 'https://www.ticketmaster.com' },
  { name: 'TheSportsDB', powers: 'Sports leagues and fixtures data', url: 'https://www.thesportsdb.com' },
  { name: 'GeoNames', powers: 'The World Capitals dataset (capitals, coordinates, timezones)', url: 'https://www.geonames.org' },
  { name: 'Wikipedia & Wikidata', powers: 'Reference summaries and structured facts for places and wonders', url: 'https://www.wikidata.org' },
  { name: 'date.nager.at', powers: 'Public-holiday calendars for covered countries (note: it does not currently cover Pakistan, so no Pakistan holiday is shown from it)', url: 'https://date.nager.at' },
];

export default function SourcesPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wide mb-3">Trust</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Data sources</h1>
        <p className="text-white/70 leading-relaxed mb-10">
          Every figure on WorldCityHub comes from one of these public sources. When a
          source does not respond, the figure is hidden rather than estimated silently —
          and where a number is an estimate, the page says so and explains the method.
        </p>
        <div className="space-y-3">
          {SOURCES.map((s) => (
            <div key={s.name} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-cyan-300 hover:underline"
              >
                {s.name}
              </a>
              <p className="text-white/60 text-sm mt-1">{s.powers}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
