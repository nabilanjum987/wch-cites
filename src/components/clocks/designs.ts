// Pin / Take This Clock — designs (feat/pin-clock, 2026-11-04).
// The owner settled ~50 country designs as the end state. This list is
// deliberately data-driven: today it carries the Classic look plus one
// flag skin per hero-clock country, and growing to 50 means adding
// rows here — the picker, the pinned strip and the embed route all
// read from this one table, so no component changes when a design is
// added. A design restyles a clock with a country's flag as a soft
// backdrop and its colours for the ring; Classic keeps each clock's
// own flag colours and no backdrop flag of its own (the hero cards
// already carry their own flag artwork).

export interface ClockDesign {
  id: string;
  name: string;
  blurb: string;
  flagCode: string | null; // backdrop flag; null = no backdrop (Classic)
  ring: string | null; // ring + hour-hand colour; null = the clock's own primary
  swatch: [string, string]; // two colours for picker chips
}

export const CLOCK_DESIGNS: ClockDesign[] = [
  {
    id: 'classic',
    name: 'Classic',
    blurb: 'The WorldCityHub look: every clock keeps its own flag colours.',
    flagCode: null,
    ring: null,
    swatch: ['#0a0f1e', '#22d3ee'],
  },
  {
    id: 'pakistan',
    name: 'Pakistan',
    blurb: 'Deep green and white, with the Pakistan flag behind the dial.',
    flagCode: 'pk',
    ring: '#14a44d',
    swatch: ['#01411C', '#ffffff'],
  },
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    blurb: 'Union blue and red, with the United Kingdom flag behind the dial.',
    flagCode: 'gb',
    ring: '#4f7ddf',
    swatch: ['#012169', '#C8102E'],
  },
  {
    id: 'united-arab-emirates',
    name: 'United Arab Emirates',
    blurb: 'Emirates green and red, with the UAE flag behind the dial.',
    flagCode: 'ae',
    ring: '#00a651',
    swatch: ['#00732F', '#FF0000'],
  },
  {
    id: 'united-states',
    name: 'United States',
    blurb: 'Stars-and-stripes navy and red, with the US flag behind the dial.',
    flagCode: 'us',
    ring: '#e05260',
    swatch: ['#3C3B6E', '#B22234'],
  },
  {
    id: 'japan',
    name: 'Japan',
    blurb: 'Clean white and crimson, with the Japan flag behind the dial.',
    flagCode: 'jp',
    ring: '#e0576b',
    swatch: ['#ffffff', '#BC002D'],
  },
  {
    id: 'australia',
    name: 'Australia',
    blurb: 'Gold and green, with the Australia flag behind the dial.',
    flagCode: 'au',
    ring: '#f5c542',
    swatch: ['#00843D', '#FFCD00'],
  },
];

export const DEFAULT_DESIGN_ID = 'classic';

export function getDesign(id: string | null | undefined): ClockDesign {
  return CLOCK_DESIGNS.find((d) => d.id === id) ?? CLOCK_DESIGNS[0];
}

// The design a clock wears when the visitor has not chosen one: its
// own country's skin when the list carries it, else Classic.
export function ownDesignFor(code: string | null): ClockDesign {
  if (!code) return CLOCK_DESIGNS[0];
  return CLOCK_DESIGNS.find((d) => d.flagCode === code) ?? CLOCK_DESIGNS[0];
}
