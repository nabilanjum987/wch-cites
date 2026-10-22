import type { PlaceRow } from './types';

// Statue of Liberty — place data row (BUILD ONLY; no page built).
export const PLACE_STATUE_OF_LIBERTY: PlaceRow = {
  "slug": "statue-of-liberty",
  "name": "Statue of Liberty",
  "category": "Place",
  "wikidataQid": "Q9202",
  "wikidataDescription": "monument in New York",
  "unescoId": null,
  "cityName": "New York City",
  "regionName": "New York State",
  "countryName": "United States",
  "lat": 40.689209166667,
  "lng": -74.044425277778,
  "timezone": "America/New_York",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+1886-00-00T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "Eugène Viollet-le-Duc",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "Neoclassical architecture",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "copper, steel, concrete, granite, gold leaf",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "46.0 m",
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
      "fileTitle": "File:2014-09-15 16-14-55 lion-belfort.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/0/04/2014-09-15_16-14-55_lion-belfort.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:2014-09-15_16-14-55_lion-belfort.jpg",
      "width": 8874,
      "height": 5307,
      "licence": "CC BY 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/3.0",
      "author": "Thomas Bresson",
      "attribution": "Own work",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Statue of Liberty, New York City"
    },
    {
      "fileTitle": "File:ArmAndTorchStatueOfLibertyMadisonSquareParkNewYork1876to1882 1.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/5/51/ArmAndTorchStatueOfLibertyMadisonSquareParkNewYork1876to1882_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:ArmAndTorchStatueOfLibertyMadisonSquareParkNewYork1876to1882_1.jpg",
      "width": 441,
      "height": 653,
      "licence": "Public domain",
      "licenceUrl": null,
      "author": "unknown photographer between 1876 and 1882",
      "attribution": "Unknown sourceUnknown source",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Statue of Liberty, New York City"
    },
    {
      "fileTitle": "File:Black Tom Island from Liberty Island June 2024.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/6/69/Black_Tom_Island_from_Liberty_Island_June_2024.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Black_Tom_Island_from_Liberty_Island_June_2024.jpg",
      "width": 6000,
      "height": 4000,
      "licence": "CC0",
      "licenceUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "author": "AskALotl",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Statue of Liberty, New York City"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q9202",
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
