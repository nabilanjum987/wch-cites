import Link from 'next/link';
import { aqiScore, cityPath, POPULAR_PAIRS, findCompareCity, type CityCompareData } from '@/lib/compare';
import { censusPopulationOr, hasCensusPopulation } from '@/lib/census2023';
import PopulationPie from '@/components/PopulationPie';

// Server-rendered side-by-side comparison (Page 15 of the locked plan,
// honest-data subset). Winners are named per category, but the verdict
// is always two-sided and priority-based — the plan forbids an absolute
// "best city" claim. Categories without a reliable free data source
// (cost of living, safety indices, salaries) are omitted, not estimated.

function fmtPop(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${n}`;
}

function Row({ label, va, vb, better }: { label: string; va: string; vb: string; better?: 'a' | 'b' | null }) {
  const cls = (side: 'a' | 'b') =>
    `px-4 py-2.5 text-right ${better === side ? 'font-bold text-emerald-300' : 'text-gray-200'}`;
  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="px-4 py-2.5 text-gray-400">{label}</td>
      <td className={cls('a')}>{va}</td>
      <td className={cls('b')}>{vb}</td>
    </tr>
  );
}

export default function CompareView({ a, b }: { a: CityCompareData; b: CityCompareData }) {
  const nameA = a.city.name;
  const nameB = b.city.name;
  const comfortWinner = a.comfort != null && b.comfort != null
    ? (a.comfort === b.comfort ? null : a.comfort > b.comfort ? 'a' : 'b') : null;
  const aqiA = aqiScore(a.aqi);
  const aqiB = aqiScore(b.aqi);
  const aqiWinner = aqiA != null && aqiB != null
    ? (aqiA === aqiB ? null : aqiA > aqiB ? 'a' : 'b') : null;
  // Population figures: the census total whenever the city carries one
  // (F3's single store), otherwise the incoming figure unchanged — so
  // the Population row, the scorecard and the pie below can never
  // disagree. The pie renders only when BOTH sides have a census figure.
  // NOTE (pies PR): the popKey/popLabel lines below are identical to
  // F3 (#110) — the F3-first rebase keeps F3's copy and drops this one.
  const popKey = (d: CityCompareData) => `${d.ref.countrySlug}/${d.ref.provinceSlug}/${d.ref.citySlug}`;
  const popA = censusPopulationOr(popKey(a), a.city.population);
  const popB = censusPopulationOr(popKey(b), b.city.population);
  const bothCensus = hasCensusPopulation(popKey(a)) && hasCensusPopulation(popKey(b));
  const popLabel = bothCensus ? 'Population (2023 census)' : 'Population';
  const biggerWinner = popA === popB ? null : popA > popB ? 'a' : 'b';

  const categories: { label: string; winner: 'a' | 'b' | null; detail: string }[] = [
    { label: 'Weather comfort right now', winner: comfortWinner as 'a' | 'b' | null, detail: `Comfort score ${a.comfort ?? '—'} vs ${b.comfort ?? '—'} (WCH-computed from live feels-like, humidity and wind)` },
    { label: 'Air quality right now', winner: aqiWinner as 'a' | 'b' | null, detail: `US AQI ${a.aqi ?? '—'} (${a.aqiLevel ?? 'unknown'}) vs ${b.aqi ?? '—'} (${b.aqiLevel ?? 'unknown'})` },
    { label: 'City size', winner: biggerWinner as 'a' | 'b' | null, detail: `Population ${fmtPop(popA)} vs ${fmtPop(popB)}` },
  ];
  const winsA = categories.filter((c) => c.winner === 'a').length;
  const winsB = categories.filter((c) => c.winner === 'b').length;

  const otherPairs = POPULAR_PAIRS.filter(
    ([x, y]) => !(x === a.ref.citySlug && y === b.ref.citySlug) && !(x === b.ref.citySlug && y === a.ref.citySlug),
  );

  return (
    <div className="space-y-8">
      {/* Quick Verdict */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-white">Quick Verdict</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">
          Right now, {comfortWinner === 'a' ? nameA : comfortWinner === 'b' ? nameB : 'neither city'} has the more
          comfortable weather{aqiWinner ? `, and ${aqiWinner === 'a' ? nameA : nameB} has the cleaner air` : ''}.
          On the categories we can measure live, {nameA} leads {winsA}–{winsB}. But the better city depends on
          your priorities — there is no single winner for everyone:
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-sm font-semibold text-white">Choose {nameA} if…</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-300">
              {comfortWinner === 'a' && <li>you want the more comfortable weather today</li>}
              {aqiWinner === 'a' && <li>cleaner air matters most to you right now</li>}
              {biggerWinner === 'a' && <li>you prefer a larger city ({fmtPop(popA)} people)</li>}
              {biggerWinner === 'b' && <li>you prefer a smaller, less sprawling city</li>}
              <li>you want its full live dashboard — weather, prayer times, rates and news in one place</li>
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-sm font-semibold text-white">Choose {nameB} if…</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-300">
              {comfortWinner === 'b' && <li>you want the more comfortable weather today</li>}
              {aqiWinner === 'b' && <li>cleaner air matters most to you right now</li>}
              {biggerWinner === 'b' && <li>you prefer a larger city ({fmtPop(popB)} people)</li>}
              {biggerWinner === 'a' && <li>you prefer a smaller, less sprawling city</li>}
              <li>you want its full live dashboard — weather, prayer times, rates and news in one place</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Live Conditions */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-white">Live Conditions — Right Now</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04] text-left">
                <th className="px-4 py-3 font-semibold text-gray-300">&nbsp;</th>
                <th className="px-4 py-3 text-right font-semibold text-white">{nameA}</th>
                <th className="px-4 py-3 text-right font-semibold text-white">{nameB}</th>
              </tr>
            </thead>
            <tbody>
              <Row label="Local time" va={a.localTime || '—'} vb={b.localTime || '—'} />
              <Row label="Temperature" va={a.temp != null ? `${a.temp}°C` : '—'} vb={b.temp != null ? `${b.temp}°C` : '—'} />
              <Row label="Feels like" va={a.feelsLike != null ? `${a.feelsLike}°C` : '—'} vb={b.feelsLike != null ? `${b.feelsLike}°C` : '—'} />
              <Row label="Conditions" va={a.condition ?? '—'} vb={b.condition ?? '—'} />
              <Row label="Humidity" va={a.humidity != null ? `${a.humidity}%` : '—'} vb={b.humidity != null ? `${b.humidity}%` : '—'}
                better={a.humidity != null && b.humidity != null ? (a.humidity === b.humidity ? null : a.humidity < b.humidity ? 'a' : 'b') : null} />
              <Row label="Wind" va={a.windKmh != null ? `${a.windKmh} km/h` : '—'} vb={b.windKmh != null ? `${b.windKmh} km/h` : '—'} />
              <Row label="Air quality (US AQI)" va={a.aqi != null ? `${a.aqi} · ${a.aqiLevel ?? ''}` : '—'} vb={b.aqi != null ? `${b.aqi} · ${b.aqiLevel ?? ''}` : '—'}
                better={aqiWinner} />
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-500">Live weather and air quality measured at render time (OpenWeather / Open-Meteo air quality).</p>
      </section>

      {/* Prayer Times */}
      {a.prayers && b.prayers && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Prayer Times Today</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04] text-left">
                  <th className="px-4 py-3 font-semibold text-gray-300">Prayer</th>
                  <th className="px-4 py-3 text-right font-semibold text-white">{nameA}</th>
                  <th className="px-4 py-3 text-right font-semibold text-white">{nameB}</th>
                </tr>
              </thead>
              <tbody>
                {a.prayers.map((p) => {
                  const other = b.prayers!.find((x) => x.name === p.name);
                  return (
                    <tr key={p.name} className="border-b border-white/5 last:border-0">
                      <td className="px-4 py-2.5 text-gray-400">{p.name}</td>
                      <td className="px-4 py-2.5 text-right text-gray-200">{p.time}</td>
                      <td className="px-4 py-2.5 text-right text-gray-200">{other?.time ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-gray-500">Calculated for each city&apos;s coordinates (Aladhan). Times differ because the cities sit at different longitudes.</p>
        </section>
      )}

      {/* Population & Basics + Scorecard */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-bold text-white">Population & Basics</h2>
          <div className="mt-3 space-y-2.5 text-sm">
            {[
              [popLabel, fmtPop(popA), fmtPop(popB)],
              ['Province / State', a.city.province, b.city.province],
              ['Country', a.city.country, b.city.country],
              ['Timezone', a.city.timezone, b.city.timezone],
              ['Coordinates', `${a.city.lat.toFixed(2)}, ${a.city.lng.toFixed(2)}`, `${b.city.lat.toFixed(2)}, ${b.city.lng.toFixed(2)}`],
              ['Known for', a.city.famous_for, b.city.famous_for],
            ].map(([label, va, vb]) => (
              <div key={label} className="grid grid-cols-[110px_1fr_1fr] gap-2 border-b border-white/5 pb-2 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-200">{va}</span>
                <span className="text-gray-200">{vb}</span>
              </div>
            ))}
          </div>
          {/* Population share pie — only when both sides carry a PBS
            Census-2023 figure, so the pie and the Population row above
            always show the same two numbers. */}
          {bothCensus && (
            <div className="mt-5">
              <PopulationPie
                title="Population share"
                unit="2023 census totals"
                slices={[
                  { label: nameA, value: popA },
                  { label: nameB, value: popB },
                ]}
                source="PBS Census-2023"
              />
            </div>
          )}
          {a.ref.countrySlug === b.ref.countrySlug && (
            <p className="mt-4 rounded-xl bg-white/[0.04] p-3 text-xs leading-relaxed text-gray-400">
              Both cities are in {a.city.country} and share one national gold market and currency — see live rates for{' '}
              <Link href={`${cityPath(a.ref)}/rates`} className="text-emerald-300 underline">{nameA}</Link> and{' '}
              <Link href={`${cityPath(b.ref)}/rates`} className="text-emerald-300 underline">{nameB}</Link>.
              Country-level economy data (World Bank) is on the{' '}
              <Link href={`${cityPath(a.ref)}/economy`} className="text-emerald-300 underline">economy pages</Link>.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-bold text-white">Scorecard</h2>
          <div className="mt-3 space-y-3">
            {categories.map((c) => (
              <div key={c.label} className="border-b border-white/5 pb-3 last:border-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-200">{c.label}</span>
                  <span className="text-xs font-semibold text-emerald-300">
                    {c.winner === 'a' ? nameA : c.winner === 'b' ? nameB : 'Tie'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{c.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            Scores use only live, measurable data. Categories like cost of living, safety indices and salaries are
            deliberately not scored — there is no reliable free source for them, and this page does not estimate
            what it cannot measure.
          </p>
        </section>
      </div>

      {/* Other comparisons + explore */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-bold text-white">Other Comparisons</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {otherPairs.map(([x, y]) => {
              const rx = findCompareCity(x)!;
              const ry = findCompareCity(y)!;
              return (
                <li key={`${x}-${y}`}>
                  <Link href={`/compare/${x}-vs-${y}`} className="text-emerald-300 underline">
                    {rx.label} vs {ry.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-bold text-white">Explore Both Cities</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {[a, b].map((d) => (
              <div key={d.ref.citySlug} className="space-y-1.5">
                <p className="font-semibold text-white">{d.city.name}</p>
                {['', '/weather', '/prayer-times', '/rates', '/news', '/economy'].map((sub) => (
                  <p key={sub}>
                    <Link href={`${cityPath(d.ref)}${sub}`} className="text-emerald-300 underline">
                      {sub === '' ? 'City guide' : sub.slice(1).replace('-', ' ')}
                    </Link>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
