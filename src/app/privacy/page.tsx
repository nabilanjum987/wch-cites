import type { Metadata } from 'next';
import Link from 'next/link';

// /privacy — created in Q8 (link map §24). States only what is true of
// the site as it actually runs today: no analytics installed, My
// Location is on-device and opt-in, and the suggestion form is a
// human-reviewed drop box. Update this page when any of that changes.

export const metadata: Metadata = {
  title: 'Privacy Policy | WorldCityHub',
  description:
    'WorldCityHub privacy: your location is never stored, no analytics trackers are installed, and improvement-form submissions are stored only for human review.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/privacy' },
  openGraph: {
    title: 'Privacy Policy | WorldCityHub',
    description:
      'Your location is never stored, no analytics trackers are installed, and form submissions are kept only for human review.',
    url: 'https://worldcityhub.vercel.app/privacy',
    siteName: 'WorldCityHub',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wide mb-3">Privacy</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy policy</h1>
        <div className="space-y-5 text-white/70 leading-relaxed">
          <h2 className="text-2xl font-bold text-white pt-2">Your location stays on your device</h2>
          <p>
            The <Link href="/my-location" className="text-cyan-300 hover:underline">My Location</Link> page
            and the optional &ldquo;your city&rdquo; features ask your browser for your location only
            when you choose to share it. The coordinates are used on your device to find
            your nearest city; they are never saved by us and never sent to our servers.
            If you decline, the site works the same, with a default city.
          </p>
          <h2 className="text-2xl font-bold text-white pt-2">No analytics or advertising trackers</h2>
          <p>
            As of today, this site runs no Google Analytics, no advertising trackers and
            no social-media pixels. If that ever changes, this page will be updated first
            and the change will be named here.
          </p>
          <h2 className="text-2xl font-bold text-white pt-2">The improvement form</h2>
          <p>
            If you submit the <Link href="/improve" className="text-cyan-300 hover:underline">improvement form</Link>,
            the text you write — and a name or email only if you choose to include one —
            is stored in our database so a human can review it and verify it against a
            source. Submissions are never published automatically and are never sold or
            shared. Ask via the same form if you want a submission removed.
          </p>
          <h2 className="text-2xl font-bold text-white pt-2">Third-party data sources</h2>
          <p>
            Pages assemble live data from public APIs (weather, prayer times, market
            rates and others listed on the <Link href="/sources" className="text-cyan-300 hover:underline">Sources page</Link>).
            Those requests are made by our servers, not from your browser, so the
            providers see our request — not your identity.
          </p>
          <h2 className="text-2xl font-bold text-white pt-2">Accounts</h2>
          <p>
            WorldCityHub has no user accounts and asks for no passwords, payment details
            or personal documents anywhere on the site.
          </p>
        </div>
      </div>
    </main>
  );
}
