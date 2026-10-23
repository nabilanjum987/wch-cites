# Prayer Tables — data package notes (Round 3 / S5)

BUILD ONLY. These packages hold monthly prayer timetable DATA for the
published cities (Lahore, Karachi, Islamabad), the packaged Pakistan
cities (Multan, Faisalabad, Peshawar, Quetta, Rawalpindi, Hyderabad,
Sialkot, Gujranwala) and the S2 international cities. No public pages
or components read them yet; activation is gated.

## Source + generation
- Generated from the Aladhan calendar endpoint
  (`api.aladhan.com/v1/calendar/{year}/{month}?latitude=..&longitude=..&method=..`)
  — one call returns a full month; the annual endpoint
  (`/v1/calendar/{year}`) returns a full year per city in one call and
  is the regeneration path for future months.
- Coordinates: workspace canonical datasets (pakistan_cities.csv for
  Pakistan; the S2 city packages for international cities).
- Row format: `DD|Fajr|Sunrise|Dhuhr|Asr|Maghrib|Isha`, 24h local time.

## Methods per country (locally standard, Aladhan method IDs)
- Pakistan — method 1, University of Islamic Sciences, Karachi
  (the site standard since Batch 2).
- UAE — method 16 (Dubai / UAE official).
- Saudi Arabia — method 4, Umm al-Qura University, Makkah.
- Qatar — method 10 (Qatar).
- Türkiye — method 13, Diyanet.
- United Kingdom — method 3, Muslim World League (widely used in the
  UK; mosque-specific timetables may differ — stated, not hidden).
- USA / Canada — method 2, ISNA.
- Australia — method 3, Muslim World League (no single national
  Aladhan method exists; ANIC publishes its own calendar — a
  documented divergence to resolve at activation).

## Ramadan data hooks (documented, not built)
1. Ramadan month detection: Aladhan `gToH` / `hToG` date-conversion
   endpoints map a Gregorian month to its Hijri months; a timetable
   whose days fall in Hijri month 9 is the Ramadan table — no separate
   data model is needed, the same package shape carries it.
2. Ramadan regeneration: call `/v1/calendar/{hijriYear}/9` (the Hijri
   calendar endpoint) per city with the SAME method per country, and
   store under a `ramadan-{hijriYear}` key alongside the monthly keys.
3. Sehri/Iftar derivation: Fajr = Sehri end, Maghrib = Iftar — both
   are already columns in every row; no new fields are required.
4. Moon-sighting divergence: several countries announce Ramadan by
   local sighting, which can shift dates by a day versus the
   calculated calendar. Any Ramadan surface must label its dates
   "calculated (Aladhan)" until an official announcement source is
   wired — never present calculated dates as announced ones.
