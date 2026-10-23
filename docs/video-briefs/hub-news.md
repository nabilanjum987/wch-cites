# Video Brief — News Hub — Categorized, Deduplicated, Sourced

**Page:** News hub (/news)
**Production:** NotebookLM narrated video (production pipeline: one video per page, page link in the YouTube description, video embedded back on the page). Semi-manual per the pipeline's honest limit — NotebookLM has no public auto-generation API.
**Brief prepared:** 2026-10-22 · **Figures policy:** only facts from the page's own verified data. Live figures (weather, gold, FX) are quoted in a dated line — re-pull them from the page on the recording day before generating.
**Narration style:** calm, factual, source-aware; no hype, no invented colour. Target ≈ 600–800 words (≈ 4–5 minutes spoken).

## Facts used (all from the page's data, with sources)
- Eight categories: World, Pakistan, Finance, Crypto, Health, Science/Discoveries, Technology, Sports (news system spec).
- Sources: GNews + verified RSS (BBC World, Al Jazeera, UN News, Dawn, ScienceDaily, NASA, CoinDesk, WHO — probed live in the Q13 build); the Guardian fetcher is built and waits for the owner's API key.
- Rules on the page: headline + source + link + time only; nothing older than 72 hours; cross-source dedupe by normalized headline + URL; the free GNews tier's ~12-hour delay is disclosed, not hidden.

## Narration script
Welcome to the News hub of WorldCityHub — a front page that refuses to do the two things most news pages do: it will not shout, and it will not pretend.

The hub is organized the way readers actually ask for news: by subject. Eight categories stand at the top — World, Pakistan, Finance, Crypto, Health, Science and Discoveries, Technology, and Sports. Open one and you get that subject's latest headlines, drawn from two kinds of sources working together: a commercial news index, and a set of verified public feeds — the BBC's world service, Al Jazeera, United Nations News, Pakistan's Dawn, and specialist wires for science, space, health, and digital assets, each probed and proven before it was wired in.

Now the discipline, because news is where trust goes to die. First: this page publishes headlines, sources, links, and times — nothing more. It does not rewrite other outlets' reporting and call it its own; when you want the story, you follow the link to the newsroom that did the work, and the credit stays where it belongs. Second: the same story often arrives from three sources at once, so the hub deduplicates — matching stories by their headlines and addresses — and shows you the story once. Third: nothing on the page is older than seventy-two hours; stale news is quietly removed rather than left to rot under a “latest” label.

And fourth — the part most sites hide — the hub tells you its own limits. Part of our feed rides on a free tier that delivers headlines with a delay of roughly half a day, so the hub says so, on the page, instead of performing instantaneity it does not have. A second major source, the Guardian's open archive, is fully wired into the system and waits only for an access key from the site's owner; until it arrives, its slot stays visibly empty rather than filled with filler.

There is a subscription in preparation, and its honesty matches the rest: you will be able to choose your categories, and the hub will tell you plainly that delivery begins only when the sending system is switched on — no silent sign-ups, no promises wearing a costume.

What you get today is a calm, categorized, deduplicated front page whose every headline names its source and its hour. In a medium addicted to urgency, that restraint is the feature. The page is below; the categories are waiting.

A word about the categories themselves, because they were chosen by readers' behaviour rather than by a newsroom's tradition. Finance and Crypto stand apart because money news decays in hours, not days. Science and Discoveries stands apart because it is the one section of any newspaper that reliably makes its readers more hopeful than they were. Health is separated from general world news because, after the years everyone remembers, health headlines deserve their own shelf and their own scrutiny. And Pakistan stands beside World, not beneath it — for this audience, home news and world news are equals, and the hub treats them so. The same machinery quietly serves the rest of the site: the city pages take their headlines from this system, the homepage takes its category tabs, and every one of those surfaces inherits the same dedupe, the same freshness window, and the same named sources. Fix the standard once, here, and it holds everywhere the headlines travel.

---
https://worldcityhub.vercel.app/news
