import type { Metadata } from 'next';
import Link from 'next/link';

// /about — created in Q8 (link map §24: the footer must not point at a
// missing page). Real, minimal, factual: what the site is, how it is
// built, and the honesty rules every page follows.

export const metadata: Metadata = {
  title: 'About WorldCityHub | WorldCityHub',
  description:
    'What WorldCityHub is: live city and country guides — weather, prayer times, rates, news, events and economy — built only from real public data.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/about' },
  openGraph: {
    title: 'About WorldCityHub | WorldCityHub',
    description:
      'Live city and country guides built only from real public data — no invented figures, ever.',
    url: 'https://worldcityhub.vercel.app/about',
    siteName: 'WorldCityHub',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wide mb-3">About</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">What WorldCityHub is</h1>
        <div className="space-y-5 text-white/70 leading-relaxed">
          <p>
            WorldCityHub is a guide to the world&apos;s cities and countries: the local time and
            weather right now, prayer times, gold and currency rates, news, events, and the
            economic figures that shape daily life — gathered in one place per city, and
            refreshed from live public data sources.
          </p>
          <h2 className="text-2xl font-bold text-white pt-4">How a city page is built</h2>
          <p>
            Every published city gets the same set of pages — a main guide plus weather,
            prayer times, rates, news, events, economy and sports — filled from the same
            live sources for every city, so two cities can always be compared fairly.
            Countries get the same treatment: one canonical dataset per country feeds
            every page that shows its figures.
          </p>
          <h2 className="text-2xl font-bold text-white pt-4">Our honesty rules</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Every figure comes from a real, named source — see the <Link href="/sources" className="text-cyan-300 hover:underline">Sources page</Link>. If a source does not answer, the figure is hidden, never invented.</li>
            <li>Anything estimated is labelled an estimate, with the method stated.</li>
            <li>A page joins the sitemap only when it renders fully with real data. Pages still being built are not dressed up as finished coverage.</li>
            <li>News is aggregated — headline, source and link — never rewritten as our own reporting.</li>
          </ul>
          <h2 className="text-2xl font-bold text-white pt-4">Where we are</h2>
          <p>
            Coverage is growing city by city, starting with Pakistan — Lahore, Karachi and
            Islamabad are fully live today — and expanding to capitals worldwide. You can
            browse the <Link href="/countries" className="text-cyan-300 hover:underline">countries hub</Link>,
            including the full World Capitals table, or suggest a correction or a missing
            place via the <Link href="/contact" className="text-cyan-300 hover:underline">contact page</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
