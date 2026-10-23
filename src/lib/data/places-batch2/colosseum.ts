import type { PlaceRow } from './types';

// Colosseum — place data row, batch 2 (BUILD ONLY; no page built).
export const PLACE_COLOSSEUM: PlaceRow = {
  "slug": "colosseum",
  "name": "Colosseum",
  "category": "Place",
  "wikidataQid": "Q10285",
  "wikidataDescription": "ancient Roman amphitheatre, a landmark of Rome, Italy",
  "unescoId": null,
  "cityName": "Rome",
  "regionName": "Lazio",
  "countryName": "Italy",
  "lat": 41.890277777778,
  "lng": 12.492222222222,
  "timezone": "Europe/Rome",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+0082-00-00T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "not stated on Wikidata",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "ancient Roman architecture",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "Roman travertine, tuff, concrete",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "48.0 m",
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
      "fileTitle": "File:046CupolaSPietro.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5a/046CupolaSPietro.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:046CupolaSPietro.jpg",
      "width": 800,
      "height": 600,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "MarkusMark",
      "attribution": "Own work",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Colosseum, Rome"
    },
    {
      "fileTitle": "File:0 Colosseum - Rome 111001 (2).JPG",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b4/0_Colosseum_-_Rome_111001_%282%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:0_Colosseum_-_Rome_111001_(2).JPG",
      "width": 3610,
      "height": 2407,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Jean-Pol GRANDMONT",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Colosseum, Rome"
    },
    {
      "fileTitle": "File:Ave Caesar Morituri te Salutant (Gérôme) 01.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ed/Ave_Caesar_Morituri_te_Salutant_%28G%C3%A9r%C3%B4me%29_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Ave_Caesar_Morituri_te_Salutant_(G%C3%A9r%C3%B4me)_01.jpg",
      "width": 3000,
      "height": 1881,
      "licence": "Public domain",
      "licenceUrl": null,
      "author": "Unknown authorUnknown author",
      "attribution": "http://artgallery.yale.edu/collections/objects/9187",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Colosseum, Rome"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q10285",
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
