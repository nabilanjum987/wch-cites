import type { IntlCityPackage } from './types';

// Vancouver — international city package, batch 2 (BUILD ONLY).
export const CITY_VANCOUVER: IntlCityPackage = {
  "qid": "Q24639",
  "slug": "vancouver",
  "name": "Vancouver",
  "countrySlug": "canada",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "British Columbia",
  "timezone": "America/Vancouver",
  "lat": 49.26083333333333,
  "lng": -123.1138888888889,
  "glance": {
    "population": {
      "value": 662248.0,
      "year": 2021,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 115.0,
    "elevationM": 2.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Stanley Park",
      "wikiUrl": "https://en.wikipedia.org/wiki/Stanley_Park",
      "wikiVerified": true
    },
    {
      "name": "Granville Island",
      "wikiUrl": "https://en.wikipedia.org/wiki/Granville_Island",
      "wikiVerified": true
    },
    {
      "name": "Capilano Suspension Bridge",
      "wikiUrl": "https://en.wikipedia.org/wiki/Capilano_Suspension_Bridge",
      "wikiVerified": true
    },
    {
      "name": "Gastown",
      "wikiUrl": "https://en.wikipedia.org/wiki/Gastown",
      "wikiVerified": true
    },
    {
      "name": "Vancouver Aquarium",
      "wikiUrl": "https://en.wikipedia.org/wiki/Vancouver_Aquarium",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Salmon",
      "description": "Wild Pacific salmon, the city's signature fish."
    },
    {
      "name": "Poutine",
      "description": "Fries, cheese curds and gravy."
    },
    {
      "name": "Japadog",
      "description": "Japanese-style hot dogs, a Vancouver street-food invention."
    },
    {
      "name": "Nanaimo bar",
      "description": "Chocolate-coconut crumb dessert from Vancouver Island."
    },
    {
      "name": "Spot prawns",
      "description": "Seasonal local delicacy celebrated each spring."
    }
  ],
  "emergency": {
    "emergency": "911"
  },
  "localSources": [
    "Statistics Canada Web Data Service",
    "City of Vancouver Open Data portal"
  ],
  "diaspora": null,
  "sources": [
    "Wikidata (identity verified by description, coordinates, population, area, elevation)",
    "Wikipedia (landmark articles, existence-verified at build)",
    "Local data API map 2026-10-22 (localSources)",
    "Official emergency numbers of the country"
  ]
};
