import type { PlaceRow } from './types';

// Sydney Opera House — place data row (BUILD ONLY; no page built).
export const PLACE_SYDNEY_OPERA_HOUSE: PlaceRow = {
  "slug": "sydney-opera-house",
  "name": "Sydney Opera House",
  "category": "Place",
  "wikidataQid": "Q45178",
  "wikidataDescription": "multi-venue performing arts centre in Sydney, New South Wales, Australia",
  "unescoId": 166,
  "cityName": "Sydney",
  "regionName": "New South Wales",
  "countryName": "Australia",
  "lat": -33.857058,
  "lng": 151.214897,
  "timezone": "Australia/Sydney",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+1973-00-00T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "Jørn Utzon, Peter Hall",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "expressionist architecture",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "concrete",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "67.0 m",
      "source": "Wikidata P2048"
    },
    {
      "label": "UNESCO World Heritage Site ID",
      "value": "166rev (raw Wikidata P757 value — revised listing identifier; numeric ID 166)",
      "source": "Wikidata P757"
    }
  ],
  "media": [
    {
      "fileTitle": "File:2024 Royal Visit Sydney (2).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/0/01/2024_Royal_Visit_Sydney_%282%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:2024_Royal_Visit_Sydney_(2).jpg",
      "width": 1333,
      "height": 772,
      "licence": "CC BY 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/4.0",
      "author": "NSW Government",
      "attribution": "https://www.nsw.gov.au/about-nsw/royal-visit-to-nsw-by-his-majesty-king-charles-iii-and-her-majesty-queen-camilla",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Sydney Opera House, Sydney"
    },
    {
      "fileTitle": "File:ANZ Stadium Sydney July 2015 (cropped).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0e/ANZ_Stadium_Sydney_July_2015_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:ANZ_Stadium_Sydney_July_2015_(cropped).jpg",
      "width": 1772,
      "height": 727,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Phamthuathienvan (thảo luận)",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Sydney Opera House, Sydney"
    },
    {
      "fileTitle": "File:AUS NSW Opera House DSC05118.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0f/AUS_NSW_Opera_House_DSC05118.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:AUS_NSW_Opera_House_DSC05118.jpg",
      "width": 1024,
      "height": 768,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
      "author": "",
      "attribution": "wikipedia inglesa [1]",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Sydney Opera House, Sydney"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q45178",
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
