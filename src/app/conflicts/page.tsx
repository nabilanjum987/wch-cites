import type { Metadata } from 'next';
import Link from 'next/link';
import {
  fetchUnhcrTotals, fetchWhitelistNews, sourceName, MAJOR_CONFLICTS, HUMANITARIAN_ORGS,
} from '@/lib/conflicts';
import type { NewsArticle } from '@/lib/apis/news';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Conflicts & Peace — Factual World Overview | WorldCityHub',
  description: 'A factual, educational overview of major conflicts and peace efforts. UNHCR displacement data and whitelisted wire sources only. No sides, no propaganda.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/conflicts' },
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${n}`;
}

function timeAgo(iso: string | Date): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function HeadlineList({ items }: { items: NewsArticle[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">No whitelisted wire update in the latest cycle.</p>;
  }
  return (
    <ul className="space-y-2.5">
      {items.map((a) => (
        <li key={a.url} className="text-sm">
          <a href={a.url} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-100 underline decoration-white/30 underline-offset-2 hover:decoration-white">
            {a.title}
          </a>
          <span className="mt-0.5 block text-xs text-gray-500">
            {sourceName(a) || 'Wire source'} · {timeAgo(a.publishedAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function ConflictsPage() {
  const totals = await fetchUnhcrTotals();
  // Sequential on purpose: the GNews free plan rejects rapid parallel
  // calls (learned during the Batch 2i news consolidation). This page
  // regenerates at most hourly (ISR), so the extra seconds are fine.
  const peaceCeasefire = await fetchWhitelistNews('ceasefire agreement talks', 4);
  const peaceTalks = await fetchWhitelistNews('peace negotiations deal', 4);
  const conflictNews = [];
  for (const c of MAJOR_CONFLICTS) {
    conflictNews.push(await fetchWhitelistNews(c.query, 1));
  }
  const peaceSeen = new Set<string>();
  const peace = [...peaceCeasefire, ...peaceTalks].filter((a) => {
    if (peaceSeen.has(a.title)) return false;
    peaceSeen.add(a.title);
    return true;
  }).slice(0, 6);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      {/* Mandatory notice (locked spec) */}
      <div className="rounded-2xl border border-amber-300/30 bg-amber-400/10 p-4 sm:p-5">
        <p className="text-sm font-semibold text-amber-200">⚠️ Important Notice</p>
        <p className="mt-1 text-sm leading-relaxed text-amber-100/80">
          This page is educational and factual only. WorldCityHub takes no political positions and endorses no
          party to any conflict. Data comes from the United Nations, UNHCR, the ICRC and internationally
          recognised humanitarian organisations; news is restricted to a whitelist of wire and public-service
          sources (Reuters, AP, BBC, Al Jazeera, UN News). No graphic content is shown.
        </p>
      </div>

      <h1 className="mt-8 text-3xl font-bold text-white">Conflicts & Peace — World Overview</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
        A responsible overview of the world&apos;s major conflicts and — always — the efforts to end them.
        Figures are UNHCR&apos;s; headlines are whitelisted wire reports, reproduced with attribution.
      </p>

      {/* World status — UNHCR totals */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-white">World Displacement Status{totals ? ` — UNHCR, end of ${totals.year}` : ''}</h2>
        {totals ? (
          <>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
              {[
                ['Refugees', totals.refugees],
                ['Asylum seekers', totals.asylumSeekers],
                ['Internally displaced (IDPs)', totals.idps],
                ['Returned refugees', totals.returnedRefugees],
                ['Stateless people', totals.stateless],
              ].map(([label, v]) => (
                <div key={label as string} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-2xl font-bold text-white">{fmt(v as number)}</div>
                  <div className="mt-1 text-xs text-gray-400">{label as string}</div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Source: <a href="https://www.unhcr.org/refugee-statistics/" target="_blank" rel="noopener noreferrer" className="underline">UNHCR Refugee Population Statistics</a> — the UN refugee agency&apos;s official counts.
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-gray-400">UNHCR figures are unavailable right now — nothing is estimated in their place.</p>
        )}
      </section>

      {/* Major active conflicts */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-white">Major Active Conflicts</h2>
        <p className="mt-1 text-sm text-gray-400">Factual status cards. Each links to ReliefWeb (UN OCHA) for the full humanitarian situation.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MAJOR_CONFLICTS.map((c, i) => (
            <article key={c.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-white">{c.name}</h3>
                <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-medium text-red-300">Active</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">{c.region} · Since {c.since}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-300">{c.summary}</p>
              <div className="mt-4 border-t border-white/5 pt-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Latest whitelisted update</p>
                <HeadlineList items={conflictNews[i] ?? []} />
              </div>
              <a href={c.reliefweb} target="_blank" rel="noopener noreferrer" className="mt-4 text-sm font-medium text-emerald-300 underline">
                Full situation on ReliefWeb (UN OCHA) →
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Peace Efforts — compulsory section (locked spec) */}
      <section className="mt-10 rounded-2xl border border-emerald-300/25 bg-emerald-400/[0.06] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-white">🕊️ Peace Efforts</h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-300">
          This section is compulsory on this page: for every conflict, the efforts to end it matter as much as
          the fighting. Latest ceasefire and negotiation reporting from whitelisted sources:
        </p>
        <div className="mt-4">
          <HeadlineList items={peace} />
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Standing resource: <a href="https://peacemaker.un.org" target="_blank" rel="noopener noreferrer" className="underline">UN Peacemaker</a> — the UN&apos;s mediation and peace-agreement archive.
        </p>
      </section>

      {/* Humanitarian resources — charity rule: NO commission */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-white">Humanitarian Resources</h2>
        <p className="mt-1 text-sm text-gray-400">
          Verified organisations working in these crises. <strong className="text-gray-200">WorldCityHub earns no
          commission from these links</strong> — they are purely humanitarian.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HUMANITARIAN_ORGS.map((o) => (
            <a key={o.name} href={o.url} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]">
              <p className="text-sm font-semibold text-white">{o.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">{o.note}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Standards */}
      <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-base font-bold text-white">Our Standards for This Page</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-400">
          <li>Statistics from UN agencies only; humanitarian data from ICRC and UN OCHA (ReliefWeb).</li>
          <li>News whitelist: Reuters, AP, BBC, Al Jazeera, UN News, UNHCR, ICRC. Partisan outlets and claims from the parties themselves are never used.</li>
          <li>Neutral language throughout; no side is endorsed, no conflict is glorified, no graphic imagery.</li>
          <li>If a figure or update cannot be sourced to the whitelist, it is not shown.</li>
        </ul>
        <p className="mt-4 text-sm text-gray-400">
          Background reporting: <Link href="/news" className="text-emerald-300 underline">World news</Link> ·{' '}
          <Link href="/countries" className="text-emerald-300 underline">Country guides</Link>
        </p>
      </section>
    </main>
  );
}
