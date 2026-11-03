import type { Metadata } from 'next';
import HoroscopeIndexClient from '@/components/horoscope/HoroscopeIndexClient';
import JsonLd from '@/components/seo/JsonLd';
import { HUB_FAQS } from '@/lib/horoscope/hub-faqs';

const BASE = 'https://worldcityhub.vercel.app';
const TITLE = 'Horoscope Today | All 12 Signs Daily | WorldCityHub';
const DESCRIPTION =
  'Horoscope today for all 12 zodiac signs: daily readings composed from computed planetary positions, moon phases, tarot and numerology.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE}/horoscope` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${BASE}/horoscope`, siteName: 'WorldCityHub', type: 'website' },
};

export default function HoroscopePage() {
  // WebPage + BreadcrumbList + FAQPage in one @graph. The FAQPage node is
  // built from HUB_FAQS, the same array HoroscopeIndexClient renders
  // visibly, so schema and page text cannot drift apart. Exactly one
  // FAQPage on this page.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: TITLE,
        url: `${BASE}/horoscope`,
        description: DESCRIPTION,
        isPartOf: { '@type': 'WebSite', name: 'WorldCityHub', url: BASE },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Horoscope', item: `${BASE}/horoscope` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: HUB_FAQS.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <HoroscopeIndexClient />
    </>
  );
}
