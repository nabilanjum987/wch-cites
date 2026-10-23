# Sydney Opera House — Wonder & Place Content Bank

*Banked content for the Sydney Opera House page. Built from the Round 2 wonder data row (migration 0011, verified) and the Round 3 place row; the visitor guide is completed from the Opera House's published tour information, checked live on 2026-10-22 (the data row's visitor fields were generic). Nothing here is wired to a live route.*

## The Story

The Sydney Opera House is a multi-venue performing arts centre at Bennelong Point on Sydney Harbour, and one of the most recognisable buildings on Earth. Its white shell vaults — universally read as sails — were designed by the Danish architect Jørn Utzon, who won the 1957 international competition with a sketch-like entry famously retrieved from the reject pile by juror Eero Saarinen. The design's resolution is geometric: every shell is a slice of a single sphere, which is what made the vaults buildable at all. The shells are clad in 1,056,006 Swedish ceramic tiles, and the tallest rises 67 metres above the harbour.

Construction began in 1959 and ran for fourteen difficult years: Utzon resigned in 1966 amid cost and political disputes, and an Australian team led by Peter Hall completed the interiors. The final bill, A$102 million against a A$7 million estimate, was largely paid by a state lottery created for the purpose. Queen Elizabeth II opened the building on 20 October 1973. In 2007 UNESCO inscribed it as World Heritage Site 166 — the youngest site on the list at the time, and one of very few recognised in their architect's lifetime; Utzon, who never returned to see it finished, died the following year.

## Visitor guide

**Best time.** The precinct and its podium are open public space — the building can be walked around and photographed freely; going inside the halls is by performance ticket or guided tour. The official guided tour runs about one hour, several times daily in multiple languages, and should be booked ahead in the Australian summer season. The harbour light is kindest early and late in the day.

**How to reach and tour.** The Opera House is a short walk from Circular Quay station (trains, ferries, light rail). Tours depart from the Welcome Centre on the lower concourse; arrive about 15 minutes before the tour for check-in and cloaking. The standard tour involves roughly 300 stairs and about 2.5 km of walking; daily mobility-access tours are available if pre-booked. Which venues you enter depends on the day's performance schedule — a working arts centre, not a museum. Prices are deliberately not printed here; the official site carries the current figures.

## What to wear (framework — keyed to the live weather layer)

Read the live conditions block on the page first. The podium is exposed harbour edge: wind off the water in every season, and rain arrives fast off the harbour. For tours, comfortable shoes for the stairs; for evening performances, the precinct is smart-casual in practice. In summer heat, sun protection for the podium and the walk from Circular Quay.

## Myth vs Fact

**Myth: The shells are sails copied from yachts on the harbour. — PARTLY TRUE.** Utzon never confirmed a single source: peeled orange segments, Mayan platforms and the harbour's sails are all cited. What is certain is the geometry — every shell is a slice of one sphere. *(Myth: popular account; correction: Wikipedia — "Sydney Opera House", as recorded in the data row.)*

**Myth: Utzon was fired for incompetence. — FALSE.** He resigned after a new state government withheld payments and refused his fee claim, amid a political fight over costs — a dispute about money and control, later widely regretted; New South Wales formally reconciled with him in the 1990s. *(Wikipedia — "Sydney Opera House".)*

**Myth: The acoustics were always perfect. — FALSE.** The halls' acoustics were long criticised, and the Concert Hall underwent a major renewal, completed in 2022, that rebuilt its acoustic reflectors and staging — the sound today is a 2020s achievement, not a 1973 one. *(Wikipedia — "Sydney Opera House".)*

## Sources
- Wonder data row: `supabase/migrations/0011_wonders_batch2.sql` (UNESCO site 166; Sydney Opera House; myths as recorded)
- Visitor guide: Sydney Opera House official tour information (sydneyoperahouse.com) and its published tour conditions, checked live 2026-10-22 — one-hour guided tours, Welcome Centre departure, ~300 stairs, mobility tours by pre-booking
- Place data row: `src/lib/data/places-batch2/` (Wikidata Q45178; inception 1973 = opening year, as used in the Story; architects Utzon and Hall)

*Written 2026-10-22. Content bank — not published.*
