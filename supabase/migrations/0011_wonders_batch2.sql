-- ════════════════════════════════════════════════════════════════════
-- 0011 — Wonder replication batch 2 (Round 2 extension, R2B)
--
-- Ten further wonders on the golden pattern of 0001/0008: Statue of
-- Liberty, Acropolis of Athens, Stonehenge, Sydney Opera House, Hagia
-- Sophia, St Peter's Basilica, Sagrada Família, Neuschwanstein Castle,
-- Grand Canyon, Great Barrier Reef. QIDs verified by description
-- match, UNESCO id/year verified at whc.unesco.org, media = Commons
-- imageinfo records — all 2026-10-22. All rows status='draft':
-- switch-on waits for billi's audit, exactly as batches before.
-- The baked BUILT_WONDERS dataset in src/lib/wonders.ts carries the
-- identical content on the branch.
-- ════════════════════════════════════════════════════════════════════

insert into public.wonders
  (slug, name, category, city_name, region_name, country_name, lat, lng,
   wikidata_qid, timezone, official_url, ticket_url, unesco_id, unesco_year,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'statue-of-liberty', 'Statue of Liberty', 'Symbolic landmark', 'New York City', 'New York', 'United States',
  40.6892, -74.0444,
  'Q9202', 'America/New_York', 'https://www.nps.gov/stli/', null,
  307, 1984, 'draft', '2026-10-22',
  'Statue of Liberty: Weather, Facts, History & Guide',
  'Statue of Liberty today: live New York Harbor weather, UNESCO facts, the Eiffel connection, credited photos and myth checks.',
  $json$
{
 "intro": [
  "The Statue of Liberty — Liberty Enlightening the World — is a colossal copper statue on Liberty Island in New York Harbor, a gift from the people of France to the United States. It was designed by the French sculptor Frédéric Auguste Bartholdi, and its internal iron armature was engineered by Gustave Eiffel — the same engineer whose tower anchors the batch before this one.",
  "Dedicated on 28 October 1886, the robed figure of Libertas holds a torch above her head in her right hand and a tablet inscribed with the date of American independence in her left. A broken chain at her feet marks the abolition of slavery, and her crown's seven rays stand for the seven seas and continents.",
  "The statue's copper skin, just 2.4 millimetres thick, weathered from a shining penny-brown to its famous green within about two decades. The National Park Service manages the monument today, and the original torch — replaced in 1986 — is displayed in the Statue of Liberty Museum on the island."
 ],
 "facts": [
  {
   "label": "Dedicated",
   "value": "28 October 1886",
   "source": "Wikipedia / NPS"
  },
  {
   "label": "Height",
   "value": "93 m, ground to torch; the statue itself is 46 m",
   "source": "NPS"
  },
  {
   "label": "Sculptor",
   "value": "Frédéric Auguste Bartholdi",
   "source": "Wikipedia"
  },
  {
   "label": "Armature engineer",
   "value": "Gustave Eiffel",
   "source": "Wikipedia / NPS"
  },
  {
   "label": "Copper skin",
   "value": "2.4 mm thick — about two pennies",
   "source": "NPS"
  },
  {
   "label": "Gift",
   "value": "From the people of France; the pedestal was funded in the United States",
   "source": "Wikipedia"
  },
  {
   "label": "UNESCO World Heritage",
   "value": "Site 307 · inscribed 1984",
   "source": "UNESCO"
  },
  {
   "label": "Coordinates",
   "value": "40.6892° N, 74.0444° W",
   "source": "Wikidata"
  }
 ],
 "architecture_paragraphs": [
  "The figure is built like a building: a central iron pylon designed by Gustave Eiffel carries a secondary framework from which the hammered-copper skin hangs, free to flex slightly in the harbour winds. Bartholdi's workshop in Paris shaped over 300 copper sheets by repoussé — hammering them into wooden moulds — before the statue was assembled in Paris, dismantled into 350 pieces, and shipped to New York in 1885.",
  "The neoclassical design dresses the Roman goddess Libertas in a stola, with a radiant crown whose spikes double as a halo of light. The pedestal, designed by the American architect Richard Morris Hunt, rises from the star-shaped Fort Wood, an early-19th-century harbour fortification whose walls form the monument's base."
 ],
 "genius_points": [
  "Iron armature by Gustave Eiffel — a bridge engineer's skeleton inside a classical statue",
  "Copper skin hung loose from the frame so wind and temperature can move it",
  "The seven crown rays represent the seven seas and continents",
  "Fort Wood's star-fort walls form the base of the pedestal"
 ],
 "dimensions": [
  {
   "label": "Height to torch",
   "value": "93 m"
  },
  {
   "label": "Statue alone",
   "value": "46 m"
  },
  {
   "label": "Copper skin thickness",
   "value": "2.4 mm"
  },
  {
   "label": "Crown windows",
   "value": "25"
  }
 ],
 "materials": [
  "Copper",
  "Wrought iron armature",
  "Granite-faced concrete pedestal"
 ],
 "timeline": [
  {
   "year": "1875",
   "title": "Construction begins in Paris",
   "text": "Bartholdi's Paris workshop starts hammering the copper sections."
  },
  {
   "year": "1884",
   "title": "Completed in Paris",
   "text": "The finished statue is formally presented to the US ambassador in Paris on 4 July 1884, then dismantled for shipping."
  },
  {
   "year": "1886",
   "title": "Dedicated in New York",
   "text": "President Grover Cleveland dedicates the statue on 28 October 1886 before a harbour crowd."
  },
  {
   "year": "1986",
   "title": "Centenary restoration",
   "text": "The statue is restored for its centenary and a new gold-leafed torch replaces the corroded original."
  }
 ],
 "visitor": {
  "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
  "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
  "fees": null,
  "feesNote": null,
  "gatesText": "Access and entry details are published by the managing authority on the official site.",
  "lastVerified": "2026-10-22",
  "sourceName": "Official site (see official_url)",
  "sourceUrl": "https://www.nps.gov/stli/"
 },
 "myths": [
  {
   "claim": "The statue was always green",
   "verdict": "FALSE",
   "evidence": "It began as bright copper — the colour of a new penny. The green patina is oxidation that formed over roughly 20 years and now protects the metal.",
   "sourceName": "Wikipedia — Statue of Liberty",
   "sourceUrl": "https://en.wikipedia.org/wiki/Statue_of_Liberty"
  },
  {
   "claim": "France paid for the whole monument",
   "verdict": "FALSE",
   "evidence": "France funded the statue; Americans had to fund the pedestal, and fundraising stalled until Joseph Pulitzer's newspaper campaign drew over 120,000 small donations.",
   "sourceName": "Wikipedia — Statue of Liberty",
   "sourceUrl": "https://en.wikipedia.org/wiki/Statue_of_Liberty"
  },
  {
   "claim": "The face is Bartholdi's mother",
   "verdict": "PARTLY TRUE",
   "evidence": "The likeness to Charlotte Bartholdi is a long-told story and the features do resemble her — but no document from the sculptor confirms the model, so it stays a story, not a record.",
   "sourceName": "Wikipedia — Statue of Liberty",
   "sourceUrl": "https://en.wikipedia.org/wiki/Statue_of_Liberty"
  },
  {
   "claim": "The torch you see is the 1886 original",
   "verdict": "FALSE",
   "evidence": "The original torch, damaged by decades of weather and modifications, was removed in 1984 and is now in the museum; the flame-tipped replacement is gilded in gold leaf.",
   "sourceName": "Wikipedia — Statue of Liberty",
   "sourceUrl": "https://en.wikipedia.org/wiki/Statue_of_Liberty"
  }
 ],
 "photo_spots": [
  {
   "name": "Statue of Liberty — hero view",
   "description": "Gallery image by Currier &amp; Ives (Public domain), via Wikimedia Commons.",
   "mediaFileTitle": "Currier and Ives Liberty2.jpg"
  }
 ],
 "faqs": [
  {
   "q": "Where is the Statue of Liberty?",
   "a": "New York City, New York, United States — at 40.6892° N, 74.0444° W (Wikidata Q9202)."
  },
  {
   "q": "Is the Statue of Liberty a UNESCO World Heritage Site?",
   "a": "Yes — inscribed in 1984 (site 307)."
  },
  {
   "q": "What is the Statue of Liberty known for?",
   "a": "The Statue of Liberty — Liberty Enlightening the World — is a colossal copper statue on Liberty Island in New York Harbor, a gift from the people of France to the United States."
  }
 ],
 "nearby": []
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, city_name = excluded.city_name,
  region_name = excluded.region_name, country_name = excluded.country_name,
  lat = excluded.lat, lng = excluded.lng, wikidata_qid = excluded.wikidata_qid,
  timezone = excluded.timezone, official_url = excluded.official_url,
  ticket_url = excluded.ticket_url, unesco_id = excluded.unesco_id,
  unesco_year = excluded.unesco_year, status = excluded.status,
  last_verified_at = excluded.last_verified_at, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.wonders
  (slug, name, category, city_name, region_name, country_name, lat, lng,
   wikidata_qid, timezone, official_url, ticket_url, unesco_id, unesco_year,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'acropolis-athens', 'Acropolis of Athens', 'Ancient site', 'Athens', 'Attica', 'Greece',
  37.9717, 23.7261,
  'Q131013', 'Europe/Athens', 'https://odysseus.culture.gr/', null,
  404, 1987, 'draft', '2026-10-22',
  'Acropolis of Athens: Weather, Facts & Visitor Guide',
  'Acropolis today: live Athens weather, Parthenon facts, UNESCO history, credited photos and myth checks. Greece.',
  $json$
{
 "intro": [
  "The Acropolis is a limestone rock rising about 156 metres above sea level in the centre of Athens, crowned by the most influential buildings of classical antiquity. Its centrepiece, the Parthenon, was built between 447 and 432 BC as the temple of Athena Parthenos, the city's patron goddess.",
  "The Periclean building programme also raised the Propylaea gateway, the Erechtheion with its famous Caryatid porch, and the small Temple of Athena Nike — a ensemble UNESCO calls the greatest architectural and artistic complex bequeathed by Greek antiquity to the world.",
  "The rock has been inhabited since the Neolithic and served as fortress, sanctuary and symbol in turn. Since 1975 a Greek state restoration programme has been dismantling and re-setting the marble buildings block by block, repairing earlier restorations and earthquake damage with new Pentelic marble and titanium."
 ],
 "facts": [
  {
   "label": "Parthenon built",
   "value": "447–432 BC",
   "source": "UNESCO / Wikipedia"
  },
  {
   "label": "Parthenon architects",
   "value": "Iktinos and Kallikrates",
   "source": "Wikipedia"
  },
  {
   "label": "Dedicated to",
   "value": "Athena Parthenos",
   "source": "Wikipedia"
  },
  {
   "label": "The rock",
   "value": "156 m above sea level",
   "source": "Wikipedia"
  },
  {
   "label": "Main material",
   "value": "Pentelic marble",
   "source": "Wikipedia"
  },
  {
   "label": "UNESCO World Heritage",
   "value": "Site 404 · inscribed 1987 · criteria (i)(ii)(iii)(iv)(vi)",
   "source": "UNESCO"
  },
  {
   "label": "Coordinates",
   "value": "37.9717° N, 23.7261° E",
   "source": "Wikidata"
  }
 ],
 "architecture_paragraphs": [
  "The Parthenon is a Doric temple of deceptive subtlety: almost nothing in it is straight. The columns swell slightly (entasis), lean inward by centimetres, and stand on a platform that curves upward toward the centre — refinements that counteract the optical illusions that would make a truly straight temple look sagging and splayed. Its 46 outer columns frame an interior that held Pheidias's colossal gold-and-ivory statue of Athena.",
  "Next door, the Erechtheion (421–406 BC) housed Athens's oldest cults and the marks of Poseidon's trident and Athena's olive; its south porch is carried by the six Caryatids — the originals are in the Acropolis Museum, one is in the British Museum."
 ],
 "genius_points": [
  "Entasis and a curved stylobate — the Parthenon corrects the eye's illusions with geometry",
  "The Parthenon sculptures were painted; the white-marble look is time, not intent",
  "The Caryatid porch: six maidens as load-bearing columns",
  "The Propylaea aligns the visitor's first view of the Parthenon at a three-quarter angle"
 ],
 "dimensions": [
  {
   "label": "Parthenon platform",
   "value": "69.5 × 30.9 m"
  },
  {
   "label": "Outer columns",
   "value": "46"
  },
  {
   "label": "Inner columns",
   "value": "23 (two tiers)"
  },
  {
   "label": "Rock height",
   "value": "156 m above sea level"
  }
 ],
 "materials": [
  "Pentelic marble",
  "Limestone foundations"
 ],
 "timeline": [
  {
   "year": "447 BC",
   "title": "Parthenon construction begins",
   "text": "Work starts under Pericles, nine years after the decision to rebuild the temples the Persians burned."
  },
  {
   "year": "432 BC",
   "title": "Parthenon complete",
   "text": "The temple and its gold-and-ivory Athena are finished; the building programme continues on the rock."
  },
  {
   "year": "1801–1812",
   "title": "Sculptures removed",
   "text": "Lord Elgin's agents remove roughly half the surviving Parthenon sculptures; most are now in the British Museum — their return remains disputed."
  },
  {
   "year": "2009",
   "title": "Acropolis Museum opens",
   "text": "The new museum at the rock's foot displays the originals, with a gallery aligned to the Parthenon itself."
  }
 ],
 "visitor": {
  "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
  "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
  "fees": null,
  "feesNote": null,
  "gatesText": "Access and entry details are published by the managing authority on the official site.",
  "lastVerified": "2026-10-22",
  "sourceName": "Official site (see official_url)",
  "sourceUrl": "https://odysseus.culture.gr/"
 },
 "myths": [
  {
   "claim": "The Parthenon is perfectly straight and regular",
   "verdict": "FALSE",
   "evidence": "Almost the opposite: columns swell and lean, the floor curves — the temple is a masterpiece of deliberate irregularity that only looks perfectly straight.",
   "sourceName": "Wikipedia — Acropolis of Athens",
   "sourceUrl": "https://en.wikipedia.org/wiki/Acropolis_of_Athens"
  },
  {
   "claim": "The marble was always gleaming white",
   "verdict": "FALSE",
   "evidence": "Traces of pigment show the sculptures and architectural details were painted in colour; the white ruin is what 2,400 years left behind.",
   "sourceName": "Wikipedia — Acropolis of Athens",
   "sourceUrl": "https://en.wikipedia.org/wiki/Acropolis_of_Athens"
  },
  {
   "claim": "The missing sculptures were destroyed in antiquity",
   "verdict": "FALSE",
   "evidence": "Most of the removed Parthenon sculptures survive — divided since the early 1800s between the Acropolis Museum in Athens and the British Museum in London, an ongoing dispute between Greece and the UK.",
   "sourceName": "Wikipedia — Acropolis of Athens",
   "sourceUrl": "https://en.wikipedia.org/wiki/Acropolis_of_Athens"
  }
 ],
 "photo_spots": [
  {
   "name": "Acropolis of Athens — hero view",
   "description": "Gallery image by Jebulon (CC0), via Wikimedia Commons.",
   "mediaFileTitle": "Acropolis Parthenon Athens Greece.jpg"
  }
 ],
 "faqs": [
  {
   "q": "Where is the Acropolis of Athens?",
   "a": "Athens, Attica, Greece — at 37.9717° N, 23.7261° E (Wikidata Q131013)."
  },
  {
   "q": "Is the Acropolis of Athens a UNESCO World Heritage Site?",
   "a": "Yes — inscribed in 1987 (site 404)."
  },
  {
   "q": "What is the Acropolis of Athens known for?",
   "a": "The Acropolis is a limestone rock rising about 156 metres above sea level in the centre of Athens, crowned by the most influential buildings of classical antiquity."
  }
 ],
 "nearby": []
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, city_name = excluded.city_name,
  region_name = excluded.region_name, country_name = excluded.country_name,
  lat = excluded.lat, lng = excluded.lng, wikidata_qid = excluded.wikidata_qid,
  timezone = excluded.timezone, official_url = excluded.official_url,
  ticket_url = excluded.ticket_url, unesco_id = excluded.unesco_id,
  unesco_year = excluded.unesco_year, status = excluded.status,
  last_verified_at = excluded.last_verified_at, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.wonders
  (slug, name, category, city_name, region_name, country_name, lat, lng,
   wikidata_qid, timezone, official_url, ticket_url, unesco_id, unesco_year,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'stonehenge', 'Stonehenge', 'Prehistoric monument', 'Amesbury', 'Wiltshire', 'United Kingdom',
  51.1789, -1.8261,
  'Q39671', 'Europe/London', 'https://www.english-heritage.org.uk/visit/places/stonehenge/', null,
  373, 1986, 'draft', '2026-10-22',
  'Stonehenge: Weather, Facts, History & Myth Checks',
  'Stonehenge today: live Wiltshire weather, the Welsh bluestones, solstice alignment, credited photos and myth checks.',
  $json$
{
 "intro": [
  "Stonehenge is a prehistoric ring of standing stones on Salisbury Plain in Wiltshire, England — the most architecturally sophisticated surviving stone circle in the world, and the most famous. Its sarsen stones, capped by lintels in a unique jointed construction, were raised around 2500 BC; the circle sits inside earthworks begun centuries earlier, around 3000 BC.",
  "The monument's bluestones came from the Preseli Hills of Wales, some 240 kilometres away, while the great sarsens — averaging 25 tonnes — were sourced from woods near Marlborough, about 25 kilometres north, a feat of Neolithic logistics settled by geological fingerprinting only in 2020.",
  "Stonehenge is part of a dense ritual landscape of avenues, barrows and cursus monuments inscribed by UNESCO together with Avebury. It is owned by the Crown, managed by English Heritage, and aligned on the solstices — the Avenue points to midsummer sunrise and midwinter sunset."
 ],
 "facts": [
  {
   "label": "Built",
   "value": "In stages, c. 3000–2000 BC",
   "source": "English Heritage / UNESCO"
  },
  {
   "label": "Sarsen stones",
   "value": "Average 25 tonnes; from West Woods, ~25 km away",
   "source": "Wikipedia / 2020 source study"
  },
  {
   "label": "Bluestones",
   "value": "From the Preseli Hills, Wales, ~240 km away",
   "source": "Wikipedia"
  },
  {
   "label": "Managed by",
   "value": "English Heritage (Crown-owned)",
   "source": "English Heritage"
  },
  {
   "label": "UNESCO World Heritage",
   "value": "Site 373 · inscribed 1986 (with Avebury)",
   "source": "UNESCO"
  },
  {
   "label": "Coordinates",
   "value": "51.1789° N, 1.8261° W",
   "source": "Wikidata"
  }
 ],
 "architecture_paragraphs": [
  "Stonehenge's builders shaped stone with stone: the sarsens were dressed with hammerstones and joined like timber — mortise holes bored into the uprights receive tenons carved on top, and the lintels lock end-to-end with tongue-and-groove joints, a carpentry logic translated into 25-tonne masonry. The outer sarsen circle, about 33 metres across, originally carried a continuous ring of lintels, of which one arc survives intact.",
  "Inside stood five great trilithons in a horseshoe, the tallest upright about 7.4 metres. The bluestones — smaller pillars of spotted dolerite and other Welsh rocks — were rearranged several times, ending in a circle and an inner oval. Cremation burials in and around the monument span centuries, making it one of Britain's largest late-Neolithic cemeteries."
 ],
 "genius_points": [
  "Timber-style joints — mortise, tenon and tongue-and-groove — executed in stone",
  "The only lintelled stone circle of its kind surviving anywhere",
  "Solstice axis: the Avenue aligns on midsummer sunrise / midwinter sunset",
  "Stones sourced from two directions — Welsh bluestones, local sarsens"
 ],
 "dimensions": [
  {
   "label": "Sarsen circle diameter",
   "value": "≈33 m"
  },
  {
   "label": "Tallest trilithon upright",
   "value": "≈7.4 m"
  },
  {
   "label": "Heaviest stones",
   "value": "≈25 tonnes (sarsens)"
  }
 ],
 "materials": [
  "Sarsen (silicified sandstone)",
  "Bluestone (dolerite and others)"
 ],
 "timeline": [
  {
   "year": "c. 3000 BC",
   "title": "First earthworks",
   "text": "A circular ditch and bank are dug on Salisbury Plain; cremation burials begin."
  },
  {
   "year": "c. 2500 BC",
   "title": "Stones raised",
   "text": "The sarsen circle and trilithons go up and the bluestones are set in their late arrangement."
  },
  {
   "year": "1986",
   "title": "World Heritage",
   "text": "UNESCO inscribes Stonehenge with Avebury and their associated sites."
  },
  {
   "year": "2013",
   "title": "Visitor centre opens",
   "text": "A new visitor centre opens 2.4 km away and the old road beside the stones is closed and grassed over."
  }
 ],
 "visitor": {
  "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
  "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
  "fees": null,
  "feesNote": null,
  "gatesText": "Access and entry details are published by the managing authority on the official site.",
  "lastVerified": "2026-10-22",
  "sourceName": "Official site (see official_url)",
  "sourceUrl": "https://www.english-heritage.org.uk/visit/places/stonehenge/"
 },
 "myths": [
  {
   "claim": "The Druids built Stonehenge",
   "verdict": "FALSE",
   "evidence": "The monument was already some 2,000 years old when Druids appear in the historical record. The Druid link was invented by 17th–18th-century antiquarians — though modern Druids do celebrate there today.",
   "sourceName": "Wikipedia — Stonehenge",
   "sourceUrl": "https://en.wikipedia.org/wiki/Stonehenge"
  },
  {
   "claim": "Merlin raised the stones by magic",
   "verdict": "FALSE",
   "evidence": "Geoffrey of Monmouth's 12th-century tale has Merlin move the stones from Ireland for King Arthur's uncle. A charming origin for the legend: the bluestones really did come from the far west — Wales, not Ireland, and by human hauling.",
   "sourceName": "Wikipedia — Stonehenge",
   "sourceUrl": "https://en.wikipedia.org/wiki/Stonehenge"
  },
  {
   "claim": "Nobody knows what it was for at all",
   "verdict": "PARTLY TRUE",
   "evidence": "Its solstice alignment and cremation cemetery are firmly evidenced, so \"ceremonial and burial landscape aligned on the sun\" is solid ground — but the full meaning to its builders is genuinely unrecoverable. Scholars state the evidence, not a single purpose.",
   "sourceName": "Wikipedia — Stonehenge",
   "sourceUrl": "https://en.wikipedia.org/wiki/Stonehenge"
  }
 ],
 "photo_spots": [
  {
   "name": "Stonehenge — hero view",
   "description": "Gallery image by PWhittle at English Wikipedia (Public domain), via Wikimedia Commons.",
   "mediaFileTitle": "Maryhill stonehenge WWI monument.jpg"
  }
 ],
 "faqs": [
  {
   "q": "Where is the Stonehenge?",
   "a": "Amesbury, Wiltshire, United Kingdom — at 51.1789° N, 1.8261° W (Wikidata Q39671)."
  },
  {
   "q": "Is the Stonehenge a UNESCO World Heritage Site?",
   "a": "Yes — inscribed in 1986 (site 373)."
  },
  {
   "q": "What is the Stonehenge known for?",
   "a": "Stonehenge is a prehistoric ring of standing stones on Salisbury Plain in Wiltshire, England — the most architecturally sophisticated surviving stone circle in the world, and the most famous."
  }
 ],
 "nearby": []
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, city_name = excluded.city_name,
  region_name = excluded.region_name, country_name = excluded.country_name,
  lat = excluded.lat, lng = excluded.lng, wikidata_qid = excluded.wikidata_qid,
  timezone = excluded.timezone, official_url = excluded.official_url,
  ticket_url = excluded.ticket_url, unesco_id = excluded.unesco_id,
  unesco_year = excluded.unesco_year, status = excluded.status,
  last_verified_at = excluded.last_verified_at, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.wonders
  (slug, name, category, city_name, region_name, country_name, lat, lng,
   wikidata_qid, timezone, official_url, ticket_url, unesco_id, unesco_year,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'sydney-opera-house', 'Sydney Opera House', 'Modern architectural icon', 'Sydney', 'New South Wales', 'Australia',
  -33.8571, 151.2149,
  'Q45178', 'Australia/Sydney', 'https://www.sydneyoperahouse.com/', null,
  166, 2007, 'draft', '2026-10-22',
  'Sydney Opera House: Weather, Facts & History',
  'Sydney Opera House today: live harbour weather, the one-sphere secret, Utzon''s story, credited photos and myth checks.',
  $json$
{
 "intro": [
  "The Sydney Opera House is a multi-venue performing arts centre at Bennelong Point on Sydney Harbour, and one of the most recognisable buildings on Earth. Its white shell vaults — universally read as sails — were designed by the Danish architect Jørn Utzon, who won the 1957 international competition with a sketch-like entry famously retrieved from the reject pile by juror Eero Saarinen.",
  "Construction began in 1959 and ran for 14 difficult years: Utzon resigned in 1966 amid cost and political disputes, and an Australian team led by Peter Hall completed the interiors. The final bill, A$102 million against a A$7 million estimate, was largely paid by a state lottery created for the purpose.",
  "Queen Elizabeth II opened the building on 20 October 1973. In 2007 UNESCO inscribed it as World Heritage Site 166 — the youngest site on the list at the time and one of very few recognised in their architect's lifetime; Utzon, who never returned to see it finished, died the following year."
 ],
 "facts": [
  {
   "label": "Opened",
   "value": "20 October 1973, by Queen Elizabeth II",
   "source": "Wikipedia"
  },
  {
   "label": "Architect",
   "value": "Jørn Utzon (1957 competition winner); interiors completed under Peter Hall",
   "source": "Wikipedia / UNESCO"
  },
  {
   "label": "Cost",
   "value": "A$102 million (estimate had been A$7 million)",
   "source": "Wikipedia"
  },
  {
   "label": "Tiles on the shells",
   "value": "1,056,006 Swedish ceramic tiles",
   "source": "Sydney Opera House"
  },
  {
   "label": "Tallest shell",
   "value": "67 m above sea level",
   "source": "Wikipedia"
  },
  {
   "label": "UNESCO World Heritage",
   "value": "Site 166 · inscribed 2007",
   "source": "UNESCO"
  },
  {
   "label": "Coordinates",
   "value": "33.8571° S, 151.2149° E",
   "source": "Wikidata"
  }
 ],
 "architecture_paragraphs": [
  "The breakthrough that made the shells buildable came in 1961: Utzon realised every shell could be cut from the surface of a single sphere, 185 metres in diameter. That one geometry let the ribs be mass-produced as precast segments from repeated moulds — a sculptural idea rescued by industrial logic. The shells rest on a vast podium that houses the two main halls in its roofline.",
  "Inside, the Concert Hall and Opera Theatre sit side by side under the two largest shell groups — a plan that forced the halls' long axes parallel to the harbour, one of the design's famous compromises. The podium's beech and white birch interiors, and Hall's completion of Utzon's concepts, give the building its warm counterpoint to the tiled exterior."
 ],
 "genius_points": [
  "All shells derived from one sphere — the geometric key to the whole building",
  "Over a million tiles that never need cleaning: rain washes the glossy/matte chevron pattern",
  "The podium contains the city: foyers, halls and services under one platform",
  "A competition sketch, fished from the rejects, became a national symbol"
 ],
 "dimensions": [
  {
   "label": "Tallest shell",
   "value": "67 m"
  },
  {
   "label": "Building length",
   "value": "185 m"
  },
  {
   "label": "Width",
   "value": "120 m"
  },
  {
   "label": "Tiles",
   "value": "1,056,006"
  }
 ],
 "materials": [
  "Precast concrete ribs",
  "Ceramic tiles (Höganäs)",
  "Glass",
  "Australian white birch and brush box"
 ],
 "timeline": [
  {
   "year": "1957",
   "title": "Utzon wins the competition",
   "text": "Jørn Utzon's entry — initially set aside — is championed by Eero Saarinen and wins."
  },
  {
   "year": "1966",
   "title": "Utzon resigns",
   "text": "After a change of government and payment disputes, Utzon resigns and leaves Australia; Peter Hall's team takes over."
  },
  {
   "year": "1973",
   "title": "Opening",
   "text": "Queen Elizabeth II opens the Sydney Opera House on 20 October 1973."
  },
  {
   "year": "2007",
   "title": "World Heritage",
   "text": "UNESCO lists the building — among the youngest sites ever inscribed, and Utzon is alive to hear it."
  }
 ],
 "visitor": {
  "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
  "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
  "fees": null,
  "feesNote": null,
  "gatesText": "Access and entry details are published by the managing authority on the official site.",
  "lastVerified": "2026-10-22",
  "sourceName": "Official site (see official_url)",
  "sourceUrl": "https://www.sydneyoperahouse.com/"
 },
 "myths": [
  {
   "claim": "The shells are sails copied from yachts",
   "verdict": "PARTLY TRUE",
   "evidence": "Utzon never confirmed a single source: peeled orange segments, Mayan platforms and the harbour's sails are all cited. What is certain is the geometry — every shell is a slice of one sphere.",
   "sourceName": "Wikipedia — Sydney Opera House",
   "sourceUrl": "https://en.wikipedia.org/wiki/Sydney_Opera_House"
  },
  {
   "claim": "Utzon was fired for incompetence",
   "verdict": "FALSE",
   "evidence": "He resigned after the new state government withheld payments and refused his fee claim amid a political fight over costs — a dispute about money and control, later widely regretted; NSW formally reconciled with him in the 1990s.",
   "sourceName": "Wikipedia — Sydney Opera House",
   "sourceUrl": "https://en.wikipedia.org/wiki/Sydney_Opera_House"
  },
  {
   "claim": "The acoustics were always perfect",
   "verdict": "FALSE",
   "evidence": "The halls' acoustics were long criticised, and the Concert Hall underwent a major renewal (completed 2022) that rebuilt its acoustic reflectors and staging — the sound today is a 2020s achievement, not a 1973 one.",
   "sourceName": "Wikipedia — Sydney Opera House",
   "sourceUrl": "https://en.wikipedia.org/wiki/Sydney_Opera_House"
  }
 ],
 "photo_spots": [
  {
   "name": "Sydney Opera House — hero view",
   "description": "Gallery image by Robertsky (CC BY-SA 4.0), via Wikimedia Commons.",
   "mediaFileTitle": "ESEAP 2022 dinner cruise - Sydney Harbour Bridge and Sydney Opera House - view from the waters.jpg"
  }
 ],
 "faqs": [
  {
   "q": "Where is the Sydney Opera House?",
   "a": "Sydney, New South Wales, Australia — at 33.8571° S, 151.2149° E (Wikidata Q45178)."
  },
  {
   "q": "Is the Sydney Opera House a UNESCO World Heritage Site?",
   "a": "Yes — inscribed in 2007 (site 166)."
  },
  {
   "q": "What is the Sydney Opera House known for?",
   "a": "The Sydney Opera House is a multi-venue performing arts centre at Bennelong Point on Sydney Harbour, and one of the most recognisable buildings on Earth."
  }
 ],
 "nearby": []
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, city_name = excluded.city_name,
  region_name = excluded.region_name, country_name = excluded.country_name,
  lat = excluded.lat, lng = excluded.lng, wikidata_qid = excluded.wikidata_qid,
  timezone = excluded.timezone, official_url = excluded.official_url,
  ticket_url = excluded.ticket_url, unesco_id = excluded.unesco_id,
  unesco_year = excluded.unesco_year, status = excluded.status,
  last_verified_at = excluded.last_verified_at, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.wonders
  (slug, name, category, city_name, region_name, country_name, lat, lng,
   wikidata_qid, timezone, official_url, ticket_url, unesco_id, unesco_year,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'hagia-sophia', 'Hagia Sophia', 'Historic religious landmark', 'Istanbul', 'Marmara', 'Turkey',
  41.0083, 28.98,
  'Q12506', 'Europe/Istanbul', 'https://muze.gov.tr/', null,
  356, 1985, 'draft', '2026-10-22',
  'Hagia Sophia: Weather, Facts, History & Guide',
  'Hagia Sophia today: live Istanbul weather, the floating dome, 1,500 years of history, credited photos and myth checks.',
  $json$
{
 "intro": [
  "Hagia Sophia — the Church of the Holy Wisdom — was built in Constantinople in just five years, from 532 to 537, on the orders of the emperor Justinian I. Its architects, Anthemius of Tralles and Isidore of Miletus, were mathematicians, and their vast dome, 31 metres across and floating on a ring of 40 windows, seemed to contemporaries to hang from heaven by a chain.",
  "For nearly a thousand years it was the largest cathedral in the world and the seat of the Ecumenical Patriarch; in 1453 it became an imperial Ottoman mosque, gaining its minarets, mihrab and great calligraphic roundels. In 1935 the Turkish Republic made it a museum, and in 2020 it returned to use as a mosque, with its Byzantine mosaics preserved under a managed covering regime during prayers.",
  "Hagia Sophia stands in Istanbul's Sultanahmet district within the Historic Areas of Istanbul, inscribed by UNESCO in 1985. Its dome-and-semi-dome cascade invented the architecture that Ottoman masters — above all Sinan, whose own tomb-side buttresses brace the building — spent centuries answering."
 ],
 "facts": [
  {
   "label": "Built",
   "value": "532–537, under Justinian I",
   "source": "Wikipedia / UNESCO"
  },
  {
   "label": "Architects",
   "value": "Anthemius of Tralles and Isidore of Miletus",
   "source": "Wikipedia"
  },
  {
   "label": "Dome",
   "value": "31 m diameter; crown 55 m above the floor",
   "source": "Wikipedia"
  },
  {
   "label": "Record",
   "value": "Largest cathedral in the world for nearly 1,000 years",
   "source": "Wikipedia"
  },
  {
   "label": "Lives",
   "value": "Cathedral (537–1453) · mosque (1453–1931) · museum (1935–2020) · mosque (2020–)",
   "source": "Wikipedia"
  },
  {
   "label": "UNESCO World Heritage",
   "value": "Within site 356, Historic Areas of Istanbul · inscribed 1985",
   "source": "UNESCO"
  },
  {
   "label": "Coordinates",
   "value": "41.0083° N, 28.98° E",
   "source": "Wikidata"
  }
 ],
 "architecture_paragraphs": [
  "The plan fuses a basilica's long nave with a central dome carried on four colossal piers through pendentives — the triangular surfaces that let a round dome sit on a square bay, perfected here at unprecedented scale. East and west, great semi-domes cascade the thrust outward, and the ring of windows at the dome's base dissolves its apparent weight: Procopius wrote that it seemed suspended from heaven.",
  "The interior layered imperial and sacred ceremony: a marble-revetted nave, galleries for the court, and over the apse the great mosaic of the Virgin and Child (inaugurated 867). Ottoman additions — Sinan's external buttresses, the sultan's lodge, the eight 7.5-metre calligraphy roundels — were absorbed without erasing the Byzantine shell, which is precisely the building's UNESCO value."
 ],
 "genius_points": [
  "Pendentives at full scale — a round dome on a square hall, solved in 537",
  "A dome that appears to float on its ring of 40 windows",
  "Semi-domes cascade the structure east and west",
  "Sinan's buttresses: the greatest Ottoman architect shoring up a Byzantine church"
 ],
 "dimensions": [
  {
   "label": "Dome diameter",
   "value": "31 m"
  },
  {
   "label": "Height to dome crown",
   "value": "55 m"
  },
  {
   "label": "Nave",
   "value": "≈74 × 70 m"
  },
  {
   "label": "Calligraphic roundels",
   "value": "7.5 m diameter"
  }
 ],
 "materials": [
  "Stone and brick",
  "Marble revetment",
  "Mosaic (gold tesserae)"
 ],
 "timeline": [
  {
   "year": "537",
   "title": "Consecrated",
   "text": "Justinian's cathedral is dedicated on 27 December 537 — legend has him say \"Solomon, I have surpassed thee.\""
  },
  {
   "year": "1453",
   "title": "Becomes a mosque",
   "text": "After the Ottoman conquest, Mehmed II converts Hagia Sophia into an imperial mosque."
  },
  {
   "year": "1935",
   "title": "Opens as a museum",
   "text": "The Turkish Republic secularises the building; it opens as a museum and the mosaics are progressively uncovered."
  },
  {
   "year": "2020",
   "title": "Mosque again",
   "text": "Hagia Sophia returns to worship as a mosque while remaining open to visitors outside prayer times."
  }
 ],
 "visitor": {
  "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
  "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
  "fees": null,
  "feesNote": null,
  "gatesText": "Access and entry details are published by the managing authority on the official site.",
  "lastVerified": "2026-10-22",
  "sourceName": "Official site (see official_url)",
  "sourceUrl": "https://muze.gov.tr/"
 },
 "myths": [
  {
   "claim": "The dome is held up by a golden chain from heaven",
   "verdict": "FALSE",
   "evidence": "A medieval description of its floating effect, not engineering: the dome is carried by pendentives and piers, and has been repaired after earthquakes many times — including a partial collapse in 558, rebuilt by Isidore the Younger.",
   "sourceName": "Wikipedia — Hagia Sophia",
   "sourceUrl": "https://en.wikipedia.org/wiki/Hagia_Sophia"
  },
  {
   "claim": "It was built as a mosque",
   "verdict": "FALSE",
   "evidence": "It was a Christian cathedral for 916 years before becoming a mosque in 1453 — the minarets, mihrab and roundels are Ottoman additions to a Byzantine church.",
   "sourceName": "Wikipedia — Hagia Sophia",
   "sourceUrl": "https://en.wikipedia.org/wiki/Hagia_Sophia"
  },
  {
   "claim": "The mosaics were destroyed",
   "verdict": "FALSE",
   "evidence": "Many were covered — plastered or veiled — rather than destroyed, which is why conservators could uncover the apse Virgin, the Deësis and imperial portraits in the 20th century; arrangements today keep them preserved outside prayer coverings.",
   "sourceName": "Wikipedia — Hagia Sophia",
   "sourceUrl": "https://en.wikipedia.org/wiki/Hagia_Sophia"
  }
 ],
 "photo_spots": [
  {
   "name": "Hagia Sophia — hero view",
   "description": "Gallery image by Laurens R. Krol (CC BY 4.0), via Wikimedia Commons.",
   "mediaFileTitle": "2017-09-01 Turkey, Istanbul DSC 3529 DxO 1 AF.jpg"
  }
 ],
 "faqs": [
  {
   "q": "Where is the Hagia Sophia?",
   "a": "Istanbul, Marmara, Turkey — at 41.0083° N, 28.98° E (Wikidata Q12506)."
  },
  {
   "q": "Is the Hagia Sophia a UNESCO World Heritage Site?",
   "a": "Yes — inscribed in 1985 (site 356)."
  },
  {
   "q": "What is the Hagia Sophia known for?",
   "a": "Hagia Sophia — the Church of the Holy Wisdom — was built in Constantinople in just five years, from 532 to 537, on the orders of the emperor Justinian I."
  }
 ],
 "nearby": []
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, city_name = excluded.city_name,
  region_name = excluded.region_name, country_name = excluded.country_name,
  lat = excluded.lat, lng = excluded.lng, wikidata_qid = excluded.wikidata_qid,
  timezone = excluded.timezone, official_url = excluded.official_url,
  ticket_url = excluded.ticket_url, unesco_id = excluded.unesco_id,
  unesco_year = excluded.unesco_year, status = excluded.status,
  last_verified_at = excluded.last_verified_at, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.wonders
  (slug, name, category, city_name, region_name, country_name, lat, lng,
   wikidata_qid, timezone, official_url, ticket_url, unesco_id, unesco_year,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'st-peters-basilica', 'St Peter''s Basilica', 'Religious landmark', 'Vatican City', 'Vatican City', 'Vatican City',
  41.9022, 12.4534,
  'Q12512', 'Europe/Rome', 'https://www.basilicasanpietro.va/', null,
  286, 1984, 'draft', '2026-10-22',
  'St Peter''s Basilica: Weather, Facts & Guide',
  'St Peter''s Basilica today: live Vatican weather, Michelangelo''s dome, Bernini''s bronze, credited photos and myth checks.',
  $json$
{
 "intro": [
  "St Peter's Basilica in Vatican City is the largest church in the world by interior measure and the centre of Roman Catholic devotion. Raised over the Constantinian basilica that stood for 1,200 years, the present church was begun in 1506 and consecrated in 1626 — a 120-year project that passed through Bramante, Raphael, Michelangelo and Bernini.",
  "Michelangelo's dome, completed after his death by Giacomo della Porta, rises 136.6 metres to the cross and remains the tallest dome in the world. Inside are Michelangelo's Pietà (carved at 24), Bernini's bronze Baldacchino over the papal altar, and beneath the altar the tomb traditionally identified as St Peter's.",
  "The basilica stands at the head of Bernini's elliptical St Peter's Square, within the Vatican City World Heritage Site (inscribed 1984). It is a pilgrimage church rather than Rome's cathedral — that honour belongs to St John Lateran — but no church on Earth receives more visitors."
 ],
 "facts": [
  {
   "label": "Built",
   "value": "1506–1626 (consecrated 18 November 1626)",
   "source": "Wikipedia"
  },
  {
   "label": "Dome",
   "value": "Designed by Michelangelo; 136.6 m to the cross — the world's tallest dome",
   "source": "Wikipedia"
  },
  {
   "label": "Interior length",
   "value": "186 m",
   "source": "Wikipedia"
  },
  {
   "label": "Capacity",
   "value": "Over 60,000 people",
   "source": "Wikipedia"
  },
  {
   "label": "Artists",
   "value": "Bramante, Michelangelo, Bernini, Maderno",
   "source": "Wikipedia"
  },
  {
   "label": "UNESCO World Heritage",
   "value": "Within site 286, Vatican City · inscribed 1984",
   "source": "UNESCO"
  },
  {
   "label": "Coordinates",
   "value": "41.9022° N, 12.4534° E",
   "source": "Wikidata"
  }
 ],
 "architecture_paragraphs": [
  "The plan is a palimpsest of Renaissance ambitions: Bramante's Greek cross, Michelangelo's tightened central plan — which governs the dome and the west end — and Maderno's extended nave and façade, added so the church could hold the crowds of the Counter-Reformation. The result reads as one overwhelming space: a barrel-vaulted nave 90 metres wide in effect, with the dome opening above the crossing.",
  "Bernini finished the interior's theatre: the Baldacchino (1624–33), a 28.7-metre twisted-column canopy in bronze partly stripped from the Pantheon's portico, and at the far end the Cathedra Petri, a gilded throne around the chair tradition assigns to St Peter, lit by an alabaster window of the Holy Spirit."
 ],
 "genius_points": [
  "Michelangelo modelled the dome on Florence's — and made it bigger",
  "The Baldacchino's bronze came in part from the Pantheon's roof",
  "Letters around the nave are 2 m tall — the scale deceives every visitor",
  "The Pietà is the only work Michelangelo ever signed"
 ],
 "dimensions": [
  {
   "label": "Height to cross",
   "value": "136.6 m"
  },
  {
   "label": "Interior length",
   "value": "186 m"
  },
  {
   "label": "Nave vault height",
   "value": "46 m"
  },
  {
   "label": "Baldacchino",
   "value": "28.7 m"
  }
 ],
 "materials": [
  "Travertine",
  "Marble",
  "Bronze",
  "Gilded stucco"
 ],
 "timeline": [
  {
   "year": "1506",
   "title": "Foundation stone",
   "text": "Julius II lays the first stone of the new basilica over the old Constantinian church."
  },
  {
   "year": "1546",
   "title": "Michelangelo takes over",
   "text": "Aged 71, Michelangelo becomes architect and designs the dome — his model still governs the silhouette."
  },
  {
   "year": "1626",
   "title": "Consecrated",
   "text": "Urban VIII consecrates the completed basilica, 1,300 years after the first."
  },
  {
   "year": "1984",
   "title": "World Heritage",
   "text": "Vatican City, basilica included, is inscribed by UNESCO."
  }
 ],
 "visitor": {
  "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
  "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
  "fees": null,
  "feesNote": null,
  "gatesText": "Access and entry details are published by the managing authority on the official site.",
  "lastVerified": "2026-10-22",
  "sourceName": "Official site (see official_url)",
  "sourceUrl": "https://www.basilicasanpietro.va/"
 },
 "myths": [
  {
   "claim": "It is the largest church ever built",
   "verdict": "TRUE",
   "evidence": "Measured by interior volume and area, yes — St Peter's is the largest church in the world. The claim needs the qualifier: some churches seat more or stand taller, but none encloses more.",
   "sourceName": "Wikipedia — St Peter's Basilica",
   "sourceUrl": "https://en.wikipedia.org/wiki/St_Peter's_Basilica"
  },
  {
   "claim": "Michelangelo painted the ceiling here",
   "verdict": "FALSE",
   "evidence": "The Sistine Chapel ceiling is a different room — the chapel is in the Apostolic Palace next door, part of the Vatican Museums route, not inside the basilica.",
   "sourceName": "Wikipedia — St Peter's Basilica",
   "sourceUrl": "https://en.wikipedia.org/wiki/St_Peter's_Basilica"
  },
  {
   "claim": "St Peter is certainly buried under the altar",
   "verdict": "PARTLY TRUE",
   "evidence": "A tomb beneath the confessio was excavated in the 1940s and bones were later identified by the Vatican as the Apostle's; scholars remain divided. The page states the tradition and the finding, not a certainty.",
   "sourceName": "Wikipedia — St Peter's Basilica",
   "sourceUrl": "https://en.wikipedia.org/wiki/St_Peter's_Basilica"
  }
 ],
 "photo_spots": [
  {
   "name": "St Peter's Basilica — hero view",
   "description": "Gallery image by NateBergin (CC BY 4.0), via Wikimedia Commons.",
   "mediaFileTitle": "01 St Peter's Basilica Facade.jpg"
  }
 ],
 "faqs": [
  {
   "q": "Where is the St Peter's Basilica?",
   "a": "Vatican City, Vatican City, Vatican City — at 41.9022° N, 12.4534° E (Wikidata Q12512)."
  },
  {
   "q": "Is the St Peter's Basilica a UNESCO World Heritage Site?",
   "a": "Yes — inscribed in 1984 (site 286)."
  },
  {
   "q": "What is the St Peter's Basilica known for?",
   "a": "St Peter's Basilica in Vatican City is the largest church in the world by interior measure and the centre of Roman Catholic devotion."
  }
 ],
 "nearby": []
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, city_name = excluded.city_name,
  region_name = excluded.region_name, country_name = excluded.country_name,
  lat = excluded.lat, lng = excluded.lng, wikidata_qid = excluded.wikidata_qid,
  timezone = excluded.timezone, official_url = excluded.official_url,
  ticket_url = excluded.ticket_url, unesco_id = excluded.unesco_id,
  unesco_year = excluded.unesco_year, status = excluded.status,
  last_verified_at = excluded.last_verified_at, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.wonders
  (slug, name, category, city_name, region_name, country_name, lat, lng,
   wikidata_qid, timezone, official_url, ticket_url, unesco_id, unesco_year,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'sagrada-familia', 'Sagrada Família', 'Architectural icon', 'Barcelona', 'Catalonia', 'Spain',
  41.4037, 2.1743,
  'Q48435', 'Europe/Madrid', 'https://sagradafamilia.org/', null,
  320, 1984, 'draft', '2026-10-22',
  'Sagrada Família: Weather, Facts & Gaudí Guide',
  'Sagrada Família today: live Barcelona weather, Gaudí''s stone forest, completion facts, credited photos and myth checks.',
  $json$
{
 "intro": [
  "The Basílica de la Sagrada Família is Antoni Gaudí's unfinished masterpiece in Barcelona's Eixample district — under construction since 1882 and, by design, a building its architect knew he would never see finished. Gaudí took over in 1883, aged 31, and devoted the last 43 years of his life to it, living on site at the end; he is buried in its crypt.",
  "Gaudí's church replaces Gothic structure with geometry drawn from nature: columns that branch like trees, hyperboloid vaults that pour light down the nave, and three grand façades — Nativity (the only one he saw substantially complete), Passion (sculpted by Subirachs) and the still-rising Glory. Pope Benedict XVI consecrated it as a basilica in 2010, with the interior complete enough for worship.",
  "When its central Tower of Jesus Christ reaches the planned 172.5 metres — just under Montjuïc hill, as Gaudí insisted man's work should not exceed God's — the Sagrada Família will be the tallest church building in the world. UNESCO inscribed the crypt and Nativity façade within the Works of Antoni Gaudí in 1984."
 ],
 "facts": [
  {
   "label": "Construction began",
   "value": "19 March 1882",
   "source": "Wikipedia / Sagrada Família"
  },
  {
   "label": "Architect",
   "value": "Antoni Gaudí (from 1883 until his death in 1926)",
   "source": "Wikipedia"
  },
  {
   "label": "Consecrated",
   "value": "7 November 2010, by Pope Benedict XVI",
   "source": "Wikipedia"
  },
  {
   "label": "Planned height",
   "value": "172.5 m (central tower)",
   "source": "Sagrada Família"
  },
  {
   "label": "Funding",
   "value": "Built entirely from donations and visitor income — no church or state money",
   "source": "Sagrada Família Foundation"
  },
  {
   "label": "UNESCO World Heritage",
   "value": "Crypt and Nativity façade within site 320, Works of Antoni Gaudí · 1984/2005",
   "source": "UNESCO"
  },
  {
   "label": "Coordinates",
   "value": "41.4037° N, 2.1743° E",
   "source": "Wikidata"
  }
 ],
 "architecture_paragraphs": [
  "Gaudí worked out the structure hanging upside-down: a weighted-string model (the funicular model) whose inverted image gives columns that lean exactly along the lines of force. Inside, the columns branch like a stone forest, splitting to carry the vaults, and hyperboloid windows wash the nave in coloured light that shifts from morning blues to evening reds across the stained glass.",
  "The building is a Bible in stone: the Nativity façade teems with life, the Passion façade is gaunt and angular, and the Glory façade — the main entrance — is still under construction. Gaudí left plaster models rather than full drawings; smashed in the Civil War, they were painstakingly reassembled, and today's builders work from the fragments, Gaudí's surviving drawings, and the geometry rules he set down."
 ],
 "genius_points": [
  "A church designed from a hanging model of strings and weights",
  "Columns that branch like trees — structure copied from a forest",
  "Morning light arrives blue-green, evening light red-gold, by design of the glass",
  "Gaudí is buried in the crypt of his own unfinished church"
 ],
 "dimensions": [
  {
   "label": "Planned central tower",
   "value": "172.5 m"
  },
  {
   "label": "Nave vault height",
   "value": "45 m"
  },
  {
   "label": "Towers planned",
   "value": "18 (12 apostles, 4 evangelists, Virgin, Jesus)"
  },
  {
   "label": "Site",
   "value": "≈12,800 m²"
  }
 ],
 "materials": [
  "Stone (Montjuïc and others)",
  "Brick",
  "Reinforced concrete (modern phases)",
  "Stained glass"
 ],
 "timeline": [
  {
   "year": "1882",
   "title": "First stone",
   "text": "Construction begins under architect Francisco de Paula del Villar; Gaudí takes over the next year."
  },
  {
   "year": "1926",
   "title": "Gaudí dies",
   "text": "Gaudí is struck by a tram and dies on 10 June 1926; he is buried in the crypt, the work roughly a quarter done."
  },
  {
   "year": "2010",
   "title": "Consecrated as a basilica",
   "text": "With the nave roofed, Benedict XVI consecrates the church for worship."
  },
  {
   "year": "2026",
   "title": "Centenary programme",
   "text": "The centenary of Gaudí's death focuses on completing the central tower — the tower of Jesus Christ topped by its cross."
  }
 ],
 "visitor": {
  "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
  "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
  "fees": null,
  "feesNote": null,
  "gatesText": "Access and entry details are published by the managing authority on the official site.",
  "lastVerified": "2026-10-22",
  "sourceName": "Official site (see official_url)",
  "sourceUrl": "https://sagradafamilia.org/"
 },
 "myths": [
  {
   "claim": "It will be finished in 2026",
   "verdict": "FALSE",
   "evidence": "2026 was a widely repeated target tied to the Gaudí centenary, and the central tower's completion is its centrepiece — but the whole church, including the Glory façade and its staircase, is a longer programme. \"Finished\" headlines should be read as tower headlines.",
   "sourceName": "Wikipedia — Sagrada Família",
   "sourceUrl": "https://en.wikipedia.org/wiki/Sagrada_Família"
  },
  {
   "claim": "Gaudí designed every part you see",
   "verdict": "FALSE",
   "evidence": "Gaudí left models and rules, not a complete design: the Passion façade's sculpture is Josep Maria Subirachs's (1987–2009), and later towers follow Gaudí's geometry executed by successor architects.",
   "sourceName": "Wikipedia — Sagrada Família",
   "sourceUrl": "https://en.wikipedia.org/wiki/Sagrada_Família"
  },
  {
   "claim": "It is Barcelona's cathedral",
   "verdict": "FALSE",
   "evidence": "Barcelona's cathedral is the Gothic Cathedral of the Holy Cross in the old town. The Sagrada Família is a basilica and parish church — an expiatory temple funded by penance and donations.",
   "sourceName": "Wikipedia — Sagrada Família",
   "sourceUrl": "https://en.wikipedia.org/wiki/Sagrada_Família"
  }
 ],
 "photo_spots": [
  {
   "name": "Sagrada Família — hero view",
   "description": "Gallery image by Didier Descouens (CC BY-SA 4.0), via Wikimedia Commons.",
   "mediaFileTitle": "(Barcelona) Armchair dissenyat per Antoni Gaudí - Sagrada Familia.jpg"
  }
 ],
 "faqs": [
  {
   "q": "Where is the Sagrada Família?",
   "a": "Barcelona, Catalonia, Spain — at 41.4037° N, 2.1743° E (Wikidata Q48435)."
  },
  {
   "q": "Is the Sagrada Família a UNESCO World Heritage Site?",
   "a": "Yes — inscribed in 1984 (site 320)."
  },
  {
   "q": "What is the Sagrada Família known for?",
   "a": "The Basílica de la Sagrada Família is Antoni Gaudí's unfinished masterpiece in Barcelona's Eixample district — under construction since 1882 and, by design, a building its architect knew he would never see finished."
  }
 ],
 "nearby": []
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, city_name = excluded.city_name,
  region_name = excluded.region_name, country_name = excluded.country_name,
  lat = excluded.lat, lng = excluded.lng, wikidata_qid = excluded.wikidata_qid,
  timezone = excluded.timezone, official_url = excluded.official_url,
  ticket_url = excluded.ticket_url, unesco_id = excluded.unesco_id,
  unesco_year = excluded.unesco_year, status = excluded.status,
  last_verified_at = excluded.last_verified_at, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.wonders
  (slug, name, category, city_name, region_name, country_name, lat, lng,
   wikidata_qid, timezone, official_url, ticket_url, unesco_id, unesco_year,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'neuschwanstein-castle', 'Neuschwanstein Castle', 'Castle landmark', 'Schwangau', 'Bavaria', 'Germany',
  47.5575, 10.7494,
  'Q4152', 'Europe/Berlin', 'https://www.neuschwanstein.de/', null,
  1726, 2025, 'draft', '2026-10-22',
  'Neuschwanstein Castle: Weather, Facts & Guide',
  'Neuschwanstein today: live Bavarian weather, Ludwig II''s 172 days, the Disney connection, photos and myth checks.',
  $json$
{
 "intro": [
  "Neuschwanstein is a 19th-century Romantic palace on a crag above the village of Hohenschwangau in southwest Bavaria, near the Austrian border. King Ludwig II of Bavaria commissioned it in 1868 as a private refuge and a stage set for the operas of Richard Wagner — its very name, and rooms like the Singers' Hall, are quotations from Lohengrin and Tannhäuser.",
  "The castle was designed not by an architect alone but by the stage designer Christian Jank, whose theatrical sketches Ludwig approved view by view. Inside, the king installed technology far ahead of the fairy-tale shell: running water and flushing toilets on every floor, a warm-air heating system, an electric bell system for servants, and one of the first mobile telephones.",
  "Ludwig lived in the castle for only 172 days before his deposition and death in 1886; weeks later it opened to paying visitors and has never closed its appeal since. In 2025 UNESCO inscribed it within The Palaces of King Ludwig II (Site 1726). Its silhouette, reworked, became the Sleeping Beauty Castle at Disneyland."
 ],
 "facts": [
  {
   "label": "Commissioned",
   "value": "1868, by King Ludwig II of Bavaria",
   "source": "Wikipedia"
  },
  {
   "label": "First stone",
   "value": "5 September 1869",
   "source": "Wikipedia"
  },
  {
   "label": "Designer",
   "value": "Christian Jank (stage designer); architects Eduard Riedel, Georg von Dollmann, Julius Hofmann",
   "source": "Wikipedia"
  },
  {
   "label": "Ludwig's residence",
   "value": "172 days in total",
   "source": "Bavarian Palace Department"
  },
  {
   "label": "Opened to the public",
   "value": "1886, weeks after Ludwig's death",
   "source": "Wikipedia"
  },
  {
   "label": "UNESCO World Heritage",
   "value": "Within site 1726, The Palaces of King Ludwig II · inscribed 2025",
   "source": "UNESCO"
  },
  {
   "label": "Coordinates",
   "value": "47.5575° N, 10.7494° E",
   "source": "Wikidata"
  }
 ],
 "architecture_paragraphs": [
  "Neuschwanstein is a medieval castle as the 19th century dreamed it: Romanesque Revival towers and oriels outside, and inside a sequence of operatic rooms — the Throne Hall in Byzantine style (its throne never installed), the Singers' Hall modelled on the Wartburg, and Ludwig's bedroom with woodcarving that took 14 carpenters over four years. Murals throughout retell Wagner's operas and the Lohengrin legend of the swan knight.",
  "The site is half the architecture: the castle occupies a narrow ridge between the Pollat gorge — spanned by the Marienbrücke, the bridge from which every famous view is taken — and the Alpsee and Schwansee lakes, with Hohenschwangau Castle, Ludwig's childhood home, in view below."
 ],
 "genius_points": [
  "A stage designer's castle — composed like opera scenery, view by view",
  "Modern systems hidden in a medieval shell: heating, running water, telephones",
  "The Singers' Hall is a full-scale tribute to Wagner",
  "The famous profile is best seen from the Marienbrücke over the Pollat gorge"
 ],
 "dimensions": [
  {
   "label": "Castle length",
   "value": "≈150 m"
  },
  {
   "label": "Gatehouse to keep",
   "value": "Five-storey main block on a narrow ridge"
  },
  {
   "label": "Visitors",
   "value": "About 1.4 million a year (pre-2020)"
  }
 ],
 "materials": [
  "Limestone (local)",
  "Marble (interiors)",
  "Brick core with stone facing"
 ],
 "timeline": [
  {
   "year": "1869",
   "title": "Foundation stone laid",
   "text": "Building starts on the ruined medieval castle site above Hohenschwangau."
  },
  {
   "year": "1884",
   "title": "Ludwig moves in",
   "text": "The king takes residence in the palace — he will spend only 172 days there in total."
  },
  {
   "year": "1886",
   "title": "Opened to visitors",
   "text": "Ludwig dies in June; by August the castle opens to the public to help pay his building debts."
  },
  {
   "year": "2025",
   "title": "World Heritage",
   "text": "UNESCO inscribes Neuschwanstein with Linderhof, Schachen and Herrenchiemsee as the Palaces of King Ludwig II."
  }
 ],
 "visitor": {
  "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
  "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
  "fees": null,
  "feesNote": null,
  "gatesText": "Access and entry details are published by the managing authority on the official site.",
  "lastVerified": "2026-10-22",
  "sourceName": "Official site (see official_url)",
  "sourceUrl": "https://www.neuschwanstein.de/"
 },
 "myths": [
  {
   "claim": "Disney's castle is an exact copy",
   "verdict": "FALSE",
   "evidence": "Walt Disney visited Neuschwanstein in the 1930s and the Sleeping Beauty Castle at Disneyland (1955) was modelled on its silhouette — inspiration, freely adapted, not a replica.",
   "sourceName": "Wikipedia — Neuschwanstein Castle",
   "sourceUrl": "https://en.wikipedia.org/wiki/Neuschwanstein_Castle"
  },
  {
   "claim": "Ludwig built it as a public palace for affairs of state",
   "verdict": "FALSE",
   "evidence": "It was a private retreat for a king who increasingly avoided Munich and government; state business was the last thing it was for.",
   "sourceName": "Wikipedia — Neuschwanstein Castle",
   "sourceUrl": "https://en.wikipedia.org/wiki/Neuschwanstein_Castle"
  },
  {
   "claim": "It bankrupted Bavaria",
   "verdict": "FALSE",
   "evidence": "Ludwig funded his castles from his own civil list and loans, not the state treasury — but his personal debts were real: creditors' pressure was among the triggers of his 1886 deposition.",
   "sourceName": "Wikipedia — Neuschwanstein Castle",
   "sourceUrl": "https://en.wikipedia.org/wiki/Neuschwanstein_Castle"
  }
 ],
 "photo_spots": [
  {
   "name": "Neuschwanstein Castle — hero view",
   "description": "Gallery image by Llez (CC BY-SA 3.0), via Wikimedia Commons.",
   "mediaFileTitle": "Alpsee - Hohenschwangau Castle - Alpenrose - Neuschwanstein Castle 01.jpg"
  }
 ],
 "faqs": [
  {
   "q": "Where is the Neuschwanstein Castle?",
   "a": "Schwangau, Bavaria, Germany — at 47.5575° N, 10.7494° E (Wikidata Q4152)."
  },
  {
   "q": "Is the Neuschwanstein Castle a UNESCO World Heritage Site?",
   "a": "Yes — inscribed in 2025 (site 1726)."
  },
  {
   "q": "What is the Neuschwanstein Castle known for?",
   "a": "Neuschwanstein is a 19th-century Romantic palace on a crag above the village of Hohenschwangau in southwest Bavaria, near the Austrian border."
  }
 ],
 "nearby": []
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, city_name = excluded.city_name,
  region_name = excluded.region_name, country_name = excluded.country_name,
  lat = excluded.lat, lng = excluded.lng, wikidata_qid = excluded.wikidata_qid,
  timezone = excluded.timezone, official_url = excluded.official_url,
  ticket_url = excluded.ticket_url, unesco_id = excluded.unesco_id,
  unesco_year = excluded.unesco_year, status = excluded.status,
  last_verified_at = excluded.last_verified_at, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.wonders
  (slug, name, category, city_name, region_name, country_name, lat, lng,
   wikidata_qid, timezone, official_url, ticket_url, unesco_id, unesco_year,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'grand-canyon', 'Grand Canyon', 'Natural wonder', 'Grand Canyon Village', 'Arizona', 'United States',
  36.0975, -112.0953,
  'Q118841', 'America/Phoenix', 'https://www.nps.gov/grca/', null,
  75, 1979, 'draft', '2026-10-22',
  'Grand Canyon: Weather, Facts, Depth & Guide',
  'Grand Canyon today: live rim weather, true depth, two-billion-year rocks, credited photos and myth checks. Arizona.',
  $json$
{
 "intro": [
  "The Grand Canyon is a mile-deep gorge carved by the Colorado River through the Colorado Plateau in northern Arizona: 446 kilometres long, up to 29 kilometres wide, and up to 1,857 metres deep. Its exposed rock layers read like a book of Earth's history, from 270-million-year-old Kaibab limestone at the rim to Vishnu schist at the river dated near 1.8 billion years.",
  "The canyon sits within Grand Canyon National Park, protected first as a national monument by Theodore Roosevelt in 1908 — he called it \"the one great sight which every American should see\" — and as a national park from 1919. Most visitors see it from the South Rim, open all year; the higher, quieter North Rim is seasonal.",
  "UNESCO inscribed the park in 1979. The canyon is the ancestral homeland of 11 Native American tribes with historic associations, including the Havasupai and Hualapai — the latter operate the Skywalk glass bridge on tribal land west of the park boundary."
 ],
 "facts": [
  {
   "label": "Length",
   "value": "446 km (277 mi)",
   "source": "NPS"
  },
  {
   "label": "Width",
   "value": "Up to 29 km (18 mi)",
   "source": "NPS"
  },
  {
   "label": "Maximum depth",
   "value": "1,857 m (6,093 ft)",
   "source": "NPS"
  },
  {
   "label": "River",
   "value": "Colorado River",
   "source": "NPS"
  },
  {
   "label": "Oldest rocks",
   "value": "Vishnu schist, ≈1.8 billion years",
   "source": "NPS / USGS"
  },
  {
   "label": "Protection",
   "value": "National monument 1908; national park 1919",
   "source": "NPS"
  },
  {
   "label": "UNESCO World Heritage",
   "value": "Site 75 · inscribed 1979",
   "source": "UNESCO"
  },
  {
   "label": "Coordinates",
   "value": "36.0975° N, 112.0953° W",
   "source": "Wikidata"
  }
 ],
 "architecture_paragraphs": [
  "There is no architect here — the structure is stratigraphy. The canyon's staircase profile comes from alternating hard and soft rock: cliff-forming Kaibab limestone and Coconino sandstone stand in walls, while soft shales (Bright Angel, Hermit) erode into slopes and platforms like the Tonto. The river did the cutting, but the plateau did half the work by rising: as the Colorado Plateau uplifted over the last tens of millions of years, the river held its course and incised downward.",
  "The main canyon is young by geological standards — most evidence dates its carving to the last 5–6 million years, though some segments may be far older, a live scientific debate. Side canyons, temples (buttes named for world deities by Clarence Dutton) and rapids grade the descent from rim to river."
 ],
 "genius_points": [
  "A layer-cake of nearly two billion years of rock history",
  "Hard layers make cliffs, soft layers make slopes — the whole shape explained",
  "The canyon is still widening faster than it deepens",
  "Named viewpoints frame \"temples\" — buttes named after gods and myths"
 ],
 "dimensions": [
  {
   "label": "Length",
   "value": "446 km"
  },
  {
   "label": "Maximum depth",
   "value": "1,857 m"
  },
  {
   "label": "Width range",
   "value": "6.4–29 km"
  },
  {
   "label": "River elevation",
   "value": "≈670 m at Lees Ferry"
  }
 ],
 "materials": [
  "Kaibab limestone",
  "Coconino sandstone",
  "Redwall limestone",
  "Vishnu schist"
 ],
 "timeline": [
  {
   "year": "1908",
   "title": "National monument",
   "text": "President Theodore Roosevelt proclaims Grand Canyon National Monument."
  },
  {
   "year": "1919",
   "title": "National park",
   "text": "Congress establishes Grand Canyon National Park."
  },
  {
   "year": "1979",
   "title": "World Heritage",
   "text": "UNESCO inscribes the park as a World Heritage Site."
  },
  {
   "year": "2019",
   "title": "Centenary",
   "text": "The park marks 100 years; annual visitation stands around six million in peak years (NPS)."
  }
 ],
 "visitor": {
  "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
  "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
  "fees": null,
  "feesNote": null,
  "gatesText": "Access and entry details are published by the managing authority on the official site.",
  "lastVerified": "2026-10-22",
  "sourceName": "Official site (see official_url)",
  "sourceUrl": "https://www.nps.gov/grca/"
 },
 "myths": [
  {
   "claim": "It is the deepest canyon in the world",
   "verdict": "FALSE",
   "evidence": "The Grand Canyon's 1,857 m is not the record: Nepal's Kali Gandaki gorge and the Yarlung Tsangpo gorge in Tibet are deeper. The Grand Canyon's claim is scale, colour and exposed geology — not the depth title.",
   "sourceName": "Wikipedia — Grand Canyon",
   "sourceUrl": "https://en.wikipedia.org/wiki/Grand_Canyon"
  },
  {
   "claim": "The Colorado River carved it over billions of years",
   "verdict": "FALSE",
   "evidence": "The rocks are billions of years old in part, but the canyon itself is young: mainstream evidence puts most carving in the last 5–6 million years — the river is fast when the land rises under it.",
   "sourceName": "Wikipedia — Grand Canyon",
   "sourceUrl": "https://en.wikipedia.org/wiki/Grand_Canyon"
  },
  {
   "claim": "You can see it from the Moon",
   "verdict": "FALSE",
   "evidence": "Astronauts can pick it out from low Earth orbit in good light, but from the Moon — 1,000 times farther — the canyon is far below the limit of the naked eye.",
   "sourceName": "Wikipedia — Grand Canyon",
   "sourceUrl": "https://en.wikipedia.org/wiki/Grand_Canyon"
  }
 ],
 "photo_spots": [
  {
   "name": "Grand Canyon — hero view",
   "description": "Gallery image by Dietmar Rabich (CC BY-SA 4.0), via Wikimedia Commons.",
   "mediaFileTitle": "Grand Canyon (Arizona, USA), South Rim nahe Tusayan -- 2012 -- 5771.jpg"
  }
 ],
 "faqs": [
  {
   "q": "Where is the Grand Canyon?",
   "a": "Grand Canyon Village, Arizona, United States — at 36.0975° N, 112.0953° W (Wikidata Q118841)."
  },
  {
   "q": "Is the Grand Canyon a UNESCO World Heritage Site?",
   "a": "Yes — inscribed in 1979 (site 75)."
  },
  {
   "q": "What is the Grand Canyon known for?",
   "a": "The Grand Canyon is a mile-deep gorge carved by the Colorado River through the Colorado Plateau in northern Arizona: 446 kilometres long, up to 29 kilometres wide, and up to 1,857 metres deep."
  }
 ],
 "nearby": []
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, city_name = excluded.city_name,
  region_name = excluded.region_name, country_name = excluded.country_name,
  lat = excluded.lat, lng = excluded.lng, wikidata_qid = excluded.wikidata_qid,
  timezone = excluded.timezone, official_url = excluded.official_url,
  ticket_url = excluded.ticket_url, unesco_id = excluded.unesco_id,
  unesco_year = excluded.unesco_year, status = excluded.status,
  last_verified_at = excluded.last_verified_at, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, curated = excluded.curated;

insert into public.wonders
  (slug, name, category, city_name, region_name, country_name, lat, lng,
   wikidata_qid, timezone, official_url, ticket_url, unesco_id, unesco_year,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'great-barrier-reef', 'Great Barrier Reef', 'Natural wonder', 'Cairns', 'Queensland', 'Australia',
  -16.4, 145.8,
  'Q7343', 'Australia/Brisbane', 'https://www2.gbrmpa.gov.au/', null,
  154, 1981, 'draft', '2026-10-22',
  'Great Barrier Reef: Weather, Facts & Health',
  'Great Barrier Reef today: live Queensland weather, reef facts, bleaching record, credited photos and myth checks.',
  $json$
{
 "intro": [
  "The Great Barrier Reef is the world's largest coral reef system and the largest living structure on Earth: some 2,300 kilometres of reef along Queensland's coast, made of roughly 2,900 individual reefs and 900 islands spread over about 344,400 square kilometres of the Coral Sea. It is not one reef but a mosaic — fringing reefs, ribbon reefs, lagoons and coral cays built by billions of tiny polyps over thousands of years.",
  "The system supports extraordinary biodiversity: around 1,500 species of fish, 400-plus hard corals, dugongs, six of the world's seven sea turtles, and seasonal humpback whale nurseries. The Great Barrier Reef Marine Park, declared in 1975, zones the whole area; UNESCO inscribed it in 1981.",
  "The reef is also the sea country of Aboriginal and Torres Strait Islander peoples whose connection runs back tens of thousands of years. Its modern story includes mass coral bleaching events driven by marine heatwaves (2016, 2017, 2020, 2022, 2024 and a further widespread event reported in 2025) — severe damage, monitored reef by reef, but not a death certificate: recovery between events is documented where local pressures are controlled."
 ],
 "facts": [
  {
   "label": "Length",
   "value": "≈2,300 km",
   "source": "GBRMPA"
  },
  {
   "label": "Area",
   "value": "≈344,400 km²",
   "source": "GBRMPA"
  },
  {
   "label": "Structure",
   "value": "≈2,900 reefs and 900 islands",
   "source": "GBRMPA"
  },
  {
   "label": "Fish species",
   "value": "≈1,500",
   "source": "GBRMPA"
  },
  {
   "label": "Marine park",
   "value": "Declared 1975",
   "source": "GBRMPA"
  },
  {
   "label": "UNESCO World Heritage",
   "value": "Site 154 · inscribed 1981",
   "source": "UNESCO"
  },
  {
   "label": "Coordinates",
   "value": "16.4° S, 145.8° E",
   "source": "Wikidata"
  }
 ],
 "architecture_paragraphs": [
  "A coral reef is architecture by accretion: each polyp secretes a limestone cup, colonies stack over millennia, and storms and grazers break and cement the rubble into reef. The present reef is young — it grew over the last 6,000–8,000 years as sea level rose after the last ice age and flooded a coastal plain; the limestone beneath it records older reefs going back far longer.",
  "From the coast outward: fringing reefs hug islands and shore, patch reefs dot the lagoon, and at the continental shelf edge the outer ribbon reefs face the Coral Sea in an almost unbroken barrier. Between them run channels and the world's largest green-turtle and seabird rookeries on cays of pure coral sand."
 ],
 "genius_points": [
  "The largest structure built by living organisms — billions of polyps, one system",
  "The visible reef is a thin living skin on ancient limestone",
  "Ribbon reefs wall the shelf edge; the lagoon behind is a sheltered sea",
  "Heart Reef is natural — a coral formation, not a planted shape"
 ],
 "dimensions": [
  {
   "label": "Length",
   "value": "≈2,300 km"
  },
  {
   "label": "Area",
   "value": "≈344,400 km²"
  },
  {
   "label": "Reefs",
   "value": "≈2,900"
  },
  {
   "label": "Islands and cays",
   "value": "≈900"
  }
 ],
 "materials": [
  "Coral limestone (aragonite)",
  "Coralline algae",
  "Coral sand"
 ],
 "timeline": [
  {
   "year": "1975",
   "title": "Marine Park declared",
   "text": "Australia creates the Great Barrier Reef Marine Park Authority and the park."
  },
  {
   "year": "1981",
   "title": "World Heritage",
   "text": "UNESCO inscribes the reef — nearly the entire ecosystem in one listing."
  },
  {
   "year": "2016–2017",
   "title": "Back-to-back bleaching",
   "text": "Two consecutive mass bleaching events strike, the first back-to-back pair on record."
  },
  {
   "year": "2024–2025",
   "title": "Further mass bleaching",
   "text": "Another widespread event is reported across 2024–25, underlining the reef's heat exposure."
  }
 ],
 "visitor": {
  "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
  "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
  "fees": null,
  "feesNote": null,
  "gatesText": "Access and entry details are published by the managing authority on the official site.",
  "lastVerified": "2026-10-22",
  "sourceName": "Official site (see official_url)",
  "sourceUrl": "https://www2.gbrmpa.gov.au/"
 },
 "myths": [
  {
   "claim": "The reef is a single organism",
   "verdict": "FALSE",
   "evidence": "It is an ecosystem of thousands of reefs and billions of individual coral colonies of hundreds of species — vast, connected, but not one creature.",
   "sourceName": "Wikipedia — Great Barrier Reef",
   "sourceUrl": "https://en.wikipedia.org/wiki/Great_Barrier_Reef"
  },
  {
   "claim": "The reef is dead",
   "verdict": "FALSE",
   "evidence": "Mass bleachings have killed large areas of coral, especially in the north in 2016–17, and the threat is real and continuing. But monitoring shows substantial living reef and documented recovery in many sectors — \"dying in places, alive in others, and worth fighting for\" is the scientific summary, not \"dead\".",
   "sourceName": "Wikipedia — Great Barrier Reef",
   "sourceUrl": "https://en.wikipedia.org/wiki/Great_Barrier_Reef"
  },
  {
   "claim": "You can see it from the Moon",
   "verdict": "FALSE",
   "evidence": "Like the Grand Canyon claim, this one fails on distance: the reef is visible from low Earth orbit, but at lunar distance nothing of its scale resolves to the naked eye.",
   "sourceName": "Wikipedia — Great Barrier Reef",
   "sourceUrl": "https://en.wikipedia.org/wiki/Great_Barrier_Reef"
  }
 ],
 "photo_spots": [
  {
   "name": "Great Barrier Reef — hero view",
   "description": "Gallery image by Ank Kumar (CC BY-SA 4.0), via Wikimedia Commons.",
   "mediaFileTitle": "Aerial View of Great Barrier Reef, Queensland (Ank Kumar) 01.jpg"
  }
 ],
 "faqs": [
  {
   "q": "Where is the Great Barrier Reef?",
   "a": "Cairns, Queensland, Australia — at 16.4° S, 145.8° E (Wikidata Q7343)."
  },
  {
   "q": "Is the Great Barrier Reef a UNESCO World Heritage Site?",
   "a": "Yes — inscribed in 1981 (site 154)."
  },
  {
   "q": "What is the Great Barrier Reef known for?",
   "a": "The Great Barrier Reef is the world's largest coral reef system and the largest living structure on Earth: some 2,300 kilometres of reef along Queensland's coast, made of roughly 2,900 individual reefs and 900 islands spread over about 344,400 square kilometres of the Coral Sea."
  }
 ],
 "nearby": []
}
  $json$::jsonb,
  '{}')
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, city_name = excluded.city_name,
  region_name = excluded.region_name, country_name = excluded.country_name,
  lat = excluded.lat, lng = excluded.lng, wikidata_qid = excluded.wikidata_qid,
  timezone = excluded.timezone, official_url = excluded.official_url,
  ticket_url = excluded.ticket_url, unesco_id = excluded.unesco_id,
  unesco_year = excluded.unesco_year, status = excluded.status,
  last_verified_at = excluded.last_verified_at, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, curated = excluded.curated;
