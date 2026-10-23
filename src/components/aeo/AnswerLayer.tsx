// ─── AEO/GEO answer layer (Batch 4, Item 2) ─────────────────────────────────
// Shared building blocks for the answer layer added to the golden templates
// (city, wonders, places, rates, personalities):
//
//   • <DirectAnswer> — a 50–70 word block placed directly under the page's
//     main heading. Its FIRST sentence is the complete direct answer to the
//     template's primary mined question; the rest is composed from the page's
//     own data (live figures are rendered from the same source the page
//     itself uses — nothing is hard-coded here).
//   • <FaqBlock> — 4–6 mined questions answered in 50–70 words each from
//     real page data, rendered visibly. Where the template does not already
//     emit FAQPage JSON-LD, the SAME array is emitted as schema
//     (emitSchema) so visible text and schema can never drift apart.
//   • Citability — every block carries a small-print source line naming the
//     figure sources + dates, per the item spec.
//
// Questions were mined from real search results (People-Also-Ask style
// phrasing, competitor FAQ sections, guide headings) — see
// evidence/batch4-item2/question-bank.md. No question phrasing is invented.

export interface AeoFaq {
  q: string;
  a: string;
}

export function faqPageSchema(faqs: AeoFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function DirectAnswer({
  answer,
  source,
  eyebrow = 'The short answer',
}: {
  answer: string;
  source: string;
  eyebrow?: string;
}) {
  return (
    <section
      aria-label="Direct answer"
      className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
    >
      <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
        {eyebrow}
      </p>
      <p className="mt-2 text-base leading-relaxed text-gray-100">{answer}</p>
      <p className="mt-3 text-[11px] leading-relaxed text-gray-500">{source}</p>
    </section>
  );
}

export function FaqBlock({
  faqs,
  source,
  emitSchema = false,
  title = 'Frequently asked questions',
}: {
  faqs: AeoFaq[];
  source: string;
  emitSchema?: boolean;
  title?: string;
}) {
  if (faqs.length === 0) return null;
  return (
    <section aria-label={title}>
      {emitSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(faqs)) }}
        />
      )}
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="mt-4 space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <summary className="cursor-pointer font-semibold text-white">
              {f.q}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">{f.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-gray-500">{source}</p>
    </section>
  );
}
