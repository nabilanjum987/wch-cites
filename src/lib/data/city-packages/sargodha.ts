// City data package — Sargodha (BUILD ONLY, Round 2 extension R4B). See types.ts.
import type { CityPackage } from './types';

export const SARGODHA: CityPackage = {
  "identity": {
    "name": "Sargodha",
    "city_slug": "sargodha",
    "country": "Pakistan",
    "country_code": "PK",
    "country_slug": "pakistan",
    "province": "Punjab",
    "province_slug": "punjab",
    "lat": 32.0836,
    "lng": 72.6711,
    "population": 872557,
    "timezone": "Asia/Karachi",
    "major_religion": "Islam",
    "religion_percent": null,
    "primary_color": "#01411C",
    "secondary_color": "#FFFFFF",
    "famous_for": "Kinnow citrus and the Pakistan Air Force — the City of Eagles",
    "famous_products": "Kinnow oranges, citrus, Shezan juices",
    "emergency_police": "15",
    "emergency_ambulance": "1122",
    "emergency_fire": "16",
    "region": "South Asia",
    "is_active": false
  },
  "economyCountryIso2": "PK",
  "glanceFacts": [
    {
      "label": "Province",
      "value": "Punjab"
    },
    {
      "label": "Population (2017 census)",
      "value": "872,557"
    },
    {
      "label": "Elevation",
      "value": "190 m"
    },
    {
      "label": "City area",
      "value": "155 km²"
    },
    {
      "label": "Timezone",
      "value": "Asia/Karachi (PKT, UTC+5)"
    },
    {
      "label": "Known as",
      "value": "City of Eagles — PAF base, Kirana Hills and the kinnow capital"
    }
  ],
  "foods": [
    {
      "name": "Kinnow oranges",
      "note": "Sargodha is regarded as Pakistan’s best citrus belt — its kinnow is exported worldwide and gives the city its “California of Pakistan” nickname."
    },
    {
      "name": "Fresh citrus juices",
      "note": "Juice plants including Shezan operate in Sargodha; fresh kinnow juice is a winter staple across the city’s bazaars."
    },
    {
      "name": "Halwa puri breakfast",
      "note": "The classic Punjabi weekend breakfast served across the old city’s fifteen bazaars."
    },
    {
      "name": "Lassi",
      "note": "Thick sweet or salted lassi, the standard companion to a Sargodha breakfast."
    }
  ],
  "landmarks": [
    {
      "name": "Kirana Hills",
      "note": "The ancient hill range at the city’s edge — its dark rocks are among the oldest geological formations in Punjab."
    },
    {
      "name": "PAF Base Mushaf",
      "note": "One of the Pakistan Air Force’s principal bases, named for Air Chief Marshal Mushaf Ali Mir — the source of the “City of Eagles” identity."
    },
    {
      "name": "University of Sargodha",
      "note": "The public university (est. 2002) that anchors the city’s education sector for the whole division."
    },
    {
      "name": "The Fifteen Bazaars",
      "note": "Sargodha’s named bazaars — Urdu Bazaar for books, Sarafa for jewellery, Kachehry for food — each specialised by trade."
    }
  ],
  "emergency": {
    "police": "15",
    "ambulance": "1122",
    "fire": "16",
    "rescueNote": "Rescue 1122 operates across Punjab, including Sargodha.",
    "hospitals": [
      {
        "name": "DHQ Teaching Hospital Sargodha",
        "note": "The city’s principal public teaching hospital, on Mianwali Road."
      },
      {
        "name": "Combined Military Hospital Sargodha",
        "note": "The military hospital serving the Sargodha garrison."
      }
    ]
  },
  "personalitySeeds": [
    {
      "name": "Muhammad Hafeez",
      "field": "Cricketer",
      "note": "Born in Sargodha (1980); Pakistan all-rounder and former T20 captain.",
      "source": "Wikipedia: Mohammad Hafeez"
    },
    {
      "name": "Feroz Khan Noon",
      "field": "Prime Minister of Pakistan (1957–58)",
      "note": "From Shahpur district — the Sargodha region — which he represented; Pakistan’s seventh prime minister.",
      "source": "Wikipedia: Feroz Khan Noon"
    },
    {
      "name": "Mushaf Ali Mir",
      "field": "Air Chief Marshal",
      "note": "Air chief (2000–2003); PAF Base Mushaf in Sargodha is named for him after his death in service — a city association, recorded as such.",
      "source": "Wikipedia: Mushaf Ali Mir"
    }
  ],
  "sources": [
    {
      "group": "identity (coords, population, elevation)",
      "source": "Wikidata Q855997 + Wikipedia city article",
      "detail": "Coordinates P625 32.0836, 72.6711 (matches the article infobox). Population: the article’s census table gives the CITY at 872,557 in 2017 (PBS), used here; Wikidata P1082 carries 659,862 (a narrower boundary) — variant recorded. Elevation 190 m (article, NOAA-cited). City area 155 km² (article). Pulled and cross-read 2026-10-22."
    },
    {
      "group": "emergency numbers",
      "source": "Pakistan national emergency numbers",
      "detail": "Police 15, ambulance/rescue 1122, fire 16 — the same national set the published city pages carry."
    },
    {
      "group": "hospitals",
      "source": "Wikipedia city article / institutional record",
      "detail": "Public hospitals named in the city article or the institution’s own record; spot-check at activation."
    },
    {
      "group": "foods, landmarks",
      "source": "Wikipedia city article",
      "detail": "Editorially compiled 2026-10-22; spot-check at activation (build-only package; nothing renders from this file yet)."
    },
    {
      "group": "personality seeds",
      "source": "Per-seed source recorded on each seed",
      "detail": "Seeds only — full verified profiles are the personalities pipeline’s job (R6 pattern); batch-2 seeds get their Wikidata verification in the R6B extension card."
    },
    {
      "group": "religion_percent",
      "source": "OPEN FIELD",
      "detail": "Per-city religion share NOT set: no per-city source was verified this pass, so the field is null rather than an invented number. Activation must source it from PBS census tables. (major_religion is the template’s country-level descriptor.)"
    }
  ],
  "verifiedAt": "2026-10-22"
};
