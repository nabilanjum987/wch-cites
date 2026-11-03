// Entity comparison view (Round 2, R5): the province/country sibling of
// CompareView: same figure set both sides, one-line verdict, sources named.
// Server-rendered; all data arrives via props from src/lib/compare.ts.
// Each side links to its own province/country page, the view links back
// to /compare, and the question headings under the table carry direct
// answers composed from the rows. The SAME Q&A array feeds the visible
// FaqBlock and the FAQPage node in the JSON-LD graph, alongside
// BreadcrumbList and WebPage, so schema and visible text cannot drift.
import Link from 'next/link';
import type { EntityCompareData } from '@/lib/compare';
import JsonLd from '@/components/seo/JsonLd';
import { FaqBlock } from '@/components/aeo/AnswerLayer';

export default function EntityCompareView({ data }: { data: EntityCompareData }) {
  const url = `https://worldcityhub.vercel.app/compare/${data.slug}`;
  const title = `${data.a.name} vs ${data.b.name} | WorldCityHub`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'WorldCityHub', item: 'https://worldcityhub.vercel.app/' },
          { '@type': 'ListItem', position: 2, name: 'Compare Cities', item: 'https://worldcityhub.vercel.app/compare' },
          { '@type': 'ListItem', position: 3, name: `${data.a.name} vs ${data.b.name}`, item: url },
        ],
      },
      { '@type': 'WebPage', name: title, url, description: data.sourceNote },
      {
        '@type': 'FAQPage',
        mainEntity: data.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
  return (
    <div className="space-y-8">
      <JsonLd data={graph} />
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              <Link href={data.aHref} className="underline decoration-white/30 underline-offset-4 hover:decoration-white">{data.a.name}</Link>
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">{data.a.sub}</p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gray-300">vs</span>
          <div className="text-right">
            <h2 className="text-xl font-bold text-white">
              <Link href={data.bHref} className="underline decoration-white/30 underline-offset-4 hover:decoration-white">{data.b.name}</Link>
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">{data.b.sub}</p>
          </div>
        </div>
        <dl>
          {data.rows.map((r) => (
            <div key={r.label} className="border-b border-white/5 py-3 last:border-0">
              <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-3">
                <dd className="text-base font-semibold text-white">{r.a}</dd>
                <dt className="text-center text-xs uppercase tracking-wide text-gray-400">{r.label}</dt>
                <dd className="text-right text-base font-semibold text-white">{r.b}</dd>
              </div>
              {r.note && <p className="mt-1 text-center text-[11px] text-gray-500">{r.note}</p>}
            </div>
          ))}
        </dl>
        {data.verdict && (
          <p className="mt-4 rounded-xl bg-emerald-400/10 px-4 py-3 text-sm leading-relaxed text-emerald-100">
            <span className="font-semibold">Verdict: </span>
            {data.verdict}
          </p>
        )}
        <p className="mt-3 text-[11px] leading-relaxed text-gray-500">{data.sourceNote}</p>
        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href={data.aHref} className="text-emerald-300 underline">{data.a.name} page</Link>
          <Link href={data.bHref} className="text-emerald-300 underline">{data.b.name} page</Link>
          <Link href="/compare" className="text-emerald-300 underline">All comparisons</Link>
        </nav>
      </section>
      {data.faqs.length > 0 && (
        <FaqBlock
          faqs={data.faqs}
          source={data.sourceNote}
          title={`${data.a.name} vs ${data.b.name}: questions and answers`}
        />
      )}
    </div>
  );
}
