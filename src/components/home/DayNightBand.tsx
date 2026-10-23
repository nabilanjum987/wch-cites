'use client';

// ─────────────────────────────────────────────────────────────────────────
// DAY / NIGHT WORLD BAND (owner addendum 2026-10-23, Polish Card 4) —
// sits directly under the hero. A diagram, not a photo: a simplified
// inline-SVG world silhouette (equirectangular) with the night half of
// the planet shaded. The terminator is COMPUTED from the real UTC time
// — subsolar longitude λ = (12 − UTC hours) × 15°, solar declination
// from the day of year — and re-computed on a 30-second tick. The six
// city dots are the same six cities as the hero clocks above. No map
// tiles, no external assets, no new API: the whole band is a few KB of
// SVG + math, so it costs the speed budget almost nothing.
// ─────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';

// [lon, lat] polygons — deliberately coarse silhouettes for a diagram.
const CONTINENTS: [number, number][][] = [
  // North America
  [[-165, 68], [-150, 70], [-135, 69], [-125, 71], [-112, 68], [-100, 69], [-90, 69], [-82, 66], [-78, 62], [-80, 58], [-76, 55], [-79, 51], [-85, 50], [-90, 48], [-95, 46], [-89, 42], [-84, 40], [-79, 38], [-75, 36], [-76, 32], [-80, 28], [-81, 25], [-84, 28], [-89, 29], [-94, 29], [-97, 26], [-97, 22], [-94, 18], [-90, 15], [-86, 13], [-83, 9], [-79, 9], [-82, 12], [-87, 15], [-92, 15], [-97, 16], [-102, 18], [-105, 22], [-110, 24], [-114, 29], [-120, 33], [-124, 40], [-124, 46], [-130, 54], [-140, 60], [-155, 60], [-165, 60]],
  // South America
  [[-79, 9], [-75, 11], [-70, 12], [-62, 10], [-55, 6], [-50, 0], [-44, -3], [-38, -6], [-40, -12], [-40, -20], [-46, -24], [-52, -28], [-56, -34], [-58, -39], [-62, -41], [-65, -45], [-67, -50], [-68, -54], [-71, -54], [-73, -50], [-73, -44], [-73, -37], [-71, -30], [-70, -20], [-70, -15], [-75, -10], [-78, -6], [-80, -3], [-77, 1], [-79, 5]],
  // Africa
  [[-6, 35], [0, 36], [10, 37], [20, 32], [30, 31], [34, 28], [38, 22], [40, 18], [43, 12], [48, 11], [51, 10], [48, 4], [42, -2], [40, -8], [38, -16], [36, -22], [33, -27], [28, -33], [20, -35], [17, -32], [15, -27], [13, -20], [12, -12], [13, -6], [9, -1], [9, 4], [4, 6], [-2, 5], [-8, 5], [-13, 8], [-16, 12], [-17, 16], [-16, 21], [-14, 26], [-10, 30]],
  // Madagascar
  [[44, -12], [49, -14], [50, -18], [47, -24], [45, -25], [44, -20], [43, -16]],
  // Eurasia
  [[-9, 43], [-2, 48], [-5, 50], [0, 52], [5, 53], [8, 55], [8, 57], [12, 56], [18, 56], [20, 54], [24, 58], [25, 60], [22, 63], [25, 66], [30, 68], [35, 66], [32, 70], [40, 68], [50, 69], [60, 70], [70, 72], [80, 73], [90, 75], [100, 77], [110, 74], [120, 73], [130, 72], [140, 72], [150, 70], [160, 70], [170, 66], [178, 65], [178, 62], [165, 60], [158, 55], [155, 50], [150, 45], [142, 42], [140, 38], [138, 35], [135, 34], [130, 33], [127, 35], [122, 31], [120, 26], [115, 23], [110, 20], [108, 15], [106, 9], [103, 5], [100, 7], [98, 12], [95, 16], [92, 16], [90, 22], [88, 22], [86, 20], [82, 16], [80, 13], [77, 8], [73, 18], [70, 22], [66, 25], [61, 25], [57, 26], [54, 26], [52, 28], [50, 29], [48, 30], [50, 25], [55, 24], [58, 23], [59, 22], [55, 17], [52, 15], [45, 12], [43, 12], [40, 15], [38, 20], [36, 24], [35, 28], [34, 31], [36, 36], [33, 36], [30, 36], [27, 37], [23, 36], [20, 38], [19, 40], [15, 40], [12, 42], [10, 44], [7, 44], [3, 43], [0, 40], [-2, 37], [-6, 36], [-9, 37]],
  // Indonesia (coarse)
  [[95, 5], [105, 0], [115, -2], [125, -3], [135, -4], [145, -5], [140, -8], [130, -8], [120, -9], [110, -7], [100, -3]],
  // Japan (coarse)
  [[130, 31], [133, 34], [137, 35], [140, 36], [141, 40], [142, 44], [140, 45], [138, 40], [135, 34], [131, 32]],
  // Australia
  [[113, -22], [114, -28], [115, -34], [118, -35], [124, -33], [129, -32], [132, -32], [135, -35], [138, -36], [140, -38], [145, -38], [150, -37], [153, -32], [153, -27], [151, -24], [149, -20], [146, -19], [143, -15], [142, -11], [141, -13], [140, -18], [139, -20], [136, -15], [135, -12], [132, -11], [130, -12], [126, -14], [122, -17], [118, -20]],
  // New Zealand (coarse)
  [[167, -45], [172, -41], [174, -38], [176, -37], [174, -35], [171, -40], [168, -46]],
];

// The same six cities as the hero clocks (HeroClocks.tsx).
const CITIES: { name: string; lon: number; lat: number; anchor?: 'start' | 'end' | 'middle' | 'inherit'; dx?: number }[] = [
  { name: 'London', lon: -0.13, lat: 51.5 },
  { name: 'Dubai', lon: 55.27, lat: 25.2, anchor: 'end', dx: -6 },
  { name: 'Karachi', lon: 67.0, lat: 24.86, anchor: 'start', dx: 6 },
  { name: 'New York', lon: -73.99, lat: 40.71 },
  { name: 'Tokyo', lon: 139.69, lat: 35.69 },
  { name: 'Sydney', lon: 151.21, lat: -33.87 },
];

const X = (lon: number) => (lon + 180) * 2; // viewBox 720 wide
const Y = (lat: number) => (90 - lat) * 2; // viewBox 360 high

function pathOf(pts: [number, number][]): string {
  return pts.map(([lon, lat], i) => `${i === 0 ? 'M' : 'L'}${X(lon).toFixed(0)},${Y(lat).toFixed(0)}`).join(' ') + ' Z';
}

const LAND_PATHS = CONTINENTS.map(pathOf);

export default function DayNightBand() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
  const sunLon = ((12 - utcHours) * 15 + 540) % 360 - 180;
  // Solar declination from the day of year (standard approximation).
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start) / 86400000);
  const decl = -23.44 * Math.cos(((2 * Math.PI) / 365) * (dayOfYear + 10));
  const sunX = X(sunLon);
  const sunY = Y(decl);
  const nightStartX = (sunX + 180) % 720;
  const utcLabel = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`;

  return (
    <section className="px-4 pt-10" style={{ backgroundColor: '#0a0f1e' }} aria-label="Day and night across the world right now">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">Day &amp; Night — Live</h2>
            <p className="text-xs text-white/50 tabular-nums">{utcLabel} · the shaded half of the planet is in night right now</p>
          </div>
          <svg viewBox="0 30 720 300" className="mt-2 block h-52 w-full sm:h-64" role="img"
            aria-label={`World map showing the day and night halves of the Earth at ${utcLabel}`}>
            <defs>
              <linearGradient id="wch-night" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#020617" stopOpacity="0" />
                <stop offset="10%" stopColor="#020617" stopOpacity="0.62" />
                <stop offset="90%" stopColor="#020617" stopOpacity="0.62" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="wch-sun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
            </defs>
            {LAND_PATHS.map((d, i) => (
              <path key={i} d={d} fill="rgba(148,197,255,0.16)" stroke="rgba(148,197,255,0.35)" strokeWidth="1" />
            ))}
            {/* Night half (180° wide), drawn twice for the wrap-around seam */}
            <rect x={nightStartX} y="30" width="360" height="300" fill="url(#wch-night)" />
            <rect x={nightStartX - 720} y="30" width="360" height="300" fill="url(#wch-night)" />
            {/* Subsolar glow + point */}
            <circle cx={sunX} cy={sunY} r="46" fill="url(#wch-sun)" />
            <circle cx={sunX} cy={sunY} r="4" fill="#fbbf24" />
            {CITIES.map((c) => {
              const day = Math.abs(((c.lon - sunLon + 540) % 360) - 180) < 90;
              return (
                <g key={c.name}>
                  <circle cx={X(c.lon)} cy={Y(c.lat)} r="3.2" fill={day ? '#fbbf24' : '#7dd3fc'} stroke="#0a0f1e" strokeWidth="1" />
                  <text x={X(c.lon) + (c.dx ?? 0)} y={Y(c.lat) - 7} textAnchor={c.anchor ?? 'middle'} fontSize="9.5" fill="rgba(255,255,255,0.75)">{c.name}</text>
                </g>
              );
            })}
          </svg>
          <p className="mt-1 text-[11px] leading-relaxed text-white/35">
            Diagram computed live from the UTC clock: the sun&apos;s position uses the subsolar longitude and today&apos;s solar
            declination; gold dots are in daylight, blue dots in night. The six cities match the world clocks above. Simplified
            coastline — a diagram, not a survey map.
          </p>
        </div>
      </div>
    </section>
  );
}
