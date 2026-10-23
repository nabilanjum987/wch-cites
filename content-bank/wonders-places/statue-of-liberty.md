# Statue of Liberty — Wonder & Place Content Bank

*Banked content for the Statue of Liberty page. Built from the Round 2 wonder data row (migration 0011, verified) and the Round 3 place row; the visitor guide is completed from the National Park Service's published visitor information, checked live on 2026-10-22 (the data row's visitor fields were generic). Nothing here is wired to a live route.*

## The Story

The Statue of Liberty — Liberty Enlightening the World — is a colossal copper statue on Liberty Island in New York Harbor, a gift from the people of France to the United States. It was designed by the French sculptor Frédéric Auguste Bartholdi, and its internal iron armature was engineered by Gustave Eiffel. Dedicated on 28 October 1886, the robed figure of Libertas holds a torch above her head in her right hand and a tablet inscribed with the date of American independence in her left; a broken chain at her feet marks the abolition of slavery, and her crown's seven rays stand for the seven seas and continents.

From the ground to the torch she stands 93 metres; the figure itself is 46 metres, and its copper skin is just 2.4 mm thick — about two pennies. That skin weathered from shining penny-brown to the famous green within about two decades. UNESCO inscribed the statue as World Heritage Site 307 in 1984. The National Park Service manages the monument, and the original torch — replaced in 1986 — is displayed in the Statue of Liberty Museum on the island.

## Visitor guide

**Best time.** Go early: the National Park Service recommends an early ferry departure if you want both Liberty Island and Ellis Island in one day, and to be on a ferry before 1 pm to fit both in. Crown and pedestal tickets sell out well ahead in season — reserve as early as the booking window allows.

**How to reach.** There is exactly one way: the ferry. Statue City Cruises is the ONLY ferry service authorised by the National Park Service to land visitors on Liberty and Ellis Islands — other harbour cruises pass without landing. Ferries depart from The Battery in Manhattan and from Liberty State Park in New Jersey, with airport-style security screening at both. Every ferry ticket includes both islands and both museums. Access inside the statue is by advance reservation only: pedestal tickets and crown tickets are limited and purchased online through Statue City Cruises; crown tickets must be reserved before the visit, are non-transferable, require photo ID, and the climb is 162 steps from the top of the pedestal (377 from the ground), with no elevator. The monument is open every day except Thanksgiving and 25 December; hours follow the ferry schedule.

## What to wear (framework — keyed to the live weather layer)

Read the live conditions block on the page first. Liberty Island is exposed harbour: wind is the constant, in every season. In winter, full cold layers and a windproof outer — the ferry deck and the crown queue are unforgiving. In summer heat, sun protection and water for unshaded grounds and queues. Crown climbers: the staircase is narrow and confined — light, close-fitting clothing, nothing bulky; bags are not permitted inside the pedestal or crown (lockers are provided at the monument).

## Myth vs Fact

**Myth: The statue was always green. — FALSE.** It began as bright copper, the colour of a new penny; the green patina is oxidation that formed over roughly 20 years and now protects the metal. *(Correction: National Park Service / Wikipedia — "Statue of Liberty", as recorded in the data row.)*

**Myth: France paid for the whole monument. — FALSE.** France funded the statue; Americans had to fund the pedestal, and fundraising stalled until Joseph Pulitzer's newspaper campaign drew over 120,000 small donations. *(Wikipedia — "Statue of Liberty".)*

**Myth: The face is Bartholdi's mother. — PARTLY TRUE.** The likeness to Charlotte Bartholdi is a long-told story and the features do resemble her — but no document from the sculptor confirms the model. *(Wikipedia — "Statue of Liberty".)*

**Myth: The torch you see is the 1886 original. — FALSE.** The original torch, damaged by decades of weather and modifications, was removed in 1984 and is now in the museum; the present flame is a gilded replacement. *(Wikipedia / NPS, as recorded in the data row.)*

## Sources
- Wonder data row: `supabase/migrations/0011_wonders_batch2.sql` (UNESCO site 307; NPS; Wikipedia — facts and myths as recorded)
- Visitor guide: National Park Service, "Plan Your Visit" and "Visit the Crown" (nps.gov/stli), checked live 2026-10-22 — sole authorised ferry (Statue City Cruises), advance crown/pedestal reservations, closures (Thanksgiving, 25 December), 162-step crown climb.
- Place data row: `src/lib/data/places/` (Wikidata Q9202). The place row's architect field (Viollet-le-Duc) is not used — the wonder row's Bartholdi/Eiffel attribution governs; the place row's 46 m is the figure alone, matching the Story.

*Written 2026-10-22. Content bank — not published.*
