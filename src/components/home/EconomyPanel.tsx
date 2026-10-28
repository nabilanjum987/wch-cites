import Link from 'next/link';

// Economy panel (§19) — SERVER component. Pakistan's headline
// indicators from the World Bank, each shown WITH its data year (the
// site rule: a figure whose year is unknown is not shown). The full
// economy dashboard lives on the country page.
// Homepage-imagery pass (2026-10-28): the numbers-only cards gain a
// visual — a real GDP trend chart drawn from the SAME World Bank
// series (NY.GDP.MKTP.CD, current US$) the panel already uses, last
// twelve available years, hand-drawn SVG (no chart library, no new
// API). If the series fetch fails or returns fewer than two points,
// the chart is omitted entirely — never an invented line.

const INDICATORS: { id: string; label: string; format: (v: number) => string }[] = [
  { id: 'NY.GDP.MKTP.CD', label: 'GDP', format: (v) => `$${(v / 1e9).toFixed(0)}B` },
  { id: 'NY.GDP.MKTP.KD.ZG', label: 'GDP growth', format: (v) => `${v.toFixed(1)}%` },
  { id: 'FP.CPI.TOTL.ZG', label: 'Inflation', format: (v) => `${v.toFixed(1)}%` },
  { id: 'SL.UEM.TOTL.ZS', label: 'Unemployment', format: (v) => `${v.toFixed(1)}%` },
  { id: 'SP.POP.TOTL', label: 'Population', format: (v) => `${(v / 1e6).toFixed(1)}M` },
];

async function fetchIndicator(id: string): Promise<{ value: number; year: string } | null> {
  try {
    const res = await fetch(`https://api.worldbank.org/v2/country/PAK/indicator/${id}?format=json&per_page=5`, {
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 86400 },
      headers: { 'User-Agent': 'WorldCityHub/1.0' },
    } as RequestInit);
    if (!res.ok) return null;
    const json = await res.json();
    const row = Array.isArray(json?.[1]) ? json[1].find((r: any) => typeof r?.value === 'number') : null;
    return row ? { value: row.value, year: String(row.date) } : null;
  } catch {
    return null;
  }
}

async function fetchGdpSeries(): Promise<{ year: string; value: number }[]> {
  try {
    const res = await fetch('https://api.worldbank.org/v2/country/PAK/indicator/NY.GDP.MKTP.CD?format=json&per_page=15', {
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 86400 },
      headers: { 'User-Agent': 'WorldCityHub/1.0' },
    } as RequestInit);
    if (!res.ok) return [];
    const json = await res.json();
    const rows = Array.isArray(json?.[1]) ? json[1] : [];
    return rows
      .filter((r: any) => typeof r?.value === 'number' && r?.date)
      .map((r: any) => ({ year: String(r.date), value: r.value as number }))
      .sort((a: any, b: any) => a.year.localeCompare(b.year))
      .slice(-12);
  } catch {
    return [];
  }
}

function GdpChart({ pts }: { pts: { year: string; value: number }[] }) {
  const W = 640, H = 180, PAD_L = 8, PAD_R = 8, PAD_T = 12, PAD_B = 24;
  const vals = pts.map((p) => p.value);
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = max - min || 1;
  const stepX = (W - PAD_L - PAD_R) / Math.max(1, pts.length - 1);
  const xy = pts.map((p, i) => [
    PAD_L + i * stepX,
    PAD_T + (H - PAD_T - PAD_B) * (1 - (p.value - min) / span),
  ] as const);
  const line = xy.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const [lx, ly] = xy[xy.length - 1];
  const fmtB = (v: number) => `$${(v / 1e9).toFixed(0)}B`;
  return (
    <div className="rounded-2xl t-card border t-border p-5 mb-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="t-text font-bold">Pakistan GDP — current US$, {pts[0].year}–{pts[pts.length - 1].year}</div>
        <div className="t-text font-bold text-xl">{fmtB(pts[pts.length - 1].value)}</div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img"
        aria-label={`Pakistan GDP from ${pts[0].year} (${fmtB(pts[0].value)}) to ${pts[pts.length - 1].year} (${fmtB(pts[pts.length - 1].value)})`}>
        <polygon points={`${PAD_L},${H - PAD_B} ${line} ${lx.toFixed(1)},${H - PAD_B}`} fill="#34d399" opacity="0.12" />
        <polyline points={line} fill="none" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={lx} cy={ly} r="3.5" fill="#34d399" />
        <text x={PAD_L} y={H - 6} fontSize="11" fill="var(--text-40, #94a3b8)">{pts[0].year}</text>
        <text x={W - PAD_R} y={H - 6} fontSize="11" fill="var(--text-40, #94a3b8)" textAnchor="end">{pts[pts.length - 1].year}</text>
      </svg>
      <p className="text-[11px] t-text-40 mt-1">Source: World Bank indicator NY.GDP.MKTP.CD (GDP, current US$), Pakistan — the same feed as the stat cards above.</p>
    </div>
  );
}

export default async function EconomyPanel() {
  const rows = await Promise.all(
    INDICATORS.map(async (ind) => ({ ...ind, data: await fetchIndicator(ind.id) })),
  );
  const shown = rows.filter((r) => r.data);
  if (shown.length === 0) {
    return (
      <p className="sub-desc">
        The World Bank feed is unreachable right now — the full economy dashboard is on the Pakistan page.
      </p>
    );
  }
  const gdp = await fetchGdpSeries();
  return (
    <div>
      {gdp.length >= 2 && <GdpChart pts={gdp} />}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {shown.map((r) => (
          <div key={r.id} className="rounded-xl t-card border t-border px-4 py-3">
            <div className="text-[11px] uppercase tracking-wide t-g500">{r.label}</div>
            <div className="t-text font-bold text-xl mt-0.5">{r.format(r.data!.value)}</div>
            <div className="sub-desc">Pakistan · {r.data!.year}</div>
          </div>
        ))}
      </div>
      <Link href="/pakistan" className="inline-flex items-center gap-2 t-link text-sm font-medium no-underline">
        Pakistan's full economy dashboard →
      </Link>
    </div>
  );
}
