import type { PlaceRow } from './types';

// St. Peter's Basilica — place data row, batch 2 (BUILD ONLY; no page built).
export const PLACE_ST_PETERS_BASILICA: PlaceRow = {
  "slug": "st-peters-basilica",
  "name": "St. Peter's Basilica",
  "category": "Place",
  "wikidataQid": "Q12512",
  "wikidataDescription": "church in Vatican City",
  "unescoId": null,
  "cityName": "Vatican City",
  "regionName": "Vatican City",
  "countryName": "Vatican City",
  "lat": 41.90222222222222,
  "lng": 12.453416666666667,
  "timezone": "Europe/Rome",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+1506-04-18T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "Michelangelo, Giuliano da Sangallo, Donato Bramante, Raphael, Giovanni Giocondo, Antonio da Sangallo the Younger, Baldassare Peruzzi, Bernardo Rossellino, Giacomo della Porta, Giacomo Barozzi da Vignola, Pirro Ligorio, Carlo Maderno, Gian Lorenzo Bernini",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "Renaissance architecture, baroque architecture",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "cement, marble",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "136.6 m",
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
      "fileTitle": "File:01 Baldacchino St Peter's.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f4/01_Baldacchino_St_Peter%27s.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:01_Baldacchino_St_Peter%27s.jpg",
      "width": 6000,
      "height": 4911,
      "licence": "CC BY 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/4.0",
      "author": "NateBergin",
      "attribution": "Own work",
      "role": "hero",
      "sortOrder": 1,
      "alt": "St. Peter's Basilica, Vatican City"
    },
    {
      "fileTitle": "File:01 St Peter's Bramante Crossing.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fe/01_St_Peter%27s_Bramante_Crossing.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:01_St_Peter%27s_Bramante_Crossing.jpg",
      "width": 6000,
      "height": 4500,
      "licence": "CC BY 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/4.0",
      "author": "NateBergin",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "St. Peter's Basilica, Vatican City"
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
      "alt": "St. Peter's Basilica, Vatican City"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q12512",
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
