// City data package — Abbottabad (BUILD ONLY, Round 2 extension R4B). See types.ts.
import type { CityPackage } from './types';

export const ABBOTTABAD: CityPackage = {
  "identity": {
    "name": "Abbottabad",
    "city_slug": "abbottabad",
    "country": "Pakistan",
    "country_code": "PK",
    "country_slug": "pakistan",
    "province": "Khyber Pakhtunkhwa",
    "province_slug": "khyber-pakhtunkhwa",
    "lat": 34.1558,
    "lng": 73.2194,
    "population": 207989,
    "timezone": "Asia/Karachi",
    "major_religion": "Islam",
    "religion_percent": null,
    "primary_color": "#01411C",
    "secondary_color": "#FFFFFF",
    "famous_for": "Pakistan Military Academy at Kakul; the gateway city to the Galyat hills",
    "famous_products": "Galyat honey, walnuts and woollens traded through its bazaars",
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
      "label": "Population (2017 census)",
      "value": "207,989"
    },
    {
      "label": "Elevation",
      "value": "1,256 m"
    },
    {
      "label": "Division",
      "value": "Hazara Division headquarters"
    },
    {
      "label": "Timezone",
      "value": "Asia/Karachi (PKT, UTC+5)"
    },
    {
      "label": "Known as",
      "value": "The hill city of Hazara — home of the Pakistan Military Academy"
    }
  ],
  "foods": [
    {
      "name": "Chapli kebab",
      "note": "The flat, tomato-topped kebab of the northern districts, served in Abbottabad’s bazaars with naan and raita."
    },
    {
      "name": "Chicken karahi",
      "note": "The wok-cooked standard of Hazara’s restaurants, tomato-and-green-chilli style."
    },
    {
      "name": "Hill trout (nearby streams)",
      "note": "Trout from the cold streams toward the Galyat and Kaghan is served in the city’s restaurants in season."
    },
    {
      "name": "Seekh kebab",
      "note": "Charcoal-grilled minced kebabs, a cantonment-bazaar staple."
    }
  ],
  "landmarks": [
    {
      "name": "Pakistan Military Academy, Kakul",
      "note": "The Pakistan Army’s officer-training academy (est. 1947) in the hills above the city."
    },
    {
      "name": "Ilyasi Masjid",
      "note": "The city’s landmark mosque, built over a natural spring at the foot of the hills."
    },
    {
      "name": "Shimla Hill",
      "note": "The forested viewpoint hill inside the city, with walking trails over the cantonment."
    },
    {
      "name": "Lady Garden Park",
      "note": "The historic public garden displaying James Abbott’s farewell poem to the town he founded."
    }
  ],
  "emergency": {
    "police": "15",
    "ambulance": "1122",
    "fire": "16",
    "rescueNote": "Rescue 1122 operates across Khyber Pakhtunkhwa, including Abbottabad.",
    "hospitals": [
      {
        "name": "Ayub Teaching Hospital (Ayub Medical Complex)",
        "note": "The region’s principal public teaching hospital, attached to Ayub Medical College."
      },
      {
        "name": "Combined Military Hospital Abbottabad",
        "note": "The military hospital serving the Abbottabad garrison."
      }
    ]
  },
  "personalitySeeds": [
    {
      "name": "James Abbott",
      "field": "Founder of Abbottabad (1814–1896)",
      "note": "British officer who founded the town in 1853; the city bears his name and his poem is displayed in Lady Garden.",
      "source": "Wikipedia: Abbottabad"
    },
    {
      "name": "Sardar Mehtab Ahmed Khan",
      "field": "Politician — former Chief Minister & Governor of KP",
      "note": "The Sardar of Abbottabad; the district’s defining political figure of the post-1988 era.",
      "source": "Wikipedia: Sardar Mehtab Abbasi"
    },
    {
      "name": "Sardar Haider Zaman Khan",
      "field": "Hazara movement leader",
      "note": "Abbottabad-based leader of the Hazara province movement; long-serving district nazim.",
      "source": "Wikipedia: Haider Zaman Khan"
    }
  ],
  "sources": [
    {
      "group": "identity (coords, population, elevation)",
      "source": "Wikidata Q170315 + Wikipedia city article",
      "detail": "Coordinates from the article infobox (34.1558, 73.2194); Wikidata P625 (34.15, 73.2167) is rounded — noted. Population: article census table gives 207,989 in 2017 on its urban-tehsil basis, used here; Wikidata P1082 carries 148,587 (cantonment + municipal committee basis) — variant recorded. Elevation 1,256 m (both sources agree). Founded 1853. Cross-read 2026-10-22."
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
