// Per-sign artwork for the horoscope hub cards and sign pages: the twelve
// constellation plates of Sidney Hall's Urania's Mirror (London, 1825),
// one uniform public-domain set, so every sign's card shows its own
// classical artwork (shown as artwork, never as a photo). Licence for
// each exact file was verified via the Wikimedia Commons API extmetadata
// on 2026-11-04; full records (creator, licence, SHA-1) live in
// docs/media-registry/subjects/zodiac-signs.json.
import type { ZodiacSign } from '../../types/horoscope';

export interface SignArtwork {
  /** Local WebP copy of the plate. */
  src: string;
  alt: string;
  /** The plate's own title within the set. */
  plate: string;
  /** One-line credit, rendered below the artwork wherever it is credited. */
  credit: string;
  licence: string;
  /** The Commons file page for the exact file. */
  sourcePage: string;
}

/** Shared credit for the set, used on the hub where twelve per-file
 *  credits would bury the grid; the sign pages credit their own plate. */
export const ZODIAC_ARTWORK_SET_CREDIT =
  "Artwork: Sidney Hall, Urania's Mirror (1825), public domain, via Wikimedia Commons.";

export const SIGN_ARTWORK: Record<ZodiacSign, SignArtwork> = {
  aries: {
    src: '/images/horoscope/aries.webp',
    alt: 'Aries constellation plate by Sidney Hall, from Urania\'s Mirror (1825)',
    plate: 'Aries and Musca Borealis',
    credit: "Sidney Hall, Urania's Mirror (1825), public domain, via Wikimedia Commons",
    licence: 'Public domain',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Aries_and_Musca_Borealis.jpg',
  },
  taurus: {
    src: '/images/horoscope/taurus.webp',
    alt: 'Taurus constellation plate by Sidney Hall, from Urania\'s Mirror (1825)',
    plate: 'Taurus',
    credit: "Sidney Hall, Urania's Mirror (1825), public domain, via Wikimedia Commons",
    licence: 'Public domain',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Taurus.jpg',
  },
  gemini: {
    src: '/images/horoscope/gemini.webp',
    alt: 'Gemini constellation plate by Sidney Hall, from Urania\'s Mirror (1825)',
    plate: 'Gemini',
    credit: "Sidney Hall, Urania's Mirror (1825), public domain, via Wikimedia Commons",
    licence: 'Public domain',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Gemini.jpg',
  },
  cancer: {
    src: '/images/horoscope/cancer.webp',
    alt: 'Cancer constellation plate by Sidney Hall, from Urania\'s Mirror (1825)',
    plate: 'Cancer',
    credit: "Sidney Hall, Urania's Mirror (1825), public domain, via Wikimedia Commons",
    licence: 'Public domain',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Cancer.jpg',
  },
  leo: {
    src: '/images/horoscope/leo.webp',
    alt: 'Leo constellation plate by Sidney Hall, from Urania\'s Mirror (1825)',
    plate: 'Leo Major and Leo Minor',
    credit: "Sidney Hall, Urania's Mirror (1825), public domain, via Wikimedia Commons",
    licence: 'Public domain',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Leo_Major_and_Leo_Minor.jpg',
  },
  virgo: {
    src: '/images/horoscope/virgo.webp',
    alt: 'Virgo constellation plate by Sidney Hall, from Urania\'s Mirror (1825)',
    plate: 'Virgo',
    credit: "Sidney Hall, Urania's Mirror (1825), public domain, via Wikimedia Commons",
    licence: 'Public domain',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Virgo.jpg',
  },
  libra: {
    src: '/images/horoscope/libra.webp',
    alt: 'Libra constellation plate by Sidney Hall, from Urania\'s Mirror (1825)',
    plate: 'Libra',
    credit: "Sidney Hall, Urania's Mirror (1825), public domain, via Wikimedia Commons",
    licence: 'Public domain',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Libra.jpg',
  },
  scorpio: {
    src: '/images/horoscope/scorpio.webp',
    alt: 'Scorpio constellation plate by Sidney Hall, from Urania\'s Mirror (1825)',
    plate: 'Scorpio',
    credit: "Sidney Hall, Urania's Mirror (1825), public domain, via Wikimedia Commons",
    licence: 'Public domain',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Scorpio.png',
  },
  sagittarius: {
    src: '/images/horoscope/sagittarius.webp',
    alt: 'Sagittarius constellation plate by Sidney Hall, from Urania\'s Mirror (1825)',
    plate: 'Sagittarius and Corona Australis, Microscopium, and Telescopium',
    credit: "Sidney Hall, Urania's Mirror (1825), public domain, via Wikimedia Commons",
    licence: 'Public domain',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Sagittarius_and_Corona_Australis,_Microscopium,_and_Telescopium.png',
  },
  capricorn: {
    src: '/images/horoscope/capricorn.webp',
    alt: 'Capricorn constellation plate by Sidney Hall, from Urania\'s Mirror (1825)',
    plate: 'Capricornus',
    credit: "Sidney Hall, Urania's Mirror (1825), public domain, via Wikimedia Commons",
    licence: 'Public domain',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Capricornus.jpg',
  },
  aquarius: {
    src: '/images/horoscope/aquarius.webp',
    alt: 'Aquarius constellation plate by Sidney Hall, from Urania\'s Mirror (1825)',
    plate: 'Aquarius, Piscis Australis & Ballon Aerostatique',
    credit: "Sidney Hall, Urania's Mirror (1825), public domain, via Wikimedia Commons",
    licence: 'Public domain',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Aquarius,_Piscis_Australis_%26_Ballon_Aerostatique.jpg',
  },
  pisces: {
    src: '/images/horoscope/pisces.webp',
    alt: 'Pisces constellation plate by Sidney Hall, from Urania\'s Mirror (1825)',
    plate: 'Pisces',
    credit: "Sidney Hall, Urania's Mirror (1825), public domain, via Wikimedia Commons",
    licence: 'Public domain',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Pisces.jpg',
  },
};
