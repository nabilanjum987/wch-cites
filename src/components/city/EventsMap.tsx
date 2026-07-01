'use client';
import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import type { CityEvent, EventCategory, City } from '../../types/city';
// NOTE: Leaflet is intentionally NOT imported at module top-level (only its TYPES, above,
// which are erased at compile time and carry zero runtime cost / no `window` reference).
// Leaflet's actual JS module references `window` as soon as it's evaluated, which breaks
// Next.js server-side rendering even inside a 'use client' file, since Next still
// performs an initial SSR pass on client components. Loading the real module lazily
// inside useEffect (browser-only, after mount) avoids that entirely.

const CATEGORY_PIN_COLORS: Record<string, string> = {
  sports: '#3B82F6',
  culture: '#D97706',
  music: '#EC4899',
  food: '#F97316',
  religious: '#14B8A6',
  business: '#64748B',
};

interface Props {
  events: CityEvent[];
  city: City;
  primaryColor: string;
}

export default function EventsMap({ events, city, primaryColor }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    import('leaflet').then((leafletModule) => {
      if (cancelled || !mapRef.current) return;
      const L = leafletModule.default;
      // Import CSS only once on the client; safe to call repeatedly.
      import('leaflet/dist/leaflet.css');

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      const map = L.map(mapRef.current).setView([city.lat, city.lng], 13);
      mapInstanceRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    });

    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [events, city, primaryColor]);

  return <div ref={mapRef} className="w-full h-[420px] bg-gray-100" />;
}
