import type { IntlCityPackage } from './types';

// Canberra — international city package, batch 2 (BUILD ONLY).
export const CITY_CANBERRA: IntlCityPackage = {
  "qid": "Q3114",
  "slug": "canberra",
  "name": "Canberra",
  "countrySlug": "australia",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Australian Capital Territory",
  "timezone": "Australia/Sydney",
  "lat": -35.293055555556,
  "lng": 149.12694444444,
  "glance": {
    "population": {
      "value": 473855.0,
      "year": 2024,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 471.78,
    "elevationM": 578.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Parliament House, Canberra",
      "wikiUrl": "https://en.wikipedia.org/wiki/Parliament_House%2C_Canberra",
      "wikiVerified": true
    },
    {
      "name": "Australian War Memorial",
      "wikiUrl": "https://en.wikipedia.org/wiki/Australian_War_Memorial",
      "wikiVerified": true
    },
    {
      "name": "Lake Burley Griffin",
      "wikiUrl": "https://en.wikipedia.org/wiki/Lake_Burley_Griffin",
      "wikiVerified": true
    },
    {
      "name": "National Gallery of Australia",
      "wikiUrl": "https://en.wikipedia.org/wiki/National_Gallery_of_Australia",
      "wikiVerified": true
    },
    {
      "name": "Old Parliament House, Canberra",
      "wikiUrl": "https://en.wikipedia.org/wiki/Old_Parliament_House%2C_Canberra",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Meat pie",
      "description": "Savoury minced-meat pie, the Australian classic."
    },
    {
      "name": "Lamington",
      "description": "Chocolate-and-coconut sponge cake."
    },
    {
      "name": "Pavlova",
      "description": "Meringue with cream and fruit."
    },
    {
      "name": "Barramundi",
      "description": "Native fish, served grilled."
    },
    {
      "name": "Flat white",
      "description": "Espresso with steamed milk — the café standard."
    }
  ],
  "emergency": {
    "emergency": "000"
  },
  "localSources": [
    "ABS Data API (Australian Bureau of Statistics)",
    "ACT Government open data portal"
  ],
  "diaspora": null,
  "sources": [
    "Wikidata (identity verified by description, coordinates, population, area, elevation)",
    "Wikipedia (landmark articles, existence-verified at build)",
    "Local data API map 2026-10-22 (localSources)",
    "Official emergency numbers of the country"
  ]
};
