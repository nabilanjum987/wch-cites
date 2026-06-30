# WorldCityHub — Phase 1 Complete Status & Handoff
## New chat: Read this entire file before touching any code.

---

## REPO & ACCESS
- GitHub: github.com/nabilanjum987/wch-cites (branch: main)
- Live: worldcityhub.vercel.app
- Token: ghp_XXXX_ADD_YOUR_TOKEN_HERE
- Test path: /pakistan/punjab/lahore
- Stack: Next.js 16 App Router, Tailwind, Supabase, Vercel

---

## MASTER DOCUMENT
File: WORLDCITYHUB_MASTER.md (in repo root)
This has ALL 20 page templates, all APIs, all paragraph functions,
URL structure, affiliate strategy, Supabase schema. Read it first.

---

## ARCHITECTURE RULES — NEVER BREAK

1. Homepage = static. All other pages = Supabase + API data + templates
2. Every section has 100-150 word SEO paragraph from src/lib/paragraphs/*.ts
3. NEVER replace existing generate*Paragraph() functions with inline text
4. Always use @/ imports — never relative paths like ../../lib/
5. Always read existing file from GitHub before editing
6. Always run npm run build locally before pushing
7. Flag color theming: Pakistan=#0C7A3D, India=#FF9933, Saudi=#006C35
8. Dark glassmorphism: bg=#0a0f1e, cards=rgba(255,255,255,0.04)
9. FlagSymbolBackground goes INSIDE the fixed inset-0 div
10. lucide-react version is 0.344.0 — all common icons work fine

---

## SUPABASE DATABASE
Schema: supabase/schema.sql (run this in Supabase SQL Editor)
Status: ✅ All 16 tables created, Pakistan seed data inserted
Tables: countries, provinces, cities, personalities, landmarks,
        heritage_products, wonders, oceans_seas, conflicts,
        horoscope_signs, national_teams, holidays, emergency_contacts,
        famous_foods, natural_resources, compare_pairs

Pakistan seeded: country row, Punjab/Sindh/KPK provinces, Lahore/Karachi/Islamabad cities,
8 personalities, 6 landmarks, 6 heritage products, 9 emergency contacts,
8 holidays, 6 foods, 6 resources, 3 national teams, 12 horoscope signs, 6 oceans

NOTE: Pages still use hardcoded data objects. Phase 2 = replace with Supabase fetches.

---

## PHASE 1 STATUS — 20 PAGE TEMPLATES

### ✅ FULLY DONE
| Page | File | Notes |
|------|------|-------|
| Homepage | src/app/page.tsx | All 21 sections, dark theme, SEO paragraphs |
| Pakistan Country | src/app/[country]/page.tsx | All 20 sections, dark theme, FlagSymbolBackground |
| Punjab Province | src/app/[country]/[province]/page.tsx | All 18 sections, dark theme, FlagSymbolBackground |

### ⚠️ BUILT BUT NEEDS TEMPLATE VERIFICATION (screenshots not reviewed)
| Page | Main File | Status |
|------|-----------|--------|
| Lahore City Main | src/app/[country]/[province]/[city]/page.tsx | Dark theme, FlagSymbolBackground added — VERIFY vs template |
| Weather | src/components/weather/WeatherPageClient.tsx | Dark theme applied — VERIFY all sections vs template |
| Prayer Times | src/app/[country]/[province]/[city]/prayer-times/page.tsx | FlagAuroraBackground, CountdownRing fixed, 10 sections added — VERIFY |
| Rates | src/components/rates/RatesPageClient.tsx | Dark theme, 5 sections added — VERIFY remaining |
| News | src/components/city/NewsPage.tsx | Dark theme applied — VERIFY sections |
| Economy | src/components/economy/EconomyPageClient.tsx | Dark theme only — VERIFY ALL sections vs template |
| Sports | src/app/[country]/[province]/[city]/sports/page.tsx | Dark theme only — VERIFY ALL sections vs template |
| Events | src/app/[country]/[province]/[city]/events/EventsPage.tsx | Dark theme only — VERIFY ALL sections vs template |
| Horoscope | src/app/horoscope/HoroscopePage.tsx | Dark theme only — VERIFY ALL sections vs template |

### ❌ NOT BUILT
| Page | Template File | Priority |
|------|--------------|----------|
| Personalities | PAGE_10_PERSONALITY.txt | HIGH |
| Famous Places | PAGE_11_FAMOUS_PLACE.txt | HIGH |
| Heritage Products | PAGE_12_HERITAGE.txt | HIGH |
| Wonders | PAGE_14_WONDERS.txt | MEDIUM |
| Compare | PAGE_15_COMPARE.txt | MEDIUM |
| Oceans | PAGE_16_OCEANS.txt | MEDIUM |
| Conflicts | PAGE_17_CONFLICTS.txt | MEDIUM |
| My Location | PAGE_18_MY_LOCATION.txt | MEDIUM |
| Countries Directory | /countries route | MEDIUM |

---

## FLAGSYMBOLBACKGROUND — HOW IT WORKS

Component: src/components/shared/FlagSymbolBackground.tsx
Purpose: Shows Pakistan crescent+star (or other country symbols) floating
         in the background, tracking mouse cursor and scroll with parallax.

CORRECT USAGE (must be inside fixed div):
```jsx
<div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
  <motion.div ... /> {/* aurora orb 1 */}
  <motion.div ... /> {/* aurora orb 2 */}
  <FlagSymbolBackground countrySlug={params?.country ?? 'pakistan'} />
</div>
```

WRONG (causes it not to show):
```jsx
<FlagSymbolBackground countrySlug="pakistan" /> {/* outside fixed div */}
```

Pages that correctly use it:
- Prayer times: via FlagAuroraBackground which includes it automatically
- Country page: inside fixed div ✅
- Province page: inside fixed div ✅
- City main: inside fixed div ✅

Country slug must match FLAG_SYMBOLS keys in FlagSymbolBackground.tsx:
pakistan, saudi-arabia, turkey, malaysia, india, china, japan,
united-states, united-kingdom, united-arab-emirates, egypt, _default

---

## PARAGRAPH FUNCTIONS — DO NOT REPLACE

### Country page (src/lib/paragraphs/country.ts)
generateFactsParagraph(country, capital)
generateFactsAfter(country)
generateLiveDataParagraph(country)
generateLiveDataAfter(country)
generateCitiesWeatherParagraph(country)
generateCitiesWeatherAfter(country)
generateProvincesParagraph(country)
generateProvincesAfter(country)
generatePersonalitiesParagraph(country)
generatePersonalitiesAfter(country)
generatePlacesParagraph(country)
generatePlacesAfter(country)
generateEconomyDashboardParagraph(country)
generateEconomyDashboardAfter(country)
generateTeamsParagraph(country)
generateTeamsAfter(country)
generateHolidaysParagraph(country)
generateHolidaysAfter(country)
generateEmergencyParagraph(country)
generateEmergencyAfter(country)

### Province page (src/lib/paragraphs/province.ts)
generateOverviewParagraph(province, country, capital)
generateOverviewAfter(province, country)
generateCitiesParagraph(province)
generateCitiesAfter(province)
generateWeatherParagraph(province)
generateWeatherAfter(province)
generateEconomyParagraph(province, country)
generateEconomyAfter(province, country)
generateIndustriesParagraph(province)
generateIndustriesAfter(province, country)
generateProductsParagraph(province)
generateProductsAfter(province)
generateLandmarksParagraph(province, capital)
generateLandmarksAfter(province, capital)
generateEmergencyParagraph(province, country)
generateEmergencyAfter(province, country)

### Prayer page (src/lib/paragraphs/prayer.ts)
generateNextPrayerParagraph(city, nextPrayer)
generateNextPrayerAfter(city, nextPrayer)
generatePrayerTableParagraph(city, fajr, isha)
generatePrayerTableAfter(city)
generateQiblaParagraph(city, distance, direction)
generateQiblaAfter(city)
generateWeeklyParagraph(city)
generateWeeklyAfter(city)
generateHadithParagraph(city)
generateHadithAfter(city)
generateHijriParagraph(city, hijriDate, event)
generateHijriAfter(city)

---

## WHAT THE NEW CHAT MUST DO — IN ORDER

### STEP 1: Verify these pages vs their templates (send screenshots to user)
For each page below:
1. Read the template from WORLDCITYHUB_MASTER.md
2. Read existing code from GitHub
3. List what is missing vs template
4. Add ALL missing sections
5. Build locally, verify passes, then push

Pages to verify in order:
1. Lahore City Main (/pakistan/punjab/lahore)
2. Weather (/pakistan/punjab/lahore/weather)
3. Prayer Times (/pakistan/punjab/lahore/prayer-times)
4. Rates (/pakistan/punjab/lahore/rates)
5. News (/pakistan/punjab/lahore/news)
6. Economy (/pakistan/punjab/lahore/economy)
7. Sports (/pakistan/punjab/lahore/sports)
8. Events (/pakistan/punjab/lahore/events)
9. Horoscope (/lahore/horoscope — also /horoscope global)

### STEP 2: Build missing pages from scratch
For each NOT BUILT page:
1. Read template from WORLDCITYHUB_MASTER.md
2. Check if route exists in src/app/
3. Build complete page with dark theme + FlagSymbolBackground where applicable
4. All sections from template
5. All paragraph functions
6. Build verify + push

Order: Personalities → Famous Places → Heritage Products → Compare → Oceans → Conflicts → My Location → Countries Directory → Wonders

### STEP 3: API wiring (do LAST after all pages structurally complete)
Add to Vercel environment variables:
- NEXT_PUBLIC_OPENWEATHER_KEY (openweathermap.org)
- NEXT_PUBLIC_METAL_KEY (goldapi.io)
- NEXT_PUBLIC_EXCHANGE_KEY (exchangerate-api.com)
- NEXT_PUBLIC_GNEWS_KEY (gnews.io)
- Aladhan API — no key needed (free unlimited)
- CoinGecko API — no key needed (free tier)

---

## KEY COMPONENT FILES

```
src/components/shared/
  FlagTheme.tsx          — FlagAuroraBackground, FlagCard, FlagGradientText, FlagPill
  FlagSymbolBackground.tsx — Crescent/star parallax per country
  AnimatedComponents.tsx — AuroraBackground, AnimatedCounter, ScrollAnimation
  SearchBar.tsx
  TickerBar.tsx
  Navbar.tsx

src/components/home/
  ExploreByReligion.tsx  — 7 faiths with background images ✅
  FeaturedCountries.tsx  — 12 countries + view all ✅
  WorldNewsSection.tsx   — regional news tabs ✅
  WorldWeatherExtremes.tsx — hottest/coldest/rainiest ✅
  AllFaithsToday.tsx     — 7 calendar systems ✅
  HeritageSpotlight.tsx  — monthly heritage feature ✅
  AboutAndFooter.tsx     — about + full footer ✅
  FeaturedCitiesGrid.tsx
  ExploreByContinent.tsx
  GlobalMarketSnapshot.tsx
  LivePrayerTimesStrip.tsx
  OceansToday.tsx
  FeaturedWonders.tsx
  LiveGlobalStats.tsx
  DidYouKnow.tsx

src/components/prayer/
  CountdownRing.tsx      — animated countdown (fixed ✅)
  QiblaCompass.tsx
  AzanPlayer.tsx
  WeeklyTable.tsx
  PrayerTable.tsx
  FaithTabs.tsx

src/components/weather/
  WeatherPageClient.tsx  — main weather page component

src/components/rates/
  RatesPageClient.tsx    — main rates page component

src/components/city/
  NewsPage.tsx           — main news page
  VideoNews.tsx
  NewsSearch.tsx
  SocialPulse.tsx
  EventsPage.tsx

src/components/economy/
  EconomyPageClient.tsx

src/lib/
  design/flagPalettes.ts — flag colors per country
  design-system.ts       — COLORS, STAGGER_CONTAINER
  supabase.ts            — Supabase client
  paragraphs/*.ts        — SEO paragraph generators
  apis/*.ts              — API fetcher functions
```

---

## DESIGN SYSTEM

Background: #0a0f1e
Card bg: rgba(255,255,255,0.04)
Card border: {accent}30
Pakistan accent: #0C7A3D
Section header pattern: colored bar + icon + title

Aurora orbs pattern (copy exactly):
```jsx
<div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
  <motion.div
    className="absolute top-20 right-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-10"
    style={{ backgroundColor: accent }}
    animate={{ y: [0, -40, 0] }}
    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
  <motion.div
    className="absolute bottom-40 left-1/4 w-72 h-72 rounded-full filter blur-3xl opacity-8"
    style={{ backgroundColor: accent }}
    animate={{ y: [0, 40, 0] }}
    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 5 }} />
  <FlagSymbolBackground countrySlug={countrySlug} />
</div>
```

---

## WHAT USER WANTS TO SEE

1. Each page exactly matches its template — every section present
2. Pakistan crescent+star visible floating in background on all Pakistan pages
3. Dark theme consistent across ALL pages (not just some)
4. When cursor moves, crescent+star follows smoothly
5. Colors match Pakistan flag on Pakistan pages, India flag on India pages etc
6. SEO paragraphs (100-150 words) on EVERY section of EVERY page
7. No errors on Vercel build

The user will do a final review of all pages and make adjustments.
Do NOT change pages the user has not asked about.
When user says "continue" — do the next item in the list above.
Always build locally first. Always verify before pushing.
