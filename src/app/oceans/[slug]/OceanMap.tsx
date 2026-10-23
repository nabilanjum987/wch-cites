'use client';

import { useState } from 'react';

// SEE IT LIVE map block for oceans — same contract as the wonder
// template: Google Maps Embed tabs (Map / Satellite) when
// NEXT_PUBLIC_GOOGLE_MAPS_KEY exists, OpenStreetMap embed fallback
// until then, and a Google Earth link at the representative point
// either way (Google offers no Earth embed; a link is the honest
// route). Oceans have no Street View, so no street-view tab is
// offered — nothing is promised that cannot be delivered.
export default function OceanMap({
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
  const [tab, setTab] = useState<'map' | 'satellite'>('map');
  const earthUrl = `https://earth.google.com/web/@${lat},${lng},0a,3500000d,35y,0h,0t,0r`;
  const osmBbox = `${lng - 16},${lat - 9},${lng + 16},${lat + 9}`;
  const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${osmBbox}&layer=mapnik&marker=${lat},${lng}`;

  const googleSrc =
    tab === 'satellite'
      ? `https://www.google.com/maps/embed/v1/view?key=${googleKey}&center=${lat},${lng}&zoom=4&maptype=satellite`
      : `https://www.google.com/maps/embed/v1/view?key=${googleKey}&center=${lat},${lng}&zoom=4`;

  return (
    <div>
      {googleKey ? (
        <div className="mb-3 flex gap-2">
          {(['map', 'satellite'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                tab === t ? 'bg-sky-500 text-black' : 'bg-white/10 text-gray-200 hover:bg-white/20'
              }`}
            >
              {t}
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
          Map shown via OpenStreetMap. The satellite tab switches on automatically when the site&apos;s Google Maps
          key is added — no page change needed.
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
