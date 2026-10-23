import type { PlaceRow } from './types';

// Golden Gate Bridge — place data row, batch 2 (BUILD ONLY; no page built).
export const PLACE_GOLDEN_GATE_BRIDGE: PlaceRow = {
  "slug": "golden-gate-bridge",
  "name": "Golden Gate Bridge",
  "category": "Place",
  "wikidataQid": "Q44440",
  "wikidataDescription": "suspension bridge on the San Francisco Bay",
  "unescoId": null,
  "cityName": "San Francisco",
  "regionName": "California",
  "countryName": "United States",
  "lat": 37.819722222222,
  "lng": -122.47861111111,
  "timezone": "America/Los_Angeles",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+1937-05-27T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "Joseph Strauss",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "not stated on Wikidata",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "steel",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "746.0 m",
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
      "fileTitle": "File:25th Anniversary Golden Gate Bridge Plaque b.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cf/25th_Anniversary_Golden_Gate_Bridge_Plaque_b.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:25th_Anniversary_Golden_Gate_Bridge_Plaque_b.jpg",
      "width": 3024,
      "height": 4032,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "File:25th Anniversary Golden Gate Bridge Plaque.jpg: JHawk88\nderivative work: Georgfotoart",
      "attribution": "This file was derived from:  25th Anniversary Golden Gate Bridge Plaque.jpg:",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Golden Gate Bridge, San Francisco"
    },
    {
      "fileTitle": "File:BayareaUSGS.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5c/BayareaUSGS.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:BayareaUSGS.jpg",
      "width": 769,
      "height": 798,
      "licence": "Public domain",
      "licenceUrl": null,
      "author": "",
      "attribution": "",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Golden Gate Bridge, San Francisco"
    },
    {
      "fileTitle": "File:Below Golden Gate Bridge.jpeg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Below_Golden_Gate_Bridge.jpeg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Below_Golden_Gate_Bridge.jpeg",
      "width": 3264,
      "height": 2448,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Wa17gs",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Golden Gate Bridge, San Francisco"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q44440",
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
