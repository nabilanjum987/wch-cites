import type { PlaceRow } from './types';

// Great Wall of China — place data row, batch 2 (BUILD ONLY; no page built).
export const PLACE_GREAT_WALL_OF_CHINA: PlaceRow = {
  "slug": "great-wall-of-china",
  "name": "Great Wall of China",
  "category": "Place",
  "wikidataQid": "Q12501",
  "wikidataDescription": "series of fortifications built along the historical border of China",
  "unescoId": null,
  "cityName": "Beijing",
  "regionName": "Beijing Municipality",
  "countryName": "China",
  "lat": 40.43138888888889,
  "lng": 116.56444444444445,
  "timezone": "Asia/Shanghai",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "-0700-00-00T00:00:00Z",
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
      "value": "limestone",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "5.0 m",
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
      "fileTitle": "File:\"The First Mound\"--the west end of the Great Wall.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a8/%22The_First_Mound%22--the_west_end_of_the_Great_Wall.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:%22The_First_Mound%22--the_west_end_of_the_Great_Wall.jpg",
      "width": 953,
      "height": 714,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Roland Longbow",
      "attribution": "Own work\n\nPreviously published: https://www.panoramio.com/photo/56570781?tag=Jiayuguan",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Great Wall of China, Beijing"
    },
    {
      "fileTitle": "File:20090529 Great Wall 8185.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/1/10/20090529_Great_Wall_8185.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:20090529_Great_Wall_8185.jpg",
      "width": 3008,
      "height": 2000,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Jakub Hałun",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Great Wall of China, Beijing"
    },
    {
      "fileTitle": "File:A long stretch of the Great Wall.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/2/27/A_long_stretch_of_the_Great_Wall.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:A_long_stretch_of_the_Great_Wall.jpg",
      "width": 640,
      "height": 480,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Mark Holmquist",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Great Wall of China, Beijing"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q12501",
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
