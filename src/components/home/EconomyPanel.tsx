import Link from 'next/link';

// Economy panel (§19) — SERVER component. Pakistan's headline
// indicators from the World Bank, each shown WITH its data year (the
// site rule: a figure whose year is unknown is not shown). The full
// economy dashboard lives on the country page.

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

export default async function EconomyPanel() {
  const rows = await Promise.all(
    INDICATORS.map(async (ind) => ({ ...ind, data: await fetchIndicator(ind.id) })),
  );
  const shown = rows.filter((r) => r.data);
  if (shown.length === 0) {
    return (
      <p className="text-white/50 text-sm">
        The World Bank feed is unreachable right now — the full economy dashboard is on the Pakistan page.
      </p>
    );
  }
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {shown.map((r) => (
          <div key={r.id} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wide text-gray-500">{r.label}</div>
            <div className="text-white font-bold text-xl mt-0.5">{r.format(r.data!.value)}</div>
            <div className="text-white/40 text-xs">Pakistan · {r.data!.year}</div>
          </div>
        ))}
      </div>
      <Link href="/pakistan" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 text-sm font-medium no-underline">
        Pakistan's full economy dashboard →
      </Link>
    </div>
  );
}
