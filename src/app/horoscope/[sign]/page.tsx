import type { Metadata } from 'next';
import HoroscopeSignPage from './SignClient';

// Server wrapper: the interactive sign page lives in SignClient.tsx.
// Metadata must be exported from a server component, so it lives here —
// every zodiac sign gets its own unique title, description and canonical.

interface PageProps {
  params: Promise<{ sign: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const sign = p.sign.charAt(0).toUpperCase() + p.sign.slice(1);
  const title = `${sign} Horoscope — Daily & Weekly | WorldCityHub`;
  const description = `${sign} horoscope today: daily, weekly and monthly readings, love compatibility, lucky numbers and birth-chart tools — free on WorldCityHub.`;
  const canonical = `https://worldcityhub.vercel.app/horoscope/${p.sign}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: 'WorldCityHub', type: 'website' },
  };
}

export default function Page() {
  return <HoroscopeSignPage />;
}
