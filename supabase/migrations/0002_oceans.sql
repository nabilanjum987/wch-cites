-- ════════════════════════════════════════════════════════════════════
-- 0002 — Golden Ocean data model (WP5 / marathon Q10)
-- Mirrors 0001 (wonders) exactly: `oceans` + `ocean_media` +
-- `ocean_sources`. Rule, same as wonders: no source record → the
-- fact does not render; no licence record → the image does not
-- render.
--
-- Seeds ONE row: the Arabian Sea golden instance, verified live on
-- 2026-10-22 — Wikidata Q58705 (matched on its description
-- "marginal sea of the northern Indian Ocean"; the first name-search
-- hit is a ship of the same name, Q105767867, and was rejected),
-- Wikipedia article, Wikimedia Commons imageinfo, Open-Meteo Marine.
-- Maximum depth is recorded with BOTH published figures (Wikipedia
-- 5,395 m; Wikidata P4511 5,800 m) — the disagreement is documented
-- in ocean_sources, never silently resolved.
--
-- The site code reads this table first and falls back to the
-- identical baked dataset while this migration is unapplied.
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.oceans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  wikidata_qid text,
  part_of_name text,
  lat double precision,
  lng double precision,
  marine_timezone text,
  status text not null default 'draft',
  last_verified_at date,
  seo_title text,
  seo_description text,
  curated jsonb not null default '{}'::jsonb,
  related_slugs text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.ocean_media (
  id uuid primary key default gen_random_uuid(),
  ocean_id uuid not null references public.oceans(id) on delete cascade,
  provider text not null default 'commons',
  file_title text not null,
  file_url text not null,
  page_url text,
  width integer,
  height integer,
  licence text not null,
  licence_url text,
  author text not null,
  attribution_text text not null,
  role text not null default 'gallery', -- hero / gallery / detail
  alt_text text,
  sort_order integer not null default 0,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  unique (ocean_id, file_title)
);

create table if not exists public.ocean_sources (
  id uuid primary key default gen_random_uuid(),
  ocean_id uuid not null references public.oceans(id) on delete cascade,
  claim text not null,
  source_name text not null,
  source_url text not null,
  checked_at date not null,
  created_at timestamptz not null default now()
);

alter table public.oceans enable row level security;
alter table public.ocean_media enable row level security;
alter table public.ocean_sources enable row level security;

do $$ begin
  create policy "oceans public read" on public.oceans for select using (status = 'published');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "ocean_media public read" on public.ocean_media for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "ocean_sources public read" on public.ocean_sources for select using (true);
exception when duplicate_object then null; end $$;

-- ── Seed: Arabian Sea (golden instance) ─────────────────────────────
insert into public.oceans
  (slug, name, wikidata_qid, part_of_name, lat, lng, marine_timezone,
   status, last_verified_at, seo_title, seo_description, curated, related_slugs)
values (
  'arabian-sea', 'Arabian Sea', 'Q58705', 'Indian Ocean', 16, 64, 'Asia/Karachi',
  'published', '2026-10-22',
  'Arabian Sea: Live Waves, Weather & Facts',
  'The Arabian Sea live: wave height & swell today, Karachi coastal weather, monsoon pattern, size and depth facts — every figure sourced.',
  $json$
  {
    "intro": [
      "The Arabian Sea is the northwestern arm of the Indian Ocean, bounded on the west by the Arabian Peninsula, the Gulf of Aden and the Guardafui Channel, on the northwest by the Gulf of Oman and Iran, on the north by Pakistan, on the east by India, and on the southeast by the Laccadive Sea and the Maldives, with Somalia to the southwest. Its total area is 3,862,000 km².",
      "Few seas have shaped history like this one. For millennia its reversing monsoon winds carried trade — and with it concepts, peoples, philosophies, technologies and religions — across the Old World: sailors rode one monsoon out and waited for the winds and currents to reverse before sailing home. The same monsoon still sets the sea’s moods today, which is why this page pairs the facts with the live wave and weather picture.",
      "At its centre and south the seabed falls away into the Arabian Basin, an expansive, relatively flat stretch of ocean floor reaching depths beyond 4,500 metres. In the west the Gulf of Aden connects the sea to the Red Sea through the strait of Bab-el-Mandeb; in the northwest the Gulf of Oman connects it to the Persian Gulf."
    ],
    "facts": [
      {"label": "Part of", "value": "Indian Ocean", "source": "Wikidata"},
      {"label": "Total area", "value": "3,862,000 km² (1,491,000 sq mi)", "source": "Wikidata / Wikipedia"},
      {"label": "Maximum depth", "value": "5,395 m", "source": "Wikipedia (see sources note)"},
      {"label": "Representative point", "value": "16° N, 64° E", "source": "Wikidata"},
      {"label": "Seabed", "value": "Arabian Basin — beyond 4,500 m in places", "source": "Wikipedia"},
      {"label": "Connects west", "value": "Gulf of Aden → Bab-el-Mandeb → Red Sea", "source": "Wikipedia"},
      {"label": "Connects northwest", "value": "Gulf of Oman → Persian Gulf", "source": "Wikipedia"},
      {"label": "Northern shore", "value": "Pakistan — Karachi is its great port city", "source": "Wikipedia"}
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
      {"q": "How big is the Arabian Sea?", "a": "Its total area is 3,862,000 km² (1,491,000 sq mi) — the northwestern region of the Indian Ocean, between the Arabian Peninsula, Iran, Pakistan, India, the Maldives and Somalia (Wikidata / Wikipedia)."},
      {"q": "How deep is the Arabian Sea?", "a": "Wikipedia gives a maximum depth of 5,395 metres; Wikidata records 5,800 metres for the same quantity. Both figures are shown in this page’s sources rather than hidden — depth soundings for an entire sea are estimates that vary by survey and by where the deepest point is taken."},
      {"q": "What are the waves like in the Arabian Sea today?", "a": "The live panel at the top of this page shows today’s significant wave height, swell direction and wave period from the Open-Meteo Marine API at the sea’s representative point (16° N, 64° E), plus the weather on the coast at Karachi."},
      {"q": "When is the Arabian Sea roughest?", "a": "During the southwest monsoon, roughly June to September, when strong winds drive the year’s roughest open-sea conditions. The northeast monsoon months, roughly November to March, are generally the calmest — the pattern that governed sailing trade here for millennia (Wikipedia)."},
      {"q": "Which WorldCityHub city is on the Arabian Sea?", "a": "Karachi, Pakistan — the great port city on the sea’s northern shore. Its full WorldCityHub guide (weather, prayer times, rates, news and more) is linked from this page."}
    ]
  }
  $json$::jsonb,
  '{}'
)
on conflict (slug) do update set
  name = excluded.name, wikidata_qid = excluded.wikidata_qid,
  part_of_name = excluded.part_of_name, lat = excluded.lat, lng = excluded.lng,
  marine_timezone = excluded.marine_timezone, status = excluded.status,
  last_verified_at = excluded.last_verified_at, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, curated = excluded.curated;

-- ── Seed: media records (licences verified via Commons API, 2026-10-22) ──
insert into public.ocean_media
  (ocean_id, provider, file_title, file_url, page_url, width, height, licence, licence_url, author, attribution_text, role, alt_text, sort_order, verified)
select o.id, 'commons', m.file_title, m.file_url, m.page_url, m.width, m.height, m.licence, m.licence_url, m.author, m.attribution_text, m.role, m.alt_text, m.sort_order, true
from public.oceans o
cross join (values
  ('Arabian sea waves.jpg', 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Arabian_sea_waves.jpg', 'https://commons.wikimedia.org/wiki/File:Arabian_sea_waves.jpg', 6000, 4000, 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Galib Tufan', '"Arabian sea waves" by Galib Tufan — CC BY-SA 4.0, via Wikimedia Commons', 'hero', 'Waves rolling in the Arabian Sea under a bright sky', 1),
  ('Winter Phytoplankon Arabian Sea.jpg', 'https://upload.wikimedia.org/wikipedia/commons/1/19/Winter_Phytoplankon_Arabian_Sea.jpg', 'https://commons.wikimedia.org/wiki/File:Winter_Phytoplankon_Arabian_Sea.jpg', 2491, 1470, 'Public domain', 'https://commons.wikimedia.org/wiki/Commons:Public_domain', 'NASA', '"Winter Phytoplankton, Arabian Sea" by NASA — public domain, via Wikimedia Commons', 'gallery', 'Satellite view of a winter phytoplankton bloom swirling in the Arabian Sea (NASA)', 2),
  ('Arabian Sea and Morjim Beach as seen from Vagator Fort, Goa, India.jpg', 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Arabian_Sea_and_Morjim_Beach_as_seen_from_Vagator_Fort%2C_Goa%2C_India.jpg', 'https://commons.wikimedia.org/wiki/File:Arabian_Sea_and_Morjim_Beach_as_seen_from_Vagator_Fort,_Goa,_India.jpg', 3072, 2048, 'CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0', 'Vyacheslav Argenberg', '"Arabian Sea and Morjim Beach as seen from Vagator Fort, Goa, India" by Vyacheslav Argenberg — CC BY 4.0, via Wikimedia Commons', 'gallery', 'The Arabian Sea and Morjim Beach seen from Vagator Fort, Goa, on the sea’s eastern shore', 3),
  ('Arabian Sea - n22e70.jpg', 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Arabian_Sea_-_n22e70.jpg', 'https://commons.wikimedia.org/wiki/File:Arabian_Sea_-_n22e70.jpg', 683, 446, 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Arjun Sinh Jadeja', '"Arabian Sea" satellite tile by Arjun Sinh Jadeja — CC BY-SA 4.0, via Wikimedia Commons', 'detail', 'Satellite tile of the Arabian Sea region (the image attached to the sea’s Wikidata record)', 4)
) as m(file_title, file_url, page_url, width, height, licence, licence_url, author, attribution_text, role, alt_text, sort_order)
where o.slug = 'arabian-sea'
on conflict (ocean_id, file_title) do update set
  file_url = excluded.file_url, page_url = excluded.page_url, width = excluded.width,
  height = excluded.height, licence = excluded.licence, licence_url = excluded.licence_url,
  author = excluded.author, attribution_text = excluded.attribution_text,
  role = excluded.role, alt_text = excluded.alt_text, sort_order = excluded.sort_order,
  verified = excluded.verified;

-- ── Seed: source records ────────────────────────────────────────────
insert into public.ocean_sources (ocean_id, claim, source_name, source_url, checked_at)
select o.id, s.claim, s.source_name, s.source_url, s.checked_at::date
from public.oceans o
cross join (values
  ('Identity (matched on description, not name alone), representative coordinates 16° N 64° E, area, part of Indian Ocean', 'Wikidata — Q58705 (Arabian Sea)', 'https://www.wikidata.org/wiki/Q58705', '2026-10-22'),
  ('Bounds, connections (Bab-el-Mandeb, Gulf of Oman), Arabian Basin, monsoon pattern, trade history', 'Wikipedia — "Arabian Sea"', 'https://en.wikipedia.org/wiki/Arabian_Sea', '2026-10-22'),
  ('Maximum depth — SOURCES DIFFER: Wikipedia 5,395 m; Wikidata (P4511) 5,800 m. Both recorded; the fact card shows Wikipedia''s figure with this note', 'Wikipedia — "Arabian Sea" / Wikidata Q58705', 'https://en.wikipedia.org/wiki/Arabian_Sea', '2026-10-22'),
  ('Live wave height, direction and period at 16° N, 64° E; Karachi coastal weather', 'Open-Meteo Marine & Forecast APIs', 'https://open-meteo.com/', '2026-10-22'),
  ('All photographs: licence, author, dimensions', 'Wikimedia Commons — imageinfo records (per-file links in the credits)', 'https://commons.wikimedia.org/', '2026-10-22')
) as s(claim, source_name, source_url, checked_at)
where o.slug = 'arabian-sea'
  and not exists (
    select 1 from public.ocean_sources os
    where os.ocean_id = o.id and os.claim = s.claim
  );
