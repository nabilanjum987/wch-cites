# WorldCityHub — Master Blueprint
## The Complete System: 20 Page Types → 5 Million Pages

> **Architecture Rule:** Homepage = static. All other pages = Supabase data + API data fed into templates.
> Every template variable in `{curly_braces}` maps to a Supabase column or live API value.

---

## ARCHITECTURE OVERVIEW

```
HOMEPAGE (static)
    ↓
COUNTRY PAGE → /pakistan
    ↓
PROVINCE PAGE → /pakistan/punjab
    ↓
CITY MAIN PAGE → /pakistan/punjab/lahore
    ↓
CITY SUB-PAGES → /pakistan/punjab/lahore/weather
                 /pakistan/punjab/lahore/prayer-times
                 /pakistan/punjab/lahore/rates
                 /pakistan/punjab/lahore/news
                 /pakistan/punjab/lahore/events
                 /pakistan/punjab/lahore/economy
                 /pakistan/punjab/lahore/sports
                 /pakistan/punjab/lahore/horoscope
                 /pakistan/punjab/lahore/personalities
                 /pakistan/punjab/lahore/places
                 /pakistan/punjab/lahore/heritage-products
                 /pakistan/punjab/lahore/wonders

STANDALONE PAGES (global)
    /compare
    /compare/lahore-vs-karachi
    /oceans
    /oceans/arabian-sea
    /conflicts
    /conflicts/ukraine-russia
    /my-location
    /wonders
    /wonders/taj-mahal
    /horoscope
    /horoscope/aries
```

### Page Count at Scale
| Level | Count |
|-------|-------|
| Countries | 195 |
| Provinces/States | ~3,500 |
| Cities | 10,247 |
| City sub-pages (×12) | ~123,000 |
| Famous places | ~50,000 |
| Heritage products | ~30,000 |
| Wonders | 500+ |
| Compare pairs | Millions |
| Horoscope (×12×365) | ~4,380/year |
| **Total** | **~5 Million+** |

---

## DATA SOURCES — ALL FREE

| Data Type | API | Free Tier | Used On |
|-----------|-----|-----------|---------|
| Current weather | OpenWeatherMap | 1M calls/month | All pages |
| 7-day forecast | OpenWeatherMap | Included | Weather page |
| Air quality (AQI) | OpenAQ | Unlimited | Weather, City |
| Prayer times | Aladhan API | Unlimited | Prayer, City, Country |
| Gold/Silver/Platinum | MetalPriceAPI | 100 calls/day | Rates, Ticker |
| Currency exchange | ExchangeRate-API | 1,500 calls/month | Rates, Country |
| Cryptocurrency | CoinGecko | 100 calls/min | Rates, Ticker |
| Oil prices | EIA API | Unlimited | Rates, Ticker |
| Fuel prices | GlobalPetrolPrices | Scrape weekly | Rates, Country |
| News | GNews API | 100 calls/day | News, City, Country |
| News RSS | Google News RSS | Unlimited | News, Events |
| Wikipedia facts | Wikipedia REST API | Unlimited | All pages |
| Wikidata products | Wikidata API | Unlimited | Heritage, Places |
| GDP/Population history | World Bank API | Unlimited | Economy, Country |
| UN data | UN Data API | Unlimited | Economy |
| Reverse geocode | Nominatim (OSM) | Unlimited | My Location |
| Maps | Leaflet + OpenStreetMap | Unlimited | All maps |
| Ocean/wave data | Open-Meteo Marine | Unlimited | Oceans |
| Sunrise/sunset | Sunrise-Sunset API | Unlimited | Weather, Time |
| Moon phase | FarmSense / Astro API | Free | Horoscope, Time |
| Horoscope | Aztro API | Unlimited | Horoscope |
| Sports scores | TheSportsDB | Unlimited | Sports |
| Cricket live | CricAPI | 100 calls/day | Sports |
| Conflict data | ACLED API | Free academic | Conflicts |
| Peace index | IEP (static annual) | Free | Conflicts |
| Hebrew calendar | Hebcal API | Unlimited | Faith, Horoscope |
| Chinese calendar | Library (npm) | Free | Horoscope |
| Vedic calendar | VedicCalendar lib | Free | Horoscope |
| Emergency numbers | EmergencyNumberAPI | Free | Emergency |
| Coordinates/timezone | GeoNames | 30,000/day | City data |

---

## SUPABASE DATABASE SCHEMA

### Table: `countries`
```sql
CREATE TABLE countries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,         -- 'pakistan'
  name            TEXT NOT NULL,                -- 'Pakistan'
  code            TEXT NOT NULL,                -- 'PK'
  flag            TEXT,                         -- '🇵🇰'
  region          TEXT,                         -- 'South Asia'
  continent       TEXT,                         -- 'Asia'
  population      BIGINT,                       -- 231402117
  area            INTEGER,                      -- 881913 (km²)
  capital         TEXT,                         -- 'Islamabad'
  currency_name   TEXT,                         -- 'Pakistani Rupee'
  currency_code   TEXT,                         -- 'PKR'
  languages       TEXT[],                       -- ['Urdu','English',...]
  government      TEXT,                         -- 'Federal Parliamentary Republic'
  timezone        TEXT,                         -- 'PKT (UTC+5)'
  utc_offset      TEXT,                         -- '+05:00'
  independence    TEXT,                         -- 'August 14, 1947'
  climate         TEXT,                         -- 'Varies — Desert to Alpine'
  major_faith     TEXT,                         -- 'Islam'
  major_faith_pct NUMERIC,                      -- 96
  gdp             TEXT,                         -- '$376B'
  gdp_raw         BIGINT,                       -- 376000000000
  growth_rate     TEXT,                         -- '5.7%'
  inflation       TEXT,                         -- '28.2%'
  unemployment    TEXT,                         -- '6.2%'
  exports         TEXT[],                       -- ['Textiles → USA','Rice → ME']
  hero_image      TEXT,                         -- Pexels URL
  tagline         TEXT,                         -- 'Land of ancient civilisations...'
  primary_color   TEXT,                         -- '#0C7A3D'
  secondary_color TEXT,                         -- '#FFFFFF'
  lat             NUMERIC,                      -- 30.3753
  lng             NUMERIC,                      -- 69.3451
  literacy_rate   NUMERIC,                      -- 62.3
  hdi             NUMERIC,                      -- 0.544
  internet_pct    NUMERIC,                      -- 36.0
  mobile_pct      NUMERIC,                      -- 79.0
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `provinces`
```sql
CREATE TABLE provinces (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 TEXT NOT NULL,            -- 'punjab'
  country_slug         TEXT NOT NULL REFERENCES countries(slug),
  name                 TEXT NOT NULL,            -- 'Punjab'
  capital              TEXT,                     -- 'Lahore'
  population           BIGINT,                   -- 110012442
  area                 INTEGER,                  -- 205344 (km²)
  tagline              TEXT,                     -- 'Most populous province'
  known_for            TEXT,                     -- 'Agriculture, Industry, Culture'
  gdp_contribution_pct NUMERIC,                  -- 54.0
  literacy_rate        NUMERIC,                  -- 64.0
  climate              TEXT,                     -- 'Semi-arid'
  major_faith          TEXT,                     -- 'Islam'
  major_faith_pct      NUMERIC,                  -- 97.0
  hero_image           TEXT,
  primary_color        TEXT,                     -- inherits from country
  lat                  NUMERIC,
  lng                  NUMERIC,
  divisions            JSONB,                    -- [{name, slug, districts:[]}]
  industries           TEXT[],                   -- ['Textiles','Agriculture']
  natural_resources    TEXT[],                   -- ['Fertile land','Salt']
  universities         INTEGER,                  -- 200
  established          TEXT,                     -- '1970 (modern province)'
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slug, country_slug)
);
```

### Table: `cities`
```sql
CREATE TABLE cities (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT NOT NULL,               -- 'lahore'
  province_slug     TEXT NOT NULL,               -- 'punjab'
  country_slug      TEXT NOT NULL,               -- 'pakistan'
  name              TEXT NOT NULL,               -- 'Lahore'
  name_local        TEXT,                        -- 'لاہور'
  city_type         TEXT,                        -- 'Provincial Capital'
  population        BIGINT,                      -- 14000000
  area              INTEGER,                     -- 1772 (km²)
  elevation         INTEGER,                     -- 217 (meters)
  lat               NUMERIC NOT NULL,            -- 31.5497
  lng               NUMERIC NOT NULL,            -- 74.3436
  timezone          TEXT,                        -- 'Asia/Karachi'
  utc_offset        TEXT,                        -- '+05:00'
  founded_year      INTEGER,                     -- 1000
  climate_type      TEXT,                        -- 'Semi-arid'
  major_faith       TEXT,                        -- 'Islam'
  major_faith_pct   NUMERIC,                     -- 94.0
  languages         TEXT[],                      -- ['Punjabi','Urdu']
  currency_code     TEXT,                        -- 'PKR'
  mayor             TEXT,
  sister_cities     TEXT[],                      -- ['Lahore relations']
  famous_bazaar     TEXT,                        -- 'Anarkali Bazaar'
  mosque_count      INTEGER,                     -- 2000
  unesco_sites      INTEGER,                     -- 3
  annual_tourists   INTEGER,                     -- 2000000
  hero_image        TEXT,
  tagline           TEXT,                        -- 'Heart of Pakistan'
  primary_color     TEXT,                        -- from country
  nearby_water      TEXT,                        -- 'Ravi River'
  gdp_contribution  TEXT,                        -- '13% of Pakistan GDP'
  main_industries   TEXT[],                      -- ['Textiles','IT']
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slug, province_slug, country_slug)
);
```

### Table: `personalities`
```sql
CREATE TABLE personalities (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  profession   TEXT,
  category     TEXT,                -- 'Leaders'|'Sports'|'Arts'|'Science'
  country_slug TEXT REFERENCES countries(slug),
  province_slug TEXT,
  city_slug    TEXT,
  birth_year   INTEGER,
  death_year   INTEGER,
  birth_city   TEXT,
  nationality  TEXT,
  achievements TEXT,
  photo_url    TEXT,
  wikipedia_url TEXT,
  featured_month INTEGER,          -- 1-12, rotate monthly
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `landmarks`
```sql
CREATE TABLE landmarks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  type          TEXT,              -- 'Mosque'|'Fort'|'Museum'|'Natural'
  city_slug     TEXT,
  province_slug TEXT,
  country_slug  TEXT REFERENCES countries(slug),
  lat           NUMERIC,
  lng           NUMERIC,
  era           TEXT,              -- 'Mughal 1673'
  built_by      TEXT,
  built_for     TEXT,
  material      TEXT,
  capacity      INTEGER,
  annual_visitors INTEGER,
  unesco        BOOLEAN DEFAULT false,
  wonder_type   TEXT,              -- 'New7'|'Ancient'|'Natural'|'Islamic'
  open_time     TEXT,              -- 'Sunrise'
  close_time    TEXT,              -- 'Sunset'
  entry_fee     TEXT,
  closed_days   TEXT[],
  hero_image    TEXT,
  wikipedia_url TEXT,
  visitor_rating NUMERIC,
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `heritage_products`
```sql
CREATE TABLE heritage_products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  city_slug     TEXT,
  province_slug TEXT,
  country_slug  TEXT REFERENCES countries(slug),
  craft_age     TEXT,              -- '400+ years'
  artisans      INTEGER,           -- 15000
  export_value  TEXT,              -- 'PKR 2 Billion/year'
  exports_to    TEXT[],            -- ['USA','UK','UAE']
  unique_quality TEXT,
  materials     TEXT,
  process       TEXT,
  unesco_status TEXT,
  hero_image    TEXT,
  emoji         TEXT,              -- '🏺'
  category      TEXT,              -- 'Textile'|'Pottery'|'Leather'
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `wonders`
```sql
CREATE TABLE wonders (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT UNIQUE NOT NULL,
  name           TEXT NOT NULL,
  wonder_type    TEXT NOT NULL,    -- 'New7'|'Ancient'|'Natural'|'Islamic'|'UNESCO'
  city_slug      TEXT,
  country_slug   TEXT REFERENCES countries(slug),
  lat            NUMERIC,
  lng            NUMERIC,
  built_year     TEXT,
  built_by       TEXT,
  built_for      TEXT,
  material       TEXT,
  height_m       NUMERIC,
  area_km2       NUMERIC,
  annual_visitors INTEGER,
  entry_fee      TEXT,
  open_time      TEXT,
  close_time     TEXT,
  closed_days    TEXT[],
  best_visit_time TEXT,
  photography_tip TEXT,
  hero_image     TEXT,
  wikipedia_url  TEXT,
  description    TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `oceans_seas`
```sql
CREATE TABLE oceans_seas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  type            TEXT,            -- 'Ocean'|'Sea'|'Gulf'|'Bay'|'Strait'
  parent_ocean    TEXT,
  area_km2        BIGINT,
  max_depth_m     INTEGER,
  avg_temp_c      NUMERIC,
  bordering_countries TEXT[],
  major_ports     TEXT[],
  shipping_routes TEXT[],
  marine_species  INTEGER,
  economic_value  TEXT,
  lat_center      NUMERIC,
  lng_center      NUMERIC,
  hero_image      TEXT,
  description     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `conflicts`
```sql
CREATE TABLE conflicts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  name             TEXT NOT NULL,
  status           TEXT,           -- 'Active'|'Ceasefire'|'Resolved'
  started_year     INTEGER,
  ended_year       INTEGER,
  countries_involved TEXT[],
  cities_affected  TEXT[],
  displaced_people INTEGER,
  casualties_estimate TEXT,
  peace_efforts    TEXT,
  source_url       TEXT,
  hero_image       TEXT,
  summary          TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `horoscope_signs`
```sql
CREATE TABLE horoscope_signs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,  -- 'aries'
  name         TEXT NOT NULL,
  tradition    TEXT,                  -- 'western'|'chinese'|'vedic'
  symbol       TEXT,                  -- '♈'
  emoji        TEXT,                  -- '🐏'
  date_range   TEXT,                  -- 'March 21 - April 19'
  element      TEXT,                  -- 'Fire'
  ruling_planet TEXT,                 -- 'Mars'
  lucky_color  TEXT,
  lucky_number INTEGER,
  traits       TEXT[],
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `national_teams`
```sql
CREATE TABLE national_teams (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,
  country_slug TEXT REFERENCES countries(slug),
  sport        TEXT NOT NULL,
  team_name    TEXT NOT NULL,
  current_ranking TEXT,
  coach        TEXT,
  captain      TEXT,
  achievements TEXT[],
  next_match   JSONB,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `holidays`
```sql
CREATE TABLE holidays (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_slug TEXT REFERENCES countries(slug),
  province_slug TEXT,
  name         TEXT NOT NULL,
  date_fixed   TEXT,               -- 'August 14' or NULL if varies
  date_type    TEXT,               -- 'Fixed'|'Islamic'|'Hindu'|'Lunar'
  holiday_type TEXT,               -- 'National'|'Religious'|'Provincial'
  significance TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `emergency_contacts`
```sql
CREATE TABLE emergency_contacts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_slug  TEXT REFERENCES countries(slug),
  province_slug TEXT,
  city_slug     TEXT,
  service       TEXT NOT NULL,     -- 'Police'|'Ambulance'|'Fire'
  number        TEXT NOT NULL,     -- '15'
  color         TEXT,              -- '#dc2626'
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `famous_foods`
```sql
CREATE TABLE famous_foods (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  country_slug  TEXT REFERENCES countries(slug),
  province_slug TEXT,
  city_slug     TEXT,
  emoji         TEXT,
  origin        TEXT,
  description   TEXT,
  meal_type     TEXT,              -- 'Breakfast'|'Lunch'|'Dinner'|'Street'|'Sweet'
  ingredients   TEXT[],
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `natural_resources`
```sql
CREATE TABLE natural_resources (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_slug  TEXT REFERENCES countries(slug),
  province_slug TEXT,
  name          TEXT NOT NULL,
  emoji         TEXT,
  rank          TEXT,              -- 'World top 20'
  description   TEXT,
  quantity      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `compare_pairs` (pre-generated popular pairs)
```sql
CREATE TABLE compare_pairs (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city1_slug TEXT NOT NULL,
  city2_slug TEXT NOT NULL,
  searches_monthly INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city1_slug, city2_slug)
);
```

---

## PAGE TEMPLATES — ALL 20

---

### PAGE 1 — CITY MAIN PAGE
**URL:** `/{country}/{province}/{city}`
**SEO Target:** "{city} city guide", "{city} information today", "{city} facts 2025"
**Word Count Target:** 3,000–3,500 words (20 sections × ~150 words)

#### Sections & Template Paragraphs

**SECTION 1 — Ticker Bar** *(No paragraph — data only)*
```
Live: Gold {gold_price} {gold_change} | BTC {btc_price} | 
{city} {temp}°C | Next Prayer {next_prayer_name} in {next_prayer_countdown}
```

**SECTION 2 — Local Time & Cosmos**
Template:
> "{city} is currently observing {timezone_name} time, sitting {utc_offset} from Coordinated Universal Time. Located at coordinates {lat}°N {lng}°E, {city} experiences {daylight_hours} hours of daylight today. The sun rose at {sunrise} this morning and will set at {sunset} this evening. Tonight the moon is in its {moon_phase} phase, appearing {moon_percent}% illuminated in the {moon_direction} sky. {city} is {time_diff_london} hours {ahead_behind} London, {time_diff_ny} hours {ahead_behind_ny} New York, and {time_diff_dubai} hours {ahead_behind_dubai} Dubai."

Calendar of All Faiths:
- ☪️ Islamic (Hijri): `{hijri_date}`
- ✝️ Christian (Gregorian): `{gregorian_date}`
- ✡️ Hebrew: `{hebrew_date}`
- 🕉️ Hindu (Panchang): `{hindu_date}`
- ☸️ Buddhist: `{buddhist_year} BE`
- 🪯 Sikh (Nanakshahi): `{nanakshahi_date}`

**SECTION 3 — Weather Today**
Template:
> "{city} is experiencing {condition} weather today with a current temperature of {temp}°C, feeling like {feels_like}°C due to {humidity}% humidity and winds from the {wind_direction} at {wind_speed} km/h. Today's high will reach {max_temp}°C while the overnight low will drop to {min_temp}°C. {city} has a {climate_type} climate with {hottest_month} being the hottest month averaging {hot_avg}°C and {coldest_month} the coldest at {cold_avg}°C. The city receives approximately {annual_rain}mm of annual rainfall. UV index today is {uv_index} — {uv_advice}. Visibility is {visibility}km."

What to Wear Today:
- 🌅 Morning `{morning_temp}°C`: [{morning_outfit}]
- ☀️ Afternoon `{afternoon_temp}°C`: [{afternoon_outfit}]
- 🌙 Evening `{evening_temp}°C`: [{evening_outfit}]

**SECTION 4 — Sun & Moon Arc**
Template:
> "The sun rises over {city} at {sunrise} today and sets at {sunset}, providing {day_length} of daylight. Golden hour for photographers begins at {golden_hour} this evening, offering {golden_minutes} minutes of perfect natural light over {city_landmark}. Civil twilight ends at {twilight} tonight. The moon is currently in its {moon_phase} phase with {moon_percent}% illumination, rising at {moonrise} and setting at {moonset}. {constellation} constellation is visible tonight from {city} in the {direction} sky after {best_viewing_time}."

**SECTION 5 — Faith & Spiritual Times**
Template:
> "{city} has a {major_faith} majority population of {faith_pct}%, making it one of {country}'s most significant {major_faith} centers. The city follows the {calculation_method} prayer calculation method. Today {city} has {daylight_hours} hours of daylight, with Fajr at {fajr} and Isha at {isha}. {city} is home to {mosque_count} mosques including the famous {famous_mosque}. The city's {minority_faith1} community of {minority_pct1}% worship at {minority_place1}."

Faith tabs: [Islam] [Christianity] [Hinduism] [Judaism] [Buddhism] [Sikhism]
Next prayer countdown (majority faith)
All 5 prayer times with status

**SECTION 6 — News ("City Today")**
Template:
> "Staying informed about {city} means tracking events at three levels simultaneously — global developments that directly affect {city}'s economy and society, national news from {country} that shapes provincial policy, and the specific local stories that define daily life in {city} right now. The headlines below span finance, politics, sports, entertainment, and community affairs, drawn from established local and national news sources. This curated selection changes throughout the day as stories break."

Structure:
- 🌍 Global news affecting {city} (2 items)
- 🏳️ National news from {country} (3 items)
- 🏙️ Local {city} news: Sports + Finance + Entertainment + Religion + Government (5 items)

**SECTION 7 — Gold & Rates**
Template:
> "Gold prices in {country} today stand at {currency} {gold_24k}/gram for 24 karat gold, {up_down} {gold_change}% from yesterday. Over the last 30 days gold has {risen_fallen} {monthly_change}% in {country}. {city} is one of {country}'s major gold trading centres with {bazaar_name} being the most active gold market. {investment_insight}."

Rates shown:
- Precious metals: Gold 24K/22K/18K, Silver, Platinum
- Currency: USD, EUR, GBP, SAR, AED, CNY vs local
- Fuel: Petrol, Diesel, CNG
- Crypto: BTC, ETH, BNB, SOL, XRP

**SECTION 8 — Events**
Template:
> "{city} hosts events at four levels — global and international events happening in the city, national events whose effects are felt here, provincial events specific to {province}, and purely local {city} happenings. The calendar below covers all four categories for this month and the weeks ahead, spanning cultural festivals, sports fixtures, religious observances, business expos, and community celebrations."

Tabs: [International] [National] [Provincial] [Local {city}]

**SECTION 9 — Famous Personalities (Monthly rotation)**
Template:
> "{city} has produced individuals who shaped not just {country} but the world — scientists, athletes, artists, leaders, and visionaries who carried {city}'s name to global recognition. This month's featured personalities represent the breadth of {city}'s contribution to human achievement, selected from leaders, sports champions, entertainment icons, and scientific pioneers. The full list of {city}'s notable sons and daughters is available on the Personalities page."

Categories: [Leaders] [Sports] [Arts & Entertainment] [Science & Tech]
Show 4 featured, link to full page

**SECTION 10 — Famous Places**
Template:
> "{city} is home to {places_count} major historical and cultural sites, attracting {tourist_count} visitors annually. The city has {unesco_count} UNESCO World Heritage Sites, making it one of {country}'s most historically significant cities. This month we are featuring {place1_name}, {place2_name} and {place3_name} — each representing a different era of {city}'s remarkable {city_age}-year history."

Show 4–6 places, link to dedicated place pages

**SECTION 11 — Heritage Products (Carousel)**
Template:
> "{city} has been producing {product1} for over {product1_age} years, making it one of the world's most recognised centres for this craft. The {product1} industry employs approximately {product1_workers} artisans in {city} alone and generates {product1_export_value} in annual exports. {city}'s {product2} is equally famous, recognised globally for its {product2_unique_quality}."

Carousel of 8–10 products, each links to heritage product page

**SECTION 12 — Economy Snapshot**
Template:
> "{city} contributes {gdp_percent}% to {country}'s total GDP, generating approximately ${gdp_value} billion annually. The city's economy is primarily driven by {industry1}, {industry2} and {industry3}. With a workforce of {workforce} people, {city} is {country}'s {rank} largest economic centre. Exports from {city} reached ${export_value} billion in {year}, with {top_export} being the leading export product."

Dashboard: GDP contribution %, main industries, workforce, top exports

**SECTION 13 — Natural Resources**
Template:
> "{city}/{region} sits on significant natural deposits that contribute to {country}'s resource wealth. The region is known for {resource1}, {resource2} and {resource3}. {resource1} deposits in this region are estimated at {quantity}, making it {rank} in {country/world}. These resources contribute approximately {contribution}% to the regional economy annually."

**SECTION 14 — City at a Glance**
Template:
> "{city} covers an area of {area} km², home to a population of {population} people as of {year}, with a population density of {density}/km². The city was founded approximately {founded_year} years ago and sits at an elevation of {elevation} metres above sea level. The primary language spoken is {language1} alongside {language2}. The city's sister cities include {sister_city1} and {sister_city2}, reflecting its international connections."

Stats: Population, Area, Elevation, Founded, Language, Mayor, Timezone, Sister Cities, Nearest Airport, Nearest Water Body

**SECTION 15 — Nearby Cities**
Template:
> "Exploring beyond {city} opens connections to some of {province}'s most interesting urban centres, each with its own distinct character. {nearby1} lies {distance1}km to the {direction1}, known for {nearby1_fame}. {nearby2} is {distance2}km {direction2}, famous for {nearby2_fame}. These nearby cities are all accessible as day trips from {city} and each has its own full city page on WorldCityHub."

**SECTION 16 — Street Foods**
Template:
> "The streets of {city} offer one of {country}'s most celebrated food experiences, with vendors and small restaurants serving dishes that have been refined over generations. {street_food1} is arguably {city}'s most iconic street food, sold from stalls across the old city since {street_food1_era}. {street_food2} and {street_food3} round out the essential {city} street food experience that no visit to the city is complete without."

**SECTION 17 — Sports**
Template:
> "{city} beats to the rhythm of {primary_sport}. The city is home to {team_name}, currently ranked {ranking} in {competition}, playing their home matches at {stadium_name} which holds {stadium_capacity} spectators. The next home fixture is on {next_match_date} against {next_opponent}. {city} has produced {famous_athlete_count} internationally recognised athletes, with {most_famous_athlete} being the most celebrated."

**SECTION 18 — Emergency Contacts**
Template:
> "These emergency contact numbers cover police, medical services, fire response, and specialist helplines across {city} and the wider {province} province. Whether you are a resident, a traveller, or someone newly arrived in the city, these numbers connect you directly to the relevant national emergency response service. Some numbers may vary slightly between neighbourhoods."

Numbers: Police, Ambulance, Fire, Rescue, Women Helpline, Child Helpline, Disaster

**SECTION 19 — Multi-Faith Calendar**
Template:
> "Today in {city}, multiple calendar systems run simultaneously, each marking a different date for different communities. The {major_faith} community observes {hijri_date} in the Hijri calendar. {city}'s Christian residents mark {gregorian_date} in the Gregorian calendar. The Hindu Panchang shows {hindu_date}. Jewish residents follow the Hebrew calendar showing {hebrew_date}. This side-by-side view reflects {city}'s position as a city where multiple faith traditions coexist."

**SECTION 20 — Explore Links Strip**
Quick navigation: [Weather] [Prayer Times] [Rates] [News] [Events] [Personalities] [Places] [Heritage] [Economy] [Sports] [Horoscope] [Compare]

---

### PAGE 2 — COUNTRY PAGE
**URL:** `/{country}`
**Word Count Target:** 3,000–3,500 words

#### Sections
1. Hero image (full-width landscape)
2. Country at a Glance (10 info cards)
3. Live data strip (currency rate, GDP, inflation, next prayer)
4. Major Cities Weather (6 city cards)
5. Faith & Spiritual (religion bars + multi-faith calendar)
6. Market Rates (gold, silver, currencies, fuel)
7. News ("Country Today")
8. Explore by Province (province cards)
9. Economy Dashboard (GDP, growth, inflation, unemployment + exports)
10. Growth Dashboard (World Bank charts — GDP/Population/Exports 10yr)
11. Famous Personalities (category tabs, 8 people)
12. Famous Places (6 landmark cards)
13. Heritage Products (carousel)
14. Natural Resources (6 resource cards)
15. National Teams (3 sports)
16. Famous Foods (6 dishes)
17. Holidays & Events (tabs)
18. Emergency Contacts
19. Neighbouring Countries
20. Explore links strip

#### Template Paragraphs (per section)
Each section uses `generateXxxParagraph(country_name, ...variables)` from `src/lib/paragraphs/country.ts`

Variables fed from Supabase `countries` table + live APIs.

---

### PAGE 3 — PROVINCE PAGE
**URL:** `/{country}/{province}`
**Word Count Target:** 2,700–3,000 words

#### Sections
1. Hero image
2. Province at a Glance (10 cards)
3. Live data strip
4. Major Cities Weather (6 cards)
5. Explore by Division (division grid)
6. Major Cities directory
7. Faith & Spiritual
8. Market Rates (same as country)
9. Growth Dashboard (provincial GDP, population 10yr)
10. Cost of Living comparison table (cities within province)
11. News (provincial + city)
12. Events (provincial + city)
13. Famous Personalities (provincial born)
14. Famous Places (provincial landmarks)
15. Heritage Products (province-specific)
16. Economy (province contribution %)
17. Natural Resources
18. Famous Foods (province-specific dishes)
19. Emergency Contacts
20. Other provinces strip
21. Explore links

#### Province Template Paragraph — At a Glance
> "{province} is {country}'s {rank} most populous province, home to {population} people — approximately {country_pct}% of {country}'s entire population — across an area of {area}km². {province} produces {key_product_pct}% of the nation's {key_product}, earning it the title of {country}'s {nickname}. The province contributes approximately {gdp_pct}% of {country}'s total GDP, anchored by its industrial base in {city1}, {city2} and {city3}. {province}'s literacy rate of {literacy_rate}% is {literacy_rank} among {country}'s provinces, supported by {universities} universities and degree-awarding institutions."

---

### PAGE 4 — HOMEPAGE
**URL:** `/`
**Type:** Static — written once, never changes per user
**Word Count:** ~2,000 words total across all sections

#### Sections (static)
1. Hero ("Every City. Every Culture. Every Day.") + Search + My Location button
2. Stats bar (10,247 Cities | 195 Countries | 7 Faiths | 24/7 Updates)
3. Live Ticker
4. SEO Intro paragraph (150 words — static)
5. Global Insights (4 live stats cards)
6. Featured Cities Grid (12 city cards)
7. Prayer Times Around the World (tab strip)
8. Global Market Snapshot (Gold, BTC, Oil + currencies)
9. World Wonders (featured carousel)
10. Explore by Continent (8 cards)
11. Countries of the World (12 featured + view all 195)
12. Explore by Faith (7 religion cards with background images)
13. World News by Region (tabs + 6 cards)
14. World Weather Today (hottest/coldest/rainiest)
15. Oceans Today
16. Active Conflicts widget
17. All Faiths Today (7 calendar systems)
18. Did You Know (rotating fact)
19. Heritage Spotlight
20. About WorldCityHub
21. Footer

---

### PAGE 5 — WEATHER PAGE
**URL:** `/{country}/{province}/{city}/weather`
**Word Count Target:** 3,000+ words

#### Sections
1. Current conditions (temp, feels-like, humidity, wind, UV, pressure, visibility, dew point)
2. Weather story paragraph ("Lahore greets you with...")
3. What to Wear Today (morning/afternoon/evening visual)
4. Animated sun arc (sunrise to sunset with current position)
5. Moon phase visual
6. 24-hour hourly forecast
7. 7-day forecast
8. 10-day forecast
9. Air Quality (AQI, PM2.5, PM10, NO2, O3, CO, SO2)
10. Air Purification Guide
11. Rain data (today/week/annual chart)
12. Weather alerts
13. Monthly climate guide (best time to visit)
14. Historical records / "this date in history"
15. Compare with other cities
16. Nearest water body temperature
17. Astronomy (constellation visible tonight, upcoming eclipses)
18. Affiliate: Travel gear, air purifiers

#### Weather Template Paragraph
> "{city} is experiencing {condition} weather today with a current temperature of {temp}°C, feeling like {feels_like}°C due to {humidity}% humidity and winds from the {wind_direction} at {wind_speed} km/h. Today's high will reach {max_temp}°C while the overnight low drops to {min_temp}°C. {city} has a {climate_type} climate with {hottest_month} being the hottest month averaging {hot_avg}°C and {coldest_month} the coldest at {cold_avg}°C. The city receives approximately {annual_rain}mm of annual rainfall, mostly concentrated in {rain_season}. UV index today is {uv_index} — {uv_advice}. Visibility is {visibility}km with atmospheric pressure at {pressure}hPa."

**APIs:** OpenWeatherMap, OpenAQ, Open-Meteo, Sunrise-Sunset API

---

### PAGE 6 — PRAYER TIMES PAGE
**URL:** `/{country}/{province}/{city}/prayer-times`
**Word Count Target:** 2,500+ words

#### Sections
1. Faith tabs (Islam / Christianity / Hinduism / Judaism / Buddhism / Sikhism)
2. Large animated countdown to next prayer
3. All 5 prayer times (Fajr/Dhuhr/Asr/Maghrib/Isha) with passed/upcoming status
4. Optional prayers (Tahajjud/Ishraq/Dhuha/Chasht)
5. Animated Qibla compass (rotates with device, shows distance to Mecca)
6. Browser notification reminders
7. Weekly prayer timetable
8. Full month timetable
9. Downloadable PDFs (monthly + annual)
10. Islamic calendar (important dates + countdowns)
11. Ramadan Sehri/Iftar times (when applicable)
12. Jumua special display on Fridays
13. Hijri/Gregorian dual display
14. Prayer times comparison with other cities
15. Nearby mosques
16. Multi-faith section (church times / puja times / shabbat times)
17. Affiliates: Duolingo Arabic, Islamic books, prayer mats

#### Prayer Template Paragraph
> "{city} has a {major_faith} population of {faith_pct}%, making it one of {country}'s {faith_rank} most significant Islamic centres. The city follows the {calculation_method} prayer calculation method. Today {city} has {daylight_hours} hours of daylight, with Fajr at {fajr} and Isha at {isha}. {city} is home to {mosque_count} mosques including the famous {famous_mosque}. The distance from {city} to Mecca is {mecca_distance}km in the {qibla_direction} direction."

**APIs:** Aladhan API, Hebcal API, device compass for Qibla

---

### PAGE 7 — RATES PAGE
**URL:** `/{country}/{province}/{city}/rates` (also `/rates` global, `/{country}/rates`)
**Word Count Target:** 2,500+ words

#### Sections
**World Level (/rates):** International rates in USD
**Country Level (/{country}/rates):** Convert to local currency + country-specific
**City Level:** Same + city bazaar context

1. Precious metals (Gold 24K/22K/18K, Silver, Platinum, Palladium) + 30-day chart
2. Currency exchange (8 major pairs vs local)
3. Fuel prices (Petrol, Diesel, CNG)
4. Cryptocurrency top 10 (BTC, ETH, BNB, SOL, XRP, ADA, DOGE, MATIC, LINK, DOT)
5. Oil (WTI + Brent + OPEC basket)
6. Stock market index (local exchange)
7. Interest rates (central bank)
8. Inflation tracker
9. Gold in local units (tola, per 10g for Pakistani market)
10. Gold bazaar context (Anarkali, Urdu Bazaar etc.)
11. Zakat Nisab calculator (Islamic)
12. Misery Index (inflation + unemployment)
13. Historical 30/90/365 day charts
14. Affiliates: Wise, Remitly, Binance, TradingView

#### Rates Template Paragraph
> "Gold prices in {country} today stand at {currency} {gold_24k}/gram for 24 karat gold, {up_down} {gold_change}% from yesterday. Over the last 30 days gold has {risen_fallen} {monthly_change}% in {country}. {city} is one of {country}'s major gold trading centres with {bazaar_name} being the most active gold market. The {currency_code} is trading at {usd_rate} against the US dollar today, {stronger_weaker} than last week. For those sending money internationally, the mid-market rate provides {transfer_insight}."

**APIs:** MetalPriceAPI, ExchangeRate-API, CoinGecko, EIA API, Alpha Vantage (free tier)

---

### PAGE 8 — NEWS PAGE
**URL:** `/{country}/{province}/{city}/news`
**Word Count Target:** 2,000+ words

#### Sections
1. Category tabs: [All] [Local] [National] [International] [Sports] [Business] [Entertainment] [Tech] [Health]
2. Breaking news alert strip (if applicable)
3. Top stories (featured cards with image)
4. News grid (6 items per category)
5. Trending topics
6. Search within news
7. Related city news
8. Affiliates: Bloomberg, Economist, Grammarly

#### News Template Paragraph
> "Staying informed about {city} means tracking events at three levels — global developments that directly affect {city}'s economy and society, national news from {country} that shapes provincial policy, and the specific local stories that define daily life in {city} right now. The headlines below cover {today_date} and span politics, economics, sports, entertainment, and community affairs, drawn from {source_count} established news sources covering {city}."

**APIs:** GNews API, Google News RSS, local newspaper RSS feeds

---

### PAGE 9 — EVENTS PAGE
**URL:** `/{country}/{province}/{city}/events`
**Word Count Target:** 2,000+ words

#### Sections
1. Category tabs: [All] [International] [National] [Cultural] [Sports] [Religious]
2. This Week (countdown timers)
3. This Month
4. Upcoming Religious Events (with days remaining)
5. Sports fixtures for city
6. Cultural festivals
7. National holidays countdown
8. Affiliates: GetYourGuide, Viator, Ticketmaster

#### Events Template Paragraph
> "{city} observes events at four distinct levels throughout the year — international events that bring the world to {city}, national events that reflect {country}'s calendar, provincial events specific to {province}'s cultural identity, and purely local {city} celebrations. Religious observances form the backbone of the annual calendar, with {major_faith} events like {major_event1} and {major_event2} shaping the rhythm of city life. Sports fixtures, cultural festivals, and public holidays round out a calendar that ensures {city} is never short of activity."

**APIs:** Google News RSS, Aladhan (Islamic dates), Hebcal (Jewish dates), custom events database in Supabase

---

### PAGE 10 — PERSONALITIES PAGE
**URL:** `/{country}/{province}/{city}/personalities`
**Word Count Target:** 2,500+ words

#### Sections
1. Category tabs: [All] [Leaders & Politics] [Sports Champions] [Arts & Entertainment] [Science & Tech] [Business]
2. Featured personality of the month (large card)
3. Personality grid (changes monthly)
4. Famous by era (Ancient / Colonial / Modern / Contemporary)
5. Born in {city} vs Lived in {city}
6. Wikipedia bio modal on click
7. Affiliates: Audible biographies, Udemy courses

#### Personalities Template Paragraph
> "{city} has produced {personalities_count} individuals of national or international significance — leaders who shaped {country}'s history, athletes who carried {city}'s name to world championships, artists whose work defined a generation, and scientists whose discoveries changed the world. This month's featured selection highlights {category1}, {category2} and {category3} personalities, offering a glimpse into the breadth of {city}'s contribution to human achievement across different fields and different centuries."

**Data:** Wikipedia API for bios and images, Supabase for city-personality mapping

---

### PAGE 11 — FAMOUS PLACES PAGE
**URL:** `/{country}/{province}/{city}/places` and `/places/{place-slug}`
**Word Count Target:** 2,500+ per place page

#### City Places Page Sections
1. UNESCO count badge
2. Tourist count
3. Place cards (6–8 places with image/name/era/type)
4. Map showing all places (Leaflet)
5. Filter by type (Mosque/Fort/Museum/Natural/Garden)
6. Best visiting season

#### Individual Place Page (`/places/badshahi-mosque-lahore`)
1. Hero image (Wikipedia Commons)
2. Quick facts cards (Type, Built, By, Material, Capacity, UNESCO, Visitors)
3. IS IT OPEN TODAY? (live status)
4. Full history (Wikipedia API)
5. Visiting guide (hours, entry fee, dress code, tips)
6. Weather at this location today
7. Prayer times (if religious site)
8. Best photography time (golden hour)
9. Nearby places (5 closest)
10. How to get there
11. Virtual tour link (if available)
12. Affiliates: GetYourGuide tours, Lonely Planet guides

#### Places Template Paragraph
> "{city} is home to {places_count} major historical and cultural sites, attracting {tourist_count} visitors annually. The city has {unesco_count} UNESCO World Heritage Sites, making it one of {country}'s most historically significant cities. {city}'s oldest surviving structure dates to {oldest_era}, a testament to the depth of the city's history. This month we are featuring {place1_name}, {place2_name} and {place3_name} — each representing a different era of {city}'s remarkable {city_age}-year story."

**APIs:** Wikipedia REST API, Wikidata API, OpenStreetMap Nominatim

---

### PAGE 12 — HERITAGE PRODUCTS PAGE
**URL:** `/{country}/{province}/{city}/heritage-products` and `/products/{product-slug}`
**Word Count Target:** 2,500+ per product page

#### City Heritage Page
1. Product carousel (8–10 products)
2. Product cards: image, name, craft age, artisans, export value
3. Affiliate links (when available)

#### Individual Product Page (`/products/multan-blue-pottery`)
1. Hero image
2. Quick facts (Type, Age, Origin, Artisans, Exports, UNESCO status)
3. The Story (400-year history)
4. How it's made (step by step)
5. Where to buy in {city}
6. Authentic vs fake guide
7. Price guide
8. Affiliates: Amazon, Etsy, local artisan links
9. Related products from {province} and {country}

#### Heritage Template Paragraph
> "{city} has been producing {product1} for over {product1_age} years, making it one of the world's most recognised centres for this craft. The {product1} industry employs approximately {product1_workers} artisans in {city} alone and generates {product1_export_value} in annual exports to {product1_top_markets}. {city}'s {product2} is equally famous, recognised globally for its {product2_unique_quality}. Together these crafts represent an economic activity that supports over {total_artisan_count} families across {city} and the surrounding districts."

**APIs:** Wikidata API, Wikipedia REST API

---

### PAGE 13 — ECONOMY PAGE
**URL:** `/{country}/{province}/{city}/economy` (also `/economy` global, `/{country}/economy`)
**Word Count Target:** 3,000+ words

#### Sections
1. Economic Health Score (0–100 dashboard visual)
2. 6 Vital Signs (GDP growth, inflation, unemployment, debt, FX rate, stock market)
3. "What this means in plain language" (human-readable summary)
4. GDP growth chart (World Bank 10-year)
5. Population growth chart
6. Exports growth chart
7. Human Development Index trend
8. Cost of living comparison
9. Major industries breakdown
10. Salary data
11. Investment climate
12. Misery Index
13. "Did you know" economic facts
14. Affiliates: TradingView, Coursera finance courses, Wise

#### Economy Template Paragraph
> "{city} contributes {gdp_pct}% to {country}'s total GDP, generating approximately ${gdp_value} billion annually. The city's economy is primarily driven by {industry1}, {industry2} and {industry3}. With a workforce of {workforce} people, {city} is {country}'s {city_rank} largest economic centre. The cost of living index in {city} stands at {cost_index}, placing it {cost_rank} among {country}'s major cities. Inflation in {country} is currently at {inflation}%, meaning household expenses have increased {inflation_1yr}% over the last year."

**APIs:** World Bank API, UN Data API, Wikipedia API for city economy data

---

### PAGE 14 — WONDERS PAGE
**URL:** `/wonders` (global index) and `/wonders/{wonder-slug}`
**Word Count Target:** 3,000+ per wonder page

#### Global Wonders Index
Category tabs: [New 7 Wonders] [Ancient 7 Wonders] [Natural 7 Wonders] [Islamic Wonders] [UNESCO Sites]
Wonder cards: image, name, location, type, annual visitors

#### Individual Wonder Page
1. Hero image
2. Quick facts (Type, Built, By, Material, Height, UNESCO, Visitors, Rating)
3. IS IT OPEN TODAY? (live status badge)
4. The Story (full Wikipedia history)
5. Live weather at wonder site today
6. Best visiting time today (golden hour calculation)
7. Visiting guide (hours, fees, tips, dress code)
8. Photography guide
9. Nearby wonders
10. Connected city page link
11. Affiliates: GetYourGuide tours, travel guides

#### Wonders Template Paragraph
> "{wonder_name} stands in {city}, {country} as one of the world's most extraordinary {wonder_type} achievements, drawing {annual_visitors} visitors annually to its {wonder_area}. Built between {built_start} and {built_end} under the direction of {built_by}, the structure took {construction_years} years to complete using {material} sourced from {material_origin}. Today the {wonder_name} remains {current_use} and was designated a {recognition_type} in {recognition_year}. The best time to visit today is {best_time_today} when the light falls across {famous_feature} from the {direction}."

---

### PAGE 15 — COMPARE PAGE
**URL:** `/compare` and `/compare/{city1}-vs-{city2}`
**Word Count Target:** 3,000+ per comparison pair

#### Sections
1. City selector tool (two dropdowns + Compare button)
2. Popular pairs (8 suggested comparisons)
3. Quick Verdict (winner + score cards)
4. "Choose City A if..." vs "Choose City B if..."
5. Side-by-side comparison table (50+ data points)

Comparison categories:
- Weather (current temp, annual rain, hottest/coldest months)
- Population & Size
- Cost of living
- Economy (GDP, growth, industries)
- Quality of life (healthcare, education, safety)
- Faith & spiritual (prayer times, mosques, multi-faith)
- Food & culture
- Sports & entertainment
- Transport
- Gold & rates
- Tourism (UNESCO sites, annual visitors)
- Employment

#### Compare Template Paragraph
> "{city1} and {city2} are two of {country}'s most important cities, each with a distinct economic character, cultural identity, and quality of life. With a population of {city1_pop} versus {city2_pop}, {city1_larger} is the larger of the two. {city1}'s cost of living index of {city1_cost} compares to {city2}'s {city2_cost}, making {city_cheaper} the more affordable option for daily life. In terms of employment, {city1}'s primary industries of {city1_industries} contrast with {city2}'s {city2_industries}, meaning the right city depends heavily on your profession."

---

### PAGE 16 — OCEANS PAGE
**URL:** `/oceans` (global index) and `/oceans/{ocean-slug}`
**Word Count Target:** 2,500+ per ocean/sea page

#### Global Oceans Index
- 5 Oceans + major seas (Arabian Sea, Mediterranean, Red Sea, South China Sea etc.)
- Live conditions strip: wave height, temperature, weather

#### Individual Ocean/Sea Page
1. Hero image (satellite view)
2. Quick facts (Type, Part of, Area, Max depth, Avg temp, Borders)
3. Live Conditions Today (wave height, water temp, weather, shipping alerts)
4. The Story (history, formation, significance)
5. Marine life (species count, famous species)
6. Economic importance (shipping routes, fisheries, oil)
7. Bordering countries (linked to country pages)
8. Major port cities (linked to city pages)
9. Climate impact
10. Environmental status
11. Affiliates: Sailing courses, cruise bookings, dive gear

#### Oceans Template Paragraph
> "The {ocean_name} covers {area} million km², representing {pct_of_earth}% of the earth's total ocean surface. Its waters touch {border_count} countries and support an estimated {marine_species} marine species in one of the world's most {ecological_significance} marine ecosystems. The {ocean_name} carries approximately {shipping_pct}% of global maritime trade through its shipping lanes, making it economically indispensable to the {region} region. Current surface temperature is {current_temp}°C, {above_below} the seasonal average of {seasonal_avg}°C."

**APIs:** Open-Meteo Marine API for live conditions

---

### PAGE 17 — CONFLICTS PAGE
**URL:** `/conflicts` (global index) and `/conflicts/{conflict-slug}`
**Word Count Target:** 2,500+ per conflict page

**Editorial policy:** Factual, educational only. No sides. No propaganda. UN/ACLED sources only.

#### Global Conflicts Index
1. Disclaimer (factual/educational only)
2. World Peace Index score
3. Colour-coded conflict map (green/yellow/orange/red)
4. Active conflicts list (32 worldwide)
5. Stats: displaced people, refugees, peace negotiations active
6. Conflict by region tabs

#### Individual Conflict Page
1. Conflict overview (who, where, when started)
2. Factual timeline
3. Humanitarian impact (displaced, affected cities)
4. Peace efforts
5. UN/international response
6. Affected cities (linked to city pages)
7. Neighbouring countries impact

#### Conflicts Template Paragraph
> "The {conflict_name} has been an active conflict since {started_year}, affecting {countries_count} countries and resulting in the displacement of approximately {displaced_people} people from their homes. The conflict is centred in {primary_region}, with major effects felt in the cities of {city1}, {city2} and {city3}. According to the United Nations, {un_summary}. As of {current_date}, {peace_status}. This page presents factual data sourced from the UN, ACLED, and internationally recognised humanitarian organisations."

**APIs:** ACLED API, UN OCHA feeds, GNews for latest developments

---

### PAGE 18 — MY LOCATION PAGE
**URL:** `/my-location`
**Type:** Dynamic per user — uses browser Geolocation API

#### Sections
1. Location detection prompt (earth animation, "Share My Location" button)
2. Location reveal card (neighbourhood, city, province, country, coordinates, elevation)
3. Your weather right now (live at exact coordinates)
4. Your prayer times right now (Aladhan by coordinates)
5. Nearest city page link
6. Nearest famous place
7. Nearest mosque
8. What's happening near you (events)
9. Gold rate where you are
10. Emergency contacts for your location
11. "Your city on WorldCityHub" (full city page link)

**APIs:** Browser Geolocation API, OpenWeatherMap (by coords), Aladhan (by coords), Nominatim reverse geocode, OpenStreetMap Overpass (nearest mosque)

---

### PAGE 19 — SPORTS PAGE
**URL:** `/{country}/sports`, `/{country}/{sport}`, `/{country}/{league}`
**Word Count Target:** 2,500+ words

#### Sections
1. Sport selector tabs (Cricket, Hockey, Football, Squash, Athletics etc.)
2. Live scores right now
3. National team current standings
4. Upcoming matches (next 7 days)
5. Recent results (last 5 matches)
6. League standings (PSL, Premier League etc.)
7. Top players with rankings
8. Historic achievements
9. Sports news for country/city
10. Stadium guide (home stadiums with capacity, location)
11. Affiliates: Ticketmaster, JerseyStore, ESPN+

#### Sports Template Paragraph
> "{country} runs on {primary_sport}. The national {primary_sport} team currently holds a {world_ranking} global ranking in {format}, with their next international fixture scheduled for {next_match_date} against {next_opponent} at {venue}. The domestic {league_name} competition features {team_count} teams, with {league_leader} currently leading the standings on {points} points. {famous_player} remains the country's most followed player globally, with {social_followers} followers across social media platforms."

**APIs:** TheSportsDB (free), CricAPI (cricket), ESPN RSS, BBC Sport RSS

---

### PAGE 20 — HOROSCOPE PAGE
**URL:** `/horoscope`, `/horoscope/{tradition}`, `/horoscope/{sign}`, `/horoscope/{sign}/today`
**Word Count Target:** 3,000+ words (across all signs)

#### Sections
1. Tradition selector: [Western Zodiac] [Chinese Zodiac] [Vedic/Jyotish] [Islamic Lunar] [Hebrew] [Numerology]
2. Sky right now (live moon phase, planets, constellation)
3. Your sign (date-based auto-detect or manual select)
4. Daily reading for your sign
5. All 12 signs overview
6. Individual sign deep dive
7. Compatibility chart
8. Lucky numbers/colors/days
9. Moon sign vs Sun sign
10. Chinese zodiac year
11. Tarot card of the day
12. Connected to local sky data (city's moon phase tonight)

#### Horoscope Traditions Covered
- Western: 12 zodiac signs (Aries–Pisces)
- Chinese: 12 animals (Rat–Pig)
- Vedic/Jyotish: 12 rashis
- Islamic: Hijri month significance
- Hebrew: Mazalot (12 signs)
- Numerology: life path number

#### Horoscope Template Paragraph
> "For {sign_name} born between {date_start} and {date_end}, today {current_date} falls under the influence of {ruling_planet} in {current_sign_position}. The {moon_phase} moon currently in {moon_sign} creates {moon_influence} energy for {sign_name} natives. Today is particularly {day_quality} for matters of {favorable_area}, while {caution_area} may require extra attention. Your lucky number today is {lucky_number}, and {lucky_color} supports positive energy in your surroundings. On the {element} element scale, today rates {energy_level}/10 for {sign_name}."

**APIs:** Aztro API (free), FarmSense Moon, custom astronomy calculations

---

## AFFILIATE STRATEGY — Smart Placement

| Page | Affiliate | Commission |
|------|-----------|------------|
| Weather | Amazon air purifiers, AQI masks | 3–8% |
| Prayer Times | Duolingo Arabic, Islamic books | 15–45% |
| Rates/Gold | Wise, Binance, TradingView | $25 flat, 50%, 30% |
| News | Grammarly, Bloomberg | 20–40% |
| Famous Places | GetYourGuide, Viator | 8% |
| Wonders | GetYourGuide, Lonely Planet | 8–10% |
| Heritage Products | Amazon, Etsy | 3–10% |
| Sports | Ticketmaster, JerseyStore | 5–10% |
| Economy | Coursera, Udemy finance | 15–45% |
| Horoscope | Audible, crystal shops | 10–40% |
| Events | GetYourGuide, Eventbrite | 8% |
| My Location | NordVPN, Airbnb | 10–30% |

---

## URL STRUCTURE — COMPLETE

```
/ (homepage — static)
/countries (all 195 countries directory)
/compare
/compare/{city1}-vs-{city2}
/oceans
/oceans/{ocean-slug}
/conflicts
/conflicts/{conflict-slug}
/wonders
/wonders/{wonder-slug}
/horoscope
/horoscope/{tradition}
/horoscope/{sign}
/horoscope/{sign}/today
/my-location
/places/{place-slug}
/products/{product-slug}
/rates (global)
/news (global)
/economy (global)
/sports (global)

/{country} (country page)
/{country}/rates
/{country}/news
/{country}/sports
/{country}/economy
/{country}/personalities
/{country}/places
/{country}/heritage-products
/{country}/events

/{country}/{province} (province page)
/{country}/{province}/rates
/{country}/{province}/news
/{country}/{province}/cities

/{country}/{province}/{city} (city main)
/{country}/{province}/{city}/weather
/{country}/{province}/{city}/prayer-times
/{country}/{province}/{city}/rates
/{country}/{province}/{city}/news
/{country}/{province}/{city}/events
/{country}/{province}/{city}/economy
/{country}/{province}/{city}/sports
/{country}/{province}/{city}/horoscope
/{country}/{province}/{city}/personalities
/{country}/{province}/{city}/places
/{country}/{province}/{city}/heritage-products
/{country}/{province}/{city}/wonders
```

---

## SUPABASE SEED DATA — PAKISTAN LAUNCH

### Pakistan (country)
```sql
INSERT INTO countries VALUES (
  gen_random_uuid(), 'pakistan', 'Pakistan', 'PK', '🇵🇰',
  'South Asia', 'Asia', 231402117, 881913, 'Islamabad',
  'Pakistani Rupee', 'PKR', ARRAY['Urdu','English','Punjabi','Pashto','Sindhi','Balochi'],
  'Federal Parliamentary Republic', 'PKT (UTC+5)', '+05:00',
  'August 14, 1947', 'Varies — Desert to Alpine', 'Islam', 96,
  '$376B', 376000000000, '5.7%', '28.2%', '6.2%',
  ARRAY['Textiles → USA/Europe/UAE','Rice → Middle East/Africa','Sports goods → Global','Surgical instruments → Germany/USA'],
  'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'Land of ancient civilisations, towering peaks, and vibrant culture.',
  '#0C7A3D', '#FFFFFF', 30.3753, 69.3451, 62.3, 0.544, 36.0, 79.0,
  NOW(), NOW()
);
```

### Punjab (province)
```sql
INSERT INTO provinces VALUES (
  gen_random_uuid(), 'punjab', 'pakistan', 'Punjab', 'Lahore',
  110012442, 205344, 'Most populous province', 'Agriculture, Industry, Culture, Education',
  54.0, 64.0, 'Semi-arid', 'Islam', 97.0,
  'https://images.pexels.com/photos/...',
  '#0C7A3D', 31.1471, 75.3412,
  '[{"name":"Lahore Division","slug":"lahore-division","districts":["Lahore","Sheikhupura","Kasur","Nankana Sahib"]},{"name":"Faisalabad Division","slug":"faisalabad-division","districts":["Faisalabad","Jhang","Toba Tek Singh","Chiniot"]}]',
  ARRAY['Textiles','Agriculture','Manufacturing','Sports Goods','IT Services'],
  ARRAY['Fertile Agricultural Land','Indus River System','Rock Salt (Khewra)','Coal (Salt Range)','Natural Gas'],
  200, '1970 (modern province)', NOW(), NOW()
);
```

### Lahore (city)
```sql
INSERT INTO cities VALUES (
  gen_random_uuid(), 'lahore', 'punjab', 'pakistan', 'Lahore', 'لاہور',
  'Provincial Capital', 14000000, 1772, 217, 31.5497, 74.3436,
  'Asia/Karachi', '+05:00', 1000, 'Semi-arid', 'Islam', 94.0,
  ARRAY['Punjabi','Urdu'], 'PKR', NULL,
  ARRAY['Casablanca, Morocco','Chicago, USA','Houston, USA'],
  'Anarkali Bazaar', 2000, 3, 2000000,
  'https://images.pexels.com/photos/...',
  'Heart of Pakistan', '#0C7A3D', 'Ravi River',
  '13% of Pakistan GDP', ARRAY['Textiles','Leather','IT Services','Education','Food Processing'],
  NOW(), NOW()
);
```

---

## DESIGN SYSTEM — FLAG COLOR THEMING

Each country gets its own color palette from `src/lib/design/flagPalettes.ts`:

```typescript
export const FLAG_PALETTES = {
  pakistan:      { accent: '#0C7A3D', glow: ['#0C7A3D','#FFFFFF'] },
  india:         { accent: '#FF9933', glow: ['#FF9933','#138808'] },
  'saudi-arabia':{ accent: '#006C35', glow: ['#006C35','#FFFFFF'] },
  uae:           { accent: '#00732F', glow: ['#00732F','#FF0000'] },
  uk:            { accent: '#012169', glow: ['#012169','#C8102E'] },
  usa:           { accent: '#B22234', glow: ['#B22234','#3C3B6E'] },
  turkey:        { accent: '#E30A17', glow: ['#E30A17','#FFFFFF'] },
  iran:          { accent: '#239F40', glow: ['#239F40','#DA0000'] },
  jordan:        { accent: '#007A3D', glow: ['#007A3D','#CE1126'] },
  egypt:         { accent: '#CE1126', glow: ['#CE1126','#000000'] },
}
```

**Rule:** Every country, province, and city page uses its country's accent color for:
- Section header accents
- Card borders
- Active tab indicators
- Button colors
- Gradient text for hero heading
- Aurora glow orbs in background
- Progress bars and charts

---

## PARAGRAPH TEMPLATE FILES — SRC/LIB/PARAGRAPHS/

| File | Page | Functions |
|------|------|-----------|
| `city.ts` | City Main | `generateTimeParagraph`, `generateWeatherParagraph`, `generateFaithParagraph`, `generateNewsParagraph`, `generateRatesParagraph`, `generatePersonalitiesParagraph`, `generatePlacesParagraph`, `generateHeritageParagraph`, `generateEconomyParagraph`, `generateResourcesParagraph`, `generateGlanceParagraph`, `generateNearbyParagraph`, `generateStreetFoodParagraph`, `generateSportsParagraph`, `generateEmergencyParagraph` |
| `country.ts` | Country | `generateFactsParagraph`, `generateFactsAfter`, `generateLiveDataParagraph`, `generateCitiesWeatherParagraph`, `generateProvincesParagraph`, `generatePersonalitiesParagraph`, `generatePlacesParagraph`, `generateEconomyDashboardParagraph`, `generateTeamsParagraph`, `generateHolidaysParagraph`, `generateEmergencyParagraph` + After variants |
| `province.ts` | Province | Same pattern as country.ts |
| `weather.ts` | Weather | `generateCurrentConditionsParagraph`, `generateForecastParagraph`, `generateClimateParagraph`, `generateAQIParagraph` |
| `prayer.ts` | Prayer Times | `generatePrayerParagraph`, `generateQiblaParagraph`, `generateMonthlySummaryParagraph` |
| `rates.ts` | Rates | `generateGoldParagraph`, `generateCurrencyParagraph`, `generateFuelParagraph`, `generateCryptoParagraph` |
| `news.ts` | News | `generateNewsSummaryParagraph` |
| `events.ts` | Events | `generateEventsIntro`, `generateReligiousEventsParagraph` |
| `economy.ts` | Economy | `generateEconomyHealthParagraph`, `generateGDPParagraph`, `generateCostOfLivingParagraph` |
| `sports.ts` | Sports | `generateNationalTeamParagraph`, `generateLeagueParagraph` |
| `personality.ts` | Personalities | `generatePersonalityParagraph`, `generateCityPersonalitiesParagraph` |
| `places.ts` | Famous Places | `generatePlaceOverviewParagraph`, `generateIndividualPlaceParagraph` |
| `products.ts` | Heritage | `generateProductParagraph`, `generateCityProductsParagraph` |
| `wonders.ts` | Wonders | `generateWonderParagraph`, `generateVisitingGuideParagraph` |
| `compare.ts` | Compare | `generateCompareIntro`, `generateVerdictParagraph`, `generateCompareSection` |
| `oceans.ts` | Oceans | `generateOceanParagraph`, `generateMarineLifeParagraph` |
| `conflicts.ts` | Conflicts | `generateConflictSummaryParagraph` |
| `horoscope.ts` | Horoscope | `generateDailyReadingParagraph`, `generateSignDescriptionParagraph` |
| `horoscope-sign.ts` | Individual Sign | `generateSignDetailParagraph` |

---

## DEVELOPMENT PRIORITY ORDER

### Phase 1 — Launch (4 pages)
1. ✅ Homepage (static)
2. 🔄 Pakistan country page
3. 🔄 Punjab province page
4. 🔄 Lahore city main page

### Phase 2 — City sub-pages (Lahore only)
5. Weather page
6. Prayer Times page
7. Rates page
8. News page
9. Economy page
10. Sports page
11. Personalities page
12. Famous Places page
13. Heritage Products page
14. Events page
15. Horoscope page

### Phase 3 — Global pages
16. Compare page
17. Oceans page
18. Conflicts page
19. My Location page
20. Wonders pages
21. Countries directory

### Phase 4 — Scale
- Add 5 more countries (India, Saudi Arabia, UAE, UK, USA)
- Add provinces for each
- Add 5 cities per country
- Enable programmatic generation for all 10,247 cities

---

## KEY RULES FOR ALL PAGES

1. **Homepage** = static content, written once
2. **Country/Province/City** = Supabase data + API data → template paragraphs
3. **Every section** has a 100–150 word paragraph (before and/or after the data)
4. **Flag colors** theme every page — viewer feels "in their country"
5. **Dark glassmorphism** design on all pages (match homepage)
6. **FlagAuroraBackground** wraps every country/province/city page
7. **SEO paragraphs** use `generate*Paragraph()` functions from `src/lib/paragraphs/`
8. **Variables** in paragraphs come from Supabase, never hardcoded in page files
9. **Affiliate links** placed naturally — never forced, always contextually relevant
10. **APIs first** for live data; Supabase for static facts that rarely change

