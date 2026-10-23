-- ════════════════════════════════════════════════════════════════════
-- 0009 — Ocean replication batch 1 (Round 2, R3)
--
-- Seeds the five remaining oceans on the golden pattern of 0002:
-- Pacific, Atlantic, Indian, Arctic, Southern. Verified 2026-10-22
-- (Wikidata description-matched QIDs; source conflicts on area/depth
-- recorded in ocean_sources, never hidden). All rows status='draft':
-- switch-on waits for billi’s audit + the PR #10 merge. The baked
-- BUILT_OCEANS dataset in src/lib/oceans.ts carries identical content.
-- ════════════════════════════════════════════════════════════════════

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'pacific-ocean', 'Pacific Ocean', 'Q98', 'World Ocean', 0, -160, 'UTC',
  'draft', '2026-10-22',
  'Pacific Ocean: Live Waves, Weather & Facts',
  'The Pacific Ocean live: wave height at its equatorial point, size and depth facts with sources shown, El Niño and cyclone seasons explained.',
  $json$
  {"intro": ["The Pacific Ocean is the largest and deepest of the world’s oceans, stretching from the Arctic in the north to the Southern Ocean in the south, bounded by Asia and Australia to the west and the Americas to the east. At 161,760,000 km² on Wikidata’s measure it covers roughly a third of the Earth’s surface — more than all of the planet’s land combined.", "Its floor holds the Mariana Trench, whose Challenger Deep is the deepest point in any ocean, and its rim — the Ring of Fire — carries most of the world’s volcanoes and great earthquakes. More than 25,000 islands rise from it, the largest concentration of islands in any ocean, and its tuna fisheries supply a majority of the world’s tuna catch.", "The Pacific is also the engine of the planet’s best-known climate pattern: the El Niño–Southern Oscillation swings its equatorial surface waters between warm (El Niño) and cool (La Niña) phases, rearranging rainfall, fisheries and storm tracks on several continents at once. The live block on this page samples the open-ocean wave picture at the ocean’s Wikidata representative point (0°, 160° W)."], "facts": [{"label": "Part of", "value": "World Ocean", "source": "Wikidata"}, {"label": "Total area", "value": "161,760,000 km²", "source": "Wikidata (see sources note)"}, {"label": "Average depth", "value": "4,280 m", "source": "Wikipedia"}, {"label": "Maximum depth", "value": "11,034 m", "source": "Wikidata (see sources note)"}, {"label": "Deepest point", "value": "Challenger Deep, Mariana Trench", "source": "Wikipedia"}, {"label": "Representative point", "value": "0°, 160° W", "source": "Wikidata"}, {"label": "Named", "value": "1519–1521, by Ferdinand Magellan — \"Mar Pacífico\", the peaceful sea", "source": "Wikipedia"}], "geography": ["West: Asia and Australia. East: North and South America. North: the Bering Strait opens to the Arctic Ocean; south: the Southern Ocean takes over around 60° S (the boundary used by most authorities). The equator divides it into the North and South Pacific, whose great subtropical gyres turn clockwise in the north and counter-clockwise in the south. Its marginal seas include the Philippine Sea, the Coral Sea, the South China Sea, the Sea of Japan, the Bering Sea and the Tasman Sea (Wikipedia)."], "monsoon": ["The Pacific does not run on a monsoon; its seasonal drama is tropical cyclones and ENSO. The northwest Pacific is the most active cyclone basin on Earth — typhoons can form in any month and peak in late summer — while the northeast Pacific hurricane season runs roughly June to November and the South Pacific season November to April. Super-typhoons here have produced the strongest reliably measured winds and lowest pressures in any ocean basin.", "Every few years the El Niño–Southern Oscillation rearranges the whole ocean: in El Niño the warm pool slumps east, Peruvian anchoveta fisheries collapse, Australia dries and the Americas’ Pacific coasts flood; La Niña reverses the pattern. Forecasters announce the current phase from equatorial temperature anomalies — this page’s season frame names the cyclone season only; the live waves above are today’s measurement, not a climate claim."], "coastal_city": null, "faqs": [{"q": "How big is the Pacific Ocean?", "a": "161,760,000 km² on Wikidata’s measure — about a third of the Earth’s surface, larger than all land areas combined. Wikipedia’s infobox gives 165,250,000 km² including adjacent seas; the difference is which marginal seas are counted, and this page shows both figures rather than hiding the disagreement."}, {"q": "What is the deepest point in the Pacific?", "a": "The Challenger Deep in the Mariana Trench. Wikidata records the ocean’s maximum depth as 11,034 m; modern multibeam surveys of the Challenger Deep itself measure about 10,935 m. Both figures are shown in this page’s sources."}, {"q": "Why is it called the Pacific?", "a": "Ferdinand Magellan named it \"Mar Pacífico\" — the peaceful sea — after his fleet crossed from the stormy strait at South America’s tip into calm waters in 1520. The name stuck, however unpeaceful the typhoon belt can be."}, {"q": "What is El Niño?", "a": "A warming of the equatorial Pacific’s surface waters that recurs every few years and shifts rainfall, fisheries and storm patterns worldwide; its cool counterpart is La Niña. Together they form the El Niño–Southern Oscillation (ENSO)."}], "part_of_label": "World Ocean · the largest ocean on Earth", "season_title": "Cyclones, El Niño & the great gyres", "wiki_title": "Pacific_Ocean"}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;

-- ── Media: Pacific Ocean ──
insert into public.ocean_media
  (ocean_id, provider, file_title, file_url, page_url, width, height, licence, licence_url, author, attribution_text, role, alt_text, sort_order, verified)
select w.id, 'commons', m.file_title, m.file_url, m.page_url, m.width, m.height, m.licence, m.licence_url, m.author, m.attribution_text, m.role, m.alt_text, m.sort_order, true
from public.oceans w
cross join (values
  ('Maysak 2015-03-31 ISS.jpg', 'https://upload.wikimedia.org/wikipedia/commons/6/61/Maysak_2015-03-31_ISS.jpg', 'https://commons.wikimedia.org/wiki/File:Maysak_2015-03-31_ISS.jpg', 4928, 3280, 'Public domain', 'https://commons.wikimedia.org/wiki/Commons:Public_domain', 'Samantha Cristoforetti (ESA/NASA)', '"Maysak 2015-03-31 ISS.jpg" by Samantha Cristoforetti (ESA/NASA) — public domain, via Wikimedia Commons', 'hero', 'Typhoon Maysak over the Pacific Ocean photographed from the International Space Station', 1),
  ('ISS034-E-5426 - View of Pacific Ocean.jpg', 'https://upload.wikimedia.org/wikipedia/commons/3/37/ISS034-E-5426_-_View_of_Pacific_Ocean.jpg', 'https://commons.wikimedia.org/wiki/File:ISS034-E-5426_-_View_of_Pacific_Ocean.jpg', 4288, 2848, 'Public domain', 'https://commons.wikimedia.org/wiki/Commons:Public_domain', 'NASA Earth Science and Remote Sensing Unit', '"ISS034-E-5426 - View of Pacific Ocean.jpg" by NASA Earth Science and Remote Sensing Unit — public domain, via Wikimedia Commons', 'gallery', 'The Pacific Ocean from orbit — cloud streets over deep blue water', 2)
) as m(file_title, file_url, page_url, width, height, licence, licence_url, author, attribution_text, role, alt_text, sort_order)
where w.slug = 'pacific-ocean'
on conflict (ocean_id, file_title) do update set
  file_url = excluded.file_url, page_url = excluded.page_url, width = excluded.width,
  height = excluded.height, licence = excluded.licence, licence_url = excluded.licence_url,
  author = excluded.author, attribution_text = excluded.attribution_text,
  role = excluded.role, alt_text = excluded.alt_text, sort_order = excluded.sort_order,
  verified = excluded.verified;

-- ── Sources: Pacific Ocean ──
insert into public.ocean_sources (ocean_id, claim, source_name, source_url, checked_at)
select w.id, s.claim, s.source_name, s.source_url, s.checked_at::date
from public.oceans w
cross join (values
  ('Identity, representative point (0, −160), area 161,760,000 km², maximum depth 11,034 m', 'Wikidata — Q98 (Pacific Ocean)', 'https://www.wikidata.org/wiki/Q98', '2026-10-22'),
  ('Area including adjacent seas given as 165,250,000 km²; average depth 4,280 m; Challenger Deep modern surveys ≈10,935 m', 'Wikipedia — "Pacific Ocean" (cross-checked)', 'https://en.wikipedia.org/wiki/Pacific_Ocean', '2026-10-22'),
  ('All photographs: licence, author, dimensions', 'Wikimedia Commons — imageinfo records (per-file links in the credits)', 'https://commons.wikimedia.org/', '2026-10-22'),
  ('Live wave height, direction and period at 0°, 160° W', 'Open-Meteo Marine API', 'https://open-meteo.com/', '2026-10-22')
) as s(claim, source_name, source_url, checked_at)
where w.slug = 'pacific-ocean'
  and not exists (
    select 1 from public.ocean_sources ws
    where ws.ocean_id = w.id and ws.claim = s.claim
  );

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'atlantic-ocean', 'Atlantic Ocean', 'Q97', 'World Ocean', 0, -30, 'UTC',
  'draft', '2026-10-22',
  'Atlantic Ocean: Live Waves, Weather & Facts',
  'The Atlantic Ocean live: wave height at its equatorial point, hurricane-season frame, size and depth facts with sources shown.',
  $json$
  {"intro": ["The Atlantic Ocean is the second-largest ocean, occupying an S-shaped basin between the Americas to the west and Europe and Africa to the east. At 106,460,000 km² it covers about a fifth of the Earth’s surface, and it is — geologically — the youngest great ocean: it opened as the Americas pulled away from Europe and Africa, and it is still widening by a few centimetres a year along the Mid-Atlantic Ridge.", "That ridge, the longest mountain range on Earth, runs down the Atlantic’s spine, surfacing as Iceland, the Azores and other islands. The ocean it divides is the historic highway of the modern world — the routes of exploration, trade, migration and the first transatlantic cables and flights all crossed it — and its currents, above all the Gulf Stream, quietly set the climate of northwestern Europe.", "Its deepest point lies in the Puerto Rico Trench (the Milwaukee Deep), and its most famous season is the hurricane season, June to November, when Cape Verde storms cross the warm tropics toward the Caribbean and North America. The live block on this page samples open-ocean waves at the equator point (0°, 30° W)."], "facts": [{"label": "Part of", "value": "World Ocean", "source": "Wikidata"}, {"label": "Total area", "value": "106,460,000 km²", "source": "Wikidata"}, {"label": "Average depth", "value": "3,646 m", "source": "Wikipedia"}, {"label": "Maximum depth", "value": "8,605 m", "source": "Wikidata (see sources note)"}, {"label": "Deepest point", "value": "Milwaukee Deep, Puerto Rico Trench", "source": "Wikipedia"}, {"label": "Representative point", "value": "0°, 30° W", "source": "Wikidata"}, {"label": "Defining feature", "value": "The Mid-Atlantic Ridge — the ocean is still widening", "source": "Wikipedia"}], "geography": ["West: North and South America. East: Europe and Africa. North: the Arctic Ocean between Greenland and Scandinavia; south: the Southern Ocean from about 60° S. The equator splits it into the North and South Atlantic, whose gyres turn in opposite directions. Marginal seas include the Caribbean Sea, the Mediterranean (through Gibraltar), the North Sea, the Baltic and the Gulf of Mexico. The shortest crossing — Brazil to West Africa — is under 3,000 km; at its widest the ocean spans more than 11,000 km (Wikipedia)."], "monsoon": ["The Atlantic’s governing season is the hurricane season, officially 1 June to 30 November: warm tropical water, moist air and low wind shear let storms organise off West Africa and track west, the strongest of them curving toward the Caribbean, the Gulf of Mexico and the US coast, with a climatological peak around 10 September. Outside the season the tropical Atlantic is comparatively quiet, while winter extratropical storms take over the North Atlantic’s higher latitudes.", "The Gulf Stream is the ocean’s other standing fact: a warm, fast current flowing from Florida along North America’s coast and across toward Europe, part of the Atlantic Meridional Overturning Circulation. It carries tropical heat north-eastward on a scale that measurably warms northwestern Europe’s winters relative to its latitude."], "coastal_city": null, "faqs": [{"q": "How big is the Atlantic Ocean?", "a": "106,460,000 km² (Wikidata) — the second-largest ocean, covering roughly 20% of the Earth’s surface."}, {"q": "What is the deepest point in the Atlantic?", "a": "The Milwaukee Deep in the Puerto Rico Trench — 8,605 m on Wikidata’s record; some references give 8,376 m for the trench’s deepest sounding. This page shows the Wikidata figure with the variant recorded in its sources."}, {"q": "Is the Atlantic really getting wider?", "a": "Yes — seafloor spreading along the Mid-Atlantic Ridge pushes the Americas and Europe/Africa apart by roughly 2–5 cm a year, about the rate fingernails grow."}, {"q": "When is Atlantic hurricane season?", "a": "1 June to 30 November, with the climatological peak around 10 September. Most major hurricanes are Cape Verde-type storms that form off West Africa in August and September."}], "part_of_label": "World Ocean · between the Americas, Europe and Africa", "season_title": "Hurricane season & the Gulf Stream", "wiki_title": "Atlantic_Ocean"}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;

-- ── Media: Atlantic Ocean ──
insert into public.ocean_media
  (ocean_id, provider, file_title, file_url, page_url, width, height, licence, licence_url, author, attribution_text, role, alt_text, sort_order, verified)
select w.id, 'commons', m.file_title, m.file_url, m.page_url, m.width, m.height, m.licence, m.licence_url, m.author, m.attribution_text, m.role, m.alt_text, m.sort_order, true
from public.oceans w
cross join (values
  ('Staring Down Hurricane Florence.jpg', 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Staring_Down_Hurricane_Florence.jpg', 'https://commons.wikimedia.org/wiki/File:Staring_Down_Hurricane_Florence.jpg', 5322, 3558, 'Public domain', 'https://commons.wikimedia.org/wiki/Commons:Public_domain', 'Alexander Gerst (ESA/NASA)', '"Staring Down Hurricane Florence.jpg" by Alexander Gerst (ESA/NASA) — public domain, via Wikimedia Commons', 'hero', 'Hurricane Florence over the Atlantic Ocean seen from the International Space Station', 1),
  ('Cyclone Catarina from the ISS on March 26 2004.JPG', 'https://upload.wikimedia.org/wikipedia/commons/8/89/Cyclone_Catarina_from_the_ISS_on_March_26_2004.JPG', 'https://commons.wikimedia.org/wiki/File:Cyclone_Catarina_from_the_ISS_on_March_26_2004.JPG', 3032, 2004, 'Public domain', 'https://commons.wikimedia.org/wiki/Commons:Public_domain', 'NASA (astronaut photograph ISS008-E-19646)', '"Cyclone Catarina from the ISS on March 26 2004.JPG" by NASA — public domain, via Wikimedia Commons', 'gallery', 'Cyclone Catarina off Brazil in 2004 — the South Atlantic’s rare hurricane-strength cyclone', 2)
) as m(file_title, file_url, page_url, width, height, licence, licence_url, author, attribution_text, role, alt_text, sort_order)
where w.slug = 'atlantic-ocean'
on conflict (ocean_id, file_title) do update set
  file_url = excluded.file_url, page_url = excluded.page_url, width = excluded.width,
  height = excluded.height, licence = excluded.licence, licence_url = excluded.licence_url,
  author = excluded.author, attribution_text = excluded.attribution_text,
  role = excluded.role, alt_text = excluded.alt_text, sort_order = excluded.sort_order,
  verified = excluded.verified;

-- ── Sources: Atlantic Ocean ──
insert into public.ocean_sources (ocean_id, claim, source_name, source_url, checked_at)
select w.id, s.claim, s.source_name, s.source_url, s.checked_at::date
from public.oceans w
cross join (values
  ('Identity, representative point (0, −30), area 106,460,000 km², maximum depth 8,605 m', 'Wikidata — Q97 (Atlantic Ocean)', 'https://www.wikidata.org/wiki/Q97', '2026-10-22'),
  ('Average depth 3,646 m; Milwaukee Deep named; some references give 8,376 m for the Puerto Rico Trench', 'Wikipedia — "Atlantic Ocean" (cross-checked)', 'https://en.wikipedia.org/wiki/Atlantic_Ocean', '2026-10-22'),
  ('All photographs: licence, author, dimensions', 'Wikimedia Commons — imageinfo records (per-file links in the credits)', 'https://commons.wikimedia.org/', '2026-10-22'),
  ('Live wave height, direction and period at 0°, 30° W', 'Open-Meteo Marine API', 'https://open-meteo.com/', '2026-10-22')
) as s(claim, source_name, source_url, checked_at)
where w.slug = 'atlantic-ocean'
  and not exists (
    select 1 from public.ocean_sources ws
    where ws.ocean_id = w.id and ws.claim = s.claim
  );

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'indian-ocean', 'Indian Ocean', 'Q1239', 'World Ocean', -20, 80, 'Asia/Karachi',
  'draft', '2026-10-22',
  'Indian Ocean: Live Waves, Monsoon & Facts',
  'The Indian Ocean live: wave height today, the monsoon system explained, Karachi coastal weather, size and depth facts — every figure sourced.',
  $json$
  {"intro": ["The Indian Ocean is the third-largest ocean and the only one named after a country. It is bounded by East Africa to the west, Asia — the Arabian Peninsula, the Indian subcontinent and the Malay Peninsula — to the north, the East Indies and Australia to the east, and the Southern Ocean to the south. At 70,560,000 km² it covers about a fifth of the world’s ocean surface.", "It is the warmest ocean and the monsoon ocean: alone among the great oceans it is closed by land at tropical latitudes in the north, so its northern winds and currents reverse with the seasons — the pattern that powered two thousand years of sail trade between East Africa, Arabia, India and Southeast Asia, and that still times the rains of South Asia. Its northwestern arm, the Arabian Sea, has its own page on this site; its other great marginal seas include the Bay of Bengal, the Red Sea and the Persian Gulf.", "Its deepest measured point lies in the Java (Sunda) Trench system off Indonesia, and its floor carries the scars and ridges of the subcontinent’s long drift north from Gondwana into Asia — the collision that raised the Himalaya. Karachi, on its northern shore, is this page’s published coastal city; the live block samples open-ocean waves at the ocean’s representative point (20° S, 80° E) beside Karachi’s coastal weather."], "facts": [{"label": "Part of", "value": "World Ocean", "source": "Wikidata"}, {"label": "Total area", "value": "70,560,000 km²", "source": "Wikidata"}, {"label": "Average depth", "value": "3,741 m", "source": "Wikipedia"}, {"label": "Maximum depth", "value": "7,450 m", "source": "Wikidata (see sources note)"}, {"label": "Defining pattern", "value": "The monsoon — winds and northern currents reverse with the seasons", "source": "Wikipedia"}, {"label": "Representative point", "value": "20° S, 80° E", "source": "Wikidata"}, {"label": "Northern shore on this site", "value": "Karachi, Pakistan — its great northern port", "source": "Wikipedia"}], "geography": ["West: East Africa and the Arabian Peninsula (across the Red Sea and the Gulf of Aden). North: South Asia — Pakistan, India, Bangladesh, Myanmar. East: Thailand, Malaysia, Indonesia and Australia. South: the Southern Ocean from about 60° S. The equator crosses it, but most of its bulk lies in the southern hemisphere; its island nations and territories include Sri Lanka, the Maldives, Mauritius, Seychelles and Madagascar off Africa (Wikipedia)."], "monsoon": ["The Indian Ocean is the monsoon’s home water. In summer the Asian landmass heats faster than the ocean, winds reverse to blow from the southwest, and the Somali Current itself turns around to flow north-east — the only great ocean current that changes direction with the seasons — carrying the rains to India’s west coast. In winter the flow relaxes back to the northeast monsoon: drier winds off the land, calmer northern seas.", "That twice-yearly reversal scheduled civilisation here: dhows rode the southwest monsoon to India and waited for the northeast monsoon to carry them home to Arabia and East Africa. It still schedules the ocean today — fisheries, shipping weather windows and the South Asian rains all run on the monsoon clock, which is why this page pairs the season frame with the live wave picture rather than a static description."], "coastal_city": {"name": "Karachi", "countryName": "Pakistan", "path": "/pakistan/sindh/karachi", "lat": 24.8607, "lng": 67.0011, "timezone": "Asia/Karachi"}, "faqs": [{"q": "How big is the Indian Ocean?", "a": "70,560,000 km² (Wikidata) — the third-largest ocean, about 20% of the world’s ocean area."}, {"q": "What is the deepest point in the Indian Ocean?", "a": "Wikidata records a maximum depth of 7,450 m. The deepest surveyed point is in the Diamantina Trench area southwest of Australia, where the Five Deeps expedition measured about 7,257 m in 2019 — both figures are carried in this page’s sources rather than one being hidden."}, {"q": "Why is the Indian Ocean called the monsoon ocean?", "a": "Because its northern half is closed by Asia, its winds and currents reverse with the seasons — the southwest monsoon in summer, the northeast monsoon in winter — a pattern no other great ocean shows so completely."}, {"q": "Is the Arabian Sea part of the Indian Ocean?", "a": "Yes — the Arabian Sea is the Indian Ocean’s northwestern arm, between Arabia, Iran, Pakistan and India. It has its own dedicated page on this site with Karachi coastal coverage."}], "part_of_label": "World Ocean · the monsoon ocean", "season_title": "The monsoon ocean", "wiki_title": "Indian_Ocean"}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;

-- ── Media: Indian Ocean ──
insert into public.ocean_media
  (ocean_id, provider, file_title, file_url, page_url, width, height, licence, licence_url, author, attribution_text, role, alt_text, sort_order, verified)
select w.id, 'commons', m.file_title, m.file_url, m.page_url, m.width, m.height, m.licence, m.licence_url, m.author, m.attribution_text, m.role, m.alt_text, m.sort_order, true
from public.oceans w
cross join (values
  ('Aerial shot of a small island on a coral reef in the Maldives.jpg', 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Aerial_shot_of_a_small_island_on_a_coral_reef_in_the_Maldives.jpg', 'https://commons.wikimedia.org/wiki/File:Aerial_shot_of_a_small_island_on_a_coral_reef_in_the_Maldives.jpg', 3756, 1872, 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Dr. Ondřej Havelka', '"Aerial shot of a small island on a coral reef in the Maldives.jpg" by Dr. Ondřej Havelka — CC BY-SA 4.0, via Wikimedia Commons', 'hero', 'An aerial view of a small coral island and reef in the Maldives, Indian Ocean', 1),
  ('1 Maldives, Indian Ocean, Asia.jpg', 'https://upload.wikimedia.org/wikipedia/commons/e/eb/1_Maldives%2C_Indian_Ocean%2C_Asia.jpg', 'https://commons.wikimedia.org/wiki/File:1_Maldives,_Indian_Ocean,_Asia.jpg', 2673, 1447, 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Dr. Ondřej Havelka', '"1 Maldives, Indian Ocean, Asia.jpg" by Dr. Ondřej Havelka — CC BY-SA 4.0, via Wikimedia Commons', 'gallery', 'Palm-fringed island and turquoise shallows in the Maldives', 2)
) as m(file_title, file_url, page_url, width, height, licence, licence_url, author, attribution_text, role, alt_text, sort_order)
where w.slug = 'indian-ocean'
on conflict (ocean_id, file_title) do update set
  file_url = excluded.file_url, page_url = excluded.page_url, width = excluded.width,
  height = excluded.height, licence = excluded.licence, licence_url = excluded.licence_url,
  author = excluded.author, attribution_text = excluded.attribution_text,
  role = excluded.role, alt_text = excluded.alt_text, sort_order = excluded.sort_order,
  verified = excluded.verified;

-- ── Sources: Indian Ocean ──
insert into public.ocean_sources (ocean_id, claim, source_name, source_url, checked_at)
select w.id, s.claim, s.source_name, s.source_url, s.checked_at::date
from public.oceans w
cross join (values
  ('Identity, representative point (−20, 80), area 70,560,000 km², maximum depth 7,450 m', 'Wikidata — Q1239 (Indian Ocean)', 'https://www.wikidata.org/wiki/Q1239', '2026-10-22'),
  ('Average depth 3,741 m; Diamantina Trench Five Deeps measurement ≈7,257 m (2019)', 'Wikipedia — "Indian Ocean" (cross-checked)', 'https://en.wikipedia.org/wiki/Indian_Ocean', '2026-10-22'),
  ('All photographs: licence, author, dimensions', 'Wikimedia Commons — imageinfo records (per-file links in the credits)', 'https://commons.wikimedia.org/', '2026-10-22'),
  ('Live wave height, direction and period at 20° S, 80° E; Karachi coastal weather', 'Open-Meteo Marine & Forecast APIs', 'https://open-meteo.com/', '2026-10-22')
) as s(claim, source_name, source_url, checked_at)
where w.slug = 'indian-ocean'
  and not exists (
    select 1 from public.ocean_sources ws
    where ws.ocean_id = w.id and ws.claim = s.claim
  );

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'arctic-ocean', 'Arctic Ocean', 'Q788', 'World Ocean', 79.1386, -3.239, 'UTC',
  'draft', '2026-10-22',
  'Arctic Ocean: Live Point Data, Ice Seasons & Facts',
  'The Arctic Ocean: live data at its polar point, the sea-ice year explained, size and depth facts with sources — the smallest, shallowest, coldest ocean.',
  $json$
  {"intro": ["The Arctic Ocean is the smallest, shallowest and coldest of the great oceans — 14,056,000 km² of mostly ice-covered water around the North Pole, ringed by the northern coasts of North America, Greenland, Europe and Asia. Almost landlocked, it receives huge river inflows from Siberia and Canada, which freshen its surface layer and help its sea ice form each winter.", "Its defining fact is the ice itself: a floating cap that grows through the polar night to a March maximum of about 15 million km² and melts back to a September minimum that, in recent decades, has shrunk dramatically — the September extent has been declining at roughly 13% per decade since satellite records began in 1979 (NASA/NSIDC figures, reported in the sources below). Beneath the ice, the Lomonosov Ridge crosses from Siberia toward Greenland, and the ocean’s deepest point, the Molloy Deep, drops 5,550 m near Svalbard’s Fram Strait.", "The Arctic is warming several times faster than the global average — \"Arctic amplification\" — and its opening water is redrawing shipping maps (the Northern Sea Route and the Northwest Passage) and geopolitics alike. There is no published WorldCityHub coastal city on this ocean yet, so this page honestly carries the open-ocean panel only, sampled at the ocean’s Wikidata representative point near the pole."], "facts": [{"label": "Part of", "value": "World Ocean", "source": "Wikidata"}, {"label": "Total area", "value": "14,056,000 km²", "source": "Wikidata"}, {"label": "Average depth", "value": "1,205 m — the shallowest ocean", "source": "Wikipedia"}, {"label": "Maximum depth", "value": "5,550 m", "source": "Wikidata"}, {"label": "Deepest point", "value": "Molloy Deep, Fram Strait", "source": "Wikipedia"}, {"label": "Representative point", "value": "79.14° N, 3.24° W", "source": "Wikidata"}, {"label": "Defining feature", "value": "A floating sea-ice cap that grows and shrinks with the seasons", "source": "Wikipedia"}], "geography": ["The Arctic Ocean is ringed by the coasts of Canada, Greenland, Iceland, Norway, Russia and Alaska (USA), connected to the Pacific only by the narrow Bering Strait and to the Atlantic through the Greenland and Norwegian seas and the Canadian Arctic Archipelago’s channels. Much of its area is shallow continental shelf — the Siberian shelves are the widest on Earth — while its centre holds deep basins divided by the Lomonosov and Gakkel ridges (Wikipedia)."], "monsoon": ["No monsoon reaches the pole; the Arctic year is an ice year. From October the returning polar night lets the surface freeze outward from the coasts until the pack peaks in March; from April, 24-hour daylight works the ice back until the September minimum. River freshets in late spring push great plumes of fresh water — and the nutrients and sediments of half a continent — under and through the melting ice.", "The long trend inside that annual cycle is the story: multi-year ice has thinned and the September minimum has shrunk by roughly 13% per decade since 1979 in the satellite record. What a visitor or a ship meets in a given September now differs measurably from a generation ago — which is why this page shows the season frame as climatology and reserves its live panel for today’s measured point data."], "coastal_city": null, "faqs": [{"q": "How big is the Arctic Ocean?", "a": "14,056,000 km² (Wikidata) — the smallest of the five oceans, about a fifth the size of the Indian Ocean."}, {"q": "What is the deepest point in the Arctic Ocean?", "a": "The Molloy Deep in the Fram Strait, at 5,550 m — Wikidata’s figure, matching the Five Deeps expedition’s 2019 survey of the site."}, {"q": "Is the Arctic ice really shrinking?", "a": "The September sea-ice extent has declined at about 13% per decade since satellite monitoring began in 1979 (NASA/NSIDC). Winter ice still forms across most of the ocean each year; it is the summer minimum and the share of thick multi-year ice that are falling."}, {"q": "Which countries border the Arctic Ocean?", "a": "Canada, Denmark (via Greenland), Iceland, Norway, Russia and the United States (Alaska) — the \"Arctic Five\" littoral states plus Iceland with Arctic territory and waters."}], "part_of_label": "World Ocean · the smallest and shallowest ocean", "season_title": "The ice ocean", "wiki_title": "Arctic_Ocean"}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;

-- ── Media: Arctic Ocean ──
insert into public.ocean_media
  (ocean_id, provider, file_title, file_url, page_url, width, height, licence, licence_url, author, attribution_text, role, alt_text, sort_order, verified)
select w.id, 'commons', m.file_title, m.file_url, m.page_url, m.width, m.height, m.licence, m.licence_url, m.author, m.attribution_text, m.role, m.alt_text, m.sort_order, true
from public.oceans w
cross join (values
  ('Arctic Sea Ice Lead (7873353514).jpg', 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Arctic_Sea_Ice_Lead_%287873353514%29.jpg', 'https://commons.wikimedia.org/wiki/File:Arctic_Sea_Ice_Lead_(7873353514).jpg', 5616, 3744, 'Public domain', 'https://commons.wikimedia.org/wiki/Commons:Public_domain', 'NASA Goddard Space Flight Center', '"Arctic Sea Ice Lead (7873353514).jpg" by NASA Goddard Space Flight Center — public domain, via Wikimedia Commons', 'hero', 'A lead of open water cutting through Arctic sea ice, seen from the air', 1),
  ('Arctic sea ice varied (7873355004).jpg', 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Arctic_sea_ice_varied_%287873355004%29.jpg', 'https://commons.wikimedia.org/wiki/File:Arctic_sea_ice_varied_(7873355004).jpg', 5616, 3744, 'Public domain', 'https://commons.wikimedia.org/wiki/Commons:Public_domain', 'NASA Goddard Space Flight Center', '"Arctic sea ice varied (7873355004).jpg" by NASA Goddard Space Flight Center — public domain, via Wikimedia Commons', 'gallery', 'Varied Arctic sea-ice floes and melt ponds from above', 2)
) as m(file_title, file_url, page_url, width, height, licence, licence_url, author, attribution_text, role, alt_text, sort_order)
where w.slug = 'arctic-ocean'
on conflict (ocean_id, file_title) do update set
  file_url = excluded.file_url, page_url = excluded.page_url, width = excluded.width,
  height = excluded.height, licence = excluded.licence, licence_url = excluded.licence_url,
  author = excluded.author, attribution_text = excluded.attribution_text,
  role = excluded.role, alt_text = excluded.alt_text, sort_order = excluded.sort_order,
  verified = excluded.verified;

-- ── Sources: Arctic Ocean ──
insert into public.ocean_sources (ocean_id, claim, source_name, source_url, checked_at)
select w.id, s.claim, s.source_name, s.source_url, s.checked_at::date
from public.oceans w
cross join (values
  ('Identity, representative point, area 14,056,000 km², maximum depth 5,550 m', 'Wikidata — Q788 (Arctic Ocean)', 'https://www.wikidata.org/wiki/Q788', '2026-10-22'),
  ('Average depth 1,205 m; Molloy Deep; sea-ice cycle', 'Wikipedia — "Arctic Ocean" (cross-checked)', 'https://en.wikipedia.org/wiki/Arctic_Ocean', '2026-10-22'),
  ('September sea-ice decline ≈13% per decade since 1979', 'NASA / NSIDC sea-ice index (reported via Wikipedia)', 'https://nsidc.org/arcticseaicenews/', '2026-10-22'),
  ('All photographs: licence, author, dimensions', 'Wikimedia Commons — imageinfo records (per-file links in the credits)', 'https://commons.wikimedia.org/', '2026-10-22'),
  ('Live wave/point data at the representative point', 'Open-Meteo Marine API', 'https://open-meteo.com/', '2026-10-22')
) as s(claim, source_name, source_url, checked_at)
where w.slug = 'arctic-ocean'
  and not exists (
    select 1 from public.ocean_sources ws
    where ws.ocean_id = w.id and ws.claim = s.claim
  );

insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'southern-ocean', 'Southern Ocean', 'Q7354', 'World Ocean', -65, 90, 'UTC',
  'draft', '2026-10-22',
  'Southern Ocean: Live Waves, Facts & the Boundary Debate',
  'The Southern Ocean live: wave height at 65° S, the Antarctic Circumpolar Current, the sea-ice pulse and the honest story of its disputed boundary.',
  $json$
  {"intro": ["The Southern Ocean is the water around Antarctica — the only ocean that flows completely around the globe, driven by the Roaring Forties and Furious Fifties westerlies through the one stretch of sea with no land to stop it. Most authorities draw it south of 60° S; on that measure Wikidata records 20,327,000 km², making it the second-smallest ocean, larger than the Arctic.", "Its existence is itself a documented disagreement, and this page shows it rather than hiding it: the International Hydrographic Organization proposed the Southern Ocean in its 2000 draft limits but never formally ratified the definition, while National Geographic recognised it in 2021 and most oceanographers treat the Antarctic Convergence — where cold Antarctic water meets warmer subantarctic water — as its true, moving boundary. What is not disputed is the water: the Antarctic Circumpolar Current moves more water than any other current on Earth, connecting the Pacific, Atlantic and Indian oceans into one system.", "Twice a year the ocean performs the largest seasonal transformation on the planet: Antarctic sea ice grows outward in the austral winter until it roughly doubles the continent’s area, then retreats almost to the coast in summer. The live block on this page samples waves at its representative point (65° S, 90° E) — in the wind belt that made these latitudes a byword for the roughest seas on Earth."], "facts": [{"label": "Part of", "value": "World Ocean", "source": "Wikidata"}, {"label": "Total area", "value": "20,327,000 km² (south of 60° S)", "source": "Wikidata"}, {"label": "Average depth", "value": "3,270 m", "source": "Wikipedia"}, {"label": "Maximum depth", "value": "7,235 m", "source": "Wikidata (see sources note)"}, {"label": "Defining current", "value": "Antarctic Circumpolar Current — the strongest ocean current on Earth", "source": "Wikipedia"}, {"label": "Representative point", "value": "65° S, 90° E", "source": "Wikidata"}, {"label": "Status debate", "value": "Boundary and status not formally ratified by the IHO (2000 draft)", "source": "Wikipedia"}], "geography": ["The Southern Ocean surrounds Antarctica, touching the southern tips of South America (through the Drake Passage), Africa and Australia only at its northern fringe. It includes the great Antarctic marginal seas — Weddell, Ross, Amundsen, Bellingshausen — and island groups such as South Georgia, the South Sandwich Islands, Kerguelen and Heard Island. Its northern boundary is the honest argument described in the intro: the fixed 60° S line on charts versus the oceanographic Antarctic Convergence, which wanders between roughly 48° S and 61° S with season and longitude (Wikipedia)."], "monsoon": ["The Southern Ocean’s seasons are the ice pulse and the wind. In the austral winter the sea surface freezes outward for thousands of kilometres — Antarctic sea ice grows from about 3 million km² in February to some 18 million km² in September, the largest seasonal ice change anywhere — while the westerlies drive the Circumpolar Current and stack up some of the biggest average wave heights on the planet, in every season.", "Summer reverses the picture: the ice retreats almost to the continent, research stations and the small Antarctic tourism season open, and krill swarm in the sunlit surface waters that feed the Southern Ocean’s whales, seals and penguins. Recent years have broken the pattern’s records — Antarctic sea-ice extents set new lows in 2023 — which is recorded here as reported context, not a live figure; the live panel above is today’s measurement only."], "coastal_city": null, "faqs": [{"q": "Is the Southern Ocean officially an ocean?", "a": "It depends whose authority you ask — and this page shows the disagreement: the IHO drafted it in 2000 but never ratified the limits; the US Board on Geographic Names and National Geographic (from 2021) recognise it; many scientists use the Antarctic Convergence as its real boundary. Wikidata records it as the fifth ocean, Q7354."}, {"q": "How big is the Southern Ocean?", "a": "20,327,000 km² on the 60° S definition (Wikidata) — the second-smallest ocean, ahead of the Arctic."}, {"q": "What is the deepest point in the Southern Ocean?", "a": "Wikidata records 7,235 m. The Five Deeps expedition measured the Factorian Deep in the South Sandwich Trench at about 7,432 m in 2019 — the two figures are both carried in this page’s sources."}, {"q": "What is the Antarctic Circumpolar Current?", "a": "The strongest ocean current on Earth — a continuous eastward flow around Antarctica, unblocked by any continent, moving on the order of 130+ million cubic metres per second and linking the Pacific, Atlantic and Indian oceans."}], "part_of_label": "World Ocean · the ocean around Antarctica", "season_title": "The stormiest waters on Earth", "wiki_title": "Southern_Ocean"}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid, part_of_name = excluded.part_of_name,
  lat = excluded.lat, lng = excluded.lng, marine_timezone = excluded.marine_timezone,
  status = excluded.status, last_verified_at = excluded.last_verified_at,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, curated = excluded.curated;

-- ── Media: Southern Ocean ──
insert into public.ocean_media
  (ocean_id, provider, file_title, file_url, page_url, width, height, licence, licence_url, author, attribution_text, role, alt_text, sort_order, verified)
select w.id, 'commons', m.file_title, m.file_url, m.page_url, m.width, m.height, m.licence, m.licence_url, m.author, m.attribution_text, m.role, m.alt_text, m.sort_order, true
from public.oceans w
cross join (values
  ('South Shetland-2016-Southern Ocean (off Elephant Island)–Iceberg 01.jpg', 'https://upload.wikimedia.org/wikipedia/commons/c/ca/South_Shetland-2016-Southern_Ocean_%28off_Elephant_Island%29%E2%80%93Iceberg_01.jpg', 'https://commons.wikimedia.org/wiki/File:South_Shetland-2016-Southern_Ocean_(off_Elephant_Island)%E2%80%93Iceberg_01.jpg', 7688, 5125, 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Godot13', '"South Shetland-2016-Southern Ocean (off Elephant Island)–Iceberg 01.jpg" by Godot13 — CC BY-SA 4.0, via Wikimedia Commons', 'hero', 'An iceberg in the Southern Ocean off Elephant Island, South Shetlands', 1),
  ('Iceberg Antarctica edit1.jpg', 'https://upload.wikimedia.org/wikipedia/commons/5/56/Iceberg_Antarctica_edit1.jpg', 'https://commons.wikimedia.org/wiki/File:Iceberg_Antarctica_edit1.jpg', 3135, 2298, 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'Ben Stephenson (derivative edit by hike395)', '"Iceberg Antarctica edit1.jpg" by Ben Stephenson, derivative edit by hike395 — CC BY 2.0, via Wikimedia Commons', 'gallery', 'A sculpted blue iceberg floating in Antarctic waters', 2)
) as m(file_title, file_url, page_url, width, height, licence, licence_url, author, attribution_text, role, alt_text, sort_order)
where w.slug = 'southern-ocean'
on conflict (ocean_id, file_title) do update set
  file_url = excluded.file_url, page_url = excluded.page_url, width = excluded.width,
  height = excluded.height, licence = excluded.licence, licence_url = excluded.licence_url,
  author = excluded.author, attribution_text = excluded.attribution_text,
  role = excluded.role, alt_text = excluded.alt_text, sort_order = excluded.sort_order,
  verified = excluded.verified;

-- ── Sources: Southern Ocean ──
insert into public.ocean_sources (ocean_id, claim, source_name, source_url, checked_at)
select w.id, s.claim, s.source_name, s.source_url, s.checked_at::date
from public.oceans w
cross join (values
  ('Identity, representative point (−65, 90), area 20,327,000 km², maximum depth 7,235 m', 'Wikidata — Q7354 (Southern Ocean)', 'https://www.wikidata.org/wiki/Q7354', '2026-10-22'),
  ('Average depth 3,270 m; IHO 2000 draft never ratified; National Geographic recognition 2021; Factorian Deep ≈7,432 m (Five Deeps, 2019)', 'Wikipedia — "Southern Ocean" (cross-checked)', 'https://en.wikipedia.org/wiki/Southern_Ocean', '2026-10-22'),
  ('All photographs: licence, author, dimensions', 'Wikimedia Commons — imageinfo records (per-file links in the credits)', 'https://commons.wikimedia.org/', '2026-10-22'),
  ('Live wave height, direction and period at 65° S, 90° E', 'Open-Meteo Marine API', 'https://open-meteo.com/', '2026-10-22')
) as s(claim, source_name, source_url, checked_at)
where w.slug = 'southern-ocean'
  and not exists (
    select 1 from public.ocean_sources ws
    where ws.ocean_id = w.id and ws.claim = s.claim
  );
