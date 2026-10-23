# Hagia Sophia — Wonder & Place Content Bank

*Banked content for the Hagia Sophia page. Built from the Round 2 wonder data row (migration 0011, verified) and the Round 3 place row; the visitor guide is completed from the Turkish Ministry of Culture and Tourism's visitor arrangement, checked live on 2026-10-22 (the data row's visitor fields were generic). Nothing here is wired to a live route.*

## The Story

Hagia Sophia — the Church of the Holy Wisdom — was built in Constantinople in just five years, from 532 to 537, on the orders of the emperor Justinian I. Its architects, Anthemius of Tralles and Isidore of Miletus, were mathematicians, and their vast dome — 31 metres across, its crown 55 metres above the floor, floating on a ring of forty windows — seemed to contemporaries to hang from heaven by a chain. In 537 Justinian is said to have whispered, "Solomon, I have surpassed thee."

For nearly a thousand years it was the largest cathedral in the world and the seat of the Ecumenical Patriarch. In 1453 it became an imperial Ottoman mosque, gaining its minarets, mihrab and great calligraphic roundels; Mimar Sinan's buttresses still brace it. In 1935 the Turkish Republic made it a museum, and in 2020 it returned to use as a mosque, with its Byzantine mosaics preserved under a managed arrangement. It stands within the Historic Areas of Istanbul, UNESCO site 356 (inscribed 1985).

## Visitor guide

**How visiting works now.** Hagia Sophia is a working mosque, and since 15 January 2024 the visitor arrangement is a two-route system set by the Turkish Ministry of Culture and Tourism: worshippers use the ground floor for prayer, free of charge; **foreign visitors use a separate entrance and pay a fee (€25 at the time of writing — confirm the current figure on the official DEM Museums page before you go) for the upper gallery visiting area**, which is where the famous mosaics and the great views down into the nave are. The ground floor is not part of the tourist route. The visitor area closes around the five daily prayer times and for a longer midday period on Fridays (roughly 12:30–14:30), so time a visit for the morning or late afternoon, outside prayer windows.

**How to reach.** Sultanahmet Square, Istanbul — the ticket point for the visitor entrance is on the building's north-east side, near the Fountain of Sultan Ahmed III. The same square holds the Blue Mosque (banked separately in this set) and Topkapi Palace.

## What to wear (framework — keyed to the live weather layer)

Read the live conditions block on the page first, then the dress rules, which apply regardless of weather: this is an active mosque. Shoulders and knees must be covered by all visitors, and women cover their hair with a scarf — bring your own coverings, as they are not reliably loaned at this entrance. In summer heat, choose light, breathable clothing that still meets the dress code; in winter, the gallery is cool stone — carry the layer in with you.

## Myth vs Fact

**Myth: The dome is held up by a golden chain from heaven. — FALSE.** A medieval description of its floating effect, not engineering: the dome is carried by pendentives and piers, and has been repaired after earthquakes many times — including a partial collapse in 558, rebuilt by Isidore the Younger. *(Myth: medieval description; correction: Wikipedia — "Hagia Sophia", as recorded in the data row.)*

**Myth: It was built as a mosque. — FALSE.** It was a Christian cathedral for 916 years before becoming a mosque in 1453 — the minarets, mihrab and roundels are Ottoman additions to a Byzantine church. *(Wikipedia — "Hagia Sophia".)*

**Myth: The mosaics were destroyed. — FALSE.** Many were covered — plastered or veiled — rather than destroyed, which is why conservators could uncover the apse Virgin, the Deësis and the imperial portraits in the 20th century; the present arrangement keeps them preserved. *(Wikipedia — "Hagia Sophia".)*

## Sources
- Wonder data row: `supabase/migrations/0011_wonders_batch2.sql` (UNESCO site 356; facts and myths as recorded)
- Visitor guide: Turkish Ministry of Culture and Tourism visitor arrangement in force since 15 January 2024 (separate visitor entrance; upper-gallery ticket for foreign visitors; prayer-time closures), checked live 2026-10-22 — fee figure stated as at time of writing, to be re-verified at page build
- Place data row: `src/lib/data/places/` (Wikidata Q12506: consecrated 537; Byzantine basilica; brick; height 55 m — consistent with the wonder row)

*Written 2026-10-22. Content bank — not published.*
