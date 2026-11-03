// HubQuestions (hubs family fix, 3 Nov 2026): the compact AEO
// "Questions" block for hub/index pages, following the places FaqBlock
// precedent in AnswerLayer.tsx: the visible questions and the FAQPage
// JSON-LD are emitted from the SAME array, so the two can never drift
// apart. Hub questions are rendered as H3 headings with a direct answer
// paragraph under each, composed from the host page's own data only.

import { faqPageSchema, type AeoFaq } from './AnswerLayer';

export type { AeoFaq };

export function HubQuestions({
  faqs,
  source,
  emitSchema = true,
}: {
  faqs: AeoFaq[];
  source: string;
  emitSchema?: boolean;
}) {
  if (faqs.length === 0) return null;
  return (
    <section aria-label="Questions" className="mt-12 max-w-3xl">
      {emitSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(faqs)) }}
        />
      )}
      <h2 className="text-2xl font-bold text-white">Questions</h2>
      <div className="mt-4 space-y-6">
        {faqs.map((f) => (
          <div key={f.q}>
            <h3 className="text-lg font-semibold text-white">{f.q}</h3>
            <p className="mt-2 leading-relaxed text-gray-300">{f.a}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-gray-500">{source}</p>
    </section>
  );
}
