'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// === TYPES ===
interface GeoLocation {
  lat: number;
  lng: number;
  accuracy: number;
}

interface ReverseGeocode {
  displayName: string;
  neighbourhood: string;
  suburb: string;
  city: string;
  county: string;
  state: string;
  country: string;
  countryCode: string;
  postcode: string;
}

interface NearbyPlace {
  id: string;
  name: string;
  type: string;
  amenity: string;
  lat: number;
  lng: number;
  distance: number;
  walkingTime: number;
  address?: string;
}

interface WeatherData {
  temp: string;
  condition: string;
  humidity: string;
  wind: string;
  icon: string;
}

interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface EventItem {
  id: string;
  title: string;
  venue: string;
  date: string;
  url: string;
}

interface NewsItem {
  title: string;
  description: string;
  image: string;
  url: string;
  source: string;
}

interface TimeZoneCity {
  city: string;
  country: string;
  timezone: string;
  time: string;
  date: string;
  offset: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const EMERGENCY_NUMBERS: Record<string, { police: string; ambulance: string; fire: string }> = {
  PK: { police: '15', ambulance: '1122', fire: '16' },
  US: { police: '911', ambulance: '911', fire: '911' },
  GB: { police: '999', ambulance: '999', fire: '999' },
  IN: { police: '100', ambulance: '108', fire: '101' },
  AU: { police: '000', ambulance: '000', fire: '000' },
  DE: { police: '110', ambulance: '112', fire: '112' },
  FR: { police: '17', ambulance: '15', fire: '18' },
  JP: { police: '110', ambulance: '119', fire: '119' },
  AE: { police: '999', ambulance: '998', fire: '997' },
  SA: { police: '911', ambulance: '993', fire: '998' },
};

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

function formatWalkingTime(meters: number): string {
  const minutes = Math.round(meters / 80);
  if (minutes < 60) return `${minutes} min walk`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className ?? ''}`} />;
}

function LocationRequestCard({ onRequest }: { onRequest: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto px-4 py-12"
    >
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-6"
        >
          📍
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Discover your world right now
        </h1>
        <p className="text-gray-500 mb-6">
          Get local weather, prayer times, nearby places & more
        </p>
        <button
          onClick={onRequest}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-xl">📍</span>
          Share My Location
        </button>
        <p className="text-xs text-gray-400 mt-4">
          We never store your location. It&apos;s only used to show local info.
        </p>
      </div>
    </motion.div>
  );
}

function LocationPinDrop() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50"
    >
      <div className="text-center">
        <motion.div
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-8xl mb-4"
        >
          📍
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white text-lg"
        >
          Detecting your location...
        </motion.p>
      </div>
    </motion.div>
  );
}

function LocationHeader({ location, geo }: { location: ReverseGeocode; geo: GeoLocation }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">You are in</p>
          <h1 className="text-xl font-bold leading-tight">
            {location.neighbourhood || location.suburb || location.city}
          </h1>
          <p className="text-gray-300 mt-1">
            {location.city}, {location.state}, {location.country}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {geo.lat.toFixed(4)}, {geo.lng.toFixed(4)}
          </p>
        </div>
        <a
          href={`https://www.openstreetmap.org/?mlat=${geo.lat}&mlon=${geo.lng}#map=15/${geo.lat}/${geo.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm transition-colors"
        >
          View Map
        </a>
      </div>
    </motion.div>
  );
}

function WeatherCard({ weather }: { weather: WeatherData }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-2xl border border-gray-100 p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-wide">Weather</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold text-gray-900">{weather.temp}</span>
            <span className="text-gray-500">| {weather.condition}</span>
          </div>
          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            <span>💧 {weather.humidity}</span>
            <span>💨 {weather.wind}</span>
          </div>
        </div>
        <div className="text-5xl">{weather.icon}</div>
      </div>
    </motion.div>
  );
}

function PrayerTimesCard({ times }: { times: PrayerTimes }) {
  const prayers = [
    { name: 'Fajr', time: times.fajr, icon: '🌅' },
    { name: 'Dhuhr', time: times.dhuhr, icon: '☀️' },
    { name: 'Asr', time: times.asr, icon: '🌤️' },
    { name: 'Maghrib', time: times.maghrib, icon: '🌅' },
    { name: 'Isha', time: times.isha, icon: '🌙' },
  ];

  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-2xl border border-gray-100 p-5"
    >
      <h3 className="font-bold text-gray-900 mb-3">Prayer Times</h3>
      <div className="grid grid-cols-5 gap-2">
        {prayers.map(p => (
          <div key={p.name} className="text-center">
            <span className="text-xl">{p.icon}</span>
            <p className="text-xs text-gray-500 mt-1">{p.name}</p>
            <p className="text-sm font-semibold text-gray-900">{p.time}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function NearbyPlacesSection({ places }: { places: NearbyPlace[] }) {
  const mosques = places.filter(p => p.amenity === 'mosque' || p.amenity === 'place_of_worship').slice(0, 3);
  const restaurants = places.filter(p => p.amenity === 'restaurant' || p.amenity === 'fast_food' || p.amenity === 'cafe').slice(0, 3);
  const hospital = places.find(p => p.amenity === 'hospital' || p.amenity === 'clinic');
  const pharmacy = places.find(p => p.amenity === 'pharmacy');
  const petrol = places.find(p => p.amenity === 'fuel');

  const PlaceCard = ({ place, icon }: { place: NearbyPlace; icon: string }) => (
    <a
      href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-50 hover:bg-gray-100 rounded-xl p-3 flex items-center gap-3 transition-colors"
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{place.name || place.amenity}</p>
        <p className="text-xs text-gray-500">
          {formatDistance(place.distance)} · {formatWalkingTime(place.distance)}
        </p>
      </div>
      <span className="text-blue-600 text-sm">Directions →</span>
    </a>
  );

  return (
    <motion.section variants={fadeUp}>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Nearby Places</h2>

      {mosques.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <span>🕌</span> Mosques
          </h4>
          <div className="space-y-2">
            {mosques.map(p => <PlaceCard key={p.id} place={p} icon="🕌" />)}
          </div>
        </div>
      )}

      {restaurants.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <span>🍽️</span> Restaurants & Cafes
          </h4>
          <div className="space-y-2">
            {restaurants.map(p => <PlaceCard key={p.id} place={p} icon="🍽️" />)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {hospital && <PlaceCard place={hospital} icon="🏥" />}
        {pharmacy && <PlaceCard place={pharmacy} icon="💊" />}
        {petrol && <PlaceCard place={petrol} icon="⛽" />}
      </div>
    </motion.section>
  );
}

function EmergencySection({ countryCode }: { countryCode: string }) {
  const numbers = EMERGENCY_NUMBERS[countryCode.toUpperCase()] || EMERGENCY_NUMBERS.US;

  return (
    <motion.section variants={fadeUp}>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Emergency Contacts</h2>
      <div className="grid grid-cols-3 gap-3">
        <a
          href={`tel:${numbers.police}`}
          className="bg-red-600 hover:bg-red-700 text-white rounded-2xl p-4 text-center transition-colors"
        >
          <span className="text-3xl">🚔</span>
          <p className="font-bold mt-2">Police</p>
          <p className="text-2xl font-bold">{numbers.police}</p>
        </a>
        <a
          href={`tel:${numbers.ambulance}`}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl p-4 text-center transition-colors"
        >
          <span className="text-3xl">🚑</span>
          <p className="font-bold mt-2">Ambulance</p>
          <p className="text-2xl font-bold">{numbers.ambulance}</p>
        </a>
        <a
          href={`tel:${numbers.fire}`}
          className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl p-4 text-center transition-colors"
        >
          <span className="text-3xl">🚒</span>
          <p className="font-bold mt-2">Fire</p>
          <p className="text-2xl font-bold">{numbers.fire}</p>
        </a>
      </div>
    </motion.section>
  );
}

function EventsNearbySection({ events }: { events: EventItem[] }) {
  if (events.length === 0) return null;

  return (
    <motion.section variants={fadeUp}>
      <h2 className="text-lg font-bold text-gray-900 mb-4">What&apos;s Happening Nearby</h2>
      <div className="space-y-3">
        {events.map(e => (
          <a
            key={e.id}
            href={e.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            <h4 className="font-semibold text-gray-900">{e.title}</h4>
            <p className="text-sm text-gray-500">{e.venue} · {e.date}</p>
          </a>
        ))}
      </div>
    </motion.section>
  );
}

function WorldClockSection({ cities }: { cities: TimeZoneCity[] }) {
  return (
    <motion.section variants={fadeUp}>
      <h2 className="text-lg font-bold text-gray-900 mb-4">World Clock</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cities.map(c => (
          <div
            key={c.city}
            className={`bg-white rounded-xl border p-4 ${c.city === 'Your Location' ? 'border-2 border-blue-500' : 'border-gray-100'}`}
          >
            <p className="font-semibold text-gray-900">{c.city}</p>
            <p className="text-xs text-gray-400">{c.country}</p>
            <p className="text-xl font-bold text-gray-900 mt-2">{c.time}</p>
            <p className="text-xs text-gray-400">{c.date} · {c.offset}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function ShareLocationSection({ lat, lng }: { lat: number; lng: number }) {
  const shareUrl = `https://worldcityhub.com/location/${lat.toFixed(6)},${lng.toFixed(6)}`;
  const message = `Check out my location: ${shareUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <motion.section variants={fadeUp}>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Share Location</h2>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-400 mb-1">Shareable Link</p>
          <p className="text-sm font-mono text-gray-700 break-all">{shareUrl}</p>
        </div>
        <div className="flex gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <span>📱</span> WhatsApp
          </a>
          <button
            onClick={copyToClipboard}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <span>📋</span> Copy Link
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function PrivacyNotice() {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-blue-50 rounded-xl p-4 text-center"
    >
      <p className="text-sm text-blue-800">
        📍 Your location is <strong>NEVER stored</strong>. Used only to show local info.
        Close tab to clear.
      </p>
    </motion.div>
  );
}

function ConditionalAffiliates({ aqi, isTraveling }: { aqi?: number; isTraveling?: boolean }) {
  return (
    <motion.section variants={fadeUp}>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended</h2>
      <div className="grid grid-cols-2 gap-3">
        {aqi && aqi > 100 && (
          <a
            href="https://www.amazon.com/s?k=n95+mask&tag=worldcityhub-20"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="bg-amber-50 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">😷</span>
            <p className="font-bold text-gray-900 mt-2">Shop N95 Masks</p>
            <p className="text-xs text-gray-600">Air quality is poor today</p>
          </a>
        )}
        {isTraveling && (
          <>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="bg-blue-50 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">🔒</span>
              <p className="font-bold text-gray-900 mt-2">NordVPN</p>
              <p className="text-xs text-gray-600">40% off secure browsing</p>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="bg-green-50 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">💸</span>
              <p className="font-bold text-gray-900 mt-2">Wise</p>
              <p className="text-xs text-gray-600">$25 free transfer</p>
            </a>
          </>
        )}
      </div>
    </motion.section>
  );
}

export default function MyLocationPage() {
  const [status, setStatus] = useState<'requesting' | 'detecting' | 'detected' | 'error'>('requesting');
  const [geo, setGeo] = useState<GeoLocation | null>(null);
  const [location, setLocation] = useState<ReverseGeocode | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [worldClock, setWorldClock] = useState<TimeZoneCity[]>([]);

  const requestLocation = useCallback(() => {
    setStatus('detecting');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const geoData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setGeo(geoData);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${geoData.lat}&lon=${geoData.lng}&format=json`,
            { headers: { 'User-Agent': 'WorldCityHub/1.0' } }
          );

          if (!res.ok) throw new Error('Geocode failed');

          const data = await res.json();
          const loc: ReverseGeocode = {
            displayName: data.display_name,
            neighbourhood: data.address?.neighbourhood || data.address?.quarter || '',
            suburb: data.address?.suburb || data.address?.residential || '',
            city: data.address?.city || data.address?.town || data.address?.village || '',
            county: data.address?.county || '',
            state: data.address?.state || '',
            country: data.address?.country || '',
            countryCode: data.address?.country_code?.toUpperCase() || 'US',
            postcode: data.address?.postcode || '',
          };
          setLocation(loc);
          setStatus('detected');
          loadAllData(geoData, loc);
        } catch {
          setStatus('error');
        }
      },
      () => setStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const loadAllData = async (geoData: GeoLocation, loc: ReverseGeocode) => {
    loadWeather(geoData);
    loadPrayerTimes(geoData);
    loadNearbyPlaces(geoData);
    loadWorldClock(loc.countryCode);
  };

  const loadWeather = async (geoData: GeoLocation) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${geoData.lat}&longitude=${geoData.lng}&current_weather=true`
      );
      const data = await res.json();
      setWeather({
        temp: `${Math.round(data.current_weather.temperature)}°C`,
        condition: weatherCodeToCondition(data.current_weather.weathercode),
        humidity: 'N/A',
        wind: `${data.current_weather.windspeed} km/h`,
        icon: weatherCodeToIcon(data.current_weather.weathercode),
      });
    } catch {}
  };

  const loadPrayerTimes = async (geoData: GeoLocation) => {
    try {
      const date = new Date();
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${Math.floor(date.getTime() / 1000)}?latitude=${geoData.lat}&longitude=${geoData.lng}&method=2`
      );
      const data = await res.json();
      setPrayerTimes({
        fajr: data.data.timings.Fajr,
        dhuhr: data.data.timings.Dhuhr,
        asr: data.data.timings.Asr,
        maghrib: data.data.timings.Maghrib,
        isha: data.data.timings.Isha,
      });
    } catch {}
  };

  const loadNearbyPlaces = async (geoData: GeoLocation) => {
    const types = [
      'node[amenity=mosque](around:2000,{lat},{lng})',
      'node[amenity=place_of_worship][religion=islam](around:2000,{lat},{lng})',
      'node[amenity=restaurant](around:2000,{lat},{lng})',
      'node[amenity=fast_food](around:2000,{lat},{lng})',
      'node[amenity=cafe](around:2000,{lat},{lng})',
      'node[amenity=hospital](around:2000,{lat},{lng})',
      'node[amenity=clinic](around:2000,{lat},{lng})',
      'node[amenity=pharmacy](around:2000,{lat},{lng})',
      'node[amenity=fuel](around:2000,{lat},{lng})',
    ];

    const query = `
      [out:json][timeout:25];
      (
        ${types.map(t => t.replace('{lat}', geoData.lat.toString()).replace('{lng}', geoData.lng.toString())).join(';')}
      );
      out body;
    `;

    try {
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
      });
      const data = await res.json();

      const places: NearbyPlace[] = (data.elements || []).map((el: any) => {
        const dx = (el.lat - geoData.lat) * 111000;
        const dy = (el.lon - geoData.lng) * 111000 * Math.cos(geoData.lat * Math.PI / 180);
        const distance = Math.sqrt(dx * dx + dy * dy);

        return {
          id: el.id.toString(),
          name: el.tags?.name || el.tags?.name:en || '',
          type: el.tags?.amenity || 'place',
          amenity: el.tags?.amenity || 'place',
          lat: el.lat,
          lng: el.lon,
          distance,
          walkingTime: Math.round(distance / 80),
          address: el.tags?.['addr:street'] || '',
        };
      });

      setNearbyPlaces(places.sort((a, b) => a.distance - b.distance));
    } catch {}
  };

  const loadWorldClock = (countryCode: string) => {
    const zones = [
      { city: 'Your Location', country: location?.country || '', zone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      { city: 'London', country: 'UK', zone: 'Europe/London' },
      { city: 'New York', country: 'USA', zone: 'America/New_York' },
      { city: 'Dubai', country: 'UAE', zone: 'Asia/Dubai' },
      { city: 'Tokyo', country: 'Japan', zone: 'Asia/Tokyo' },
      { city: 'Sydney', country: 'Australia', zone: 'Australia/Sydney' },
    ];

    const clockData = zones.map(z => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: z.zone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: z.zone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      };
      const offset = new Intl.DateTimeFormat('en-US', { timeZone: z.zone, timeZoneName: 'shortOffset' })
        .format(now)
        .split(' ')
        .pop();

      return {
        city: z.city,
        country: z.country,
        timezone: z.zone,
        time: now.toLocaleTimeString('en-US', options),
        date: now.toLocaleDateString('en-US', dateOptions),
        offset: offset || '',
      };
    });

    setWorldClock(clockData);
  };

  if (status === 'requesting') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LocationRequestCard onRequest={requestLocation} />
      </div>
    );
  }

  if (status === 'detecting') {
    return <LocationPinDrop />;
  }

  if (status === 'error' || !geo || !location) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
          <span className="text-6xl">😕</span>
          <h2 className="text-xl font-bold text-gray-900 mt-4">Location not available</h2>
          <p className="text-gray-500 mt-2">
            Please enable location permissions in your browser settings.
          </p>
          <button
            onClick={() => setStatus('requesting')}
            className="mt-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <LocationHeader location={location} geo={geo} />

        <div className="grid md:grid-cols-2 gap-4">
          {weather && <WeatherCard weather={weather} />}
          {prayerTimes && <PrayerTimesCard times={prayerTimes} />}
        </div>

        <NearbyPlacesSection places={nearbyPlaces} />

        <EmergencySection countryCode={location.countryCode} />

        <EventsNearbySection events={events} />

        <WorldClockSection cities={worldClock} />

        <ShareLocationSection lat={geo.lat} lng={geo.lng} />

        <ConditionalAffiliates aqi={undefined} isTraveling={false} />

        <PrivacyNotice />
      </main>
    </div>
  );
}

function weatherCodeToCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Clear',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    95: 'Thunderstorm',
  };
  return conditions[code] || 'Unknown';
}

function weatherCodeToIcon(code: number): string {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '🌨️';
  if (code >= 80) return '🌧️';
  if (code >= 95) return '⛈️';
  return '🌤️';
}
