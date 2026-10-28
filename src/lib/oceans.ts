// ─────────────────────────────────────────────────────────────────────────────
// Oceans data layer (WP5 / marathon Q10) — SERVER ONLY.
// Mirrors the golden wonder pattern (src/lib/wonders.ts): static facts
// live in the database after migration 0002 (`oceans`, `ocean_media`,
// `ocean_sources`); until the owner applies it, this module serves the
// SAME dataset baked from live verification on 2026-10-22 (Wikidata
// Q58705 — matched on its description "marginal sea of the northern
// Indian Ocean", NOT the first search hit, which is a ship of the same
// name — and the Wikipedia article).
//
// Live layer: Open-Meteo MARINE API (wave height / direction / period)
// at the sea's own Wikidata representative point + Open-Meteo forecast
// weather for the coast at Karachi. No figure is stored or invented;
// when a feed is down its block does not render.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase } from '@/lib/supabase';
import { WMO_LABELS, weatherLabel, haversineKm } from '@/lib/wonders';

export { weatherLabel, WMO_LABELS, haversineKm };

export interface OceanMedia {
  fileTitle: string;
  fileUrl: string;
  pageUrl: string;
  width: number;
  height: number;
  licence: string;
  licenceUrl: string;
  author: string;
  attribution: string;
  role: 'hero' | 'gallery' | 'detail';
  alt: string;
  sortOrder: number;
}

export interface OceanSource {
  claim: string;
  sourceName: string;
  sourceUrl: string;
  checkedAt: string;
}

export interface Ocean {
  slug: string;
  name: string;
  wikidataQid: string;
  partOfName: string;
  // Display label for the hero chip (e.g. 'Indian Ocean · northwestern
  // arm', 'World Ocean · the largest ocean on Earth').
  partOfLabel: string;
  // Heading for the seasonal-pattern section (the Arabian Sea's is
  // 'The monsoon sea'; other oceans name their own pattern).
  seasonTitle: string;
  // Wikipedia article title for the Read-more link.
  wikiTitle: string;
  lat: number; // representative point (Wikidata P625)
  lng: number;
  marineTimezone: string; // display timezone for marine data (nearest coast)
  seoTitle: string;
  seoDescription: string;
  intro: string[];
  facts: { label: string; value: string; source: string }[];
  geography: string[];
  monsoon: string[];
  // A published WorldCityHub coastal city for this ocean, or null when
  // none exists yet (Round 2 R3: only Karachi is published, and it is a
  // truthful coast for the Arabian Sea and the Indian Ocean only). The
  // page hides every coastal block when this is null — no city is ever
  // dressed up as a coast it does not stand on.
  coastalCity: {
    name: string;
    countryName: string;
    path: string; // published WorldCityHub city page
    lat: number;
    lng: number;
    timezone: string;
  } | null;
  faqs: { q: string; a: string }[];
  media: OceanMedia[];
  sources: OceanSource[];
}

const CHECKED = '2026-10-22';

const ARABIAN_SEA: Ocean = {
  slug: 'arabian-sea',
  name: 'Arabian Sea',
  wikidataQid: 'Q58705',
  partOfName: 'Indian Ocean',
  partOfLabel: 'Indian Ocean · northwestern arm',
  seasonTitle: 'The monsoon sea',
  wikiTitle: 'Arabian_Sea',
  lat: 16,
  lng: 64,
  marineTimezone: 'Asia/Karachi',
  seoTitle: 'Arabian Sea: Live Waves, Weather & Facts',
  seoDescription:
    'The Arabian Sea live: wave height & swell today, Karachi coastal weather, monsoon pattern, size and depth facts — every figure sourced.',
  intro: [
    'The Arabian Sea is the northwestern arm of the Indian Ocean, bounded on the west by the Arabian Peninsula, the Gulf of Aden and the Guardafui Channel, on the northwest by the Gulf of Oman and Iran, on the north by Pakistan, on the east by India, and on the southeast by the Laccadive Sea and the Maldives, with Somalia to the southwest. Its total area is 3,862,000 km².',
    'Few seas have shaped history like this one. For millennia its reversing monsoon winds carried trade — and with it concepts, peoples, philosophies, technologies and religions — across the Old World: sailors rode one monsoon out and waited for the winds and currents to reverse before sailing home. The same monsoon still sets the sea\u2019s moods today, which is why this page pairs the facts with the live wave and weather picture.',
    'At its centre and south the seabed falls away into the Arabian Basin, an expansive, relatively flat stretch of ocean floor reaching depths beyond 4,500 metres. In the west the Gulf of Aden connects the sea to the Red Sea through the strait of Bab-el-Mandeb; in the northwest the Gulf of Oman connects it to the Persian Gulf.',
  ],
  facts: [
    { label: 'Part of', value: 'Indian Ocean', source: 'Wikidata' },
    { label: 'Total area', value: '3,862,000 km² (1,491,000 sq mi)', source: 'Wikidata / Wikipedia' },
    { label: 'Maximum depth', value: '5,395 m', source: 'Wikipedia (see sources note)' },
    { label: 'Representative point', value: '16° N, 64° E', source: 'Wikidata' },
    { label: 'Seabed', value: 'Arabian Basin — beyond 4,500 m in places', source: 'Wikipedia' },
    { label: 'Connects west', value: 'Gulf of Aden → Bab-el-Mandeb → Red Sea', source: 'Wikipedia' },
    { label: 'Connects northwest', value: 'Gulf of Oman → Persian Gulf', source: 'Wikipedia' },
    { label: 'Northern shore', value: 'Pakistan — Karachi is its great port city', source: 'Wikipedia' },
  ],
  geography: [
    'West: the Arabian Peninsula, the Gulf of Aden and the Guardafui Channel. Northwest: the Gulf of Oman and Iran. North: Pakistan. East: India. Southeast: the Laccadive Sea and the Maldives. Southwest: Somalia. Most islands and seamounts in the sea lie along its coastal fringes, close to the major landmasses (Wikipedia).',
  ],
  monsoon: [
    'The Arabian Sea is the world\u2019s great monsoon sea. In mid-summer, strong winds carry warm air and moisture northeastwards from the African interior and the Indian Ocean, bringing heavy rains to the northeastern shoreline of the Arabian basin while the Horn of Africa and the Arabian Peninsula stay dry (Wikipedia). In the era of square-rigged vessels this pattern governed all trade here: ships sailed out on one monsoon and were effectively marooned at their destination until the reversal of winds and currents let them sail home on calmer waters.',
    'The practical rhythm that follows from that pattern: the southwest monsoon months (roughly June to September) bring the strongest winds and the roughest open-sea conditions of the year; the northeast monsoon months (roughly November to March) are generally the calmest. The live wave panel on this page shows what the sea is actually doing today, inside that seasonal frame.',
  ],
  coastalCity: {
    name: 'Karachi',
    countryName: 'Pakistan',
    path: '/pakistan/sindh/karachi',
    lat: 24.8607,
    lng: 67.0011,
    timezone: 'Asia/Karachi',
  },
  faqs: [
    {
      q: 'How big is the Arabian Sea?',
      a: 'Its total area is 3,862,000 km² (1,491,000 sq mi) — the northwestern region of the Indian Ocean, between the Arabian Peninsula, Iran, Pakistan, India, the Maldives and Somalia (Wikidata / Wikipedia).',
    },
    {
      q: 'How deep is the Arabian Sea?',
      a: 'Wikipedia gives a maximum depth of 5,395 metres; Wikidata records 5,800 metres for the same quantity. Both figures are shown in this page\u2019s sources rather than hidden — depth soundings for an entire sea are estimates that vary by survey and by where the deepest point is taken.',
    },
    {
      q: 'What are the waves like in the Arabian Sea today?',
      a: 'The live panel at the top of this page shows today\u2019s significant wave height, swell direction and wave period from the Open-Meteo Marine API at the sea\u2019s representative point (16° N, 64° E), plus the weather on the coast at Karachi.',
    },
    {
      q: 'When is the Arabian Sea roughest?',
      a: 'During the southwest monsoon, roughly June to September, when strong winds drive the year\u2019s roughest open-sea conditions. The northeast monsoon months, roughly November to March, are generally the calmest — the pattern that governed sailing trade here for millennia (Wikipedia).',
    },
    {
      q: 'Which WorldCityHub city is on the Arabian Sea?',
      a: 'Karachi, Pakistan — the great port city on the sea\u2019s northern shore. Its full WorldCityHub guide (weather, prayer times, rates, news and more) is linked from this page.',
    },
  ],
  media: [
    {
      fileTitle: 'Arabian sea waves.jpg',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Arabian_sea_waves.jpg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Arabian_sea_waves.jpg',
      width: 6000,
      height: 4000,
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      author: 'Galib Tufan',
      attribution: '"Arabian sea waves" by Galib Tufan — CC BY-SA 4.0, via Wikimedia Commons',
      role: 'hero',
      alt: 'Waves rolling in the Arabian Sea under a bright sky',
      sortOrder: 1,
    },
    {
      fileTitle: 'Winter Phytoplankon Arabian Sea.jpg',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Winter_Phytoplankon_Arabian_Sea.jpg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Winter_Phytoplankon_Arabian_Sea.jpg',
      width: 2491,
      height: 1470,
      licence: 'Public domain',
      licenceUrl: 'https://commons.wikimedia.org/wiki/Commons:Public_domain',
      author: 'NASA',
      attribution: '"Winter Phytoplankton, Arabian Sea" by NASA — public domain, via Wikimedia Commons',
      role: 'gallery',
      alt: 'Satellite view of a winter phytoplankton bloom swirling in the Arabian Sea (NASA)',
      sortOrder: 2,
    },
    {
      fileTitle: 'Arabian Sea and Morjim Beach as seen from Vagator Fort, Goa, India.jpg',
      fileUrl:
        'https://upload.wikimedia.org/wikipedia/commons/b/b5/Arabian_Sea_and_Morjim_Beach_as_seen_from_Vagator_Fort%2C_Goa%2C_India.jpg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Arabian_Sea_and_Morjim_Beach_as_seen_from_Vagator_Fort,_Goa,_India.jpg',
      width: 3072,
      height: 2048,
      licence: 'CC BY 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by/4.0',
      author: 'Vyacheslav Argenberg',
      attribution:
        '"Arabian Sea and Morjim Beach as seen from Vagator Fort, Goa, India" by Vyacheslav Argenberg — CC BY 4.0, via Wikimedia Commons',
      role: 'gallery',
      alt: 'The Arabian Sea and Morjim Beach seen from Vagator Fort, Goa, on the sea\u2019s eastern shore',
      sortOrder: 3,
    },
    {
      fileTitle: 'Arabian Sea - n22e70.jpg',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Arabian_Sea_-_n22e70.jpg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Arabian_Sea_-_n22e70.jpg',
      width: 683,
      height: 446,
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      author: 'Arjun Sinh Jadeja',
      attribution: '"Arabian Sea" satellite tile by Arjun Sinh Jadeja — CC BY-SA 4.0, via Wikimedia Commons',
      role: 'detail',
      alt: 'Satellite tile of the Arabian Sea region (the image attached to the sea\u2019s Wikidata record)',
      sortOrder: 4,
    },
  ],
  sources: [
    { claim: 'Identity (matched on description, not name alone), representative coordinates 16° N 64° E, area, part of Indian Ocean', sourceName: 'Wikidata — Q58705 (Arabian Sea)', sourceUrl: 'https://www.wikidata.org/wiki/Q58705', checkedAt: CHECKED },
    { claim: 'Bounds, connections (Bab-el-Mandeb, Gulf of Oman), Arabian Basin, monsoon pattern, trade history', sourceName: 'Wikipedia — "Arabian Sea"', sourceUrl: 'https://en.wikipedia.org/wiki/Arabian_Sea', checkedAt: CHECKED },
    { claim: 'Maximum depth — SOURCES DIFFER: Wikipedia 5,395 m; Wikidata (P4511) 5,800 m. Both recorded; the fact card shows Wikipedia\u2019s figure with this note', sourceName: 'Wikipedia — "Arabian Sea" / Wikidata Q58705', sourceUrl: 'https://en.wikipedia.org/wiki/Arabian_Sea', checkedAt: CHECKED },
    { claim: 'Live wave height, direction and period at 16° N, 64° E; Karachi coastal weather', sourceName: 'Open-Meteo Marine & Forecast APIs', sourceUrl: 'https://open-meteo.com/', checkedAt: CHECKED },
    { claim: 'All photographs: licence, author, dimensions', sourceName: 'Wikimedia Commons — imageinfo records (per-file links in the credits)', sourceUrl: 'https://commons.wikimedia.org/', checkedAt: CHECKED },
  ],
};

// ── Batch 1 replication (Round 2, R3) ─────────────────────────────────────
// The five remaining oceans on the golden pattern, verified live on
// 2026-10-22 (Wikidata description-matched QIDs; depth/area source
// conflicts shown in the rows’ own source records, as the Arabian
// Sea models). BUILT, not published: BUILT_OCEANS renders for QA,
// the hub stays Arabian-Sea-only, the sitemap is untouched, and
// migration 0009 seeds these rows as status='draft'.

const PACIFIC_OCEAN: Ocean = {
  "slug": "pacific-ocean",
  "name": "Pacific Ocean",
  "wikidataQid": "Q98",
  "partOfName": "World Ocean",
  "partOfLabel": "World Ocean · the largest ocean on Earth",
  "seasonTitle": "Cyclones, El Niño & the great gyres",
  "wikiTitle": "Pacific_Ocean",
  "lat": 0,
  "lng": -160,
  "marineTimezone": "UTC",
  "seoTitle": "Pacific Ocean: Live Waves, Weather & Facts",
  "seoDescription": "The Pacific Ocean live: wave height at its equatorial point, size and depth facts with sources shown, El Niño and cyclone seasons explained.",
  "intro": [
    "The Pacific Ocean is the largest and deepest of the world’s oceans, stretching from the Arctic in the north to the Southern Ocean in the south, bounded by Asia and Australia to the west and the Americas to the east. At 161,760,000 km² on Wikidata’s measure it covers roughly a third of the Earth’s surface — more than all of the planet’s land combined.",
    "Its floor holds the Mariana Trench, whose Challenger Deep is the deepest point in any ocean, and its rim — the Ring of Fire — carries most of the world’s volcanoes and great earthquakes. More than 25,000 islands rise from it, the largest concentration of islands in any ocean, and its tuna fisheries supply a majority of the world’s tuna catch.",
    "The Pacific is also the engine of the planet’s best-known climate pattern: the El Niño–Southern Oscillation swings its equatorial surface waters between warm (El Niño) and cool (La Niña) phases, rearranging rainfall, fisheries and storm tracks on several continents at once. The live block on this page samples the open-ocean wave picture at the ocean’s Wikidata representative point (0°, 160° W)."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "World Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "161,760,000 km²",
      "source": "Wikidata (see sources note)"
    },
    {
      "label": "Average depth",
      "value": "4,280 m",
      "source": "Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "11,034 m",
      "source": "Wikidata (see sources note)"
    },
    {
      "label": "Deepest point",
      "value": "Challenger Deep, Mariana Trench",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "0°, 160° W",
      "source": "Wikidata"
    },
    {
      "label": "Named",
      "value": "1519–1521, by Ferdinand Magellan — \"Mar Pacífico\", the peaceful sea",
      "source": "Wikipedia"
    }
  ],
  "geography": [
    "West: Asia and Australia. East: North and South America. North: the Bering Strait opens to the Arctic Ocean; south: the Southern Ocean takes over around 60° S (the boundary used by most authorities). The equator divides it into the North and South Pacific, whose great subtropical gyres turn clockwise in the north and counter-clockwise in the south. Its marginal seas include the Philippine Sea, the Coral Sea, the South China Sea, the Sea of Japan, the Bering Sea and the Tasman Sea (Wikipedia)."
  ],
  "monsoon": [
    "The Pacific does not run on a monsoon; its seasonal drama is tropical cyclones and ENSO. The northwest Pacific is the most active cyclone basin on Earth — typhoons can form in any month and peak in late summer — while the northeast Pacific hurricane season runs roughly June to November and the South Pacific season November to April. Super-typhoons here have produced the strongest reliably measured winds and lowest pressures in any ocean basin.",
    "Every few years the El Niño–Southern Oscillation rearranges the whole ocean: in El Niño the warm pool slumps east, Peruvian anchoveta fisheries collapse, Australia dries and the Americas’ Pacific coasts flood; La Niña reverses the pattern. Forecasters announce the current phase from equatorial temperature anomalies — this page’s season frame names the cyclone season only; the live waves above are today’s measurement, not a climate claim."
  ],
  "coastalCity": null,
  "faqs": [
    {
      "q": "How big is the Pacific Ocean?",
      "a": "161,760,000 km² on Wikidata’s measure — about a third of the Earth’s surface, larger than all land areas combined. Wikipedia’s infobox gives 165,250,000 km² including adjacent seas; the difference is which marginal seas are counted, and this page shows both figures rather than hiding the disagreement."
    },
    {
      "q": "What is the deepest point in the Pacific?",
      "a": "The Challenger Deep in the Mariana Trench. Wikidata records the ocean’s maximum depth as 11,034 m; modern multibeam surveys of the Challenger Deep itself measure about 10,935 m. Both figures are shown in this page’s sources."
    },
    {
      "q": "Why is it called the Pacific?",
      "a": "Ferdinand Magellan named it \"Mar Pacífico\" — the peaceful sea — after his fleet crossed from the stormy strait at South America’s tip into calm waters in 1520. The name stuck, however unpeaceful the typhoon belt can be."
    },
    {
      "q": "What is El Niño?",
      "a": "A warming of the equatorial Pacific’s surface waters that recurs every few years and shifts rainfall, fisheries and storm patterns worldwide; its cool counterpart is La Niña. Together they form the El Niño–Southern Oscillation (ENSO)."
    }
  ],
  "media": [
    {
      "fileTitle": "Maysak 2015-03-31 ISS.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/6/61/Maysak_2015-03-31_ISS.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Maysak_2015-03-31_ISS.jpg",
      "width": 4928,
      "height": 3280,
      "licence": "Public domain",
      "licenceUrl": "https://commons.wikimedia.org/wiki/Commons:Public_domain",
      "author": "Samantha Cristoforetti (ESA/NASA)",
      "attribution": "\"Maysak 2015-03-31 ISS.jpg\" by Samantha Cristoforetti (ESA/NASA) — public domain, via Wikimedia Commons",
      "role": "hero",
      "alt": "Typhoon Maysak over the Pacific Ocean photographed from the International Space Station",
      "sortOrder": 1
    },
    {
      "fileTitle": "ISS034-E-5426 - View of Pacific Ocean.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/3/37/ISS034-E-5426_-_View_of_Pacific_Ocean.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:ISS034-E-5426_-_View_of_Pacific_Ocean.jpg",
      "width": 4288,
      "height": 2848,
      "licence": "Public domain",
      "licenceUrl": "https://commons.wikimedia.org/wiki/Commons:Public_domain",
      "author": "NASA Earth Science and Remote Sensing Unit",
      "attribution": "\"ISS034-E-5426 - View of Pacific Ocean.jpg\" by NASA Earth Science and Remote Sensing Unit — public domain, via Wikimedia Commons",
      "role": "gallery",
      "alt": "The Pacific Ocean from orbit — cloud streets over deep blue water",
      "sortOrder": 2
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point (0, −160), area 161,760,000 km², maximum depth 11,034 m",
      "sourceName": "Wikidata — Q98 (Pacific Ocean)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q98",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Area including adjacent seas given as 165,250,000 km²; average depth 4,280 m; Challenger Deep modern surveys ≈10,935 m",
      "sourceName": "Wikipedia — \"Pacific Ocean\" (cross-checked)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Pacific_Ocean",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "All photographs: licence, author, dimensions",
      "sourceName": "Wikimedia Commons — imageinfo records (per-file links in the credits)",
      "sourceUrl": "https://commons.wikimedia.org/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Live wave height, direction and period at 0°, 160° W",
      "sourceName": "Open-Meteo Marine API",
      "sourceUrl": "https://open-meteo.com/",
      "checkedAt": "2026-10-22"
    }
  ]
};

const ATLANTIC_OCEAN: Ocean = {
  "slug": "atlantic-ocean",
  "name": "Atlantic Ocean",
  "wikidataQid": "Q97",
  "partOfName": "World Ocean",
  "partOfLabel": "World Ocean · between the Americas, Europe and Africa",
  "seasonTitle": "Hurricane season & the Gulf Stream",
  "wikiTitle": "Atlantic_Ocean",
  "lat": 0,
  "lng": -30,
  "marineTimezone": "UTC",
  "seoTitle": "Atlantic Ocean: Live Waves, Weather & Facts",
  "seoDescription": "The Atlantic Ocean live: wave height at its equatorial point, hurricane-season frame, size and depth facts with sources shown.",
  "intro": [
    "The Atlantic Ocean is the second-largest ocean, occupying an S-shaped basin between the Americas to the west and Europe and Africa to the east. At 106,460,000 km² it covers about a fifth of the Earth’s surface, and it is — geologically — the youngest great ocean: it opened as the Americas pulled away from Europe and Africa, and it is still widening by a few centimetres a year along the Mid-Atlantic Ridge.",
    "That ridge, the longest mountain range on Earth, runs down the Atlantic’s spine, surfacing as Iceland, the Azores and other islands. The ocean it divides is the historic highway of the modern world — the routes of exploration, trade, migration and the first transatlantic cables and flights all crossed it — and its currents, above all the Gulf Stream, quietly set the climate of northwestern Europe.",
    "Its deepest point lies in the Puerto Rico Trench (the Milwaukee Deep), and its most famous season is the hurricane season, June to November, when Cape Verde storms cross the warm tropics toward the Caribbean and North America. The live block on this page samples open-ocean waves at the equator point (0°, 30° W)."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "World Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "106,460,000 km²",
      "source": "Wikidata"
    },
    {
      "label": "Average depth",
      "value": "3,646 m",
      "source": "Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "8,605 m",
      "source": "Wikidata (see sources note)"
    },
    {
      "label": "Deepest point",
      "value": "Milwaukee Deep, Puerto Rico Trench",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "0°, 30° W",
      "source": "Wikidata"
    },
    {
      "label": "Defining feature",
      "value": "The Mid-Atlantic Ridge — the ocean is still widening",
      "source": "Wikipedia"
    }
  ],
  "geography": [
    "West: North and South America. East: Europe and Africa. North: the Arctic Ocean between Greenland and Scandinavia; south: the Southern Ocean from about 60° S. The equator splits it into the North and South Atlantic, whose gyres turn in opposite directions. Marginal seas include the Caribbean Sea, the Mediterranean (through Gibraltar), the North Sea, the Baltic and the Gulf of Mexico. The shortest crossing — Brazil to West Africa — is under 3,000 km; at its widest the ocean spans more than 11,000 km (Wikipedia)."
  ],
  "monsoon": [
    "The Atlantic’s governing season is the hurricane season, officially 1 June to 30 November: warm tropical water, moist air and low wind shear let storms organise off West Africa and track west, the strongest of them curving toward the Caribbean, the Gulf of Mexico and the US coast, with a climatological peak around 10 September. Outside the season the tropical Atlantic is comparatively quiet, while winter extratropical storms take over the North Atlantic’s higher latitudes.",
    "The Gulf Stream is the ocean’s other standing fact: a warm, fast current flowing from Florida along North America’s coast and across toward Europe, part of the Atlantic Meridional Overturning Circulation. It carries tropical heat north-eastward on a scale that measurably warms northwestern Europe’s winters relative to its latitude."
  ],
  "coastalCity": null,
  "faqs": [
    {
      "q": "How big is the Atlantic Ocean?",
      "a": "106,460,000 km² (Wikidata) — the second-largest ocean, covering roughly 20% of the Earth’s surface."
    },
    {
      "q": "What is the deepest point in the Atlantic?",
      "a": "The Milwaukee Deep in the Puerto Rico Trench — 8,605 m on Wikidata’s record; some references give 8,376 m for the trench’s deepest sounding. This page shows the Wikidata figure with the variant recorded in its sources."
    },
    {
      "q": "Is the Atlantic really getting wider?",
      "a": "Yes — seafloor spreading along the Mid-Atlantic Ridge pushes the Americas and Europe/Africa apart by roughly 2–5 cm a year, about the rate fingernails grow."
    },
    {
      "q": "When is Atlantic hurricane season?",
      "a": "1 June to 30 November, with the climatological peak around 10 September. Most major hurricanes are Cape Verde-type storms that form off West Africa in August and September."
    }
  ],
  "media": [
    {
      "fileTitle": "Staring Down Hurricane Florence.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Staring_Down_Hurricane_Florence.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Staring_Down_Hurricane_Florence.jpg",
      "width": 5322,
      "height": 3558,
      "licence": "Public domain",
      "licenceUrl": "https://commons.wikimedia.org/wiki/Commons:Public_domain",
      "author": "Alexander Gerst (ESA/NASA)",
      "attribution": "\"Staring Down Hurricane Florence.jpg\" by Alexander Gerst (ESA/NASA) — public domain, via Wikimedia Commons",
      "role": "hero",
      "alt": "Hurricane Florence over the Atlantic Ocean seen from the International Space Station",
      "sortOrder": 1
    },
    {
      "fileTitle": "Cyclone Catarina from the ISS on March 26 2004.JPG",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/8/89/Cyclone_Catarina_from_the_ISS_on_March_26_2004.JPG",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Cyclone_Catarina_from_the_ISS_on_March_26_2004.JPG",
      "width": 3032,
      "height": 2004,
      "licence": "Public domain",
      "licenceUrl": "https://commons.wikimedia.org/wiki/Commons:Public_domain",
      "author": "NASA (astronaut photograph ISS008-E-19646)",
      "attribution": "\"Cyclone Catarina from the ISS on March 26 2004.JPG\" by NASA — public domain, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Cyclone Catarina off Brazil in 2004 — the South Atlantic’s rare hurricane-strength cyclone",
      "sortOrder": 2
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point (0, −30), area 106,460,000 km², maximum depth 8,605 m",
      "sourceName": "Wikidata — Q97 (Atlantic Ocean)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q97",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Average depth 3,646 m; Milwaukee Deep named; some references give 8,376 m for the Puerto Rico Trench",
      "sourceName": "Wikipedia — \"Atlantic Ocean\" (cross-checked)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Atlantic_Ocean",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "All photographs: licence, author, dimensions",
      "sourceName": "Wikimedia Commons — imageinfo records (per-file links in the credits)",
      "sourceUrl": "https://commons.wikimedia.org/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Live wave height, direction and period at 0°, 30° W",
      "sourceName": "Open-Meteo Marine API",
      "sourceUrl": "https://open-meteo.com/",
      "checkedAt": "2026-10-22"
    }
  ]
};

const INDIAN_OCEAN: Ocean = {
  "slug": "indian-ocean",
  "name": "Indian Ocean",
  "wikidataQid": "Q1239",
  "partOfName": "World Ocean",
  "partOfLabel": "World Ocean · the monsoon ocean",
  "seasonTitle": "The monsoon ocean",
  "wikiTitle": "Indian_Ocean",
  "lat": -20,
  "lng": 80,
  "marineTimezone": "Asia/Karachi",
  "seoTitle": "Indian Ocean: Live Waves, Monsoon & Facts",
  "seoDescription": "The Indian Ocean live: wave height today, the monsoon system explained, Karachi coastal weather, size and depth facts — every figure sourced.",
  "intro": [
    "The Indian Ocean is the third-largest ocean and the only one named after a country. It is bounded by East Africa to the west, Asia — the Arabian Peninsula, the Indian subcontinent and the Malay Peninsula — to the north, the East Indies and Australia to the east, and the Southern Ocean to the south. At 70,560,000 km² it covers about a fifth of the world’s ocean surface.",
    "It is the warmest ocean and the monsoon ocean: alone among the great oceans it is closed by land at tropical latitudes in the north, so its northern winds and currents reverse with the seasons — the pattern that powered two thousand years of sail trade between East Africa, Arabia, India and Southeast Asia, and that still times the rains of South Asia. Its northwestern arm, the Arabian Sea, has its own page on this site; its other great marginal seas include the Bay of Bengal, the Red Sea and the Persian Gulf.",
    "Its deepest measured point lies in the Java (Sunda) Trench system off Indonesia, and its floor carries the scars and ridges of the subcontinent’s long drift north from Gondwana into Asia — the collision that raised the Himalaya. Karachi, on its northern shore, is this page’s published coastal city; the live block samples open-ocean waves at the ocean’s representative point (20° S, 80° E) beside Karachi’s coastal weather."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "World Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "70,560,000 km²",
      "source": "Wikidata"
    },
    {
      "label": "Average depth",
      "value": "3,741 m",
      "source": "Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "7,450 m",
      "source": "Wikidata (see sources note)"
    },
    {
      "label": "Defining pattern",
      "value": "The monsoon — winds and northern currents reverse with the seasons",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "20° S, 80° E",
      "source": "Wikidata"
    },
    {
      "label": "Northern shore on this site",
      "value": "Karachi, Pakistan — its great northern port",
      "source": "Wikipedia"
    }
  ],
  "geography": [
    "West: East Africa and the Arabian Peninsula (across the Red Sea and the Gulf of Aden). North: South Asia — Pakistan, India, Bangladesh, Myanmar. East: Thailand, Malaysia, Indonesia and Australia. South: the Southern Ocean from about 60° S. The equator crosses it, but most of its bulk lies in the southern hemisphere; its island nations and territories include Sri Lanka, the Maldives, Mauritius, Seychelles and Madagascar off Africa (Wikipedia)."
  ],
  "monsoon": [
    "The Indian Ocean is the monsoon’s home water. In summer the Asian landmass heats faster than the ocean, winds reverse to blow from the southwest, and the Somali Current itself turns around to flow north-east — the only great ocean current that changes direction with the seasons — carrying the rains to India’s west coast. In winter the flow relaxes back to the northeast monsoon: drier winds off the land, calmer northern seas.",
    "That twice-yearly reversal scheduled civilisation here: dhows rode the southwest monsoon to India and waited for the northeast monsoon to carry them home to Arabia and East Africa. It still schedules the ocean today — fisheries, shipping weather windows and the South Asian rains all run on the monsoon clock, which is why this page pairs the season frame with the live wave picture rather than a static description."
  ],
  "coastalCity": {
    "name": "Karachi",
    "countryName": "Pakistan",
    "path": "/pakistan/sindh/karachi",
    "lat": 24.8607,
    "lng": 67.0011,
    "timezone": "Asia/Karachi"
  },
  "faqs": [
    {
      "q": "How big is the Indian Ocean?",
      "a": "70,560,000 km² (Wikidata) — the third-largest ocean, about 20% of the world’s ocean area."
    },
    {
      "q": "What is the deepest point in the Indian Ocean?",
      "a": "Wikidata records a maximum depth of 7,450 m. The deepest surveyed point is in the Diamantina Trench area southwest of Australia, where the Five Deeps expedition measured about 7,257 m in 2019 — both figures are carried in this page’s sources rather than one being hidden."
    },
    {
      "q": "Why is the Indian Ocean called the monsoon ocean?",
      "a": "Because its northern half is closed by Asia, its winds and currents reverse with the seasons — the southwest monsoon in summer, the northeast monsoon in winter — a pattern no other great ocean shows so completely."
    },
    {
      "q": "Is the Arabian Sea part of the Indian Ocean?",
      "a": "Yes — the Arabian Sea is the Indian Ocean’s northwestern arm, between Arabia, Iran, Pakistan and India. It has its own dedicated page on this site with Karachi coastal coverage."
    }
  ],
  "media": [
    {
      "fileTitle": "Aerial shot of a small island on a coral reef in the Maldives.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0c/Aerial_shot_of_a_small_island_on_a_coral_reef_in_the_Maldives.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Aerial_shot_of_a_small_island_on_a_coral_reef_in_the_Maldives.jpg",
      "width": 3756,
      "height": 1872,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Dr. Ondřej Havelka",
      "attribution": "\"Aerial shot of a small island on a coral reef in the Maldives.jpg\" by Dr. Ondřej Havelka — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "An aerial view of a small coral island and reef in the Maldives, Indian Ocean",
      "sortOrder": 1
    },
    {
      "fileTitle": "1 Maldives, Indian Ocean, Asia.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/e/eb/1_Maldives%2C_Indian_Ocean%2C_Asia.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:1_Maldives,_Indian_Ocean,_Asia.jpg",
      "width": 2673,
      "height": 1447,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Dr. Ondřej Havelka",
      "attribution": "\"1 Maldives, Indian Ocean, Asia.jpg\" by Dr. Ondřej Havelka — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Palm-fringed island and turquoise shallows in the Maldives",
      "sortOrder": 2
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point (−20, 80), area 70,560,000 km², maximum depth 7,450 m",
      "sourceName": "Wikidata — Q1239 (Indian Ocean)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q1239",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Average depth 3,741 m; Diamantina Trench Five Deeps measurement ≈7,257 m (2019)",
      "sourceName": "Wikipedia — \"Indian Ocean\" (cross-checked)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Indian_Ocean",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "All photographs: licence, author, dimensions",
      "sourceName": "Wikimedia Commons — imageinfo records (per-file links in the credits)",
      "sourceUrl": "https://commons.wikimedia.org/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Live wave height, direction and period at 20° S, 80° E; Karachi coastal weather",
      "sourceName": "Open-Meteo Marine & Forecast APIs",
      "sourceUrl": "https://open-meteo.com/",
      "checkedAt": "2026-10-22"
    }
  ]
};

const ARCTIC_OCEAN: Ocean = {
  "slug": "arctic-ocean",
  "name": "Arctic Ocean",
  "wikidataQid": "Q788",
  "partOfName": "World Ocean",
  "partOfLabel": "World Ocean · the smallest and shallowest ocean",
  "seasonTitle": "The ice ocean",
  "wikiTitle": "Arctic_Ocean",
  "lat": 79.1386,
  "lng": -3.239,
  "marineTimezone": "UTC",
  "seoTitle": "Arctic Ocean: Live Point Data, Ice Seasons & Facts",
  "seoDescription": "The Arctic Ocean: live data at its polar point, the sea-ice year explained, size and depth facts with sources — the smallest, shallowest, coldest ocean.",
  "intro": [
    "The Arctic Ocean is the smallest, shallowest and coldest of the great oceans — 14,056,000 km² of mostly ice-covered water around the North Pole, ringed by the northern coasts of North America, Greenland, Europe and Asia. Almost landlocked, it receives huge river inflows from Siberia and Canada, which freshen its surface layer and help its sea ice form each winter.",
    "Its defining fact is the ice itself: a floating cap that grows through the polar night to a March maximum of about 15 million km² and melts back to a September minimum that, in recent decades, has shrunk dramatically — the September extent has been declining at roughly 13% per decade since satellite records began in 1979 (NASA/NSIDC figures, reported in the sources below). Beneath the ice, the Lomonosov Ridge crosses from Siberia toward Greenland, and the ocean’s deepest point, the Molloy Deep, drops 5,550 m near Svalbard’s Fram Strait.",
    "The Arctic is warming several times faster than the global average — \"Arctic amplification\" — and its opening water is redrawing shipping maps (the Northern Sea Route and the Northwest Passage) and geopolitics alike. There is no published WorldCityHub coastal city on this ocean yet, so this page honestly carries the open-ocean panel only, sampled at the ocean’s Wikidata representative point near the pole."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "World Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "14,056,000 km²",
      "source": "Wikidata"
    },
    {
      "label": "Average depth",
      "value": "1,205 m — the shallowest ocean",
      "source": "Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "5,550 m",
      "source": "Wikidata"
    },
    {
      "label": "Deepest point",
      "value": "Molloy Deep, Fram Strait",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "79.14° N, 3.24° W",
      "source": "Wikidata"
    },
    {
      "label": "Defining feature",
      "value": "A floating sea-ice cap that grows and shrinks with the seasons",
      "source": "Wikipedia"
    }
  ],
  "geography": [
    "The Arctic Ocean is ringed by the coasts of Canada, Greenland, Iceland, Norway, Russia and Alaska (USA), connected to the Pacific only by the narrow Bering Strait and to the Atlantic through the Greenland and Norwegian seas and the Canadian Arctic Archipelago’s channels. Much of its area is shallow continental shelf — the Siberian shelves are the widest on Earth — while its centre holds deep basins divided by the Lomonosov and Gakkel ridges (Wikipedia)."
  ],
  "monsoon": [
    "No monsoon reaches the pole; the Arctic year is an ice year. From October the returning polar night lets the surface freeze outward from the coasts until the pack peaks in March; from April, 24-hour daylight works the ice back until the September minimum. River freshets in late spring push great plumes of fresh water — and the nutrients and sediments of half a continent — under and through the melting ice.",
    "The long trend inside that annual cycle is the story: multi-year ice has thinned and the September minimum has shrunk by roughly 13% per decade since 1979 in the satellite record. What a visitor or a ship meets in a given September now differs measurably from a generation ago — which is why this page shows the season frame as climatology and reserves its live panel for today’s measured point data."
  ],
  "coastalCity": null,
  "faqs": [
    {
      "q": "How big is the Arctic Ocean?",
      "a": "14,056,000 km² (Wikidata) — the smallest of the five oceans, about a fifth the size of the Indian Ocean."
    },
    {
      "q": "What is the deepest point in the Arctic Ocean?",
      "a": "The Molloy Deep in the Fram Strait, at 5,550 m — Wikidata’s figure, matching the Five Deeps expedition’s 2019 survey of the site."
    },
    {
      "q": "Is the Arctic ice really shrinking?",
      "a": "The September sea-ice extent has declined at about 13% per decade since satellite monitoring began in 1979 (NASA/NSIDC). Winter ice still forms across most of the ocean each year; it is the summer minimum and the share of thick multi-year ice that are falling."
    },
    {
      "q": "Which countries border the Arctic Ocean?",
      "a": "Canada, Denmark (via Greenland), Iceland, Norway, Russia and the United States (Alaska) — the \"Arctic Five\" littoral states plus Iceland with Arctic territory and waters."
    }
  ],
  "media": [
    {
      "fileTitle": "Arctic Sea Ice Lead (7873353514).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Arctic_Sea_Ice_Lead_%287873353514%29.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Arctic_Sea_Ice_Lead_(7873353514).jpg",
      "width": 5616,
      "height": 3744,
      "licence": "Public domain",
      "licenceUrl": "https://commons.wikimedia.org/wiki/Commons:Public_domain",
      "author": "NASA Goddard Space Flight Center",
      "attribution": "\"Arctic Sea Ice Lead (7873353514).jpg\" by NASA Goddard Space Flight Center — public domain, via Wikimedia Commons",
      "role": "hero",
      "alt": "A lead of open water cutting through Arctic sea ice, seen from the air",
      "sortOrder": 1
    },
    {
      "fileTitle": "Arctic sea ice varied (7873355004).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Arctic_sea_ice_varied_%287873355004%29.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Arctic_sea_ice_varied_(7873355004).jpg",
      "width": 5616,
      "height": 3744,
      "licence": "Public domain",
      "licenceUrl": "https://commons.wikimedia.org/wiki/Commons:Public_domain",
      "author": "NASA Goddard Space Flight Center",
      "attribution": "\"Arctic sea ice varied (7873355004).jpg\" by NASA Goddard Space Flight Center — public domain, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Varied Arctic sea-ice floes and melt ponds from above",
      "sortOrder": 2
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point, area 14,056,000 km², maximum depth 5,550 m",
      "sourceName": "Wikidata — Q788 (Arctic Ocean)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q788",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Average depth 1,205 m; Molloy Deep; sea-ice cycle",
      "sourceName": "Wikipedia — \"Arctic Ocean\" (cross-checked)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Arctic_Ocean",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "September sea-ice decline ≈13% per decade since 1979",
      "sourceName": "NASA / NSIDC sea-ice index (reported via Wikipedia)",
      "sourceUrl": "https://nsidc.org/arcticseaicenews/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "All photographs: licence, author, dimensions",
      "sourceName": "Wikimedia Commons — imageinfo records (per-file links in the credits)",
      "sourceUrl": "https://commons.wikimedia.org/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Live wave/point data at the representative point",
      "sourceName": "Open-Meteo Marine API",
      "sourceUrl": "https://open-meteo.com/",
      "checkedAt": "2026-10-22"
    }
  ]
};

const SOUTHERN_OCEAN: Ocean = {
  "slug": "southern-ocean",
  "name": "Southern Ocean",
  "wikidataQid": "Q7354",
  "partOfName": "World Ocean",
  "partOfLabel": "World Ocean · the ocean around Antarctica",
  "seasonTitle": "The stormiest waters on Earth",
  "wikiTitle": "Southern_Ocean",
  "lat": -65,
  "lng": 90,
  "marineTimezone": "UTC",
  "seoTitle": "Southern Ocean: Live Waves, Facts & the Boundary Debate",
  "seoDescription": "The Southern Ocean live: wave height at 65° S, the Antarctic Circumpolar Current, the sea-ice pulse and the honest story of its disputed boundary.",
  "intro": [
    "The Southern Ocean is the water around Antarctica — the only ocean that flows completely around the globe, driven by the Roaring Forties and Furious Fifties westerlies through the one stretch of sea with no land to stop it. Most authorities draw it south of 60° S; on that measure Wikidata records 20,327,000 km², making it the second-smallest ocean, larger than the Arctic.",
    "Its existence is itself a documented disagreement, and this page shows it rather than hiding it: the International Hydrographic Organization proposed the Southern Ocean in its 2000 draft limits but never formally ratified the definition, while National Geographic recognised it in 2021 and most oceanographers treat the Antarctic Convergence — where cold Antarctic water meets warmer subantarctic water — as its true, moving boundary. What is not disputed is the water: the Antarctic Circumpolar Current moves more water than any other current on Earth, connecting the Pacific, Atlantic and Indian oceans into one system.",
    "Twice a year the ocean performs the largest seasonal transformation on the planet: Antarctic sea ice grows outward in the austral winter until it roughly doubles the continent’s area, then retreats almost to the coast in summer. The live block on this page samples waves at its representative point (65° S, 90° E) — in the wind belt that made these latitudes a byword for the roughest seas on Earth."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "World Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "20,327,000 km² (south of 60° S)",
      "source": "Wikidata"
    },
    {
      "label": "Average depth",
      "value": "3,270 m",
      "source": "Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "7,235 m",
      "source": "Wikidata (see sources note)"
    },
    {
      "label": "Defining current",
      "value": "Antarctic Circumpolar Current — the strongest ocean current on Earth",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "65° S, 90° E",
      "source": "Wikidata"
    },
    {
      "label": "Status debate",
      "value": "Boundary and status not formally ratified by the IHO (2000 draft)",
      "source": "Wikipedia"
    }
  ],
  "geography": [
    "The Southern Ocean surrounds Antarctica, touching the southern tips of South America (through the Drake Passage), Africa and Australia only at its northern fringe. It includes the great Antarctic marginal seas — Weddell, Ross, Amundsen, Bellingshausen — and island groups such as South Georgia, the South Sandwich Islands, Kerguelen and Heard Island. Its northern boundary is the honest argument described in the intro: the fixed 60° S line on charts versus the oceanographic Antarctic Convergence, which wanders between roughly 48° S and 61° S with season and longitude (Wikipedia)."
  ],
  "monsoon": [
    "The Southern Ocean’s seasons are the ice pulse and the wind. In the austral winter the sea surface freezes outward for thousands of kilometres — Antarctic sea ice grows from about 3 million km² in February to some 18 million km² in September, the largest seasonal ice change anywhere — while the westerlies drive the Circumpolar Current and stack up some of the biggest average wave heights on the planet, in every season.",
    "Summer reverses the picture: the ice retreats almost to the continent, research stations and the small Antarctic tourism season open, and krill swarm in the sunlit surface waters that feed the Southern Ocean’s whales, seals and penguins. Recent years have broken the pattern’s records — Antarctic sea-ice extents set new lows in 2023 — which is recorded here as reported context, not a live figure; the live panel above is today’s measurement only."
  ],
  "coastalCity": null,
  "faqs": [
    {
      "q": "Is the Southern Ocean officially an ocean?",
      "a": "It depends whose authority you ask — and this page shows the disagreement: the IHO drafted it in 2000 but never ratified the limits; the US Board on Geographic Names and National Geographic (from 2021) recognise it; many scientists use the Antarctic Convergence as its real boundary. Wikidata records it as the fifth ocean, Q7354."
    },
    {
      "q": "How big is the Southern Ocean?",
      "a": "20,327,000 km² on the 60° S definition (Wikidata) — the second-smallest ocean, ahead of the Arctic."
    },
    {
      "q": "What is the deepest point in the Southern Ocean?",
      "a": "Wikidata records 7,235 m. The Five Deeps expedition measured the Factorian Deep in the South Sandwich Trench at about 7,432 m in 2019 — the two figures are both carried in this page’s sources."
    },
    {
      "q": "What is the Antarctic Circumpolar Current?",
      "a": "The strongest ocean current on Earth — a continuous eastward flow around Antarctica, unblocked by any continent, moving on the order of 130+ million cubic metres per second and linking the Pacific, Atlantic and Indian oceans."
    }
  ],
  "media": [
    {
      "fileTitle": "South Shetland-2016-Southern Ocean (off Elephant Island)–Iceberg 01.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/c/ca/South_Shetland-2016-Southern_Ocean_%28off_Elephant_Island%29%E2%80%93Iceberg_01.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:South_Shetland-2016-Southern_Ocean_(off_Elephant_Island)%E2%80%93Iceberg_01.jpg",
      "width": 7688,
      "height": 5125,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Godot13",
      "attribution": "\"South Shetland-2016-Southern Ocean (off Elephant Island)–Iceberg 01.jpg\" by Godot13 — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "An iceberg in the Southern Ocean off Elephant Island, South Shetlands",
      "sortOrder": 1
    },
    {
      "fileTitle": "Iceberg Antarctica edit1.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/5/56/Iceberg_Antarctica_edit1.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Iceberg_Antarctica_edit1.jpg",
      "width": 3135,
      "height": 2298,
      "licence": "CC BY 2.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/2.0",
      "author": "Ben Stephenson (derivative edit by hike395)",
      "attribution": "\"Iceberg Antarctica edit1.jpg\" by Ben Stephenson, derivative edit by hike395 — CC BY 2.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "A sculpted blue iceberg floating in Antarctic waters",
      "sortOrder": 2
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point (−65, 90), area 20,327,000 km², maximum depth 7,235 m",
      "sourceName": "Wikidata — Q7354 (Southern Ocean)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q7354",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Average depth 3,270 m; IHO 2000 draft never ratified; National Geographic recognition 2021; Factorian Deep ≈7,432 m (Five Deeps, 2019)",
      "sourceName": "Wikipedia — \"Southern Ocean\" (cross-checked)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Southern_Ocean",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "All photographs: licence, author, dimensions",
      "sourceName": "Wikimedia Commons — imageinfo records (per-file links in the credits)",
      "sourceUrl": "https://commons.wikimedia.org/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Live wave height, direction and period at 65° S, 90° E",
      "sourceName": "Open-Meteo Marine API",
      "sourceUrl": "https://open-meteo.com/",
      "checkedAt": "2026-10-22"
    }
  ]
};

// ─── SEAS BATCH (R3B, 2026-10-22) ───────────────────────────────────────
// Ten seas on the golden ocean pattern. QIDs verified by description
// match (the Persian Gulf is Q34675 — Q37643, the 1990–91 war item,
// was rejected). Areas/coords from Wikidata; depths cross-checked with
// Wikipedia and every figure variant recorded in the row's sources.
// coastalCity is null for all ten: no published WorldCityHub city
// stands on these seas yet, so the coastal blocks hide — never faked.
// BUILT only: PUBLISHED_OCEANS stays Arabian-Sea-only, hub links
// unchanged, sitemap untouched; migration 0012 seeds them as drafts.

const MEDITERRANEAN_SEA: Ocean = {
  "slug": "mediterranean-sea",
  "name": "Mediterranean Sea",
  "wikidataQid": "Q4918",
  "partOfName": "Atlantic Ocean",
  "partOfLabel": "Atlantic Ocean · the sea between the continents",
  "seasonTitle": "Mistral, sirocco & the winter storm season",
  "wikiTitle": "Mediterranean_Sea",
  "lat": 38,
  "lng": 17,
  "marineTimezone": "Europe/Rome",
  "seoTitle": "Mediterranean Sea: Live Waves, Weather & Facts",
  "seoDescription": "The Mediterranean Sea live: wave height, size and depth facts with sources shown, and its seasons explained.",
  "intro": [
    "The Mediterranean Sea is the world's largest inland sea, almost entirely enclosed by Europe to the north, Asia to the east and Africa to the south, and connected to the Atlantic only by the 14-kilometre Strait of Gibraltar. Some 46,000 kilometres of coastline and more than 3,000 islands — Sicily, Sardinia, Cyprus, Crete among them — frame the basin that hosted the Phoenician, Greek, Roman and Ottoman worlds.",
    "It is a sea in negative balance: evaporation exceeds the rain and river inflow, so Atlantic surface water pours in at Gibraltar while dense, salty Mediterranean water slips out beneath — a circulation that takes roughly a century to renew the whole basin. Its waters are famously clear and famously poor in nutrients, yet the sea holds an outsized share of the world's marine species for its size.",
    "The Mediterranean is warming faster than the global ocean average, tropical species are arriving through the Suez Canal (Lessepsian migration), and its eastern basin reaches some of the highest summer sea temperatures of any large sea. The live block on this page samples conditions at the sea's Wikidata representative point in the Ionian."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "Atlantic Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "2,500,000 km²",
      "source": "Wikidata"
    },
    {
      "label": "Average depth",
      "value": "1,500 m",
      "source": "Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "5,267 m — Calypso Deep, Ionian Sea",
      "source": "Wikipedia"
    },
    {
      "label": "Connection to the ocean",
      "value": "Strait of Gibraltar, ≈14 km wide",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "38° N, 17° E",
      "source": "Wikidata"
    }
  ],
  "geography": [
    "Europe to the north (Spain, France, Italy, the Balkans, Greece), Asia to the east (Turkey, the Levant), Africa to the south (Morocco to Egypt). Named sub-basins include the Adriatic, Aegean, Ionian, Tyrrhenian, Ligurian, Balearic and Levantine seas. Two artificial and natural doors matter most: Gibraltar to the Atlantic, and the Suez Canal (1869) to the Red Sea (Wikipedia)."
  ],
  "monsoon": [
    "No monsoon — the Mediterranean runs on winter storms and named local winds: the cold, dry mistral down the Rhône valley, the hot Saharan sirocco from the south, the summer etesian (meltemi) winds of the Aegean. Autumn brings the sea's most dangerous weather, when warm water fuels intense cyclones — occasionally full 'medicanes', Mediterranean hurricanes.",
    "Summer is the calm, hot season the tourist calendar is built on, with sea temperatures reaching 28–30 °C in the east; winter delivers the rain that the surrounding lands depend on, and the deep-water formation events in the Gulf of Lion and the Adriatic that ventilate the whole basin."
  ],
  "coastalCity": null,
  "faqs": [
    {
      "q": "How big is the Mediterranean Sea?",
      "a": "About 2,500,000 km² (Wikidata) — roughly 0.7% of the world ocean's surface, holding a disproportionate share of its marine species and nearly all of its oldest maritime history."
    },
    {
      "q": "What is the deepest point of the Mediterranean?",
      "a": "The Calypso Deep in the Ionian Sea, at 5,267 m — the trench system off Greece is the basin's deepest structure."
    },
    {
      "q": "Is the Mediterranean connected to the Atlantic?",
      "a": "Yes — through the Strait of Gibraltar, only about 14 km wide. Atlantic water flows in at the surface to replace what evaporation removes."
    },
    {
      "q": "Why is the Mediterranean so clear?",
      "a": "It is an oligotrophic (nutrient-poor) sea: little river inflow and an anti-estuarine circulation keep plankton levels low, so the water stays exceptionally transparent."
    }
  ],
  "media": [
    {
      "fileTitle": "Aerial photographs of Israel IMG 2006.JPG",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/6/64/Aerial_photographs_of_Israel_IMG_2006.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Aerial_photographs_of_Israel_IMG_2006.JPG",
      "width": 3648,
      "height": 2736,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "deror_avi",
      "attribution": "\"Aerial photographs of Israel IMG 2006.JPG\" by deror_avi — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "Mediterranean Sea — representative view",
      "sortOrder": 1
    },
    {
      "fileTitle": "Aerial photographs of Israel IMG 2007.JPG",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/6/69/Aerial_photographs_of_Israel_IMG_2007.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Aerial_photographs_of_Israel_IMG_2007.JPG",
      "width": 3648,
      "height": 2736,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "deror_avi",
      "attribution": "\"Aerial photographs of Israel IMG 2007.JPG\" by deror_avi — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Mediterranean Sea — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Aerial photographs of Israel IMG 2008.JPG",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/4/49/Aerial_photographs_of_Israel_IMG_2008.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Aerial_photographs_of_Israel_IMG_2008.JPG",
      "width": 3648,
      "height": 2736,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "deror_avi",
      "attribution": "\"Aerial photographs of Israel IMG 2008.JPG\" by deror_avi — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Mediterranean Sea — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point (38, 17), area",
      "sourceName": "Wikidata — Q4918 (Mediterranean Sea)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q4918",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Average/maximum depth and geography detail",
      "sourceName": "Wikipedia — \"Mediterranean Sea\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/Mediterranean_Sea",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Figure variants: Area is quoted between 2.5 and 2.51 million km² across references; the page uses the Wikidata figure. Maximum depth 5,267 m (Calypso Deep) is the commonly published survey value.",
      "sourceName": "WorldCityHub R3B dataset note",
      "sourceUrl": "https://en.wikipedia.org/wiki/Mediterranean_Sea",
      "checkedAt": "2026-10-22"
    }
  ]
};

const CARIBBEAN_SEA: Ocean = {
  "slug": "caribbean-sea",
  "name": "Caribbean Sea",
  "wikidataQid": "Q1247",
  "partOfName": "Atlantic Ocean",
  "partOfLabel": "Atlantic Ocean · the tropical American sea",
  "seasonTitle": "Hurricane season & the trade winds",
  "wikiTitle": "Caribbean_Sea",
  "lat": 15,
  "lng": -75,
  "marineTimezone": "America/Puerto_Rico",
  "seoTitle": "Caribbean Sea: Live Waves, Weather & Facts",
  "seoDescription": "The Caribbean Sea live: wave height, size and depth facts with sources shown, and its seasons explained.",
  "intro": [
    "The Caribbean Sea is a tropical marginal sea of the western Atlantic, bounded by the coasts of Central and South America to the south and west and enclosed to the north and east by the island arcs of the Greater and Lesser Antilles. Its warm, clear water — fed by the North Equatorial Current through the island passages — exits through the Yucatán Channel to become the Gulf Stream.",
    "Beneath the postcard surface lies the deepest water in the Atlantic tropics: the Cayman Trough between Jamaica and the Cayman Islands plunges to 7,686 metres, close to the boundary where the North American and Caribbean plates slide past each other.",
    "The Caribbean is one of the world's great biodiversity and tourism regions — coral reefs, the Mesoamerican Barrier Reef (the Atlantic's largest), and a hurricane corridor whose season, June to November, structures life on every island in it. The live block samples the sea at its Wikidata representative point south of Jamaica."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "Atlantic Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "2,754,000 km²",
      "source": "Wikidata"
    },
    {
      "label": "Average depth",
      "value": "≈2,200 m",
      "source": "Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "7,686 m — Cayman Trough",
      "source": "Wikipedia"
    },
    {
      "label": "Outlet",
      "value": "Yucatán Channel → Gulf of Mexico → Gulf Stream",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "15° N, 75° W",
      "source": "Wikidata"
    }
  ],
  "geography": [
    "South and west: Venezuela, Colombia, Panama, Costa Rica, Nicaragua, Honduras, Belize and Mexico's Yucatán. North and east: Cuba, Hispaniola, Puerto Rico and the Lesser Antilles chain down to Grenada. The sea's great sub-basins — Venezuelan, Colombian, Cayman and Yucatán — are divided by submarine ridges (Wikipedia)."
  ],
  "monsoon": [
    "The Caribbean's year divides by the Atlantic hurricane season (1 June – 30 November): trade winds dominate the dry months, then the season's Cape Verde and in-situ storms track west across the sea, most intensely from August to October. It is the same season that fills the sea with sargassum in heavy years.",
    "Outside the storms, the easterly trades keep conditions remarkably steady — water 26–29 °C year-round — which is why the reef systems and the sailing calendar both treat winter as high season."
  ],
  "coastalCity": null,
  "faqs": [
    {
      "q": "How deep is the Caribbean Sea?",
      "a": "Its average depth is about 2,200 m, and the Cayman Trough reaches 7,686 m — the deepest point in the tropical Atlantic."
    },
    {
      "q": "Where does Caribbean water go?",
      "a": "North-west through the Yucatán Channel into the Gulf of Mexico, then out through the Florida Straits as the core of the Gulf Stream."
    },
    {
      "q": "When is hurricane season in the Caribbean?",
      "a": "Officially 1 June to 30 November, peaking from mid-August to late October."
    },
    {
      "q": "What is the largest reef system in the Caribbean?",
      "a": "The Mesoamerican Barrier Reef off Belize, Honduras, Guatemala and Mexico — about 1,000 km, the largest barrier reef in the Atlantic."
    }
  ],
  "media": [
    {
      "fileTitle": "Aerial of the island of Holbox, Mexico (28707744657).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/2/21/Aerial_of_the_island_of_Holbox%2C_Mexico_%2828707744657%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Aerial_of_the_island_of_Holbox,_Mexico_(28707744657).jpg",
      "width": 5464,
      "height": 3070,
      "licence": "CC BY 2.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/2.0",
      "author": "dronepicr",
      "attribution": "\"Aerial of the island of Holbox, Mexico (28707744657).jpg\" by dronepicr — CC BY 2.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "Caribbean Sea — representative view",
      "sortOrder": 1
    },
    {
      "fileTitle": "Curacao Fort Beekenburg Luftbild (213574135).jpeg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Curacao_Fort_Beekenburg_Luftbild_%28213574135%29.jpeg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Curacao_Fort_Beekenburg_Luftbild_(213574135).jpeg",
      "width": 2048,
      "height": 1535,
      "licence": "CC BY 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/3.0",
      "author": "Dronepicr",
      "attribution": "\"Curacao Fort Beekenburg Luftbild (213574135).jpeg\" by Dronepicr — CC BY 3.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Caribbean Sea — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Curacao Island (213574225).jpeg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Curacao_Island_%28213574225%29.jpeg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Curacao_Island_(213574225).jpeg",
      "width": 2048,
      "height": 1535,
      "licence": "CC BY 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/3.0",
      "author": "Dronepicr",
      "attribution": "\"Curacao Island (213574225).jpeg\" by Dronepicr — CC BY 3.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Caribbean Sea — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point (15, -75), area",
      "sourceName": "Wikidata — Q1247 (Caribbean Sea)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q1247",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Average/maximum depth and geography detail",
      "sourceName": "Wikipedia — \"Caribbean Sea\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/Caribbean_Sea",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Figure variants: Area appears as 2,754,000 km² (Wikidata) and 2,640,000 km² in some compilations that treat marginal bays differently; this page uses the Wikidata figure and shows the variant here.",
      "sourceName": "WorldCityHub R3B dataset note",
      "sourceUrl": "https://en.wikipedia.org/wiki/Caribbean_Sea",
      "checkedAt": "2026-10-22"
    }
  ]
};

const SOUTH_CHINA_SEA: Ocean = {
  "slug": "south-china-sea",
  "name": "South China Sea",
  "wikidataQid": "Q37660",
  "partOfName": "Pacific Ocean",
  "partOfLabel": "Pacific Ocean · the great Asian marginal sea",
  "seasonTitle": "Two monsoons & typhoon alley",
  "wikiTitle": "South_China_Sea",
  "lat": 12,
  "lng": 113,
  "marineTimezone": "Asia/Shanghai",
  "seoTitle": "South China Sea: Live Waves, Weather & Facts",
  "seoDescription": "The South China Sea live: wave height, size and depth facts with sources shown, and its seasons explained.",
  "intro": [
    "The South China Sea is the largest marginal sea of the western Pacific, stretching from the Taiwan Strait to the Strait of Malacca approaches, bordered by China, Vietnam, the Philippines, Malaysia, Brunei and Indonesia's Natuna waters. It covers about 3.5 million km² and carries some of the busiest shipping lanes on Earth — a large share of world trade by value transits it.",
    "Its floor is a young ocean basin (opened by seafloor spreading tens of millions of years ago) ringed by shelves, reefs and island groups — the Paracels, Spratlys, Pratas and Scarborough Shoal among them — whose sovereignty is disputed among the littoral states; this page records geography and measurements only.",
    "Two monsoons a year reverse its surface circulation and winds, and its warm pool breeds typhoons that strike every coast around it. The live block samples conditions at the sea's Wikidata representative point in its central basin."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "Pacific Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "3,500,000 km²",
      "source": "Wikidata"
    },
    {
      "label": "Average depth",
      "value": "≈1,212 m",
      "source": "Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "≈5,016 m (see sources note)",
      "source": "Wikipedia"
    },
    {
      "label": "Key entrances",
      "value": "Taiwan Strait, Luzon Strait, Mindoro and Balabac straits",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "12° N, 113° E",
      "source": "Wikidata"
    }
  ],
  "geography": [
    "West: Vietnam and the Malay Peninsula. North: China and Taiwan. East: the Philippines (Luzon, Palawan). South: Borneo and the Natuna Sea. The deep central basin is separated from the Pacific by the island arcs; the shallow Sunda Shelf floods the south and the Gulf of Tonkin the northwest (Wikipedia)."
  ],
  "monsoon": [
    "Few seas are as monsoon-governed: the northeast monsoon (roughly November–March) drives winds and surface currents down the Vietnam coast, the southwest monsoon (June–September) reverses them — the reversal that timed the historic junk and dhow trade routes.",
    "Typhoons form over its warm waters or enter from the Pacific through the Luzon Strait, peaking in late summer and autumn; the strongest have crossed every coast of the sea."
  ],
  "coastalCity": null,
  "faqs": [
    {
      "q": "How big is the South China Sea?",
      "a": "About 3,500,000 km² (Wikidata) — one of the largest marginal seas in the world, roughly the size of India."
    },
    {
      "q": "How deep is the South China Sea?",
      "a": "On average about 1,212 m; its deepest basin floor is commonly charted near 5,016 m — see the sources note on the variant figure."
    },
    {
      "q": "Which countries border the South China Sea?",
      "a": "China, Taiwan, the Philippines, Vietnam, Malaysia, Brunei and Indonesia (Natuna waters) — with overlapping maritime claims that remain disputed."
    },
    {
      "q": "Why does the South China Sea matter to shipping?",
      "a": "It links the Indian Ocean (via Malacca) to East Asia's ports; estimates commonly cited by UNCTAD put roughly a third of global shipping transiting it."
    }
  ],
  "media": [
    {
      "fileTitle": "1947 South China Sea Islands Map.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/5/59/1947_South_China_Sea_Islands_Map.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:1947_South_China_Sea_Islands_Map.jpg",
      "width": 2654,
      "height": 3840,
      "licence": "CC0",
      "licenceUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "author": "Q9405484",
      "attribution": "\"1947 South China Sea Islands Map.jpg\" by Q9405484 — CC0, via Wikimedia Commons",
      "role": "hero",
      "alt": "South China Sea — representative view",
      "sortOrder": 1
    },
    {
      "fileTitle": "1956 South China Sea Map.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/9/97/1956_South_China_Sea_Map.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:1956_South_China_Sea_Map.jpg",
      "width": 1945,
      "height": 2325,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "C.H.I.D.",
      "attribution": "\"1956 South China Sea Map.jpg\" by C.H.I.D. — Public domain, via Wikimedia Commons",
      "role": "gallery",
      "alt": "South China Sea — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "75967 South-China-Sea-1.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/0/00/75967_South-China-Sea-1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:75967_South-China-Sea-1.jpg",
      "width": 9570,
      "height": 6660,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "Office of the Geographer, US Department of State, US Government",
      "attribution": "\"75967 South-China-Sea-1.jpg\" by Office of the Geographer, US Department of State, US Government — Public domain, via Wikimedia Commons",
      "role": "gallery",
      "alt": "South China Sea — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point (12, 113), area",
      "sourceName": "Wikidata — Q37660 (South China Sea)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q37660",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Average/maximum depth and geography detail",
      "sourceName": "Wikipedia — \"South China Sea\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/South_China_Sea",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Figure variants: Maximum depth is genuinely variant: 5,016 m is the widely published figure, while some compilations give up to about 5,559 m for the basin east of the Spratlys. The page shows the common figure and records the range here rather than picking silently.",
      "sourceName": "WorldCityHub R3B dataset note",
      "sourceUrl": "https://en.wikipedia.org/wiki/South_China_Sea",
      "checkedAt": "2026-10-22"
    }
  ]
};

const RED_SEA: Ocean = {
  "slug": "red-sea",
  "name": "Red Sea",
  "wikidataQid": "Q23406",
  "partOfName": "Indian Ocean",
  "partOfLabel": "Indian Ocean · the young rift sea",
  "seasonTitle": "Heat, khamsin winds & the northern winter",
  "wikiTitle": "Red_Sea",
  "lat": 22,
  "lng": 38,
  "marineTimezone": "Africa/Cairo",
  "seoTitle": "Red Sea: Live Waves, Weather & Facts",
  "seoDescription": "The Red Sea live: wave height, size and depth facts with sources shown, and its seasons explained.",
  "intro": [
    "The Red Sea is a narrow seawater inlet of the Indian Ocean between Africa and the Arabian Peninsula — and geologically an ocean in the making. It occupies part of the Great Rift system: Arabia is splitting away from Africa, the rift floor has been spreading for millions of years, and hot, metal-rich brine pools sit in its central trough.",
    "Almost no rain falls on it and no river flows into it, so evaporation rules: it is among the saltiest seas on Earth (around 40 parts per thousand in the north) and among the warmest, with summer surface temperatures over 30 °C. Its fringing coral reefs, adapted to that heat, are studied worldwide as a possible refuge for corals in a warming ocean.",
    "At its north it forks around the Sinai Peninsula into the Gulfs of Suez and Aqaba; at its south the Bab el-Mandeb strait joins it to the Gulf of Aden. Through Suez it carries the Europe–Asia shipping artery. The live block samples its Wikidata representative point off the Sudanese coast."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "Indian Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "438,000 km²",
      "source": "Wikidata"
    },
    {
      "label": "Average depth",
      "value": "≈490 m",
      "source": "Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "≈3,040 m — central (Suakin) trough",
      "source": "Wikipedia"
    },
    {
      "label": "Salinity",
      "value": "≈36–41‰ — among the saltiest open seas",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "22° N, 38° E",
      "source": "Wikidata"
    }
  ],
  "geography": [
    "West: Egypt, Sudan, Eritrea and Djibouti. East: Saudi Arabia and Yemen. Length ≈2,250 km, greatest width ≈355 km. The northern forks (Suez and Aqaba) are separated by Sinai; the southern gate is Bab el-Mandeb, ≈29 km wide (Wikipedia)."
  ],
  "monsoon": [
    "The Red Sea has a split wind regime: the northern half blows from the northwest almost all year, while the south reverses with the Indian Ocean monsoon — southerlies in winter bring the sea's only real (still slight) seasonal cooling and its rare rain.",
    "Summer heat is extreme (air temperatures regularly above 40 °C on its coasts) and the khamsin/sharqi dust winds cut visibility; divers favour autumn to spring, when the water is clearest and coolest — though 'cool' here still means the mid-20s."
  ],
  "coastalCity": null,
  "faqs": [
    {
      "q": "Why is it called the Red Sea?",
      "a": "The name is ancient and its origin is debated — seasonal blooms of the reddish cyanobacterium Trichodesmium, red-rimmed mountains, and an old colour-direction naming scheme are all proposed; no single explanation is proven."
    },
    {
      "q": "How salty is the Red Sea?",
      "a": "About 36–41 parts per thousand, well above the ocean average of 35 — a result of extreme evaporation, no river inflow and almost no rain."
    },
    {
      "q": "Is the Red Sea really a young ocean?",
      "a": "Yes — it is a rift where continental crust has already split in the central trough and new oceanic crust is forming; given tens of millions of years it becomes an ocean basin."
    },
    {
      "q": "How warm does the Red Sea get?",
      "a": "Summer surface water commonly exceeds 30 °C, among the warmest of any sea; its deep water is also unusually warm (≈21 °C throughout)."
    }
  ],
  "media": [
    {
      "fileTitle": "A swimmer and coral reefs of the Red Sea.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fc/A_swimmer_and_coral_reefs_of_the_Red_Sea.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:A_swimmer_and_coral_reefs_of_the_Red_Sea.jpg",
      "width": 2110,
      "height": 3200,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "kallerna",
      "attribution": "\"A swimmer and coral reefs of the Red Sea.jpg\" by kallerna — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "Red Sea — representative view",
      "sortOrder": 1
    },
    {
      "fileTitle": "Coral (Acropora hemprichii), Ras Katy, Sharm el-Sheij, Egipto, 2022-03-26, DD 108.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Coral_%28Acropora_hemprichii%29%2C_Ras_Katy%2C_Sharm_el-Sheij%2C_Egipto%2C_2022-03-26%2C_DD_108.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Coral_(Acropora_hemprichii),_Ras_Katy,_Sharm_el-Sheij,_Egipto,_2022-03-26,_DD_108.jpg",
      "width": 4322,
      "height": 4322,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Diego Delso",
      "attribution": "\"Coral (Acropora hemprichii), Ras Katy, Sharm el-Sheij, Egipto, 2022-03-26, DD 108.jpg\" by Diego Delso — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Red Sea — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Coral (Annella mollis), parque nacional Ras Muhammad, Egipto, 2022-03-28, DD 108.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/4/42/Coral_%28Annella_mollis%29%2C_parque_nacional_Ras_Muhammad%2C_Egipto%2C_2022-03-28%2C_DD_108.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Coral_(Annella_mollis),_parque_nacional_Ras_Muhammad,_Egipto,_2022-03-28,_DD_108.jpg",
      "width": 4720,
      "height": 4720,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Diego Delso",
      "attribution": "\"Coral (Annella mollis), parque nacional Ras Muhammad, Egipto, 2022-03-28, DD 108.jpg\" by Diego Delso — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Red Sea — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point (22, 38), area",
      "sourceName": "Wikidata — Q23406 (Red Sea)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q23406",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Average/maximum depth and geography detail",
      "sourceName": "Wikipedia — \"Red Sea\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/Red_Sea",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Figure variants: Total area is given as 438,000 km² by Wikidata and up to about 450,000 km² when the northern gulfs are fully counted; maximum depth figures cluster at 2,860–3,040 m by survey. The page uses the Wikidata area and the commonly charted 3,040 m, flagged as approximate.",
      "sourceName": "WorldCityHub R3B dataset note",
      "sourceUrl": "https://en.wikipedia.org/wiki/Red_Sea",
      "checkedAt": "2026-10-22"
    }
  ]
};

const BERING_SEA: Ocean = {
  "slug": "bering-sea",
  "name": "Bering Sea",
  "wikidataQid": "Q44725",
  "partOfName": "Pacific Ocean",
  "partOfLabel": "Pacific Ocean · the cold northern sea",
  "seasonTitle": "Ice edge, Aleutian storms & the long winter",
  "wikiTitle": "Bering_Sea",
  "lat": 58,
  "lng": -178,
  "marineTimezone": "America/Nome",
  "seoTitle": "Bering Sea: Live Waves, Weather & Facts",
  "seoDescription": "The Bering Sea live: wave height, size and depth facts with sources shown, and its seasons explained.",
  "intro": [
    "The Bering Sea is the cold marginal sea of the North Pacific between Alaska and Russia's Far East, joined to the Arctic Ocean by the narrow Bering Strait and fenced to the south by the Aleutian island arc. Its eastern half is one of the broadest continental shelves on Earth — shallow, rich and stormy — while the southwest drops into deep Aleutian Basin water.",
    "This is one of the most productive seas on the planet: its shelf supports vast pollock, salmon and king crab fisheries and seasonal concentrations of seabirds and marine mammals that follow the ice edge's spring bloom.",
    "Winter sea ice covers its northern half, the Aleutian low drives some of the fiercest extratropical storms anywhere, and the strait above it was the ice-age land bridge (Beringia) by which people first reached the Americas. The live block samples conditions at its Wikidata representative point in the deep basin."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "Pacific Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "2,300,000 km²",
      "source": "Wikidata"
    },
    {
      "label": "Average depth",
      "value": "≈1,547 m",
      "source": "Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "≈4,772 m — Aleutian Basin",
      "source": "Wikipedia"
    },
    {
      "label": "Northern gate",
      "value": "Bering Strait, ≈82 km wide",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "58° N, 178° W",
      "source": "Wikidata"
    }
  ],
  "geography": [
    "East: Alaska. West: Kamchatka and Chukotka (Russia). South: the Aleutian and Commander island arcs separate it from the open Pacific, with deep passes (notably Kamchatka Strait) exchanging water. The Anadyr and Bristol bays cut its northern and eastern shores (Wikipedia)."
  ],
  "monsoon": [
    "No monsoon — the Bering runs on ice and storms. From roughly October the northern sea freezes southward; the ice edge is the engine of the spring bloom that feeds the food web. The Aleutian Low steers Pacific storms into the sea all winter; summer is the short, foggy working season for the fisheries.",
    "In recent decades the winter ice has repeatedly failed to reach its old extent (notably 2018–2019), a shift watched closely because the shelf's cold pool organises the whole ecosystem."
  ],
  "coastalCity": null,
  "faqs": [
    {
      "q": "How big is the Bering Sea?",
      "a": "About 2,300,000 km² (Wikidata); roughly half of it is shallow continental shelf less than 200 m deep — the part that makes it so productive."
    },
    {
      "q": "Which two countries border the Bering Sea?",
      "a": "The United States (Alaska) and Russia (Chukotka and Kamchatka); their maritime boundary runs through it and the Bering Strait."
    },
    {
      "q": "What is the Bering Sea famous for catching?",
      "a": "Alaska pollock (among the largest single-species fisheries in the world), salmon, Pacific cod and king and snow crab."
    },
    {
      "q": "Was there really a land bridge here?",
      "a": "Yes — during the last ice age, sea level was low enough that the strait and shelf were dry land (Beringia), connecting Asia and North America."
    }
  ],
  "media": [
    {
      "fileTitle": "Aerial view of Tutakoke Bird Camp, Coast of the Bering Sea just south of Hooper Bay, Alaska, near Chevak, Alaska.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/6/68/Aerial_view_of_Tutakoke_Bird_Camp%2C_Coast_of_the_Bering_Sea_just_south_of_Hooper_Bay%2C_Alaska%2C_near_Chevak%2C_Alaska.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Aerial_view_of_Tutakoke_Bird_Camp,_Coast_of_the_Bering_Sea_just_south_of_Hooper_Bay,_Alaska,_near_Chevak,_Alaska.jpg",
      "width": 3008,
      "height": 2000,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "Becker, Don, USGS EROS - U.S. Fish and Wildlife Service",
      "attribution": "\"Aerial view of Tutakoke Bird Camp, Coast of the Bering Sea just south of Hooper Bay, Alaska, near Chevak, Alaska.jpg\" by Becker, Don, USGS EROS - U.S. Fish and Wildlife Service — Public domain, via Wikimedia Commons",
      "role": "hero",
      "alt": "Bering Sea — representative view",
      "sortOrder": 1
    },
    {
      "fileTitle": "Bering Sea Storm, Looking Down East Beach (5188618614).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Bering_Sea_Storm%2C_Looking_Down_East_Beach_%285188618614%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Bering_Sea_Storm,_Looking_Down_East_Beach_(5188618614).jpg",
      "width": 4000,
      "height": 3000,
      "licence": "CC BY 2.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/2.0",
      "author": "Bering Land Bridge National Preserve",
      "attribution": "\"Bering Sea Storm, Looking Down East Beach (5188618614).jpg\" by Bering Land Bridge National Preserve — CC BY 2.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Bering Sea — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Bering Sea Sunrise (8287968367).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Bering_Sea_Sunrise_%288287968367%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Bering_Sea_Sunrise_(8287968367).jpg",
      "width": 3872,
      "height": 2224,
      "licence": "CC BY 2.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/2.0",
      "author": "Bering Land Bridge National Preserve",
      "attribution": "\"Bering Sea Sunrise (8287968367).jpg\" by Bering Land Bridge National Preserve — CC BY 2.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Bering Sea — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point (58, -178), area",
      "sourceName": "Wikidata — Q44725 (Bering Sea)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q44725",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Average/maximum depth and geography detail",
      "sourceName": "Wikipedia — \"Bering Sea\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/Bering_Sea",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Figure variants: Maximum depth is cited between about 4,151 m and 4,772 m in different compilations of the Aleutian Basin soundings; the page uses ≈4,772 m marked approximate, with the range recorded here.",
      "sourceName": "WorldCityHub R3B dataset note",
      "sourceUrl": "https://en.wikipedia.org/wiki/Bering_Sea",
      "checkedAt": "2026-10-22"
    }
  ]
};

const CORAL_SEA: Ocean = {
  "slug": "coral-sea",
  "name": "Coral Sea",
  "wikidataQid": "Q82931",
  "partOfName": "Pacific Ocean",
  "partOfLabel": "Pacific Ocean · the sea of reefs",
  "seasonTitle": "Cyclone season & the November coral spawn",
  "wikiTitle": "Coral_Sea",
  "lat": -18,
  "lng": 158,
  "marineTimezone": "Australia/Brisbane",
  "seoTitle": "Coral Sea: Live Waves, Weather & Facts",
  "seoDescription": "The Coral Sea live: wave height, size and depth facts with sources shown, and its seasons explained.",
  "intro": [
    "The Coral Sea is the great marginal sea off Australia's northeast coast, stretching from Papua New Guinea and the Solomon Islands to New Caledonia and the Queensland shore. It takes its name from its defining cargo: coral formations beyond counting, including the whole of the Great Barrier Reef along its western margin and the remote atolls of the Coral Sea Islands Territory.",
    "Its deep basin — over 9,000 m at its deepest in the south — is swept by the East Australian Current, which splits from the South Equatorial flow near its northern reefs and carries warm water down the Australian coast (the current made famous, in stylised form, by a generation of filmgoers).",
    "In May 1942 it hosted the Battle of the Coral Sea, the first naval battle fought entirely by carrier aircraft that never sighted each other. The live block on this page samples conditions at the sea's Wikidata representative point east of the Barrier Reef."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "Pacific Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "4,791,000 km²",
      "source": "Wikidata"
    },
    {
      "label": "Average depth",
      "value": "≈2,394 m",
      "source": "Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "≈9,140 m (see sources note)",
      "source": "Wikipedia"
    },
    {
      "label": "Signature current",
      "value": "East Australian Current",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "18° S, 158° E",
      "source": "Wikidata"
    }
  ],
  "geography": [
    "West: Queensland, Australia, and the Great Barrier Reef. North: Papua New Guinea and the Solomons. East: Vanuatu and New Caledonia. South: it merges with the Tasman Sea. Its named sub-areas include the Louisiade and Queensland plateaus and the deep Coral Sea Basin (Wikipedia)."
  ],
  "monsoon": [
    "The Coral Sea's storm season is the Australian tropical cyclone season (roughly November–April), when lows forming over its warm water track toward Queensland, the Solomons or New Caledonia. Between events, the southeast trades rule.",
    "Its biological calendar peaks in late spring, when mass coral spawning — the synchronised release timed to the November full moon on the Barrier Reef — turns the water into a snowstorm of eggs and larvae over a few nights."
  ],
  "coastalCity": null,
  "faqs": [
    {
      "q": "How big is the Coral Sea?",
      "a": "About 4,791,000 km² (Wikidata) — the largest of the Pacific's Australian-side marginal seas."
    },
    {
      "q": "Is the Great Barrier Reef in the Coral Sea?",
      "a": "Yes — the reef system runs along the Coral Sea's western margin off Queensland; the sea and the reef share this site's coverage."
    },
    {
      "q": "What happened in the Battle of the Coral Sea?",
      "a": "In May 1942 US and Japanese carrier fleets fought the first battle in which the ships never saw each other — all attacks were by aircraft. It halted Japan's seaborne move on Port Moresby."
    },
    {
      "q": "How deep is the Coral Sea?",
      "a": "Average ≈2,394 m; the commonly cited maximum is about 9,140 m in its southern trenches — see the note on figure variants."
    }
  ],
  "media": [
    {
      "fileTitle": "AST-16-1154 - Apollo Soyuz Test Project - Apollo Soyuz Test Project, Australia, Great Barrier Reef, Coral Sea, Maley Reef - NARA - 16630394.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e6/AST-16-1154_-_Apollo_Soyuz_Test_Project_-_Apollo_Soyuz_Test_Project%2C_Australia%2C_Great_Barrier_Reef%2C_Coral_Sea%2C_Maley_Reef_-_NARA_-_16630394.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:AST-16-1154_-_Apollo_Soyuz_Test_Project_-_Apollo_Soyuz_Test_Project,_Australia,_Great_Barrier_Reef,_Coral_Sea,_Maley_Reef_-_NARA_-_16630394.jpg",
      "width": 4400,
      "height": 4600,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "Unknown authorUnknown author or not provided",
      "attribution": "\"AST-16-1154 - Apollo Soyuz Test Project - Apollo Soyuz Test Project, Australia, Great Barrier Reef, Coral Sea, Maley Reef - NARA - 16630394.jpg\" by Unknown authorUnknown author or not provided — Public domain, via Wikimedia Commons",
      "role": "hero",
      "alt": "Coral Sea — representative view",
      "sortOrder": 1
    },
    {
      "fileTitle": "AST-16-1155 - Apollo Soyuz Test Project - Apollo Soyuz Test Project, Coral Sea, Maley Reef, Abington Reef - NARA - 16630397.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4e/AST-16-1155_-_Apollo_Soyuz_Test_Project_-_Apollo_Soyuz_Test_Project%2C_Coral_Sea%2C_Maley_Reef%2C_Abington_Reef_-_NARA_-_16630397.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:AST-16-1155_-_Apollo_Soyuz_Test_Project_-_Apollo_Soyuz_Test_Project,_Coral_Sea,_Maley_Reef,_Abington_Reef_-_NARA_-_16630397.jpg",
      "width": 4400,
      "height": 4600,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "Unknown authorUnknown author or not provided",
      "attribution": "\"AST-16-1155 - Apollo Soyuz Test Project - Apollo Soyuz Test Project, Coral Sea, Maley Reef, Abington Reef - NARA - 16630397.jpg\" by Unknown authorUnknown author or not provided — Public domain, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Coral Sea — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "AST-16-1156 - Apollo Soyuz Test Project - Apollo Soyuz Test Project, Coral Sea, Coringa Islands, Maley Reef - NARA - 16630400.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/0/01/AST-16-1156_-_Apollo_Soyuz_Test_Project_-_Apollo_Soyuz_Test_Project%2C_Coral_Sea%2C_Coringa_Islands%2C_Maley_Reef_-_NARA_-_16630400.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:AST-16-1156_-_Apollo_Soyuz_Test_Project_-_Apollo_Soyuz_Test_Project,_Coral_Sea,_Coringa_Islands,_Maley_Reef_-_NARA_-_16630400.jpg",
      "width": 4400,
      "height": 4600,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "Unknown authorUnknown author or not provided",
      "attribution": "\"AST-16-1156 - Apollo Soyuz Test Project - Apollo Soyuz Test Project, Coral Sea, Coringa Islands, Maley Reef - NARA - 16630400.jpg\" by Unknown authorUnknown author or not provided — Public domain, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Coral Sea — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point (-18, 158), area",
      "sourceName": "Wikidata — Q82931 (Coral Sea)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q82931",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Average/maximum depth and geography detail",
      "sourceName": "Wikipedia — \"Coral Sea\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/Coral_Sea",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Figure variants: Maximum depth is the sea's softest figure: 9,140 m appears in standard references for the trench system at its southern edge, while basin-floor charts elsewhere support nearer 7,000–9,000 m. The page shows ≈9,140 m with this note rather than a false precision.",
      "sourceName": "WorldCityHub R3B dataset note",
      "sourceUrl": "https://en.wikipedia.org/wiki/Coral_Sea",
      "checkedAt": "2026-10-22"
    }
  ]
};

const PERSIAN_GULF: Ocean = {
  "slug": "persian-gulf",
  "name": "Persian Gulf",
  "wikidataQid": "Q34675",
  "partOfName": "Indian Ocean",
  "partOfLabel": "Indian Ocean · the shallow energy sea",
  "seasonTitle": "Shamal winds & the hottest sea summers",
  "wikiTitle": "Persian_Gulf",
  "lat": 26,
  "lng": 52,
  "marineTimezone": "Asia/Dubai",
  "seoTitle": "Persian Gulf: Live Waves, Weather & Facts",
  "seoDescription": "The Persian Gulf live: wave height, size and depth facts with sources shown, and its seasons explained.",
  "intro": [
    "The Persian Gulf — also called the Arabian Gulf in the Arab states on its western shore — is a shallow extension of the Indian Ocean between Iran and the Arabian Peninsula, joined to the Gulf of Oman and the Arabian Sea by the Strait of Hormuz. It is remarkably shallow: about 50 metres on average and nowhere much over 90, a flooded river valley drowned as sea level rose after the last ice age.",
    "No sea carries more economic weight per square kilometre: roughly a fifth of the world's petroleum liquids and a large share of its liquefied natural gas leave through Hormuz. Its coasts hold the port and finance cities whose country and city pages this site is building toward.",
    "Summer here is superlative — its shallow water becomes the warmest large-sea water on Earth, exceeding 36 °C in places, with air temperatures and humidity that push heat stress records. The live block samples conditions at its Wikidata representative point in the central Gulf. (The name is genuinely dual: Persian Gulf in UN and most international usage, Arabian Gulf regionally; the page uses the UN form and records both.)"
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "Indian Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "251,000 km²",
      "source": "Wikidata"
    },
    {
      "label": "Average depth",
      "value": "≈50 m",
      "source": "Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "≈90 m",
      "source": "Wikipedia"
    },
    {
      "label": "Outlet",
      "value": "Strait of Hormuz, ≈39 km at its narrowest",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "26° N, 52° E",
      "source": "Wikidata"
    }
  ],
  "geography": [
    "Northeast: Iran. Southwest and west: Iraq, Kuwait, Saudi Arabia, Bahrain, Qatar and the United Arab Emirates. Southeast: Oman's Musandam tip guards Hormuz. The Shatt al-Arab (Tigris–Euphrates outflow) enters at the head (Wikipedia)."
  ],
  "monsoon": [
    "The Gulf's signature wind is the shamal — northwesterlies that blow dust and build short, steep seas, strongest in winter and again in early summer. The sea itself escapes the Indian Ocean monsoon's violence but not its humidity.",
    "Summer water temperatures above 36 °C in the southern shallows make this the world's warmest sea at scale; winter brings the only comfortable boating season and occasional sharp cold shamals."
  ],
  "coastalCity": null,
  "faqs": [
    {
      "q": "How deep is the Persian Gulf?",
      "a": "Barely: about 50 m on average and roughly 90 m at its deepest — you could stand the world's tallest building in it many times over sideways, but a mid-rise tower would breach the surface at the average spot."
    },
    {
      "q": "Persian Gulf or Arabian Gulf — which name is right?",
      "a": "Both are in official use: \"Persian Gulf\" is the UN and historical international standard; \"Arabian Gulf\" is standard in the Arab littoral states. WorldCityHub uses the UN form and records the dual usage openly."
    },
    {
      "q": "How much oil passes through the Strait of Hormuz?",
      "a": "Commonly estimated at about a fifth of global petroleum liquids consumption, plus roughly a fifth of global LNG trade — making Hormuz the world's most important energy chokepoint (EIA estimates)."
    },
    {
      "q": "Why is the Gulf so warm?",
      "a": "It is shallow, nearly enclosed, and sits under some of the hottest summer air on Earth — there is simply little water to heat, and a lot of sun and hot wind to heat it."
    }
  ],
  "media": [
    {
      "fileTitle": "Artificial Archipelagos, Dubai, United Arab Emirates ISS022-E-024940 lrg.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/1/15/Artificial_Archipelagos%2C_Dubai%2C_United_Arab_Emirates_ISS022-E-024940_lrg.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Artificial_Archipelagos,_Dubai,_United_Arab_Emirates_ISS022-E-024940_lrg.jpg",
      "width": 4288,
      "height": 2848,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "Member of the Expedition 22 crew.",
      "attribution": "\"Artificial Archipelagos, Dubai, United Arab Emirates ISS022-E-024940 lrg.jpg\" by Member of the Expedition 22 crew. — Public domain, via Wikimedia Commons",
      "role": "hero",
      "alt": "Persian Gulf — representative view",
      "sortOrder": 1
    },
    {
      "fileTitle": "Artificial Archipelagos, Dubai, United Arab Emirates ISS022-E-024940 lrg (cropped to The World).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/5/53/Artificial_Archipelagos%2C_Dubai%2C_United_Arab_Emirates_ISS022-E-024940_lrg_%28cropped_to_The_World%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Artificial_Archipelagos,_Dubai,_United_Arab_Emirates_ISS022-E-024940_lrg_(cropped_to_The_World).jpg",
      "width": 1814,
      "height": 2383,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "Member of the Expedition 22 crew.",
      "attribution": "\"Artificial Archipelagos, Dubai, United Arab Emirates ISS022-E-024940 lrg (cropped to The World).jpg\" by Member of the Expedition 22 crew. — Public domain, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Persian Gulf — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Artificial islands built on the Persian Gulf coast of Dubai, United Arab Emirates (iss073e0247372).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Artificial_islands_built_on_the_Persian_Gulf_coast_of_Dubai%2C_United_Arab_Emirates_%28iss073e0247372%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Artificial_islands_built_on_the_Persian_Gulf_coast_of_Dubai,_United_Arab_Emirates_(iss073e0247372).jpg",
      "width": 8256,
      "height": 5504,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "NASA Johnson Space Center",
      "attribution": "\"Artificial islands built on the Persian Gulf coast of Dubai, United Arab Emirates (iss073e0247372).jpg\" by NASA Johnson Space Center — Public domain, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Persian Gulf — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point (26, 52), area",
      "sourceName": "Wikidata — Q34675 (Persian Gulf)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q34675",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Average/maximum depth and geography detail",
      "sourceName": "Wikipedia — \"Persian Gulf\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/Persian_Gulf",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Figure variants: Area is given from 239,000 to 251,000 km² across sources depending on the Hormuz boundary used; the page uses the Wikidata figure. Maximum depth is charted between about 90 and 110 m near the strait; the page uses ≈90 m for the basin proper and says so.",
      "sourceName": "WorldCityHub R3B dataset note",
      "sourceUrl": "https://en.wikipedia.org/wiki/Persian_Gulf",
      "checkedAt": "2026-10-22"
    }
  ]
};

const TASMAN_SEA: Ocean = {
  "slug": "tasman-sea",
  "name": "Tasman Sea",
  "wikidataQid": "Q33254",
  "partOfName": "Pacific Ocean",
  "partOfLabel": "Pacific Ocean · the Ditch between two nations",
  "seasonTitle": "The westerlies & Tasman lows",
  "wikiTitle": "Tasman_Sea",
  "lat": -37,
  "lng": 161,
  "marineTimezone": "Australia/Sydney",
  "seoTitle": "Tasman Sea: Live Waves, Weather & Facts",
  "seoDescription": "The Tasman Sea live: wave height, size and depth facts with sources shown, and its seasons explained.",
  "intro": [
    "The Tasman Sea is the stretch of the South Pacific between Australia and New Zealand — known on both sides, with proprietorial affection, as 'the Ditch'. About 2,000 kilometres wide, it is named for Abel Tasman, the first European to reach New Zealand and Tasmania (1642), and it was first flown and sailed solo in feats that still define trans-Tasman rivalry.",
    "It is a restless sea: the roaring-forties westerlies cross it unimpeded, East Coast Lows spin up off New South Wales, and the East Australian Current's eddies push warm water far south along both coasts. Its floor holds the Tasman Basin abyss and the Lord Howe Rise, a drowned continental fragment of Zealandia.",
    "For two nations it is less a barrier than a shared backyard — the sea of the Sydney to Hobart yacht race start, of trans-Tasman flights, and of weather systems that serve both countries in turn. The live block samples its Wikidata representative point mid-Tasman."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "Pacific Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "2,300,000 km²",
      "source": "Wikidata"
    },
    {
      "label": "Maximum depth",
      "value": "≈5,943 m",
      "source": "Wikipedia"
    },
    {
      "label": "Named for",
      "value": "Abel Janszoon Tasman (voyages of 1642)",
      "source": "Wikipedia"
    },
    {
      "label": "Width",
      "value": "≈2,000 km between the two coasts",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "37° S, 161° E",
      "source": "Wikidata"
    }
  ],
  "geography": [
    "West: New South Wales, Victoria and Tasmania (Australia). East: New Zealand's North and South islands. North: it meets the Coral Sea off Brisbane; south: Bass Strait and the Southern Ocean approaches. Lord Howe and Norfolk islands sit in its northern half (Wikipedia)."
  ],
  "monsoon": [
    "No monsoon — the Tasman belongs to the westerlies. Winter brings processions of fronts and the intense East Coast Lows that flood and erode the New South Wales coast; summer weakens the flow, lets tropical moisture feed down, and occasionally admits a decaying tropical cyclone from the Coral Sea.",
    "The Sydney to Hobart race (from Boxing Day) is timed to this regime and has met its worst: the 1998 storm that sank five yachts remains the sea's defining modern tragedy and the reason race safety rules worldwide changed."
  ],
  "coastalCity": null,
  "faqs": [
    {
      "q": "Why is the Tasman Sea called \"the Ditch\"?",
      "a": "Australians and New Zealanders both call crossing it \"crossing the Ditch\" — a joking diminutive for a 2,000 km ocean crossing, used for everything from flights to sporting tours."
    },
    {
      "q": "How wide is the Tasman Sea?",
      "a": "About 2,000 km from Sydney to Wellington — roughly three hours by air, and five to nine days in a racing yacht."
    },
    {
      "q": "How deep is the Tasman Sea?",
      "a": "Its abyssal basin reaches about 5,943 m; the average is not a standard published figure, so this page does not invent one."
    },
    {
      "q": "Who was Tasman?",
      "a": "Abel Janszoon Tasman, the Dutch navigator whose 1642 voyage first reached Tasmania and New Zealand for Europe — both the sea and the island state carry his name."
    }
  ],
  "media": [
    {
      "fileTitle": "00 1294 Buller River - New Zealand.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6e/00_1294_Buller_River_-_New_Zealand.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:00_1294_Buller_River_-_New_Zealand.jpg",
      "width": 3168,
      "height": 2112,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "W. Bulach",
      "attribution": "\"00 1294 Buller River - New Zealand.jpg\" by W. Bulach — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "Tasman Sea — representative view",
      "sortOrder": 1
    },
    {
      "fileTitle": "00 2323 West Coast Region.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/5/56/00_2323_West_Coast_Region.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:00_2323_West_Coast_Region.jpg",
      "width": 3300,
      "height": 2200,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "W. Bulach",
      "attribution": "\"00 2323 West Coast Region.jpg\" by W. Bulach — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Tasman Sea — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Abel tasman sea kayaking.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/3/32/Abel_tasman_sea_kayaking.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Abel_tasman_sea_kayaking.jpg",
      "width": 1600,
      "height": 1200,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "Tobias Thierer",
      "attribution": "\"Abel tasman sea kayaking.jpg\" by Tobias Thierer — Public domain, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Tasman Sea — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point (-37, 161), area",
      "sourceName": "Wikidata — Q33254 (Tasman Sea)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q33254",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Average/maximum depth and geography detail",
      "sourceName": "Wikipedia — \"Tasman Sea\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/Tasman_Sea",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Figure variants: Area appears as 2,300,000 km² (Wikidata) and about 2,515,000 km² in some Australian references with different northern limits; the page uses the Wikidata figure and records the variant.",
      "sourceName": "WorldCityHub R3B dataset note",
      "sourceUrl": "https://en.wikipedia.org/wiki/Tasman_Sea",
      "checkedAt": "2026-10-22"
    }
  ]
};

const BALTIC_SEA: Ocean = {
  "slug": "baltic-sea",
  "name": "Baltic Sea",
  "wikidataQid": "Q545",
  "partOfName": "Atlantic Ocean",
  "partOfLabel": "Atlantic Ocean · the young brackish inland sea",
  "seasonTitle": "Ice winters & algal summers",
  "wikiTitle": "Baltic_Sea",
  "lat": 58,
  "lng": 20,
  "marineTimezone": "Europe/Stockholm",
  "seoTitle": "Baltic Sea: Live Waves, Weather & Facts",
  "seoDescription": "The Baltic Sea live: wave height, size and depth facts with sources shown, and its seasons explained.",
  "intro": [
    "The Baltic Sea is a shallow, brackish inland sea of northern Europe, enclosed by the Scandinavian Peninsula, Finland, the Baltic states and the North European Plain, and reaching the Atlantic only through the narrow Danish straits. It is one of the youngest seas on Earth — its basin has cycled between lake and sea since the ice sheets retreated, and land around the Gulf of Bothnia is still rising nearly a centimetre a year.",
    "River inflow from a huge catchment makes it one of the world's largest brackish bodies: surface salinity falls from about 20‰ near Denmark to almost fresh in the northern gulfs, so marine and freshwater species live at their limits side by side.",
    "Its shallowness and slow flushing (a water parcel stays for decades) make it fragile: summer cyanobacteria blooms, deep-basin oxygen dead zones and a heavy shipping load are its documented modern pressures, governed cooperatively by the HELCOM states. The live block samples its Wikidata representative point in the Baltic Proper."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "Atlantic Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "377,000 km²",
      "source": "Wikidata"
    },
    {
      "label": "Average depth",
      "value": "55 m",
      "source": "Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "459 m — Landsort Deep",
      "source": "Wikipedia"
    },
    {
      "label": "Salinity",
      "value": "≈2–20‰ surface — brackish throughout",
      "source": "Wikipedia / HELCOM"
    },
    {
      "label": "Representative point",
      "value": "58° N, 20° E",
      "source": "Wikidata"
    }
  ],
  "geography": [
    "Clockwise from Denmark: Sweden, Finland (Åland between), Russia's St Petersburg and Kaliningrad coasts, Estonia, Latvia, Lithuania, Poland and Germany. Sub-basins: the Gulfs of Bothnia, Finland and Riga, the Baltic Proper, and the Danish straits and Kattegat toward the North Sea (Wikipedia)."
  ],
  "monsoon": [
    "No monsoon — the Baltic's drama is ice and bloom. In cold winters the northern gulfs freeze completely and ice roads link archipelago islands; mild winters (increasingly common) leave the south ice-free. Summer stratification sets up the cyanobacteria blooms that paint the surface green-gold in satellite images.",
    "Autumn storms drive the sea level against low coasts and push the occasional major inflow of salty North Sea water through the Danish straits — the rare events that re-oxygenate the deep basins."
  ],
  "coastalCity": null,
  "faqs": [
    {
      "q": "Why is the Baltic Sea brackish?",
      "a": "Enormous river inflow and only narrow, shallow connections to the ocean keep it diluted: salinity ranges from about 20‰ in the southwest to nearly fresh in the far north."
    },
    {
      "q": "How deep is the Baltic Sea?",
      "a": "Only 55 m on average; its deepest point, the Landsort Deep off Sweden, is 459 m."
    },
    {
      "q": "Does the Baltic Sea freeze?",
      "a": "Its northern and eastern parts freeze every winter to some degree; in severe winters the ice can cover most of the sea, while recent mild winters have set record-low ice extents."
    },
    {
      "q": "Why does the Baltic have dead zones?",
      "a": "Slow water exchange plus nutrient loads let deep basins stagnate and lose oxygen — among the largest human-linked hypoxic areas in the world ocean, monitored by HELCOM."
    }
  ],
  "media": [
    {
      "fileTitle": "An old man carefully descending into the Baltic sea (4190349949).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a6/An_old_man_carefully_descending_into_the_Baltic_sea_%284190349949%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:An_old_man_carefully_descending_into_the_Baltic_sea_(4190349949).jpg",
      "width": 6201,
      "height": 3902,
      "licence": "CC BY-SA 2.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "author": "One Trick Pony from Stockholm",
      "attribution": "\"An old man carefully descending into the Baltic sea (4190349949).jpg\" by One Trick Pony from Stockholm — CC BY-SA 2.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "Baltic Sea — representative view",
      "sortOrder": 1
    },
    {
      "fileTitle": "Baltic Sea, Sweden.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Baltic_Sea%2C_Sweden.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Baltic_Sea,_Sweden.jpg",
      "width": 4608,
      "height": 3072,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Аліна Семенець",
      "attribution": "\"Baltic Sea, Sweden.jpg\" by Аліна Семенець — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Baltic Sea — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Baltic Sea (MODIS 2017-05-20).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/3/33/Baltic_Sea_%28MODIS_2017-05-20%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Baltic_Sea_(MODIS_2017-05-20).jpg",
      "width": 4881,
      "height": 4153,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "Jeff Schmaltz, MODIS Land Rapid Response Team, NASA GSFC",
      "attribution": "\"Baltic Sea (MODIS 2017-05-20).jpg\" by Jeff Schmaltz, MODIS Land Rapid Response Team, NASA GSFC — Public domain, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Baltic Sea — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point (58, 20), area",
      "sourceName": "Wikidata — Q545 (Baltic Sea)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q545",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Average/maximum depth and geography detail",
      "sourceName": "Wikipedia — \"Baltic Sea\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/Baltic_Sea",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Figure variants: Area is published between about 377,000 km² (Wikidata, excluding the Kattegat) and 415,000 km² including it; the page uses the Wikidata basis and states the exclusion here.",
      "sourceName": "WorldCityHub R3B dataset note",
      "sourceUrl": "https://en.wikipedia.org/wiki/Baltic_Sea",
      "checkedAt": "2026-10-22"
    }
  ]
};

const NORTH_SEA: Ocean = {
  "slug": "north-sea",
  "name": "North Sea",
  "wikidataQid": "Q1693",
  "partOfName": "Atlantic Ocean",
  "partOfLabel": "Atlantic Ocean · the shallow shelf sea of Europe",
  "seasonTitle": "Atlantic storms & the tidal engine",
  "wikiTitle": "North_Sea",
  "lat": 56.459,
  "lng": 3.683,
  "marineTimezone": "Europe/London",
  "seoTitle": "North Sea: Live Waves, Weather & Facts",
  "seoDescription": "The North Sea live: wave height, size and depth facts with sources shown, and its seasons explained.",
  "intro": [
    "The North Sea is the shallow marginal sea of the Atlantic between Great Britain, Scandinavia and the continent — one of the world's busiest seas, fished, drilled, shipped across and now wind-farmed at industrial scale. Its southern floor is so shallow (the Dogger Bank rises to within 15–40 m of the surface) that during the last ice age it was dry land: Doggerland, a inhabited plain now yielding mammoth bones and Mesolithic tools in trawl nets.",
    "It is a tidal sea above all: Atlantic tides amplified in its basin slosh its coasts twice daily, building the Wadden Sea's mudflat world heritage coast and driving the storm surges that are its chief natural hazard — the 1953 surge that killed over 2,500 people rebuilt Dutch and British coastal defence philosophy.",
    "Oil and gas from its central rigs powered late-20th-century Britain and Norway; the same slots now host some of the world's largest offshore wind farms. The live block samples conditions at its Wikidata representative point off Scotland."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "Atlantic Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "570,000 km²",
      "source": "Wikidata"
    },
    {
      "label": "Average depth",
      "value": "≈95 m",
      "source": "Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "≈700 m — Norwegian Trench (Skagerrak)",
      "source": "Wikipedia"
    },
    {
      "label": "Signature feature",
      "value": "Dogger Bank — drowned ice-age land",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "56.459° N, 3.683° E",
      "source": "Wikidata"
    }
  ],
  "geography": [
    "West: England and Scotland. East and south: Norway, Denmark, Germany, the Netherlands, Belgium and a corner of France. North: it opens to the Norwegian Sea past Shetland; south: the Dover Strait (33 km) into the English Channel (Wikipedia)."
  ],
  "monsoon": [
    "No monsoon — the North Sea takes the North Atlantic's weather head-on: autumn and winter depressions drive gales and the dangerous combination of surge plus spring tide on the low Dutch, German and English coasts. Summer is its working calm, the season of the offshore construction and the sailing calendar.",
    "Fog banks over the cold northern water in late spring, and 'haar' (sea fret) on the Scottish and Northumbrian coasts, are its quieter signatures."
  ],
  "coastalCity": null,
  "faqs": [
    {
      "q": "How deep is the North Sea?",
      "a": "Shallow: about 95 m on average, and only 15–40 m over the Dogger Bank — though the Norwegian Trench off Norway cuts to roughly 700 m."
    },
    {
      "q": "What was Doggerland?",
      "a": "The inhabited plain that joined Britain to Europe when sea level was lower; it drowned as the ice melted, finally separating Britain around 6500 BC. Its bones and tools still surface in fishing nets."
    },
    {
      "q": "Why is the North Sea so busy?",
      "a": "It fronts some of Europe's largest ports (Rotterdam, Antwerp, Hamburg), its oil, gas and wind resources, and the shipping lanes between the Atlantic and the Baltic."
    },
    {
      "q": "What was the 1953 flood?",
      "a": "A storm surge on 31 January–1 February 1953 that breached dykes and sea walls in the Netherlands, England and Belgium, killing more than 2,500 people and driving the Delta Works and Thames Barrier programmes."
    }
  ],
  "media": [
    {
      "fileTitle": "Cromer - sea wall, town and church from storm-damaged groyne - geograph.org.uk - 4043902.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Cromer_-_sea_wall%2C_town_and_church_from_storm-damaged_groyne_-_geograph.org.uk_-_4043902.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Cromer_-_sea_wall,_town_and_church_from_storm-damaged_groyne_-_geograph.org.uk_-_4043902.jpg",
      "width": 4896,
      "height": 3672,
      "licence": "CC BY-SA 2.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "author": "ruth e",
      "attribution": "\"Cromer - sea wall, town and church from storm-damaged groyne - geograph.org.uk - 4043902.jpg\" by ruth e — CC BY-SA 2.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "North Sea — representative view",
      "sortOrder": 1
    },
    {
      "fileTitle": "Dust Storm off Egypt (15976).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Dust_Storm_off_Egypt_%2815976%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Dust_Storm_off_Egypt_(15976).jpg",
      "width": 3000,
      "height": 3000,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "NASA image created by Jesse Allen, Earth Observatory, using data obtained from the Goddard Earth Sciences DAAC.",
      "attribution": "\"Dust Storm off Egypt (15976).jpg\" by NASA image created by Jesse Allen, Earth Observatory, using data obtained from t — Public domain, via Wikimedia Commons",
      "role": "gallery",
      "alt": "North Sea — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Dust storm over the eastern Mediterranean Sea (MODIS 2018-02-15).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Dust_storm_over_the_eastern_Mediterranean_Sea_%28MODIS_2018-02-15%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Dust_storm_over_the_eastern_Mediterranean_Sea_(MODIS_2018-02-15).jpg",
      "width": 3400,
      "height": 4400,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "Jeff Schmaltz, MODIS Land Rapid Response Team, NASA GSFC",
      "attribution": "\"Dust storm over the eastern Mediterranean Sea (MODIS 2018-02-15).jpg\" by Jeff Schmaltz, MODIS Land Rapid Response Team, NASA GSFC — Public domain, via Wikimedia Commons",
      "role": "gallery",
      "alt": "North Sea — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity, representative point (56.459, 3.683), area",
      "sourceName": "Wikidata — Q1693 (North Sea)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q1693",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Average/maximum depth and geography detail",
      "sourceName": "Wikipedia — \"North Sea\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/North_Sea",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Figure variants: Area is cited from 570,000 km² (Wikidata) to about 750,000 km² when the Skagerrak and Channel approaches are counted in; maximum depth similarly hinges on whether the Skagerrak trench is included. The page uses the Wikidata area and the trench-inclusive depth, both flagged.",
      "sourceName": "WorldCityHub R3B dataset note",
      "sourceUrl": "https://en.wikipedia.org/wiki/North_Sea",
      "checkedAt": "2026-10-22"
    }
  ]
};

export const BUILT_OCEANS: Ocean[] = [PACIFIC_OCEAN, ATLANTIC_OCEAN, INDIAN_OCEAN, ARCTIC_OCEAN, SOUTHERN_OCEAN, MEDITERRANEAN_SEA, CARIBBEAN_SEA, SOUTH_CHINA_SEA, RED_SEA, BERING_SEA, CORAL_SEA, PERSIAN_GULF, TASMAN_SEA, BALTIC_SEA, NORTH_SEA];

export const PUBLISHED_OCEANS: Ocean[] = [ARABIAN_SEA];

// The other oceans — content only on the index (no links) until each
// one's own golden build is verified and published.
// All five remaining oceans were built in Round 2 batch 1 (BUILT_OCEANS
// below) — nothing is "upcoming" until a new ocean card is issued.
export const UPCOMING_OCEANS: { name: string; note: string }[] = [];

export function oceanHero(ocean: Ocean): OceanMedia {
  return ocean.media.find((m) => m.role === 'hero') ?? ocean.media[0];
}

async function getOceanFromDb(slug: string): Promise<Ocean | null> {
  try {
    const supabase = getSupabase();
    const query = supabase.from('oceans').select('*').eq('slug', slug).eq('status', 'published').single();
    const { data: row, error } = await Promise.race([
      query,
      new Promise<{ data: null; error: Error }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error('timeout') }), 2500),
      ),
    ]);
    if (error || !row || !row.curated) return null;
    const [{ data: media }, { data: sources }] = await Promise.all([
      supabase.from('ocean_media').select('*').eq('ocean_id', row.id).order('sort_order'),
      supabase.from('ocean_sources').select('*').eq('ocean_id', row.id),
    ]);
    if (!media || media.length === 0) return null;
    const c = row.curated as Record<string, unknown>;
    return {
      slug: row.slug,
      name: row.name,
      wikidataQid: row.wikidata_qid,
      partOfName: row.part_of_name,
      lat: Number(row.lat),
      lng: Number(row.lng),
      marineTimezone: row.marine_timezone,
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      intro: (c.intro as string[]) ?? [],
      facts: (c.facts as Ocean['facts']) ?? [],
      geography: (c.geography as string[]) ?? [],
      monsoon: (c.monsoon as string[]) ?? [],
      partOfLabel: (c.part_of_label as string) ?? row.part_of_name,
      seasonTitle: (c.season_title as string) ?? 'Seasons & patterns',
      wikiTitle: (c.wiki_title as string) ?? row.name.replace(/ /g, '_'),
      coastalCity: (c.coastal_city as Ocean['coastalCity']) ?? null,
      faqs: (c.faqs as Ocean['faqs']) ?? [],
      media: media.map((m) => ({
        fileTitle: m.file_title,
        fileUrl: m.file_url,
        pageUrl: m.page_url,
        width: m.width,
        height: m.height,
        licence: m.licence,
        licenceUrl: m.licence_url,
        author: m.author,
        attribution: m.attribution_text,
        role: m.role,
        alt: m.alt_text,
        sortOrder: m.sort_order,
      })),
      sources: (sources ?? []).map((s) => ({
        claim: s.claim,
        sourceName: s.source_name,
        sourceUrl: s.source_url,
        checkedAt: String(s.checked_at).slice(0, 10),
      })),
    };
  } catch {
    return null;
  }
}

export async function getOcean(slug: string): Promise<Ocean | null> {
  const fromDb = await getOceanFromDb(slug);
  if (fromDb) return fromDb;
  // Baked fallback: published first, then the BUILT (not switched-on)
  // batch-1 oceans — pages render for QA; the hub never lists them.
  return (
    PUBLISHED_OCEANS.find((o) => o.slug === slug) ??
    BUILT_OCEANS.find((o) => o.slug === slug) ??
    null
  );
}

export async function getPublishedOceans(): Promise<Ocean[]> {
  const out: Ocean[] = [];
  for (const o of PUBLISHED_OCEANS) {
    const full = await getOcean(o.slug);
    if (full) out.push(full);
  }
  return out;
}

// ── P10 (28 Oct final sitting): sibling detail links ─────────────────────
// Mirror of getSiblingWonders: the "More oceans" section on an ocean detail
// page is server-rendered from this list — every COMPLETE golden build in
// the dataset (published + built), minus the page itself. No content-only
// or unfinished ocean is ever listed, so a sibling link never points at an
// unfinished page; the hub and the sitemap stay published-only and are
// untouched by this helper. Every slug here renders a full detail page at
// /oceans/<slug> (verified live 200 before use).
export function getSiblingOceans(slug: string): Ocean[] {
  const seen = new Set<string>();
  const out: Ocean[] = [];
  for (const o of [...PUBLISHED_OCEANS, ...BUILT_OCEANS]) {
    if (o.slug === slug || seen.has(o.slug)) continue;
    seen.add(o.slug);
    out.push(o);
  }
  return out;
}

// Hub list (final28-P1): the published ocean plus every BUILT ocean
// whose detail page is live and complete. getOcean resolves each slug
// (database first, baked data as fallback) and only resolved oceans
// are returned — a slug that does not resolve is never linked from
// the hub. This deliberately does NOT widen PUBLISHED_OCEANS, so the
// detail pages' static params and publish semantics are untouched.
export async function getHubOceans(): Promise<Ocean[]> {
  const out: Ocean[] = [];
  for (const o of [...PUBLISHED_OCEANS, ...BUILT_OCEANS]) {
    const full = await getOcean(o.slug);
    if (full) out.push(full);
  }
  return out;
}

// ── Live layer ──────────────────────────────────────────────────────────────
export interface OceanLive {
  sampledAt: string;
  waveHeight: number | null;
  waveDirection: number | null; // degrees, direction waves come FROM
  wavePeriod: number | null; // seconds
  hourlyWaves: { time: string; height: number }[];
  coast: {
    tempNow: number;
    feelsLike: number;
    humidity: number;
    windKmh: number;
    weatherCode: number;
    sunrise: string;
    sunset: string;
    tempMax: number;
    tempMin: number;
  } | null;
}

export function compass(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
}

// Plain-language sea state from the live wave height (WMO sea state
// scale bands — a description of the number, not a new figure).
export function seaStateLabel(waveHeight: number): string {
  if (waveHeight < 0.5) return 'Calm to slight';
  if (waveHeight < 1.25) return 'Slight';
  if (waveHeight < 2.5) return 'Moderate';
  if (waveHeight < 4) return 'Rough';
  if (waveHeight < 6) return 'Very rough';
  return 'High';
}

// Seasonal frame from the calendar month (pattern sourced from the
// Wikipedia article — climatology, clearly distinct from live data).
export function monsoonSeason(timezone: string, slug = 'arabian-sea'): { name: string; text: string } {
  let month = 1;
  try {
    month = parseInt(
      new Intl.DateTimeFormat('en-GB', { timeZone: timezone, month: 'numeric' }).format(new Date()),
      10,
    );
  } catch { /* default below still returns a valid frame */ }
  // Per-ocean season frames (Round 2 R3). Only the Arabian Sea and the
  // Indian Ocean run on the monsoon frame below; each other ocean gets
  // its own documented seasonal pattern. Frames are climatology; the
  // live panel beside them is today's measurement — never mixed.
  if (slug === 'pacific-ocean') {
    if (month >= 6 && month <= 11)
      return {
        name: 'Pacific tropical-cyclone season',
        text: 'The northern-hemisphere season frame: typhoons spin up in the warm northwest Pacific and hurricanes in the east, peaking in late summer (pattern per Wikipedia). Compare the live waves above — today\u2019s actual sea, inside the seasonal frame.',
      };
    return {
      name: 'Southern-season / northern-quiet frame',
      text: 'The South Pacific cyclone season (roughly November–April) is the active frame now, while the northern Pacific sits in its quieter half of the year (pattern per Wikipedia). Compare the live waves above — today\u2019s actual sea, inside the seasonal frame.',
    };
  }
  if (slug === 'atlantic-ocean') {
    if (month >= 6 && month <= 11)
      return {
        name: 'Atlantic hurricane season',
        text: 'The official season frame (1 June – 30 November): Cape Verde storms cross the warm Atlantic toward the Caribbean and North America, peaking around September (pattern per Wikipedia). Compare the live waves above — today\u2019s actual sea, inside the seasonal frame.',
      };
    return {
      name: 'Outside hurricane season',
      text: 'The quiet-season frame: the tropical Atlantic is generally calm for storm formation, though winter extratropical storms still work the North Atlantic (pattern per Wikipedia). Compare the live waves above — today\u2019s actual sea, inside the seasonal frame.',
    };
  }
  if (slug === 'arctic-ocean') {
    if (month >= 6 && month <= 9)
      return {
        name: 'Melt season',
        text: 'The melt frame: 24-hour daylight thins the sea ice toward its September minimum — the Arctic\u2019s most navigable and most watched weeks (pattern per Wikipedia). Compare the live waves above — today\u2019s actual sea, inside the seasonal frame.',
      };
    return {
      name: 'Freeze-up / ice season',
      text: 'The ice frame: polar night returns, new ice spreads from the coasts and the pack thickens toward its March maximum (pattern per Wikipedia). Compare the live waves above — today\u2019s actual sea, inside the seasonal frame.',
    };
  }
  if (slug === 'southern-ocean') {
    if (month >= 10 || month <= 3)
      return {
        name: 'Austral summer — ice retreats',
        text: 'The summer frame: Antarctic sea ice shrinks toward its February minimum and the research and tourism season opens, while the westerlies keep the open ocean rough (pattern per Wikipedia). Compare the live waves above — today\u2019s actual sea, inside the seasonal frame.',
      };
    return {
      name: 'Austral winter — the great freeze',
      text: 'The winter frame: sea ice grows outward until it roughly doubles Antarctica\u2019s footprint, in near-total darkness at the pole (pattern per Wikipedia). Compare the live waves above — today\u2019s actual sea, inside the seasonal frame.',
    };
  }
  if (month >= 6 && month <= 9)
    return {
      name: 'Southwest monsoon season',
      text: 'The summer monsoon frame: strong southwesterly winds and the roughest open-sea conditions of the year are the pattern now (Wikipedia). Compare the live waves above — today\u2019s actual sea, inside the seasonal frame.',
    };
  if (month >= 11 || month <= 3)
    return {
      name: 'Northeast monsoon season',
      text: 'The winter monsoon frame: the generally calmest seas of the year are the pattern now (Wikipedia). Compare the live waves above — today\u2019s actual sea, inside the seasonal frame.',
    };
  if (month === 10)
    return {
      name: 'Post-monsoon transition',
      text: 'The winds are reversing after the southwest monsoon; seas typically settle through this transition month (pattern per Wikipedia).',
    };
  return {
    name: 'Pre-monsoon transition',
    text: 'The hot-season build-up before the southwest monsoon arrives; winds and seas strengthen toward June (pattern per Wikipedia).',
  };
}

export async function getOceanLive(ocean: Ocean): Promise<OceanLive | null> {
  try {
    const marineUrl =
      `https://marine-api.open-meteo.com/v1/marine?latitude=${ocean.lat}&longitude=${ocean.lng}` +
      `&current=wave_height,wave_direction,wave_period&hourly=wave_height&forecast_days=2&timezone=${encodeURIComponent(ocean.marineTimezone)}`;
    const coastCity = ocean.coastalCity;
    const coastUrl = coastCity
      ? `https://api.open-meteo.com/v1/forecast?latitude=${coastCity.lat}&longitude=${coastCity.lng}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min&timezone=${encodeURIComponent(coastCity.timezone)}&forecast_days=1`
      : null;
    const [mRes, cRes] = await Promise.all([
      fetch(marineUrl, { next: { revalidate: 1800 } }),
      coastUrl ? fetch(coastUrl, { next: { revalidate: 1800 } }) : Promise.resolve(null),
    ]);
    if (!mRes.ok) return null;
    const m = await mRes.json();
    const cur = m.current;
    if (!cur) return null;
    const todayStr = (cur.time as string).slice(0, 10);
    // The Marine API returns null heights at ice-covered / out-of-grid points
    // (Arctic, Southern Ocean): drop null samples instead of casting them to
    // numbers — a null height crashed the wave strip renderer.
    const hourlyWaves: { time: string; height: number }[] = (m.hourly?.time ?? [])
      .map((t: string, i: number) => ({ time: t, height: m.hourly.wave_height[i] as number | null }))
      .filter((h): h is { time: string; height: number } => typeof h.height === 'number')
      .filter((h) => h.time.slice(0, 10) === todayStr && h.time >= (cur.time as string).slice(0, 13));
    let coast: OceanLive['coast'] = null;
    if (cRes && cRes.ok) {
      const c = await cRes.json();
      if (c.current && c.daily?.sunrise?.length) {
        coast = {
          tempNow: c.current.temperature_2m,
          feelsLike: c.current.apparent_temperature,
          humidity: c.current.relative_humidity_2m,
          windKmh: c.current.wind_speed_10m,
          weatherCode: c.current.weather_code,
          sunrise: (c.daily.sunrise[0] as string).slice(11, 16),
          sunset: (c.daily.sunset[0] as string).slice(11, 16),
          tempMax: c.daily.temperature_2m_max[0],
          tempMin: c.daily.temperature_2m_min[0],
        };
      }
    }
    return {
      sampledAt: cur.time,
      waveHeight: typeof cur.wave_height === 'number' ? cur.wave_height : null,
      waveDirection: typeof cur.wave_direction === 'number' ? cur.wave_direction : null,
      wavePeriod: typeof cur.wave_period === 'number' ? cur.wave_period : null,
      hourlyWaves,
      coast,
    };
  } catch {
    return null;
  }
}
