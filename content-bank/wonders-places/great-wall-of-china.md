# Great Wall of China — Wonder & Place Content Bank

*Banked content for the Great Wall page. Built from the Round 2 wonder data row (migration 0008, verified) and the Round 3 place row; nothing here is wired to a live route.*

## The Story

The Great Wall is not one wall. It is a system of fortifications raised across China's northern frontier over two thousand years — rammed-earth border works of the early states from the 7th century BC, Qin Shi Huang's first connection of the northern walls after 220 BC, and the brick-and-stone Ming rebuilding of 1368–1644 that produced the wall visitors photograph today. The 2012 official Chinese survey measured the whole system — walls, branches, trenches and natural barriers — at 21,196 km.

The best-preserved sections are Ming: brick-faced walls averaging 6–7 metres high, carrying watchtowers, passes and signal towers along mountain ridgelines, such as Badaling (built 1505) and Mutianyu outside Beijing. UNESCO inscribed the Great Wall in 1987 (site 438), and in 2007 it was voted one of the New7Wonders of the World. About 16 million people a year visit it (packaged figure).

## Visitor guide

**Best time.** Sections open year-round; spring and autumn give the clearest mountain weather at the Beijing sections, and the live weather block on the page (sampled at Badaling) is the working reference — mountain conditions change fast. Individual sections can close in severe weather.

**How to reach.** Badaling is reached from Beijing by bus and by the S2 suburban rail / high-speed rail to Badaling Great Wall station; Mutianyu is served by shuttle buses from Dongzhimen. Passport-based ticket booking applies to foreign visitors at major sections. Hours and fees vary by section and season — the Great Wall official site and each section's announcements publish the current schedule (fees are deliberately not printed here; the packaged data row carries none verified).

## What to wear (framework — keyed to the live weather layer)

Read the live conditions block on the page first, then apply these rules: the wall is an exposed mountain ridge walk with steep, uneven steps. In heat (30 °C and above on the live block) — light breathable clothing, a hat, sunscreen, and more water than feels necessary; there is little shade on the wall. In the 10–20 °C band — a windproof layer, because ridge wind is the dominant discomfort. Below 10 °C — full cold-weather layers and gloves; ice can form on shaded steps. In rain — shoes with real grip: wet stone steps are the wall's main hazard. Sturdy footwear applies in all conditions.

## Myth vs Fact

**Myth: The Great Wall is visible from space with the naked eye. — FALSE.** Astronauts including China's Yang Liwei have said it is not visible unaided from orbit, and NASA confirms the wall — narrow and earth-coloured — cannot be picked out with the naked eye from low Earth orbit, let alone from the Moon. *(Myth: popular tradition; correction: NASA / astronaut testimony, as recorded in the data row.)*

**Myth: It is one single, continuous wall built all at once. — PARTLY TRUE.** The system was built over two thousand years by successive states and dynasties and includes parallel walls, branches, trenches and natural barriers; the famous stone wall is mostly Ming work. *(UNESCO site 438; 2012 Chinese national survey.)*

**Myth: Dead workers were buried inside the wall — the world's longest cemetery. — FALSE.** Construction deaths are documented, but no evidence supports bodies entombed within the wall as building fill; the line is later legend, not an archaeological finding. *(Historians' consensus, as recorded in the data row.)*

## Sources
- Wonder data row: `supabase/migrations/0008_wonders_batch1.sql` (intro, facts, timeline, visitor, myths — each field sourced in the row: UNESCO site 438; 2012 official Chinese survey; NASA; official site)
- Place data row: `src/lib/data/places/` (Wikidata Q12501). Note: the place row's 5.0 m "height" is not used — the wonder row's 6–7 m Ming wall height governs, per the ingest reconciliation.

*Written 2026-10-22. Content bank — not published.*
