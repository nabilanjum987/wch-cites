// City data package — Sialkot (BUILD ONLY, Round 2 R4). See types.ts.
import type { CityPackage } from './types';

export const SIALKOT: CityPackage = {
  "identity": {
    "name": "Sialkot",
    "city_slug": "sialkot",
    "country": "Pakistan",
    "country_code": "PK",
    "country_slug": "pakistan",
    "province": "Punjab",
    "province_slug": "punjab",
    "lat": 32.5,
    "lng": 74.5333,
    "population": 591668,
    "timezone": "Asia/Karachi",
    "major_religion": "Islam",
    "religion_percent": null,
    "primary_color": "#01411C",
    "secondary_color": "#FFFFFF",
    "famous_for": "Sports goods — a majority of the world’s footballs; birthplace of Allama Iqbal",
    "famous_products": "Footballs and sports goods, surgical instruments, leather goods",
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
      "value": "591,668"
    },
    {
      "label": "Elevation",
      "value": "256 m"
    },
    {
      "label": "Timezone",
      "value": "Asia/Karachi (PKT, UTC+5)"
    },
    {
      "label": "Known as",
      "value": "The world’s sporting-goods workshop; birthplace of Allama Iqbal"
    }
  ],
  "foods": [
    {
      "name": "Sialkoti chargha",
      "note": "Whole spiced chicken, fried crisp — the city’s celebration dish."
    },
    {
      "name": "Seekh kebab and tikka",
      "note": "Charcoal-grilled staples of the city’s food streets."
    },
    {
      "name": "Lassi",
      "note": "Thick breakfast lassi across the bazaars."
    },
    {
      "name": "Falooda",
      "note": "The bazaar dessert of vermicelli, kulfa and basil seeds."
    }
  ],
  "landmarks": [
    {
      "name": "Iqbal Manzil",
      "note": "The birthplace and childhood home of Allama Muhammad Iqbal, now a museum."
    },
    {
      "name": "Sialkot Fort",
      "note": "One of Punjab’s oldest fort sites, above the old city."
    },
    {
      "name": "Jinnah Stadium",
      "note": "The city’s historic cricket ground."
    },
    {
      "name": "Puran’s Well",
      "note": "The ancient well tied to the Punjabi legend of Raja Salban and Puran Bhagat."
    }
  ],
  "emergency": {
    "police": "15",
    "ambulance": "1122",
    "fire": "16",
    "rescueNote": "Rescue 1122 operates across Punjab, including Sialkot.",
    "hospitals": [
      {
        "name": "Allama Iqbal Memorial Teaching Hospital",
        "note": "The city’s principal public teaching hospital."
      },
      {
        "name": "Govt Sardar Begum Hospital",
        "note": "Public hospital serving the city."
      }
    ]
  },
  "personalitySeeds": [
    {
      "name": "Allama Muhammad Iqbal",
      "field": "Poet-philosopher (1877–1938)",
      "note": "Born in Sialkot; the national poet of Pakistan.",
      "source": "Wikipedia: Muhammad Iqbal"
    },
    {
      "name": "Faiz Ahmed Faiz",
      "field": "Poet (1911–1984)",
      "note": "Born in Kala Qader village, Sialkot district; among Urdu’s greatest poets.",
      "source": "Wikipedia: Faiz Ahmed Faiz"
    },
    {
      "name": "Shoaib Malik",
      "field": "Cricketer",
      "note": "Born in Sialkot (1982); Pakistan all-rounder and former captain.",
      "source": "Wikipedia: Shoaib Malik"
    }
  ],
  "sources": [
    {
      "group": "identity (coords, population, elevation)",
      "source": "Wikidata Q643883",
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
