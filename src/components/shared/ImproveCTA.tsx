import Link from 'next/link';

// "Help improve this page" band. One form for the whole site (/improve);
// the band only carries context (which country/city) as prefill params.
export default function ImproveCTA({
  country,
  city,
  label,
}: {
  country?: string;
  city?: string;
  label: string;
}) {
  const qs = new URLSearchParams();
  if (country) qs.set('country', country);
  if (city) qs.set('city', city);
  const href = `/improve${qs.toString() ? `?${qs.toString()}` : ''}`;
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10">
      <div className="rounded-2xl border t-border t-card p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <h2 className="text-base font-bold t-text">Know {label} better than we do?</h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed t-g400">
            Suggest a correction or missing information. Nothing is published automatically — every
            suggestion is reviewed by a human and checked against a reliable source first.
          </p>
        </div>
        <Link
          href={href}
          className="mt-4 inline-block shrink-0 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold t-onbrand transition hover:bg-emerald-400 sm:mt-0"
        >
          Improve this page
        </Link>
      </div>
    </section>
  );
}
