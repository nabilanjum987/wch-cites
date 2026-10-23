import type { PlaceRow } from './types';

// Sheikh Zayed Grand Mosque — place data row (BUILD ONLY; no page built).
export const PLACE_SHEIKH_ZAYED_GRAND_MOSQUE: PlaceRow = {
  "slug": "sheikh-zayed-grand-mosque",
  "name": "Sheikh Zayed Grand Mosque",
  "category": "Place",
  "wikidataQid": "Q695604",
  "wikidataDescription": "grand mosque in Abu Dhabi",
  "unescoId": null,
  "cityName": "Abu Dhabi",
  "regionName": "Abu Dhabi",
  "countryName": "United Arab Emirates",
  "lat": 24.412,
  "lng": 54.474,
  "timezone": "Asia/Dubai",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+2007-12-20T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "Yusef Abdelki",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "Mughal architecture, Moorish architecture",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "not stated on Wikidata",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "not stated on Wikidata",
      "source": "Wikidata P2048"
    },
    {
      "label": "UNESCO World Heritage Site ID",
      "value": "No UNESCO site ID in the fetched Wikidata claims — inscription status to be verified at ingest (absence of a claim is not proof of non-inscription)",
      "source": "Wikidata P757"
    }
  ],
  "media": [
    {
      "fileTitle": "File:Abu Dhabi Masque inside.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Abu_Dhabi_Masque_inside.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Abu_Dhabi_Masque_inside.jpg",
      "width": 2268,
      "height": 4032,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Dubaideena",
      "attribution": "Own work",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Sheikh Zayed Grand Mosque, Abu Dhabi"
    },
    {
      "fileTitle": "File:Abu dhabi, Moschea dello Sceicco Zayed, atrio della sala di preghiera, lampadario 01.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Abu_dhabi%2C_Moschea_dello_Sceicco_Zayed%2C_atrio_della_sala_di_preghiera%2C_lampadario_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Abu_dhabi,_Moschea_dello_Sceicco_Zayed,_atrio_della_sala_di_preghiera,_lampadario_01.jpg",
      "width": 6720,
      "height": 4480,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Francesco Bini",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Sheikh Zayed Grand Mosque, Abu Dhabi"
    },
    {
      "fileTitle": "File:Abu dhabi, Moschea dello Sceicco Zayed, atrio della sala di preghiera, lampadario 02.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Abu_dhabi%2C_Moschea_dello_Sceicco_Zayed%2C_atrio_della_sala_di_preghiera%2C_lampadario_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Abu_dhabi,_Moschea_dello_Sceicco_Zayed,_atrio_della_sala_di_preghiera,_lampadario_02.jpg",
      "width": 3964,
      "height": 6304,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Francesco Bini",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Sheikh Zayed Grand Mosque, Abu Dhabi"
    }
  ],
  "liveLayer": {
    "provider": "Open-Meteo (no key)",
    "endpoints": [
      "https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,weather_code&daily=sunrise,sunset"
    ],
    "fields": [
      "current temperature",
      "weather condition",
      "sunrise",
      "sunset / golden hour"
    ],
    "note": "Same live-layer pattern as the golden wonder template (WP4/Q9): figures render only when the source responds."
  },
  "sources": [
    {
      "claim": "Identity, coordinates, inception, architect, style, materials, height, UNESCO ID",
      "sourceName": "Wikidata",
      "sourceUrl": "https://www.wikidata.org/wiki/Q695604",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Images (licence, author, attribution per record)",
      "sourceName": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org",
      "checkedAt": "2026-10-22"
    }
  ]
};
