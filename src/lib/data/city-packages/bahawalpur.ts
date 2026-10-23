// City data package — Bahawalpur (BUILD ONLY, Round 2 extension R4B). See types.ts.
import type { CityPackage } from './types';

export const BAHAWALPUR: CityPackage = {
  "identity": {
    "name": "Bahawalpur",
    "city_slug": "bahawalpur",
    "country": "Pakistan",
    "country_code": "PK",
    "country_slug": "pakistan",
    "province": "Punjab",
    "province_slug": "punjab",
    "lat": 29.3956,
    "lng": 71.6836,
    "population": 682116,
    "timezone": "Asia/Karachi",
    "major_religion": "Islam",
    "religion_percent": null,
    "primary_color": "#01411C",
    "secondary_color": "#FFFFFF",
    "famous_for": "Nawabi palaces — Noor Mahal, Darbar Mahal — the City of Palaces",
    "famous_products": "Cholistan carpets, embroidery and pottery; dates and mangoes",
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
      "value": "682,116"
    },
    {
      "label": "Elevation",
      "value": "118 m"
    },
    {
      "label": "City area",
      "value": "246 km²"
    },
    {
      "label": "Timezone",
      "value": "Asia/Karachi (PKT, UTC+5)"
    },
    {
      "label": "Known as",
      "value": "City of Palaces — the Nawabs’ capital at the edge of Cholistan"
    }
  ],
  "foods": [
    {
      "name": "Cholistan dates",
      "note": "Date palms of the desert fringe supply Bahawalpur’s markets and its date trade."
    },
    {
      "name": "Bahawalpur mangoes",
      "note": "The city’s orchards grow prized mango varieties shipped across Pakistan each summer."
    },
    {
      "name": "Saraiki sohbat",
      "note": "The Saraiki shared platter of meat curry soaked into torn flatbread, a Derawal-region staple."
    },
    {
      "name": "Lassi",
      "note": "Served thick across the old city, sweet or salted, with breakfast."
    }
  ],
  "landmarks": [
    {
      "name": "Noor Mahal",
      "note": "The 1872 palace built for Nawab Sadiq Muhammad Khan IV — the “Palace of Light”, now a museum."
    },
    {
      "name": "Darbar Mahal",
      "note": "The 1905 red-brick palace of Bahawal Khan V, beside the old cantonment."
    },
    {
      "name": "Derawar Fort (nearby)",
      "note": "The great Cholistan desert fortress, some 48 km away — nine centuries of history guarding the caravan routes."
    },
    {
      "name": "Lal Suhanra National Park (nearby)",
      "note": "One of Pakistan’s largest national parks — desert, wetland and blackbuck — east of the city."
    },
    {
      "name": "Bahawalpur Central Library",
      "note": "The princely-state era public library (1924), among the oldest in Pakistan."
    }
  ],
  "emergency": {
    "police": "15",
    "ambulance": "1122",
    "fire": "16",
    "rescueNote": "Rescue 1122 operates across Punjab, including Bahawalpur.",
    "hospitals": [
      {
        "name": "Bahawal Victoria Hospital",
        "note": "The city’s principal public teaching hospital, founded in the princely era."
      },
      {
        "name": "Combined Military Hospital Bahawalpur",
        "note": "The military hospital serving the Bahawalpur garrison."
      }
    ]
  },
  "personalitySeeds": [
    {
      "name": "Nawab Bahawal Khan I",
      "field": "Founder of Bahawalpur (1748)",
      "note": "Founded the city in 1748 and made it the Daudpotra clan’s capital.",
      "source": "Wikipedia: Bahawalpur"
    },
    {
      "name": "Nawab Sadiq Muhammad Khan IV",
      "field": "Nawab of Bahawalpur (r. 1866–1899)",
      "note": "Builder-era Nawab — Noor Mahal was built in his reign (1872).",
      "source": "Wikipedia: Sadiq Muhammad Khan IV"
    },
    {
      "name": "Nawab Sadiq Muhammad Khan V",
      "field": "Last Nawab of Bahawalpur",
      "note": "Ruled the princely state until its accession to Pakistan (1947) and merger in 1955.",
      "source": "Wikipedia: Sadiq Muhammad Khan V"
    }
  ],
  "sources": [
    {
      "group": "identity (coords, population, elevation)",
      "source": "Wikidata Q318156 + Wikipedia city article",
      "detail": "Coordinates from the article infobox (29.3956, 71.6836); Wikidata P625 longitude (71.6722) differs by ~1 km — variant recorded. Population: article census table gives the CITY at 682,116 in 2017, used here; Wikidata P1082 carries 762,111 (wider boundary) — variant recorded. Elevation 118 m (article). WARNING: Wikidata P2044 shows “461” for Bahawalpur — that is the elevation in FEET stored in a metres field; the article’s 118 m (387 ft) is used instead. City area 246 km² (article; Wikidata 237.2 km² differs slightly). Cross-read 2026-10-22."
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
      "group": "data trap avoided",
      "source": "Wikidata P2044 (Bahawalpur)",
      "detail": "P2044 value 461 is feet-as-metres; publishing it would have shown a desert city at Himalayan-piedmont height. The package uses the article’s surveyed 118 m."
    }
  ],
  "verifiedAt": "2026-10-22"
};
