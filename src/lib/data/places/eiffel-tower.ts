import type { PlaceRow } from './types';

// Eiffel Tower — place data row (BUILD ONLY; no page built).
export const PLACE_EIFFEL_TOWER: PlaceRow = {
  "slug": "eiffel-tower",
  "name": "Eiffel Tower",
  "category": "Place",
  "wikidataQid": "Q243",
  "wikidataDescription": "tower located on the Champ de Mars in Paris, France",
  "unescoId": null,
  "cityName": "Paris",
  "regionName": "Île-de-France",
  "countryName": "France",
  "lat": 48.858296,
  "lng": 2.294479,
  "timezone": "Europe/Paris",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+1887-01-28T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "Stéphen Sauvestre",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "not stated on Wikidata",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "wrought iron, steel, puddled iron",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "324.0 m",
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
      "fileTitle": "File:1000 Eiffel tower night illumination by Pierre Bideau in Paris Photo by Giles Laurent.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/9/95/1000_Eiffel_tower_night_illumination_by_Pierre_Bideau_in_Paris_Photo_by_Giles_Laurent.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:1000_Eiffel_tower_night_illumination_by_Pierre_Bideau_in_Paris_Photo_by_Giles_Laurent.jpg",
      "width": 3686,
      "height": 5529,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Photo: © Giles Laurent / Illumination: © Pierre Bideau, concepteur Lumière, pour l’éclairage de la tour Eiffel (Upload permission given by Société d'exploitation de la Tour Eiffel)",
      "attribution": "Own work",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Eiffel Tower, Paris"
    },
    {
      "fileTitle": "File:2013 Fireworks on Eiffel Tower 11.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/0/06/2013_Fireworks_on_Eiffel_Tower_11.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:2013_Fireworks_on_Eiffel_Tower_11.jpg",
      "width": 3931,
      "height": 2948,
      "licence": "CC BY-SA 2.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "author": "Yann Caradec from Paris, France",
      "attribution": "Fireworks on Eiffel Tower",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Eiffel Tower, Paris"
    },
    {
      "fileTitle": "File:Caricature Gustave Eiffel.png",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7f/Caricature_Gustave_Eiffel.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Caricature_Gustave_Eiffel.png",
      "width": 227,
      "height": 400,
      "licence": "Public domain",
      "licenceUrl": null,
      "author": "Unknown authorUnknown author",
      "attribution": "Unknown authorUnknown author, via http://www.nndb.com/people/425/000031332/Image14.gif",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Eiffel Tower, Paris"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q243",
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
