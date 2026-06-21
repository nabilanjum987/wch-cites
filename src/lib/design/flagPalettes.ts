/**
 * Flag color palettes — full set of each country's actual flag colors,
 * used to theme city pages (backgrounds, glows, cards, buttons, accents)
 * so each country's pages feel visually distinct and rooted in its identity.
 *
 * Colors are ordered roughly by visual dominance/area on the flag.
 * `glow` = subset best suited for background aurora orbs (skips pure white/black,
 * which read poorly as large soft blurs on a dark base).
 * `accent` = the single color used for primary CTAs/active states.
 */

export interface FlagPalette {
  name: string;
  colors: string[];   // full flag palette, dominant first
  glow: string[];      // colors usable for soft background glow orbs
  accent: string;      // primary interactive color
}

export const FLAG_PALETTES: Record<string, FlagPalette> = {
  pakistan: {
    name: 'Pakistan',
    colors: ['#01411C', '#FFFFFF'],
    glow: ['#01411C', '#0C7A3D'],
    accent: '#0C7A3D',
  },
  india: {
    name: 'India',
    colors: ['#FF9933', '#FFFFFF', '#138808', '#000080'],
    glow: ['#FF9933', '#138808', '#000080'],
    accent: '#FF9933',
  },
  'united-arab-emirates': {
    name: 'United Arab Emirates',
    colors: ['#FF0000', '#00732F', '#FFFFFF', '#000000'],
    glow: ['#FF0000', '#00732F'],
    accent: '#00732F',
  },
  'saudi-arabia': {
    name: 'Saudi Arabia',
    colors: ['#006C35', '#FFFFFF'],
    glow: ['#006C35', '#00A651'],
    accent: '#00A651',
  },
  'united-kingdom': {
    name: 'United Kingdom',
    colors: ['#012169', '#FFFFFF', '#C8102E'],
    glow: ['#012169', '#C8102E'],
    accent: '#C8102E',
  },
  'united-states': {
    name: 'United States',
    colors: ['#B31942', '#FFFFFF', '#0A3161'],
    glow: ['#B31942', '#0A3161'],
    accent: '#B31942',
  },
  bangladesh: {
    name: 'Bangladesh',
    colors: ['#006A4E', '#F42A41'],
    glow: ['#006A4E', '#F42A41'],
    accent: '#F42A41',
  },
  turkey: {
    name: 'Turkey',
    colors: ['#E30A17', '#FFFFFF'],
    glow: ['#E30A17', '#FF4D5E'],
    accent: '#E30A17',
  },
  egypt: {
    name: 'Egypt',
    colors: ['#CE1126', '#FFFFFF', '#000000', '#C09300'],
    glow: ['#CE1126', '#C09300'],
    accent: '#C09300',
  },
  china: {
    name: 'China',
    colors: ['#DE2910', '#FFDE00'],
    glow: ['#DE2910', '#FFDE00'],
    accent: '#FFDE00',
  },
  japan: {
    name: 'Japan',
    colors: ['#FFFFFF', '#BC002D'],
    glow: ['#BC002D', '#FF4D6D'],
    accent: '#BC002D',
  },
  germany: {
    name: 'Germany',
    colors: ['#000000', '#DD0000', '#FFCE00'],
    glow: ['#DD0000', '#FFCE00'],
    accent: '#FFCE00',
  },
  france: {
    name: 'France',
    colors: ['#0055A4', '#FFFFFF', '#EF4135'],
    glow: ['#0055A4', '#EF4135'],
    accent: '#0055A4',
  },
  canada: {
    name: 'Canada',
    colors: ['#FF0000', '#FFFFFF'],
    glow: ['#FF0000', '#FF6B6B'],
    accent: '#FF0000',
  },
  australia: {
    name: 'Australia',
    colors: ['#00008B', '#FFFFFF', '#FF0000'],
    glow: ['#00008B', '#FF0000'],
    accent: '#00008B',
  },
  indonesia: {
    name: 'Indonesia',
    colors: ['#FF0000', '#FFFFFF'],
    glow: ['#FF0000', '#FF6B6B'],
    accent: '#FF0000',
  },
  nigeria: {
    name: 'Nigeria',
    colors: ['#008751', '#FFFFFF'],
    glow: ['#008751', '#00B86B'],
    accent: '#008751',
  },
  brazil: {
    name: 'Brazil',
    colors: ['#009C3B', '#FFDF00', '#002776'],
    glow: ['#009C3B', '#FFDF00', '#002776'],
    accent: '#FFDF00',
  },
  'south-africa': {
    name: 'South Africa',
    colors: ['#007749', '#FFB81C', '#DE3831', '#002395', '#FFFFFF', '#000000'],
    glow: ['#007749', '#FFB81C', '#DE3831'],
    accent: '#FFB81C',
  },
  malaysia: {
    name: 'Malaysia',
    colors: ['#CC0001', '#FFFFFF', '#010066', '#FFCC00'],
    glow: ['#CC0001', '#010066', '#FFCC00'],
    accent: '#FFCC00',
  },
  qatar: {
    name: 'Qatar',
    colors: ['#8D1B3D', '#FFFFFF'],
    glow: ['#8D1B3D', '#C13564'],
    accent: '#8D1B3D',
  },
};

const DEFAULT_PALETTE: FlagPalette = {
  name: 'Global',
  colors: ['#6366f1', '#06b6d4'],
  glow: ['#6366f1', '#06b6d4'],
  accent: '#06b6d4',
};

export function getFlagPalette(countrySlug: string): FlagPalette {
  return FLAG_PALETTES[countrySlug?.toLowerCase()] ?? DEFAULT_PALETTE;
}
