// City data package — Rawalpindi (BUILD ONLY, Round 2 R4). See types.ts.
import type { CityPackage } from './types';

export const RAWALPINDI: CityPackage = {
  "identity": {
    "name": "Rawalpindi",
    "city_slug": "rawalpindi",
    "country": "Pakistan",
    "country_code": "PK",
    "country_slug": "pakistan",
    "province": "Punjab",
    "province_slug": "punjab",
    "lat": 33.6007,
    "lng": 73.0679,
    "population": 2098231,
    "timezone": "Asia/Karachi",
    "major_religion": "Islam",
    "religion_percent": null,
    "primary_color": "#01411C",
    "secondary_color": "#FFFFFF",
    "famous_for": "Historic bazaars and Kartarpura food street; twin city of Islamabad",
    "famous_products": "Leather goods, pottery, textiles",
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
      "value": "2,098,231"
    },
    {
      "label": "Elevation",
      "value": "508 m"
    },
    {
      "label": "Timezone",
      "value": "Asia/Karachi (PKT, UTC+5)"
    },
    {
      "label": "Known as",
      "value": "The historic garrison city — Islamabad’s older twin"
    }
  ],
  "foods": [
    {
      "name": "Kartarpura breakfast",
      "note": "Nihari and siri paya on Rawalpindi’s famous old-city food street."
    },
    {
      "name": "Savour pulao kebab",
      "note": "The rice-and-kebab institution founded in Rawalpindi, now a national byword."
    },
    {
      "name": "Lassi",
      "note": "Breakfast lassi across the old-city bazaars."
    },
    {
      "name": "Chargha",
      "note": "Whole fried chicken served at celebrations and food streets."
    }
  ],
  "landmarks": [
    {
      "name": "Raja Bazaar",
      "note": "The old city’s great wholesale bazaar quarter."
    },
    {
      "name": "Liaquat Bagh",
      "note": "The public garden where Prime Minister Liaquat Ali Khan was assassinated in 1951."
    },
    {
      "name": "Ayub National Park",
      "note": "The large park on the Grand Trunk Road with the city’s zoo and lake."
    },
    {
      "name": "Rawal Lake",
      "note": "The reservoir on the city’s edge, shared with Islamabad’s leisure shore."
    }
  ],
  "emergency": {
    "police": "15",
    "ambulance": "1122",
    "fire": "16",
    "rescueNote": "Rescue 1122 operates across Punjab, including Rawalpindi.",
    "hospitals": [
      {
        "name": "Benazir Bhutto Hospital",
        "note": "Principal public teaching hospital of the city."
      },
      {
        "name": "Holy Family Hospital",
        "note": "Long-established public hospital on Satellite Town side."
      }
    ]
  },
  "personalitySeeds": [
    {
      "name": "Shoaib Akhtar",
      "field": "Cricketer",
      "note": "Born in Rawalpindi (1975) — the \"Rawalpindi Express\", among the fastest bowlers in history.",
      "source": "Wikipedia: Shoaib Akhtar"
    },
    {
      "name": "Mohammad Amir",
      "field": "Cricketer",
      "note": "Born in Gujar Khan, Rawalpindi district (1992); Pakistan fast bowler.",
      "source": "Wikipedia: Mohammad Amir"
    },
    {
      "name": "Liaquat Ali Khan",
      "field": "Statesman (1895–1951)",
      "note": "Pakistan’s first prime minister, assassinated while addressing a rally at Liaquat Bagh, Rawalpindi.",
      "source": "Wikipedia: Liaquat Ali Khan"
    }
  ],
  "sources": [
    {
      "group": "identity (coords, population, elevation)",
      "source": "Wikidata Q93230",
      "detail": "Coordinates P625, population P1082 (point-in-time 2017, Pakistan Bureau of Statistics census as referenced on the item), elevation P2044 — pulled live 2026-10-22."
    },
    {
      "group": "emergency numbers",
      "source": "Pakistan national emergency numbers",
      "detail": "Police 15, ambulance/rescue 1122, fire 16 — the same national set the published city pages carry (src/lib/getCityData.ts)."
    },
    {
      "group": "foods, landmarks, hospitals",
      "source": "Wikipedia (city article) + standard references",
      "detail": "Editorially compiled 2026-10-22; spot-check at activation (build-only package; nothing renders from this file yet)."
    },
    {
      "group": "personality seeds",
      "source": "Per-seed source recorded on each seed",
      "detail": "Seeds only — full verified profiles are the personalities pipeline’s job (R6 pattern)."
    },
    {
      "group": "religion_percent",
      "source": "OPEN FIELD",
      "detail": "Per-city religion share NOT set: no per-city source was verified this pass, so the field is null rather than an invented number. Activation must source it from PBS census tables. (major_religion is the template’s country-level descriptor.)"
    }
  ],
  "verifiedAt": "2026-10-22"
};
