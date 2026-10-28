import type { Metadata } from 'next';
import PrayerTimesPage, { type InitialPrayerTimes, type InitialZakatRates } from './PrayerTimesClient';
import { getCityBySlug } from '../../../../../types/city';

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
  const description = `${city} prayer times for all faiths: live countdown, mosque, church, temple, gurdwara and synagogue times, multi-faith calendar.`;
  const canonical = `https://worldcityhub.vercel.app/${p.country}/${p.province}/${p.city}/prayer-times`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: 'WorldCityHub', type: 'website' },
  };
}

// P13(f): server-rendered initial timetable (Aladhan, Karachi method,
// Hanafi — the same source and method the client fetches). This fills
// the page's own row in the "Compare Prayer Times" table in RAW HTML:
// the client-only fetch left it blank ("—") for crawlers and before
// hydration. Any failure returns null and the client fetch takes over;
// nothing is fabricated.
async function fetchInitialTimes(lat: number, lng: number, tz: string): Promise<InitialPrayerTimes | null> {
  try {
    const dateStr = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric', timeZone: tz,
    }).format(new Date()).replace(/\//g, '-');
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=1&school=1`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const t = json?.data?.timings;
    if (!t?.Fajr || !t?.Asr || !t?.Maghrib || !t?.Isha) return null;
    return { Fajr: t.Fajr, Sunrise: t.Sunrise, Dhuhr: t.Dhuhr, Asr: t.Asr, Maghrib: t.Maghrib, Isha: t.Isha };
  } catch {
    return null;
  }
}

// P13(a): server-rendered Shafi'i Asr for the method section, so both
// fiqh values are real in raw HTML (Hanafi comes from fetchInitialTimes).
async function fetchInitialShafiiAsr(lat: number, lng: number, tz: string): Promise<string | null> {
  try {
    const dateStr = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric', timeZone: tz,
    }).format(new Date()).replace(/\//g, '-');
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=1&school=0`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.timings?.Asr ?? null;
  } catch {
    return null;
  }
}

// P13(b): server-rendered live bullion per gram, from the site's existing
// live-rate mechanism — CoinGecko PAX Gold in PKR (the ticker's source)
// and gold-api silver spot converted at the open USD→PKR rate. Any
// failure returns null and the Zakat card hides its figures; the stale
// hard-coded rate is gone for good.
async function fetchInitialZakat(): Promise<InitialZakatRates | null> {
  try {
    const [cg, silver, fx] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=pkr', { next: { revalidate: 3600 } }),
      fetch('https://api.gold-api.com/price/XAG', { next: { revalidate: 3600 } }),
      fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 3600 } }),
    ]);
    if (!cg.ok || !silver.ok || !fx.ok) return null;
    const cgJson = await cg.json();
    const silverJson = await silver.json();
    const fxJson = await fx.json();
    const goldPerOzPkr = cgJson?.['pax-gold']?.pkr;
    const silverPerOzUsd = silverJson?.price;
    const usdPkr = fxJson?.rates?.PKR;
    if (typeof goldPerOzPkr !== 'number' || typeof silverPerOzUsd !== 'number' || typeof usdPkr !== 'number') return null;
    return {
      goldPerGram: goldPerOzPkr / 31.1035,
      silverPerGram: (silverPerOzUsd / 31.1035) * usdPkr,
    };
  } catch {
    return null;
  }
}

export default async function Page({ params }: PageProps) {
  const p = await params;
  const city = getCityBySlug(p.city);
  const [initialTimes, initialZakat, initialShafiiAsr] = await Promise.all([
    fetchInitialTimes(
      city?.lat ?? 31.5204,
      city?.lng ?? 74.3587,
      city?.timezone ?? 'Asia/Karachi',
    ),
    fetchInitialZakat(),
    fetchInitialShafiiAsr(
      city?.lat ?? 31.5204,
      city?.lng ?? 74.3587,
      city?.timezone ?? 'Asia/Karachi',
    ),
  ]);
  return <PrayerTimesPage initialTimes={initialTimes} initialZakat={initialZakat} initialShafiiAsr={initialShafiiAsr} />;
}
