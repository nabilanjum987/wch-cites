-- ════════════════════════════════════════════════════════════════════
-- 0012 — Seas batch (Round 2 extension, R3B)
--
-- Ten seas on the golden ocean pattern of 0002/0009: Mediterranean,
-- Caribbean, South China Sea, Red Sea, Bering Sea, Coral Sea,
-- Persian Gulf, Tasman Sea, Baltic Sea, North Sea. QIDs verified by
-- description match 2026-10-22 (Persian Gulf Q34675 — not Q37643,
-- the war item); areas/coords from Wikidata, depths cross-checked
-- with Wikipedia, variants recorded in each row's curated sources.
-- All rows status='draft'; switch-on waits for billi's audit.
-- The baked BUILT_OCEANS dataset in src/lib/oceans.ts carries the
-- identical content on the branch.
-- ════════════════════════════════════════════════════════════════════

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'mediterranean-sea', 'Mediterranean Sea', 'Q4918', 'Atlantic Ocean', 38, 17, 'Europe/Rome',
  'draft', '2026-10-22',
  'Mediterranean Sea: Live Waves, Weather & Facts',
  'The Mediterranean Sea live: wave height, size and depth facts with sources shown, and its seasons explained.',
  $json$
{
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
 "coastal_city": null,
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
 "part_of_label": "Atlantic Ocean · the sea between the continents",
 "season_title": "Mistral, sirocco & the winter storm season",
 "wiki_title": "Mediterranean_Sea"
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'caribbean-sea', 'Caribbean Sea', 'Q1247', 'Atlantic Ocean', 15, -75, 'America/Puerto_Rico',
  'draft', '2026-10-22',
  'Caribbean Sea: Live Waves, Weather & Facts',
  'The Caribbean Sea live: wave height, size and depth facts with sources shown, and its seasons explained.',
  $json$
{
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
 "coastal_city": null,
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
 "part_of_label": "Atlantic Ocean · the tropical American sea",
 "season_title": "Hurricane season & the trade winds",
 "wiki_title": "Caribbean_Sea"
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'south-china-sea', 'South China Sea', 'Q37660', 'Pacific Ocean', 12, 113, 'Asia/Shanghai',
  'draft', '2026-10-22',
  'South China Sea: Live Waves, Weather & Facts',
  'The South China Sea live: wave height, size and depth facts with sources shown, and its seasons explained.',
  $json$
{
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
 "coastal_city": null,
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
 "part_of_label": "Pacific Ocean · the great Asian marginal sea",
 "season_title": "Two monsoons & typhoon alley",
 "wiki_title": "South_China_Sea"
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'red-sea', 'Red Sea', 'Q23406', 'Indian Ocean', 22, 38, 'Africa/Cairo',
  'draft', '2026-10-22',
  'Red Sea: Live Waves, Weather & Facts',
  'The Red Sea live: wave height, size and depth facts with sources shown, and its seasons explained.',
  $json$
{
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
 "coastal_city": null,
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
 "part_of_label": "Indian Ocean · the young rift sea",
 "season_title": "Heat, khamsin winds & the northern winter",
 "wiki_title": "Red_Sea"
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'bering-sea', 'Bering Sea', 'Q44725', 'Pacific Ocean', 58, -178, 'America/Nome',
  'draft', '2026-10-22',
  'Bering Sea: Live Waves, Weather & Facts',
  'The Bering Sea live: wave height, size and depth facts with sources shown, and its seasons explained.',
  $json$
{
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
 "coastal_city": null,
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
 "part_of_label": "Pacific Ocean · the cold northern sea",
 "season_title": "Ice edge, Aleutian storms & the long winter",
 "wiki_title": "Bering_Sea"
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'coral-sea', 'Coral Sea', 'Q82931', 'Pacific Ocean', -18, 158, 'Australia/Brisbane',
  'draft', '2026-10-22',
  'Coral Sea: Live Waves, Weather & Facts',
  'The Coral Sea live: wave height, size and depth facts with sources shown, and its seasons explained.',
  $json$
{
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
 "coastal_city": null,
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
 "part_of_label": "Pacific Ocean · the sea of reefs",
 "season_title": "Cyclone season & the November coral spawn",
 "wiki_title": "Coral_Sea"
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'persian-gulf', 'Persian Gulf', 'Q34675', 'Indian Ocean', 26, 52, 'Asia/Dubai',
  'draft', '2026-10-22',
  'Persian Gulf: Live Waves, Weather & Facts',
  'The Persian Gulf live: wave height, size and depth facts with sources shown, and its seasons explained.',
  $json$
{
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
 "coastal_city": null,
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
 "part_of_label": "Indian Ocean · the shallow energy sea",
 "season_title": "Shamal winds & the hottest sea summers",
 "wiki_title": "Persian_Gulf"
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'tasman-sea', 'Tasman Sea', 'Q33254', 'Pacific Ocean', -37, 161, 'Australia/Sydney',
  'draft', '2026-10-22',
  'Tasman Sea: Live Waves, Weather & Facts',
  'The Tasman Sea live: wave height, size and depth facts with sources shown, and its seasons explained.',
  $json$
{
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
 "coastal_city": null,
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
 "part_of_label": "Pacific Ocean · the Ditch between two nations",
 "season_title": "The westerlies & Tasman lows",
 "wiki_title": "Tasman_Sea"
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'baltic-sea', 'Baltic Sea', 'Q545', 'Atlantic Ocean', 58, 20, 'Europe/Stockholm',
  'draft', '2026-10-22',
  'Baltic Sea: Live Waves, Weather & Facts',
  'The Baltic Sea live: wave height, size and depth facts with sources shown, and its seasons explained.',
  $json$
{
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
 "coastal_city": null,
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
 "part_of_label": "Atlantic Ocean · the young brackish inland sea",
 "season_title": "Ice winters & algal summers",
 "wiki_title": "Baltic_Sea"
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'north-sea', 'North Sea', 'Q1693', 'Atlantic Ocean', 56.459, 3.683, 'Europe/London',
  'draft', '2026-10-22',
  'North Sea: Live Waves, Weather & Facts',
  'The North Sea live: wave height, size and depth facts with sources shown, and its seasons explained.',
  $json$
{
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
 "coastal_city": null,
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
 "part_of_label": "Atlantic Ocean · the shallow shelf sea of Europe",
 "season_title": "Atlantic storms & the tidal engine",
 "wiki_title": "North_Sea"
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;
