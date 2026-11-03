'use client';

// Fact-card CITY row (Stage 2, owner rule 2026-11-03) — the three
// default-city cards of §5 Today's World (temperature, next prayer,
// gold per tola). City-specific data may appear ONLY after the
// visitor uses My Location, so this row renders nothing until the
// shared visitor-city state (opt-in, localStorage on this device)
// holds a city. The figures themselves are fetched server-side by
// FactCards and arrive as props; this component only gates them.
// The city shown is the site's default published city, the same one
// the My City panel opens with; the panel itself handles switching
// to the visitor's nearest published city.

import PrayerCountdown from './PrayerCountdown';
import { useVisitorCity } from './useVisitorCity';

export interface CityFactData {
  cityName: string;
  temp: { temp: number; feels: number; condition: string } | null;
  prayer: { name: string; time: string; atMs: number } | null;
  goldTola: number | null;
}

function Card({ label, value, sub, source }: {
  label: string; value: React.ReactNode; sub?: React.ReactNode; source: string;
}) {
  return (
    <div className="rounded-3xl border t-border t-card p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] t-text-50">{label}</p>
      <p className="mt-2 text-2xl font-extrabold t-text">{value}</p>
      {sub && <p className="mt-1 text-xs t-text-50">{sub}</p>}
      <p className="mt-2 text-[11px] t-text-35">Source: {source}</p>
    </div>
  );
}

export default function FactCardsCity({ data }: { data: CityFactData }) {
  const { visitor } = useVisitorCity();
  if (!visitor) return null;

  const cards: React.ReactNode[] = [];
  if (data.temp) {
    cards.push(
      <Card key="temp" label={`${data.cityName}: right now`}
        value={`${data.temp.temp}°C`}
        sub={`${data.temp.condition} · feels like ${data.temp.feels}°C`}
        source="Open-Meteo (the My City weather feed)" />,
    );
  }
  if (data.prayer) {
    cards.push(
      <Card key="prayer" label={`Next prayer: ${data.cityName}`}
        value={data.prayer.name}
        sub={<>{data.prayer.time} · <PrayerCountdown atMs={data.prayer.atMs} /></>}
        source="Aladhan (the My City prayer feed)" />,
    );
  }
  if (data.goldTola) {
    cards.push(
      <Card key="gold" label="Gold: per tola (PKR)"
        value={`Rs ${data.goldTola.toLocaleString('en-PK')}`}
        sub="24k gold, one tola (11.6638 g)"
        source="gold-api.com XAU (the My City gold feed)" />,
    );
  }
  if (cards.length === 0) return null;
  return <div className="grid gap-4 sm:grid-cols-2">{cards}</div>;
}
