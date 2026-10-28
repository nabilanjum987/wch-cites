-- ─────────────────────────────────────────────────────────────────────────────
-- 0016_personalities_nusrat_wasim.sql — P3 (final28, 2026-10-28)
--
-- PROBLEM (verified live 2026-10-28): /personalities/nusrat-fateh-ali-khan
-- and /personalities/wasim-akram are broken stubs. Their production rows
-- carry only the old-shape fields (profession, birth/death year, birth
-- city): title, summary, city_name, country_name and every jsonb array
-- are empty, so the detail template renders "Name — ." as its meta
-- description, a "Connected to ," badge, a 1–2-question FAQ, and the
-- short-answer fallback claim that "the timeline, works and quotes tell
-- the full story" — over empty sections.
--
-- WHAT THIS FILE DOES: UPSERTs both rows COMPLETE, with the same data
-- added to src/lib/data/personalities-seed.ts in this PR (seed and SQL
-- were checked field-for-field before push). Every fact comes from the
-- sources in each row's `sources` array; the full source list is in the
-- PR evidence pack (~/workspace/worldcityhub/evidence/final28-p3/).
-- No portrait URL is set for either profile: no image URL was verified
-- this pass, and the hero renders its no-image panel rather than a
-- guessed URL.
--
-- PRECONDITIONS (same as migrations 0006 / 0013): migration 0005 or
-- 0014 has been applied first, so the 0005-shape columns exist and
-- `achievements` is jsonb; the ADD COLUMN guards below are idempotent
-- no-ops when they do. Run AFTER 0014 in filename order.
--
-- verified stays FALSE, per the repo's standing convention (0005 /
-- 0006 / 0013): profiles enter the city/country pools only after a
-- human verification pass. This does NOT leave the detail pages stub:
-- the single-profile read takes any row, and where an unverified row is
-- unreadable under verified-only RLS the page falls back to the seed,
-- which this PR fills with identical data. Either path renders the
-- complete page; flipping verified to true after the human pass only
-- adds the profiles to the pools.
--
-- ROW-PRESERVING + IDEMPOTENT: ON CONFLICT (slug) DO UPDATE, no row is
-- deleted, legacy columns (profession, birth_year, …) are untouched.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE personalities ADD COLUMN IF NOT EXISTS title                text    NOT NULL DEFAULT '';
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS occupation           text    NOT NULL DEFAULT '';
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS birth_date           text;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS death_date           text;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS city_name            text    NOT NULL DEFAULT '';
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS province_name        text    NOT NULL DEFAULT '';
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS country_name         text    NOT NULL DEFAULT '';
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS summary              text    NOT NULL DEFAULT '';
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS timeline             jsonb   NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS works                jsonb   NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS quotes               jsonb   NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS description_sections jsonb   NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS image_url            text;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS image_credit         text;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS image_licence        text;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS primary_color        text    NOT NULL DEFAULT '#01411C';
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS sources              jsonb   NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS verified             boolean NOT NULL DEFAULT false;

INSERT INTO personalities (
  slug, name, title, occupation, birth_date, death_date, nationality,
  city_slug, province_slug, country_slug, city_name, province_name, country_name,
  summary, achievements, timeline, works, quotes, description_sections,
  image_url, image_credit, image_licence, primary_color, sources, verified
) VALUES
  ($wch$nusrat-fateh-ali-khan$wch$, $wch$Nusrat Fateh Ali Khan$wch$, $wch$Shahenshah-e-Qawwali$wch$, $wch$Qawwali singer$wch$, $wch$13 October 1948$wch$, $wch$16 August 1997$wch$, $wch$Pakistani$wch$, $wch$faisalabad$wch$, $wch$punjab$wch$, $wch$pakistan$wch$, $wch$Faisalabad$wch$, $wch$Punjab$wch$, $wch$Pakistan$wch$, $wch$Nusrat Fateh Ali Khan (1948–1997) was Pakistan's Shahenshah-e-Qawwali, whose voice carried Sufi music from Faisalabad to audiences worldwide.$wch$, $wch$[{"icon":"👑","title":"Shahenshah-e-Qawwali","description":"Known as the King of Kings of Qawwali, the title by which audiences around the world knew him."},{"icon":"🎙️","title":"125+ Qawwali Albums","description":"Recorded more than 125 qawwali albums, a Guinness World Record for the most qawwali recordings (as of 2001)."},{"icon":"🏅","title":"UNESCO Music Prize (1995)","description":"Received the UNESCO Music Prize in 1995, after Pakistan's Pride of Performance award in 1987."},{"icon":"🌍","title":"Qawwali Goes Global","description":"Toured in more than 40 countries and recorded with Peter Gabriel, Michael Brook and Eddie Vedder."}]$wch$::jsonb, $wch$[{"year":"1948","title":"Born in Lyallpur","description":"Born on 13 October 1948 in Lyallpur, now Faisalabad, into a family of qawwals led by his father, Fateh Ali Khan."},{"year":"1964","title":"First performance at father's chehlum","description":"Following his father's death in 1964, sings at his father's chehlum — his first public performance, at age 15 — and trains with his uncles Mubarak Ali Khan and Salamat Ali Khan."},{"year":"1965","title":"First performance as leader","description":"His first performance as leader of the family qawwali party comes in March 1965, at a studio recording broadcast as part of Radio Pakistan's Jashn-e-Baharan festival; he had become lead singer alongside his uncle Mubarak Ali Khan in 1964."},{"year":"1971","title":"Leads the family party","description":"Becomes head of the family qawwali party after the death of his uncle Mubarak Ali Khan."},{"year":"1980s","title":"Signed in Britain","description":"Signed by Oriental Star Agencies in Birmingham in the early 1980s and begins taking qawwali to audiences beyond Pakistan."},{"year":"1990","title":"Mustt Mustt","description":"Releases Mustt Mustt with Canadian guitarist Michael Brook; its Massive Attack remix carries qawwali to a British crossover audience."},{"year":"1995","title":"UNESCO Music Prize","description":"Receives the UNESCO Music Prize for his contribution to music."},{"year":"1997","title":"Dies in London","description":"Dies in London on 16 August 1997, aged 48, in a year that also brings two Grammy nominations; he is buried in Faisalabad."}]$wch$::jsonb, $wch$[{"title":"Mustt Mustt","year":"1990","description":"Fusion album with Michael Brook on Real World; its title track, remixed by Massive Attack, carried qawwali to a British crossover audience.","type":"Album"},{"title":"Night Song","year":"1996","description":"Second collaboration with Michael Brook, nominated for a Grammy Award.","type":"Album"},{"title":"Shahen-Shah","description":"His Real World album introducing his qawwali party's sound to international listeners.","type":"Album"},{"title":"Allah Hoo","description":"A signature traditional qawwali recording, sung in praise of God.","type":"Song"},{"title":"Dama Dam Mast Qalandar","description":"A signature devotional song honouring Lal Shahbaz Qalandar, a staple of his concerts.","type":"Song"}]$wch$::jsonb, $wch$[{"text":"To be a qawwal is more than being a performer, more than being an artist. One must be willing to release one's mind and soul from one's body to achieve ecstasy through music. Qawwali is enlightenment itself.","context":"Interview, Chicago, 1993"},{"text":"Sufi music tries to banish the hatred living within all human beings. It does not belong to any one culture, but to all of us.","context":"Outlook interview, January 1996"},{"text":"A man learns all his life, and dies the day he thinks that he has learnt everything.","context":"Rediff interview, 1997"}]$wch$::jsonb, $wch$[{"title":"The Qawwali Tradition","content":"Nusrat was born into a family that had sung qawwali for generations. His father, Fateh Ali Khan, was a noted qawwal, and after his father's death in 1964 Nusrat trained with his uncles Mubarak Ali Khan and Salamat Ali Khan before taking over the family party in 1971. He sang mainly in Urdu and Punjabi, and occasionally in Persian, building a style of extraordinary range, stamina and improvisation."},{"title":"Going Global","content":"From the 1980s Nusrat carried qawwali to more than 40 countries, recording for Peter Gabriel's Real World label and collaborating with Michael Brook and Eddie Vedder, while also composing and singing for Indian films. His musical legacy is carried forward by his nephews Rahat Fateh Ali Khan and Rizwan-Muazzam."}]$wch$::jsonb, NULL, NULL, NULL, $wch$#7A2E1F$wch$, $wch$[{"name":"Wikipedia","url":"https://en.wikipedia.org/wiki/Nusrat_Fateh_Ali_Khan"},{"name":"Britannica","url":"http://www.britannica.com/biography/Nusrat-Fateh-Ali-Khan"},{"name":"Wikiquote","url":"https://en.wikiquote.org/wiki/Nusrat_Fateh_Ali_Khan"}]$wch$::jsonb, false),
  ($wch$wasim-akram$wch$, $wch$Wasim Akram$wch$, $wch$Sultan of Swing$wch$, $wch$Cricketer$wch$, $wch$3 June 1966$wch$, NULL, $wch$Pakistani$wch$, $wch$lahore$wch$, $wch$punjab$wch$, $wch$pakistan$wch$, $wch$Lahore$wch$, $wch$Punjab$wch$, $wch$Pakistan$wch$, $wch$Wasim Akram (born 1966) is Pakistan's Sultan of Swing, whose 916 international wickets include a man-of-the-match turn in the 1992 World Cup final.$wch$, $wch$[{"icon":"🏏","title":"916 International Wickets","description":"414 wickets in 104 Tests and 502 in 356 one-day internationals — the first bowler to reach 500 ODI wickets."},{"icon":"🏆","title":"World Cup Winner (1992)","description":"Man of the match in the 1992 World Cup final, with 33 runs and 3 for 49 against England at Melbourne."},{"icon":"🎯","title":"Sultan of Swing","description":"Master of swing in both directions and of reverse swing with the old ball, plus a lethal yorker."},{"icon":"🏅","title":"ICC Hall of Fame (2009)","description":"Inducted into the ICC Cricket Hall of Fame in 2009; named a Wisden Cricketer of the Year in 1993."}]$wch$::jsonb, $wch$[{"year":"1966","title":"Born in Lahore","description":"Born on 3 June 1966 in Lahore, where he grows up playing street and club cricket."},{"year":"1984","title":"Spotted at Lahore trials","description":"An unknown club cricketer, he is spotted by Javed Miandad at trials at Lahore's Gaddafi Stadium and fast-tracked into the national side."},{"year":"1984","title":"ODI debut","description":"Makes his one-day international debut for Pakistan against New Zealand."},{"year":"1985","title":"Test debut","description":"Makes his Test debut against New Zealand; in his second Test he takes 10 wickets in the match."},{"year":"1988","title":"Signs for Lancashire","description":"Signs for Lancashire County Cricket Club in England, beginning a ten-year county career."},{"year":"1992","title":"World Cup winner","description":"Stars in Pakistan's World Cup final win over England at Melbourne: a quick 33 with the bat and 3 for 49 with the ball, earning man of the match."},{"year":"1996","title":"257 not out","description":"Scores 257 not out against Zimbabwe at Sheikhupura, including 12 sixes."},{"year":"1999","title":"World Cup final as captain","description":"Captains Pakistan to the World Cup final, where Australia win at Lord's."},{"year":"2003","title":"Retires","description":"Retires from international cricket after the 2003 World Cup, with 414 Test wickets and 502 ODI wickets — the first bowler to 500 ODI wickets."},{"year":"2009","title":"ICC Hall of Fame","description":"Inducted into the ICC Cricket Hall of Fame."},{"year":"2022","title":"Sultan: A Memoir","description":"Publishes his memoir Sultan, written with Gideon Haigh."}]$wch$::jsonb, $wch$[{"title":"Wasim","year":"1998","description":"His first autobiography, written with Patrick Murphy.","type":"Book"},{"title":"Sultan: A Memoir","year":"2022","description":"His memoir, written with Gideon Haigh, covering his career and his life after cricket.","type":"Book"}]$wch$::jsonb, $wch$[{"text":"When Pakistan make the old ball swing it's called ball-tampering, but when everyone else does it, it's called reverse swing.","context":"Daily Mirror interview, 2006"},{"text":"We were artists and we learnt the art from Imran.","context":"Wisden interview, 2020"}]$wch$::jsonb, $wch$[{"title":"The Sultan of Swing","content":"Wasim was a left-arm fast bowler who could swing the new ball both ways and, as it aged, make it reverse — a skill he and Waqar Younis turned into Pakistan's signature weapon in the 1990s. His yorker at the death and his control at pace made him dangerous in every phase of a one-day innings, and his batting — crowned by 257 not out against Zimbabwe — made him a genuine all-rounder."},{"title":"After Playing","content":"After retiring in 2003 Wasim stayed in the game as a coach and commentator, including a long association with Kolkata Knight Riders in the Indian Premier League, and in 2022 he published Sultan: A Memoir with Gideon Haigh. He remains one of the most recognisable voices in world cricket commentary."}]$wch$::jsonb, NULL, NULL, NULL, $wch$#14532D$wch$, $wch$[{"name":"Wikipedia","url":"https://en.wikipedia.org/wiki/Wasim_Akram"},{"name":"ICC","url":"https://www.icc-cricket.com/news/cwc-1992-gave-pakistan-the-belief-says-akram"}]$wch$::jsonb, false)
ON CONFLICT (slug) DO UPDATE SET
  name                 = EXCLUDED.name,
  title                = EXCLUDED.title,
  occupation           = EXCLUDED.occupation,
  birth_date           = EXCLUDED.birth_date,
  death_date           = EXCLUDED.death_date,
  nationality          = EXCLUDED.nationality,
  city_slug            = EXCLUDED.city_slug,
  province_slug        = EXCLUDED.province_slug,
  country_slug         = EXCLUDED.country_slug,
  city_name            = EXCLUDED.city_name,
  province_name        = EXCLUDED.province_name,
  country_name         = EXCLUDED.country_name,
  summary              = EXCLUDED.summary,
  achievements         = EXCLUDED.achievements,
  timeline             = EXCLUDED.timeline,
  works                = EXCLUDED.works,
  quotes               = EXCLUDED.quotes,
  description_sections = EXCLUDED.description_sections,
  image_url            = EXCLUDED.image_url,
  image_credit         = EXCLUDED.image_credit,
  image_licence        = EXCLUDED.image_licence,
  primary_color        = EXCLUDED.primary_color,
  sources              = EXCLUDED.sources,
  verified             = EXCLUDED.verified;
