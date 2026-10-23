import type { PlaceRow } from './types';

// Christ the Redeemer — place data row, batch 2 (BUILD ONLY; no page built).
export const PLACE_CHRIST_THE_REDEEMER: PlaceRow = {
  "slug": "christ-the-redeemer",
  "name": "Christ the Redeemer",
  "category": "Place",
  "wikidataQid": "Q79961",
  "wikidataDescription": "colossal statue of Jesus in Rio de Janeiro, Brazil",
  "unescoId": null,
  "cityName": "Rio de Janeiro",
  "regionName": "Rio de Janeiro",
  "countryName": "Brazil",
  "lat": -22.951915648887244,
  "lng": -43.21046412278801,
  "timezone": "America/Sao_Paulo",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+1920-00-00T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "Albert Caquot, Paul Landowski, Gheorghe Leonida",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "not stated on Wikidata",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "reinforced concrete, soapstone",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "30.1 m",
      "source": "Wikidata P2048"
    },
    {
      "label": "UNESCO World Heritage Site ID",
      "value": "No UNESCO site ID in the fetched Wikidata claims — inscription status to be verified at ingest (absence of a claim is not proof of non-inscription)",
      "source": "Wikidata P757"
    }
  ],
  "media": [],
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q79961",
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
