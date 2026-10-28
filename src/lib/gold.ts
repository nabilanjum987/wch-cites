// ─────────────────────────────────────────────────────────────────────────────
// Canonical gold spot (F4) — ONE shared helper for every gold surface.
// Headline spot: gold-api.com GET /price/XAU — true bullion spot,
// keyless, publishing its own `updatedAt`, so every surface can show
// the same figure and the same "as of" time. Fallback: CoinGecko PAX
// Gold (the feed every surface used before this change) — a gold-api
// outage degrades to today's behaviour, never a blank. gold-api
// publishes spot only: no 24h change, no history. Those two figures on
// /rates keep coming from CoinGecko's PAXG series (src/lib/apis/rates.ts)
// and are labelled as that series there — the one honest exception.
// PKR conversion uses the ExchangeRate-API open endpoint (keyless),
// the same USD/PKR rate the tickers and /rates already use.
// One calculation everywhere: per-gram = per-oz / 31.1035;
// per-tola = per-gram × 11.6638 (the troy-derived tola mass).
// Server fetches share one 300s cache window, so surfaces rendered
// within that window read the identical spot.
// Usable server-side AND client-side (the rates/snapshot clients
// already fetch these same public endpoints from the browser).
// ─────────────────────────────────────────────────────────────────────────────

export const TROY_OZ_GRAMS = 31.1035;
export const TOLA_GRAMS = 11.6638;

export type GoldSpotSource = 'gold-api-xau' | 'coingecko-pax-gold';

export interface GoldSpot {
  priceUsdPerOz: number;
  updatedAt: string;
  source: GoldSpotSource;
}

export interface GoldPkr {
  perOz: number;
  perGram: number;
  perTola: number;
  updatedAt: string;
  source: GoldSpotSource;
}

async function jget(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
    } as RequestInit);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getGoldSpot(): Promise<GoldSpot | null> {
  const d = await jget('https://api.gold-api.com/price/XAU');
  const spot = typeof d?.price === 'number' ? d.price : null;
  if (spot) {
    return {
      priceUsdPerOz: spot,
      updatedAt: typeof d?.updatedAt === 'string' ? d.updatedAt : new Date().toISOString(),
      source: 'gold-api-xau',
    };
  }
  // Fallback (today's behaviour): PAX Gold token price in USD.
  const cg = await jget('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd');
  const pax = cg?.['pax-gold']?.usd;
  if (typeof pax !== 'number') return null;
  return { priceUsdPerOz: pax, updatedAt: new Date().toISOString(), source: 'coingecko-pax-gold' };
}

export async function getUsdPkrRate(): Promise<number | null> {
  const fx = await jget('https://open.er-api.com/v6/latest/USD');
  const r = fx?.rates?.PKR;
  return typeof r === 'number' ? r : null;
}

export async function getGoldPkr(): Promise<GoldPkr | null> {
  const spot = await getGoldSpot();
  if (!spot) return null;
  const rate = await getUsdPkrRate();
  if (rate) {
    const perOz = spot.priceUsdPerOz * rate;
    return {
      perOz,
      perGram: perOz / TROY_OZ_GRAMS,
      perTola: (perOz / TROY_OZ_GRAMS) * TOLA_GRAMS,
      updatedAt: spot.updatedAt,
      source: spot.source,
    };
  }
  // FX down: degraded PKR quote straight from the fallback feed
  // (today's My City / city behaviour) rather than no figure at all.
  const cg = await jget('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=pkr');
  const paxPkr = cg?.['pax-gold']?.pkr;
  if (typeof paxPkr !== 'number') return null;
  return {
    perOz: paxPkr,
    perGram: paxPkr / TROY_OZ_GRAMS,
    perTola: (paxPkr / TROY_OZ_GRAMS) * TOLA_GRAMS,
    updatedAt: new Date().toISOString(),
    source: 'coingecko-pax-gold',
  };
}
