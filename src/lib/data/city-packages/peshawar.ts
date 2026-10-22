// City data package — Peshawar (BUILD ONLY, Round 2 R4). See types.ts.
import type { CityPackage } from './types';

export const PESHAWAR: CityPackage = {
  "identity": {
    "name": "Peshawar",
    "city_slug": "peshawar",
    "country": "Pakistan",
    "country_code": "PK",
    "country_slug": "pakistan",
    "province": "Khyber Pakhtunkhwa",
    "province_slug": "khyber-pakhtunkhwa",
    "lat": 34.0144,
    "lng": 71.5675,
    "population": 1970042,
    "timezone": "Asia/Karachi",
    "major_religion": "Islam",
    "religion_percent": null,
    "primary_color": "#01411C",
    "secondary_color": "#FFFFFF",
    "famous_for": "Old-city bazaars, chapli kebab, Gandhara heritage — gateway to the Khyber Pass",
    "famous_products": "Peshawari chappal (sandals), chapli kebab, handicrafts",
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
      "value": "Khyber Pakhtunkhwa (provincial capital)"
    },
    {
      "label": "Population (2017 census)",
      "value": "1,970,042"
    },
    {
      "label": "Elevation",
      "value": "359 m"
    },
    {
      "label": "Timezone",
      "value": "Asia/Karachi (PKT, UTC+5)"
    },
    {
      "label": "Known as",
      "value": "One of South Asia’s oldest living cities; gateway to the Khyber Pass"
    }
  ],
  "foods": [
    {
      "name": "Chapli kebab",
      "note": "Peshawar’s flat minced-meat kebab with tomato and pomegranate — the city’s defining dish."
    },
    {
      "name": "Namkeen gosht",
      "note": "Salt-and-fat roasted meat cooked in its own juices, a Peshawari speciality."
    },
    {
      "name": "Peshawari kahwa",
      "note": "Saffron-tinted green tea served after meals across the city."
    },
    {
      "name": "Peshawari ice cream",
      "note": "Dense traditional ice cream sold in the old-city bazaars for generations."
    }
  ],
  "landmarks": [
    {
      "name": "Mahabat Khan Mosque",
      "note": "The 17th-century Mughal mosque in the old city, famed for its painted interior."
    },
    {
      "name": "Qissa Khwani Bazaar",
      "note": "The \"Bazaar of Storytellers\", the old city’s historic trading street."
    },
    {
      "name": "Peshawar Museum",
      "note": "Holder of one of the world’s major Gandhara Buddhist collections."
    },
    {
      "name": "Bala Hissar Fort",
      "note": "The historic fort overlooking the city, used since the Durrani era."
    },
    {
      "name": "Islamia College",
      "note": "Founded 1913; its building is the emblem of the province’s education movement."
    }
  ],
  "emergency": {
    "police": "15",
    "ambulance": "1122",
    "fire": "16",
    "rescueNote": "Rescue 1122 operates across Khyber Pakhtunkhwa, including Peshawar.",
    "hospitals": [
      {
        "name": "Lady Reading Hospital",
        "note": "The province’s largest public teaching hospital."
      },
      {
        "name": "Khyber Teaching Hospital",
        "note": "Public teaching hospital in the University Town area."
      }
    ]
  },
  "personalitySeeds": [
    {
      "name": "Dilip Kumar",
      "field": "Actor (1922–2021)",
      "note": "Born Muhammad Yusuf Khan in Peshawar’s Qissa Khwani quarter; legend of Indian cinema.",
      "source": "Wikipedia: Dilip Kumar"
    },
    {
      "name": "Raj Kapoor",
      "field": "Actor-director (1924–1988)",
      "note": "Born in Peshawar; founder of the Kapoor film dynasty.",
      "source": "Wikipedia: Raj Kapoor"
    },
    {
      "name": "Sahibzada Abdul Qayyum Khan",
      "field": "Educationist (1863–1937)",
      "note": "Founder of Islamia College Peshawar, the province’s landmark institution.",
      "source": "Wikipedia: Sahibzada Abdul Qayyum"
    }
  ],
  "sources": [
    {
      "group": "identity (coords, population, elevation)",
      "source": "Wikidata Q1113311",
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
