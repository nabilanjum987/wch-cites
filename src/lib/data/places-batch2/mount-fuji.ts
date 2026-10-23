import type { PlaceRow } from './types';

// Mount Fuji — place data row, batch 2 (BUILD ONLY; no page built).
export const PLACE_MOUNT_FUJI: PlaceRow = {
  "slug": "mount-fuji",
  "name": "Mount Fuji",
  "category": "Place",
  "wikidataQid": "Q39231",
  "wikidataDescription": "volcano in Yamanashi and Shizuoka Prefectures, Japan",
  "unescoId": null,
  "cityName": "Honshu",
  "regionName": "Shizuoka / Yamanashi",
  "countryName": "Japan",
  "lat": 35.36055555555556,
  "lng": 138.7275,
  "timezone": "Asia/Tokyo",
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
      "value": "basalt",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "not stated on Wikidata",
      "source": "Wikidata P2048"
    },
    {
      "label": "UNESCO World Heritage Site ID",
      "value": "1418-001 (raw Wikidata P757 value)",
      "source": "Wikidata P757"
    }
  ],
  "media": [
    {
      "fileTitle": "File:Aerial panorama of Mount Fuji from Lake Saiko. June 2023.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/5/51/Aerial_panorama_of_Mount_Fuji_from_Lake_Saiko._June_2023.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Aerial_panorama_of_Mount_Fuji_from_Lake_Saiko._June_2023.jpg",
      "width": 8192,
      "height": 3302,
      "licence": "CC BY 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/4.0",
      "author": "Bob Tan",
      "attribution": "Own work",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Mount Fuji, Honshu"
    },
    {
      "fileTitle": "File:Aerial panorama of Mount Fuji with Saiko Iyashi-no-Sato Nenba in the foreground. June 2023.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Aerial_panorama_of_Mount_Fuji_with_Saiko_Iyashi-no-Sato_Nenba_in_the_foreground._June_2023.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Aerial_panorama_of_Mount_Fuji_with_Saiko_Iyashi-no-Sato_Nenba_in_the_foreground._June_2023.jpg",
      "width": 8192,
      "height": 3302,
      "licence": "CC BY 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/4.0",
      "author": "Bob Tan",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Mount Fuji, Honshu"
    },
    {
      "fileTitle": "File:Amaterasu cave crop.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Amaterasu_cave_crop.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Amaterasu_cave_crop.jpg",
      "width": 880,
      "height": 1688,
      "licence": "Public domain",
      "licenceUrl": null,
      "author": "Utagawa Kunisada (歌川国貞; b. 1786, d. 1865)",
      "attribution": "[1]",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Mount Fuji, Honshu"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q39231",
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
