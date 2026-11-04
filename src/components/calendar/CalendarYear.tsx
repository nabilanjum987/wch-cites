'use client';

// Full-year calendar view for the country calendar page: twelve month
// grids plus a month-by-month list, with Holidays / Events / All
// filters. All data arrives as server-fetched props (the site's own
// events and holidays systems, via src/lib/calendar.ts); this component
// only filters and renders it. Today is highlighted from the server's
// own today string so server and client always agree.

import { useMemo, useState } from 'react';
import type { CalendarEntry } from '@/lib/calendar';

type Filter = 'all' | 'holiday' | 'event';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function longDate(yyyyMmDd: string): string {
  const d = new Date(`${yyyyMmDd}T12:00:00Z`);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

interface MonthCell {
  day: number;
  iso: string;
  entries: CalendarEntry[];
}

function buildMonth(year: number, monthIdx: number, byDate: Map<string, CalendarEntry[]>): (MonthCell | null)[] {
  const first = new Date(Date.UTC(year, monthIdx, 1));
  const lead = (first.getUTCDay() + 6) % 7; // Monday-first offset
  const days = new Date(Date.UTC(year, monthIdx + 1, 0)).getUTCDate();
  const cells: (MonthCell | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= days; d++) {
    const iso = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, iso, entries: byDate.get(iso) ?? [] });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function CalendarYear({
  entries,
  year,
  todayIso,
  holidayCount,
  eventCount,
}: {
  entries: CalendarEntry[];
  year: number;
  todayIso: string;
  holidayCount: number;
  eventCount: number;
}) {
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? entries : entries.filter((e) => e.kind === filter)),
    [entries, filter],
  );

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    for (const e of visible) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [visible]);

  const byMonth = useMemo(() => {
    const groups: CalendarEntry[][] = Array.from({ length: 12 }, () => []);
    for (const e of visible) groups[Number(e.date.slice(5, 7)) - 1].push(e);
    return groups;
  }, [visible]);

  const chips: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: entries.length },
    { key: 'holiday', label: 'Holidays', count: holidayCount },
    { key: 'event', label: 'Events', count: eventCount },
  ];

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Calendar filters">
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setFilter(c.key)}
            aria-pressed={filter === c.key}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              filter === c.key
                ? 'border-cyan-300 bg-cyan-300/15 text-cyan-200'
                : 'border-white/15 bg-white/5 text-gray-300 hover:text-white'
            }`}
          >
            {c.label} · {c.count}
          </button>
        ))}
        <span className="ml-1 inline-flex items-center gap-4 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Holiday
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" /> Event
          </span>
        </span>
      </div>

      {/* Month grids */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {MONTH_NAMES.map((name, m) => {
          const cells = buildMonth(year, m, byDate);
          return (
            <section key={name} className="rounded-2xl border border-white/10 bg-white/5 p-4" aria-label={`${name} ${year}`}>
              <h3 className="text-base font-bold text-white">
                {name} <span className="font-normal text-gray-400">{year}</span>
              </h3>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-gray-500">
                {WEEKDAYS.map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {cells.map((cell, i) =>
                  cell === null ? (
                    <div key={`blank-${i}`} />
                  ) : (
                    <div
                      key={cell.iso}
                      className={`min-h-[52px] rounded-lg border p-1 ${
                        cell.iso === todayIso
                          ? 'border-cyan-300 bg-cyan-300/10'
                          : cell.entries.length > 0
                            ? 'border-white/15 bg-white/5'
                            : 'border-transparent'
                      }`}
                    >
                      <div
                        className={`text-right text-[11px] font-semibold ${
                          cell.iso === todayIso ? 'text-cyan-200' : 'text-gray-400'
                        }`}
                      >
                        {cell.day}
                      </div>
                      {cell.entries.slice(0, 2).map((e) => (
                        <div
                          key={e.id}
                          title={e.title}
                          className={`mt-0.5 flex items-start gap-1 text-left text-[10px] leading-tight ${
                            e.kind === 'holiday' ? 'text-emerald-300' : 'text-cyan-200'
                          }`}
                        >
                          <span
                            className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                              e.kind === 'holiday' ? 'bg-emerald-400' : 'bg-cyan-300'
                            }`}
                          />
                          <span className="line-clamp-2">{e.title}</span>
                        </div>
                      ))}
                      {cell.entries.length > 2 && (
                        <div className="mt-0.5 text-left text-[10px] text-gray-400">+{cell.entries.length - 2} more</div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* List view by month */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white">
          {year} holidays and events, month by month
        </h2>
        {visible.length === 0 ? (
          <p className="mt-4 max-w-3xl leading-relaxed text-gray-300">
            Nothing is listed in this view for {year}. Entries appear here only when they exist in
            WorldCityHub&apos;s own events and holidays data for the year; a date is never invented
            to fill the calendar.
          </p>
        ) : (
          byMonth.map((monthEntries, m) =>
            monthEntries.length === 0 ? null : (
              <section key={m} className="mt-8" aria-label={`${MONTH_NAMES[m]} ${year}`}>
                <h3 className="text-lg font-semibold text-white">
                  {MONTH_NAMES[m]} {year}
                </h3>
                <ul className="mt-3 divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/5">
                  {monthEntries.map((e) => (
                    <li key={e.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:gap-4">
                      <div className="sm:w-56 sm:shrink-0">
                        <p className={`text-sm font-semibold ${e.kind === 'holiday' ? 'text-emerald-300' : 'text-cyan-200'}`}>
                          {longDate(e.date)}
                          {e.endDate ? ` to ${longDate(e.endDate)}` : ''}
                        </p>
                        <p className="text-xs text-gray-400">{e.hijri}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{e.title}</p>
                        <p className="mt-0.5 text-sm text-gray-400">
                          {e.kind === 'holiday' ? 'Public holiday' : 'Event'} · {e.cityLabel}
                          {e.venue && e.kind === 'event' ? ` · ${e.venue}` : ''}
                        </p>
                        {e.description && (
                          <p className="mt-1 text-sm leading-relaxed text-gray-300">{e.description}</p>
                        )}
                        {e.sourceUrl && (
                          <p className="mt-1 text-xs text-gray-500">
                            Source:{' '}
                            <a href={e.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">
                              {e.sourceName ?? e.sourceUrl}
                            </a>
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ),
          )
        )}
      </div>
    </div>
  );
}
