'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

interface Event {
  id: string;
  title: string;
  venue: string;
  startTime: string;
  endTime?: string;
  url: string;
  category?: string;
  isFree?: boolean;
}

interface EventbriteEvent {
  id: string;
  name: { text: string };
  venue?: {
    name: string;
    address?: { localized_address_display: string };
  };
  start: { local: string };
  end?: { local: string };
  url: string;
  is_free?: boolean;
}

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
}

const LEVEL_TABS = [
  { id: 'global', label: 'Global', icon: '🌍' },
  { id: 'national', label: 'National', icon: '🏳️' },
  { id: 'province', label: 'Province', icon: '📍' },
  { id: 'local', label: 'Local', icon: '🏙️', defaultActive: true },
];

const TIME_FILTERS = [
  { id: 'today', label: 'Today', defaultActive: true },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
];

const CATEGORY_EMOJIS: Record<string, string> = {
  music: '🎵',
  sports: '⚽',
  business: '💼',
  food: '🍕',
  art: '🎨',
  tech: '💻',
  education: '📚',
  community: '🤝',
  default: '🎯',
};

function getCategoryEmoji(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('music') || lower.includes('concert')) return '🎵';
  if (lower.includes('sport') || lower.includes('game')) return '⚽';
  if (lower.includes('business') || lower.includes('network')) return '💼';
  if (lower.includes('food') || lower.includes('dining')) return '🍕';
  if (lower.includes('art') || lower.includes('gallery')) return '🎨';
  if (lower.includes('tech') || lower.includes('startup')) return '💻';
  if (lower.includes('education') || lower.includes('learn')) return '📚';
  if (lower.includes('community') || lower.includes('meeting')) return '🤝';
  return '🎯';
}

async function fetchEventbrite(
  location: string,
  apiKey: string
): Promise<Event[] | null> {
  if (!apiKey) return null;

  try {
    const encodedLocation = encodeURIComponent(location);
    const response = await fetch(
      `https://www.eventbrite.com/api/v3/events/search/?location.address=${encodedLocation}&token=${apiKey}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.events || data.events.length === 0) return null;

    return data.events.map((event: EventbriteEvent) => ({
      id: event.id,
      title: event.name?.text || 'Untitled Event',
      venue: event.venue?.name || event.venue?.address?.localized_address_display || 'TBD',
      startTime: event.start?.local || '',
      endTime: event.end?.local,
      url: event.url || '#',
      isFree: event.is_free,
    }));
  } catch {
    return null;
  }
}

async function fetchGoogleNewsRSS(query: string): Promise<Event[] | null> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://news.google.com/rss/search?q=${encodedQuery}`
    );
    const text = await response.text();

    const items: RSSItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(text)) !== null) {
      const itemContent = match[1];
      const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>/s.exec(
        itemContent
      );
      const linkMatch = /<link>(.*?)<\/link>/s.exec(itemContent);
      const dateMatch = /<pubDate>(.*?)<\/pubDate>/s.exec(itemContent);

      if (titleMatch && linkMatch) {
        items.push({
          title: titleMatch[1],
          link: linkMatch[1].trim(),
          pubDate: dateMatch ? dateMatch[1] : new Date().toISOString(),
        });
      }
    }

    return items.slice(0, 10).map((item, idx) => ({
      id: `rss-${idx}`,
      title: item.title,
      venue: 'News Event',
      startTime: item.pubDate,
      url: item.link,
    }));
  } catch {
    return null;
  }
}

function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return `Today ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function EventsSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-50 rounded-lg p-4 animate-pulse border border-gray-100"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EventCard({ event, index }: { event: Event; index: number }) {
  return (
    <motion.div
      className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl">
          {getCategoryEmoji(event.title)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 line-clamp-1">{event.title}</p>
          <p className="text-sm text-gray-600 mt-1">{event.venue}</p>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <span>📅</span>
            <span>{formatEventDate(event.startTime)}</span>
          </p>
        </div>
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors"
        >
          {event.isFree !== undefined
            ? event.isFree
              ? 'Free'
              : 'Tickets'
            : 'View'}
        </a>
      </div>
    </motion.div>
  );
}

export function EventsSection({ city }: { city: City }) {
  const [levelTab, setLevelTab] = useState<string>('local');
  const [timeFilter, setTimeFilter] = useState<string>('today');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_EVENTBRITE_API_KEY;

      let location = city.name;
      if (levelTab === 'province') location = city.province;
      else if (levelTab === 'national') location = city.country;
      else if (levelTab === 'global') {
        setEvents([]);
        setLoading(false);
        return;
      }

      let results: Event[] | null = null;

      if (apiKey) {
        results = await fetchEventbrite(location, apiKey);
      }

      if (!results || results.length === 0) {
        results = await fetchGoogleNewsRSS(`${location} events today`);
      }

      if (results) {
        let filtered = results;
        const now = new Date();

        if (timeFilter === 'today') {
          filtered = results.filter((event) => {
            const eventDate = new Date(event.startTime);
            return (
              eventDate.getDate() === now.getDate() &&
              eventDate.getMonth() === now.getMonth() &&
              eventDate.getFullYear() === now.getFullYear()
            );
          });
        } else if (timeFilter === 'week') {
          const weekEnd = new Date(now);
          weekEnd.setDate(weekEnd.getDate() + 7);
          filtered = results.filter((event) => {
            const eventDate = new Date(event.startTime);
            return eventDate >= now && eventDate <= weekEnd;
          });
        } else if (timeFilter === 'month') {
          const monthEnd = new Date(now);
          monthEnd.setMonth(monthEnd.getMonth() + 1);
          filtered = results.filter((event) => {
            const eventDate = new Date(event.startTime);
            return eventDate >= now && eventDate <= monthEnd;
          });
        }

        setEvents(filtered.length > 0 ? filtered : results);
      }
      setLoading(false);
    }

    loadEvents();
  }, [city.name, city.province, city.country, levelTab, timeFilter]);

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${city.lng - 0.05}%2C${city.lat - 0.05}%2C${city.lng + 0.05}%2C${city.lat + 0.05}&layer=mapnik&marker=${city.lat}%2C${city.lng}`;

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">🎉</span>
        Events & Activities
      </h2>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
        {LEVEL_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setLevelTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
              levelTab === tab.id
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>
              {tab.id === 'province'
                ? city.province
                : tab.label}
            </span>
            {tab.defaultActive && levelTab === tab.id && (
              <span className="ml-1 text-xs">✓</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {TIME_FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setTimeFilter(filter.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              timeFilter === filter.id
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {filter.label} {filter.defaultActive && timeFilter === filter.id && '✓'}
          </button>
        ))}
      </div>

      <div className="min-h-[350px] mb-4">
        {loading ? (
          <EventsSkeleton />
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-3">🎭</p>
            <p>No events found for this location</p>
            <p className="text-sm mt-2">Try expanding your search area or time range</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, idx) => (
              <EventCard key={event.id + idx} event={event} index={idx} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <button
          onClick={() => setShowMap(!showMap)}
          className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <span>🗺️</span>
          <span>{showMap ? 'Hide' : 'Show'} Events Map</span>
        </button>

        {showMap && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 300, opacity: 1 }}
            className="mt-4 rounded-lg overflow-hidden border border-gray-200"
          >
            <iframe
              src={mapUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              title="Events Map"
            />
          </motion.div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
}
