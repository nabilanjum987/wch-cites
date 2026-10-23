# Monthly Horoscope Production Framework — from the R8 Computed-Transit System

*For entertainment: monthly horoscope content produced under this framework is presented for enjoyment, in the tradition of popular astrology. It must never be presented as fact, prediction or advice about any individual. This framework document is the production method; it is banked with the evergreen profiles in this directory.*

## What the system is

The site's horoscope engine (built in Round 2's horoscope card, implemented in `src/lib/transits.ts`) does not scrape or invent planetary positions. It **computes** them: geocentric ecliptic longitudes derived from Keplerian orbital elements following Paul Schlyter's published method ("How to compute planetary positions"), giving arcminute-class accuracy — good enough that the geometry the prose describes is the geometry that actually obtains on the stated date. Positions are labelled **computed** wherever they are used. That labelling rule is absolute: nothing in the output may imply the positions were observed, channelled or received from any other source.

**Deliberate omission:** Pluto is not computed. Scorpio is therefore read through its traditional ruler, Mars, and the evergreen profiles in this bank say so. The planet set is: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune.

## Inputs (daily engine)

1. The date (and the reader's sign).
2. Computed longitudes of the nine bodies for that date (Schlyter elements, geocentric ecliptic).
3. The sign rulers used by the system: Aries–Mars, Taurus–Venus, Gemini–Mercury, Cancer–Moon, Leo–Sun, Virgo–Mercury, Libra–Venus, Scorpio–Mars, Sagittarius–Jupiter, Capricorn–Saturn, Aquarius–Uranus, Pisces–Neptune.

## Derivation rules (as implemented — do not improvise new ones)

- **Aspects:** conjunction, sextile, square, trine, opposition between computed positions, at a 6° orb (8° when the Sun or Moon is involved). Each aspect carries a strength that decays with orb distance.
- **Domain meters** (overall, love, career, health, finance, spirituality; scale 1–5): for each domain, take the aspects touching that domain's planets; the meter = clamp(3 + 0.9 × harmonious strength − 0.9 × tense strength), rounded into the 1–5 band. Neutral geometry yields a 3 — the scale is honest about ordinary days.
- **Lucky number:** 1 + (⌊Moon longitude × 3⌋ + ⌊ruler longitude × 7⌋) mod 99.
- **Lucky colour:** the colour of the planet in the tightest aspect to the sign's ruler (planet colours: Sun Gold, Moon Silver, Mercury Yellow, Venus Emerald Green, Mars Red, Jupiter Royal Purple, Saturn Charcoal, Uranus Turquoise, Neptune Sea Blue).
- **Best time:** the Moon–Sun elongation ÷ 15°, read as an hour of the day.
- **Lucky direction:** the Sun's 45° sector mapped to the compass.
- **Mood:** the element of the Moon's sign that day — fire: Energetic, earth: Calm, air: Curious, water: Reflective.
- **Compatibility / challenge signs:** signs whose rulers aspect the reader's ruler that day; if none do, a geometric fallback (trine signs for compatibility, square signs for challenge).
- **Narrative selection:** a deterministic index — (aspect count + ⌊Moon longitude ÷ 30⌋) mod 3 — chooses which of the prepared narrative frames the day's prose is built from, so identical inputs always produce identical output.

## Extending the daily engine to a monthly product

A monthly reading is an **aggregation of the same computations**, not a new kind of claim:

1. **Run the daily engine for every day of the month** for the reader's sign. No input enters the monthly text that the daily engine did not compute.
2. **Monthly themes from geometry that actually occurs in the month:** the sign's ruler changing sign (ingress), the ruler's strongest harmonious and tense aspect days, the Moon's phases as they fall in the sign's houses of the tradition, and any day the monthly meter-average for a domain peaks or troughs. Name the dates — they are computed, and computable by any reader.
3. **Monthly meters:** the mean of the daily meters per domain, rounded — labelled as computed aggregates.
4. **Lucky elements for the month:** the month's modal lucky colour and the number derived from the month's mean Moon and ruler longitudes, using the same formulas. Do not invent a separate monthly formula.
5. **Prose:** written from the prepared narrative frames and the evergreen sign profile banked beside this framework (traits, career and relationship registers), so a monthly Leo reads like Leo — warm, solar, recognition-hungry — in every month's geometry.

## Labelling and ethics rules (binding on all output)

- Every monthly page carries the entertainment framing line used in this bank.
- Positions and aspect dates are labelled **computed** (Schlyter/Keplerian method), never "the stars say" as a factual register.
- **No medical, financial or legal directives.** Health and finance meters are described as mood-and-focus language only; prose must never tell a reader to make, delay or avoid a real-world decision of consequence.
- No dated claims enter the evergreen bank: dated material lives only in the dated product itself, generated per month from the engine.
- Determinism is a feature: the same month and sign always regenerates the same reading. If a figure in a draft cannot be traced to the engine's formulas above, it comes out.

## Sources
- `src/lib/transits.ts` — the R8 computed-transit implementation in this repo (Schlyter's "How to compute planetary positions": Keplerian elements, geocentric ecliptic longitudes; aspect orbs 6°/8°; derivation formulas as documented in the code and summarised above).
- The twelve evergreen sign profiles banked in this directory (content-bank/horoscope/).

*Written 2026-10-22. Content bank — not published.*
