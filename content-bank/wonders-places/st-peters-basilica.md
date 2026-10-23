# St Peter's Basilica — Wonder & Place Content Bank

*Banked content for the St Peter's Basilica page. Built from the Round 2 wonder data row (migration 0011, verified) and the Round 3 place row; the visitor guide is completed from the Basilica's published visitor information, checked live on 2026-10-22 (the data row's visitor fields were generic). Nothing here is wired to a live route.*

## The Story

St Peter's Basilica in Vatican City is the largest church in the world by interior measure and the centre of Roman Catholic devotion. Raised over the Constantinian basilica that had stood for 1,200 years, the present church was begun in 1506 and consecrated in 1626 — a 120-year project that passed through Bramante, Raphael, Michelangelo and Bernini. The interior runs 186 metres; the church can hold over 60,000 people.

Michelangelo's dome, completed after his death by Giacomo della Porta, rises 136.6 metres to the cross and remains the tallest dome in the world. Inside are Michelangelo's Pietà — carved when he was 24 — Bernini's bronze Baldacchino over the papal altar, and beneath the altar the tomb traditionally identified as St Peter's. The basilica stands at the head of Bernini's elliptical square, within the Vatican City World Heritage Site (site 286, inscribed 1984). It is a pilgrimage church rather than Rome's cathedral — that honour belongs to St John Lateran.

## Visitor guide

**Best time.** Entry to the basilica is **free** — there is no admission ticket; the only queue is the security screening in St Peter's Square. Arrive at the 7:00 opening or in the late afternoon for the shortest waits; mid-morning queues in season can exceed an hour (the Basilica's own guidance puts average security waits around 1.5 hours at peak). The basilica opens daily at 7:00; closing varies by season — check the official site.

**How to reach and what to add.** Metro Line A to Ottaviano, then a ten-minute walk to the square; security checkpoints are in the right-hand colonnade. The **dome climb** is the one paid extra, ticketed separately (bookable online in season): 551 steps from the ground, or a lift to the roof terrace plus 320 steps; allow about an hour. The Vatican Grottoes beneath the basilica are free; St Peter's tomb itself (the Scavi necropolis) is a separate, advance-booked excavation tour. The Vatican Museums and Sistine Chapel are a different entrance and a different ticket.

## What to wear (framework — keyed to the live weather layer)

Read the live conditions block on the page first, then the dress code, which is strictly enforced at security regardless of weather: shoulders and knees must be covered for everyone — long trousers for men; trousers or below-the-knee skirts for women. In Rome's summer heat this is the standard visitor failure: carry a light scarf or wrap to cover shoulders, and choose longer, breathable clothing rather than being turned away at the door.

## Myth vs Fact

**Myth: It is the largest church ever built. — TRUE (with its qualifier).** Measured by interior volume and area, yes — St Peter's is the largest church in the world. Some churches seat more or stand taller, but none encloses more. *(Wikipedia — "St Peter's Basilica", as recorded in the data row.)*

**Myth: Michelangelo painted the ceiling here. — FALSE.** The famous ceiling is the Sistine Chapel's — a different room, in the Apostolic Palace next door, reached on the Vatican Museums route, not inside the basilica. Michelangelo's work *in* the basilica is the Pietà and the dome's design. *(Wikipedia — "St Peter's Basilica".)*

**Myth: St Peter is certainly buried under the altar. — PARTLY TRUE.** A tomb beneath the confessio was excavated in the 1940s and bones were later identified by the Vatican as the Apostle's; scholars remain divided. The honest statement is the tradition and the finding, not a certainty. *(Wikipedia — "St Peter's Basilica".)*

## Sources
- Wonder data row: `supabase/migrations/0011_wonders_batch2.sql` (UNESCO site 286; facts and myths as recorded)
- Visitor guide: St Peter's Basilica official visitor information (basilicasanpietro.va) and the Basilica's published FAQ, checked live 2026-10-22 — free entry, security queue, 7:00 opening, dome 551 steps / lift + 320, dress code
- Place data row: `src/lib/data/places-batch2/` (Wikidata Q12512: foundation 1506; Renaissance and Baroque; height 136.6 m)

*Written 2026-10-22. Content bank — not published.*
