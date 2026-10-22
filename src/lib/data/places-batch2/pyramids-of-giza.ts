import type { PlaceRow } from './types';

// Pyramids of Giza — place data row, batch 2 (BUILD ONLY; no page built).
export const PLACE_PYRAMIDS_OF_GIZA: PlaceRow = {
  "slug": "pyramids-of-giza",
  "name": "Pyramids of Giza",
  "category": "Place",
  "wikidataQid": "Q12508",
  "wikidataDescription": "archaeological site on the Giza Plateau, Egypt",
  "unescoId": null,
  "cityName": "Giza",
  "regionName": "Giza Governorate",
  "countryName": "Egypt",
  "lat": 29.976111,
  "lng": 31.132778,
  "timezone": "Africa/Cairo",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "not stated on Wikidata",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "not stated on Wikidata",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "not stated on Wikidata",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "not stated on Wikidata",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "not stated on Wikidata",
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
      "fileTitle": "File:A History of Art in Ancient Egypt Vol 1 (page 187b crop).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2e/A_History_of_Art_in_Ancient_Egypt_Vol_1_%28page_187b_crop%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:A_History_of_Art_in_Ancient_Egypt_Vol_1_(page_187b_crop).jpg",
      "width": 600,
      "height": 226,
      "licence": "Public domain",
      "licenceUrl": null,
      "author": "",
      "attribution": "Internet Archive identifier: historyofartinan01perruoft",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Pyramids of Giza, Giza"
    },
    {
      "fileTitle": "File:A History of Art in Ancient Egypt Vol 1 (page 283 crop).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1e/A_History_of_Art_in_Ancient_Egypt_Vol_1_%28page_283_crop%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:A_History_of_Art_in_Ancient_Egypt_Vol_1_(page_283_crop).jpg",
      "width": 950,
      "height": 477,
      "licence": "Public domain",
      "licenceUrl": null,
      "author": "",
      "attribution": "Internet Archive identifier: historyofartinan01perruoft",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Pyramids of Giza, Giza"
    },
    {
      "fileTitle": "File:A History of Art in Ancient Egypt Vol 1 (page 288 crop).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e4/A_History_of_Art_in_Ancient_Egypt_Vol_1_%28page_288_crop%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:A_History_of_Art_in_Ancient_Egypt_Vol_1_(page_288_crop).jpg",
      "width": 1710,
      "height": 1795,
      "licence": "Public domain",
      "licenceUrl": null,
      "author": "",
      "attribution": "Internet Archive identifier: historyofartinan01perruoft",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Pyramids of Giza, Giza"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q12508",
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
