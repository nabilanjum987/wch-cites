// Embeddable country calendar widget (calendar family sample).
// A route handler returning a complete, self-contained HTML document:
// no site chrome (no navbar, no ticker, no footer), no JavaScript, just
// the current month's grid and entries, sized for an iframe on another
// website. Branding lock: the widget renders its own WorldCityHub
// credit line at its foot, part of the widget itself, so any site that
// embeds the calendar carries the credit with it.

import {
  CALENDAR_COUNTRIES,
  SITE_BASE,
  getCalendarYear,
  todayInTimeZone,
  type CalendarEntry,
} from '@/lib/calendar';

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ country: string }> },
) {
  const { country } = await params;
  const cfg = CALENDAR_COUNTRIES[country];
  if (!cfg) return new Response('Not found', { status: 404 });

  const todayIso = todayInTimeZone(cfg.timeZone);
  const year = Number(todayIso.slice(0, 4));
  const monthIdx = Number(todayIso.slice(5, 7)) - 1;
  const data = await getCalendarYear(cfg, year);

  const byDate = new Map<string, CalendarEntry[]>();
  for (const e of data.entries) {
    const list = byDate.get(e.date) ?? [];
    list.push(e);
    byDate.set(e.date, list);
  }
  const monthEntries = data.entries.filter((e) => Number(e.date.slice(5, 7)) - 1 === monthIdx);

  const first = new Date(Date.UTC(year, monthIdx, 1));
  const lead = (first.getUTCDay() + 6) % 7; // Monday-first
  const days = new Date(Date.UTC(year, monthIdx + 1, 0)).getUTCDate();
  const cells: string[] = [];
  const wd = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    .map((d) => `<div class="wd">${d}</div>`)
    .join('');
  for (let i = 0; i < lead; i++) cells.push('<div class="cell empty"></div>');
  for (let d = 1; d <= days; d++) {
    const iso = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEntries = byDate.get(iso) ?? [];
    const dots = dayEntries
      .map((e) => `<span class="dot ${e.kind === 'holiday' ? 'hol' : 'evt'}" title="${esc(e.title)}"></span>`)
      .join('');
    const cls = ['cell', iso === todayIso ? 'today' : '', dayEntries.length ? 'has' : '']
      .filter(Boolean)
      .join(' ');
    cells.push(`<div class="${cls}"><span class="num">${d}</span><span class="dots">${dots}</span></div>`);
  }

  const list = monthEntries.length
    ? monthEntries
        .map(
          (e) => `<li><span class="date">${esc(
            new Date(`${e.date}T12:00:00Z`).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              timeZone: 'UTC',
            }),
          )}</span><span class="dot ${e.kind === 'holiday' ? 'hol' : 'evt'}"></span><span>${esc(e.title)}</span></li>`,
        )
        .join('')
    : '<li class="none">No holidays or events listed this month.</li>';

  const calendarUrl = `${SITE_BASE}/${cfg.slug}/calendar`;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(cfg.name)} Calendar ${year} by WorldCityHub</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: #0a0f1e; color: #fff; padding: 14px; }
  .head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
  .head h1 { font-size: 16px; font-weight: 700; }
  .head .mo { color: #9fd8e8; font-size: 14px; font-weight: 600; white-space: nowrap; }
  .grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-top: 10px; }
  .wd { text-align: center; font-size: 10px; color: #8a93a6; padding: 2px 0; }
  .cell { min-height: 40px; border-radius: 8px; padding: 4px; background: rgba(255,255,255,.04); display: flex; flex-direction: column; }
  .cell.empty { background: transparent; }
  .cell.today { outline: 1.5px solid #67e8f9; background: rgba(103,232,249,.10); }
  .cell .num { font-size: 11px; font-weight: 600; color: #c9d2e0; text-align: right; }
  .dots { display: flex; gap: 3px; margin-top: auto; }
  .dot { display: inline-block; width: 7px; height: 7px; border-radius: 999px; flex: none; }
  .dot.hol { background: #34d399; }
  .dot.evt { background: #67e8f9; }
  ul { list-style: none; margin-top: 12px; border-top: 1px solid rgba(255,255,255,.08); }
  li { display: flex; align-items: center; gap: 8px; padding: 7px 2px; border-bottom: 1px solid rgba(255,255,255,.06); font-size: 13px; }
  li .date { color: #9fd8e8; font-weight: 600; width: 52px; flex: none; }
  li.none { color: #8a93a6; }
  .foot { margin-top: 12px; text-align: center; font-size: 12px; color: #8a93a6; }
  .foot a { color: #67e8f9; font-weight: 700; text-decoration: none; }
  .foot a:hover { text-decoration: underline; }
</style>
</head>
<body>
  <div class="head"><h1>${esc(cfg.name)} Calendar</h1><span class="mo">${MONTH_NAMES[monthIdx]} ${year}</span></div>
  <div class="grid">${wd}${cells.join('')}</div>
  <ul>${list}</ul>
  <p class="foot">Calendar by <a href="${calendarUrl}" target="_top" rel="noopener">WorldCityHub</a> · <a href="${calendarUrl}" target="_top" rel="noopener">Full year, downloads &amp; embed</a></p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=1800',
    },
  });
}
