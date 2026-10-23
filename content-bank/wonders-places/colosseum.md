# Colosseum — Wonder & Place Content Bank

*Banked content for the Colosseum page. Built from the Round 2 wonder data row (migration 0008, verified) and the Round 3 place row; nothing here is wired to a live route.*

## The Story

The Colosseum — the Flavian Amphitheatre — is the largest ancient amphitheatre ever built: an elliptical arena of travertine, tuff and brick-faced concrete, 189 by 156 metres and 48 metres high, opened by the emperor Titus in AD 80 after construction begun under his father Vespasian in AD 72. It held around 50,000 spectators for gladiatorial contests, wild-beast hunts, dramas and, in its first days, even staged sea battles.

Rome's emperors built it as a gift to the Roman people on the grounds of Nero's hated palace — the Colossus statue next door gave it the name it still carries. Earthquakes (the 1349 quake brought down the southern outer ring) and stone-robbers took much of it, yet it remains the standing symbol of imperial Rome, inside UNESCO's Historic Centre of Rome listing (site 91, inscribed 1980), and one of the New7Wonders of the World since 2007. Italy's most visited monument draws over seven million visitors a year (Wikidata records 7.4 million).

## Visitor guide

**Best time.** The Colosseum opens daily from the morning; closing follows the sunset through the seasons, and the last entry is one hour before closing. It closes on 25 December and 1 January. In summer the stone bowl is a furnace by midday (see the live weather block) — early slots are the sane choice. The official park site (Parco archeologico del Colosseo) publishes the current timetable.

**How to reach.** Entry is by timed slot bought through the official ticketing site — timed booking is effectively mandatory in season; the ticket typically covers the Roman Forum and Palatine Hill within 24 hours. Entrances face the Arch of Constantine side; security screening queues build from mid-morning. Fees are deliberately not printed here — the packaged data row carries none verified.

## What to wear (framework — keyed to the live weather layer)

Read the live conditions block first. The arena bowl holds summer heat: light clothing, hat, sunscreen and water for warm days, and expect unshaded queueing. In rain, the ancient stone underfoot is worn smooth — shoes with grip. In the winter band, the open bowl is windy: a proper layer, not a t-shirt-and-hope. Comfortable walking shoes in all seasons — the Forum and Palatine continue the same visit on ancient paving.

## Myth vs Fact

**Myth: Every gladiator fight ended in death — "thumbs down" meant kill him. — FALSE.** Gladiators were expensive trained assets; most bouts did not end in death, and a defeated fighter who had fought well was commonly spared (missio). The thumb gestures are poorly attested — the fatal signal may have been a thumb turned toward the throat, and "thumbs down" may have meant the opposite of the Hollywood version. *(Myth: film tradition; correction: historians' consensus, as recorded in the data row.)*

**Myth: Christians were martyred in the Colosseum. — FALSE (as documented fact).** No ancient source records Christian executions in the Colosseum; the tradition grew in later centuries. The association is post-antique, however sincerely held. *(Historians' consensus, as recorded in the data row.)*

**Myth: The Colosseum was flooded to stage sea battles. — TRUE.** Cassius Dio and Suetonius record naumachiae in the amphitheatre's earliest years, before Domitian built the hypogeum under the arena floor; the basin could be filled from the aqueduct supply and drained rapidly. *(Cassius Dio; Suetonius.)*

## Sources
- Wonder data row: `supabase/migrations/0008_wonders_batch1.sql` (UNESCO site 91; Parco archeologico del Colosseo official; Cassius Dio; Suetonius)
- Place data row: `src/lib/data/places/` (Wikidata Q10285). The place row's inception value (AD 82) is the completion under Domitian; the wonder row's AD 72–80 construction/opening governs the Story.

*Written 2026-10-22. Content bank — not published.*
