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
};

export function countrySlugToIso2(slug: string): string {
  const clean = slug.toLowerCase().trim();
  return SLUG_TO_ISO2[clean] || clean.toUpperCase().slice(0, 2);
}

