// City data package — Faisalabad (BUILD ONLY, Round 2 R4). See types.ts.
import type { CityPackage } from './types';

export const FAISALABAD: CityPackage = {
  "identity": {
    "name": "Faisalabad",
    "city_slug": "faisalabad",
    "country": "Pakistan",
    "country_code": "PK",
    "country_slug": "pakistan",
    "province": "Punjab",
    "province_slug": "punjab",
    "lat": 31.418,
    "lng": 73.079,
    "population": 3203846,
    "timezone": "Asia/Karachi",
    "major_religion": "Islam",
    "religion_percent": null,
    "primary_color": "#01411C",
    "secondary_color": "#FFFFFF",
    "famous_for": "Textile industry — the Manchester of Pakistan; clock tower and eight bazaars",
    "famous_products": "Cotton textiles and garments, hosiery",
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
      "value": "3,203,846"
    },
    {
      "label": "Elevation",
      "value": "184 m"
    },
    {
      "label": "Timezone",
      "value": "Asia/Karachi (PKT, UTC+5)"
    },
    {
      "label": "Known as",
      "value": "The Manchester of Pakistan — textile mills and the eight-bazaar clock tower plan"
    }
  ],
  "foods": [
    {
      "name": "Chikar cholay",
      "note": "The city’s hearty chickpea breakfast, eaten with kulcha across the bazaar food streets."
    },
    {
      "name": "Chargha",
      "note": "Whole steamed-and-fried chicken, a Faisalabad celebration dish."
    },
    {
      "name": "Lassi",
      "note": "Served thick at breakfast shops around the clock tower bazaars."
    },
    {
      "name": "Kulfa falooda",
      "note": "Dense kulfa ice cream over falooda — a local sweet-shop signature."
    }
  ],
  "landmarks": [
    {
      "name": "Clock Tower and the Eight Bazaars",
      "note": "The 1905 clock tower from which eight bazaars radiate in a Union-Jack street plan."
    },
    {
      "name": "Lyallpur Museum",
      "note": "The city museum documenting the planned canal-colony city founded as Lyallpur."
    },
    {
      "name": "Jinnah Garden",
      "note": "The city’s historic central garden."
    },
    {
      "name": "Gumti Water Fountain",
      "note": "The ornate fountain at the old city’s rail-bazaar crossing."
    }
  ],
  "emergency": {
    "police": "15",
    "ambulance": "1122",
    "fire": "16",
    "rescueNote": "Rescue 1122 operates across Punjab, including Faisalabad.",
    "hospitals": [
      {
        "name": "Allied Hospital",
        "note": "The city’s principal public teaching hospital."
      },
      {
        "name": "DHQ Hospital Faisalabad",
        "note": "District headquarters public hospital."
      }
    ]
  },
  "personalitySeeds": [
    {
      "name": "Nusrat Fateh Ali Khan",
      "field": "Qawwali singer",
      "note": "Born in Lyallpur (Faisalabad) in 1948; the most celebrated qawwal of the modern era.",
      "source": "Wikipedia: Nusrat Fateh Ali Khan"
    },
    {
      "name": "Rahat Fateh Ali Khan",
      "field": "Singer",
      "note": "Born in Faisalabad (1974); qawwali and playback singer, nephew of Nusrat.",
      "source": "Wikipedia: Rahat Fateh Ali Khan"
    },
    {
      "name": "Bhagat Singh",
      "field": "Revolutionary (1907–1931)",
      "note": "Born in Banga village, then in Lyallpur district (today Faisalabad district).",
      "source": "Wikipedia: Bhagat Singh"
    }
  ],
  "sources": [
    {
      "group": "identity (coords, population, elevation)",
      "source": "Wikidata Q173985",
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
