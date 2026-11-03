import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HoroscopeSignPage from './SignClient';
import JsonLd from '@/components/seo/JsonLd';
import { signSeoBlock } from '@/components/horoscope/SignSeoSection';
import { ZODIAC_SIGNS } from '@/types/horoscope';

// Server wrapper: the interactive sign page lives in SignClient.tsx.
// Metadata and JSON-LD live here, in the server component.
//
// Targeting (owner's locked keyword model, 3 Nov 2026): one keyword, one
// page, and the H1 is the primary keyword. ALL 12 signs target
// "<Sign> Horoscope Today" in title and H1; strong heads are deferred,
// never surrendered. The flank terms (Tomorrow / Weekly / Love) stay as
// H2 sections inside SignSeoSection.

const BASE = 'https://worldcityhub.vercel.app';

interface PageProps {
  params: Promise<{ sign: string }>;
}

function signMeta(slug: string) {
  return ZODIAC_SIGNS.find((s) => s.key === slug);
}

function titleFor(name: string) {
  return `${name} Horoscope Today | WorldCityHub`;
}

function descriptionFor(name: string) {
  return `${name} horoscope today, composed from computed planetary positions: lucky number and colour, love and career meters, weekly outlook.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const meta = signMeta(p.sign);
  const sign = meta?.name ?? p.sign.charAt(0).toUpperCase() + p.sign.slice(1);
  const canonical = `${BASE}/horoscope/${p.sign}`;
  const title = titleFor(sign);
  const description = descriptionFor(sign);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: 'WorldCityHub', type: 'website' },
  };
}

export default async function Page({ params }: PageProps) {
  const p = await params;
  const meta = signMeta(p.sign);
  if (!meta) notFound();
  const url = `${BASE}/horoscope/${p.sign}`;
  // FAQPage is generated from signSeoBlock(meta).faqs, the SAME array
  // SignSeoSection renders visibly on this page, so schema and visible
  // Q&A cannot drift apart. Exactly one FAQPage per sign page.
  const faqs = signSeoBlock(meta).faqs;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: titleFor(meta.name),
        url,
        description: descriptionFor(meta.name),
        isPartOf: { '@type': 'WebSite', name: 'WorldCityHub', url: BASE },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Horoscope', item: `${BASE}/horoscope` },
          { '@type': 'ListItem', position: 3, name: `${meta.name} Horoscope Today`, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
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
      <HoroscopeSignPage />
    </>
  );
}
