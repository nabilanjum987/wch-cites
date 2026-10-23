import type { PlaceRow } from './types';

// Sagrada Família — place data row, batch 2 (BUILD ONLY; no page built).
export const PLACE_SAGRADA_FAMILIA: PlaceRow = {
  "slug": "sagrada-familia",
  "name": "Sagrada Família",
  "category": "Place",
  "wikidataQid": "Q48435",
  "wikidataDescription": "basilica under construction since 1882 in Barcelona, Spain",
  "unescoId": null,
  "cityName": "Barcelona",
  "regionName": "Catalonia",
  "countryName": "Spain",
  "lat": 41.40369,
  "lng": 2.17433,
  "timezone": "Europe/Madrid",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+1882-03-19T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "Antoni Gaudí",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "Catalan modernism, Gothic Revival",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "stone, concrete, wood, glass",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "172.5 m",
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
      "fileTitle": "File:(Barcelona) The Beggars Cathedral by Joaquim Mir - Museu Nacional d'Art de Catalunya.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/1/14/%28Barcelona%29_The_Beggars_Cathedral_by_Joaquim_Mir_-_Museu_Nacional_d%27Art_de_Catalunya.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:(Barcelona)_The_Beggars_Cathedral_by_Joaquim_Mir_-_Museu_Nacional_d%27Art_de_Catalunya.jpg",
      "width": 5430,
      "height": 4476,
      "licence": "Public domain",
      "licenceUrl": null,
      "author": "Didier Descouens",
      "attribution": "Own work",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Sagrada Família, Barcelona"
    },
    {
      "fileTitle": "File:019 Sagrada Família, interior, façana de la Glòria.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/019_Sagrada_Fam%C3%ADlia%2C_interior%2C_fa%C3%A7ana_de_la_Gl%C3%B2ria.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:019_Sagrada_Fam%C3%ADlia,_interior,_fa%C3%A7ana_de_la_Gl%C3%B2ria.jpg",
      "width": 1704,
      "height": 2272,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Enfo",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Sagrada Família, Barcelona"
    },
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
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Sagrada Família, Barcelona"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q48435",
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
