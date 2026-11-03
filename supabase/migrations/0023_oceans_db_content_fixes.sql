-- ─────────────────────────────────────────────────────────────────────────────
-- 0023_oceans_db_content_fixes.sql — oceans family DB twin
-- (owner rulebook pass, 3 Nov 2026)
--
-- WHAT THIS FILE DOES — the database-side twin of the oceans family
-- fix that shipped in code as deploy 9 (main c967247, branch
-- fix/oceans-family f27afd9): the em-dash sweep, the label fixes and
-- the polar sampling-honesty wording in src/lib/oceans.ts and the
-- oceans templates. Production serves the SIX original oceans from
-- these tables (src/lib/oceans.ts getOceanFromDb wins over the baked
-- records whenever a published row exists), so the code sweep never
-- reached them: verified live on 2026-11-03, the six pages still
-- rendered 44–63 em dashes each and the Southern Ocean panel read
-- "Feed unavailable". The other twelve oceans are code-served and
-- already clean. This migration brings the six DB rows to exactly
-- the swept code standard. No facts change: every replacement string
-- is the current src/lib/oceans.ts value for the same field (a
-- leaf-by-leaf diff of seed vs code was run before writing this
-- file; outside punctuation, the only wording deltas are the polar
-- sampling sentences and the Arabian label keys noted below).
--
-- TABLES / COLUMNS TOUCHED
--   public.oceans        seo_description (4 of 6 rows; the other two
--                        already match code, as do all six seo_title
--                        values), curated (all 6 rows)
--   public.ocean_media   alt_text, attribution_text (14 rows)
--   public.ocean_sources claim, source_name (21 rows)
--
-- GUARDS / IDEMPOTENCY — same discipline as 0022: every UPDATE is
-- guarded on the row still holding its seeded (pre-fix) value, so
-- re-running is a no-op and a human correction applied in the
-- meantime is never clobbered. The curated replacement is guarded
-- on the stored jsonb still containing an em dash.
--
-- PARITY NOTES
--   * Arctic / Southern: the seo_description, one intro paragraph
--     and one ocean_sources claim per ocean stop claiming waves are
--     measured at the ice-covered representative point and say what
--     the code path (and, after the companion code fix in
--     getOcean, the DB path too) actually does: sampling at the
--     nearest open water, 72.5° N 20° E / 55° S 90° E, labelled on
--     the page. The sampling point itself is supplied by code
--     (src/lib/oceans.ts getOcean overlays the baked record's
--     sampleLat/sampleLng); the oceans table has no columns for it.
--   * Arabian Sea: the 0002 seed omitted the part_of_label,
--     season_title and wiki_title keys from curated, so the DB path
--     rendered the mapper defaults ("Indian Ocean", "Seasons &
--     patterns") where the code path renders "Indian Ocean ·
--     northwestern arm" and "The monsoon sea". The replacement
--     curated below includes the three keys with their code values.
--
-- SEED == PRODUCTION EVIDENCE: the strings replaced here are the
-- 0002/0009 seed strings, and they are what production renders. The
-- Southern Ocean intro sentence "The live block on this page samples
-- waves at its representative point (65° S, 90° E) — in the wind belt
-- that made these latitudes a byword for the roughest seas on Earth"
-- exists ONLY in the 0009 seed (the code twin reads "...samples
-- waves at the nearest open water to its representative point, at
-- 55° S, 90° E, because the point itself (65° S, 90° E) sits in the
-- seasonal ice zone..."), and it was rendered verbatim on the live
-- /oceans/southern-ocean page when checked on 2026-11-03, alongside
-- the seed's em-dash media attribution and "Feed unavailable".
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. oceans.seo_description: em dash / sampling wording ──────────────────
UPDATE public.oceans
SET seo_description = 'The Arabian Sea live: wave height & swell today, Karachi coastal weather, monsoon pattern, size and depth facts, every figure sourced.'
WHERE slug = 'arabian-sea'
  AND seo_description = 'The Arabian Sea live: wave height & swell today, Karachi coastal weather, monsoon pattern, size and depth facts — every figure sourced.';

UPDATE public.oceans
SET seo_description = 'The Indian Ocean live: wave height today, the monsoon system explained, Karachi coastal weather, size and depth facts: every figure sourced.'
WHERE slug = 'indian-ocean'
  AND seo_description = 'The Indian Ocean live: wave height today, the monsoon system explained, Karachi coastal weather, size and depth facts — every figure sourced.';

UPDATE public.oceans
SET seo_description = 'The Arctic Ocean: live waves sampled at the nearest open water to its ice-covered point, the sea-ice year, size and depth facts with sources.'
WHERE slug = 'arctic-ocean'
  AND seo_description = 'The Arctic Ocean: live data at its polar point, the sea-ice year explained, size and depth facts with sources — the smallest, shallowest, coldest ocean.';

UPDATE public.oceans
SET seo_description = 'The Southern Ocean live: waves sampled at the nearest open water, the Antarctic Circumpolar Current, the sea-ice pulse and its disputed boundary.'
WHERE slug = 'southern-ocean'
  AND seo_description = 'The Southern Ocean live: wave height at 65° S, the Antarctic Circumpolar Current, the sea-ice pulse and the honest story of its disputed boundary.';

-- ── 2. oceans.curated: full replacement with the swept code record ─────────
-- Guarded on the stored jsonb still containing an em dash (every
-- seeded curated does; the swept replacement contains none).
UPDATE public.oceans
SET curated = $json$
{
  "intro": [
    "The Arabian Sea is the northwestern arm of the Indian Ocean, bounded on the west by the Arabian Peninsula, the Gulf of Aden and the Guardafui Channel, on the northwest by the Gulf of Oman and Iran, on the north by Pakistan, on the east by India, and on the southeast by the Laccadive Sea and the Maldives, with Somalia to the southwest. Its total area is 3,862,000 km².",
    "Few seas have shaped history like this one. For millennia its reversing monsoon winds carried trade, and with it concepts, peoples, philosophies, technologies and religions, across the Old World: sailors rode one monsoon out and waited for the winds and currents to reverse before sailing home. The same monsoon still sets the sea’s moods today, which is why this page pairs the facts with the live wave and weather picture.",
    "At its centre and south the seabed falls away into the Arabian Basin, an expansive, relatively flat stretch of ocean floor reaching depths beyond 4,500 metres. In the west the Gulf of Aden connects the sea to the Red Sea through the strait of Bab-el-Mandeb; in the northwest the Gulf of Oman connects it to the Persian Gulf."
  ],
  "facts": [
    {
      "label": "Part of",
      "value": "Indian Ocean",
      "source": "Wikidata"
    },
    {
      "label": "Total area",
      "value": "3,862,000 km² (1,491,000 sq mi)",
      "source": "Wikidata / Wikipedia"
    },
    {
      "label": "Maximum depth",
      "value": "5,395 m",
      "source": "Wikipedia (see sources note)"
    },
    {
      "label": "Representative point",
      "value": "16° N, 64° E",
      "source": "Wikidata"
    },
    {
      "label": "Seabed",
      "value": "Arabian Basin: beyond 4,500 m in places",
      "source": "Wikipedia"
    },
    {
      "label": "Connects west",
      "value": "Gulf of Aden → Bab-el-Mandeb → Red Sea",
      "source": "Wikipedia"
    },
    {
      "label": "Connects northwest",
      "value": "Gulf of Oman → Persian Gulf",
      "source": "Wikipedia"
    },
    {
      "label": "Northern shore",
      "value": "Pakistan: Karachi is its great port city",
      "source": "Wikipedia"
    }
  ],
  "geography": [
    "West: the Arabian Peninsula, the Gulf of Aden and the Guardafui Channel. Northwest: the Gulf of Oman and Iran. North: Pakistan. East: India. Southeast: the Laccadive Sea and the Maldives. Southwest: Somalia. Most islands and seamounts in the sea lie along its coastal fringes, close to the major landmasses (Wikipedia)."
  ],
  "monsoon": [
    "The Arabian Sea is the world’s great monsoon sea. In mid-summer, strong winds carry warm air and moisture northeastwards from the African interior and the Indian Ocean, bringing heavy rains to the northeastern shoreline of the Arabian basin while the Horn of Africa and the Arabian Peninsula stay dry (Wikipedia). In the era of square-rigged vessels this pattern governed all trade here: ships sailed out on one monsoon and were effectively marooned at their destination until the reversal of winds and currents let them sail home on calmer waters.",
    "The practical rhythm that follows from that pattern: the southwest monsoon months (roughly June to September) bring the strongest winds and the roughest open-sea conditions of the year; the northeast monsoon months (roughly November to March) are generally the calmest. The live wave panel on this page shows what the sea is actually doing today, inside that seasonal frame."
  ],
  "coastal_city": {
    "name": "Karachi",
    "countryName": "Pakistan",
    "path": "/pakistan/sindh/karachi",
    "lat": 24.8607,
    "lng": 67.0011,
    "timezone": "Asia/Karachi"
  },
  "faqs": [
    {
      "q": "How big is the Arabian Sea?",
      "a": "Its total area is 3,862,000 km² (1,491,000 sq mi), the northwestern region of the Indian Ocean, between the Arabian Peninsula, Iran, Pakistan, India, the Maldives and Somalia (Wikidata / Wikipedia)."
    },
    {
      "q": "How deep is the Arabian Sea?",
      "a": "Wikipedia gives a maximum depth of 5,395 metres; Wikidata records 5,800 metres for the same quantity. Both figures are shown in this page’s sources rather than hidden: depth soundings for an entire sea are estimates that vary by survey and by where the deepest point is taken."
    },
    {
      "q": "What are the waves like in the Arabian Sea today?",
      "a": "The live panel at the top of this page shows today’s significant wave height, swell direction and wave period from the Open-Meteo Marine API at the sea’s representative point (16° N, 64° E), plus the weather on the coast at Karachi."
    },
    {
      "q": "When is the Arabian Sea roughest?",
      "a": "During the southwest monsoon, roughly June to September, when strong winds drive the year’s roughest open-sea conditions. The northeast monsoon months, roughly November to March, are generally the calmest, the pattern that governed sailing trade here for millennia (Wikipedia)."
    },
    {
      "q": "Which WorldCityHub city is on the Arabian Sea?",
      "a": "Karachi, Pakistan, the great port city on the sea’s northern shore. Its full WorldCityHub guide (weather, prayer times, rates, news and more) is linked from this page."
    }
  ],
  "part_of_label": "Indian Ocean · northwestern arm",
  "season_title": "The monsoon sea",
  "wiki_title": "Arabian_Sea"
}
$json$::jsonb
WHERE slug = 'arabian-sea'
  AND curated::text LIKE '%—%';

UPDATE public.oceans
SET curated = $json$
{
  "intro": [
    "The Pacific Ocean is the largest and deepest of the world’s oceans, stretching from the Arctic in the north to the Southern Ocean in the south, bounded by Asia and Australia to the west and the Americas to the east. At 161,760,000 km² on Wikidata’s measure it covers roughly a third of the Earth’s surface, more than all of the planet’s land combined.",
    "Its floor holds the Mariana Trench, whose Challenger Deep is the deepest point in any ocean, and its rim, the Ring of Fire, carries most of the world’s volcanoes and great earthquakes. More than 25,000 islands rise from it, the largest concentration of islands in any ocean, and its tuna fisheries supply a majority of the world’s tuna catch.",
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
      "value": "1519–1521, by Ferdinand Magellan, \"Mar Pacífico\", the peaceful sea",
      "source": "Wikipedia"
    }
  ],
  "geography": [
    "West: Asia and Australia. East: North and South America. North: the Bering Strait opens to the Arctic Ocean; south: the Southern Ocean takes over around 60° S (the boundary used by most authorities). The equator divides it into the North and South Pacific, whose great subtropical gyres turn clockwise in the north and counter-clockwise in the south. Its marginal seas include the Philippine Sea, the Coral Sea, the South China Sea, the Sea of Japan, the Bering Sea and the Tasman Sea (Wikipedia)."
  ],
  "monsoon": [
    "The Pacific does not run on a monsoon; its seasonal drama is tropical cyclones and ENSO. The northwest Pacific is the most active cyclone basin on Earth, typhoons can form in any month and peak in late summer, while the northeast Pacific hurricane season runs roughly June to November and the South Pacific season November to April. Super-typhoons here have produced the strongest reliably measured winds and lowest pressures in any ocean basin.",
    "Every few years the El Niño–Southern Oscillation rearranges the whole ocean: in El Niño the warm pool slumps east, Peruvian anchoveta fisheries collapse, Australia dries and the Americas’ Pacific coasts flood; La Niña reverses the pattern. Forecasters announce the current phase from equatorial temperature anomalies. This page’s season frame names the cyclone season only; the live waves above are today’s measurement, not a climate claim."
  ],
  "coastal_city": null,
  "faqs": [
    {
      "q": "How big is the Pacific Ocean?",
      "a": "161,760,000 km² on Wikidata’s measure, about a third of the Earth’s surface, larger than all land areas combined. Wikipedia’s infobox gives 165,250,000 km² including adjacent seas; the difference is which marginal seas are counted, and this page shows both figures rather than hiding the disagreement."
    },
    {
      "q": "What is the deepest point in the Pacific?",
      "a": "The Challenger Deep in the Mariana Trench. Wikidata records the ocean’s maximum depth as 11,034 m; modern multibeam surveys of the Challenger Deep itself measure about 10,935 m. Both figures are shown in this page’s sources."
    },
    {
      "q": "Why is it called the Pacific?",
      "a": "Ferdinand Magellan named it \"Mar Pacífico\", the peaceful sea, after his fleet crossed from the stormy strait at South America’s tip into calm waters in 1520. The name stuck, however unpeaceful the typhoon belt can be."
    },
    {
      "q": "What is El Niño?",
      "a": "A warming of the equatorial Pacific’s surface waters that recurs every few years and shifts rainfall, fisheries and storm patterns worldwide; its cool counterpart is La Niña. Together they form the El Niño–Southern Oscillation (ENSO)."
    }
  ],
  "part_of_label": "World Ocean · the largest ocean on Earth",
  "season_title": "Cyclones, El Niño & the great gyres",
  "wiki_title": "Pacific_Ocean"
}
$json$::jsonb
WHERE slug = 'pacific-ocean'
  AND curated::text LIKE '%—%';

UPDATE public.oceans
SET curated = $json$
{
  "intro": [
    "The Atlantic Ocean is the second-largest ocean, occupying an S-shaped basin between the Americas to the west and Europe and Africa to the east. At 106,460,000 km² it covers about a fifth of the Earth’s surface, and it is, geologically, the youngest great ocean: it opened as the Americas pulled away from Europe and Africa, and it is still widening by a few centimetres a year along the Mid-Atlantic Ridge.",
    "That ridge, the longest mountain range on Earth, runs down the Atlantic’s spine, surfacing as Iceland, the Azores and other islands. The ocean it divides is the historic highway of the modern world, the routes of exploration, trade, migration and the first transatlantic cables and flights all crossed it, and its currents, above all the Gulf Stream, quietly set the climate of northwestern Europe.",
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
      "value": "The Mid-Atlantic Ridge, the ocean is still widening",
      "source": "Wikipedia"
    }
  ],
  "geography": [
    "West: North and South America. East: Europe and Africa. North: the Arctic Ocean between Greenland and Scandinavia; south: the Southern Ocean from about 60° S. The equator splits it into the North and South Atlantic, whose gyres turn in opposite directions. Marginal seas include the Caribbean Sea, the Mediterranean (through Gibraltar), the North Sea, the Baltic and the Gulf of Mexico. The shortest crossing, Brazil to West Africa, is under 3,000 km; at its widest the ocean spans more than 11,000 km (Wikipedia)."
  ],
  "monsoon": [
    "The Atlantic’s governing season is the hurricane season, officially 1 June to 30 November: warm tropical water, moist air and low wind shear let storms organise off West Africa and track west, the strongest of them curving toward the Caribbean, the Gulf of Mexico and the US coast, with a climatological peak around 10 September. Outside the season the tropical Atlantic is comparatively quiet, while winter extratropical storms take over the North Atlantic’s higher latitudes.",
    "The Gulf Stream is the ocean’s other standing fact: a warm, fast current flowing from Florida along North America’s coast and across toward Europe, part of the Atlantic Meridional Overturning Circulation. It carries tropical heat north-eastward on a scale that measurably warms northwestern Europe’s winters relative to its latitude."
  ],
  "coastal_city": null,
  "faqs": [
    {
      "q": "How big is the Atlantic Ocean?",
      "a": "106,460,000 km² (Wikidata), the second-largest ocean, covering roughly 20% of the Earth’s surface."
    },
    {
      "q": "What is the deepest point in the Atlantic?",
      "a": "The Milwaukee Deep in the Puerto Rico Trench, 8,605 m on Wikidata’s record; some references give 8,376 m for the trench’s deepest sounding. This page shows the Wikidata figure with the variant recorded in its sources."
    },
    {
      "q": "Is the Atlantic really getting wider?",
      "a": "Yes, seafloor spreading along the Mid-Atlantic Ridge pushes the Americas and Europe/Africa apart by roughly 2–5 cm a year, about the rate fingernails grow."
    },
    {
      "q": "When is Atlantic hurricane season?",
      "a": "1 June to 30 November, with the climatological peak around 10 September. Most major hurricanes are Cape Verde-type storms that form off West Africa in August and September."
    }
  ],
  "part_of_label": "World Ocean · between the Americas, Europe and Africa",
  "season_title": "Hurricane season & the Gulf Stream",
  "wiki_title": "Atlantic_Ocean"
}
$json$::jsonb
WHERE slug = 'atlantic-ocean'
  AND curated::text LIKE '%—%';

UPDATE public.oceans
SET curated = $json$
{
  "intro": [
    "The Indian Ocean is the third-largest ocean and the only one named after a country. It is bounded by East Africa to the west, Asia, the Arabian Peninsula, the Indian subcontinent and the Malay Peninsula, to the north, the East Indies and Australia to the east, and the Southern Ocean to the south. At 70,560,000 km² it covers about a fifth of the world’s ocean surface.",
    "It is the warmest ocean and the monsoon ocean: alone among the great oceans it is closed by land at tropical latitudes in the north, so its northern winds and currents reverse with the seasons, the pattern that powered two thousand years of sail trade between East Africa, Arabia, India and Southeast Asia, and that still times the rains of South Asia. Its northwestern arm, the Arabian Sea, has its own page on this site; its other great marginal seas include the Bay of Bengal, the Red Sea and the Persian Gulf.",
    "Its deepest measured point lies in the Java (Sunda) Trench system off Indonesia, and its floor carries the scars and ridges of the subcontinent’s long drift north from Gondwana into Asia, the collision that raised the Himalaya. Karachi, on its northern shore, is this page’s published coastal city; the live block samples open-ocean waves at the ocean’s representative point (20° S, 80° E) beside Karachi’s coastal weather."
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
      "value": "The monsoon, winds and northern currents reverse with the seasons",
      "source": "Wikipedia"
    },
    {
      "label": "Representative point",
      "value": "20° S, 80° E",
      "source": "Wikidata"
    },
    {
      "label": "Northern shore on this site",
      "value": "Karachi, Pakistan, its great northern port",
      "source": "Wikipedia"
    }
  ],
  "geography": [
    "West: East Africa and the Arabian Peninsula (across the Red Sea and the Gulf of Aden). North: South Asia, Pakistan, India, Bangladesh, Myanmar. East: Thailand, Malaysia, Indonesia and Australia. South: the Southern Ocean from about 60° S. The equator crosses it, but most of its bulk lies in the southern hemisphere; its island nations and territories include Sri Lanka, the Maldives, Mauritius, Seychelles and Madagascar off Africa (Wikipedia)."
  ],
  "monsoon": [
    "The Indian Ocean is the monsoon’s home water. In summer the Asian landmass heats faster than the ocean, winds reverse to blow from the southwest, and the Somali Current itself turns around to flow north-east, the only great ocean current that changes direction with the seasons, carrying the rains to India’s west coast. In winter the flow relaxes back to the northeast monsoon: drier winds off the land, calmer northern seas.",
    "That twice-yearly reversal scheduled civilisation here: dhows rode the southwest monsoon to India and waited for the northeast monsoon to carry them home to Arabia and East Africa. It still schedules the ocean today, fisheries, shipping weather windows and the South Asian rains all run on the monsoon clock, which is why this page pairs the season frame with the live wave picture rather than a static description."
  ],
  "coastal_city": {
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
      "a": "70,560,000 km² (Wikidata), the third-largest ocean, about 20% of the world’s ocean area."
    },
    {
      "q": "What is the deepest point in the Indian Ocean?",
      "a": "Wikidata records a maximum depth of 7,450 m. The deepest surveyed point is in the Diamantina Trench area southwest of Australia, where the Five Deeps expedition measured about 7,257 m in 2019, both figures are carried in this page’s sources rather than one being hidden."
    },
    {
      "q": "Why is the Indian Ocean called the monsoon ocean?",
      "a": "Because its northern half is closed by Asia, its winds and currents reverse with the seasons, the southwest monsoon in summer, the northeast monsoon in winter, a pattern no other great ocean shows so completely."
    },
    {
      "q": "Is the Arabian Sea part of the Indian Ocean?",
      "a": "Yes, the Arabian Sea is the Indian Ocean’s northwestern arm, between Arabia, Iran, Pakistan and India. It has its own dedicated page on this site with Karachi coastal coverage."
    }
  ],
  "part_of_label": "World Ocean · the monsoon ocean",
  "season_title": "The monsoon ocean",
  "wiki_title": "Indian_Ocean"
}
$json$::jsonb
WHERE slug = 'indian-ocean'
  AND curated::text LIKE '%—%';

UPDATE public.oceans
SET curated = $json$
{
  "intro": [
    "The Arctic Ocean is the smallest, shallowest and coldest of the great oceans, 14,056,000 km² of mostly ice-covered water around the North Pole, ringed by the northern coasts of North America, Greenland, Europe and Asia. Almost landlocked, it receives huge river inflows from Siberia and Canada, which freshen its surface layer and help its sea ice form each winter.",
    "Its defining fact is the ice itself: a floating cap that grows through the polar night to a March maximum of about 15 million km² and melts back to a September minimum that, in recent decades, has shrunk dramatically, the September extent has been declining at roughly 13% per decade since satellite records began in 1979 (NASA/NSIDC figures, reported in the sources below). Beneath the ice, the Lomonosov Ridge crosses from Siberia toward Greenland, and the ocean’s deepest point, the Molloy Deep, drops 5,550 m near Svalbard’s Fram Strait.",
    "The Arctic is warming several times faster than the global average, \"Arctic amplification\", and its opening water is redrawing shipping maps (the Northern Sea Route and the Northwest Passage) and geopolitics alike. There is no published WorldCityHub coastal city on this ocean yet, so this page carries the open-ocean panel only. The representative point near the pole is ice-covered and returns no wave data, so the live panel samples the nearest open water, in the Barents Sea at 72.5° N, 20° E, and labels the figures with that point wherever they appear."
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
      "value": "1,205 m, the shallowest ocean",
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
    "The Arctic Ocean is ringed by the coasts of Canada, Greenland, Iceland, Norway, Russia and Alaska (USA), connected to the Pacific only by the narrow Bering Strait and to the Atlantic through the Greenland and Norwegian seas and the Canadian Arctic Archipelago’s channels. Much of its area is shallow continental shelf, the Siberian shelves are the widest on Earth, while its centre holds deep basins divided by the Lomonosov and Gakkel ridges (Wikipedia)."
  ],
  "monsoon": [
    "No monsoon reaches the pole; the Arctic year is an ice year. From October the returning polar night lets the surface freeze outward from the coasts until the pack peaks in March; from April, 24-hour daylight works the ice back until the September minimum. River freshets in late spring push great plumes of fresh water, and the nutrients and sediments of half a continent, under and through the melting ice.",
    "The long trend inside that annual cycle is the story: multi-year ice has thinned and the September minimum has shrunk by roughly 13% per decade since 1979 in the satellite record. What a visitor or a ship meets in a given September now differs measurably from a generation ago, which is why this page shows the season frame as climatology and reserves its live panel for today’s measured point data."
  ],
  "coastal_city": null,
  "faqs": [
    {
      "q": "How big is the Arctic Ocean?",
      "a": "14,056,000 km² (Wikidata), the smallest of the five oceans, about a fifth the size of the Indian Ocean."
    },
    {
      "q": "What is the deepest point in the Arctic Ocean?",
      "a": "The Molloy Deep in the Fram Strait, at 5,550 m, Wikidata’s figure, matching the Five Deeps expedition’s 2019 survey of the site."
    },
    {
      "q": "Is the Arctic ice really shrinking?",
      "a": "The September sea-ice extent has declined at about 13% per decade since satellite monitoring began in 1979 (NASA/NSIDC). Winter ice still forms across most of the ocean each year; it is the summer minimum and the share of thick multi-year ice that are falling."
    },
    {
      "q": "Which countries border the Arctic Ocean?",
      "a": "Canada, Denmark (via Greenland), Iceland, Norway, Russia and the United States (Alaska), the \"Arctic Five\" littoral states plus Iceland with Arctic territory and waters."
    }
  ],
  "part_of_label": "World Ocean · the smallest and shallowest ocean",
  "season_title": "The ice ocean",
  "wiki_title": "Arctic_Ocean"
}
$json$::jsonb
WHERE slug = 'arctic-ocean'
  AND curated::text LIKE '%—%';

UPDATE public.oceans
SET curated = $json$
{
  "intro": [
    "The Southern Ocean is the water around Antarctica, the only ocean that flows completely around the globe, driven by the Roaring Forties and Furious Fifties westerlies through the one stretch of sea with no land to stop it. Most authorities draw it south of 60° S; on that measure Wikidata records 20,327,000 km², making it the second-smallest ocean, larger than the Arctic.",
    "Its existence is itself a documented disagreement, and this page shows it rather than hiding it: the International Hydrographic Organization proposed the Southern Ocean in its 2000 draft limits but never formally ratified the definition, while National Geographic recognised it in 2021 and most oceanographers treat the Antarctic Convergence, where cold Antarctic water meets warmer subantarctic water, as its true, moving boundary. What is not disputed is the water: the Antarctic Circumpolar Current moves more water than any other current on Earth, connecting the Pacific, Atlantic and Indian oceans into one system.",
    "Twice a year the ocean performs the largest seasonal transformation on the planet: Antarctic sea ice grows outward in the austral winter until it roughly doubles the continent’s area, then retreats almost to the coast in summer. The live block on this page samples waves at the nearest open water to its representative point, at 55° S, 90° E, because the point itself (65° S, 90° E) sits in the seasonal ice zone and returns no wave data, in the wind belt that made these latitudes a byword for the roughest seas on Earth."
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
      "value": "Antarctic Circumpolar Current, the strongest ocean current on Earth",
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
    "The Southern Ocean surrounds Antarctica, touching the southern tips of South America (through the Drake Passage), Africa and Australia only at its northern fringe. It includes the great Antarctic marginal seas, Weddell, Ross, Amundsen, Bellingshausen, and island groups such as South Georgia, the South Sandwich Islands, Kerguelen and Heard Island. Its northern boundary is the honest argument described in the intro: the fixed 60° S line on charts versus the oceanographic Antarctic Convergence, which wanders between roughly 48° S and 61° S with season and longitude (Wikipedia)."
  ],
  "monsoon": [
    "The Southern Ocean’s seasons are the ice pulse and the wind. In the austral winter the sea surface freezes outward for thousands of kilometres, Antarctic sea ice grows from about 3 million km² in February to some 18 million km² in September, the largest seasonal ice change anywhere, while the westerlies drive the Circumpolar Current and stack up some of the biggest average wave heights on the planet, in every season.",
    "Summer reverses the picture: the ice retreats almost to the continent, research stations and the small Antarctic tourism season open, and krill swarm in the sunlit surface waters that feed the Southern Ocean’s whales, seals and penguins. Recent years have broken the pattern’s records, Antarctic sea-ice extents set new lows in 2023, which is recorded here as reported context, not a live figure; the live panel above is today’s measurement only."
  ],
  "coastal_city": null,
  "faqs": [
    {
      "q": "Is the Southern Ocean officially an ocean?",
      "a": "It depends whose authority you ask, and this page shows the disagreement: the IHO drafted it in 2000 but never ratified the limits; the US Board on Geographic Names and National Geographic (from 2021) recognise it; many scientists use the Antarctic Convergence as its real boundary. Wikidata records it as the fifth ocean, Q7354."
    },
    {
      "q": "How big is the Southern Ocean?",
      "a": "20,327,000 km² on the 60° S definition (Wikidata), the second-smallest ocean, ahead of the Arctic."
    },
    {
      "q": "What is the deepest point in the Southern Ocean?",
      "a": "Wikidata records 7,235 m. The Five Deeps expedition measured the Factorian Deep in the South Sandwich Trench at about 7,432 m in 2019, the two figures are both carried in this page’s sources."
    },
    {
      "q": "What is the Antarctic Circumpolar Current?",
      "a": "The strongest ocean current on Earth, a continuous eastward flow around Antarctica, unblocked by any continent, moving on the order of 130+ million cubic metres per second and linking the Pacific, Atlantic and Indian oceans."
    }
  ],
  "part_of_label": "World Ocean · the ocean around Antarctica",
  "season_title": "The stormiest waters on Earth",
  "wiki_title": "Southern_Ocean"
}
$json$::jsonb
WHERE slug = 'southern-ocean'
  AND curated::text LIKE '%—%';

-- ── 3. ocean_media: alt_text / attribution_text em dashes ──────────────────
UPDATE public.ocean_media
SET attribution_text = '"Arabian sea waves" by Galib Tufan, CC BY-SA 4.0, via Wikimedia Commons'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'arabian-sea')
  AND file_title = 'Arabian sea waves.jpg'
  AND (attribution_text = '"Arabian sea waves" by Galib Tufan — CC BY-SA 4.0, via Wikimedia Commons');

UPDATE public.ocean_media
SET attribution_text = '"Winter Phytoplankton, Arabian Sea" by NASA, public domain, via Wikimedia Commons'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'arabian-sea')
  AND file_title = 'Winter Phytoplankon Arabian Sea.jpg'
  AND (attribution_text = '"Winter Phytoplankton, Arabian Sea" by NASA — public domain, via Wikimedia Commons');

UPDATE public.ocean_media
SET attribution_text = '"Arabian Sea and Morjim Beach as seen from Vagator Fort, Goa, India" by Vyacheslav Argenberg, CC BY 4.0, via Wikimedia Commons'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'arabian-sea')
  AND file_title = 'Arabian Sea and Morjim Beach as seen from Vagator Fort, Goa, India.jpg'
  AND (attribution_text = '"Arabian Sea and Morjim Beach as seen from Vagator Fort, Goa, India" by Vyacheslav Argenberg — CC BY 4.0, via Wikimedia Commons');

UPDATE public.ocean_media
SET attribution_text = '"Arabian Sea" satellite tile by Arjun Sinh Jadeja, CC BY-SA 4.0, via Wikimedia Commons'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'arabian-sea')
  AND file_title = 'Arabian Sea - n22e70.jpg'
  AND (attribution_text = '"Arabian Sea" satellite tile by Arjun Sinh Jadeja — CC BY-SA 4.0, via Wikimedia Commons');

UPDATE public.ocean_media
SET attribution_text = '"Maysak 2015-03-31 ISS.jpg" by Samantha Cristoforetti (ESA/NASA), public domain, via Wikimedia Commons'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'pacific-ocean')
  AND file_title = 'Maysak 2015-03-31 ISS.jpg'
  AND (attribution_text = '"Maysak 2015-03-31 ISS.jpg" by Samantha Cristoforetti (ESA/NASA) — public domain, via Wikimedia Commons');

UPDATE public.ocean_media
SET alt_text = 'The Pacific Ocean from orbit, cloud streets over deep blue water', attribution_text = '"ISS034-E-5426 - View of Pacific Ocean.jpg" by NASA Earth Science and Remote Sensing Unit, public domain, via Wikimedia Commons'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'pacific-ocean')
  AND file_title = 'ISS034-E-5426 - View of Pacific Ocean.jpg'
  AND (alt_text = 'The Pacific Ocean from orbit — cloud streets over deep blue water' OR attribution_text = '"ISS034-E-5426 - View of Pacific Ocean.jpg" by NASA Earth Science and Remote Sensing Unit — public domain, via Wikimedia Commons');

UPDATE public.ocean_media
SET attribution_text = '"Staring Down Hurricane Florence.jpg" by Alexander Gerst (ESA/NASA), public domain, via Wikimedia Commons'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'atlantic-ocean')
  AND file_title = 'Staring Down Hurricane Florence.jpg'
  AND (attribution_text = '"Staring Down Hurricane Florence.jpg" by Alexander Gerst (ESA/NASA) — public domain, via Wikimedia Commons');

UPDATE public.ocean_media
SET alt_text = 'Cyclone Catarina off Brazil in 2004, the South Atlantic’s rare hurricane-strength cyclone', attribution_text = '"Cyclone Catarina from the ISS on March 26 2004.JPG" by NASA, public domain, via Wikimedia Commons'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'atlantic-ocean')
  AND file_title = 'Cyclone Catarina from the ISS on March 26 2004.JPG'
  AND (alt_text = 'Cyclone Catarina off Brazil in 2004 — the South Atlantic’s rare hurricane-strength cyclone' OR attribution_text = '"Cyclone Catarina from the ISS on March 26 2004.JPG" by NASA — public domain, via Wikimedia Commons');

UPDATE public.ocean_media
SET attribution_text = '"Aerial shot of a small island on a coral reef in the Maldives.jpg" by Dr. Ondřej Havelka, CC BY-SA 4.0, via Wikimedia Commons'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'indian-ocean')
  AND file_title = 'Aerial shot of a small island on a coral reef in the Maldives.jpg'
  AND (attribution_text = '"Aerial shot of a small island on a coral reef in the Maldives.jpg" by Dr. Ondřej Havelka — CC BY-SA 4.0, via Wikimedia Commons');

UPDATE public.ocean_media
SET attribution_text = '"1 Maldives, Indian Ocean, Asia.jpg" by Dr. Ondřej Havelka, CC BY-SA 4.0, via Wikimedia Commons'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'indian-ocean')
  AND file_title = '1 Maldives, Indian Ocean, Asia.jpg'
  AND (attribution_text = '"1 Maldives, Indian Ocean, Asia.jpg" by Dr. Ondřej Havelka — CC BY-SA 4.0, via Wikimedia Commons');

UPDATE public.ocean_media
SET attribution_text = '"Arctic Sea Ice Lead (7873353514).jpg" by NASA Goddard Space Flight Center, public domain, via Wikimedia Commons'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'arctic-ocean')
  AND file_title = 'Arctic Sea Ice Lead (7873353514).jpg'
  AND (attribution_text = '"Arctic Sea Ice Lead (7873353514).jpg" by NASA Goddard Space Flight Center — public domain, via Wikimedia Commons');

UPDATE public.ocean_media
SET attribution_text = '"Arctic sea ice varied (7873355004).jpg" by NASA Goddard Space Flight Center, public domain, via Wikimedia Commons'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'arctic-ocean')
  AND file_title = 'Arctic sea ice varied (7873355004).jpg'
  AND (attribution_text = '"Arctic sea ice varied (7873355004).jpg" by NASA Goddard Space Flight Center — public domain, via Wikimedia Commons');

UPDATE public.ocean_media
SET attribution_text = '"South Shetland-2016-Southern Ocean (off Elephant Island)–Iceberg 01.jpg" by Godot13, CC BY-SA 4.0, via Wikimedia Commons'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'southern-ocean')
  AND file_title = 'South Shetland-2016-Southern Ocean (off Elephant Island)–Iceberg 01.jpg'
  AND (attribution_text = '"South Shetland-2016-Southern Ocean (off Elephant Island)–Iceberg 01.jpg" by Godot13 — CC BY-SA 4.0, via Wikimedia Commons');

UPDATE public.ocean_media
SET attribution_text = '"Iceberg Antarctica edit1.jpg" by Ben Stephenson, derivative edit by hike395, CC BY 2.0, via Wikimedia Commons'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'southern-ocean')
  AND file_title = 'Iceberg Antarctica edit1.jpg'
  AND (attribution_text = '"Iceberg Antarctica edit1.jpg" by Ben Stephenson, derivative edit by hike395 — CC BY 2.0, via Wikimedia Commons');

-- ── 4. ocean_sources: claim / source_name em dashes + sampling wording ─────
UPDATE public.ocean_sources
SET source_name = 'Wikidata: Q58705 (Arabian Sea)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'arabian-sea')
  AND claim = 'Identity (matched on description, not name alone), representative coordinates 16° N 64° E, area, part of Indian Ocean' AND source_name = 'Wikidata — Q58705 (Arabian Sea)';

UPDATE public.ocean_sources
SET source_name = 'Wikipedia: "Arabian Sea"'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'arabian-sea')
  AND claim = 'Bounds, connections (Bab-el-Mandeb, Gulf of Oman), Arabian Basin, monsoon pattern, trade history' AND source_name = 'Wikipedia — "Arabian Sea"';

UPDATE public.ocean_sources
SET claim = 'Maximum depth: SOURCES DIFFER: Wikipedia 5,395 m; Wikidata (P4511) 5,800 m. Both recorded; the fact card shows Wikipedia’s figure with this note', source_name = 'Wikipedia: "Arabian Sea" / Wikidata Q58705'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'arabian-sea')
  AND claim = 'Maximum depth — SOURCES DIFFER: Wikipedia 5,395 m; Wikidata (P4511) 5,800 m. Both recorded; the fact card shows Wikipedia''s figure with this note' AND source_name = 'Wikipedia — "Arabian Sea" / Wikidata Q58705';

UPDATE public.ocean_sources
SET source_name = 'Wikimedia Commons: imageinfo records (per-file links in the credits)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'arabian-sea')
  AND claim = 'All photographs: licence, author, dimensions' AND source_name = 'Wikimedia Commons — imageinfo records (per-file links in the credits)';

UPDATE public.ocean_sources
SET source_name = 'Wikidata: Q98 (Pacific Ocean)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'pacific-ocean')
  AND claim = 'Identity, representative point (0, −160), area 161,760,000 km², maximum depth 11,034 m' AND source_name = 'Wikidata — Q98 (Pacific Ocean)';

UPDATE public.ocean_sources
SET source_name = 'Wikipedia: "Pacific Ocean" (cross-checked)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'pacific-ocean')
  AND claim = 'Area including adjacent seas given as 165,250,000 km²; average depth 4,280 m; Challenger Deep modern surveys ≈10,935 m' AND source_name = 'Wikipedia — "Pacific Ocean" (cross-checked)';

UPDATE public.ocean_sources
SET source_name = 'Wikimedia Commons: imageinfo records (per-file links in the credits)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'pacific-ocean')
  AND claim = 'All photographs: licence, author, dimensions' AND source_name = 'Wikimedia Commons — imageinfo records (per-file links in the credits)';

UPDATE public.ocean_sources
SET source_name = 'Wikidata: Q97 (Atlantic Ocean)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'atlantic-ocean')
  AND claim = 'Identity, representative point (0, −30), area 106,460,000 km², maximum depth 8,605 m' AND source_name = 'Wikidata — Q97 (Atlantic Ocean)';

UPDATE public.ocean_sources
SET source_name = 'Wikipedia: "Atlantic Ocean" (cross-checked)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'atlantic-ocean')
  AND claim = 'Average depth 3,646 m; Milwaukee Deep named; some references give 8,376 m for the Puerto Rico Trench' AND source_name = 'Wikipedia — "Atlantic Ocean" (cross-checked)';

UPDATE public.ocean_sources
SET source_name = 'Wikimedia Commons: imageinfo records (per-file links in the credits)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'atlantic-ocean')
  AND claim = 'All photographs: licence, author, dimensions' AND source_name = 'Wikimedia Commons — imageinfo records (per-file links in the credits)';

UPDATE public.ocean_sources
SET source_name = 'Wikidata: Q1239 (Indian Ocean)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'indian-ocean')
  AND claim = 'Identity, representative point (−20, 80), area 70,560,000 km², maximum depth 7,450 m' AND source_name = 'Wikidata — Q1239 (Indian Ocean)';

UPDATE public.ocean_sources
SET source_name = 'Wikipedia: "Indian Ocean" (cross-checked)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'indian-ocean')
  AND claim = 'Average depth 3,741 m; Diamantina Trench Five Deeps measurement ≈7,257 m (2019)' AND source_name = 'Wikipedia — "Indian Ocean" (cross-checked)';

UPDATE public.ocean_sources
SET source_name = 'Wikimedia Commons: imageinfo records (per-file links in the credits)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'indian-ocean')
  AND claim = 'All photographs: licence, author, dimensions' AND source_name = 'Wikimedia Commons — imageinfo records (per-file links in the credits)';

UPDATE public.ocean_sources
SET source_name = 'Wikidata: Q788 (Arctic Ocean)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'arctic-ocean')
  AND claim = 'Identity, representative point, area 14,056,000 km², maximum depth 5,550 m' AND source_name = 'Wikidata — Q788 (Arctic Ocean)';

UPDATE public.ocean_sources
SET source_name = 'Wikipedia: "Arctic Ocean" (cross-checked)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'arctic-ocean')
  AND claim = 'Average depth 1,205 m; Molloy Deep; sea-ice cycle' AND source_name = 'Wikipedia — "Arctic Ocean" (cross-checked)';

UPDATE public.ocean_sources
SET source_name = 'Wikimedia Commons: imageinfo records (per-file links in the credits)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'arctic-ocean')
  AND claim = 'All photographs: licence, author, dimensions' AND source_name = 'Wikimedia Commons — imageinfo records (per-file links in the credits)';

UPDATE public.ocean_sources
SET claim = 'Live wave data sampled at the nearest open water (72.5° N, 20° E), because the representative point is ice-covered'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'arctic-ocean')
  AND claim = 'Live wave/point data at the representative point';

UPDATE public.ocean_sources
SET source_name = 'Wikidata: Q7354 (Southern Ocean)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'southern-ocean')
  AND claim = 'Identity, representative point (−65, 90), area 20,327,000 km², maximum depth 7,235 m' AND source_name = 'Wikidata — Q7354 (Southern Ocean)';

UPDATE public.ocean_sources
SET source_name = 'Wikipedia: "Southern Ocean" (cross-checked)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'southern-ocean')
  AND claim = 'Average depth 3,270 m; IHO 2000 draft never ratified; National Geographic recognition 2021; Factorian Deep ≈7,432 m (Five Deeps, 2019)' AND source_name = 'Wikipedia — "Southern Ocean" (cross-checked)';

UPDATE public.ocean_sources
SET source_name = 'Wikimedia Commons: imageinfo records (per-file links in the credits)'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'southern-ocean')
  AND claim = 'All photographs: licence, author, dimensions' AND source_name = 'Wikimedia Commons — imageinfo records (per-file links in the credits)';

UPDATE public.ocean_sources
SET claim = 'Live wave height, direction and period sampled at the nearest open water (55° S, 90° E); the representative point at 65° S is ice-covered'
WHERE ocean_id = (SELECT id FROM public.oceans WHERE slug = 'southern-ocean')
  AND claim = 'Live wave height, direction and period at 65° S, 90° E';

-- Verification (run after applying): every count must be 0.
-- SELECT
--   (SELECT count(*) FROM public.oceans WHERE slug IN
--     ('arabian-sea','pacific-ocean','atlantic-ocean','indian-ocean',
--      'arctic-ocean','southern-ocean')
--     AND (seo_description LIKE '%—%' OR curated::text LIKE '%—%'))
--     AS oceans_with_dashes,
--   (SELECT count(*) FROM public.ocean_media m
--     JOIN public.oceans o ON o.id = m.ocean_id
--     WHERE o.slug IN ('arabian-sea','pacific-ocean','atlantic-ocean',
--       'indian-ocean','arctic-ocean','southern-ocean')
--     AND (m.alt_text LIKE '%—%' OR m.attribution_text LIKE '%—%'))
--     AS media_with_dashes,
--   (SELECT count(*) FROM public.ocean_sources s
--     JOIN public.oceans o ON o.id = s.ocean_id
--     WHERE o.slug IN ('arabian-sea','pacific-ocean','atlantic-ocean',
--       'indian-ocean','arctic-ocean','southern-ocean')
--     AND (s.claim LIKE '%—%' OR s.source_name LIKE '%—%'))
--     AS sources_with_dashes;
-- And the polar rows carry the sampling wording, e.g.:
-- SELECT slug, seo_description FROM public.oceans
-- WHERE slug IN ('arctic-ocean', 'southern-ocean');
