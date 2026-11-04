// ICS download for the country calendar (calendar family sample).
// Returns a valid RFC 5545 .ics of the requested year's holidays and
// approved events, built by the same data layer as the calendar page
// (src/lib/calendar.ts). Branding lock: the file carries the
// WorldCityHub calendar name, and every entry carries a WorldCityHub
// description line and the calendar URL inside the file itself.

import {
  CALENDAR_COUNTRIES,
  SITE_BASE,
  buildCalendarIcs,
  getCalendarYear,
  todayInTimeZone,
} from '@/lib/calendar';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ country: string }> },
) {
  const { country } = await params;
  const cfg = CALENDAR_COUNTRIES[country];
  if (!cfg) return new Response('Not found', { status: 404 });

  const currentYear = Number(todayInTimeZone(cfg.timeZone).slice(0, 4));
  const raw = new URL(req.url).searchParams.get('year');
  const parsed = Number(raw);
  const year =
    Number.isInteger(parsed) && parsed >= 2025 && parsed <= currentYear + 2 ? parsed : currentYear;

  const data = await getCalendarYear(cfg, year);
  const ics = buildCalendarIcs(data, `${SITE_BASE}/${cfg.slug}/calendar`);

  return new Response(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="worldcityhub-${cfg.slug}-calendar-${year}.ics"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
