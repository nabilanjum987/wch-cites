import type { PlaceRow } from './types';

// Tower Bridge — place data row, batch 2 (BUILD ONLY; no page built).
export const PLACE_TOWER_BRIDGE: PlaceRow = {
  "slug": "tower-bridge",
  "name": "Tower Bridge",
  "category": "Place",
  "wikidataQid": "Q83125",
  "wikidataDescription": "bascule and suspension bridge in London",
  "unescoId": null,
  "cityName": "London",
  "regionName": "Greater London",
  "countryName": "United Kingdom",
  "lat": 51.50555555555555,
  "lng": -0.07527777777777778,
  "timezone": "Europe/London",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+1886-00-00T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "Horace Jones",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "Gothic Revival",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "steel, granite, concrete",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "65.0 m",
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
      "fileTitle": "File:Chithrubar.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Chithrubar.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Chithrubar.jpg",
      "width": 2048,
      "height": 1536,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Look4myblog",
      "attribution": "Own work",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Tower Bridge, London"
    },
    {
      "fileTitle": "File:Clock Tower - Palace of Westminster, London - May 2007 icon.png",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/8/85/Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007_icon.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Clock_Tower_-_Palace_of_Westminster,_London_-_May_2007_icon.png",
      "width": 250,
      "height": 427,
      "licence": "CC BY 2.5",
      "licenceUrl": "https://creativecommons.org/licenses/by/2.5",
      "author": "Clock_Tower_-_Palace_of_Westminster,_London_-_May_2007.jpg: Diliff",
      "attribution": "This file was derived from:  Clock Tower - Palace of Westminster, London - May 2007.jpg:",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Tower Bridge, London"
    },
    {
      "fileTitle": "File:Cmglee Tower Bridge tall ship.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Cmglee_Tower_Bridge_tall_ship.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Cmglee_Tower_Bridge_tall_ship.jpg",
      "width": 3072,
      "height": 2048,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Cmglee",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Tower Bridge, London"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q83125",
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
