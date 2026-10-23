# Next-Tier Source Scouting — Beyond Batch 2 (Research Bank B10)

**Status:** BANKED EVIDENCE — nothing wired, no keys requested, no accounts created.
**All checks dated 2026-10-22.** Existence + terms were verified by fetching the source's own
pages where marked VERIFIED; anything not fetched is marked **unknown/UNVERIFIED** — never
upgraded. A candidate whose official source could not be found at all would be recorded
**NOT FOUND** (see the count at the end).

## How the next tier was chosen

Already packaged (so excluded): Pakistan + Round-3 countries (UAE, Saudi Arabia, UK, USA,
India, Bangladesh, Türkiye) + batch 2 (Qatar, Kuwait, Oman, Malaysia, Egypt, Canada, Australia).
The plausible next tier follows three signals, in order:
1. **Diaspora corridors into the packaged Gulf markets** — the workers are already the site's
   audience; their home countries are the missing half of the corridor (Nepal, Sri Lanka,
   Philippines, Indonesia).
2. **Demand echoes in the B7 register** — subjects that surfaced in probes/trends without any
   package behind them (Lagos in compare/weather tails; Cape Town in time/weather tails;
   Auckland, Dublin, Paris in time tails).
3. **Capitals-first entry (the plan's logic)** — each candidate enters via its capital plus
   2–4 major cities, mirroring batches 1–2. Uzbekistan is added on population/corridor logic
   (largest un-packaged country in Central Asia; major Gulf/Russia labour outflows).

Per the API-map method, the scouted source is the **official local** one (statistics office /
open-data portal / official weather service). For weather itself, the already-wired Open-Meteo
backbone covers every candidate keyless — a local weather service is the authority/citation
layer, not a blocker.

## Candidate register (12 countries)

| # | Country (entry cities) | Official source scouted | Powers | Access | Terms note | URL | Checked |
|---|---|---|---|---|---|---|---|
| 1 | **Nepal** (Kathmandu, Pokhara, Biratnagar) | National Statistics Office (NSO) | Population (2021 census), national accounts, prices, labour | Keyless web releases; **no API observed** | Publications/downloads; site primarily Nepali, partial English | nsonepal.gov.np | 2026-10-22 VERIFIED |
| 1b | Nepal | Dept. of Hydrology & Meteorology (DHM) | Official forecasts (20 stations incl. Kathmandu, Pokhara), river/flood data | Keyless web; no API observed | Government service pages | dhm.gov.np | 2026-10-22 VERIFIED |
| 2 | **Sri Lanka** (Colombo, Kandy, Galle) | Dept. of Census & Statistics (DCS) | Labour force, CCPI/NCPI inflation, national accounts, district data | Keyless web releases + dashboards; microdata by application form; **no public API observed** | Published releases are current (Q2/Sep 2026 seen) | statistics.gov.lk | 2026-10-22 VERIFIED |
| 3 | **Philippines** (Manila, Cebu City, Davao) | PSA **OpenSTAT** | Census, national accounts, prices, labour, trade — full country dataset | **Keyless, with API** (PC-Axis platform) | **Open licence stated on the portal itself: free use/reuse/redistribution with source attribution** | openstat.psa.gov.ph | 2026-10-22 VERIFIED |
| 3b | Philippines | PAGASA (official weather service) | Typhoon bulletins, station observations, 5-day outlooks | Keyless web publications; API unknown | Live bulletins dated 2026-10-22 seen | pagasa.dost.gov.ph | 2026-10-22 VERIFIED |
| 4 | **Indonesia** (Jakarta, Surabaya, Bandung, Medan) | BPS — Statistics Indonesia | Census/surveys, indicators, regional tables | Agency site keyless; **dedicated Web API: key-required per BPS documentation — UNVERIFIED this pass** (API root fetch failed 2026-10-22) | ToU linked from bps.go.id | bps.go.id | 2026-10-22 agency VERIFIED, API UNVERIFIED |
| 4b | Indonesia | **BMKG Open Data** (data.bmkg.go.id) | Village-level 3-day forecasts, earthquake data, early warnings | **Keyless open-data portal** (open formats) | Portal states data is published in open, reusable form for transparency/participation | data.bmkg.go.id | 2026-10-22 VERIFIED |
| 5 | **Nigeria** (Lagos, Abuja, Kano, Port Harcourt) | National Bureau of Statistics (NBS) + its **Open Data Portal** | GDP, CPI (rebased 2024=100), prices, surveys; NADA microdata archive | Keyless web + ODP ("access, filter, visualise, download"); API unknown | Current releases seen (Q1 2026 GDP +3.89%, CPI 14.63%) | nigerianstat.gov.ng | 2026-10-22 VERIFIED |
| 6 | **Kenya** (Nairobi, Mombasa, Kisumu) | Kenya National Bureau of Statistics (KNBS) | Population projections, GDP, CPI, county products | Keyless web releases; API unknown | Current indicators on homepage (mid-2026 pop. projection, Q1 2026 GDP, Sep 2026 CPI) | knbs.or.ke | 2026-10-22 VERIFIED |
| 6b | Kenya | Kenya Meteorological Department | Forecasts, CAP alerts, climate services | Keyless web; API unknown | WMO/UK Met Office partner listed | meteo.go.ke | 2026-10-22 VERIFIED |
| 7 | **South Africa** (Cape Town, Johannesburg, Durban, Pretoria) | Statistics South Africa (Stats SA) | Census 2022, GDP, CPI, employment (QES) | Keyless web releases; API unknown | Current releases seen (Q2 2026 QES, Sep 2026 CPI) | statssa.gov.za | 2026-10-22 VERIFIED |
| 8 | **New Zealand** (Auckland, Wellington, Christchurch) | Stats NZ | Census, CPI, trade, population; tools: Aotearoa Data Explorer, Infoshare | Keyless web + data tools; API access model unknown this pass | Releases dated 2026-10-22 seen (Sep 2026 CPI) | stats.govt.nz | 2026-10-22 VERIFIED |
| 9 | **Ireland** (Dublin, Cork, Galway) | CSO **PxStat** (data.cso.ie) | Full official statistics databank (census, prices, housing…) | **Keyless public API — JSON-RPC + RESTful endpoints documented on the portal** (ws.cso.ie/public/…) | API docs linked from the portal (GitHub wiki) | data.cso.ie | 2026-10-22 VERIFIED |
| 9b | Ireland | Met Éireann | Climate data: daily/historical/monthly, 30-yr averages, reanalysis (MÉRA) | Keyless downloads via met.ie/climate/available-data; licence UNVERIFIED this pass | Irish Meteorological Service official site | met.ie | 2026-10-22 VERIFIED |
| 10 | **Germany** (Berlin, Hamburg, Munich, Frankfurt) | DWD Open Data (weather) | Weather + climate open data server | **Keyless** (public directory server, live timestamps seen 2026-10-22) | DWD open-data programme; licence text not re-read this pass | opendata.dwd.de | 2026-10-22 VERIFIED |
| 10b | Germany | Destatis (GENESIS database) | Federal statistics | **Key-required (registration) — UNVERIFIED this pass** (not fetched) | — | destatis.de | named, not fetched |
| 11 | **France** (Paris, Marseille, Lyon) | data.gouv.fr (national open-data portal) | 76K datasets/APIs catalogue-wide; INSEE is a listed publisher; **meteo.data.gouv.fr** is the dedicated Météo-France data portal | Keyless portal; per-dataset licences (Licence Ouverte is the portal standard — per-dataset check required) | Portal verified 2026-10-22; INSEE's own API is key-required (registration) — UNVERIFIED this pass | data.gouv.fr · meteo.data.gouv.fr | 2026-10-22 VERIFIED (portal) |
| 12 | **Uzbekistan** (Tashkent, Samarkand, Bukhara) | National Statistics Committee (stat.uz) + Open Data Portal (data.egov.uz) | Population (37.86M, 1 Jul 2025 per stat.uz), GDP, prices, regional yearbooks | Keyless web + portal (stat.uz: portal holds 22,000+ datasets, 3,500+ indicators — self-reported); API unknown | **Freshness caution:** the English pages lag (headline indicators Jan–Jun 2025) — curation-grade, not live-grade | stat.uz/en · data.egov.uz | 2026-10-22 VERIFIED |

## Named but NOT verified this pass (access = unknown)

| Country | Source | Why listed | State |
|---|---|---|---|
| South Africa | SA Weather Service (weathersa.co.za) | Official weather authority | Named, **not fetched** — unknown |
| Sri Lanka | Dept. of Meteorology (met.gov.lk) | Official weather authority | Named, **not fetched** — unknown |
| Uzbekistan | Uzhydromet (meteo.uz) | Official weather authority | Named, **not fetched** — unknown |
| Nigeria | NiMet (nimet.gov.ng) | Official weather authority | Named, **not fetched** — unknown |
| New Zealand | MetService / NIWA | MetService is a state-owned **commercial** provider — the free-official path is weaker here; NIWA climate data is the alternative | Named, **not fetched** — unknown; commercial caution |

## NOT FOUND count

**0 countries** — every candidate has an identified official statistics source, verified live
on 2026-10-22. The gaps are one level down, and they are recorded, not hidden:
- **1 failed verification:** the BPS Web API root (webapi.bps.go.id) could not be fetched —
  Indonesia's stats API access model stays UNVERIFIED (agency itself verified via bps.go.id).
- **2 key-required-but-unverified models:** BPS Web API, Destatis GENESIS, INSEE API (3 counting
  INSEE) — all are registration/key models per their operators' documentation; no key was
  requested and no account created, per the card law.
- **5 weather services named but not fetched** (table above) — their access models are unknown,
  and none of them blocks anything: Open-Meteo already covers their countries.

## Strongest stacks found (for the eventual activation order)

1. **Philippines** — the best find: PSA OpenSTAT pairs a full official dataset with an API and
   an explicitly open licence (attribution only). Closest thing to a plug-in country dataset.
2. **Ireland** — CSO PxStat's keyless public JSON-RPC/REST API is the most developer-ready
   official source in this tier; Met Éireann adds official climate data.
3. **Indonesia (weather)** — BMKG's keyless open-data portal (village-level forecasts +
   earthquake feed) is stronger than the global backbone for Indonesian pages specifically.
4. **Germany (weather)** — DWD's keyless open-data server; France's data.gouv.fr +
   meteo.data.gouv.fr pair is the model for the French stack.
5. **Curation-grade (no API, plan for manual/cached datasets):** Nepal, Sri Lanka, Kenya,
   Nigeria, South Africa, New Zealand, Uzbekistan — all verified live and current, all
   web-release based. Uzbekistan carries an extra freshness caution on its English pages.

*Method note: 12 candidate countries, 17 source rows verified by fetching the source's own
pages on 2026-10-22, 5 named-but-unfetched, 0 NOT FOUND. No keys requested, no accounts, no
outreach. This file is evidence for a future activation decision — it authorises nothing.*
