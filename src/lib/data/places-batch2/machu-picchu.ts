import type { PlaceRow } from './types';

// Machu Picchu — place data row, batch 2 (BUILD ONLY; no page built).
export const PLACE_MACHU_PICCHU: PlaceRow = {
  "slug": "machu-picchu",
  "name": "Machu Picchu",
  "category": "Place",
  "wikidataQid": "Q676203",
  "wikidataDescription": "15th-century Inca citadel in the Peruvian Andes and UNESCO World Heritage Site",
  "unescoId": null,
  "cityName": "Cusco Region",
  "regionName": "Cusco",
  "countryName": "Peru",
  "lat": -13.163333333333334,
  "lng": -72.54555555555555,
  "timezone": "America/Lima",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+1450-00-00T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "not stated on Wikidata",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "not stated on Wikidata",
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
      "fileTitle": "File:143 Intiwatana Machu Picchu Peru 2406 (14977268637).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/7/72/143_Intiwatana_Machu_Picchu_Peru_2406_%2814977268637%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:143_Intiwatana_Machu_Picchu_Peru_2406_(14977268637).jpg",
      "width": 4320,
      "height": 3240,
      "licence": "CC BY 2.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/2.0",
      "author": "bobistraveling",
      "attribution": "143 Intiwatana Machu Picchu Peru 2406",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Machu Picchu, Cusco Region"
    },
    {
      "fileTitle": "File:218 View from Inca Trail to Sun Gate Machu Picchu Peru 2486 (14977553069).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/218_View_from_Inca_Trail_to_Sun_Gate_Machu_Picchu_Peru_2486_%2814977553069%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:218_View_from_Inca_Trail_to_Sun_Gate_Machu_Picchu_Peru_2486_(14977553069).jpg",
      "width": 3900,
      "height": 3240,
      "licence": "CC BY 2.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/2.0",
      "author": "bobistraveling",
      "attribution": "218 View from Inca Trail to Sun Gate Machu Picchu Peru 2486",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Machu Picchu, Cusco Region"
    },
    {
      "fileTitle": "File:90 - Machu Picchu - Juin 2009 (cropped).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/8/85/90_-_Machu_Picchu_-_Juin_2009_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:90_-_Machu_Picchu_-_Juin_2009_(cropped).jpg",
      "width": 4479,
      "height": 2687,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Martin St-Amant (S23678)",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Machu Picchu, Cusco Region"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q676203",
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
