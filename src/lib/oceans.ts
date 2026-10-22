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

export const BUILT_OCEANS: Ocean[] = [PACIFIC_OCEAN, ATLANTIC_OCEAN, INDIAN_OCEAN, ARCTIC_OCEAN, SOUTHERN_OCEAN];

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
