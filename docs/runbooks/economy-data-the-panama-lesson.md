# Runbook — Economy Data: the Panama Lesson

On 2026-10-22, Islamabad's economy page was found showing
**Panama's economy** — inflation −0.2%, unemployment 8.4%, GDP
$90B — while Lahore showed Pakistan's real 3.5% / 5.4% / $407B, and
Islamabad's own Misery table contradicted its own meter (spotted by
the controller, diagnosed under PC1, fixed in PR #11). This
runbook is the law that came out of it.

## The root cause (proven, not guessed)

`getMockCityData()` in `src/lib/getCityData.ts` derived the country
code by **truncating the country slug**: `"pakistan"` → `"PA"`.
"PA" is Panama's ISO 3166-1 alpha-2 code. Lahore and Karachi have
explicit mock entries carrying the correct `"PK"`, so they never
touched the broken path. Islamabad has no mock entry, so on any
Supabase miss the fallback handed the economy page Panama's code —
and the page trusted that code over the correct slug→ISO2 map,
fetching Panama's World Bank indicators. The Misery table used a
separate hard-coded correct code, which is why one page disagreed
with itself. The World Bank confirmed the diagnosis to the decimal:
PA = −0.19% / 8.36% / $90.46B; PK = 3.55% / 5.42% / ~$407B.

## The laws

1. **resolveIso2 law.** An ISO code comes ONLY from the explicit
   slug→ISO2 map (`resolveIso2()`). Never slice, truncate, or
   "derive" a code from a slug, a name, or a string prefix. Any
   new country enters the map deliberately, with its code checked
   against ISO 3166-1.
2. **One cached country dataset.** All economy surfaces for a
   country — the economy page, the stress meter, the Misery table,
   the city-main snapshot, the homepage economy panel — read ONE
   cached dataset: `getCountryEconomy()` (World Bank indicators,
   Next data-cache, revalidate ~24h). Two fetch paths for the same
   country's figures is a defect by definition, because they WILL
   diverge (the city-main snapshot previously used a divergent
   `mrv=1` path).
3. **Every figure carries its year.** World Bank data is annual;
   the latest value is labelled with its data year wherever it is
   shown. A missing or stale series hides the card — it never
   backfills with an older number dressed as current, and never
   with a static default. (The $90B ghost was a stale series
   trusted blindly.)
4. **Fallbacks never cross borders.** A fallback dataset keyed by
   anything looser than the full country slug + mapped ISO2 is
   forbidden. A silent fallback to a different country/province is
   the same defect family — see the ICT province page rendering
   Punjab (Q11): the correct behaviour is an honest "guide in
   preparation", never a neighbour's content.
5. **Derived figures derive from the same object.** Stress index,
   Misery index, and any computed score take their inputs from the
   same `getCountryEconomy()` result the page displays. A table
   that disagrees with the meter above it is the canary: treat any
   such report as a P1 investigation, not a rounding issue.

## How to verify a country's figures (10 minutes)

1. Pull the World Bank set directly:
   `api.worldbank.org/v2/country/<ISO2>/indicator/NY.GDP.MKTP.CD`
   (and `FP.CPI.TOTL.ZG`, `SL.UEM.TOTL.ZS`, `NY.GDP.PCAP.CD`) —
   note value + year.
2. Open the country's cities' economy pages and the city-main
   snapshots. Every figure must equal the set from step 1, on
   EVERY city of that country.
3. Check the derived displays (meter vs table) against the same
   numbers.
4. Any mismatch: find which fetch path produced it before fixing
   anything. The fix lands on the shared path, never as a
   per-page patch.

## If you remember one line

**A figure is only as trustworthy as the path that fetched it —
so there is exactly one path, and it starts from a map, never from
a substring.**
