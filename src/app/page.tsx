'use client';

import { motion } from 'framer-motion';
import SearchBar from '@/components/shared/SearchBar';
import LiveGlobalStats from '@/components/home/LiveGlobalStats';
import FeaturedCitiesGrid from '@/components/home/FeaturedCitiesGrid';
import ExploreByContinent from '@/components/home/ExploreByContinent';
import ExploreByReligion from '@/components/home/ExploreByReligion';
import FeaturedWonders from '@/components/home/FeaturedWonders';
import LivePrayerTimesStrip from '@/components/home/LivePrayerTimesStrip';
import OceansToday from '@/components/home/OceansToday';
import GlobalMarketSnapshot from '@/components/home/GlobalMarketSnapshot';
import DidYouKnow from '@/components/home/DidYouKnow';
import FeaturedCountries from '@/components/home/FeaturedCountries';
import WorldNewsSection from '@/components/home/WorldNewsSection';
import WorldWeatherExtremes from '@/components/home/WorldWeatherExtremes';
import WorldClockStrip from '@/components/home/WorldClockStrip';
import AllFaithsToday from '@/components/home/AllFaithsToday';
import HeritageSpotlight from '@/components/home/HeritageSpotlight';
import AboutAndFooter from '@/components/home/AboutAndFooter';
import ActiveConflictsWidget from '@/components/home/ActiveConflictsWidget';
import HoroscopeSection from '@/components/home/HoroscopeSection';
import CompareSection from '@/components/home/CompareSection';
import {
  AuroraBackground,
  AnimatedGradientText,
  AnimatedCounter,
  ScrollAnimation,
} from '@/components/shared/AnimatedComponents';
import { COLORS, STAGGER_CONTAINER } from '@/lib/design-system';
import { Globe, Users, Clock, TrendingUp } from 'lucide-react';

export default function Home() {
  const handleCitySelect = (city: { country_slug: string; province_slug: string; city_slug: string }) => {
    if (city) window.location.href = `/${city.country_slug}/${city.province_slug}/${city.city_slug}`;
  };

  return (
    <>
      {/* ── HERO ── */}
      <AuroraBackground>
        <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
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
                Live weather, prayer times, gold rates, local news and cultural heritage for 10,247 cities across 195 countries — in one place, updated every day.
              </motion.p>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                className="max-w-2xl mx-auto mb-10">
                <div className="backdrop-blur-md border rounded-2xl p-4"
                  style={{ backgroundColor: 'rgba(10,15,30,0.6)', borderColor: COLORS.border }}>
                  <SearchBar onCitySelect={handleCitySelect} />
                </div>
              </motion.div>
              <motion.div variants={STAGGER_CONTAINER} initial="initial" animate="animate"
                className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnimatedCounter label="Cities"       value={10247} icon={<Globe      className="w-6 h-6 text-indigo-400" />} />
                <AnimatedCounter label="Countries"    value={195}   icon={<Users      className="w-6 h-6 text-cyan-400"   />} />
                <AnimatedCounter label="Faiths"       value={7}     icon={<Clock      className="w-6 h-6 text-purple-400" />} />
                <AnimatedCounter label="Live Updates" value={24} suffix="/7" icon={<TrendingUp className="w-6 h-6 text-emerald-400" />} />
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

      {/* ── WORLD CLOCKS — directly below hero ── */}
      <Section bg="darker" title="World Time Right Now"
        desc="Six cities. Six time zones. One planet turning. The clocks update every second — a live reminder that somewhere on earth it is already tomorrow.">
        <WorldClockStrip />
      </Section>

      {/* ── GLOBAL INSIGHTS ── */}
      <Section bg="dark" title="Global Pulse"
        desc="Four numbers that define the world at this exact moment. Cities live on WorldCityHub. The next prayer call in Mecca. Gold trading right now in London. The city recording the highest temperature on earth today. These refresh continuously — every visit is a fresh reading.">
        <LiveGlobalStats />
      </Section>

      {/* ── FEATURED CITIES ── */}
      <Section bg="darker" title="Cities of the World — Live"
        desc="Twelve cities from six continents, showing real-time weather and the next major prayer or worship time. Each card is a doorway to that city's full page — complete with rates, news, economy, events, heritage and local culture. Click any city to go deep.">
        <FeaturedCitiesGrid />
      </Section>

      {/* ── PRAYER TIMES ── */}
      <Section bg="dark" title="Prayer Times Across the World"
        desc="From Fajr in Karachi before sunrise to Isha in Istanbul after dark — 1.9 billion Muslims pray five times a day, their schedules shifting daily with the sun's position. These are today's live times for major cities. Click any city for the full monthly timetable, Qibla direction, and Ramadan schedule.">
        <LivePrayerTimesStrip />
      </Section>

      {/* ── HOROSCOPE ── */}
      <Section bg="darker" title="Stars, Signs and Sacred Calendars"
        desc="Seven traditions. One sky. Whether you follow Western astrology, the Chinese zodiac, Vedic Jyotish, the Islamic Hijri calendar, the Hebrew Mazalot, Buddhist Era dating or the Sikh Nanakshahi calendar — today's date, your sign, and this year's cosmic character are all here. The universe does not speak one language.">
        <HoroscopeSection />
      </Section>

      {/* ── LIVE MARKET RATES ── */}
      <Section bg="dark" title="Live Market Rates"
        desc="Gold at London fix. Bitcoin's 24-hour move. Brent crude after OPEC's last decision. Eight major currency pairs against the dollar. The Fear and Greed Index telling you what the market is feeling right now — not what it felt yesterday. Every figure links through to the full rates page where you can convert to local currency, calculate Zakat, and track 30-day price history.">
        <GlobalMarketSnapshot />
      </Section>

      {/* ── WORLD WONDERS ── */}
      <Section bg="darker" title="Seven Wonders of the World"
        desc="Forty-five centuries of human ambition compressed into seven structures. A wall that took 1,000 years to build. A tomb that took 22 years and 20,000 workers. A colosseum that held 80,000 spectators in 80 AD. Each wonder on WorldCityHub has its own page with today's visiting conditions, photography guide, architectural details, and nearby places worth combining in one trip.">
        <FeaturedWonders />
      </Section>

      {/* ── EXPLORE BY CONTINENT ── */}
      <Section bg="dark" title="Explore by Continent"
        desc="Seven continents. 195 countries. 10,247 cities. Asia alone holds more than half the world's population and nearly five thousand of our city pages. Every continent leads to its countries, every country to its provinces, every province to its cities — a complete geographical tree from the largest landmass to the smallest city street.">
        <ExploreByContinent />
      </Section>

      {/* ── COUNTRIES ── */}
      <Section bg="darker" title="Countries of the World"
        desc="Each of the 195 sovereign nations has a dedicated page covering its provinces, major cities, economy dashboard, cultural heritage, national teams, neighbouring countries, and faith landscape. The country page is where you understand a nation before you visit, invest, relocate, or simply want to know more than the headline.">
        <FeaturedCountries />
      </Section>

      {/* ── COMPARE ── */}
      <Section bg="dark" title="Compare Cities and Countries"
        desc="Which city has lower cost of living — Lahore or Istanbul? Which country has faster GDP growth — Pakistan or Egypt? The comparison tool puts any two cities or countries side by side across weather, economy, culture, and lifestyle. Pick your two and see the full breakdown.">
        <CompareSection />
      </Section>

      {/* ── EXPLORE BY FAITH ── */}
      <Section bg="darker" title="The World by Faith"
        desc="Religion shapes how 8 billion people measure time, name their days, build their cities, and mark the passages of life. WorldCityHub covers all seven major traditions — prayer schedules for Muslims, mass times for Christians, puja timings for Hindus, Shabbat for Jews, meditation sessions for Buddhists, Nitnem for Sikhs. Every city page shows what is happening spiritually there today.">
        <ExploreByReligion />
      </Section>

      {/* ── WORLD NEWS ── */}
      <Section bg="dark" title="World News by Region"
        desc="Events that matter, organized by where they happen rather than who is reporting them. Six regions. Thirty stories. Updated continuously from wire services covering every part of the globe — including regions that rarely make the front page of Western newspapers but are home to billions of people living through real events every day.">
        <WorldNewsSection />
      </Section>

      {/* ── WORLD WEATHER EXTREMES ── */}
      <Section bg="darker" title="Weather Extremes Today"
        desc="The planet's most extreme weather conditions — right now. Jacobabad recording 52°C while Oymyakon sits at minus 67. Mawsynram drowning in eleven thousand millimeters of rain a year while the Atacama desert receives less than a millimeter. These are not records — they are today's actual conditions at the most extreme inhabited places on earth.">
        <WorldWeatherExtremes />
      </Section>

      {/* ── ACTIVE CONFLICTS ── */}
      <Section bg="dark" title="Active Conflicts"
        desc="32 armed conflicts are ongoing across the world as you read this. Over 100 million people have been displaced from their homes. These numbers come from United Nations displacement tracking and ACLED conflict monitoring — updated as situations develop. Each region links through to a dedicated page with affected cities, economic impact, and humanitarian data.">
        <ActiveConflictsWidget />
      </Section>

      {/* ── OCEANS TODAY ── */}
      <Section bg="darker" title="Five Oceans — Live Conditions"
        desc="The Pacific alone covers more area than every landmass on earth combined. The Indian Ocean's monsoon season determines whether hundreds of millions of South Asians have enough water to grow food. The Arctic is melting at a rate that will redraw coastlines within this century. Each ocean has its own page with live surface conditions, marine life, seasonal patterns, and bordering cities that live and die by what happens offshore.">
        <OceansToday />
      </Section>

      {/* ── ALL FAITHS TODAY ── */}
      <Section bg="dark" title="Today Across All Calendars"
        desc="Seven different ways of measuring the same day. The Islamic Hijri, the Gregorian civil calendar, the Hebrew lunisolar system, the Hindu Panchang, the Buddhist Era, the Sikh Nanakshahi, and the Chinese lunar calendar all mark today differently. For the billions of people who live by non-Gregorian systems, today's date in their own tradition matters more than the number on a wall calendar.">
        <AllFaithsToday />
      </Section>

      {/* ── HERITAGE SPOTLIGHT ── */}
      <Section bg="darker" title="Heritage and Famous People"
        desc="A Lahori Khussa takes seven days of hand-stitching by a craftsman who learned the technique from his father, who learned it from his. A Kashmiri Pashmina shawl takes six months on a handloom. Murano glass has been blown on the same Venetian island since the 13th century. These are the objects and the people that cities are remembered by long after the news cycle has moved on.">
        <HeritageSpotlight />
      </Section>

      {/* ── DID YOU KNOW ── */}
      <Section bg="dark" title="">
        <DidYouKnow />
      </Section>

      {/* ── FOOTER ── */}
      <AboutAndFooter />
    </>
  );
}

function Section({ bg, title, desc, children }: {
  bg: 'dark' | 'darker'; title: string; desc?: string; children: React.ReactNode;
}) {
  return (
    <ScrollAnimation>
      <section className="py-14 px-4" style={{ backgroundColor: bg === 'dark' ? '#0a0f1e' : '#080c18' }}>
        <div className="max-w-6xl mx-auto">
          {title && (
            <motion.h2
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-white mb-3">
              {title}
            </motion.h2>
          )}
          {desc && (
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-3xl"
              style={{ hyphens: 'none', wordBreak: 'keep-all' }}>
              {desc}
            </p>
          )}
          {children}
        </div>
      </section>
    </ScrollAnimation>
  );
}
