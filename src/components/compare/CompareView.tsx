import Link from 'next/link';
import { aqiScore, cityPath, COMPARE_PRAYER_METHOD_LABEL, POPULAR_PAIRS, findCompareCity, type CityCompareData } from '@/lib/compare';
import { censusPopulationOr, hasCensusPopulation } from '@/lib/census2023';
import PopulationPie from '@/components/PopulationPie';
import JsonLd from '@/components/seo/JsonLd';
import { FaqBlock, type AeoFaq } from '@/components/aeo/AnswerLayer';

// Server-rendered side-by-side comparison (Page 15 of the locked plan,
// honest-data subset). Winners are named per category, but the verdict
// is always two-sided and priority-based: the plan forbids an absolute
// "best city" claim. Categories without a reliable free data source
// (cost of living, safety indices, salaries) are omitted, not estimated.
//
// Scorecard rule (S4): only measured-quality categories are tallied
// (weather comfort and air quality). City size is information, printed
// in the basics table and in the "bigger" answer below; it is never
// counted as a win, and no row outside the scorecard bolds a "winner".

const NA = 'n/a';
const PLACEHOLDER_TAGLINE = 'A city waiting to be discovered';

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
  // (F3's single store), otherwise the incoming figure unchanged, so
  // the Population row, the verdict and the pie below can never
  // disagree. The pie renders only when BOTH sides have a census figure.
  // F3: the "2023 census" label applies only when BOTH sides carry a
  // PBS Census-2023 figure; other pairs keep the plain label, so a
  // non-census city is never presented as census-counted.
  const popKey = (d: CityCompareData) => `${d.ref.countrySlug}/${d.ref.provinceSlug}/${d.ref.citySlug}`;
  const popA = censusPopulationOr(popKey(a), a.city.population);
  const popB = censusPopulationOr(popKey(b), b.city.population);
  const bothCensus = hasCensusPopulation(popKey(a)) && hasCensusPopulation(popKey(b));
  const popLabel = bothCensus ? 'Population (2023 census)' : 'Population';
  const biggerWinner = popA === popB ? null : popA > popB ? 'a' : 'b';

  // The scorecard tallies measured-quality categories only (S4).
  const categories: { label: string; winner: 'a' | 'b' | null; detail: string }[] = [
    { label: 'Weather comfort right now', winner: comfortWinner as 'a' | 'b' | null, detail: `Comfort score ${a.comfort ?? NA} vs ${b.comfort ?? NA} (WCH-computed from live feels-like, humidity and wind)` },
    { label: 'Air quality right now', winner: aqiWinner as 'a' | 'b' | null, detail: `US AQI ${a.aqi ?? NA} (${a.aqiLevel ?? 'unknown'}) vs ${b.aqi ?? NA} (${b.aqiLevel ?? 'unknown'})` },
  ];
  const winsA = categories.filter((c) => c.winner === 'a').length;
  const winsB = categories.filter((c) => c.winner === 'b').length;
  // Verdict sentence (B5): name the ACTUAL leader, whichever side it is,
  // and say "level" on a tie. Never hard-code side A.
  const verdictLine = winsA > winsB
    ? `${nameA} leads ${winsA}–${winsB}`
    : winsB > winsA
      ? `${nameB} leads ${winsB}–${winsA}`
      : `the two are level at ${winsA}–${winsB}`;

  // "Known for" (S3): hide the row whenever either side's tagline is the
  // placeholder (or empty); real taglines still show.
  const knownFor = (d: CityCompareData) => (d.city.famous_for ?? '').trim();
  // Display form: the city packages' own taglines carry em dashes; the
  // compare pages render none (B2 sweep), so they are normalised here
  // at render time. The placeholder/empty test above uses the raw value.
  const knownForDisplay = (d: CityCompareData) => knownFor(d).replace(/ — /g, ': ').replace(/—/g, '-');
  const showKnownFor = knownFor(a) !== '' && knownFor(b) !== ''
    && knownFor(a) !== PLACEHOLDER_TAGLINE && knownFor(b) !== PLACEHOLDER_TAGLINE;

  const basicsRows: [string, string, string][] = [
    [popLabel, fmtPop(popA), fmtPop(popB)],
    ['Province / State', a.city.province, b.city.province],
    ['Country', a.city.country, b.city.country],
    ['Timezone', a.city.timezone, b.city.timezone],
    ['Coordinates', `${a.city.lat.toFixed(2)}, ${a.city.lng.toFixed(2)}`, `${b.city.lat.toFixed(2)}, ${b.city.lng.toFixed(2)}`],
    ...(showKnownFor ? [['Known for', knownForDisplay(a), knownForDisplay(b)] as [string, string, string]] : []),
  ];

  // AEO questions (B3): headings with direct answers composed from this
  // page's own data. The SAME array feeds the visible FaqBlock and the
  // FAQPage node in the JSON-LD graph below, so they cannot drift.
  const faqs: AeoFaq[] = [];
  {
    const bigName = biggerWinner === 'b' ? nameB : nameA;
    const bigPop = biggerWinner === 'b' ? popB : popA;
    const smallName = biggerWinner === 'b' ? nameA : nameB;
    const smallPop = biggerWinner === 'b' ? popA : popB;
    faqs.push({
      q: `Which is bigger, ${nameA} or ${nameB}?`,
      a: biggerWinner == null
        ? `${nameA} and ${nameB} match on population at ${popA.toLocaleString('en-US')} people each${bothCensus ? ' (PBS Census 2023)' : ''}.`
        : `${bigName} is bigger by population: ${bigPop.toLocaleString('en-US')} people${bothCensus ? ' in the PBS Census 2023' : ''}, against ${smallPop.toLocaleString('en-US')} in ${smallName}. City size is shown as information only; it is not counted in the scorecard.`,
    });
  }
  if (a.aqi != null && b.aqi != null) {
    const cleanName = aqiWinner === 'b' ? nameB : aqiWinner === 'a' ? nameA : null;
    faqs.push({
      q: `Which has cleaner air today, ${nameA} or ${nameB}?`,
      a: cleanName == null
        ? `Neither: both cities read US AQI ${a.aqi} (${a.aqiLevel ?? 'level unavailable'}) right now. ${nameA} reads ${a.aqi} and ${nameB} reads ${b.aqi}.`
        : `${cleanName} has cleaner air right now: US AQI ${aqiWinner === 'a' ? a.aqi : b.aqi} (${(aqiWinner === 'a' ? a.aqiLevel : b.aqiLevel) ?? 'level unavailable'}) in ${cleanName}, against US AQI ${aqiWinner === 'a' ? b.aqi : a.aqi} (${(aqiWinner === 'a' ? b.aqiLevel : a.aqiLevel) ?? 'level unavailable'}) in ${aqiWinner === 'a' ? nameB : nameA}. Air quality is live and changes through the day; this page updates hourly.`,
    });
  }
  if (a.comfort != null && b.comfort != null) {
    const comfyName = comfortWinner === 'b' ? nameB : comfortWinner === 'a' ? nameA : null;
    faqs.push({
      q: `Which is more comfortable right now, ${nameA} or ${nameB}?`,
      a: comfyName == null
        ? `Level: both cities score ${a.comfort} out of 100 on the WCH comfort score right now (${nameA} feels like ${a.feelsLike}°C, ${nameB} feels like ${b.feelsLike}°C).`
        : `${comfyName} is more comfortable right now, scoring ${comfortWinner === 'a' ? a.comfort : b.comfort} out of 100 on the WCH comfort score, against ${comfortWinner === 'a' ? b.comfort : a.comfort} in ${comfortWinner === 'a' ? nameB : nameA}. The score is computed from live feels-like temperature, humidity and wind; the formula is published in the method note on this page.`,
    });
  }
  if (a.temp != null && b.temp != null) {
    faqs.push({
      q: `What is the weather in ${nameA} and ${nameB} right now?`,
      a: `${nameA} is ${a.temp}°C${a.condition ? ` with ${a.condition.toLowerCase()}` : ''} (feels like ${a.feelsLike}°C) and ${nameB} is ${b.temp}°C${b.condition ? ` with ${b.condition.toLowerCase()}` : ''} (feels like ${b.feelsLike}°C), from the live weather feed; this page updates hourly.`,
    });
  }

  const pairSlug = `${a.ref.citySlug}-vs-${b.ref.citySlug}`;
  const pairUrl = `https://worldcityhub.vercel.app/compare/${pairSlug}`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'WorldCityHub', item: 'https://worldcityhub.vercel.app/' },
          { '@type': 'ListItem', position: 2, name: 'Compare Cities', item: 'https://worldcityhub.vercel.app/compare' },
          { '@type': 'ListItem', position: 3, name: `${nameA} vs ${nameB}`, item: pairUrl },
        ],
      },
      {
        '@type': 'WebPage',
        name: `${nameA} vs ${nameB} | WorldCityHub`,
        url: pairUrl,
        description: `${nameA} vs ${nameB} compared with live data: current weather, air quality, today's prayer times, population and a measured scorecard.`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  const otherPairs = POPULAR_PAIRS.filter(
    ([x, y]) => !(x === a.ref.citySlug && y === b.ref.citySlug) && !(x === b.ref.citySlug && y === a.ref.citySlug),
  );

  return (
    <div className="space-y-8">
      <JsonLd data={graph} />
      {/* Quick Verdict */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-white">Quick Verdict</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">
          Right now, {comfortWinner === 'a' ? nameA : comfortWinner === 'b' ? nameB : 'neither city'} has the more
          comfortable weather{aqiWinner ? `, and ${aqiWinner === 'a' ? nameA : nameB} has the cleaner air` : ''}.
          On the categories we can measure live, {verdictLine}. But the better city depends on
          your priorities: there is no single winner for everyone:
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-sm font-semibold text-white">Choose {nameA} if…</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-300">
              {comfortWinner === 'a' && <li>you want the more comfortable weather today</li>}
              {aqiWinner === 'a' && <li>cleaner air matters most to you right now</li>}
              {biggerWinner === 'a' && <li>you prefer a larger city ({fmtPop(popA)} people)</li>}
              {biggerWinner === 'b' && <li>you prefer a smaller, less sprawling city</li>}
              <li>you want its full live dashboard: weather, prayer times, rates and news in one place</li>
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-sm font-semibold text-white">Choose {nameB} if…</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-300">
              {comfortWinner === 'b' && <li>you want the more comfortable weather today</li>}
              {aqiWinner === 'b' && <li>cleaner air matters most to you right now</li>}
              {biggerWinner === 'b' && <li>you prefer a larger city ({fmtPop(popB)} people)</li>}
              {biggerWinner === 'a' && <li>you prefer a smaller, less sprawling city</li>}
              <li>you want its full live dashboard: weather, prayer times, rates and news in one place</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Live Conditions */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-white">Live Conditions, Updated Hourly</h2>
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
              <Row label="Local time" va={a.localTime || NA} vb={b.localTime || NA} />
              <Row label="Temperature" va={a.temp != null ? `${a.temp}°C` : NA} vb={b.temp != null ? `${b.temp}°C` : NA} />
              <Row label="Feels like" va={a.feelsLike != null ? `${a.feelsLike}°C` : NA} vb={b.feelsLike != null ? `${b.feelsLike}°C` : NA} />
              {(a.condition != null || b.condition != null) && (
                <Row label="Conditions" va={a.condition ?? NA} vb={b.condition ?? NA} />
              )}
              <Row label="Humidity" va={a.humidity != null ? `${a.humidity}%` : NA} vb={b.humidity != null ? `${b.humidity}%` : NA} />
              <Row label="Wind" va={a.windKmh != null ? `${a.windKmh} km/h` : NA} vb={b.windKmh != null ? `${b.windKmh} km/h` : NA} />
              <Row label="Air quality (US AQI)" va={a.aqi != null ? `${a.aqi} · ${a.aqiLevel ?? ''}` : NA} vb={b.aqi != null ? `${b.aqi} · ${b.aqiLevel ?? ''}` : NA}
                better={aqiWinner} />
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-500">Live weather and air quality from OpenWeather and Open-Meteo air quality; this page updates hourly.</p>
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
                      <td className="px-4 py-2.5 text-right text-gray-200">{other?.time ?? NA}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-gray-500">Calculated for each city&apos;s coordinates with {COMPARE_PRAYER_METHOD_LABEL}. Times differ because the cities sit at different longitudes.</p>
        </section>
      )}

      {/* Population & Basics + Scorecard */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-bold text-white">Population & Basics</h2>
          <div className="mt-3 space-y-2.5 text-sm">
            {basicsRows.map(([label, va, vb]) => (
              <div key={label} className="grid grid-cols-[110px_1fr_1fr] gap-2 border-b border-white/5 pb-2 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-200">{va}</span>
                <span className="text-gray-200">{vb}</span>
              </div>
            ))}
          </div>
          {/* Population share pie: only when both sides carry a PBS
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
                source="PBS Census 2023"
              />
            </div>
          )}
          {a.ref.countrySlug === b.ref.countrySlug && (
            <p className="mt-4 rounded-xl bg-white/[0.04] p-3 text-xs leading-relaxed text-gray-400">
              Both cities are in {a.city.country} and share one national gold market and currency: see live rates for{' '}
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
            Scores use only live, measurable data. City size is not scored: it is printed as information in
            Population & Basics. Categories like cost of living, safety indices and salaries are deliberately
            not scored: there is no reliable free source for them, and this page does not estimate what it
            cannot measure.
          </p>
          {/* Method (S7 + M2): the exact formulas behind the scores. */}
          <p className="mt-3 text-xs leading-relaxed text-gray-500">
            How the scores are calculated: Comfort score = 100 - |feels-like - 22°C| x 3, minus a humidity
            penalty of 0.4 per point above 60% and a wind penalty of 0.5 per km/h above 25 km/h, clamped
            between 5 and 100. AQI score = 100 - (US AQI / 3), clamped between 0 and 100. Prayer times use{' '}
            {COMPARE_PRAYER_METHOD_LABEL}.
          </p>
        </section>
      </div>

      {/* AEO: question headings with direct answers (same array as schema) */}
      <FaqBlock
        faqs={faqs}
        source="Answers composed from this page's own figures: PBS Census 2023 populations where both cities carry one, and the live weather and air-quality feeds above (this page updates hourly)."
        title={`${nameA} vs ${nameB}: questions and answers`}
      />

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
