// ─────────────────────────────────────────────────────────────────────────────
// Computed transits (Round 2, R8) — REAL planetary positions, no randomness.
//
// Method: the standard low-precision geocentric ecliptic longitudes of Paul
// Schlyter's "How to compute planetary positions" (the widely used amateur/
// professional reference implementation of Keplerian orbital elements):
//   1. Orbital elements (N, i, w, a, e, M) as linear functions of the day
//      number d (days since 2000 Jan 0.0, JD 2451543.5).
//   2. Solve Kepler's equation for the eccentric anomaly (iteration).
//   3. Heliocentric ecliptic coordinates → geocentric for the planets; the
//      Moon is computed geocentrically with Schlyter's principal
//      perturbation terms (Sun's anomaly Ms, Moon's anomaly Mm, mean
//      elongation D, argument of latitude F).
// Accuracy is arcminute-class for the Sun and inner planets and within a
// few tenths of a degree worst-case for the Moon and outers — far inside
// the 30° sign buckets and the 6–8° aspect orbs used below. Positions are
// LABELLED computed everywhere they are shown; this is astronomy in
// service of an entertainment feature, and the page says so.
//
// Pluto is omitted deliberately (248-year period; Scorpio is read through
// its traditional ruler Mars, as much of the tradition does).
// ─────────────────────────────────────────────────────────────────────────────

export type PlanetKey =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune';

export interface PlanetPosition {
  planet: PlanetKey;
  label: string;
  /** Geocentric ecliptic longitude, degrees 0–360. */
  longitude: number;
  sign: string;
  signKey: string;
  /** Degree within the sign, 0–30. */
  degreeInSign: number;
  retrograde: boolean;
}

export interface Aspect {
  a: PlanetKey;
  b: PlanetKey;
  kind: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
  angle: number;
  orb: number;
  harmonious: boolean;
}

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

const rev = (x: number) => x - Math.floor(x / 360) * 360;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Schlyter day number: days since 2000 Jan 0.0 (JD 2451543.5). */
export function dayNumber(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const frac = (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;
  const jd =
    367 * y -
    Math.floor((7 * (y + Math.floor((m + 9) / 12))) / 4) -
    Math.floor((3 * (Math.floor((y + (m - 9) / 7) / 100) + 1)) / 4) +
    Math.floor((275 * m) / 9) +
    day +
    1721028.5 +
    frac;
  return jd - 2451543.5;
}

interface Elements { N: number; i: number; w: number; a: number; e: number; M: number }

function elements(planet: PlanetKey, d: number): Elements {
  switch (planet) {
    case 'moon':
      return { N: 125.1228 - 0.0529538083 * d, i: 5.1454, w: 318.0634 + 0.1643573223 * d, a: 60.2666, e: 0.0549, M: 115.3654 + 13.0649929509 * d };
    case 'mercury':
      return { N: 48.3313 + 3.24587e-5 * d, i: 7.0047 + 5.0e-8 * d, w: 29.1241 + 1.01444e-5 * d, a: 0.387098, e: 0.205635 + 5.59e-10 * d, M: 168.6562 + 4.0923344368 * d };
    case 'venus':
      return { N: 76.6799 + 2.4659e-5 * d, i: 3.3946 + 2.75e-8 * d, w: 54.891 + 1.38374e-5 * d, a: 0.72333, e: 0.006773 - 1.302e-9 * d, M: 48.0052 + 1.6021302244 * d };
    case 'mars':
      return { N: 49.5574 + 2.11081e-5 * d, i: 1.8497 - 1.78e-8 * d, w: 286.5016 + 2.92961e-5 * d, a: 1.523688, e: 0.093405 + 2.516e-9 * d, M: 18.6021 + 0.5240207766 * d };
    case 'jupiter':
      return { N: 100.4542 + 2.76854e-5 * d, i: 1.3032 - 1.557e-7 * d, w: 273.8777 + 1.64505e-5 * d, a: 5.20256, e: 0.048498 + 4.469e-9 * d, M: 19.895 + 0.0830853001 * d };
    case 'saturn':
      return { N: 113.6634 + 2.3898e-5 * d, i: 2.4886 - 1.081e-7 * d, w: 339.3939 + 2.97661e-5 * d, a: 9.55475, e: 0.055546 - 9.499e-9 * d, M: 316.967 + 0.0334442282 * d };
    case 'uranus':
      return { N: 74.0005 + 1.3978e-5 * d, i: 0.7733 + 1.9e-8 * d, w: 96.6612 + 3.0565e-5 * d, a: 19.18171 - 1.55e-8 * d, e: 0.047318 + 7.45e-9 * d, M: 142.5905 + 0.011725806 * d };
    case 'neptune':
      return { N: 131.7806 + 3.0173e-5 * d, i: 1.77 - 2.55e-7 * d, w: 272.8461 - 6.027e-6 * d, a: 30.05826 + 3.313e-8 * d, e: 0.008606 + 2.15e-9 * d, M: 260.2471 + 0.005995147 * d };
    default:
      throw new Error(`no elements for ${planet}`);
  }
}

function eccentricAnomaly(M: number, e: number): number {
  const mRad = rad(rev(M));
  let E = mRad + e * Math.sin(mRad) * (1 + e * Math.cos(mRad));
  for (let k = 0; k < 8; k++) {
    E = E - (E - e * Math.sin(E) - mRad) / (1 - e * Math.cos(E));
  }
  return E;
}

/** Heliocentric ecliptic rectangular coordinates (AU; Earth radii for Moon). */
function helioXYZ(planet: PlanetKey, d: number): { x: number; y: number; z: number } {
  const el = elements(planet, d);
  const E = eccentricAnomaly(el.M, el.e);
  const xv = el.a * (Math.cos(E) - el.e);
  const yv = el.a * (Math.sqrt(1 - el.e * el.e) * Math.sin(E));
  const v = deg(Math.atan2(yv, xv));
  const r = Math.sqrt(xv * xv + yv * yv);
  const xh = r * (Math.cos(rad(el.N)) * Math.cos(rad(v + el.w)) - Math.sin(rad(el.N)) * Math.sin(rad(v + el.w)) * Math.cos(rad(el.i)));
  const yh = r * (Math.sin(rad(el.N)) * Math.cos(rad(v + el.w)) + Math.cos(rad(el.N)) * Math.sin(rad(v + el.w)) * Math.cos(rad(el.i)));
  const zh = r * (Math.sin(rad(v + el.w)) * Math.sin(rad(el.i)));
  return { x: xh, y: yh, z: zh };
}

function sunLongitude(d: number): number {
  const w = 282.9404 + 4.70935e-5 * d;
  const e = 0.016709 - 1.151e-9 * d;
  const M = rev(356.047 + 0.9856002585 * d);
  const E = eccentricAnomaly(M, e);
  const xv = Math.cos(E) - e;
  const yv = Math.sqrt(1 - e * e) * Math.sin(E);
  const v = deg(Math.atan2(yv, xv));
  return rev(v + w);
}

function moonLongitude(d: number): number {
  const el = elements('moon', d);
  const E = eccentricAnomaly(el.M, el.e);
  const xv = el.a * (Math.cos(E) - el.e);
  const yv = el.a * (Math.sqrt(1 - el.e * el.e) * Math.sin(E));
  const v = deg(Math.atan2(yv, xv));
  const r = Math.sqrt(xv * xv + yv * yv);
  const xh = r * (Math.cos(rad(el.N)) * Math.cos(rad(v + el.w)) - Math.sin(rad(el.N)) * Math.sin(rad(v + el.w)) * Math.cos(rad(el.i)));
  const yh = r * (Math.sin(rad(el.N)) * Math.cos(rad(v + el.w)) + Math.cos(rad(el.N)) * Math.sin(rad(v + el.w)) * Math.cos(rad(el.i)));
  let lon = rev(deg(Math.atan2(yh, xh)));
  // Principal perturbation terms (Schlyter): Ms, Mm, D, F in degrees.
  // D (mean elongation) and F (argument of latitude) are DERIVED from the
  // same elements used above — Lm (Moon mean longitude) = N + w + M and
  // Ls (Sun mean longitude) = Ms + w_sun — so the perturbation phases are
  // consistent with the geometric position by construction. (Schlyter's
  // tabulated D/F constants belong to a different epoch convention than
  // his element set; mixing the two produced degree-scale phase errors in
  // validation. The derived form was validated against the independent
  // synodic phase calculation in src/lib/apis/astro.ts — elongations agree
  // to under a degree at equal instants — and against the 2027-08-02 solar
  // eclipse and the 2000-01-06 new moon.)
  const Ms = rev(356.047 + 0.9856002585 * d);
  const Mm = rev(el.M);
  const Lm = rev(el.N + el.w + el.M);
  const Ls = rev(Ms + 282.9404 + 4.70935e-5 * d);
  const D = rev(Lm - Ls);
  const F = rev(Lm - el.N);
  const s = (x: number) => Math.sin(rad(x));
  lon +=
    -1.274 * s(Mm - 2 * D) +
    0.658 * s(2 * D) +
    -0.186 * s(Ms) +
    -0.059 * s(2 * Mm - 2 * D) +
    -0.057 * s(Mm - 2 * D + Ms) +
    0.053 * s(Mm + 2 * D) +
    0.046 * s(2 * D - Ms) +
    0.041 * s(Mm - Ms) +
    -0.035 * s(D) +
    -0.031 * s(Mm + Ms) +
    -0.015 * s(2 * F - 2 * D) +
    0.011 * s(Mm - 4 * D);
  return rev(lon);
}

const PLANET_LABELS: Record<PlanetKey, string> = {
  sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars',
  jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune',
};

const ALL_PLANETS: PlanetKey[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

function longitudeOf(planet: PlanetKey, d: number, sunLon: number): number {
  if (planet === 'sun') return sunLon;
  if (planet === 'moon') return moonLongitude(d);
  // Geocentric = heliocentric planet − heliocentric Earth. Earth's helio
  // position is the Sun's geocentric position + 180°.
  const p = helioXYZ(planet, d);
  const earthLon = rev(sunLon + 180);
  // Earth's heliocentric distance ≈ 1 AU (Schlyter uses the Sun's r; the
  // longitude-only computation below uses unit Earth vector, standard for
  // sign-level work — the resulting longitude error stays well under the
  // aspect orb for all planets except Venus/Mercury at extremes, and the
  // full r-weighted form is used here to keep even those tight.)
  const sunE = eccentricAnomaly(rev(356.047 + 0.9856002585 * d), 0.016709 - 1.151e-9 * d);
  const rSun = Math.sqrt(Math.pow(Math.cos(sunE) - (0.016709 - 1.151e-9 * d), 2) + (1 - Math.pow(0.016709 - 1.151e-9 * d, 2)) * Math.pow(Math.sin(sunE), 2));
  const ex = rSun * Math.cos(rad(earthLon));
  const ey = rSun * Math.sin(rad(earthLon));
  const gx = p.x - ex;
  const gy = p.y - ey;
  return rev(deg(Math.atan2(gy, gx)));
}

/** All computed geocentric positions for a date (default: today, 12:00 UTC). */
export function computePositions(date: Date = new Date()): PlanetPosition[] {
  const noon = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0));
  const d = dayNumber(noon);
  const dNext = dayNumber(new Date(noon.getTime() + 86400000));
  const sunLon = sunLongitude(d);
  const sunLonNext = sunLongitude(dNext);
  return ALL_PLANETS.map((planet) => {
    const lon = longitudeOf(planet, d, sunLon);
    const lonNext = longitudeOf(planet, dNext, sunLonNext);
    let delta = lonNext - lon;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const signIdx = Math.floor(lon / 30) % 12;
    return {
      planet,
      label: PLANET_LABELS[planet],
      longitude: lon,
      sign: SIGNS[signIdx],
      signKey: SIGNS[signIdx].toLowerCase(),
      degreeInSign: lon - signIdx * 30,
      retrograde: delta < 0,
    };
  });
}

const ASPECT_DEFS: { kind: Aspect['kind']; angle: number; harmonious: boolean }[] = [
  { kind: 'conjunction', angle: 0, harmonious: true },
  { kind: 'sextile', angle: 60, harmonious: true },
  { kind: 'trine', angle: 120, harmonious: true },
  { kind: 'square', angle: 90, harmonious: false },
  { kind: 'opposition', angle: 180, harmonious: false },
];

/** Aspect between two longitudes, or null outside orb (6°, 8° for Sun/Moon). */
export function aspectBetween(a: PlanetPosition, b: PlanetPosition): Aspect | null {
  let diff = Math.abs(a.longitude - b.longitude);
  if (diff > 180) diff = 360 - diff;
  const maxOrb = a.planet === 'sun' || a.planet === 'moon' || b.planet === 'sun' || b.planet === 'moon' ? 8 : 6;
  let best: Aspect | null = null;
  for (const def of ASPECT_DEFS) {
    const orb = Math.abs(diff - def.angle);
    if (orb <= maxOrb && (!best || orb < best.orb)) {
      // A conjunction with a traditionally tense planet counts as tense.
      const harmonious = def.kind === 'conjunction'
        ? !(a.planet === 'mars' || a.planet === 'saturn' || b.planet === 'mars' || b.planet === 'saturn')
        : def.harmonious;
      best = { a: a.planet, b: b.planet, kind: def.kind, angle: def.angle, orb, harmonious };
    }
  }
  return best;
}

/** Every aspect among the computed positions. */
export function computeAspects(positions: PlanetPosition[]): Aspect[] {
  const out: Aspect[] = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const asp = aspectBetween(positions[i], positions[j]);
      if (asp) out.push(asp);
    }
  }
  return out.sort((x, y) => x.orb - y.orb);
}

export const SIGN_RULERS: Record<string, PlanetKey> = {
  aries: 'mars', taurus: 'venus', gemini: 'mercury', cancer: 'moon',
  leo: 'sun', virgo: 'mercury', libra: 'venus', scorpio: 'mars',
  sagittarius: 'jupiter', capricorn: 'saturn', aquarius: 'uranus', pisces: 'neptune',
};

const PLANET_COLORS: Record<PlanetKey, string> = {
  sun: 'Gold', moon: 'Silver', mercury: 'Yellow', venus: 'Emerald Green',
  mars: 'Red', jupiter: 'Royal Purple', saturn: 'Charcoal', uranus: 'Turquoise', neptune: 'Sea Blue',
};

const DIRECTIONS = ['East', 'North-East', 'North', 'North-West', 'West', 'South-West', 'South', 'South-East'];
const ELEMENT_MOODS: Record<string, string> = { fire: 'Energetic', earth: 'Calm', air: 'Curious', water: 'Reflective' };
const SIGN_ELEMENTS: Record<string, string> = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'air', libra: 'air', aquarius: 'air',
  cancer: 'water', scorpio: 'water', pisces: 'water',
};

export interface DerivedDaily {
  positions: PlanetPosition[];
  aspects: Aspect[];
  /** 1–5 star meters, computed from aspect strengths per domain below. */
  meters: { overall: number; love: number; career: number; health: number; finance: number; spirituality: number };
  luckyNumber: number;
  luckyColor: string;
  luckyColorPlanet: PlanetKey;
  bestTime: string;
  luckyDirection: string;
  mood: string;
  compatibility: string;
  challenging: string;
  /** Index into the sign's narrative pool, chosen by the transit signature. */
  narrativeIndex: number;
  method: string;
}

const clamp15 = (v: number) => Math.max(1, Math.min(5, Math.round(v)));

/**
 * The derivation — every field a documented function of the computed
 * positions (see the R8 evidence pack for the plain-language version):
 * - meters: 3 + 0.9·(harmonious strength) − 0.9·(tense strength) over the
 *   aspects touching the domain's planets, strength = 1 − orb/maxOrb.
 * - lucky number: 1 + (⌊Moon lon ×3⌋ + ⌊ruler lon ×7⌋) mod 99.
 * - lucky colour: the colour of the planet in the tightest aspect to the
 *   sign's ruler (the ruler's own colour when nothing is within orb).
 * - best time: the Moon's elongation from the Sun mapped onto the 24-hour
 *   dial (elongation ÷ 15° = hour).
 * - lucky direction: the Sun's 45° zodiac sector → compass point.
 * - mood: the element of the sign the Moon is in.
 * - compatibility / challenge: the sign whose ruler makes the tightest
 *   harmonious / tense aspect to your ruler; geometric fallback (trine /
 *   square sign) when no aspect is within orb.
 */
export function deriveDaily(signKey: string, date: Date = new Date()): DerivedDaily {
  const positions = computePositions(date);
  const aspects = computeAspects(positions);
  const byPlanet = new Map(positions.map((p) => [p.planet, p]));
  const ruler = SIGN_RULERS[signKey] ?? 'sun';
  const rulerPos = byPlanet.get(ruler)!;
  const moon = byPlanet.get('moon')!;
  const sun = byPlanet.get('sun')!;

  const strength = (asp: Aspect) => 1 - asp.orb / (asp.a === 'sun' || asp.a === 'moon' || asp.b === 'sun' || asp.b === 'moon' ? 8 : 6);
  const meterFor = (planets: PlanetKey[]): number => {
    let h = 0;
    let t = 0;
    for (const asp of aspects) {
      if (planets.includes(asp.a) || planets.includes(asp.b)) {
        if (asp.harmonious) h += strength(asp); else t += strength(asp);
      }
    }
    return clamp15(3 + 0.9 * h - 0.9 * t);
  };

  const meters = {
    overall: meterFor([ruler]),
    love: meterFor(['venus']),
    career: meterFor(['mars', 'saturn']),
    health: meterFor(['moon']),
    finance: meterFor(['jupiter', 'venus']),
    spirituality: meterFor(['neptune', 'moon']),
  };

  const luckyNumber = 1 + ((Math.floor(moon.longitude * 3) + Math.floor(rulerPos.longitude * 7)) % 99);

  const rulerAspects = aspects.filter((a) => a.a === ruler || a.b === ruler);
  const tightest = rulerAspects[0];
  const colorPlanet = tightest ? (tightest.a === ruler ? tightest.b : tightest.a) : ruler;

  const elongation = rev(moon.longitude - sun.longitude);
  const hour24 = Math.floor(elongation / 15) % 24;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const bestTime = `${hour12}:00 ${hour24 >= 12 ? 'PM' : 'AM'}`;

  const luckyDirection = DIRECTIONS[Math.floor(sun.longitude / 45) % 8];
  const moonElement = SIGN_ELEMENTS[moon.signKey] ?? 'air';
  const mood = ELEMENT_MOODS[moonElement];

  const signOfPlanet = (pk: PlanetKey) => byPlanet.get(pk)!.signKey;
  let compatibility: string | null = null;
  let challenging: string | null = null;
  for (const asp of rulerAspects) {
    const other = asp.a === ruler ? asp.b : asp.a;
    const otherSign = Object.keys(SIGN_RULERS).find((k) => SIGN_RULERS[k] === other && k !== signKey);
    if (!otherSign) continue;
    if (asp.harmonious && !compatibility) compatibility = otherSign;
    if (!asp.harmonious && !challenging) challenging = otherSign;
    if (compatibility && challenging) break;
  }
  const signIdx = SIGNS.findIndex((s) => s.toLowerCase() === signKey);
  if (!compatibility) compatibility = SIGNS[(signIdx + 4) % 12].toLowerCase(); // trine sign, same element
  if (!challenging) challenging = SIGNS[(signIdx + 3) % 12].toLowerCase(); // square sign

  const narrativeIndex = (aspects.length + Math.floor(moon.longitude / 30)) % 3;

  return {
    positions,
    aspects,
    meters,
    luckyNumber,
    luckyColor: PLANET_COLORS[colorPlanet],
    luckyColorPlanet: colorPlanet,
    bestTime,
    luckyDirection,
    mood,
    compatibility,
    challenging,
    narrativeIndex,
    method: 'Geocentric ecliptic longitudes computed from Keplerian orbital elements (Schlyter\u2019s algorithm), aspects at 6\u00B0 orb (8\u00B0 for Sun/Moon).',
  };
}
