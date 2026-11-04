// ── WorldCityHub calendar family: data layer (sample: Pakistan) ────────
// Owner spec (3 Nov 2026 review): one full-year calendar per country
// carrying BOTH public holidays and approved events, with ICS + PDF
// downloads and a website embed, every surface carrying the WorldCityHub
// name and URL (branding lock, not removable).
//
// Data rules (nothing invented, nothing guessed):
//   * Holidays and events come from the site's OWN systems only: the
//     events table behind getApprovedEvents (approved + verified rows;
//     its nationwide rows, city_slug NULL, are the public holidays the
//     site already publishes as "national dates" on city events pages,
//     seeded from the Government of Pakistan public holidays list) and,
//     merged in, fetchPublicHolidays (the site's holiday API layer,
//     date.nager.at). For Pakistan the API layer returns no rows (the
//     service carries no Pakistan dataset, verified 4 Nov 2026), so the
//     holidays below are the events table's own.
//   * Islamic holidays whose Gregorian dates are set by official
//     announcement (Eid ul-Fitr, Eid ul-Adha, Ashura, Eid Milad-un-Nabi)
//     are NOT in the fixed-date data and are never guessed here; they
//     appear when an approved row carries them.
//   * The Hijri date shown beside each Gregorian date is a calendar
//     CONVERSION of that same date (Intl islamic calendar, the method
//     the Pakistan country page already uses), not stored data.

import { getApprovedEvents, type WchEvent } from './events';
import { fetchPublicHolidays } from './apis/events';
import { HIJRI_MONTHS } from './apis/islamic';

export interface CalendarCountry {
  slug: string;
  name: string;
  code: string; // ISO 3166-1 alpha-2, for the holiday API layer
  timeZone: string;
  utcOffset: string; // fixed offset string for range queries, e.g. '+05:00'
}

// The sample ships Pakistan only. Replicating the family = adding a row
// here and letting the same template render it (owner sample gate).
export const CALENDAR_COUNTRIES: Record<string, CalendarCountry> = {
  pakistan: {
    slug: 'pakistan',
    name: 'Pakistan',
    code: 'PK',
    timeZone: 'Asia/Karachi',
    utcOffset: '+05:00',
  },
};

export interface CalendarEntry {
  id: string;
  title: string;
  kind: 'holiday' | 'event';
  date: string; // YYYY-MM-DD in the country's timezone
  endDate?: string; // inclusive last day, when the source row spans days
  startsAtIso?: string; // raw source timestamps (events), for the ICS file
  endsAtIso?: string;
  cityLabel: string; // 'Nationwide' for holidays
  venue?: string;
  description: string;
  sourceName?: string;
  sourceUrl?: string;
  hijri: string;
}

export interface CalendarYearData {
  country: CalendarCountry;
  year: number;
  entries: CalendarEntry[];
  holidays: CalendarEntry[];
  events: CalendarEntry[];
  hasHolidayData: boolean;
}

export const SITE_BASE = 'https://worldcityhub.vercel.app';

// Same treatment the events hub applies to database text: no em dashes
// in rendered copy (owner rule G1).
const clean = (s: string) => (s ?? '').replace(/ — /g, ', ').replace(/—/g, '-');

const tzDateFmt = (timeZone: string) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

/** YYYY-MM-DD of an instant in the given timezone. */
export function dateInTimeZone(iso: string, timeZone: string): string {
  return tzDateFmt(timeZone).format(new Date(iso));
}

/** Today as YYYY-MM-DD in the given timezone. */
export function todayInTimeZone(timeZone: string): string {
  return tzDateFmt(timeZone).format(new Date());
}

/** Hijri (Islamic) label for a Gregorian YYYY-MM-DD, by conversion. */
export function hijriLabel(yyyyMmDd: string): string {
  const d = new Date(`${yyyyMmDd}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-u-ca-islamic', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(d);
  const day = parts.find((p) => p.type === 'day')?.value ?? '';
  const monthNum = Number(parts.find((p) => p.type === 'month')?.value ?? 0);
  const year = (parts.find((p) => p.type === 'year')?.value ?? '').replace(/[^0-9]/g, '');
  const month = HIJRI_MONTHS[monthNum - 1]?.en ?? '';
  return `${day} ${month} ${year} AH`;
}

function cityLabelOf(ev: WchEvent): string {
  if (!ev.city_slug) return 'Nationwide';
  return ev.city_slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function getCalendarYear(
  country: CalendarCountry,
  year: number,
): Promise<CalendarYearData> {
  const fromIso = `${year}-01-01T00:00:00${country.utcOffset}`;
  const toIso = `${year + 1}-01-01T00:00:00${country.utcOffset}`;

  const [rows, apiHolidays] = await Promise.all([
    getApprovedEvents({ fromIso, toIso, limit: 500 }),
    fetchPublicHolidays(country.code, year).catch(() => []),
  ]);

  const entries: CalendarEntry[] = [];
  const seen = new Set<string>();

  for (const ev of rows) {
    const date = dateInTimeZone(ev.starts_at, country.timeZone);
    if (!date.startsWith(`${year}-`)) continue;
    // Site semantics: a nationwide row (city_slug NULL) in the events
    // table is a public holiday; a city row is an event.
    const kind: CalendarEntry['kind'] = ev.city_slug ? 'event' : 'holiday';
    const endDate = ev.ends_at ? dateInTimeZone(ev.ends_at, country.timeZone) : undefined;
    const entry: CalendarEntry = {
      id: `wch-${ev.id}`,
      title: clean(ev.title),
      kind,
      date,
      endDate: endDate && endDate !== date ? endDate : undefined,
      startsAtIso: ev.starts_at,
      endsAtIso: ev.ends_at ?? undefined,
      cityLabel: cityLabelOf(ev),
      venue: ev.venue ? clean(ev.venue) : undefined,
      description: clean(ev.description ?? ''),
      sourceName: ev.source_name ? clean(ev.source_name) : undefined,
      sourceUrl: ev.source_url || undefined,
      hijri: hijriLabel(date),
    };
    seen.add(`${entry.date}|${entry.title.toLowerCase()}`);
    entries.push(entry);
  }

  // Merge the site's holiday API layer (date.nager.at). Countries the
  // service does not carry return an empty list, so this is a no-op for
  // Pakistan today and real data where the service covers the country.
  for (const h of apiHolidays) {
    if (!h.date.startsWith(`${year}-`)) continue;
    const title = clean(h.title);
    const key = `${h.date}|${title.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push({
      id: `api-${h.id}`,
      title,
      kind: 'holiday',
      date: h.date,
      cityLabel: 'Nationwide',
      description: clean(h.description ?? ''),
      hijri: hijriLabel(h.date),
    });
  }

  entries.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.title.localeCompare(b.title)));
  const holidays = entries.filter((e) => e.kind === 'holiday');
  const events = entries.filter((e) => e.kind === 'event');
  return { country, year, entries, holidays, events, hasHolidayData: holidays.length > 0 };
}

// ── ICS (RFC 5545) ──────────────────────────────────────────────────────
// Every generated file carries the branding lock INSIDE the file: the
// calendar name, a WorldCityHub URL property and description line on
// every entry, so the credit travels with the data wherever it is
// imported.

const icsEscape = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const out: string[] = [];
  let rest = line;
  out.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 74) {
    out.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  if (rest) out.push(` ${rest}`);
  return out.join('\r\n');
}

const basicDate = (yyyyMmDd: string) => yyyyMmDd.replace(/-/g, '');

function addDays(yyyyMmDd: string, days: number): string {
  const d = new Date(`${yyyyMmDd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function basicDateTime(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function buildCalendarIcs(data: CalendarYearData, calendarUrl: string): string {
  const { country, year, entries } = data;
  const stamp = basicDateTime(new Date().toISOString());
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WorldCityHub//Country Calendar//EN',
    `X-WR-CALNAME:WorldCityHub: ${country.name} Calendar ${year}`,
    `X-WR-TIMEZONE:${country.timeZone}`,
  ];
  for (const e of entries) {
    const descParts = [
      e.kind === 'holiday' ? `Public holiday in ${country.name}.` : `Event in ${e.cityLabel}, ${country.name}.`,
      e.description,
      `Listed by WorldCityHub: ${calendarUrl}`,
      e.sourceName ? `Source: ${e.sourceName}` : '',
    ].filter(Boolean);
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${e.id}@worldcityhub.vercel.app`);
    lines.push(`DTSTAMP:${stamp}`);
    if (e.kind === 'holiday') {
      lines.push(`DTSTART;VALUE=DATE:${basicDate(e.date)}`);
      lines.push(`DTEND;VALUE=DATE:${basicDate(addDays(e.endDate ?? e.date, 1))}`);
    } else if (e.startsAtIso) {
      lines.push(`DTSTART:${basicDateTime(e.startsAtIso)}`);
      lines.push(`DTEND:${basicDateTime(e.endsAtIso ?? e.startsAtIso)}`);
    } else {
      lines.push(`DTSTART;VALUE=DATE:${basicDate(e.date)}`);
      lines.push(`DTEND;VALUE=DATE:${basicDate(addDays(e.date, 1))}`);
    }
    lines.push(`SUMMARY:${icsEscape(e.title)}`);
    lines.push(`DESCRIPTION:${icsEscape(descParts.join('\n'))}`);
    if (e.venue && e.kind === 'event') lines.push(`LOCATION:${icsEscape(e.venue)}`);
    lines.push(`URL:${calendarUrl}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
