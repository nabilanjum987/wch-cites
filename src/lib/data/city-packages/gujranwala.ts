// City data package — Gujranwala (BUILD ONLY, Round 2 R4). See types.ts.
import type { CityPackage } from './types';

export const GUJRANWALA: CityPackage = {
  "identity": {
    "name": "Gujranwala",
    "city_slug": "gujranwala",
    "country": "Pakistan",
    "country_code": "PK",
    "country_slug": "pakistan",
    "province": "Punjab",
    "province_slug": "punjab",
    "lat": 32.15,
    "lng": 74.1833,
    "population": 2027001,
    "timezone": "Asia/Karachi",
    "major_religion": "Islam",
    "religion_percent": null,
    "primary_color": "#01411C",
    "secondary_color": "#FFFFFF",
    "famous_for": "Wrestling (pehlwani) and chargha — birthplace of Maharaja Ranjit Singh",
    "famous_products": "Rice, fans and electrical goods, ceramics and sanitary ware",
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
      "value": "2,027,001"
    },
    {
      "label": "Elevation",
      "value": "231 m"
    },
    {
      "label": "Timezone",
      "value": "Asia/Karachi (PKT, UTC+5)"
    },
    {
      "label": "Known as",
      "value": "The City of Wrestlers — pehlwani akharas and Pakistan’s most famous chargha"
    }
  ],
  "foods": [
    {
      "name": "Gujranwala chargha",
      "note": "The whole fried chicken the city made famous across Pakistan."
    },
    {
      "name": "Siri paya breakfast",
      "note": "The wrestler’s breakfast of trotters and head curry at old-city shops."
    },
    {
      "name": "Halwa puri",
      "note": "The pehlwan-style desi breakfast of the akhara quarters."
    },
    {
      "name": "Lassi",
      "note": "Served in steel tumblers at breakfast across the city."
    }
  ],
  "landmarks": [
    {
      "name": "Samadhi of Maha Singh",
      "note": "Tomb of Sardar Maha Singh, father of Maharaja Ranjit Singh, in Sheranwala Bagh."
    },
    {
      "name": "Sheranwala Bagh",
      "note": "The historic garden holding the samadhis of the Sukerchakia chiefs."
    },
    {
      "name": "Gujranwala Railway Station",
      "note": "The historic Grand Trunk Road-era station of the old city."
    },
    {
      "name": "Rori Sahib, Eminabad",
      "note": "The historic gurdwara town a short drive from the city (day trip)."
    }
  ],
  "emergency": {
    "police": "15",
    "ambulance": "1122",
    "fire": "16",
    "rescueNote": "Rescue 1122 operates across Punjab, including Gujranwala.",
    "hospitals": [
      {
        "name": "DHQ Hospital Gujranwala",
        "note": "The city’s principal public hospital."
      },
      {
        "name": "Gondal Medical Complex",
        "note": "Teaching hospital serving the city."
      }
    ]
  },
  "personalitySeeds": [
    {
      "name": "Maharaja Ranjit Singh",
      "field": "Ruler (1780–1839)",
      "note": "Born in Gujranwala; founder of the Sikh Empire.",
      "source": "Wikipedia: Ranjit Singh"
    },
    {
      "name": "Hari Singh Nalwa",
      "field": "General (1791–1837)",
      "note": "Born in Gujranwala; commander of the Sikh Khalsa army.",
      "source": "Wikipedia: Hari Singh Nalwa"
    },
    {
      "name": "Maha Singh",
      "field": "Sukerchakia chief (d. 1792)",
      "note": "Father of Ranjit Singh; his samadhi stands in Gujranwala’s Sheranwala Bagh.",
      "source": "Wikipedia: Maha Singh"
    }
  ],
  "sources": [
    {
      "group": "identity (coords, population, elevation)",
      "source": "Wikidata Q243322",
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
