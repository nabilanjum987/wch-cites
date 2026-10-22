import type { PlaceRow } from './types';

// Hagia Sophia — place data row (BUILD ONLY; no page built).
export const PLACE_HAGIA_SOPHIA: PlaceRow = {
  "slug": "hagia-sophia",
  "name": "Hagia Sophia",
  "category": "Place",
  "wikidataQid": "Q12506",
  "wikidataDescription": "mosque, museum, and former church in Istanbul, Turkey",
  "unescoId": 356,
  "cityName": "Istanbul",
  "regionName": "Istanbul Province",
  "countryName": "Türkiye",
  "lat": 41.00833333333333,
  "lng": 28.98,
  "timezone": "Europe/Istanbul",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+0537-12-27T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "Isidore of Miletus, Anthemius of Tralles, Trdat the Architect, Mimar Sinan",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "Byzantine architecture, basilica",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "brick",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "55.0 m",
      "source": "Wikidata P2048"
    },
    {
      "label": "UNESCO World Heritage Site ID",
      "value": "356",
      "source": "Wikidata P757"
    }
  ],
  "media": [
    {
      "fileTitle": "File:2. Seraph angel. 13th century CE. Ceiling mosaics, Hagia Sophia, Istanbul, Turkey.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fb/2._Seraph_angel._13th_century_CE._Ceiling_mosaics%2C_Hagia_Sophia%2C_Istanbul%2C_Turkey.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:2._Seraph_angel._13th_century_CE._Ceiling_mosaics,_Hagia_Sophia,_Istanbul,_Turkey.jpg",
      "width": 4016,
      "height": 6016,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Osama Shukir Muhammed Amin FRCP(Glasg)",
      "attribution": "Own work",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Hagia Sophia, Istanbul"
    },
    {
      "fileTitle": "File:20131203 Istanbul 048.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5a/20131203_Istanbul_048.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:20131203_Istanbul_048.jpg",
      "width": 3968,
      "height": 2976,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Mark Ahsmann",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Hagia Sophia, Istanbul"
    },
    {
      "fileTitle": "File:20131203 Istanbul 091.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c3/20131203_Istanbul_091.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:20131203_Istanbul_091.jpg",
      "width": 2761,
      "height": 2842,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Mark Ahsmann",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Hagia Sophia, Istanbul"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q12506",
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
