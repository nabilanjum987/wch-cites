import type { PlaceRow } from './types';

// Badshahi Mosque — place data row (BUILD ONLY; no page built).
export const PLACE_BADSHAHI_MOSQUE: PlaceRow = {
  "slug": "badshahi-mosque",
  "name": "Badshahi Mosque",
  "category": "Place",
  "wikidataQid": "Q330872",
  "wikidataDescription": "mosque in Lahore, Pakistan",
  "unescoId": null,
  "cityName": "Lahore",
  "regionName": "Punjab",
  "countryName": "Pakistan",
  "lat": 31.588055555555556,
  "lng": 74.30944444444444,
  "timezone": "Asia/Karachi",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+1671-00-00T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "not stated on Wikidata",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "Mughal architecture",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "sandstone",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "53.75 m",
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
      "fileTitle": "File:Allama Iqbal Tomb side view, adjacent to the Badshahi Mosque's gateway.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/6/69/Allama_Iqbal_Tomb_side_view%2C_adjacent_to_the_Badshahi_Mosque%27s_gateway.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Allama_Iqbal_Tomb_side_view,_adjacent_to_the_Badshahi_Mosque%27s_gateway.jpg",
      "width": 3000,
      "height": 2000,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Rohaan Bhatti",
      "attribution": "Own work",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Badshahi Mosque, Lahore"
    },
    {
      "fileTitle": "File:Antique wrok walls in badshahi mosque.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Antique_wrok_walls_in_badshahi_mosque.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Antique_wrok_walls_in_badshahi_mosque.jpg",
      "width": 3062,
      "height": 4563,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Maheen zafar",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Badshahi Mosque, Lahore"
    },
    {
      "fileTitle": "File:Baadshahi Mosque.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/1/13/Baadshahi_Mosque.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Baadshahi_Mosque.jpg",
      "width": 5184,
      "height": 3456,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Ghania Muzammil",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Badshahi Mosque, Lahore"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q330872",
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
