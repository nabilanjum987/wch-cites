# Personality profile photos — P9 source record (2026-10-28)

Fix for the final28 P9 defect: Faiz Ahmed Faiz, Nusrat Fateh Ali Khan,
Wasim Akram and Imran Khan rendered an empty "No image" placeholder
block (0 `<img>`); only Allama Iqbal had a photo. Verified live
2026-10-28 before the fix (see `~/workspace/worldcityhub/evidence/final28-p9/`).

## Rule followed

Every photo below is stored **locally** as WebP under
`public/images/personalities/` — never hotlinked. Each licence was read
from the Wikimedia Commons API (`extmetadata`: creator, licence short
name, licence URL) and each image was **visually checked** to confirm it
is a genuine photograph of the named person before conversion.
Conversion only resized (max width 800 px, except the 402 px Nusrat
source which was kept at native size) and re-encoded to WebP (quality
82); no face was cropped out of frame by the conversion itself — the
hero's existing `aspect-square object-cover` presentation does the
square crop at render time. On-page attribution is rendered as a
caption under the photo (`Photo: <creator> · <licence>`).

Allama Iqbal's existing photo was **not touched** and was not used as a
model: the task notes its image-bank portrait is unverified.

## Photos added

| Profile (slug) | Local file | Wikimedia Commons source | Creator | Licence |
|---|---|---|---|---|
| Faiz Ahmed Faiz (`faiz-ahmed-faiz`) | `public/images/personalities/faiz-ahmed-faiz.webp` (800×664) | [File:Faiz, London 1983.jpg](https://commons.wikimedia.org/wiki/File:Faiz,_London_1983.jpg) — "Faiz.4. SOAS. London 1983" | Amarjit Chandan (Amarjit Chandan Archive) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Nusrat Fateh Ali Khan (`nusrat-fateh-ali-khan`) | `public/images/personalities/nusrat-fateh-ali-khan.webp` (402×402) | [File:Nusrat Fateh Ali Khan (1948-1997).jpg](https://commons.wikimedia.org/wiki/File:Nusrat_Fateh_Ali_Khan_(1948-1997).jpg) — singing into a microphone | Thomas Rome (via Flickr) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| Wasim Akram (`wasim-akram`) | `public/images/personalities/wasim-akram.webp` (800×1095) | [File:Wasim Akram.jpg](https://commons.wikimedia.org/wiki/File:Wasim_Akram.jpg) — portrait after retirement from Test cricket (2002) / ODI (2003) | Arijit Basak (via Flickr) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| Imran Khan (`imran-khan`) | `public/images/personalities/imran-khan.webp` (800×1107) | [File:Imran Khan 2012.jpg](https://commons.wikimedia.org/wiki/File:Imran_Khan_2012.jpg) — Davos, 26 Jan 2012, World Economic Forum Annual Meeting | World Economic Forum | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) |

Original dimensions confirmed against the Commons API before
conversion: Faiz 1181×980, Nusrat 402×402, Wasim 800×1095,
Imran 1815×2511.

## Where each photo is wired

- **Seed fallback** (`src/lib/data/personalities-seed.ts`): Faiz and
  Imran carry `imageUrl` + `imageCredit` + `imageLicence`, so their
  photos show even before any database migration is applied.
- **Database** (`supabase/migrations/0016_personality_photos_p9.sql`):
  sets `image_url` / `image_credit` / `image_licence` on all four
  slugs. This is what makes the Nusrat and Wasim photos appear live:
  those two profiles are **not** in the seed — they are served from
  the database — so their photos only appear once the owner applies
  migration 0016. Until then the template fix below guarantees the
  accept criterion anyway.
- **Template** (`src/components/personality/PersonalityHero.tsx`):
  the empty placeholder block is removed entirely. A profile with a
  photo renders the photo (+ caption); a profile without one renders
  no image column and its content spans the full width. This is what
  guarantees "no 'No image' block visible anywhere, on any personality
  page" regardless of database state.
- **Data layer** (`src/lib/personalities.ts`): `rowToProfile` now maps
  `image_credit` / `image_licence` through to the profile, and the
  detail page passes them to the hero.

## Candidates deliberately rejected

- `File:Nusrat Fateh Ali Khan.jpg` (CC BY-SA 4.0, "made by" Attersaab):
  visually an **illustration/composite** (painted figure pasted onto
  a landscape), not a photograph — rejected as a profile photo.
- `File:FaizAhmedFaiz.jpg` (CC BY-SA 3.0): Faiz's **signature /
  autograph**, not a portrait — rejected.
- Getty/AFP/press-agency images found in web search for all four
  subjects: rights-managed, purchase-licence only — never used.
- The Iqbal portrait in the image bank: noted unverified — not reused.

## Scope notes (not changed by P9)

- Nusrat / Wasim page titles and meta descriptions are empty in a
  different way (P3/P4 items: empty title suffix, "— ." descriptions).
  P9 does not touch titles or descriptions; those stay exactly as
  they were.
- No other page, design token, or copy was changed. Iqbal's page
  renders byte-identically in the hero (it has a photo and no credit
  fields, so no caption appears for it).
