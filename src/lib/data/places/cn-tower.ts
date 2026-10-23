import type { PlaceRow } from './types';

// CN Tower — place data row (BUILD ONLY; no page built).
export const PLACE_CN_TOWER: PlaceRow = {
  "slug": "cn-tower",
  "name": "CN Tower",
  "category": "Place",
  "wikidataQid": "Q134883",
  "wikidataDescription": "communications and observation tower in Toronto, Canada",
  "unescoId": null,
  "cityName": "Toronto",
  "regionName": "Ontario",
  "countryName": "Canada",
  "lat": 43.642752777778,
  "lng": -79.387147222222,
  "timezone": "America/Toronto",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+1976-00-00T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "John Andrews",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "not stated on Wikidata",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "concrete, steel",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "553.3 m",
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
      "fileTitle": "File:CNTowerNastyFall.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/d/da/CNTowerNastyFall.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:CNTowerNastyFall.jpg",
      "width": 3888,
      "height": 2592,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Franklin Vera Pacheco",
      "attribution": "Own work",
      "role": "hero",
      "sortOrder": 1,
      "alt": "CN Tower, Toronto"
    },
    {
      "fileTitle": "File:CN Tower, Toronto, Ontario (29969151776).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a6/CN_Tower%2C_Toronto%2C_Ontario_%2829969151776%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:CN_Tower,_Toronto,_Ontario_(29969151776).jpg",
      "width": 4000,
      "height": 3000,
      "licence": "CC BY-SA 2.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "author": "Ken Lund from Reno, Nevada, USA",
      "attribution": "CN Tower, Toronto, Ontario",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "CN Tower, Toronto"
    },
    {
      "fileTitle": "File:CN Tower40 construction skycrane March 1975 01c.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/8/80/CN_Tower40_construction_skycrane_March_1975_01c.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:CN_Tower40_construction_skycrane_March_1975_01c.jpg",
      "width": 4320,
      "height": 5147,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "WikiPedant",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "CN Tower, Toronto"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q134883",
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
