// City data package — Multan (BUILD ONLY, Round 2 R4). See types.ts.
import type { CityPackage } from './types';

export const MULTAN: CityPackage = {
  "identity": {
    "name": "Multan",
    "city_slug": "multan",
    "country": "Pakistan",
    "country_code": "PK",
    "country_slug": "pakistan",
    "province": "Punjab",
    "province_slug": "punjab",
    "lat": 30.1978,
    "lng": 71.4711,
    "population": 5362305,
    "timezone": "Asia/Karachi",
    "major_religion": "Islam",
    "religion_percent": null,
    "primary_color": "#01411C",
    "secondary_color": "#FFFFFF",
    "famous_for": "Sufi shrines, Sohan Halwa, mangoes — the City of Saints",
    "famous_products": "Sohan Halwa, Multani khussa (footwear), blue pottery, mangoes",
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
      "label": "Population (2023 census, district total)",
      "value": "5,362,305"
    },
    {
      "label": "Elevation",
      "value": "122 m"
    },
    {
      "label": "Timezone",
      "value": "Asia/Karachi (PKT, UTC+5)"
    },
    {
      "label": "Known as",
      "value": "City of Saints — Sufi shrines and Multani mangoes"
    }
  ],
  "foods": [
    {
      "name": "Sohan Halwa",
      "note": "Multan’s signature dense sweet of milk, ghee and nuts — the city’s most gifted food."
    },
    {
      "name": "Chaunsa mangoes",
      "note": "Multan’s orchards produce the Chaunsa, among Pakistan’s most prized mango varieties, in season each summer."
    },
    {
      "name": "Multani falooda",
      "note": "The city’s cold dessert of vermicelli, basil seeds and ice cream, a bazaar staple."
    },
    {
      "name": "Lassi",
      "note": "Thick Multani lassi, sweet or salted, served across the old-city breakfast shops."
    }
  ],
  "landmarks": [
    {
      "name": "Tomb of Shah Rukn-e-Alam",
      "note": "The 14th-century shrine that crowns the Multan Fort mound — among the earliest Tughluq-era tombs."
    },
    {
      "name": "Tomb of Bahauddin Zakariya",
      "note": "Shrine of the 13th-century Suhrawardi saint who made Multan a centre of Sufism."
    },
    {
      "name": "Multan Fort (Qilla Kohna Qasim Bagh)",
      "note": "The ancient citadel hill, layered from the city’s earliest defences."
    },
    {
      "name": "Ghanta Ghar (Clock Tower)",
      "note": "The colonial-era clock tower at the heart of the old city’s bazaars."
    },
    {
      "name": "Hussain Agahi Bazaar",
      "note": "The old city’s dense market quarter below the fort."
    }
  ],
  "emergency": {
    "police": "15",
    "ambulance": "1122",
    "fire": "16",
    "rescueNote": "Rescue 1122 operates across Punjab, including Multan.",
    "hospitals": [
      {
        "name": "Nishtar Hospital",
        "note": "The city’s principal public teaching hospital."
      },
      {
        "name": "Children Hospital Multan",
        "note": "Public children’s hospital serving south Punjab."
      }
    ]
  },
  "personalitySeeds": [
    {
      "name": "Bahauddin Zakariya",
      "field": "Sufi saint (13th century)",
      "note": "Founder of the Suhrawardi order’s Multan centre; his shrine anchors the old city.",
      "source": "Wikipedia: Bahauddin Zakariya"
    },
    {
      "name": "Shah Rukn-e-Alam",
      "field": "Sufi saint (13th–14th century)",
      "note": "Grandson of Bahauddin Zakariya; his tomb is Multan’s defining landmark.",
      "source": "Wikipedia: Shah Rukn-e-Alam"
    },
    {
      "name": "Inzamam-ul-Haq",
      "field": "Cricketer",
      "note": "Born in Multan (1970); Pakistan’s World-Cup-winning captain of the 2000s.",
      "source": "Wikipedia: Inzamam-ul-Haq"
    }
  ],
  "sources": [
    {
      "group": "identity (coords, population, elevation)",
      "source": "Wikidata Q185453",
      "detail": "Coordinates P625, elevation P2044 — Wikidata, pulled live 2026-10-22. Population REPLACED (final30 B10) with PBS 7th Population & Housing Census (2023), Table 1, Multan District total 5,362,305 — the 2017 Wikidata figure (1,871,843) is retired."
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
