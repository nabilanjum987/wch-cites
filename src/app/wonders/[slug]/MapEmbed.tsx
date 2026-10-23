'use client';

import { useState } from 'react';

// SEE IT LIVE map block (golden template).
// If NEXT_PUBLIC_GOOGLE_MAPS_KEY exists → Google Maps Embed API tabs
// (Map / Satellite / Street View). If it does not → the OpenStreetMap
// embed fallback (no key needed) + an honest note that satellite and
// Street View arrive with the Google key. Either way there is always a
// "View in Google Earth" link at the exact coordinates — Google offers
// no Earth embed, so a link is the honest route.
export default function MapEmbed({
  lat,
  lng,
  name,
  googleKey,
}: {
  lat: number;
  lng: number;
  name: string;
  googleKey: string | null;
}) {
  const [tab, setTab] = useState<'map' | 'satellite' | 'streetview'>('map');
  const earthUrl = `https://earth.google.com/web/@${lat},${lng},0a,1200d,35y,0h,0t,0r`;
  const osmBbox = `${lng - 0.012},${lat - 0.008},${lng + 0.012},${lat + 0.008}`;
  const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${osmBbox}&layer=mapnik&marker=${lat},${lng}`;

  const googleSrc =
    tab === 'satellite'
      ? `https://www.google.com/maps/embed/v1/view?key=${googleKey}&center=${lat},${lng}&zoom=18&maptype=satellite`
      : tab === 'streetview'
        ? `https://www.google.com/maps/embed/v1/streetview?key=${googleKey}&location=${lat},${lng}`
        : `https://www.google.com/maps/embed/v1/place?key=${googleKey}&q=${encodeURIComponent(name)}&center=${lat},${lng}&zoom=16`;

  return (
    <div>
      {googleKey ? (
        <div className="mb-3 flex gap-2">
          {(['map', 'satellite', 'streetview'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                tab === t ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-200 hover:bg-white/20'
              }`}
            >
              {t === 'streetview' ? 'Street View' : t}
            </button>
          ))}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <iframe
          title={googleKey ? `${name} on Google Maps` : `${name} on OpenStreetMap`}
          src={googleKey ? googleSrc : osmSrc}
          width="100%"
          height="380"
          loading="lazy"
          style={{ border: 0 }}
          allowFullScreen
        />
      </div>
      {!googleKey && (
        <p className="mt-2 text-sm text-gray-400">
          Map shown via OpenStreetMap. Satellite and Street View tabs switch on automatically when the site&apos;s
          Google Maps key is added — no page change needed.
        </p>
      )}
      <a
        href={earthUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
      >
        View in Google Earth →
      </a>
    </div>
  );
}
