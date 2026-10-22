import type { Metadata } from 'next';
import CountryPage from './CountryClient';
import CountryInventory from '@/components/shared/CountryInventory';
import ImproveCTA from '@/components/shared/ImproveCTA';

// Server wrapper: the interactive country page lives in CountryClient.tsx.
// Metadata must be exported from a server component, so it lives here —
// every country gets its own unique title, description and canonical.

interface PageProps {
  params: Promise<{ country: string }>;
}

const titleCase = (s: string) =>
  s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const country = titleCase(p.country);
  const title = `${country} — Cities, Weather & Prayer | WorldCityHub`;
  const description = `${country}: provinces and cities with live weather, prayer times, gold & currency rates, news, economy and culture — the ${country} guide.`;
  const canonical = `https://worldcityhub.vercel.app/${p.country}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: 'WorldCityHub', type: 'website' },
  };
}

export default async function Page({ params }: PageProps) {
  const p = await params;
  return (
    <>
      <CountryPage />
      <CountryInventory countrySlug={p.country} />
      <ImproveCTA country={p.country} label={titleCase(p.country)} />
    </>
  );
}
