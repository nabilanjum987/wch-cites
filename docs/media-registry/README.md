# WorldCityHub Media Registry — Image Bank (Harvest Only)

Built 2026-10-22 (Round 4, card T1). This registry **records** licensed
images; it does not republish them. Every usable record carries the
file's own Wikimedia Commons metadata: direct URL, source (file) page,
creator, licence, a ready-made attribution string, alt text, role
(hero / gallery / panel / detail), dimensions where known, and the
file's SHA-1 content hash from the Commons API.

## Rules

- A record is `VERIFIED` only when the file's own metadata states a
  freely reusable licence (CC BY, CC BY-SA, CC0, public domain) **and**
  a creator. Anything else is listed under `rejected` in the subject
  file, with the reason (non-free licence, no creator recorded,
  resolution too low, not a photo).
- One record is `UNVERIFIED`: the Allama Iqbal profile portrait in use
  on the live site. Its licence/credit were never recorded in the seed
  data (flagged in the Round 1 day log). It is **not** cleared for any
  new use until its licence is established.
- Imran Khan: no image exists in the seed data. Recorded as `pending`
  with zero records — nothing was substituted.
- `focal_point` is `null` everywhere: Commons metadata does not state
  one for these files, and none was invented.
- Coverage below describes **imagery only**. "Partial" means the image
  set is harvested and licence-verified, while the subject's data
  package is built by another stream (Rounds 2–3, in parallel) and is
  not yet merged or audited. This registry activates nothing.

## Files

- `index.json` / `index.csv` — every record, flat.
- `subjects/<slug>.json` — one file per subject: records + rejected
  candidates with reasons.

## Coverage (2026-10-22)

| Subject | Type | Package | Coverage | Verified records |
|---|---|---|---|---|
| Lahore | city | Round 1 (published) | complete | 7 |
| Karachi | city | Round 1 (published) | complete | 6 |
| Islamabad | city | Round 1 (published) | complete | 6 |
| Taj Mahal | wonder | Round 1 (published) | complete | 8 |
| Arabian Sea | ocean | Round 1 (published) | complete | 4 |
| Allama Iqbal | personality | Round 1 (published) | partial — 1 image UNVERIFIED (licence unrecorded) | 0 |
| Imran Khan | personality | Round 1 (published) | pending — no image in seed data | 0 |
| Great Wall of China | wonder | Round 2 R2 batch 1 | partial | 5 |
| Eiffel Tower | wonder/place | Round 2 R2 + Round 3 S3 | partial | 5 |
| Pyramids of Giza | wonder | Round 2 R2 batch 1 | partial | 5 |
| Burj Khalifa | wonder | Round 2 R2 batch 1 | partial | 5 |
| Christ the Redeemer | wonder | Round 2 R2 batch 1 | partial | 5 |
| Colosseum | wonder | Round 2 R2 batch 1 | partial | 5 |
| Machu Picchu | wonder | Round 2 R2 batch 1 | partial | 5 |
| Pacific Ocean | ocean | Round 2 R3 batch 1 | partial | 4 |
| Atlantic Ocean | ocean | Round 2 R3 batch 1 | partial | 4 |
| Indian Ocean | ocean | Round 2 R3 batch 1 | partial | 4 |
| Arctic Ocean | ocean | Round 2 R3 batch 1 | partial | 4 |
| Southern Ocean | ocean | Round 2 R3 batch 1 | partial | 4 |
| Multan | city | Round 2 R4 package | partial | 5 |
| Faisalabad | city | Round 2 R4 package | partial | 5 |
| Peshawar | city | Round 2 R4 package | partial | 5 |
| Quetta | city | Round 2 R4 package | partial | 5 |
| Rawalpindi | city | Round 2 R4 package | partial | 5 |
| Hyderabad (Sindh) | city | Round 2 R4 package | partial | 5 |
| Sialkot | city | Round 2 R4 package | partial | 5 |
| Gujranwala | city | Round 2 R4 package | partial | 5 |
| Dubai | city | Round 3 S2 package | partial | 5 |
| Abu Dhabi | city | Round 3 S2 package | partial | 5 |
| Sharjah | city | Round 3 S2 package | partial | 5 |
| Riyadh | city | Round 3 S2 package | partial | 4 |
| Jeddah | city | Round 3 S2 package | partial | 4 |
| Doha | city | Round 3 S2 package | partial | 5 |
| Istanbul | city | Round 3 S2 package | partial | 5 |
| London | city | Round 3 S2 package | partial | 5 |
| New York | city | Round 3 S2 package | partial | 5 |
| Toronto | city | Round 3 S2 package | partial | 5 |
| Sydney | city | Round 3 S2 package | partial | 5 |
| Badshahi Mosque | place | Round 3 S3 batch 1 | partial | 5 |
| Faisal Mosque | place | Round 3 S3 batch 1 | partial | 5 |
| Statue of Liberty | place | Round 3 S3 batch 1 | partial | 5 |
| Big Ben / Palace of Westminster | place | Round 3 S3 batch 1 | partial | 5 |
| Hagia Sophia | place | Round 3 S3 batch 1 | partial | 5 |
| Sheikh Zayed Grand Mosque | place | Round 3 S3 batch 1 | partial | 5 |
| CN Tower | place | Round 3 S3 batch 1 | partial | 5 |
| Sydney Opera House | place | Round 3 S3 batch 1 | partial | 5 |
| Blue Mosque (Sultan Ahmed Mosque) | place | Round 3 S3 batch 1 | partial | 5 |

**Totals: 47 subjects · 225 records · 224 VERIFIED · 1 UNVERIFIED ·
~40 rejected candidates (reasons recorded per subject).**
