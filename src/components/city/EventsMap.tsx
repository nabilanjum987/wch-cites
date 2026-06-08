'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ExternalLink, Clock, Ticket } from 'lucide-react';
import type { CityEvent, EventCategory, City } from '../../types/city';

const CATEGORY_PIN_COLORS: Record<EventCategory, string> = {
  sports: '#3B82F6',
  culture: '#D97706',
  music: '#EC4899',
  literature: '#10B981',
  food: '#F97316',
  religious: '#14B8A6',
  business: '#64748B',
  film: '#EF4444',
  outdoor: '#22C55E',
  family: '#EAB308',
  conferences: '#06B6D4',
};

interface Props {
  events: CityEvent[];
  city: City;
  primaryColor: string;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
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

    const map = L.map(mapRef.current, {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView([city.lat, city.lng], 13);

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const eventsWithLocation = events.filter((e) => e.lat != null && e.lng != null);

    eventsWithLocation.forEach((ev) => {
      const pinColor = CATEGORY_PIN_COLORS[ev.category] ?? '#6B7280';

      const icon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="
          width: 28px; height: 28px; border-radius: 50%;
          background: ${pinColor}; border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.3)'" onmouseout="this.style.transform='scale(1)'">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
      });

      const catLabel = ev.category.charAt(0).toUpperCase() + ev.category.slice(1);
      const popupContent = `
        <div style="font-family:Inter,sans-serif; min-width:220px; max-width:280px;">
          ${ev.image_url ? `<img src="${ev.image_url}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px;" alt="${ev.title}" />` : ''}
          <div style="font-size:11px;font-weight:600;color:${pinColor};text-transform:uppercase;margin-bottom:4px;">${catLabel}</div>
          <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:4px;line-height:1.3;">${ev.title}</div>
          <div style="font-size:12px;color:#6B7280;margin-bottom:2px;">📍 ${ev.venue}</div>
          <div style="font-size:12px;color:#6B7280;margin-bottom:2px;">🕐 ${formatDate(ev.start_time)} · ${formatTime(ev.start_time)}</div>
          ${ev.is_free ? '<div style="font-size:11px;font-weight:700;color:#22C55E;margin-top:4px;">FREE ENTRY</div>' : ev.price_from != null ? `<div style="font-size:11px;font-weight:600;color:#374151;margin-top:4px;">From ${ev.currency ?? ''} ${ev.price_from}</div>` : ''}
          ${ev.ticket_url ? `<a href="${ev.ticket_url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:8px;padding:6px 14px;background:${primaryColor};color:white;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;">Get Tickets →</a>` : ''}
        </div>
      `;

      L.marker([ev.lat!, ev.lng!], { icon })
        .addTo(map)
        .bindPopup(popupContent, { maxWidth: 300 });
    });

    if (eventsWithLocation.length > 0) {
      const bounds = L.latLngBounds(eventsWithLocation.map((e) => [e.lat!, e.lng!] as [number, number]));
      map.fitBounds(bounds.pad(0.15));
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [events, city, primaryColor]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={18} style={{ color: primaryColor }} />
          <h2 className="font-semibold text-gray-900 text-sm">Events Map</h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(CATEGORY_PIN_COLORS).slice(0, 6).map(([cat, color]) => (
            <span key={cat} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </span>
          ))}
          <span className="text-xs text-gray-400">+{events.filter((e) => e.lat != null).length} pinned</span>
        </div>
      </div>
      <div ref={mapRef} className="w-full h-[420px] bg-gray-100" />
    </div>
  );
}
