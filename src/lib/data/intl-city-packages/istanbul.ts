import type { IntlCityPackage } from './types';

// Istanbul — international city package (BUILD ONLY, not wired to any page).
export const CITY_ISTANBUL: IntlCityPackage = {
  "qid": "Q406",
  "slug": "istanbul",
  "name": "Istanbul",
  "countrySlug": "turkiye",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Istanbul Province",
  "timezone": "Europe/Istanbul",
  "lat": 41.01,
  "lng": 28.960277777778,
  "glance": {
    "population": {
      "value": 15655924.0,
      "year": 2023,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 5343.0,
    "elevationM": 100.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Hagia Sophia",
      "wikiUrl": "https://en.wikipedia.org/wiki/Hagia_Sophia",
      "wikiVerified": true
    },
    {
      "name": "Blue Mosque",
      "wikiUrl": "https://en.wikipedia.org/wiki/Blue_Mosque",
      "wikiVerified": true
    },
    {
      "name": "Topkapi Palace",
      "wikiUrl": "https://en.wikipedia.org/wiki/Topkapi_Palace",
      "wikiVerified": true
    },
    {
      "name": "Grand Bazaar, Istanbul",
      "wikiUrl": "https://en.wikipedia.org/wiki/Grand_Bazaar%2C_Istanbul",
      "wikiVerified": true
    },
    {
      "name": "Galata Tower",
      "wikiUrl": "https://en.wikipedia.org/wiki/Galata_Tower",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Kebab",
      "description": "Grilled meats in many regional styles, from Adana to Iskender."
    },
    {
      "name": "Istanbul simit",
      "description": "Sesame-crusted bread ring sold on every corner."
    },
    {
      "name": "Balık ekmek",
      "description": "Grilled fish sandwich served at Eminönü's waterfront."
    },
    {
      "name": "Turkish delight",
      "description": "Gel confection flavoured with rose, mastic or nuts."
    },
    {
      "name": "Baklava",
      "description": "Layered filo pastry with pistachio and syrup."
    }
  ],
  "emergency": {
    "police": "112",
    "ambulance": "112",
    "fire": "112"
  },
  "localSources": [
    "TurkStat (Turkish Statistical Institute) publications",
    "Eurostat (candidate-country datasets)"
  ],
  "diaspora": null,
  "sources": [
    "Wikidata (identity, coordinates, population, area, elevation) — entity verified by description",
    "Wikipedia (landmark articles, existence-verified at build)",
    "Local data API map 2026-10-22 (localSources)",
    "Official emergency numbers of the country"
  ]
};
