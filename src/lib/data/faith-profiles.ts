// ─────────────────────────────────────────────────────────────────────────────
// Population-weighted faith profiles for prayer-times pages (final28-p13).
//
// DESIGN-FILE RULE (implemented, not Lahore-hardcoded):
//   * The city's MAJORITY faith (city.major_religion) is always shown FIRST
//     and at FULL depth.
//   * Other faiths present in the city are shown after it, at the depth
//     their local community warrants: 'medium' for a large minority,
//     'light' for a small but historically present community.
//   * If the same profile were used for a Christian-majority city, the
//     ordering rule promotes Christianity to first/full automatically —
//     depthFor() derives 'full' from major_religion, never from a
//     hard-coded city name.
//   * A city with NO profile entry renders NO faith section at all, so
//     this mechanism cannot misfire on cities it has no data for.
//
// Lahore data (all facts sourced; see `source` on each entry):
//   * 2023 Census of Pakistan (via Wikipedia, "Christianity in Punjab,
//     Pakistan" / "Demographics of Lahore"): Lahore District Christians
//     602,431 (4.64% of the district; 24.5% of Punjab's Christians — the
//     largest district count in Punjab, ahead of Faisalabad 308,580);
//     Lahore city Islam 95.07%, Hinduism 0.02% (2,487), Sikhism 0.006% (715).
//   * Sacred Heart Cathedral: seat of the Roman Catholic Archdiocese of
//     Lahore, Lawrence Road / The Mall, consecrated 19 November 1907
//     (Wikipedia, "Sacred Heart Cathedral, Lahore"); Sunday Masses listed
//     at 9:30 AM and 11:30 AM (audiala.com Lahore cathedral listing).
//   * Cathedral Church of the Resurrection: Anglican cathedral on Mall
//     Road, seat of the Diocese of Lahore (Church of Pakistan), opened
//     1887 (wanderlog / apnaorg church survey); Sunday English Communion
//     services listed at 8:00 AM and 5:00 PM (wanderlog).
//   * Gurdwara Dera Sahib: commemorates the spot where Guru Arjan Dev,
//     the 5th Sikh Guru, was martyred in 1606; beside Badshahi Mosque /
//     Lahore Fort (Wikipedia, "Gurdwara Dera Sahib").
//   * Krishna Mandir: Hindu temple dedicated to Krishna on Ravi Road,
//     opposite Timber Market; one of only two functional Hindu temples
//     in Lahore, the other being Valmiki Mandir; governed by the Pakistan
//     Hindu Council (Wikipedia, "Krishna Mandir, Lahore").
// Service times are published schedules, not guarantees: the section
// tells readers to check ahead, because times vary on feast days.
// ─────────────────────────────────────────────────────────────────────────────

export type FaithDepth = 'full' | 'medium' | 'light';

export interface FaithPlace {
  name: string;
  detail: string;
}

export interface FaithSection {
  key: string;
  /** Display name, e.g. 'Christianity'. Compared against major_religion. */
  faith: string;
  /** Depth stored in the profile; the rendered depth is depthFor(). */
  baseDepth: Exclude<FaithDepth, 'full'>;
  intro: string;
  places: FaithPlace[];
  source: string;
}

export interface CityFaithProfile {
  citySlug: string;
  censusNote: string;
  sections: FaithSection[];
}

const PROFILES: Record<string, CityFaithProfile> = {
  lahore: {
    citySlug: 'lahore',
    censusNote:
      '2023 Census of Pakistan: Islam 95.07% of Lahore city; Christians 602,431 in Lahore District (4.64% of the district, the largest Christian count of any Punjab district); Hindus 2,487 and Sikhs 715.',
    sections: [
      {
        key: 'islam',
        faith: 'Islam',
        baseDepth: 'medium',
        intro:
          'The majority faith of Lahore, covered in full across this page: the live five-prayer timetable, mosque finder, Hijri calendar, Ramadan and Zakat sections above.',
        places: [
          {
            name: 'Badshahi Mosque',
            detail: 'Walled City; built 1673; capacity 100,000 — see the Mosques section above.',
          },
          {
            name: 'Data Darbar Shrine',
            detail: 'Shrine of Hazrat Data Ganj Bakhsh, Bhati Gate; open 24 hours.',
          },
        ],
        source: 'Site prayer data (Aladhan, Karachi method, Hanafi); 2023 Census figures.',
      },
      {
        key: 'christian',
        faith: 'Christianity',
        baseDepth: 'medium',
        intro:
          'Lahore District is home to 602,431 Christians (2023 Census) — the largest Christian community of any district in Punjab — so Christianity is covered here in medium depth, with real churches and their listed Sunday services. Times are published schedules and can vary on feast days; check ahead before travelling.',
        places: [
          {
            name: 'Sacred Heart Cathedral, Lawrence Road',
            detail:
              'Seat of the Roman Catholic Archdiocese of Lahore, consecrated 19 November 1907. Sunday Masses listed at 9:30 AM and 11:30 AM.',
          },
          {
            name: 'Cathedral Church of the Resurrection, Mall Road',
            detail:
              'Anglican cathedral, seat of the Diocese of Lahore (Church of Pakistan), opened 1887. Sunday English Communion services listed at 8:00 AM and 5:00 PM.',
          },
          {
            name: 'St. Andrew’s Church, Nabha Road; St. Anthony’s Church; St. Joseph’s Church',
            detail:
              'Historic Lahore churches named alongside the two cathedrals in the city’s Easter coverage and church surveys.',
          },
        ],
        source:
          '2023 Census of Pakistan; Wikipedia (Sacred Heart Cathedral, Lahore); audiala.com Lahore cathedral listing; wanderlog / apnaorg Lahore church survey.',
      },
      {
        key: 'sikh',
        faith: 'Sikhism',
        baseDepth: 'light',
        intro:
          'A small community in Lahore today (715 Sikhs in the 2023 city table) with one of Sikhism’s most significant shrines in the city, covered here in light depth.',
        places: [
          {
            name: 'Gurdwara Dera Sahib',
            detail:
              'Beside Badshahi Mosque and Lahore Fort. Commemorates the spot where Guru Arjan Dev, the 5th Sikh Guru, was martyred in 1606.',
          },
        ],
        source: 'Wikipedia (Gurdwara Dera Sahib); 2023 Census city table.',
      },
      {
        key: 'hindu',
        faith: 'Hinduism',
        baseDepth: 'light',
        intro:
          'A small community in Lahore today (2,487 Hindus in the 2023 city table) with two functional temples, covered here in light depth.',
        places: [
          {
            name: 'Krishna Mandir, Ravi Road',
            detail:
              'Hindu temple dedicated to Krishna, opposite Timber Market; one of only two functional Hindu temples in Lahore, governed by the Pakistan Hindu Council.',
          },
          {
            name: 'Valmiki Mandir (Neela Gumbad Mandir)',
            detail: 'The other functional Hindu temple in Lahore.',
          },
        ],
        source: 'Wikipedia (Krishna Mandir, Lahore; List of temples in Lahore).',
      },
    ],
  },
};

/** Rendered depth: the majority faith is always 'full', whatever it is. */
export function depthFor(section: FaithSection, majorReligion: string): FaithDepth {
  return section.faith.toLowerCase() === majorReligion.toLowerCase() ? 'full' : section.baseDepth;
}

/**
 * Ordered faith sections for a city, or null when the city has no profile.
 * Majority faith first (full), then the rest in profile order.
 */
export function getFaithSectionsForCity(
  citySlug: string,
  majorReligion: string,
): { profile: CityFaithProfile; sections: { section: FaithSection; depth: FaithDepth }[] } | null {
  const profile = PROFILES[citySlug];
  if (!profile) return null;
  const withDepth = profile.sections.map((section) => ({ section, depth: depthFor(section, majorReligion) }));
  withDepth.sort((a, b) => {
    const rank = (d: FaithDepth) => (d === 'full' ? 0 : d === 'medium' ? 1 : 2);
    return rank(a.depth) - rank(b.depth);
  });
  return { profile, sections: withDepth };
}

// ── Next Ramadan: roll-forward list, never a negative countdown ─────────────
// Expected first-fast dates (astronomical projections, subject to official
// moon sighting — Ruet-e-Hilal Committee in Pakistan). Sources: Emirates
// Astronomical Society / Gulf News (Ramadan 2027: 8 February 2027) and the
// published 2027–2030 expected-date table. Later years continue the ~11-day
// annual drift and stay labelled "expected".
const RAMADAN_STARTS: { date: string; label: string }[] = [
  { date: '2027-02-08', label: 'February 2027' },
  { date: '2028-01-28', label: 'January 2028' },
  { date: '2029-01-16', label: 'January 2029' },
  { date: '2030-01-05', label: 'January 2030' },
  { date: '2030-12-26', label: 'December 2030' },
  { date: '2031-12-15', label: 'December 2031' },
  { date: '2032-12-04', label: 'December 2032' },
  { date: '2033-11-23', label: 'November 2033' },
  { date: '2034-11-13', label: 'November 2034' },
  { date: '2035-11-02', label: 'November 2035' },
];

export function nextRamadan(from: Date = new Date()): { label: string; daysAway: number } {
  const startOfToday = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (const r of RAMADAN_STARTS) {
    const d = new Date(`${r.date}T00:00:00`);
    const daysAway = Math.ceil((d.getTime() - startOfToday.getTime()) / 86400000);
    if (daysAway > 0) return { label: r.label, daysAway };
  }
  // Beyond the table: keep rolling forward ~354 days per Hijri year.
  const last = new Date(`${RAMADAN_STARTS[RAMADAN_STARTS.length - 1].date}T00:00:00`);
  let d = last;
  while (d.getTime() <= startOfToday.getTime()) d = new Date(d.getTime() + 354 * 86400000);
  return {
    label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    daysAway: Math.ceil((d.getTime() - startOfToday.getTime()) / 86400000),
  };
}

// ── Next new moon: computed from a verified anchor, always rolls forward ────
// Anchor: new moon 9 November 2026, 12:02 PKT (07:02 UTC) — timeanddate.com
// Punjab lunation table (lunation 1285). The mean synodic month
// (29.530588853 days) steps from that anchor; dates stay correct at
// day granularity for the months this page is used over. The result is the
// ASTRONOMICAL conjunction, not the sighted crescent: official Islamic
// month starts in Pakistan are announced by the Ruet-e-Hilal Committee.
const NEW_MOON_ANCHOR_UTC = Date.UTC(2026, 10, 9, 7, 2);
const SYNODIC_MONTH_DAYS = 29.530588853;

export function nextNewMoon(from: Date = new Date()): Date {
  let d = new Date(NEW_MOON_ANCHOR_UTC);
  const step = SYNODIC_MONTH_DAYS * 86400000;
  while (d.getTime() <= from.getTime()) d = new Date(d.getTime() + step);
  return d;
}

export function moonPhaseInfo(on: Date = new Date()): {
  ageDays: number;
  illuminationPct: number;
  phaseName: string;
  nextNewMoon: Date;
} {
  const step = SYNODIC_MONTH_DAYS * 86400000;
  let last = new Date(NEW_MOON_ANCHOR_UTC);
  // Step BACKWARD first when `on` predates the anchor (the anchor is
  // 9 Nov 2026, so every date before it needs this — without it the
  // "last" new moon would be the anchor itself and the next one would
  // wrongly skip a whole lunation).
  while (last.getTime() > on.getTime()) last = new Date(last.getTime() - step);
  while (new Date(last.getTime() + step).getTime() <= on.getTime()) last = new Date(last.getTime() + step);
  const ageDays = (on.getTime() - last.getTime()) / 86400000;
  const illuminationPct = Math.round(((1 - Math.cos((2 * Math.PI * ageDays) / SYNODIC_MONTH_DAYS)) / 2) * 100);
  const phaseName =
    ageDays < 1.84
      ? 'New Moon'
      : ageDays < 5.53
        ? 'Waxing Crescent'
        : ageDays < 9.22
          ? 'First Quarter'
          : ageDays < 12.91
            ? 'Waxing Gibbous'
            : ageDays < 16.61
              ? 'Full Moon'
              : ageDays < 20.3
                ? 'Waning Gibbous'
                : ageDays < 23.99
                  ? 'Last Quarter'
                  : ageDays < 27.68
                    ? 'Waning Crescent'
                    : 'New Moon';
  return { ageDays, illuminationPct, phaseName, nextNewMoon: new Date(last.getTime() + step) };
}
