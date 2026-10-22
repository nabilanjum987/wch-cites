import type { Metadata } from 'next';
import { Suspense } from 'react';
import ImproveForm from '@/components/improve/ImproveForm';

export const metadata: Metadata = {
  title: 'Improve a City or Country Page | WorldCityHub',
  description: 'Know a city or country better than we do? Suggest a correction or missing information for any WorldCityHub page. Every suggestion is human-reviewed.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/improve' },
};

export default function ImprovePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <h1 className="text-3xl font-bold text-white">Improve WorldCityHub</h1>
      <p className="mt-2 text-sm leading-relaxed text-gray-400">
        One form for every city and every country on this site. Local knowledge beats any database —
        if a page about your city or country is wrong or missing something, tell us here.
      </p>
      <ol className="mt-5 grid gap-3 text-sm text-gray-300 sm:grid-cols-3">
        <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <strong className="text-white">1. You suggest</strong>
          <p className="mt-1 text-gray-400">A correction, a missing place, a fact we got wrong.</p>
        </li>
        <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <strong className="text-white">2. A human reviews</strong>
          <p className="mt-1 text-gray-400">Nothing is published automatically — ever.</p>
        </li>
        <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <strong className="text-white">3. We verify, then update</strong>
          <p className="mt-1 text-gray-400">Changes go live only when a reliable source confirms them.</p>
        </li>
      </ol>
      <div className="mt-6">
        <Suspense fallback={<p className="text-sm text-gray-400">Loading the form…</p>}>
          <ImproveForm />
        </Suspense>
      </div>
    </main>
  );
}
