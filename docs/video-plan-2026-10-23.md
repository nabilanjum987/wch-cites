# Video Plan — NotebookLM → YouTube → Embed (PLANS ONLY)

**Status:** PLAN ONLY (Builder Batch 4, Item 4a — 2026-10-23). No video has
been generated, no account touched, nothing uploaded. Execution starts only
on the owner's go, one video at a time.

**Doctrine (production pipeline):** one NotebookLM narrated video per page —
the narration is generated from the page's banked brief, uploaded to
YouTube with the page link in the description, and embedded back on the
page. **Honest limit: this is semi-manual.** NotebookLM has no public
auto-generation API, so every video passes through human hands at
generation, review, and upload. Nobody should quote this pipeline as
automated.

**Queue rule:** only pages LIVE today (production sitemap, 61 URLs, read
2026-10-23) that already have a banked brief in `docs/video-briefs/`.
Briefs for pages that are not live yet wait (listed at the end) — a video
is never produced for an unpublished page.

## Production queue — 10 videos

Priority: golden pages first, then the three live cities, then the live
hubs. Every brief below is complete (facts list + full narration script,
≈600–800 words ≈ 4–5 minutes spoken, prepared 2026-10-22).

| # | Page (live URL) | Brief file | Brief status |
|---|---|---|---|
| 1 | https://worldcityhub.vercel.app/wonders/taj-mahal | `docs/video-briefs/taj-mahal.md` | Complete — golden wonder |
| 2 | https://worldcityhub.vercel.app/oceans/arabian-sea | `docs/video-briefs/arabian-sea.md` | Complete — golden ocean |
| 3 | https://worldcityhub.vercel.app/pakistan/punjab/lahore | `docs/video-briefs/lahore.md` | Complete — city guide |
| 4 | https://worldcityhub.vercel.app/pakistan/sindh/karachi | `docs/video-briefs/karachi.md` | Complete — city guide |
| 5 | https://worldcityhub.vercel.app/pakistan/islamabad-capital-territory/islamabad | `docs/video-briefs/islamabad.md` | Complete — city guide |
| 6 | https://worldcityhub.vercel.app/rates | `docs/video-briefs/hub-rates.md` | Complete — hub guide |
| 7 | https://worldcityhub.vercel.app/countries | `docs/video-briefs/hub-countries.md` | Complete — hub guide |
| 8 | https://worldcityhub.vercel.app/compare | `docs/video-briefs/hub-compare.md` | Complete — hub guide |
| 9 | https://worldcityhub.vercel.app/news | `docs/video-briefs/hub-news.md` | Complete — hub guide |
| 10 | https://worldcityhub.vercel.app/horoscope | `docs/video-briefs/hub-horoscope.md` | Complete — hub guide |

**City subpages** (weather / prayer-times / rates / news / sports /
economy / events under each city) are live but carry **no separate
briefs** — each city's main-page video covers the guide; subpage videos
are a later decision if the owner wants them, not part of this queue.

**Order note:** the two golden pages go first because they are the
templates every other page copies — if the format needs a fix, it is
cheapest to learn it on #1 before #2–#10 repeat it.

## Per-video steps (the exact checklist, repeated for every row)

1. **Re-pull the live figures.** The briefs quote live figures (weather,
   gold, FX, prayer) in a dated line — open the page on production day,
   refresh those figures from the page itself, and update the brief's
   dated line. Never generate from a stale figure.
2. **Feed the brief to NotebookLM.** The brief's narration script is the
   source document. Generate the narrated video (audio overview / video
   overview per NotebookLM's current options).
3. **Listen/watch the whole output once.** Check: every figure matches
   the page, names and dates pronounced right, no invented colour the
   brief doesn't carry. Any error → regenerate or drop the video; a
   wrong figure is never "close enough".
4. **OWNER REVIEW GATE.** The owner watches the finished video and gives
   an explicit OK. No OK, no upload — this gate is never skipped and
   never batched into a blanket approval.
5. **Upload to YouTube** (owner's channel; see "What the owner must
   supply"). Title and description come **from the brief**: title = the
   brief's heading pattern (e.g. "Taj Mahal — Golden Wonder Guide"),
   description = the page summary + the page URL (the briefs already
   carry the page URL as their closing line) + the figure sources the
   brief lists. Mark the video as AI-narrated in the description —
   honesty about the pipeline is part of the format.
6. **Embed back on the page** — ⚠ **BLOCKED, needs a decision (below).**
   Paste the YouTube embed only where a slot exists; today no slot
   exists (see the decision box). The video ID and its page pairing get
   recorded in this plan's execution log when the step runs.
7. **Verify the loop.** Open the live page: embed plays; open the video:
   description links back to the page. Both directions checked before
   the row is marked done.

## ⚠ Decision needed before step 6 can run — the embed slot

Checked in the codebase (2026-10-23): **no page template has a YouTube /
video embed slot.** Golden wonder, ocean, place, city, and rates pages
carry map iframes (OSM) but no video embed field or component. The one
video surface that does exist — `VideoNews` on city news pages — renders
*external* YouTube search results, not the page's own narrated video, and
is separately flagged in the B9 source register
(`fetchYouTubeVideos()` fabricates listings — verify + remove before any
wiring); it must not be reused as the embed slot.

So step 6 needs an owner/billi decision, in a separate card:
- **Option A (recommended):** add a small data-driven embed block to the
  golden templates (wonder / ocean / place / city / rates): a per-page
  `videoId` field, rendered as a labelled "Watch the narrated guide"
  section only when a video exists. Pages without a video show nothing
  (no placeholder, no fake slot).
- **Option B:** link-only — a "Watch on YouTube" link on the page, no
  iframe. Weaker (no on-page playback), zero template work.
Until that card lands, the queue can complete steps 1–5; step 6 waits.
This plan does not invent a slot.

## Time estimate per video

Assumptions: brief complete (true for all 10); NotebookLM generation is
a single pass plus at most one regeneration; the owner reviews at 1×
speed; upload metadata is copied from the brief, not rewritten.

| Step | Hands-on time | Waiting time |
|---|---|---|
| 1. Re-pull live figures + refresh brief | ~10 min | — |
| 2. NotebookLM generation | ~5 min setup | ~10–20 min generation |
| 3. Full review listen/watch | ~5–10 min (video is 4–5 min) | — |
| 4. Owner review gate | ~5 min of owner's time | depends on owner availability — the real bottleneck |
| 5. YouTube upload + metadata | ~10 min | upload processing varies |
| 6. Embed back (once a slot exists) | ~5 min | + a deploy |
| 7. Verify the loop | ~5 min | — |
| **Total hands-on** | **≈ 45–55 min per video** | plus generation + owner-gate latency |

Whole queue, if run back-to-back: roughly **8–10 working hours of
hands-on time spread over days**, because step 4 gates every video on
the owner individually. A sane cadence is **one video per day** — which
also matches the social plan's launch rhythm.

## What the owner must supply

1. **A one-time Google login for NotebookLM in the browser** — the
   agent cannot and will not hold the owner's Google credentials; the
   login happens on the owner's session, once.
2. **The YouTube channel** — an existing channel or a new one created by
   the owner (channel name/handle = WorldCityHub), with upload access
   available in the same browser session (or OAuth authorised by the
   owner if uploads ever move off the browser).
3. **The final OK on every single video** (step 4) — per video, after
   watching it. No standing approval.
4. **The embed-slot decision** (Option A vs B, above) before any step 6.
5. Nothing else: briefs, figures, titles, and descriptions already
   exist or come from the pages themselves.

## Explicitly OUT of this queue — briefs that wait for their pages

All 12 batch-2 briefs (`docs/video-briefs/batch2/`) are complete but
their pages are **not live today**, so they wait — each joins the queue
the week its page publishes, in golden order:

- Wonders (7): `burj-khalifa.md`, `christ-the-redeemer.md`,
  `colosseum.md`, `eiffel-tower.md`, `great-wall-of-china.md`,
  `machu-picchu.md`, `pyramids-of-giza.md`.
- Oceans (5): `arctic-ocean.md`, `atlantic-ocean.md`, `indian-ocean.md`,
  `pacific-ocean.md`, `southern-ocean.md`.

Also out: any page with no brief (horoscope sign pages, compare detail
pages, personalities, places) — a brief must be banked and approved
before a page can enter this queue.
