// City data package — Quetta (BUILD ONLY, Round 2 R4). See types.ts.
import type { CityPackage } from './types';

export const QUETTA: CityPackage = {
  "identity": {
    "name": "Quetta",
    "city_slug": "quetta",
    "country": "Pakistan",
    "country_code": "PK",
    "country_slug": "pakistan",
    "province": "Balochistan",
    "province_slug": "balochistan",
    "lat": 30.1958,
    "lng": 67.0172,
    "population": 1001205,
    "timezone": "Asia/Karachi",
    "major_religion": "Islam",
    "religion_percent": null,
    "primary_color": "#01411C",
    "secondary_color": "#FFFFFF",
    "famous_for": "Fruit orchards, sajji, Hanna Lake — the Fruit Garden of Pakistan",
    "famous_products": "Apples, grapes, almonds and dry fruit; sajji",
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
      "value": "Balochistan (provincial capital)"
    },
    {
      "label": "Population (2017 census)",
      "value": "1,001,205"
    },
    {
      "label": "Elevation",
      "value": "1,680 m"
    },
    {
      "label": "Timezone",
      "value": "Asia/Karachi (PKT, UTC+5)"
    },
    {
      "label": "Known as",
      "value": "The Fruit Garden of Pakistan — a high valley of orchards under bare mountains"
    }
  ],
  "foods": [
    {
      "name": "Sajji",
      "note": "Whole lamb or chicken salted and roasted on an open spit — Balochistan’s signature dish, perfected in Quetta."
    },
    {
      "name": "Kaak",
      "note": "Hard stone-baked Balochi bread served with sajji and roasts."
    },
    {
      "name": "Quetta kahwa",
      "note": "Green tea brewed across the city’s tea houses."
    },
    {
      "name": "Orchard fruit",
      "note": "Quetta valley apples, grapes and almonds, sold across Pakistan in season."
    }
  ],
  "landmarks": [
    {
      "name": "Hanna Lake",
      "note": "The turquoise reservoir in the hills east of the city, ringed by pine planting."
    },
    {
      "name": "Hazarganji-Chiltan National Park",
      "note": "Protected park west of the city, home of the Chiltan markhor."
    },
    {
      "name": "Urak Valley",
      "note": "The orchard valley and picnic gorge on the road toward Ziarat."
    },
    {
      "name": "Quaid-e-Azam Residency, Ziarat",
      "note": "The wooden residency where Jinnah spent his last days — a day trip from Quetta (Ziarat district)."
    }
  ],
  "emergency": {
    "police": "15",
    "ambulance": "1122",
    "fire": "16",
    "rescueNote": "Rescue 1122 operates in Balochistan, including Quetta.",
    "hospitals": [
      {
        "name": "Civil Hospital Quetta (Sandeman)",
        "note": "The province’s principal public hospital."
      },
      {
        "name": "Bolan Medical Complex",
        "note": "Public teaching hospital in Quetta."
      }
    ]
  },
  "personalitySeeds": [
    {
      "name": "Khan Abdul Samad Khan Achakzai",
      "field": "Political leader (1907–1973)",
      "note": "Baloch and Pashtun nationalist leader born at Gulistan, near Quetta.",
      "source": "Wikipedia: Khan Abdul Samad Khan Achakzai"
    },
    {
      "name": "Mir Ghaus Bakhsh Bizenjo",
      "field": "Political leader (1917–1989)",
      "note": "Baloch leader and former governor of Balochistan, centred on Quetta politics.",
      "source": "Wikipedia: Ghaus Bakhsh Bizenjo"
    },
    {
      "name": "Nawab Akbar Bugti",
      "field": "Tribal and political leader (1927–2006)",
      "note": "Nawab of the Bugti tribe; Balochistan politics ran through Quetta in his era.",
      "source": "Wikipedia: Akbar Bugti"
    }
  ],
  "sources": [
    {
      "group": "identity (coords, population, elevation)",
      "source": "Wikidata Q185458",
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
