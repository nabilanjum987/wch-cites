import type { Metadata } from 'next';
import Link from 'next/link';

// /contact — created in Q8 (link map §24). Routes everything to the
// site's one improvement form; publishes no invented email, phone or
// postal address (none exists to publish).

export const metadata: Metadata = {
  title: 'Contact WorldCityHub | WorldCityHub',
  description:
    'Contact WorldCityHub: report a wrong figure, suggest missing information or a new place through the improvement form — every suggestion is reviewed by a human.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/contact' },
  openGraph: {
    title: 'Contact WorldCityHub | WorldCityHub',
    description:
      'Report a wrong figure or suggest missing information through the WorldCityHub improvement form.',
    url: 'https://worldcityhub.vercel.app/contact',
    siteName: 'WorldCityHub',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wide mb-3">Contact</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Talk to WorldCityHub</h1>
        <div className="space-y-5 text-white/70 leading-relaxed">
          <p>
            The fastest way to reach us — for a wrong figure, out-of-date information, a
            missing place, or a broken page — is the improvement form. It covers every
            city and country on the site:
          </p>
          <p>
            <Link
              href="/improve"
              className="inline-block rounded-full bg-cyan-500 px-6 py-3 font-semibold text-black transition-colors hover:bg-cyan-400"
            >
              Open the improvement form →
            </Link>
          </p>
          <p>
            Tell us which page you mean and what should change. Every suggestion is read
            by a human and checked against a source before anything on the site changes —
            nothing is published automatically.
          </p>
          <p>
            We do not publish a contact email address, phone number or postal address at
            this time; the form above is the channel that reaches the team.
          </p>
        </div>
      </div>
    </main>
  );
}
