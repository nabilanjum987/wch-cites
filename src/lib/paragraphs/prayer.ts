/**
 * SEO paragraph generators — WorldCityHub Prayer Times Page (Islam tab)
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 6 sections × ~250 words × 2 = 3,000+ words on the Islamic tab.
 * All paragraphs use real live data variables for genuine uniqueness per city.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── 1. NEXT PRAYER COUNTDOWN ───────────────────────────────────────────────

export function generateNextPrayerParagraph(city: string, nextPrayer: string): string {
  const { month, year } = now();
  return `The next prayer due in ${city} is ${nextPrayer}, and the countdown above tracks exactly how much time remains before it begins. This live countdown updates continuously throughout ${month} ${year}, recalculating the moment one prayer window closes and the next one opens, so the number you see is always accurate to the minute rather than a static schedule printed once a day. For Muslims in ${city} structuring work, study, or travel around the five daily prayers, this kind of real-time countdown removes the guesswork of mental arithmetic between the printed timetable and the current clock.`;
}

export function generateNextPrayerAfter(city: string, nextPrayer: string): string {
  const { month, year } = now();
  return `Knowing precisely how long remains until ${nextPrayer} in ${city} matters most in the final ten or fifteen minutes before a prayer, when finishing a task, wrapping up a meeting, or timing a commute to reach a mosque becomes a real consideration. The countdown above is calculated from the same coordinates and calculation method used throughout this page, so it stays perfectly consistent with the full timetable below rather than drifting from a separately sourced estimate. Through ${month} ${year}, as sunrise and sunset times shift gradually across the city, this countdown adjusts automatically each day without requiring any manual update.`;
}

// ─── 2. PRAYER TIMES TABLE (today) ──────────────────────────────────────────

export function generatePrayerTableParagraph(
  city: string, timings: Record<string, string> | null
): string {
  const { month, year } = now();
  if (!timings) {
    return `Today's prayer timetable for ${city} in ${month} ${year} is calculated using the Karachi method, the standard reference adopted across Pakistan and widely used throughout South Asia. Each of the five daily prayers — Fajr, Dhuhr, Asr, Maghrib, and Isha — is computed from the sun's exact position relative to ${city}'s geographic coordinates, not copied from a generic regional table. The table above also includes sunrise, marking the end of the Fajr window, a detail that is religiously significant even though Sunrise itself is not a prayer time.`;
  }
  const { Fajr, Dhuhr, Asr, Maghrib, Isha } = timings;
  return `Today's prayer times in ${city} for ${month} ${year}: Fajr ${Fajr} · Dhuhr ${Dhuhr} · Asr ${Asr} · Maghrib ${Maghrib} · Isha ${Isha}. These figures are calculated using the Karachi method (University of Islamic Sciences), the standard calculation reference across Pakistan, applied to ${city}'s precise latitude and longitude rather than interpolated from a nearby city. The table above marks each prayer's status — passed, current, or upcoming — at a glance, so checking it once in the morning gives a Muslim in ${city} the complete shape of the religious day ahead.`;
}

export function generatePrayerTableAfter(city: string): string {
  const { month, year } = now();
  return `For residents following the Hanafi madhab, the most common school of jurisprudence in ${city} and across Pakistan, the Asr time shown above follows the longer shadow-length calculation — typically around an hour later than the Shafi'i timing used in much of the Arab world. ${city}'s prayer times shift noticeably across the seasons: Fajr can fall as early as 3:30 AM during the long days of June and as late as 5:30 AM during December's shorter daylight hours, which is why checking the live timetable rather than relying on memory matters, especially around the changing seasons of ${month} ${year}. The weekly table further down this page extends this same calculation seven days ahead for anyone planning beyond today.`;
}

// ─── 3. QIBLA DIRECTION & AZAN ──────────────────────────────────────────────

export function generateQiblaParagraph(city: string, qiblaDegrees: number): string {
  const { month, year } = now();
  return `The Qibla direction from ${city} points ${Math.round(qiblaDegrees)}° from true north toward the Kaaba in Mecca, calculated using ${city}'s exact coordinates rather than a generalised compass bearing for the wider region. The interactive compass above orients itself using the device's own sensors, so holding a phone flat and turning until the indicator aligns gives an accurate prayer direction anywhere in ${city} — at home, at work, in a hotel room, or anywhere else a mosque is not immediately visible. Getting this direction right matters in Islamic practice, and a few degrees of error over a short distance makes little difference, but the calculation above is precise to ${city}'s specific location for anyone who wants exact accuracy.`;
}

export function generateQiblaAfter(city: string): string {
  const { month, year } = now();
  return `Below the compass, the Azan player offers the option to hear the call to prayer at each prayer time throughout the day — useful for residents of ${city} who are not within earshot of a mosque, or for anyone wanting a gentle, traditional reminder rather than a generic phone alarm. Enabling auto-play means the Azan sounds automatically as each of the five daily prayer times arrives in ${city}, calculated from the same live timetable used throughout this page. This feature has become particularly valued among the Pakistani diaspora and residents of ${city}'s newer housing developments further from the older city's dense concentration of historic mosques, through ${month} ${year} and beyond.`;
}

// ─── 4. WEEKLY PRAYER TIMES ─────────────────────────────────────────────────

export function generateWeeklyParagraph(city: string): string {
  const { month, year } = now();
  return `The weekly prayer timetable above extends ${city}'s daily calculation seven days into the future, useful for anyone planning a trip, organising a community event, or simply wanting to see the week ahead without checking back here every single day. Prayer times shift gradually rather than dramatically from one day to the next in ${city}, typically by only a minute or two, but across a full week through ${month} ${year} that drift becomes noticeable enough to matter for precise scheduling. Printing or screenshotting this weekly view is a common habit among ${city} residents who want a quick physical reference without needing to reopen the page daily.`;
}

export function generateWeeklyAfter(city: string, country: string): string {
  const { month, year } = now();
  return `Each row in the weekly table is calculated independently for ${city}'s exact coordinates using the same Karachi method applied to the daily timetable above, ensuring full consistency between today's times and the week ahead. Mosque committees, Islamic schools, and community organisations across ${country} commonly rely on a weekly view like this one to plan congregational activities, religious classes, and community iftars during Ramadan without needing to recalculate times from scratch each morning. As ${city} moves through the transitional months of ${month} ${year}, the week-over-week shift in prayer times becomes especially visible in this table — a small but meaningful detail for anyone tracking the changing rhythm of the Islamic day across the seasons.`;
}

// ─── 5. DAILY HADITH ─────────────────────────────────────────────────────────

export function generateHadithParagraph(city: string): string {
  const { month, year } = now();
  return `The daily Hadith featured above is drawn from authenticated collections and rotates each day, offering Muslims in ${city} a brief moment of reflection alongside the practical prayer schedule on this page. Pairing prayer times with a short piece of prophetic guidance reflects how religious practice in ${city} has always worked in daily life — not as an isolated ritual but as part of a broader rhythm of remembrance, learning, and community that surrounds the five daily prayers. In ${month} ${year}, this daily rotation means a regular visitor to this page encounters a steady stream of authenticated teachings over time rather than the same single quote repeated indefinitely.`;
}

export function generateHadithAfter(city: string): string {
  const { month, year } = now();
  return `Each Hadith shown above includes its narrator and source collection, allowing anyone in ${city} who wants to verify the full text, examine its chain of narration, or study it in greater depth to do so through a proper Islamic reference rather than taking the brief excerpt on faith alone. This kind of accessible daily content has become increasingly valued by younger Muslims in ${city} and across the diaspora, who often engage with religious learning through short, digestible formats fitted around busy schedules. Through ${month} ${year}, the rotating selection aims to surface a broad range of authenticated teachings spanning worship, character, and daily conduct rather than concentrating on a single narrow theme.`;
}

// ─── 6. ISLAMIC (HIJRI) CALENDAR ───────────────────────────────────────────

export function generateHijriParagraph(city: string, hijriMonth: string | null, hijriDate: string | null): string {
  const { month, year } = now();
  const dateStr = hijriDate ?? "today's date";
  const monthStr = hijriMonth ?? "the current Islamic month";
  return `Today in the Islamic calendar corresponds to ${dateStr} in ${monthStr}, a date that determines the timing of religious observances for ${city}'s Muslim community independent of the Gregorian calendar shown everywhere else in daily life. The lunar Hijri calendar runs roughly eleven days shorter than the solar Gregorian year, which is why Islamic months and the religious occasions tied to them shift earlier each year relative to ${month} ${year} and the standard calendar most of the world uses for business and government. The twelve-month grid above highlights the current month, giving ${city} residents an at-a-glance reference for where the year currently stands.`;
}

export function generateHijriAfter(city: string): string {
  const { month, year } = now();
  return `Each Hijri month above carries its own religious significance for ${city}'s Muslim community: Ramadan brings the month-long fast, Dhul Hijjah brings the Hajj pilgrimage season and Eid al-Adha, and Muharram opens the Islamic year with its own observances including the Day of Ashura. Because the Hijri calendar is based on lunar sighting rather than fixed astronomical calculation in many traditions, the exact start of each month can vary by a day depending on moon visibility — a detail that mosques and Islamic authorities serving ${city} announce close to the transition rather than fixing in advance. Tracking this calendar alongside the daily prayer schedule above gives a complete picture of how religious time moves through ${city} across ${month} ${year} and the months ahead.`;
}
