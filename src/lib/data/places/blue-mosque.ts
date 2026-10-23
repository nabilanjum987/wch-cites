import type { PlaceRow } from './types';

// Sultan Ahmed Mosque — place data row (BUILD ONLY; no page built).
export const PLACE_BLUE_MOSQUE: PlaceRow = {
  "slug": "blue-mosque",
  "name": "Sultan Ahmed Mosque",
  "category": "Place",
  "wikidataQid": "Q80541",
  "wikidataDescription": "historic mosque located in Istanbul, Turkey, also known as Blue Mosque",
  "unescoId": null,
  "cityName": "Istanbul",
  "regionName": "Istanbul Province",
  "countryName": "Türkiye",
  "lat": 41.0053851,
  "lng": 28.9768247,
  "timezone": "Europe/Istanbul",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+1609-00-00T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "Sedefkar Mehmed Ağa",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "Ottoman architecture",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "not stated on Wikidata",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "64.0 m",
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
      "fileTitle": "File:Fatih Hebrew Wikivoyage front page banner.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Fatih_Hebrew_Wikivoyage_front_page_banner.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Fatih_Hebrew_Wikivoyage_front_page_banner.jpg",
      "width": 7393,
      "height": 2462,
      "licence": "CC BY 2.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/2.0",
      "author": "Mike McBey",
      "attribution": "Istanbul skyline",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Sultan Ahmed Mosque, Istanbul"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q80541",
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
