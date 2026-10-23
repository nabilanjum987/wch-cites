// City data package — Hyderabad (BUILD ONLY, Round 2 R4). See types.ts.
import type { CityPackage } from './types';

export const HYDERABAD: CityPackage = {
  "identity": {
    "name": "Hyderabad",
    "city_slug": "hyderabad",
    "country": "Pakistan",
    "country_code": "PK",
    "country_slug": "pakistan",
    "province": "Sindh",
    "province_slug": "sindh",
    "lat": 25.3792,
    "lng": 68.3683,
    "population": 1732693,
    "timezone": "Asia/Karachi",
    "major_religion": "Islam",
    "religion_percent": null,
    "primary_color": "#01411C",
    "secondary_color": "#FFFFFF",
    "famous_for": "Glass bangles, Pacco Qillo fort, Sindhi culture",
    "famous_products": "Glass bangles, ajrak, Sindhi caps",
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
      "value": "Sindh"
    },
    {
      "label": "Population (2017 census)",
      "value": "1,732,693"
    },
    {
      "label": "Elevation",
      "value": "13 m"
    },
    {
      "label": "Timezone",
      "value": "Asia/Karachi (PKT, UTC+5)"
    },
    {
      "label": "Known as",
      "value": "The bangle city on the Indus plain — historic capital of Sindh"
    }
  ],
  "foods": [
    {
      "name": "Sindhi biryani",
      "note": "The fiery, potato-laced biryani of Sindh, served across Hyderabad’s food streets."
    },
    {
      "name": "Sai bhaji",
      "note": "The Sindhi spinach-and-lentil staple of home kitchens."
    },
    {
      "name": "Hyderabadi rabri",
      "note": "The slow-reduced milk sweet the city is famed for."
    },
    {
      "name": "Thadal",
      "note": "The cooling almond-and-spice drink of Sindh’s summers."
    }
  ],
  "landmarks": [
    {
      "name": "Pacco Qillo (Hyderabad Fort)",
      "note": "The baked-brick fort raised by Mian Ghulam Shah Kalhoro in 1768."
    },
    {
      "name": "Rani Bagh",
      "note": "The city’s historic garden and zoo ground."
    },
    {
      "name": "Sindh Museum",
      "note": "The museum of Sindhi history, crafts and everyday life."
    },
    {
      "name": "Shahi Bazaar",
      "note": "The long historic market street of the old city."
    }
  ],
  "emergency": {
    "police": "15",
    "ambulance": "1122",
    "fire": "16",
    "rescueNote": "Rescue 1122 Sindh operates in Hyderabad.",
    "hospitals": [
      {
        "name": "Liaquat University Hospital (Civil Hospital)",
        "note": "The city’s principal public teaching hospital."
      },
      {
        "name": "Rajputana Hospital",
        "note": "Long-established hospital serving the old city."
      }
    ]
  },
  "personalitySeeds": [
    {
      "name": "Allama I. I. Kazi",
      "field": "Scholar (1886–1968)",
      "note": "Born in Hyderabad, Sindh; philosopher and founding vice-chancellor of the University of Sindh.",
      "source": "Wikipedia: Imdad Ali Imam Ali Kazi"
    },
    {
      "name": "Hoshu Sheedi",
      "field": "General (d. 1843)",
      "note": "Sindhi commander who fought the British at Hyderabad and Miani in 1843.",
      "source": "Wikipedia: Hoshu Sheedi"
    },
    {
      "name": "Elsa Kazi",
      "field": "Poet (1884–1967)",
      "note": "German-born poet who made Hyderabad her home and wrote in English and Sindhi themes.",
      "source": "Wikipedia: Elsa Kazi"
    }
  ],
  "sources": [
    {
      "group": "identity (coords, population, elevation)",
      "source": "Wikidata Q1640079",
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
