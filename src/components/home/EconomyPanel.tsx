// Economy panel (§19) — SERVER component. WORLD economy aggregates
// from the World Bank's published indicators for the World aggregate
// (WLD), each with its data year shown. Stage 2 (owner ruling,
// 2026-11-03): this section was Pakistan's economy under a world
// heading; it is now the world economy its intro describes, matching
// the homepage's world scope. Pakistan's own dashboard lives on the
// Pakistan country page. Fallbacks keep the panel truthful (never
// empty, never invented) when a fetch fails, and the bottom link goes
// to the countries hub where every country's own economy page lives.

async function jget(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 86400 },
      headers: { 'User-Agent': 'WorldCityHub/1.0' },
    } as RequestInit);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const latest = (json: any): { value: number; year: string } | null => {
  const row = Array.isArray(json?.[1]) ? json[1].find((r: any) => typeof r?.value === 'number') : null;
  return row ? { value: row.value, year: String(row.date) } : null;
};

const fmtUsd = (v: number) => {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  return `$${v.toLocaleString('en-US')}`;
};
const fmtPop = (v: number) => {
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
  return v.toLocaleString('en-US');
};
const fmtPct = (v: number) => `${v.toFixed(1)}%`;

function Card({ label, sub, children }: { label: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl t-card border t-border px-4 py-3">
      <div className="t-emerald text-xs font-semibold uppercase tracking-wide">{label}</div>
      <div className="t-text font-bold text-xl mt-1">{children}</div>
      <div className="sub-desc">{sub}</div>
    </div>
  );
}

export default async function EconomyPanel() {
  // Speed pass (2026-11-03): the GDP history fetch below is independent
  // of the five headline indicators (a different URL), so it joins the
  // same Promise.all instead of adding a second sequential round-trip.
  const [gdpJ, growthJ, inflationJ, unempJ, popJ, seriesJson] = await Promise.all([
    jget('https://api.worldbank.org/v2/country/WLD/indicator/NY.GDP.MKTP.CD?format=json&per_page=3'),
    jget('https://api.worldbank.org/v2/country/WLD/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=3'),
    jget('https://api.worldbank.org/v2/country/WLD/indicator/FP.CPI.TOTL.ZG?format=json&per_page=3'),
    jget('https://api.worldbank.org/v2/country/WLD/indicator/SL.UEM.TOTL.ZS?format=json&per_page=3'),
    jget('https://api.worldbank.org/v2/country/WLD/indicator/SP.POP.TOTL?format=json&per_page=3'),
    // GDP history (2015 to latest) from the Bank's series, drawn as a
    // trend chart like the one this panel has always carried.
    jget('https://api.worldbank.org/v2/country/WLD/indicator/NY.GDP.MKTP.CD?format=json&per_page=15&date=2015:2030'),
  ]);
  const gdp = latest(gdpJ);
  const growth = latest(growthJ);
  const inflation = latest(inflationJ);
  const unemp = latest(unempJ);
  const pop = latest(popJ);
  const series: { year: string; v: number }[] = (Array.isArray(seriesJson?.[1]) ? seriesJson[1] : [])
    .filter((r: any) => typeof r?.value === 'number')
    .map((r: any) => ({ year: String(r.date), v: r.value as number }))
    .sort((a: { year: string }, b: { year: string }) => a.year.localeCompare(b.year));
  let chart: React.ReactNode = null;
  if (series.length >= 3) {
    const W = 480, H = 120, PAD = 6;
    const max = Math.max(...series.map((s) => s.v)) * 1.05;
    const min = Math.min(...series.map((s) => s.v)) * 0.95;
    const pt = (s: { year: string; v: number }, i: number) =>
      `${(PAD + (i * (W - 2 * PAD)) / (series.length - 1)).toFixed(1)},${(H - PAD - ((s.v - min) / (max - min)) * (H - 2 * PAD)).toFixed(1)}`;
    chart = (
      <div className="rounded-xl t-card border t-border px-4 py-3 mt-3">
        <div className="t-emerald text-xs font-semibold uppercase tracking-wide">World GDP trend</div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28 mt-2" role="img" aria-label={`World GDP from ${series[0].year} to ${series[series.length - 1].year}, rising overall`}>
          <polyline points={series.map(pt).join(' ')} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
        <div className="sub-desc flex justify-between">
          <span>{series[0].year}: {fmtUsd(series[0].v)}</span>
          <span>{series[series.length - 1].year}: {fmtUsd(series[series.length - 1].v)}</span>
        </div>
        <div className="sub-desc mt-1">Source: World Bank NY.GDP.MKTP.CD (current US$)</div>
      </div>
    );
  }

  const anyCard = gdp || growth || inflation || unemp || pop;
  return (
    <div>
      {anyCard ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {gdp && <Card label="GDP" sub={`World · ${gdp.year}`}>{fmtUsd(gdp.value)}</Card>}
          {growth && <Card label="GDP growth" sub={`World · ${growth.year}`}>{fmtPct(growth.value)}</Card>}
          {inflation && <Card label="Inflation" sub={`World · ${inflation.year}`}>{fmtPct(inflation.value)}</Card>}
          {unemp && <Card label="Unemployment" sub={`World · ${unemp.year}`}>{fmtPct(unemp.value)}</Card>}
          {pop && <Card label="Population" sub={`World · ${pop.year}`}>{fmtPop(pop.value)}</Card>}
        </div>
      ) : (
        <p className="sub-desc">
          Live world figures could not be loaded just now. Every country's own economy dashboard is on the countries page below.
        </p>
      )}
      {chart}
      <div className="mt-4">
        <a href="/countries"
          className="px-4 py-2 rounded-full t-card border t-border-15 t-text-80 text-sm font-medium t-card-hover transition-colors no-underline inline-block">
          Every country's full economy dashboard →
        </a>
      </div>
    </div>
  );
}
