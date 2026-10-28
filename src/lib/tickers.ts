// ─────────────────────────────────────────────────────────────────────────────
// Ticker data layer (WP2 Slice 1) — SERVER ONLY.
// Every figure comes from a live, free source at render time; an item is
// emitted ONLY when its source responded. Nothing is hard-coded and
// nothing is estimated silently — the one modelled figure (world
// population) is anchored to the World Bank's latest actual total and
// its published growth rate, and the formula is documented here.
//
// Sources:
//   Gold oz / BTC / gold 24h move — CoinGecko (PAX Gold tracks spot gold)
//   Gold tola (PKR) — CoinGecko PAX Gold in PKR × (11.6638 g / 31.1035 g)
//   Silver — gold-api.com spot XAG
//   FX to PKR — ExchangeRate-API open endpoint (keyless), USD base,
//     cross-divided. (Frankfurter's new host dropped PKR/AED/SAR coverage.)
//   Brent — FRED DCOILBRENTEU (Federal Reserve, daily spot, latest close)
//   Fear & Greed — Alternative.me
//   World population — World Bank WLD SP.POP.TOTL (latest actual) grown
//     at SP.POP.GROW from that year's mid-year point; ticks client-side
//   Next prayer — Aladhan (Karachi method), per city coordinates
//   Holidays — date.nager.at (Pakistan public holidays)
//   Hottest city — Open-Meteo current temperature
// ─────────────────────────────────────────────────────────────────────────────

export interface MarketItem {
  label: string;
  value: string;
  href: string;
  live?: { type: 'population'; base: number; perSecond: number; at: number } | { type: 'prayer'; at: number };
}

export interface SiteItem {
  text: string;
  href: string;
}

const TROY_OZ_G = 31.1035;
const TOLA_G = 11.6638;

async function jget(url: string, revalidate: number): Promise<any | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      next: { revalidate },
      headers: { 'User-Agent': 'WorldCityHub/1.0' },
    } as RequestInit);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function tget(url: string, revalidate: number): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      next: { revalidate },
      headers: { 'User-Agent': 'WorldCityHub/1.0' },
    } as RequestInit);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

const usd0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const pkr0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const fx2 = (n: number) => n.toFixed(2);

interface PrayerNext {
  name: string;
  time: string;
  at: number;
}

async function nextPrayer(lat: number, lng: number, tz: string, dateOffset = 0): Promise<PrayerNext | null> {
  const d = new Date(Date.now() + dateOffset * 86400000);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const data = await jget(
    `https://api.aladhan.com/v1/timings/${dd}-${mm}-${d.getUTCFullYear()}?latitude=${lat}&longitude=${lng}&method=1`,
    300,
  );
  const timings = data?.data?.timings;
  if (!timings) return null;
  const nowLocal = new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
  for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
    const raw: string | undefined = timings[name];
    if (!raw) continue;
    const [hh, mi] = raw.split(' ')[0].split(':').map(Number);
    const at = new Date(nowLocal);
    at.setHours(hh, mi, 0, 0);
    if (at.getTime() > nowLocal.getTime()) {
      const h12 = ((hh + 11) % 12) + 1;
      return { name, time: `${h12}:${String(mi).padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`, at: Date.now() + (at.getTime() - nowLocal.getTime()) };
    }
  }
  return dateOffset === 0 ? nextPrayer(lat, lng, tz, 1) : null;
}

// Published cities only (in the sitemap, QA-passed). Coordinates are the
// site's canonical registry values.
export const PUBLISHED_CITIES = [
  { slug: 'lahore', label: 'Lahore', province: 'punjab', lat: 31.5204, lng: 74.3587, tz: 'Asia/Karachi' },
  { slug: 'karachi', label: 'Karachi', province: 'sindh', lat: 24.8607, lng: 67.0011, tz: 'Asia/Karachi' },
  { slug: 'islamabad', label: 'Islamabad', province: 'islamabad-capital-territory', lat: 33.7294, lng: 73.0931, tz: 'Asia/Karachi' },
] as const;

const cityPath = (c: (typeof PUBLISHED_CITIES)[number]) => `/pakistan/${c.province}/${c.slug}`;

export async function getMarketTickerItems(pageCitySlug?: string): Promise<MarketItem[]> {
  const items: MarketItem[] = [];
  const [cg, silver, fx, fng, popTotal, popGrowth] = await Promise.all([
    jget('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold,bitcoin&vs_currencies=usd,pkr&include_24hr_change=true', 300),
    jget('https://api.gold-api.com/price/XAG', 300),
    jget('https://open.er-api.com/v6/latest/USD', 300),
    jget('https://api.alternative.me/fng/?limit=1', 900),
    jget('https://api.worldbank.org/v2/country/WLD/indicator/SP.POP.TOTL?format=json&per_page=1', 86400),
    jget('https://api.worldbank.org/v2/country/WLD/indicator/SP.POP.GROW?format=json&per_page=1', 86400),
  ]);
  const brentCsv = await tget('https://fred.stlouisfed.org/graph/fredgraph.csv?id=DCOILBRENTEU', 3600);

  const paxUsd = cg?.['pax-gold']?.usd;
  const paxPkr = cg?.['pax-gold']?.pkr;
  if (typeof paxPkr === 'number') {
    items.push({ label: 'Gold', value: `Rs ${pkr0.format(Math.round((paxPkr * TOLA_G) / TROY_OZ_G))}/tola`, href: '/rates#gold' });
  }
  if (typeof paxUsd === 'number') {
    items.push({ label: 'Gold', value: `$${usd0.format(Math.round(paxUsd))}/oz`, href: '/rates#gold' });
  }
  if (typeof silver?.price === 'number') {
    items.push({ label: 'Silver', value: `$${silver.price.toFixed(2)}/oz`, href: '/rates#silver' });
  }
  const r = fx?.result === 'success' ? fx?.rates : null;
  if (r && typeof r.PKR === 'number') {
    items.push({ label: 'USD → PKR', value: `Rs ${fx2(r.PKR)}`, href: '/rates' });
    if (typeof r.SAR === 'number') items.push({ label: 'SAR → PKR', value: `Rs ${fx2(r.PKR / r.SAR)}`, href: '/rates' });
    if (typeof r.AED === 'number') items.push({ label: 'AED → PKR', value: `Rs ${fx2(r.PKR / r.AED)}`, href: '/rates' });
    if (typeof r.GBP === 'number') items.push({ label: 'GBP → PKR', value: `Rs ${fx2(r.PKR / r.GBP)}`, href: '/rates' });
  }
  const btc = cg?.bitcoin?.usd;
  if (typeof btc === 'number') {
    items.push({ label: 'Bitcoin', value: `$${usd0.format(Math.round(btc))}`, href: '/rates#crypto' });
  }
  if (brentCsv) {
    const rows = brentCsv.trim().split('\n').slice(1);
    for (let i = rows.length - 1; i >= 0; i--) {
      const v = parseFloat(rows[i].split(',')[1]);
      if (Number.isFinite(v)) {
        items.push({ label: 'Brent', value: `$${v.toFixed(2)}`, href: '/rates' });
        break;
      }
    }
  }
  const fngVal = fng?.data?.[0];
  if (fngVal?.value) {
    items.push({ label: 'Fear & Greed', value: `${fngVal.value} · ${fngVal.value_classification}`, href: '/#finance' });
  }
  const total = popTotal?.[1]?.[0]?.value;
  const growthPct = popGrowth?.[1]?.[0]?.value;
  const baseYear = popTotal?.[1]?.[0]?.date ? parseInt(popTotal[1][0].date, 10) : null;
  if (typeof total === 'number' && typeof growthPct === 'number' && baseYear) {
    const anchorMs = Date.UTC(baseYear, 6, 1); // World Bank annual total = mid-year point
    const perSecond = (total * (growthPct / 100)) / 31557600;
    const estimate = Math.round(total + perSecond * ((Date.now() - anchorMs) / 1000));
    items.push({
      label: 'World Population',
      value: usd0.format(estimate),
      href: '/#finance',
      live: { type: 'population', base: estimate, perSecond, at: Date.now() },
    });
  }
  // P8 — the prayer entry follows the PAGE's city, not always Lahore.
  // The caller (root layout) passes the city slug parsed from the request
  // pathname; an unknown/absent slug falls back to Lahore, exactly as
  // before, so the homepage and non-city pages are unchanged. Only this
  // block changes — every other ticker entry above is untouched.
  const prayerCity = PUBLISHED_CITIES.find((c) => c.slug === pageCitySlug) ?? PUBLISHED_CITIES[0];
  const np = await nextPrayer(prayerCity.lat, prayerCity.lng, prayerCity.tz).catch(() => null);
  if (np) {
    items.push({
      label: `${prayerCity.label} Prayer`,
      value: `${np.name} ${np.time}`,
      href: `${cityPath(prayerCity)}/prayer-times`,
      live: { type: 'prayer', at: np.at },
    });
  }
  return items;
}

export async function getWebsiteTickerItems(): Promise<SiteItem[]> {
  const items: SiteItem[] = [];
  // 1) Next prayers in the published cities.
  const prayers = await Promise.all(
    PUBLISHED_CITIES.map((c) => nextPrayer(c.lat, c.lng, c.tz).catch(() => null)),
  );
  prayers.forEach((np, i) => {
    const c = PUBLISHED_CITIES[i];
    if (np) items.push({ text: `${c.label} · next prayer ${np.name} at ${np.time}`, href: `${cityPath(c)}/prayer-times` });
  });
  // 2) Hottest published city right now (Open-Meteo).
  try {
    const temps = await Promise.all(
      PUBLISHED_CITIES.map((c) =>
        jget(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lng}&current=temperature_2m`, 600),
      ),
    );
    let best: { c: (typeof PUBLISHED_CITIES)[number]; t: number } | null = null;
    temps.forEach((w, i) => {
      const t = w?.current?.temperature_2m;
      if (typeof t === 'number' && (!best || t > best.t)) best = { c: PUBLISHED_CITIES[i], t };
    });
    if (best) items.push({ text: `Hottest right now · ${best.c.label} ${Math.round(best.t)}°C`, href: `${cityPath(best.c)}/weather` });
  } catch { /* item omitted */ }
  // 3) Gold mover (CoinGecko 24h change, PKR tola).
  const cg = await jget('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=pkr&include_24hr_change=true', 300);
  const paxPkr = cg?.['pax-gold']?.pkr;
  const chg = cg?.['pax-gold']?.pkr_24h_change;
  if (typeof paxPkr === 'number' && typeof chg === 'number') {
    const tola = Math.round((paxPkr * TOLA_G) / TROY_OZ_G);
    const arrow = chg >= 0 ? '▲' : '▼';
    items.push({ text: `Gold today · Rs ${pkr0.format(tola)}/tola ${arrow} ${Math.abs(chg).toFixed(1)}%`, href: '/rates' });
  }
  // 4) Wonders + Oceans — the published golden pages (link map L3/L6
  // switch-on, 2026-10-22). Figure-bearing when the source responds
  // (Taj temperature via Open-Meteo forecast; Arabian Sea wave height
  // via Open-Meteo Marine at the sea's representative point 16°N 64°E),
  // otherwise the plain published-page item, like the compares below.
  // No other wonder/ocean items exist until their pages publish (L3).
  const tajPlain = { text: 'Wonder · Taj Mahal — the full page is live', href: '/wonders/taj-mahal' };
  try {
    const taj = await jget('https://api.open-meteo.com/v1/forecast?latitude=27.175&longitude=78.0419&current=temperature_2m', 600);
    const tt = taj?.current?.temperature_2m;
    items.push(typeof tt === 'number'
      ? { text: `Taj Mahal right now · ${Math.round(tt)}°C in Agra`, href: '/wonders/taj-mahal' }
      : tajPlain);
  } catch { items.push(tajPlain); }
  const seaPlain = { text: 'Ocean · Arabian Sea — the full page is live', href: '/oceans/arabian-sea' };
  try {
    const sea = await jget('https://marine-api.open-meteo.com/v1/marine?latitude=16&longitude=64&current=wave_height', 600);
    const wh = sea?.current?.wave_height;
    items.push(typeof wh === 'number'
      ? { text: `Arabian Sea today · waves ${wh.toFixed(1)} m`, href: '/oceans/arabian-sea' }
      : seaPlain);
  } catch { items.push(seaPlain); }
  // 5) A public holiday in Pakistan today.
  try {
    const year = new Date().getUTCFullYear();
    const holidays = await jget(`https://date.nager.at/api/v3/PublicHolidays/${year}/PK`, 3600);
    const todayPk = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));
    const iso = `${todayPk.getFullYear()}-${String(todayPk.getMonth() + 1).padStart(2, '0')}-${String(todayPk.getDate()).padStart(2, '0')}`;
    const hit = Array.isArray(holidays) ? holidays.find((h: any) => h.date === iso) : null;
    if (hit) items.push({ text: `Today in Pakistan · ${hit.name}`, href: `${cityPath(PUBLISHED_CITIES[0])}/events` });
  } catch { /* item omitted */ }
  // 6) Trending compares — the published pairs only.
  items.push({ text: 'Compare · Lahore vs Karachi', href: '/compare/lahore-vs-karachi' });
  items.push({ text: 'Compare · Karachi vs Islamabad', href: '/compare/karachi-vs-islamabad' });
  return items.slice(0, 10);
}
