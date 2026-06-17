'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar, MapPin, Clock, Filter, Grid, List, Globe,
  Music, Trophy, Utensils, Film, TreePine, Users,
  GraduationCap, Building2, Repeat, Star, Search,
  ChevronRight, ExternalLink, Tag, Ticket, RefreshCw,
  ArrowLeft, Zap
} from 'lucide-react';
import type { City, CityEvent, RecurringEvent, EventCategory, TimeTab, LevelTab } from '@/types/city';
import { fetchCityEvents, fetchRecurringEvents } from '@/lib/apis/events';
import EventsMap from '@/components/city/EventsMap';
import RecurringEvents from '@/components/city/RecurringEvents';
import SubmitEvent from '@/components/city/SubmitEvent';
import TourAffiliates from '@/components/city/TourAffiliates';

// ── Category config ───────────────────────────────────────────────────────────

const CATEGORIES: { key: EventCategory | 'all'; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'all',         label: 'All Events', icon: Grid,        color: 'bg-gray-100 text-gray-700' },
  { key: 'sports',      label: 'Sports',     icon: Trophy,      color: 'bg-blue-100 text-blue-700' },
  { key: 'music',       label: 'Music',      icon: Music,       color: 'bg-pink-100 text-pink-700' },
  { key: 'culture',     label: 'Culture',    icon: Star,        color: 'bg-amber-100 text-amber-700' },
  { key: 'food',        label: 'Food',       icon: Utensils,    color: 'bg-orange-100 text-orange-700' },
  { key: 'film',        label: 'Film',       icon: Film,        color: 'bg-red-100 text-red-700' },
  { key: 'outdoor',     label: 'Outdoor',    icon: TreePine,    color: 'bg-green-100 text-green-700' },
  { key: 'family',      label: 'Family',     icon: Users,       color: 'bg-yellow-100 text-yellow-700' },
  { key: 'business',    label: 'Business',   icon: Building2,   color: 'bg-slate-100 text-slate-700' },
  { key: 'conferences', label: 'Conferences',icon: GraduationCap, color: 'bg-indigo-100 text-indigo-700' },
  { key: 'religious',   label: 'Religious',  icon: Zap,         color: 'bg-teal-100 text-teal-700' },
  { key: 'literature',  label: 'Literature', icon: GraduationCap, color: 'bg-emerald-100 text-emerald-700' },
];

const TIME_TABS: { key: TimeTab; label: string }[] = [
  { key: 'today',    label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'weekend',  label: 'Weekend' },
  { key: 'week',     label: 'This Week' },
  { key: 'month',    label: 'This Month' },
  { key: 'upcoming', label: 'Upcoming' },
];

const LEVEL_TABS: { key: LevelTab; label: string; icon: React.ElementType }[] = [
  { key: 'local',      label: 'Local',      icon: MapPin },
  { key: 'provincial', label: 'Provincial', icon: MapPin },
  { key: 'national',   label: 'National',   icon: Globe },
  { key: 'global',     label: 'Global',     icon: Globe },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatEventDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch { return dateStr; }
}

function isHappeningNow(event: CityEvent): boolean {
  const now = Date.now();
  return new Date(event.start_time).getTime() <= now && new Date(event.end_time).getTime() >= now;
}

// ── Event Card ────────────────────────────────────────────────────────────────

function EventCard({ event, primaryColor, view }: {
  event: CityEvent;
  primaryColor: string;
  view: 'grid' | 'list';
}) {
  const live = isHappeningNow(event);
  const catCfg = CATEGORIES.find(c => c.key === event.category);

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex gap-4 items-start bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
      >
        {event.image_url && (
          <img src={event.image_url} alt={event.title} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {live && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full animate-pulse">🔴 Live</span>}
            {event.is_free && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Free</span>}
            <span className={`px-2 py-0.5 text-xs rounded-full ${catCfg?.color ?? 'bg-gray-100 text-gray-600'}`}>{catCfg?.label ?? event.category}</span>
            <span className="text-xs text-gray-400 capitalize">{event.level}</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{event.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{event.description}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1"><Clock size={11} /> {formatEventDate(event.start_time)}</span>
            <span className="flex items-center gap-1"><MapPin size={11} /> {event.venue}</span>
            {!event.is_free && event.price_from && (
              <span className="flex items-center gap-1"><Ticket size={11} /> From {event.currency}{event.price_from}</span>
            )}
          </div>
        </div>
        {event.ticket_url && (
          <a href={event.ticket_url} target="_blank" rel="noopener noreferrer"
            style={{ backgroundColor: primaryColor }}
            className="text-white text-xs px-3 py-2 rounded-lg hover:opacity-90 transition flex-shrink-0 flex items-center gap-1">
            Tickets <ExternalLink size={10} />
          </a>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
    >
      <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200">
        {event.image_url
          ? <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
              {catCfg && <catCfg.icon size={40} style={{ color: primaryColor }} className="opacity-40" />}
            </div>
        }
        {live && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
            🔴 Live
          </div>
        )}
        {event.is_free && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">FREE</div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className={`px-2 py-0.5 text-xs rounded-full ${catCfg?.color ?? 'bg-gray-100 text-gray-600'}`}>{catCfg?.label ?? event.category}</span>
          <span className="text-xs text-gray-400 capitalize">{event.level}</span>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{event.title}</h3>
        <div className="text-xs text-gray-500 space-y-0.5">
          <div className="flex items-center gap-1"><Clock size={10} /> {formatEventDate(event.start_time)}</div>
          <div className="flex items-center gap-1"><MapPin size={10} /> {event.venue}</div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: primaryColor }}>
            {event.is_free ? 'Free' : event.price_from ? `From ${event.currency ?? ''}${event.price_from}` : 'Paid'}
          </span>
          {event.ticket_url && (
            <a href={event.ticket_url} target="_blank" rel="noopener noreferrer"
              style={{ backgroundColor: primaryColor }}
              className="text-white text-xs px-3 py-1.5 rounded-lg hover:opacity-90 transition flex items-center gap-1">
              Tickets <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface Props {
  city: City;
  country: string;
  province: string;
  citySlug: string;
}

export default function EventsPageClient({ city, country, province, citySlug }: Props) {
  const [events, setEvents] = useState<CityEvent[]>([]);
  const [recurringEvents, setRecurringEvents] = useState<RecurringEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeTab, setTimeTab] = useState<TimeTab>('week');
  const [levelTab, setLevelTab] = useState<LevelTab>('local');
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'all'>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showMap, setShowMap] = useState(false);
  const [search, setSearch] = useState('');

  const primaryColor = city.primary_color || '#01411C';

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const [cityEvents, recurring] = await Promise.all([
        fetchCityEvents(city.name, city.country, city.country_code, city.lat, city.lng, timeTab, activeCategory === 'all' ? null : activeCategory, levelTab),
        fetchRecurringEvents(city.name),
      ]);
      setEvents(cityEvents);
      setRecurringEvents(recurring);
    } catch (e) {
      console.error('Events load error:', e);
    } finally {
      setLoading(false);
    }
  }, [city, timeTab, activeCategory, levelTab]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const filtered = events.filter(e =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase())
  );
  const liveNow = filtered.filter(isHappeningNow);
  const upcoming = filtered.filter(e => !isHappeningNow(e));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }} className="text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href={`/${country}/${province}/${citySlug}`} className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition">
            <ArrowLeft size={14} /> Back to {city.name}
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={28} className="opacity-80" />
            <h1 className="text-3xl font-bold">{city.name} Events</h1>
          </div>
          <p className="text-white/80 text-sm">
            Discover what's happening in {city.name} — local, national & global events
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Time tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          {TIME_TABS.map(tab => (
            <button key={tab.key} onClick={() => setTimeTab(tab.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${timeTab === tab.key ? 'text-white shadow' : 'bg-white text-gray-600 border hover:border-gray-300'}`}
              style={timeTab === tab.key ? { backgroundColor: primaryColor } : {}}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Level tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          {LEVEL_TABS.map(tab => (
            <button key={tab.key} onClick={() => setLevelTab(tab.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition ${levelTab === tab.key ? 'text-white shadow' : 'bg-white text-gray-600 border hover:border-gray-300'}`}
              style={levelTab === tab.key ? { backgroundColor: primaryColor } : {}}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key as EventCategory | 'all')}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition border ${activeCategory === cat.key ? 'ring-2 ' + cat.color : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
              style={activeCategory === cat.key ? { outlineColor: primaryColor } : {}}>
              <cat.icon size={12} /> {cat.label}
            </button>
          ))}
        </div>

        {/* Search + View toggle */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`Search events in ${city.name}...`}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-white"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties} />
          </div>
          <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-600 hover:border-gray-300 transition flex items-center gap-2 text-sm">
            {view === 'grid' ? <List size={16} /> : <Grid size={16} />}
            {view === 'grid' ? 'List' : 'Grid'}
          </button>
          <button onClick={() => setShowMap(m => !m)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-600 hover:border-gray-300 transition flex items-center gap-2 text-sm">
            <MapPin size={16} /> Map
          </button>
          <button onClick={loadEvents}
            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-600 hover:border-gray-300 transition">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Map view */}
        <AnimatePresence>
          {showMap && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 400 }} exit={{ opacity: 0, height: 0 }} className="mb-6 rounded-2xl overflow-hidden border border-gray-200">
              <EventsMap events={filtered} city={city} primaryColor={primaryColor} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live now banner */}
        {liveNow.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl border-2 border-red-200 bg-red-50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              <span className="font-bold text-red-700 text-sm">Happening Right Now ({liveNow.length})</span>
            </div>
            <div className={`grid gap-3 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {liveNow.map(e => <EventCard key={e.id} event={e} primaryColor={primaryColor} view={view} />)}
            </div>
          </div>
        )}

        {/* Main events grid/list */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-36 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 text-sm">No events found for this filter.</p>
            <p className="text-gray-400 text-xs mt-1">Try changing the time range or category.</p>
          </div>
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-3'}>
            {upcoming.map(e => <EventCard key={e.id} event={e} primaryColor={primaryColor} view={view} />)}
          </div>
        )}

        {/* Recurring events */}
        {recurringEvents.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <Repeat size={18} style={{ color: primaryColor }} />
              <h2 className="text-lg font-bold text-gray-900">Regular Weekly Events</h2>
            </div>
            <RecurringEvents events={recurringEvents} primaryColor={primaryColor} />
          </div>
        )}

        {/* Tour affiliates */}
        <div className="mt-10">
          <TourAffiliates cityName={city.name} primaryColor={primaryColor} />
        </div>

        {/* Submit event */}
        <div className="mt-10">
          <SubmitEvent cityName={city.name} countryCode={city.country_code} primaryColor={primaryColor} />
        </div>

      </div>
    </div>
  );
}
