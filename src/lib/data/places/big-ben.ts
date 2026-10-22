import type { PlaceRow } from './types';

// Big Ben — place data row (BUILD ONLY; no page built).
export const PLACE_BIG_BEN: PlaceRow = {
  "slug": "big-ben",
  "name": "Big Ben",
  "category": "Place",
  "wikidataQid": "Q41225",
  "wikidataDescription": "tower of the Palace of Westminster, London containing the bell Big Ben",
  "unescoId": null,
  "cityName": "London",
  "regionName": "Greater London",
  "countryName": "United Kingdom",
  "lat": 51.50067,
  "lng": -0.12457,
  "timezone": "Europe/London",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+1843-09-28T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "Augustus Pugin, Charles Barry",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "Gothic Revival",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "Caen stone, limestone",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "96.0 m",
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
      "fileTitle": "File:Ayrton Light.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/6/67/Ayrton_Light.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Ayrton_Light.jpg",
      "width": 2464,
      "height": 2892,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Morn; original photo by JSilv99",
      "attribution": "Own work",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Big Ben, London"
    },
    {
      "fileTitle": "File:Benjamin Hall, 1858.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c6/Benjamin_Hall%2C_1858.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Benjamin_Hall,_1858.jpg",
      "width": 589,
      "height": 716,
      "licence": "Public domain",
      "licenceUrl": null,
      "author": "Illustrated Times",
      "attribution": "Illustrated Times - Illustrated Times, London: 9 Jan 1858, p21",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Big Ben, London"
    },
    {
      "fileTitle": "File:Big-ben-1858.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/7/78/Big-ben-1858.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Big-ben-1858.jpg",
      "width": 547,
      "height": 425,
      "licence": "Public domain",
      "licenceUrl": null,
      "author": "Unknown authorUnknown author",
      "attribution": "The Illustrated News of the World",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Big Ben, London"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q41225",
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
