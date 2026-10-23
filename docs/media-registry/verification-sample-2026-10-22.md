# Media Registry — Licence Re-Verification Sample — 2026-10-22

Round 4 verification pass (post–Batch 2). A random sample of 24
VERIFIED records (seed 42) drawn from both registry indexes
(batch 1 + batch 2) was re-checked against **live** Wikimedia
Commons `imageinfo`/`extmetadata` on 2026-10-22: for each record,
the licence and creator stored in the registry were compared with
the file's current Commons metadata.

**Result: 24 / 24 exact matches. Zero mismatches.**

Sample covered: the transferred golden records (Taj Mahal hero —
Yann Forget, CC BY-SA 4.0; Taj Mahal CC0 — Gary Todd), harvested
city records (Rawalpindi, Quetta, Sialkot, Ottawa, Melbourne),
wonder records (Great Wall, Pyramids of Giza, Machu Picchu ×2),
ocean records (Indian Ocean), place records (Badshahi Mosque,
Faisal Mosque ×2, Sydney Opera House), and batch-2 records
(Canberra).

Method note: creator strings were compared after HTML-stripping
and truncation-normalisation (Commons Artist fields sometimes
carry suffixes such as camera metadata). A record counted as
matching only when the licence string was identical AND the live
creator matched the stored creator. No record required correction;
the registry's `status: VERIFIED` markings stand for the sample.
The single UNVERIFIED record (Allama Iqbal) was excluded from the
sample by construction — it remains UNVERIFIED until its licence
is established.
