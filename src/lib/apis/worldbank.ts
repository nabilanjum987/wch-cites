// World Bank Indicators API — free, unauthenticated, unlimited.
// Docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/898581
// Response shape: [ { page, pages, per_page, total }, [ { date, value, country: { value } }, ... ] ]

export interface GrowthDataPoint {
  year: string;
  value: number | null;
}

export interface GrowthDashboardData {
  gdp: GrowthDataPoint[];
  population: GrowthDataPoint[];
  exports: GrowthDataPoint[];
}

const INDICATORS = {
  gdp: 'NY.GDP.MKTP.CD',          // GDP, current US$
  population: 'SP.POP.TOTL',       // Total population
  exports: 'NE.EXP.GNFS.CD',       // Exports of goods and services, current US$
};

async function fetchIndicator(countryCode: string, indicatorCode: string): Promise<GrowthDataPoint[]> {
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?format=json&per_page=15&date=2014:2024`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('fetchIndicator: HTTP', res.status, indicatorCode);
      return [];
    }
    const json = await res.json();
    const rows = json?.[1];
    if (!Array.isArray(rows)) return [];
    return rows
      .map((r: { date: string; value: number | null }) => ({ year: r.date, value: r.value }))
      .filter((r: GrowthDataPoint) => r.value !== null)
      .sort((a: GrowthDataPoint, b: GrowthDataPoint) => a.year.localeCompare(b.year));
  } catch (err) {
    console.error('fetchIndicator: fetch failed', indicatorCode, err);
    return [];
  }
}

export async function fetchGrowthDashboardData(countryCode: string): Promise<GrowthDashboardData> {
  const [gdp, population, exports] = await Promise.all([
    fetchIndicator(countryCode, INDICATORS.gdp),
    fetchIndicator(countryCode, INDICATORS.population),
    fetchIndicator(countryCode, INDICATORS.exports),
  ]);
  return { gdp, population, exports };
}

// Slug → ISO2 mapping for pages that only have a country slug (e.g. Economy page),
// not the country object's `code` field directly. Extend as new countries are seeded.
const SLUG_TO_ISO2: Record<string, string> = {
  pakistan: 'PK',
  india: 'IN',
  'united-states': 'US',
  'united-arab-emirates': 'AE',
  uae: 'AE',
  'united-kingdom': 'GB',
  uk: 'GB',
  'saudi-arabia': 'SA',
  turkey: 'TR',
  turkiye: 'TR',
  bangladesh: 'BD',
  germany: 'DE',
  japan: 'JP',
  china: 'CN',
  usa: 'US',
};

export function countrySlugToIso2(slug: string): string {
  const clean = slug.toLowerCase().trim();
  return SLUG_TO_ISO2[clean] || clean.toUpperCase().slice(0, 2);
}

// Canonical ISO2 resolution (PC1 fix, 2026-10-22). The explicit slug map
// ALWAYS wins. A stored/fallback country_code is used only when the slug
// is not in the map — never the other way round. The pre-fix economy page
// trusted a generated fallback record whose country_code was derived by
// truncating the slug ("pakistan" -> "PA"), which is Panama's ISO2, so
// cities missing from that fallback table silently showed Panama's
// World Bank indicators.
export function resolveIso2(countrySlug: string, storedCode?: string | null): string {
  const clean = countrySlug.toLowerCase().trim();
  if (SLUG_TO_ISO2[clean]) return SLUG_TO_ISO2[clean];
  if (storedCode && /^[A-Za-z]{2}$/.test(storedCode)) return storedCode.toUpperCase();
  return countrySlugToIso2(countrySlug);
}


// ── Latest-value indicators (Batch 3b) ──────────────────────────────────────
// Real country indicators from the World Bank, latest non-null value per
// country in 2010–2026, each with its data year so the UI can show how
// current a figure is (and hide it when too stale). This replaces the
// static COUNTRY_ECONOMY / FINANCIAL_STRESS_DATA / MISERY_INDEX_DATA /
// INTEREST_RATES tables whose values were undated snapshots (e.g.
// Pakistan inflation 28.3%, "interest rate 22%", population 231M — all
// stale) presented as current facts.

export type WBKey =
  | 'gdpUsd' | 'gdpGrowth' | 'gdpPerCapita' | 'inflation' | 'unemployment'
  | 'population' | 'laborForce' | 'lifeExpectancy' | 'literacy' | 'gini'
  | 'poverty' | 'fdiUsd' | 'remittancesUsd' | 'tradeBalanceUsd' | 'realRate'
  | 'debtPctGdp';

export type WBValues = Partial<Record<WBKey, { value: number; year: number }>>;

const LATEST_INDICATORS: Record<WBKey, string> = {
  gdpUsd: 'NY.GDP.MKTP.CD',
  gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
  gdpPerCapita: 'NY.GDP.PCAP.CD',
  inflation: 'FP.CPI.TOTL.ZG',
  unemployment: 'SL.UEM.TOTL.ZS',
  population: 'SP.POP.TOTL',
  laborForce: 'SL.TLF.TOTL.IN',
  lifeExpectancy: 'SP.DYN.LE00.IN',
  literacy: 'SE.ADT.LITR.ZS',
  gini: 'SI.POV.GINI',
  poverty: 'SI.POV.DDAY',
  fdiUsd: 'BX.KLT.DINV.CD.WD',
  remittancesUsd: 'BX.TRF.PWKR.CD.DT',
  tradeBalanceUsd: 'BN.GSR.GNFS.CD',
  realRate: 'FR.INR.RINR',
  debtPctGdp: 'GC.DOD.TOTL.GD.ZS',
};

export async function fetchWorldBankLatest(codes: string[]): Promise<Record<string, WBValues>> {
  const out: Record<string, WBValues> = {};
  const list = Array.from(new Set(codes.filter(Boolean)));
  if (list.length === 0) return out;
  const joined = list.join(';');
  await Promise.all((Object.entries(LATEST_INDICATORS) as [WBKey, string][]).map(async ([key, ind]) => {
    try {
      const res = await fetch(
        `https://api.worldbank.org/v2/country/${joined}/indicator/${ind}?format=json&per_page=1000&date=2010:2026`,
        { next: { revalidate: 86400 } },
      );
      if (!res.ok) return;
      const json = await res.json();
      const rows = json?.[1];
      if (!Array.isArray(rows)) return;
      for (const r of rows) {
        if (r.value == null) continue;
        const code = r.country?.id as string | undefined;
        if (!code) continue;
        const year = parseInt(r.date as string, 10);
        const cur = (out[code] ??= {})[key];
        if (!cur || year > cur.year) out[code][key] = { value: r.value as number, year };
      }
    } catch { /* indicator unavailable — consumers hide the figure */ }
  }));
  return out;
}

// Misery Index = inflation + unemployment (the standard definition),
// computed from real World Bank values.
export const MISERY_META: { slug: string; name: string; iso2: string }[] = [
  { slug: 'turkey', name: 'Turkey', iso2: 'TR' },
  { slug: 'pakistan', name: 'Pakistan', iso2: 'PK' },
  { slug: 'bangladesh', name: 'Bangladesh', iso2: 'BD' },
  { slug: 'india', name: 'India', iso2: 'IN' },
  { slug: 'uk', name: 'UK', iso2: 'GB' },
  { slug: 'usa', name: 'USA', iso2: 'US' },
  { slug: 'germany', name: 'Germany', iso2: 'DE' },
  { slug: 'uae', name: 'UAE', iso2: 'AE' },
  { slug: 'japan', name: 'Japan', iso2: 'JP' },
  { slug: 'china', name: 'China', iso2: 'CN' },
];

export interface MiseryRow {
  country: string;
  countrySlug: string;
  inflation: number;
  unemployment: number;
  miseryIndex: number;
  rank: number;
  year: number;
}

export function buildMiseryIndex(map: Record<string, WBValues>): MiseryRow[] {
  const rows: MiseryRow[] = [];
  for (const m of MISERY_META) {
    const v = map[m.iso2];
    const inf = v?.inflation;
    const un = v?.unemployment;
    if (!inf || !un) continue;
    rows.push({
      country: m.name,
      countrySlug: m.slug,
      inflation: Math.round(inf.value * 10) / 10,
      unemployment: Math.round(un.value * 10) / 10,
      miseryIndex: Math.round((inf.value + un.value) * 10) / 10,
      rank: 0,
      year: Math.min(inf.year, un.year),
    });
  }
  rows.sort((a, b) => b.miseryIndex - a.miseryIndex);
  rows.forEach((r, i) => { r.rank = i + 1; });
  return rows;
}

// WCH-computed stress score from real World Bank inputs (this is a
// derived indicator, and the UI labels it as computed). Scale chosen so
// calm economies land <30 and crisis economies >80, matching the level
// thresholds the meters already use.
export function computeStressScore(inflation: number, unemployment: number): number {
  return Math.max(0, Math.min(100, Math.round(inflation * 1.6 + unemployment * 3.2)));
}

export function stressLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score < 30) return 'low';
  if (score < 60) return 'medium';
  if (score < 80) return 'high';
  return 'critical';
}

// ── THE canonical country-economy dataset (PC1 fix, 2026-10-22) ────────────
// ONE cached fetch per country feeds every consumer: the economy page's
// cards, the Financial Stress Meter, the Misery Index table, and the
// city-main economy snapshot all read from this single result, so two
// pages (or two sections of one page) can never disagree about a
// country's figures again. The underlying fetches carry a 24h Next
// data-cache revalidate (see fetchWorldBankLatest), and every value
// keeps its World Bank data year.
export interface CountryEconomy {
  iso2: string;
  values: WBValues;
  misery: MiseryRow[];
}

export async function getCountryEconomy(iso2: string): Promise<CountryEconomy> {
  const code = iso2.toUpperCase();
  const codes = Array.from(new Set([code, ...MISERY_META.map((m) => m.iso2)]));
  const map = await fetchWorldBankLatest(codes);
  return {
    iso2: code,
    values: map[code] ?? {},
    misery: buildMiseryIndex(map),
  };
}
