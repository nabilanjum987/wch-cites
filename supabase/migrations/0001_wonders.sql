-- ════════════════════════════════════════════════════════════════════
-- 0001 — Golden Wonder data model (WP4 / marathon Q9)
-- Blueprint: wch-golden-wonder-template-blueprint-2026-10-22.md §2.
--
-- Adds to `wonders` everything the golden template needs (QID,
-- timezone, official/ticket URLs, UNESCO id/year, publish status,
-- SEO fields, curated JSONB), plus `wonder_media` (every photo a
-- record: licence, author, attribution — no record, no render) and
-- `wonder_sources` (claim → source → checked date; no source record,
-- the fact does not render).
--
-- Seeds ONE row: the Taj Mahal golden instance, from the WP2-prep
-- data pack reconciled against the blueprint and re-verified live on
-- 2026-10-22 (Wikidata Q9141, UNESCO list 252, Wikimedia Commons
-- imageinfo, tajmahal.gov.in). The site code reads this table first
-- and falls back to the identical baked dataset while this migration
-- is unapplied, so applying it changes nothing visually.
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.wonders (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text,
  city_name text,
  region_name text,
  country_name text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

alter table public.wonders
  add column if not exists wikidata_qid text,
  add column if not exists timezone text,
  add column if not exists official_url text,
  add column if not exists ticket_url text,
  add column if not exists unesco_id integer,
  add column if not exists unesco_year integer,
  add column if not exists status text not null default 'draft',
  add column if not exists last_verified_at date,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists curated jsonb not null default '{}'::jsonb,
  add column if not exists related_slugs text[] not null default '{}';

create table if not exists public.wonder_media (
  id uuid primary key default gen_random_uuid(),
  wonder_id uuid not null references public.wonders(id) on delete cascade,
  provider text not null default 'commons', -- commons / openverse / official / own
  file_title text not null,
  file_url text not null,
  page_url text,
  width integer,
  height integer,
  licence text not null,
  licence_url text,
  author text not null,
  attribution_text text not null,
  role text not null default 'gallery', -- hero / gallery / timeline / day / night / detail
  focal_x double precision,
  focal_y double precision,
  alt_text text,
  taken_at date,
  sort_order integer not null default 0,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  unique (wonder_id, file_title)
);

create table if not exists public.wonder_sources (
  id uuid primary key default gen_random_uuid(),
  wonder_id uuid not null references public.wonders(id) on delete cascade,
  claim text not null,
  source_name text not null,
  source_url text not null,
  checked_at date not null,
  created_at timestamptz not null default now()
);

alter table public.wonders enable row level security;
alter table public.wonder_media enable row level security;
alter table public.wonder_sources enable row level security;

do $$ begin
  create policy "wonders public read" on public.wonders for select using (status = 'published');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "wonder_media public read" on public.wonder_media for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "wonder_sources public read" on public.wonder_sources for select using (true);
exception when duplicate_object then null; end $$;

-- ── Seed: Taj Mahal (golden instance) ───────────────────────────────
insert into public.wonders
  (slug, name, category, city_name, region_name, country_name, lat, lng,
   wikidata_qid, timezone, official_url, ticket_url, unesco_id, unesco_year,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'taj-mahal', 'Taj Mahal', 'New7Wonders of the World', 'Agra', 'Uttar Pradesh', 'India',
  27.175, 78.041944,
  'Q9141', 'Asia/Kolkata', 'https://www.tajmahal.gov.in/', 'https://asi.payumoney.com/',
  252, 1983, 'published', '2026-10-22',
  'Taj Mahal: Live Weather, Timings, Fees & Visitor Guide',
  'Taj Mahal today: live weather, sunrise & golden hour, opening times, official ticket prices, UNESCO facts, credited photos and myth checks. Agra, India.',
  $json$
  {
    "intro": [
      "The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in Agra, Uttar Pradesh, India. It was commissioned in 1631 by the fifth Mughal emperor, Shah Jahan, to house the tomb of his late wife, Mumtaz Mahal; it also houses the tomb of Shah Jahan himself. The tomb is the centrepiece of a 17-hectare (42-acre) complex, which includes a mosque and a guest house, and is set in formal gardens bounded on three sides by a crenellated wall.",
      "UNESCO, which inscribed the Taj Mahal as World Heritage Site 252 in 1983, calls it \"the greatest architectural achievement in the whole range of Indo-Islamic architecture\". For its construction, masons, stone-cutters, inlayers, carvers, painters, calligraphers and dome builders were requisitioned from across the empire and from Central Asia and Iran, under the main architect Ustad Ahmad Lahori.",
      "Today the complex is managed by the Archaeological Survey of India. A 10,400 sq km Taj Trapezium Zone around the monument restricts polluting industry to protect the marble — one reason the live air and weather picture on this page matters to a visit, not just the history."
    ],
    "facts": [
      {"label": "Commissioned", "value": "1631, by Shah Jahan", "source": "Wikipedia / UNESCO"},
      {"label": "Built", "value": "1632–1648 (complex completed 1653)", "source": "UNESCO"},
      {"label": "Height", "value": "73 m", "source": "Wikidata"},
      {"label": "Complex area", "value": "17 hectares (42 acres)", "source": "Wikidata / UNESCO"},
      {"label": "Main material", "value": "White marble", "source": "Wikidata"},
      {"label": "Architect", "value": "Ahmad Lahori (Ustad Ahmad Lahori)", "source": "Wikidata / UNESCO"},
      {"label": "Style", "value": "Mughal · Islamic · Persian", "source": "Wikidata"},
      {"label": "UNESCO World Heritage", "value": "Site 252 · inscribed 1983 · criterion (i)", "source": "UNESCO"},
      {"label": "Visitors", "value": "6,532,366 in 2018", "source": "Wikidata"},
      {"label": "Coordinates", "value": "27.175° N, 78.0419° E", "source": "Wikidata"}
    ],
    "architecture_paragraphs": [
      "The tomb stands on a square platform at the northern end of the charbagh garden — placed at the garden’s end rather than its exact centre, an innovation UNESCO singles out for the depth and perspective it gives the distant view. The plan is in perfect bilateral symmetry along a central axis: an octagonal tomb chamber at the centre, encompassed by portal halls and four corner rooms, with four free-standing minarets framing the platform’s corners.",
      "The building is brick-in-lime mortar veneered with red sandstone and marble, the tomb itself in white marble inlaid with precious and semi-precious stones (pietra dura). Inside, an octagonal marble lattice screen of superb workmanship surrounds the cenotaphs of Mumtaz Mahal and Shah Jahan; the real graves lie in the crypt below, as in other imperial Mughal tombs. The mosque and guest house flanking the tomb are built of red sandstone in deliberate contrast."
    ],
    "genius_points": [
      "Tomb placed at the end of the quadripartite garden, not the centre — added depth and perspective (UNESCO)",
      "The raised-tomb design: the mausoleum stands on a square platform reached by a lateral flight of steps",
      "Four minarets give the edifice a three-dimensional frame and act as a spatial reference",
      "Colour play: lush green garden, reddish pathways and blue sky set the marble in ever-changing tints (UNESCO)",
      "Pietra dura inlay so fine the flowers in the stone appear almost real"
    ],
    "dimensions": [
      {"label": "Height of the mausoleum", "value": "73 m"},
      {"label": "Walled complex", "value": "17 hectares (42 acres)"},
      {"label": "Garden form", "value": "Charbagh — quadripartite, subdivided by walkways and water channels"},
      {"label": "Minarets", "value": "4, free-standing, at the platform corners"}
    ],
    "materials": ["White marble", "Red sandstone", "Brick-in-lime mortar", "Precious and semi-precious stone inlay"],
    "timeline": [
      {"year": "1631", "title": "Commissioned", "text": "Shah Jahan commissions a tomb for his wife Mumtaz Mahal on the right bank of the Yamuna in Agra.", "mediaFileTitle": "Taj Mahal, Agra, India edit3.jpg"},
      {"year": "1632", "title": "Construction begins", "text": "Work starts, drawing masons, stone-cutters, inlayers and calligraphers from across the empire, Central Asia and Iran (UNESCO)."},
      {"year": "1648", "title": "Main structures completed", "text": "The mausoleum, mosque and guest house are completed, per the UNESCO chronology.", "mediaFileTitle": "Taj Mahal (22595078173).jpg"},
      {"year": "1653", "title": "The complex is finished", "text": "The main gateway, outer courtyard and cloisters complete the walled complex (UNESCO).", "mediaFileTitle": "Taj gate.jpg"},
      {"year": "1865", "title": "Among the first photographs", "text": "Felice Beato photographs the Taj Mahal — one of the earliest photographic records of the monument.", "mediaFileTitle": "Felice Beato Taj Mahal 1865 (01).jpg"},
      {"year": "1983", "title": "UNESCO World Heritage", "text": "Inscribed on the World Heritage List as site 252 under criterion (i), a masterpiece of human creative genius.", "mediaFileTitle": "Taj Mahal (Edited).jpeg"}
    ],
    "visitor": {
      "hoursText": "Opens 30 minutes before sunrise and closes 30 minutes before sunset.",
      "closedDays": "Closed on Fridays for general viewing.",
      "fees": [
        {"visitor": "Foreign tourist", "amount": "₹1,100", "note": "+ ₹200 (optional) for the main mausoleum"},
        {"visitor": "Citizens of SAARC & BIMSTEC countries", "amount": "₹540", "note": "+ ₹200 (optional) for the main mausoleum"},
        {"visitor": "Domestic / Indian / OCI cardholder", "amount": "₹50", "note": "+ ₹200 (optional) for the main mausoleum"},
        {"visitor": "Children below 15 years", "amount": "Free", "note": "Domestic and foreign"}
      ],
      "feesNote": "Fees are inclusive of ASI & ADA charges, as published on the official site. Online tickets are discounted ₹5 (Indian) / ₹50 (foreigner) per ticket.",
      "gatesText": "Entry tickets are sold at the Western Gate (near Saheli Burj) and the Eastern Gate, from one hour before sunrise until 45 minutes before sunset. The Southern Gate is exit only. There are separate queues for foreign and domestic tourists.",
      "lastVerified": "2026-10-22",
      "sourceName": "Official Taj Mahal website (tajmahal.gov.in)",
      "sourceUrl": "https://www.tajmahal.gov.in/visiting-hours.aspx"
    },
    "myths": [
      {"claim": "Shah Jahan cut off the hands of the craftsmen so they could never build anything as beautiful again.", "verdict": "FALSE", "evidence": "No Mughal court chronicle, Persian history or contemporary traveller account mentions any such punishment — and the empire’s artisans were needed, and used, for later imperial projects. The story appears only in later popular retellings and guide lore.", "sourceName": "Historians’ consensus — no contemporary record (see Wikipedia, \"Taj Mahal\", and its references)", "sourceUrl": "https://en.wikipedia.org/wiki/Taj_Mahal"},
      {"claim": "A mirror-image \"Black Taj\" in black marble was planned across the Yamuna for Shah Jahan himself.", "verdict": "PARTLY TRUE", "evidence": "The tale traces to the 17th-century traveller Jean-Baptiste Tavernier. There IS a real riverside complex opposite — Mehtab Bagh, a moonlit garden aligned with the Taj — but Archaeological Survey of India excavations there found a garden, not the foundations of a black-marble mausoleum; the dark stones were discoloured white marble.", "sourceName": "Archaeological Survey of India excavations at Mehtab Bagh (see Wikipedia, \"Mehtab Bagh\")", "sourceUrl": "https://en.wikipedia.org/wiki/Mehtab_Bagh"},
      {"claim": "The Taj Mahal was originally a Shiva temple called \"Tejo Mahalaya\".", "verdict": "FALSE", "evidence": "The claim has been rejected by historians and by the Archaeological Survey of India, whose position is that the monument is the tomb complex built by Shah Jahan; Indian courts, including the Supreme Court of India, have dismissed petitions based on the theory. Court chronicles and inscriptions on the building itself record its construction as a mausoleum.", "sourceName": "Archaeological Survey of India; Supreme Court of India", "sourceUrl": "https://en.wikipedia.org/wiki/Taj_Mahal"},
      {"claim": "The Taj changes colour through the day — pinkish at dawn, white at noon, golden in moonlight.", "verdict": "TRUE", "evidence": "The translucent white marble takes on the light around it. UNESCO describes the colour combination of green garden, reddish pathways and blue sky as showing \"the monument in ever changing tints and moods\" — the effect visitors photograph at sunrise and sunset on this page’s golden-hour windows.", "sourceName": "UNESCO World Heritage Centre, site 252", "sourceUrl": "https://whc.unesco.org/en/list/252/"}
    ],
    "photo_spots": [
      {"name": "The Yamuna bank view", "description": "The classic postcard angle: the tomb and its reflection axis from the river side, as in our hero photograph.", "mediaFileTitle": "Taj Mahal (Edited).jpeg"},
      {"name": "Through the Great Gate", "description": "The main gateway (darwaza) frames the tomb at the end of the charbagh — arrive at opening time for the softest light.", "mediaFileTitle": "Taj gate.jpg"},
      {"name": "The fountain axis", "description": "Along the central water channel of the charbagh, looking to the Assembly Hall side of the complex.", "mediaFileTitle": "Fountain Facing Assembly Hall - Taj Mahal Complex - Agra 2014-05-14 3810.JPG"},
      {"name": "Mehtab Bagh, across the river", "description": "The moonlit garden opposite the Taj gives the sunset and moonrise view — the same alignment Shah Jahan’s planners built into the complex."}
    ],
    "faqs": [
      {"q": "What are the Taj Mahal opening hours?", "a": "The Taj Mahal opens 30 minutes before sunrise and closes 30 minutes before sunset, and it is closed on Fridays for general viewing (official site, tajmahal.gov.in). Today’s exact opening and closing times, from live sunrise and sunset data, are shown in the Quick Answer box at the top of this page."},
      {"q": "How much is a Taj Mahal ticket?", "a": "Per the official site: foreign tourists ₹1,100, citizens of SAARC and BIMSTEC countries ₹540, and Indian/domestic visitors (including OCI cardholders) ₹50 — with an optional ₹200 extra for the main mausoleum. Children under 15 enter free. Fees include ASI and ADA charges."},
      {"q": "When is the best time to visit the Taj Mahal?", "a": "At opening time, just before sunrise: the marble glows pinkish in the first light, the crowds are thinnest, and temperatures are at their coolest. This page shows today’s sunrise, sunset and golden-hour windows live, plus what to wear for today’s weather at the site."},
      {"q": "Who built the Taj Mahal, and why?", "a": "The Mughal emperor Shah Jahan commissioned it in 1631 as the tomb of his wife Mumtaz Mahal; Shah Jahan himself is also buried there. The main architect was Ustad Ahmad Lahori, and craftsmen were drawn from across the empire, Central Asia and Iran (UNESCO)."},
      {"q": "Is the Taj Mahal a UNESCO World Heritage Site?", "a": "Yes — it was inscribed in 1983 as World Heritage Site 252, under criterion (i), and UNESCO calls it the greatest architectural achievement in the whole range of Indo-Islamic architecture."}
    ],
    "nearby": [
      {"name": "Agra Fort", "relation": "UNESCO World Heritage Site in the same Taj Trapezium Zone", "lat": 27.179583, "lng": 78.021297, "url": "https://whc.unesco.org/en/list/251/", "urlLabel": "UNESCO listing"},
      {"name": "Fatehpur Sikri", "relation": "UNESCO World Heritage Site in the same Taj Trapezium Zone", "lat": 27.091111, "lng": 77.661111, "url": "https://whc.unesco.org/en/list/255/", "urlLabel": "UNESCO listing"}
    ]
  }
  $json$::jsonb,
  '{}'
)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, city_name = excluded.city_name,
  region_name = excluded.region_name, country_name = excluded.country_name,
  lat = excluded.lat, lng = excluded.lng, wikidata_qid = excluded.wikidata_qid,
  timezone = excluded.timezone, official_url = excluded.official_url,
  ticket_url = excluded.ticket_url, unesco_id = excluded.unesco_id,
  unesco_year = excluded.unesco_year, status = excluded.status,
  last_verified_at = excluded.last_verified_at, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, curated = excluded.curated;

-- ── Seed: media records (licences verified via Commons API, 2026-10-22) ──
insert into public.wonder_media
  (wonder_id, provider, file_title, file_url, page_url, width, height, licence, licence_url, author, attribution_text, role, alt_text, sort_order, verified)
select w.id, 'commons', m.file_title, m.file_url, m.page_url, m.width, m.height, m.licence, m.licence_url, m.author, m.attribution_text, m.role, m.alt_text, m.sort_order, true
from public.wonders w
cross join (values
  ('Taj Mahal (Edited).jpeg', 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg', 'https://commons.wikimedia.org/wiki/File:Taj_Mahal_(Edited).jpeg', 3840, 2525, 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Yann Forget, edited by Jim Carter', '"Taj Mahal (Edited).jpeg" by Yann Forget, edited by Jim Carter — CC BY-SA 4.0, via Wikimedia Commons', 'hero', 'The Taj Mahal seen from the Yamuna river side, its white marble dome and minarets above the garden wall', 1),
  ('Taj Mahal, Agra, India edit3.jpg', 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg', 'https://commons.wikimedia.org/wiki/File:Taj_Mahal,_Agra,_India_edit3.jpg', 3144, 2173, 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Yann Forget, edited by King of Hearts', '"Taj Mahal, Agra, India edit3.jpg" — Yann Forget, edited by King of Hearts — CC BY-SA 3.0, via Wikimedia Commons', 'gallery', 'Front view of the Taj Mahal across the charbagh garden and reflecting channel', 2),
  ('Taj gate.jpg', 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Taj_gate.jpg', 'https://commons.wikimedia.org/wiki/File:Taj_gate.jpg', 5832, 3888, 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'CR Pushpa', '"Taj gate.jpg" by CR Pushpa — CC BY-SA 4.0, via Wikimedia Commons', 'gallery', 'The Great Gate (Darwaza-i rauza) of the Taj Mahal complex, red sandstone with white marble inlay', 3),
  ('Taj Mahal (22595078173).jpg', 'https://upload.wikimedia.org/wikipedia/commons/9/94/Taj_Mahal_%2822595078173%29.jpg', 'https://commons.wikimedia.org/wiki/File:Taj_Mahal_(22595078173).jpg', 5184, 3456, 'CC0', 'https://creativecommons.org/publicdomain/zero/1.0/deed.en', 'Gary Todd', '"Taj Mahal (22595078173).jpg" by Gary Todd — CC0, via Wikimedia Commons', 'gallery', 'The Taj Mahal mausoleum with its dome and four minarets under a clear sky', 4),
  ('Fountain Facing Assembly Hall - Taj Mahal Complex - Agra 2014-05-14 3810.JPG', 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Fountain_Facing_Assembly_Hall_-_Taj_Mahal_Complex_-_Agra_2014-05-14_3810.JPG', 'https://commons.wikimedia.org/wiki/File:Fountain_Facing_Assembly_Hall_-_Taj_Mahal_Complex_-_Agra_2014-05-14_3810.JPG', 6016, 4000, 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'Biswarup Ganguly', '"Fountain Facing Assembly Hall – Taj Mahal Complex – Agra" by Biswarup Ganguly — CC BY 3.0, via Wikimedia Commons', 'gallery', 'A fountain on the central axis of the Taj Mahal charbagh garden facing the Assembly Hall', 5),
  ('Northern Octagonal Tower - West View - Assembly Hall - Taj Mahal Complex - Agra 2014-05-14 3817.JPG', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Northern_Octagonal_Tower_-_West_View_-_Assembly_Hall_-_Taj_Mahal_Complex_-_Agra_2014-05-14_3817.JPG', 'https://commons.wikimedia.org/wiki/File:Northern_Octagonal_Tower_-_West_View_-_Assembly_Hall_-_Taj_Mahal_Complex_-_Agra_2014-05-14_3817.JPG', 5677, 3775, 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'Biswarup Ganguly', '"Northern Octagonal Tower – West View – Assembly Hall – Taj Mahal Complex – Agra" by Biswarup Ganguly — CC BY 3.0, via Wikimedia Commons', 'detail', 'The northern octagonal tower of the Taj Mahal enclosure wall, west view toward the Assembly Hall', 6),
  ('Octagonal Pavilion on the enclosure wall, Taj Mahal.jpg', 'https://upload.wikimedia.org/wikipedia/commons/5/57/Octagonal_Pavilion_on_the_enclosure_wall%2C_Taj_Mahal.jpg', 'https://commons.wikimedia.org/wiki/File:Octagonal_Pavilion_on_the_enclosure_wall,_Taj_Mahal.jpg', 4928, 3264, 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Abhinay Prakash', '"Octagonal Pavilion on the enclosure wall, Taj Mahal" by Abhinay Prakash — CC BY-SA 4.0, via Wikimedia Commons', 'detail', 'An octagonal pavilion (chhatri) on the enclosure wall of the Taj Mahal complex', 7),
  ('Felice Beato Taj Mahal 1865 (01).jpg', 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Felice_Beato_Taj_Mahal_1865_%2801%29.jpg', 'https://commons.wikimedia.org/wiki/File:Felice_Beato_Taj_Mahal_1865_(01).jpg', 2536, 1976, 'Public domain', 'https://commons.wikimedia.org/wiki/Commons:Public_domain', 'Felice A. Beato', '"Felice Beato Taj Mahal 1865" by Felice A. Beato — public domain, via Wikimedia Commons', 'timeline', 'The Taj Mahal photographed by Felice Beato in 1865, among the earliest photographs of the monument', 8)
) as m(file_title, file_url, page_url, width, height, licence, licence_url, author, attribution_text, role, alt_text, sort_order)
where w.slug = 'taj-mahal'
on conflict (wonder_id, file_title) do update set
  file_url = excluded.file_url, page_url = excluded.page_url, width = excluded.width,
  height = excluded.height, licence = excluded.licence, licence_url = excluded.licence_url,
  author = excluded.author, attribution_text = excluded.attribution_text,
  role = excluded.role, alt_text = excluded.alt_text, sort_order = excluded.sort_order,
  verified = excluded.verified;

-- ── Seed: source records ────────────────────────────────────────────
insert into public.wonder_sources (wonder_id, claim, source_name, source_url, checked_at)
select w.id, s.claim, s.source_name, s.source_url, s.checked_at::date
from public.wonders w
cross join (values
  ('Identity, coordinates, height, area, material, architect, styles, official site, 2018 visitor count', 'Wikidata — Q9141 (Taj Mahal)', 'https://www.wikidata.org/wiki/Q9141', '2026-10-22'),
  ('UNESCO status, site ID 252, inscription year 1983, construction chronology 1632–1648–1653, architecture and significance', 'UNESCO World Heritage Centre — Taj Mahal (site 252)', 'https://whc.unesco.org/en/list/252/', '2026-10-22'),
  ('Commissioned 1631 by Shah Jahan for Mumtaz Mahal; 17-hectare complex; mosque and guest house', 'Wikipedia — "Taj Mahal" (REST summary, cross-checked)', 'https://en.wikipedia.org/wiki/Taj_Mahal', '2026-10-22'),
  ('Opening rule, Friday closure, ticket prices, gates and outlets', 'Official Taj Mahal website — Visiting Hours', 'https://www.tajmahal.gov.in/visiting-hours.aspx', '2026-10-22'),
  ('All photographs: licence, author, dimensions', 'Wikimedia Commons — imageinfo records (per-file links in the credits)', 'https://commons.wikimedia.org/', '2026-10-22'),
  ('Live weather, sunrise, sunset, UV and forecast at the site', 'Open-Meteo API (forecast, at 27.175, 78.041944)', 'https://open-meteo.com/', '2026-10-22'),
  ('Agra Fort and Fatehpur Sikri coordinates (nearby distances)', 'Wikidata — Q171857 (Agra Fort), Q179046 (Fatehpur Sikri)', 'https://www.wikidata.org/wiki/Q171857', '2026-10-22')
) as s(claim, source_name, source_url, checked_at)
where w.slug = 'taj-mahal'
  and not exists (
    select 1 from public.wonder_sources ws
    where ws.wonder_id = w.id and ws.claim = s.claim
  );
