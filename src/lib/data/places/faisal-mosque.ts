import type { PlaceRow } from './types';

// Faisal Mosque — place data row (BUILD ONLY; no page built).
export const PLACE_FAISAL_MOSQUE: PlaceRow = {
  "slug": "faisal-mosque",
  "name": "Faisal Mosque",
  "category": "Place",
  "wikidataQid": "Q500983",
  "wikidataDescription": "mosque in Islamabad (Pakistan)",
  "unescoId": null,
  "cityName": "Islamabad",
  "regionName": "Islamabad Capital Territory",
  "countryName": "Pakistan",
  "lat": 33.72972222222222,
  "lng": 73.03722222222223,
  "timezone": "Asia/Karachi",
  "facts": [
    {
      "label": "Inception / construction start",
      "value": "+1986-00-00T00:00:00Z",
      "source": "Wikidata P571"
    },
    {
      "label": "Architect",
      "value": "Vedat Dalokay",
      "source": "Wikidata P84"
    },
    {
      "label": "Architectural style",
      "value": "Islamic architecture",
      "source": "Wikidata P149"
    },
    {
      "label": "Materials",
      "value": "marble",
      "source": "Wikidata P186"
    },
    {
      "label": "Height",
      "value": "90.0 m",
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
      "fileTitle": "File:A different angle of Faisal Masjid by Usman Ghani.JPG",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4b/A_different_angle_of_Faisal_Masjid_by_Usman_Ghani.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:A_different_angle_of_Faisal_Masjid_by_Usman_Ghani.JPG",
      "width": 3872,
      "height": 2592,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Usman.pg",
      "attribution": "Own work",
      "role": "hero",
      "sortOrder": 1,
      "alt": "Faisal Mosque, Islamabad"
    },
    {
      "fileTitle": "File:A view of Faisal Mosque, Islamabad from Daman-e-koh.JPG",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8c/A_view_of_Faisal_Mosque%2C_Islamabad_from_Daman-e-koh.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:A_view_of_Faisal_Mosque,_Islamabad_from_Daman-e-koh.JPG",
      "width": 4608,
      "height": 3072,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Muhammad Owais Khan",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 2,
      "alt": "Faisal Mosque, Islamabad"
    },
    {
      "fileTitle": "File:Ali Mujtaba WLM2015 FAISAL MOSQUE 06.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/d/dd/Ali_Mujtaba_WLM2015_FAISAL_MOSQUE_06.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Ali_Mujtaba_WLM2015_FAISAL_MOSQUE_06.jpg",
      "width": 1944,
      "height": 3000,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Ali Mujtaba",
      "attribution": "Own work",
      "role": "gallery",
      "sortOrder": 3,
      "alt": "Faisal Mosque, Islamabad"
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
      "sourceUrl": "https://www.wikidata.org/wiki/Q500983",
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
