'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SearchBar from '@/components/shared/SearchBar';
import FeaturedCitiesGrid from '@/components/home/FeaturedCitiesGrid';
import ExploreByContinent from '@/components/home/ExploreByContinent';
import ExploreByReligion from '@/components/home/ExploreByReligion';
import FeaturedWonders from '@/components/home/FeaturedWonders';
import OceansToday from '@/components/home/OceansToday';
import GlobalMarketSnapshot from '@/components/home/GlobalMarketSnapshot';
import FeaturedCountries from '@/components/home/FeaturedCountries';
import HeroClocks from '@/components/home/HeroClocks';
import WorldCapitals from '@/components/home/WorldCapitals';
import AllFaithsToday from '@/components/home/AllFaithsToday';
import HeritageSpotlight from '@/components/home/HeritageSpotlight';
import AboutAndFooter from '@/components/home/AboutAndFooter';
import HoroscopeSection from '@/components/home/HoroscopeSection';
import CompareSection from '@/components/home/CompareSection';
import PersonalitiesPanel from '@/components/home/PersonalitiesPanel';
import PlacesPanel from '@/components/home/PlacesPanel';
import {
  AuroraBackground,
  AnimatedGradientText,
  ScrollAnimation,
} from '@/components/shared/AnimatedComponents';
import { COLORS } from '@/lib/design-system';

export default function Home({ newsSlot, ticker2Slot, myCitySlot, todaysWorldSlot, financeSlot, eventsSlot, economySlot, sportsSlot, conflictsSlot }: {
  newsSlot?: React.ReactNode; ticker2Slot?: React.ReactNode; myCitySlot?: React.ReactNode; todaysWorldSlot?: React.ReactNode;
  financeSlot?: React.ReactNode; eventsSlot?: React.ReactNode; economySlot?: React.ReactNode; sportsSlot?: React.ReactNode; conflictsSlot?: React.ReactNode;
}) {
  const handleCitySelect = (city: { country_slug: string; province_slug: string; city_slug: string }) => {
    if (city) window.location.href = `/${city.country_slug}/${city.province_slug}/${city.city_slug}`;
  };

  return (
    <>
      {/* ── HERO — WORLD TIME RIGHT NOW (§3) ── */}
      <AuroraBackground>
        <section className="relative flex items-center justify-center px-4 py-24 overflow-hidden">
          <motion.div className="absolute top-20 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full filter blur-3xl"
            animate={{ y: [0, -50, 0] }} transition={{ duration: 8, repeat: Infinity }} />
          <motion.div className="absolute bottom-20 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full filter blur-3xl"
            animate={{ y: [0, 50, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 4 }} />

          <div className="max-w-4xl mx-auto w-full z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <AnimatedGradientText
                text="Every City. Every Culture. Every Day."
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight block"
              />
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed"
                style={{ color: COLORS.textSecondary }}>
                Live weather, prayer times, gold rates, local news and cultural heritage for cities across 195 countries — in one place, updated every day.
              </motion.p>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                className="max-w-2xl mx-auto mb-10">
                <div className="backdrop-blur-md border rounded-2xl p-4"
                  style={{ backgroundColor: 'var(--hero-panel-bg)', borderColor: COLORS.border }}>
                  <SearchBar onCitySelect={handleCitySelect} />
                </div>
              </motion.div>
              {/* The hard-coded hero counters ("Cities 10247" etc.)
                  are REMOVED: they were invented figures. The hero is
                  now the spec's World Time — six flag-coloured clocks
                  plus the visitor's opt-in big clock (HeroClocks). */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}>
                <HeroClocks />
              </motion.div>
            </motion.div>
          </div>

          <motion.div className="absolute bottom-10" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <svg className="w-6 h-6 mx-auto" style={{ color: COLORS.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>
      </AuroraBackground>

      {/* ── §4 MY CITY + MAIN FLOW — CARD A RAIL (owner decision
          2026-10-23, supersedes the freeze for this layout): on lg+
          screens My City is a sticky right rail (~340px, sticks under
          the fixed header); below lg it stays the block right after
          the hero with Ticker 2 under it — the aside is FIRST in DOM
          so the mobile order is byte-identical to the frozen layout,
          and grid placement (not DOM order) puts it on the right on
          lg. The 340px column is reserved in the server-rendered
          grid, so the rail causes no layout shift (CLS 0). The H1
          stays in the hero; the rail is an <aside> with its own
          labelled heading (the panel's §4 h2). */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-6">
        <aside aria-label="My City" className="rail-scroll lg:col-start-2 lg:row-start-1 lg:self-start lg:sticky lg:top-20 lg:z-30 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
          {myCitySlot}
        </aside>
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">

      {/* ── TICKER 2 — WEBSITE LIVE (WP2 Slice 1) ──
          Placement LOCKED by the frozen spec: directly under the
          My City panel (§4). */}
      {ticker2Slot}

      {/* ── §5 TODAY'S WORLD — server slot (Q5) ── */}
      <Section bg="dark" title="Today's World"
        desc="One planet, one day. Right now the sun is about to rise somewhere, one city is baking and another is freezing — and somewhere a whole country has the day off. These lines are computed live from weather stations across a sixteen-city world sample, and they change every day.">
        {todaysWorldSlot}
      </Section>

      {/* ── §6 WONDERS (Q5 — deep links HOLD per L1) ── */}
      <Section bg="darker" title="Seven Wonders of the World"
        desc="Forty-five centuries of human ambition compressed into seven structures. A wall that took 1,000 years to build. A tomb that took 22 years and 20,000 workers. A colosseum that held 80,000 spectators in 80 AD. Each wonder on WorldCityHub is getting its own page with visiting conditions, photography guides and architectural detail.">
        <FeaturedWonders />
      </Section>

      {/* ── §7 CONTINENTS (Q5) ── */}
      <Section bg="dark" title="Explore by Continent"
        desc="Seven continents. 195 countries. Thousands of cities. Asia alone holds more than half the world's population. Every continent leads to its countries, every country to its provinces, every province to its cities — a complete geographical tree from the largest landmass to the smallest city street.">
        <ExploreByContinent />
      </Section>

      {/* ── §8 OCEANS (Q5 — deep links HOLD per L1) ── */}
      <Section bg="darker" title="Five Oceans — One World Ocean"
        desc="The Pacific alone covers more area than every landmass on earth combined. The Indian Ocean's monsoon season determines whether hundreds of millions of South Asians have enough water to grow food. The Arctic is melting at a rate that will redraw coastlines within this century. Each ocean is getting its own page with live surface conditions, marine life, seasonal patterns, and the cities that live by what happens offshore.">
        <OceansToday />
      </Section>

      {/* ── §9 COUNTRIES (Q5) ── */}
      <Section bg="dark" title="Countries of the World"
        desc="Each sovereign nation gets a dedicated page covering its provinces, major cities, economy dashboard, cultural heritage, national teams, neighbouring countries, and faith landscape. The country page is where you understand a nation before you visit, invest, relocate, or simply want to know more than the headline.">
        <FeaturedCountries />
      </Section>

      {/* ── §9A WORLD CAPITALS (Q5 — Sayyed's amendment) ── */}
      <Section bg="darker" title="World Capitals"
        desc="Capitals are where a country keeps its government, its oldest streets and usually its biggest airport — and 'capital of…' is one of the most-asked questions on the web. Here the capitals are alive: each one shows its flag, its local time right now and its current temperature, and links through to its country page.">
        <WorldCapitals />
      </Section>

      {/* ── §10 CITIES (Q5 — published cities only; anchor added by
          Polish Card 5 so the navbar's Cities link lands here) ── */}
      <div id="cities">
      <Section bg="dark" title="Cities of the World — Live"
        desc="Every published city on WorldCityHub carries live weather, prayer times, gold and currency rates, local news and events — the same figures you see on these cards, updated through the day. Click any city to go deep.">
        <FeaturedCitiesGrid />
      </Section>
      </div>

      {/* ═══ PANELS II (Q6) — frozen order §11–§24 ═══
          Removed in this pass (not in the frozen 24): "Global Pulse"
          (LiveGlobalStats — carried invented summary figures), the
          old Prayer Times strip (hard-coded prayer strings + links to
          unpublished cities), "Weather Extremes" (its live extremes
          live on in §5), and DidYouKnow. */}

      {/* ── §11 FAITHS / PRAYER HUB (anchor for the nav, link map §2) ── */}
      <div id="faiths">
      <Section bg="darker" title="The World by Faith"
        desc="Religion shapes how 8 billion people measure time, name their days, build their cities, and mark the passages of life. WorldCityHub covers all seven major traditions — prayer schedules for Muslims, mass times for Christians, puja timings for Hindus, Shabbat for Jews, meditation sessions for Buddhists, Nitnem for Sikhs. Below: today's date across all seven calendars, and today's prayer times for every published city.">
        <ExploreByReligion />
        <AllFaithsToday />
      </Section>
      </div>

      {/* ── §12 FINANCE — anchor per link map; figures INSIDE the panel ── */}
      <div id="finance">
      <Section bg="dark" title="Live Market Rates"
        desc="Gold at London fix. Bitcoin's 24-hour move. Brent crude after OPEC's last decision. Eight major currency pairs against the dollar. The Fear and Greed Index telling you what the market is feeling right now — not what it felt yesterday. Every figure links through to the full rates page where you can convert to local currency, calculate Zakat, and track 30-day price history.">
        <GlobalMarketSnapshot />
        {financeSlot}
      </Section>
      </div>

      {/* ── §13 EVENTS — server slot ── */}
      <Section bg="darker" title="Events and Holidays"
        desc="What is on, and who has the day off. Public holidays are the skeleton of a city's week — they decide its traffic, its markets and its mood before a single event is announced. These are the real holidays falling today and over the next seven days, plus the events pages of every published city.">
        {eventsSlot}
      </Section>

      {/* ── §14 NEWS — category tabs, server slot ── */}
      <Section bg="dark" title="Live Updates — News by Category"
        desc="Events that matter, sorted the way you actually follow them — your country, your money, your health, your team. Pick a category; the headlines are the latest the wire services have published, and every one opens on the full news page with its source.">
        {newsSlot}
      </Section>

      {/* ── §15 HOROSCOPE ── */}
      <Section bg="darker" title="Stars, Signs and Sacred Calendars"
        desc="Seven traditions. One sky. Whether you follow Western astrology, the Chinese zodiac, Vedic Jyotish, the Islamic Hijri calendar, the Hebrew Mazalot, Buddhist Era dating or the Sikh Nanakshahi calendar — today's date, your sign, and this year's cosmic character are all here. The universe does not speak one language.">
        <HoroscopeSection />
      </Section>

      {/* ── §16 PERSONALITIES — published profiles only ── */}
      <Section bg="dark" title="Personalities"
        desc="Cities are remembered by their people. These are the full published profiles on WorldCityHub today — the lives, the work and the arguments, written to be read, not skimmed. More profiles join as each one is verified and completed.">
        <PersonalitiesPanel />
      </Section>

      {/* ── §17 PLACES — links HOLD ── */}
      <Section bg="darker" title="Places Worth Knowing"
        desc="Some places hold a whole civilisation in one courtyard. A mosque built for an emperor, a capital's tent of marble, a city abandoned for four thousand years. Each card shows the weather at that exact spot right now; full place pages are in preparation.">
        <PlacesPanel />
      </Section>

      {/* ── §18 HERITAGE PRODUCTS — content only, links HOLD ── */}
      <Section bg="dark" title="Heritage Products"
        desc="A Lahori Khussa takes seven days of hand-stitching by a craftsman who learned the technique from his father, who learned it from his. A Kashmiri Pashmina shawl takes six months on a handloom. Murano glass has been blown on the same Venetian island since the 13th century. These are the objects cities are remembered by long after the news cycle has moved on.">
        <HeritageSpotlight />
      </Section>

      {/* ── §19 ECONOMY — server slot ── */}
      <Section bg="darker" title="Economy — Pakistan"
        desc="Five numbers describe an economy before any headline does: how big it is, how fast it is growing, what inflation is doing to its kitchens, how many of its people are out of work, and how many people it feeds. These are Pakistan's, straight from the World Bank, each with its data year.">
        {economySlot}
      </Section>

      {/* ── §20 SPORTS — server slot ── */}
      <Section bg="dark" title="Sports"
        desc="Pakistan plays, and the whole country stops. Cricket first, hockey and football behind it — these are the national teams' next scheduled fixtures from the live sports feed, and the door into sport city by city.">
        {sportsSlot}
      </Section>

      {/* ── §21 CONFLICTS — server slot; hub link only ── */}
      <Section bg="darker" title="Conflicts and Displacement"
        desc="Behind every conflict headline is a count of people who cannot go home. These are the United Nations' own displacement figures — refugees, the internally displaced, asylum seekers and the stateless — kept current on the conflicts hub with whitelisted sources and a standing peace-efforts record.">
        {conflictsSlot}
      </Section>

      {/* ── §22 COMPARE ── */}
      <Section bg="dark" title="Compare Cities"
        desc="Two cities, one screen, no arguments left unsettled. Live weather, air quality and prayer times side by side, with a verdict drawn only from measured figures. Start with the classic — Lahore against Karachi — or pick your own pairing from the published cities.">
        <CompareSection />
      </Section>

      {/* ── §23 MY LOCATION ── */}
      <Section bg="darker" title="Your City, Your Page"
        desc="Everything on this homepage becomes personal on the My Location page: your nearest published city, its weather, its prayers, its rates — computed on your device, never saved anywhere. One tap is the last invitation.">
        <Link href="/my-location"
          className="inline-flex items-center gap-2 rounded-full bg-cyan-500/90 hover:bg-cyan-400 px-6 py-3 text-sm font-semibold t-onbrand transition-colors no-underline">
          Open My Location →
        </Link>
      </Section>

        </div>
      </div>

      {/* ── §24 FOOTER ── */}
      <AboutAndFooter />
    </>
  );
}

function Section({ bg, title, desc, children }: {
  bg: 'dark' | 'darker'; title: string; desc?: string; children: React.ReactNode;
}) {
  return (
    <ScrollAnimation>
      <section className={`py-14 px-4 ${bg === 'dark' ? 't-bg' : 't-bg-2'}`}>
        <div className="max-w-6xl mx-auto">
          {title && (
            <motion.h2
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold t-text mb-3">
              {title}
            </motion.h2>
          )}
          {desc && (
            <p className="sub-desc max-w-3xl">
              {desc}
            </p>
          )}
          {children}
        </div>
      </section>
    </ScrollAnimation>
  );
}
