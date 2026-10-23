# Eiffel Tower — Wonder & Place Content Bank

*Banked content for the Eiffel Tower page. Built from the Round 2 wonder data row (migration 0008, verified) and the Round 3 place row; nothing here is wired to a live route.*

## The Story

The Eiffel Tower rose over the Champ de Mars as the centrepiece of the 1889 World's Fair, the centenary of the French Revolution. It was designed by engineers Maurice Koechlin and Émile Nouguier of Gustave Eiffel's company, with architect Stephen Sauvestre shaping its appearance; Eiffel bought the rights and gave it his name. The puddled-iron structure — 18,038 parts, 2.5 million rivets — stood 300 metres as built and was the world's tallest structure until 1930.

Paris kept it after its 20-year permit expired in 1909 because it had become invaluable as a radio-telegraphy mast. Antennas have since raised it to 330 metres (2022). It stands within the UNESCO-listed Paris, Banks of the Seine (site 600, inscribed 1991), and around seven million people a year ascend it — Wikidata records 7,097,302 visitors — making it the world's most-visited paid monument.

## Visitor guide

**Best time.** The tower is open every day of the year; lift and stair hours shift with the season — mid-morning to late evening, later in summer. The official site publishes the day's exact schedule and same-day ticket availability; early or late slots beat the midday queues.

**How to reach.** Entrances are at the base of each pillar inside the secured esplanade (glass-wall perimeter, security check before entry). Online timed tickets from the official ticket site are the reliable way to skip the longest queue. Fees are deliberately not printed here — the packaged data row carries none verified.

## What to wear (framework — keyed to the live weather layer)

Read the live conditions block on the page first. The summit is open-air and noticeably windier and cooler than the street: carry a wind layer in every season. In rain, the metal stairs are slippery — shoes with grip. In summer heat, queueing on the esplanade is unshaded — hat, sunscreen and water. In winter (below 10 °C on the live block), full layers and gloves for the summit rail.

## Myth vs Fact

**Myth: Parisians hated the tower and it was nearly demolished in 1909. — PARTLY TRUE.** The 1887 artists' protest letter is real, and the original concession ran only 20 years. But Parisians also queued in millions in 1889, and demolition was averted by utility — the tower had become France's key long-distance radio mast. *(Myth: the protest tradition; correction: official site history; UNESCO site 600.)*

**Myth: Gustave Eiffel designed the tower himself. — FALSE.** The design came from Koechlin and Nouguier, with Sauvestre's decorative shaping; Eiffel's genius was promotion and engineering management. *(Wikidata; Wikipedia — "Eiffel Tower".)*

**Myth: The tower grows taller in summer. — TRUE.** Iron expands with heat: the height varies by roughly 15 cm between winter cold and summer sun, a figure the official site itself publishes. *(Eiffel Tower official site.)*

## Sources
- Wonder data row: `supabase/migrations/0008_wonders_batch1.sql` (UNESCO site 600; Wikidata; official site)
- Place data row: `src/lib/data/places/` (Wikidata Q243: height 324 m including antennas at the place row's survey; the wonder row's 330 m with the 2022 antenna is the current figure used in the Story)

*Written 2026-10-22. Content bank — not published.*
