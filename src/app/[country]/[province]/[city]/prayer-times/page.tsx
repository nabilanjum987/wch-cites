import type { Metadata } from 'next';
import PrayerTimesPage from './PrayerTimesClient';

// Server wrapper: the interactive Spiritual & Wellness Hub lives in
// PrayerTimesClient.tsx (a client component). Metadata must be exported
// from a server component, so it lives here — every city gets its own
// unique title, description and self-referencing canonical.

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>;
}

const titleCase = (s: string) =>
  s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const city = titleCase(p.city);
  const title = `${city} Prayer Times & Faiths Guide | WorldCityHub`;
  const description = `${city} prayer times today for all faiths: Islamic prayer times with live countdown, church, temple, gurdwara & synagogue times, multi-faith calendar.`;
  const canonical = `https://worldcityhub.vercel.app/${p.country}/${p.province}/${p.city}/prayer-times`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: 'WorldCityHub', type: 'website' },
  };
}

export default function Page() {
  return <PrayerTimesPage />;
}
