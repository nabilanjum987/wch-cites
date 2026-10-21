import type { Metadata } from 'next';
import SportsPage from './SportsClient';

// Server wrapper: the interactive sports page lives in SportsClient.tsx
// (a client component). Metadata must be exported from a server
// component, so it lives here — every city gets its own unique title,
// description and self-referencing canonical.

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>;
}

const titleCase = (s: string) =>
  s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const city = titleCase(p.city);
  const province = titleCase(p.province);
  const country = titleCase(p.country);
  const title = `${city} Sports — Teams, Fixtures & Results | WorldCityHub`;
  const description = `${city} sports: local teams, fixtures, results, stadiums and star athletes from ${city}, ${province}, ${country} — updated daily.`;
  const canonical = `https://worldcityhub.vercel.app/${p.country}/${p.province}/${p.city}/sports`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: 'WorldCityHub', type: 'website' },
  };
}

export default function Page() {
  return <SportsPage />;
}
