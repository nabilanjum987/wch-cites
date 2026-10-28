import type { Metadata } from 'next';
import HoroscopeSignPage from './SignClient';

// Server wrapper: the interactive sign page lives in SignClient.tsx.
// Metadata must be exported from a server component, so it lives here —
// every zodiac sign gets its own unique title, description and canonical.
//
// A1 targeting (final30-a1-horoscope):
// - Easy signs (Low head terms): title/H1 target "<Sign> Horoscope Today".
// - Hard signs: title and description stay neutral — they contain NEITHER
//   the sign's head term ("<Sign> Horoscope") NOR the flank phrase. The
//   flank is targeted only as an H2/H3 inside SignSeoSection, and the H1
//   on hard-sign pages is the bare sign name (see SignClient).

const EASY_SIGNS = new Set(['aries', 'taurus', 'cancer', 'leo', 'scorpio', 'capricorn']);

interface PageProps {
  params: Promise<{ sign: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const sign = p.sign.charAt(0).toUpperCase() + p.sign.slice(1);
  const canonical = `https://worldcityhub.vercel.app/horoscope/${p.sign}`;
  const easy = EASY_SIGNS.has(p.sign);
  const title = easy
    ? `${sign} Horoscope Today | Daily Reading | WorldCityHub`
    : `${sign} Daily Stars, Love & Lucky Guide | WorldCityHub`;
  const description = easy
    ? `${sign} horoscope today: daily reading, lucky number and colour, love compatibility and weekly outlook — free on WorldCityHub.`
    : `${sign} daily stars: today's reading, lucky number and colour, compatibility and weekly outlook — free on WorldCityHub.`;
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
