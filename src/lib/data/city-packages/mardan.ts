// City data package — Mardan (BUILD ONLY, Round 2 extension R4B). See types.ts.
import type { CityPackage } from './types';

export const MARDAN: CityPackage = {
  "identity": {
    "name": "Mardan",
    "city_slug": "mardan",
    "country": "Pakistan",
    "country_code": "PK",
    "country_slug": "pakistan",
    "province": "Khyber Pakhtunkhwa",
    "province_slug": "khyber-pakhtunkhwa",
    "lat": 34.1958,
    "lng": 72.0447,
    "population": 363788,
    "timezone": "Asia/Karachi",
    "major_religion": "Islam",
    "religion_percent": null,
    "primary_color": "#01411C",
    "secondary_color": "#FFFFFF",
    "famous_for": "Gandhara heritage — Takht-i-Bahi monastery and the Shahbaz Garhi Ashoka edicts",
    "famous_products": "Sugar, tobacco, marble",
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
      "value": "Khyber Pakhtunkhwa"
    },
    {
      "label": "Population (2023 census)",
      "value": "363,788"
    },
    {
      "label": "Elevation",
      "value": "311 m"
    },
    {
      "label": "District role",
      "value": "Headquarters of Mardan District"
    },
    {
      "label": "Timezone",
      "value": "Asia/Karachi (PKT, UTC+5)"
    },
    {
      "label": "Known as",
      "value": "Second city of KP — gateway to Gandhara’s Takht-i-Bahi"
    }
  ],
  "foods": [
    {
      "name": "Mardan chapli kebab",
      "note": "The city’s kebab houses are a named stop on the Peshawar–Swat road — flat kebabs fried with tomato in the KP style."
    },
    {
      "name": "Gur (jaggery)",
      "note": "Cane country produce: Mardan’s sugar belt makes gur sold across the province."
    },
    {
      "name": "Seekh kebab & karahi",
      "note": "The standard of the city’s bazaar restaurants."
    },
    {
      "name": "Lassi",
      "note": "Served with breakfast across the old city."
    }
  ],
  "landmarks": [
    {
      "name": "Takht-i-Bahi (nearby)",
      "note": "The UNESCO-listed Buddhist monastery complex (1st century CE) on the ridge above the city."
    },
    {
      "name": "Shahbaz Garhi Ashoka edicts (nearby)",
      "note": "Ashoka’s rock edicts in Kharosthi script (c. 250 BCE) — among the earliest writing in South Asia."
    },
    {
      "name": "Guides Memorial",
      "note": "The 1892 memorial arch to the Corps of Guides soldiers of the 1879 Kabul residency siege."
    },
    {
      "name": "Mardan Museum",
      "note": "The district museum of Gandhara sculpture and local archaeology (est. 1991)."
    }
  ],
  "emergency": {
    "police": "15",
    "ambulance": "1122",
    "fire": "16",
    "rescueNote": "Rescue 1122 operates across Khyber Pakhtunkhwa, including Mardan.",
    "hospitals": [
      {
        "name": "Mardan Medical Complex",
        "note": "The city’s principal public teaching hospital, attached to Bacha Khan Medical College."
      },
      {
        "name": "DHQ Hospital Mardan",
        "note": "The district headquarters hospital."
      }
    ]
  },
  "personalitySeeds": [
    {
      "name": "Younis Khan",
      "field": "Cricketer",
      "note": "Born in Mardan (1977); Pakistan’s highest Test run-scorer and 2009 T20 World Cup-winning captain.",
      "source": "Wikipedia: Younis Khan"
    },
    {
      "name": "Ameer Haider Khan Hoti",
      "field": "Politician — former Chief Minister of KP (2008–2013)",
      "note": "From Mardan’s Hoti family; the city’s most prominent modern political figure.",
      "source": "Wikipedia: Ameer Haider Khan Hoti"
    },
    {
      "name": "Azam Khan Hoti",
      "field": "Politician and senator",
      "note": "Mardan-based senator and federal minister of the Hoti family; father of Ameer Haider Khan Hoti.",
      "source": "Wikipedia: Azam Khan Hoti"
    }
  ],
  "sources": [
    {
      "group": "identity (coords, population, elevation)",
      "source": "Wikidata Q993859 + Wikipedia city article",
      "detail": "Coordinates P625 34.1958, 72.0447; the article infobox gives 34.2012, 72.0258 (city-centre point) — variant recorded. Population 363,788 — the 2023 census Municipal Committee figure on which Wikidata P1082 and the article’s own MC/cantonment split agree (city total incl. cantonment 368,302). Elevation 311 m (Wikidata; article infobox 310 m; its geography text says 283 m — the conflict is recorded, the surveyed infobox value family is used). Cross-read 2026-10-22."
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
    },
    {
      "group": "elevation conflict (open at activation)",
      "source": "Wikipedia Mardan article",
      "detail": "Infobox 310 m vs geography section 283 m. Package uses 311 m (Wikidata P2044, matching the infobox family); activation should confirm against a topographic source."
    }
  ],
  "verifiedAt": "2026-10-22"
};
