// World population by continent (§5 Today's World, Stage 2) — SERVER
// component. Owner ruling (2026-11-03): the World Population and Life
// Expectancy cards move out of Live Market Rates into Today's World,
// joined by a pie of the world's population split by continent.
//
// Source discipline: every figure is the World Bank's SP.POP.TOTL
// (the same indicator behind the site's population counter), fetched
// per country and grouped by continent here. The Bank publishes
// regions, not continents, so the grouping is done at country level:
// each Bank region maps to one continent except where a region spans
// two, and those are split by explicit country lists (UN geoscheme):
//   EAS (East Asia & Pacific)   -> Asia, minus the Oceania list
//   ECS (Europe & Central Asia) -> Europe, minus the Asian list
//   LCN (Latin America & Car.)  -> South America list, rest N. America
//   MEA (Middle East & N. Afr.) -> Africa list, rest Asia
//   SAS -> Asia · NAC -> North America · SSF -> Africa
// If the fetch fails or yields fewer than two continents, the pie is
// omitted entirely — never a drawn-from-memory chart.

const OCEANIA = new Set(['AUS', 'NZL', 'PNG', 'FJI', 'SLB', 'VUT', 'FSM', 'KIR', 'MHL', 'NRU', 'PLW', 'WSM', 'TON', 'TUV', 'ASM', 'GUM', 'MNP', 'NCL', 'PYF', 'NIU', 'COK']);
const SOUTH_AMERICA = new Set(['ARG', 'BOL', 'BRA', 'CHL', 'COL', 'ECU', 'FLK', 'GUF', 'GUY', 'PRY', 'PER', 'SUR', 'URY', 'VEN']);
const ECS_ASIA = new Set(['TUR', 'KAZ', 'KGZ', 'TJK', 'TKM', 'UZB', 'ARM', 'AZE', 'GEO', 'CYP']);
const MEA_AFRICA = new Set(['DZA', 'EGY', 'LBY', 'MAR', 'TUN', 'SDN', 'ESH']);

const REGIONS = new Set(['EAS', 'ECS', 'LCN', 'MEA', 'NAC', 'SAS', 'SSF']);

function continentOf(region: string, iso3: string): string | null {
  switch (region) {
    case 'SAS': return 'Asia';
    case 'NAC': return 'North America';
    case 'SSF': return 'Africa';
    case 'EAS': return OCEANIA.has(iso3) ? 'Oceania' : 'Asia';
    case 'ECS': return ECS_ASIA.has(iso3) ? 'Asia' : 'Europe';
    case 'LCN': return SOUTH_AMERICA.has(iso3) ? 'South America' : 'North America';
    case 'MEA': return MEA_AFRICA.has(iso3) ? 'Africa' : 'Asia';
    default: return null;
  }
}

const PALETTE = ['#0C7A3D', '#34d399', '#C8A951', '#60a5fa', '#f87171', '#fb923c', '#a78bfa'];

/** Two-decimal percentages that sum to exactly 100.00 (largest slice
 *  absorbs the rounding residual), same rule as PopulationPie. */
function percentages(values: number[]): number[] {
  const total = values.reduce((s, v) => s + v, 0);
  if (total <= 0) return values.map(() => 0);
  const hundredths = values.map((v) => Math.round((v / total) * 10000));
  const residual = 10000 - hundredths.reduce((s, h) => s + h, 0);
  if (residual !== 0) {
    let largest = 0;
    values.forEach((v, i) => { if (v > values[largest]) largest = i; });
    hundredths[largest] += residual;
  }
  return hundredths.map((h) => h / 100);
}

function slicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

const fmtPop = (v: number) => (v >= 1e9 ? `${(v / 1e9).toFixed(2)} billion` : `${Math.round(v / 1e6)} million`);

interface ContinentSlice { label: string; value: number }

async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 86400 },
      headers: { 'User-Agent': 'WorldCityHub/1.0' },
    } as RequestInit);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchSlices(): Promise<ContinentSlice[]> {
  // Two World Bank calls, both cached a day: the country list (the
  // only response that carries each country's region) and the
  // population rows (which carry countryiso3code but no region).
  const [countriesJson, popJson] = await Promise.all([
    fetchJson('https://api.worldbank.org/v2/country?format=json&per_page=20000'),
    fetchJson('https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=20000&date=2022:2024'),
  ]);
  const regionOf = new Map<string, string>();
  for (const c of Array.isArray(countriesJson?.[1]) ? countriesJson[1] : []) {
    const iso3 = c?.id;
    const region = c?.region?.id;
    if (typeof iso3 === 'string' && iso3.length === 3 && REGIONS.has(region)) {
      regionOf.set(iso3, region);
    }
  }
  const rows = Array.isArray(popJson?.[1]) ? popJson[1] : [];
  // Latest available year per country.
  const latest = new Map<string, { region: string; value: number; year: number }>();
  for (const r of rows) {
    const iso3 = r?.countryiso3code;
    const region = typeof iso3 === 'string' ? regionOf.get(iso3) : undefined;
    const value = r?.value;
    const year = parseInt(String(r?.date ?? ''), 10);
    if (!region || typeof iso3 !== 'string') continue;
    if (typeof value !== 'number' || !Number.isFinite(year)) continue;
    const prev = latest.get(iso3);
    if (!prev || year > prev.year) latest.set(iso3, { region, value, year });
  }
  const totals = new Map<string, number>();
  for (const [iso3, row] of latest) {
    const c = continentOf(row.region, iso3);
    if (!c) continue;
    totals.set(c, (totals.get(c) ?? 0) + row.value);
  }
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export default async function WorldContinentPie() {
  const slices = await fetchSlices();
  if (slices.length < 2) return null;
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total <= 0) return null;
  const pcts = percentages(slices.map((s) => s.value));

  const cx = 100, cy = 100, r = 90;
  let angle = 0;
  const paths = slices.map((slice, i) => {
    const sweep = (slice.value / total) * 360;
    const path = slicePath(cx, cy, r, angle, angle + sweep);
    angle += sweep;
    return { ...slice, path, color: PALETTE[i % PALETTE.length] };
  });

  return (
    <div className="rounded-3xl border t-border t-card p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] t-text-50">World population by continent</p>
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-5">
        <svg viewBox="0 0 200 200" className="w-44 h-44 shrink-0" role="img"
          aria-label={`World population by continent. ${paths.map((p, i) => `${p.label} ${pcts[i].toFixed(2)} percent`).join(', ')}`}>
          {paths.map((p) => (
            <path key={p.label} d={p.path} fill={p.color} stroke="var(--bg)" strokeWidth="1" />
          ))}
        </svg>
        <ul className="w-full space-y-1.5 text-sm">
          {paths.map((p, i) => (
            <li key={p.label} className="flex items-baseline gap-2">
              <span className="inline-block w-3 h-3 rounded-sm shrink-0 self-center" style={{ backgroundColor: p.color }} />
              <span className="t-text-80">{p.label}</span>
              <span className="t-text-50 ml-auto text-right">{fmtPop(p.value)} · {pcts[i].toFixed(2)}%</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-[11px] t-text-35">
        Source: World Bank total population (SP.POP.TOTL), latest available year per country, grouped by continent.
        Antarctica has no resident population in the Bank's data.
      </p>
    </div>
  );
}
