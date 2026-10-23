// City data package — Sukkur (BUILD ONLY, Round 2 extension R4B). See types.ts.
import type { CityPackage } from './types';

export const SUKKUR: CityPackage = {
  "identity": {
    "name": "Sukkur",
    "city_slug": "sukkur",
    "country": "Pakistan",
    "country_code": "PK",
    "country_slug": "pakistan",
    "province": "Sindh",
    "province_slug": "sindh",
    "lat": 27.7061,
    "lng": 68.8483,
    "population": 551357,
    "timezone": "Asia/Karachi",
    "major_religion": "Islam",
    "religion_percent": null,
    "primary_color": "#01411C",
    "secondary_color": "#FFFFFF",
    "famous_for": "Sukkur Barrage (1932) and the Indus bridges — the Gate of Sindh",
    "famous_products": "Dates (khajoor), Indus palla fish, cotton",
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
      "value": "551,357"
    },
    {
      "label": "Elevation",
      "value": "67 m"
    },
    {
      "label": "City area",
      "value": "300 km²"
    },
    {
      "label": "Timezone",
      "value": "Asia/Karachi (PKT, UTC+5)"
    },
    {
      "label": "Known as",
      "value": "The Gate of Sindh — barrage and bridges over the Indus"
    }
  ],
  "foods": [
    {
      "name": "Sukkur dates (khajoor)",
      "note": "The Sukkur–Khairpur belt is Pakistan’s date heartland; the city’s date market trades nationwide."
    },
    {
      "name": "Palla fish",
      "note": "The Indus hilsa caught at the barrage reach — Sindh’s most prized river fish, in season."
    },
    {
      "name": "Sindhi biryani",
      "note": "The spicier, potato-bearing Sindhi style, served across the old city."
    },
    {
      "name": "Bhee (lotus stem)",
      "note": "The Sindhi lotus-root delicacy, a Sukkur bazaar speciality."
    }
  ],
  "landmarks": [
    {
      "name": "Sukkur Barrage",
      "note": "The 1932 barrage on the Indus — among the world’s largest irrigation works, feeding seven canals."
    },
    {
      "name": "Lansdowne Bridge",
      "note": "The 1889 cantilever bridge to Rohri, a landmark of British-era engineering."
    },
    {
      "name": "Ayub Bridge",
      "note": "The 1962 steel arch beside Lansdowne Bridge, carrying the modern crossing."
    },
    {
      "name": "Minaret of Masum Shah",
      "note": "The 1607 minaret (26 m) of Mir Masum Shah, climbable for the city’s classic view."
    },
    {
      "name": "Sadh Belo",
      "note": "The island Hindu temple complex in the Indus between Sukkur and Rohri."
    }
  ],
  "emergency": {
    "police": "15",
    "ambulance": "1122",
    "fire": "16",
    "rescueNote": "Rescue 1122 operates in Sindh’s major cities, including Sukkur.",
    "hospitals": [
      {
        "name": "Ghulam Muhammad Mahar Medical College Teaching Hospital",
        "note": "The city’s principal public teaching hospital."
      },
      {
        "name": "Combined Military Hospital, Pano Aqil (nearby)",
        "note": "The cantonment hospital at Pano Aqil, the nearest military hospital to Sukkur."
      }
    ]
  },
  "personalitySeeds": [
    {
      "name": "Syed Khurshid Ahmed Shah",
      "field": "Politician",
      "note": "Born in Sukkur (1952); among Pakistan’s longest-serving parliamentarians, former Leader of the Opposition.",
      "source": "Wikipedia: Syed Khurshid Ahmed Shah"
    },
    {
      "name": "Mir Muhammad Masum",
      "field": "Mughal-era historian and poet (1576–1606)",
      "note": "Of Bhakkar–Sukkur; author of Tarikh-i-Masumi — the minaret in Sukkur was raised by his son in his memory. Association recorded as such.",
      "source": "Wikipedia: Mir Muhammad Masum"
    },
    {
      "name": "Syed Nasir Hussain Shah",
      "field": "Politician",
      "note": "Senior Sindh minister long associated with Sukkur division politics.",
      "source": "Wikipedia: Nasir Hussain Shah"
    }
  ],
  "sources": [
    {
      "group": "identity (coords, population, elevation)",
      "source": "Wikidata Q868631 + Wikipedia city article",
      "detail": "Coordinates from the article infobox (27.7061, 68.8483); Wikidata P625 (27.6995, 68.8673) differs by ~2 km — variant recorded. Population: article census table gives 551,357 in 2017 (New Sukkur + Sukkur City talukas), used here; Wikidata P1082 carries 499,900 — variant recorded. Elevation 67 m (both agree). City area 300 km² (article). Cross-read 2026-10-22."
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
