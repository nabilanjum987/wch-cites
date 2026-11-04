// Pin / Take This Clock — clock catalogue (feat/pin-clock, 2026-11-04).
// One canonical record per pinnable / embeddable clock: the six hero
// clocks plus the published Pakistani cities whose pages render full
// content today. The hero keeps its own CLOCKS list (frozen spec §3);
// this catalogue mirrors those six exactly (same tz, flag code, ring
// colour and href) and adds Lahore + Islamabad so the widget builder
// and the embed route can offer every published city clock.

export interface ClockRecord {
  id: string; // stable slug — used in localStorage, URLs and the embed route
  name: string;
  country: string;
  tz: string; // IANA timezone — the clock's only source of truth
  code: string | null; // ISO alpha-2 lowercase → /images/flags/<code>.png; null = no flag on file
  primary: string; // flag colour used for the ring + hands in the Classic design
  href: string | null; // city/country page, only when it renders real content (L1)
}

export const CLOCK_CATALOGUE: ClockRecord[] = [
  { id: 'london', name: 'London', country: 'United Kingdom', tz: 'Europe/London', code: 'gb', primary: '#4f7ddf', href: null },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', tz: 'Asia/Dubai', code: 'ae', primary: '#00a651', href: null },
  { id: 'karachi', name: 'Karachi', country: 'Pakistan', tz: 'Asia/Karachi', code: 'pk', primary: '#14a44d', href: '/pakistan/sindh/karachi' },
  { id: 'lahore', name: 'Lahore', country: 'Pakistan', tz: 'Asia/Karachi', code: 'pk', primary: '#14a44d', href: '/pakistan/punjab/lahore' },
  { id: 'islamabad', name: 'Islamabad', country: 'Pakistan', tz: 'Asia/Karachi', code: 'pk', primary: '#14a44d', href: '/pakistan/islamabad-capital-territory/islamabad' },
  { id: 'new-york', name: 'New York', country: 'United States', tz: 'America/New_York', code: 'us', primary: '#e05260', href: '/united-states' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', tz: 'Asia/Tokyo', code: 'jp', primary: '#e0576b', href: null },
  { id: 'sydney', name: 'Sydney', country: 'Australia', tz: 'Australia/Sydney', code: 'au', primary: '#f5c542', href: null },
];

export function getClock(id: string | null | undefined): ClockRecord | null {
  if (!id) return null;
  return CLOCK_CATALOGUE.find((c) => c.id === id) ?? null;
}

// A pinned clock is a snapshot of a record at pin time, so a visitor's
// own opt-in clock (any timezone, not just catalogue cities) can be
// pinned too. code may be null when no flag is on file for it.
export interface PinnedClock {
  id: string;
  name: string;
  tz: string;
  code: string | null;
  primary: string;
}

export function toPinned(c: ClockRecord): PinnedClock {
  return { id: c.id, name: c.name, tz: c.tz, code: c.code, primary: c.primary };
}
