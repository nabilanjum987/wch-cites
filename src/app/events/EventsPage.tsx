import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, Ticket, Globe, Building2, TreePine, Home,
  ChevronRight, Zap, Calendar, Search, Filter, ExternalLink,
  Music, Utensils, BookOpen, Briefcase, Film, Leaf, Users, Church,
  Trophy, Mic2, X,
} from 'lucide-react';
import { fetchCityEvents } from '../../lib/apis/events';
import EventsMap from '../../components/city/EventsMap';
import RecurringEvents from '../../components/city/RecurringEvents';
import SubmitEvent from '../../components/city/SubmitEvent';
import NationalEvents from '../../components/city/NationalEvents';
import TourAffiliates from '../../components/city/TourAffiliates';
import { fetchRecurringEvents } from '../../lib/apis/events';
import type { City, CityEvent, LevelTab, TimeTab, EventCategory, RecurringEvent } from '../../types/city';

interface Props {
  city: City;
}

// ─── constants ───────────────────────────────────────────────────────────────

const LEVEL_TABS: { key: LevelTab; label: string; icon: React.ReactNode }[] = [
  { key: 'global', label: 'Global', icon: <Globe size={14} /> },
  { key: 'national', label: 'National', icon: <Building2 size={14} /> },
  { key: 'provincial', label: 'Provincial', icon: <TreePine size={14} /> },
  { key: 'local', label: 'Local', icon: <Home size={14} /> },
];

const TIME_TABS: { key: TimeTab; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'weekend', label: 'Weekend' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'upcoming', label: 'All Upcoming' },
];

const CATEGORIES: { key: EventCategory; label: string; icon: React.ReactNode }[] = [
  { key: 'sports', label: 'Sports', icon: <Trophy size={14} /> },
  { key: 'culture', label: 'Culture', icon: <Mic2 size={14} /> },
  { key: 'music', label: 'Music', icon: <Music size={14} /> },
  { key: 'literature', label: 'Literature', icon: <BookOpen size={14} /> },
  { key: 'food', label: 'Food', icon: <Utensils size={14} /> },
  { key: 'religious', label: 'Religious', icon: <Church size={14} /> },
  { key: 'business', label: 'Business', icon: <Briefcase size={14} /> },
  { key: 'film', label: 'Film', icon: <Film size={14} /> },
  { key: 'outdoor', label: 'Outdoor', icon: <Leaf size={14} /> },
  { key: 'family', label: 'Family', icon: <Users size={14} /> },
  { key: 'conferences', label: 'Conferences', icon: <Building2 size={14} /> },
];

const CATEGORY_COLORS: Record<EventCategory, string> = {
  sports: 'bg-blue-100 text-blue-700',
  culture: 'bg-amber-100 text-amber-700',
  music: 'bg-pink-100 text-pink-700',
  literature: 'bg-emerald-100 text-emerald-700',
  food: 'bg-orange-100 text-orange-700',
  religious: 'bg-teal-100 text-teal-700',
  business: 'bg-slate-100 text-slate-700',
  film: 'bg-red-100 text-red-700',
  outdoor: 'bg-green-100 text-green-700',
  family: 'bg-yellow-100 text-yellow-700',
  conferences: 'bg-cyan-100 text-cyan-700',
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

function getRemainingTime(endISO: string): string {
  const diff = new Date(endISO).getTime() - Date.now();
  if (diff <= 0) return 'Ended';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

function isLiveNow(event: CityEvent): boolean {
  const now = Date.now();
  return new Date(event.start_time).getTime() <= now && new Date(event.end_time).getTime() > now;
}

function isToday(event: CityEvent): boolean {
  const d = new Date(event.start_time);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

// ─── skeleton ─────────────────────────────────────────────────────────────────

function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="flex gap-2 mt-4">
          <div className="h-8 bg-gray-200 rounded-lg flex-1" />
          <div className="h-8 bg-gray-100 rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
}

// ─── live now strip ──────────────────────────────────────────────────────────

function LiveNowSection({ events }: { events: CityEvent[] }) {
  if (events.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
        <h2 className="text-base font-semibold text-gray-900 tracking-tight">Live Now</h2>
        <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">{events.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {events.map((ev) => (
          <motion.div
            key={ev.id}
            whileHover={{ x: 2 }}
            className="flex items-center justify-between bg-white border border-red-100 rounded-xl px-4 py-3 shadow-sm gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Zap size={16} className="text-red-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{ev.title}</p>
                <p className="text-xs text-gray-500 truncate">{ev.venue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-medium text-red-500 whitespace-nowrap">{getRemainingTime(ev.end_time)}</span>
              {ev.ticket_url && (
                <a
                  href={ev.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 transition-colors whitespace-nowrap"
                >
                  Attend
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── event card ───────────────────────────────────────────────────────────────

function EventCard({ event, primaryColor }: { event: CityEvent; primaryColor: string }) {
  const catStyle = CATEGORY_COLORS[event.category] ?? 'bg-gray-100 text-gray-600';
  const catObj = CATEGORIES.find((c) => c.key === event.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
    >
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: `${primaryColor}18` }}>
            <Calendar size={40} style={{ color: primaryColor }} className="opacity-40" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg backdrop-blur-sm ${catStyle}`}>
            {catObj?.icon}
            {catObj?.label}
          </span>
        </div>
        {event.is_free && (
          <div className="absolute top-3 right-3">
            <span className="text-xs bg-green-500 text-white font-bold px-2 py-1 rounded-lg">FREE</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">{event.title}</h3>
        {event.description && (
          <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{event.description}</p>
        )}

        <div className="mt-auto space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={12} className="shrink-0" style={{ color: primaryColor }} />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={12} className="shrink-0" style={{ color: primaryColor }} />
            <span>{formatDate(event.start_time)} · {formatTime(event.start_time)}</span>
          </div>
          {!event.is_free && event.price_from != null && (
            <div className="flex items-center gap-2 text-xs font-medium" style={{ color: primaryColor }}>
              <Ticket size={12} className="shrink-0" />
              <span>From {event.currency} {event.price_from}</span>
            </div>
          )}
        </div>

        {event.ticket_url && (
          <a
            href={event.ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-white py-2.5 px-4 rounded-xl transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: primaryColor }}
          >
            <Ticket size={14} />
            {event.is_free ? 'Register Free' : 'Get Tickets'}
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function EventsPage({ city }: Props) {
  const [levelTab, setLevelTab] = useState<LevelTab>('local');
  const [timeTab, setTimeTab] = useState<TimeTab>('today');
  const [activeCategory, setActiveCategory] = useState<EventCategory | null>(null);
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<CityEvent[]>([]);
  const [recurringEvents, setRecurringEvents] = useState<RecurringEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const primaryColor = city.primary_color || '#0F4C81';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCityEvents(city.name, city.country, city.country_code, city.lat, city.lng, timeTab, activeCategory, levelTab).then((data) => {
      if (!cancelled) {
        setEvents(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [city, timeTab, activeCategory, levelTab]);

  useEffect(() => {
    setRecurringEvents(fetchRecurringEvents(city.name));
  }, [city.name]);

  const liveEvents = useMemo(() => events.filter(isLiveNow), [events]);

  const filteredEvents = useMemo(() => {
    let result = events;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) => e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [events, search]);

  const todayEvents = useMemo(() => filteredEvents.filter(isToday), [filteredEvents]);
  const upcomingEvents = useMemo(() => filteredEvents.filter((e) => !isToday(e)), [filteredEvents]);

  const countrySlug = city.country_slug || city.country.toLowerCase().replace(/\s+/g, '-');
  const provinceSlug = city.province_slug || city.province.toLowerCase().replace(/\s+/g, '-');
  const citySlug = city.city_slug || city.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter,sans-serif]">
      {/* ── page header ── */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 60%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }}
        />
        <div className="relative max-w-5xl mx-auto px-4 pt-6 pb-8">
          {/* breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/70 mb-5 flex-wrap">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight size={12} />
            <a href={`/${countrySlug}`} className="hover:text-white transition-colors">{city.country}</a>
            <ChevronRight size={12} />
            <a href={`/${countrySlug}/${provinceSlug}`} className="hover:text-white transition-colors">{city.province}</a>
            <ChevronRight size={12} />
            <a href={`/${countrySlug}/${provinceSlug}/${citySlug}`} className="hover:text-white transition-colors">{city.name}</a>
            <ChevronRight size={12} />
            <span className="text-white font-medium">Events</span>
          </nav>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Events in {city.name}
              </h1>
              <p className="text-white/70 text-sm mt-1.5">
                Discover what's happening — sports, music, culture & more
              </p>
            </div>
            {liveEvents.length > 0 && (
              <div className="shrink-0 flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
                </span>
                <span className="text-white text-xs font-semibold">{liveEvents.length} Live Now</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ── level tabs ── */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          {LEVEL_TABS.map((tab) => {
            const active = tab.key === levelTab;
            return (
              <button
                key={tab.key}
                onClick={() => setLevelTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${
                  active
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
                style={active ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
              >
                {tab.icon}
                {tab.label}
                {tab.key === 'local' && <span className="text-xs opacity-75">✓</span>}
              </button>
            );
          })}
        </div>

        {/* ── time tabs ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 flex gap-1 mb-5 overflow-x-auto scrollbar-hide">
          {TIME_TABS.map((tab) => {
            const active = tab.key === timeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setTimeTab(tab.key)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  active ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                style={active ? { backgroundColor: primaryColor } : {}}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── search + filter row ── */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, venues..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters || activeCategory ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-200'
            }`}
            style={showFilters || activeCategory ? { backgroundColor: primaryColor } : {}}
          >
            <Filter size={14} />
            <span className="hidden sm:inline">Filter</span>
            {activeCategory && <span className="text-xs opacity-75">(1)</span>}
          </button>
        </div>

        {/* ── category filters ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-5"
            >
              <div className="flex flex-wrap gap-2 py-1">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeCategory === null
                      ? 'text-white border-transparent'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                  style={activeCategory === null ? { backgroundColor: primaryColor } : {}}
                >
                  All Categories
                </button>
                {CATEGORIES.map((cat) => {
                  const active = activeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(active ? null : cat.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        active
                          ? 'text-white border-transparent'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                      style={active ? { backgroundColor: primaryColor } : {}}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── live now ── */}
        {!loading && <LiveNowSection events={liveEvents} />}

        {/* ── full-width openstreetmap ── */}
        {!loading && filteredEvents.length > 0 && (
          <EventsMap events={filteredEvents} city={city} primaryColor={primaryColor} />
        )}

        {/* ── loading skeletons ── */}
        {loading && (
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
            </div>
          </div>
        )}

        {/* ── today events ── */}
        {!loading && todayEvents.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Calendar size={16} style={{ color: primaryColor }} />
                Today's Events
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{todayEvents.length}</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {todayEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} primaryColor={primaryColor} />
              ))}
            </div>
          </motion.section>
        )}

        {/* ── upcoming events ── */}
        {!loading && upcomingEvents.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Clock size={16} style={{ color: primaryColor }} />
                Upcoming Events
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{upcomingEvents.length}</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} primaryColor={primaryColor} />
              ))}
            </div>
          </motion.section>
        )}

        {/* ── empty state ── */}
        {!loading && filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <Calendar size={32} style={{ color: primaryColor }} className="opacity-50" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">No events found</h3>
            <p className="text-sm text-gray-500">Try a different time range or category</p>
            <button
              onClick={() => { setActiveCategory(null); setSearch(''); setTimeTab('upcoming'); }}
              className="mt-4 text-sm font-medium px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              Show all upcoming events
            </button>
          </motion.div>
        )}

        {/* ── recurring events ── */}
        <RecurringEvents events={recurringEvents} primaryColor={primaryColor} />

        {/* ── national events ── */}
        <NationalEvents city={city} primaryColor={primaryColor} />

        {/* ── submit your event ── */}
        <SubmitEvent cityName={city.name} countryCode={city.country_code} primaryColor={primaryColor} />

        {/* ── tour booking affiliates ── */}
        <TourAffiliates cityName={city.name} primaryColor={primaryColor} />
      </div>
    </div>
  );
}
