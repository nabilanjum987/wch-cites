'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { CityEvent, EventCategory, City } from '../../types/city';

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
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    const map = L.map(mapRef.current).setView([city.lat, city.lng], 13);
    mapInstanceRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [events, city, primaryColor]);

  return <div ref={mapRef} className="w-full h-[420px] bg-gray-100" />;
}
