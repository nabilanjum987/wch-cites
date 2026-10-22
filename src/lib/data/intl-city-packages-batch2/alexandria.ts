import type { IntlCityPackage } from './types';

// Alexandria — international city package, batch 2 (BUILD ONLY).
export const CITY_ALEXANDRIA: IntlCityPackage = {
  "qid": "Q87",
  "slug": "alexandria",
  "name": "Alexandria",
  "countrySlug": "egypt",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Alexandria Governorate",
  "timezone": "Africa/Cairo",
  "lat": 31.1975,
  "lng": 29.8925,
  "glance": {
    "population": {
      "value": 5362517.0,
      "year": 2023,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 2523.0,
    "elevationM": -1.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Citadel of Qaitbay",
      "wikiUrl": "https://en.wikipedia.org/wiki/Citadel_of_Qaitbay",
      "wikiVerified": true
    },
    {
      "name": "Bibliotheca Alexandrina",
      "wikiUrl": "https://en.wikipedia.org/wiki/Bibliotheca_Alexandrina",
      "wikiVerified": true
    },
    {
      "name": "Montaza Palace",
      "wikiUrl": "https://en.wikipedia.org/wiki/Montaza_Palace",
      "wikiVerified": true
    },
    {
      "name": "Catacombs of Kom El Shoqafa",
      "wikiUrl": "https://en.wikipedia.org/wiki/Catacombs_of_Kom_El_Shoqafa",
      "wikiVerified": true
    },
    {
      "name": "Stanley Bridge, Alexandria",
      "wikiUrl": null,
      "wikiVerified": false,
      "note": "No Wikipedia article verified at build time; link omitted."
    }
  ],
  "foods": [
    {
      "name": "Sayadieh",
      "description": "Spiced rice with fish, the Alexandrine coastal signature."
    },
    {
      "name": "Kebda Eskandarani",
      "description": "Alexandria-style liver with garlic, cumin and chilli."
    },
    {
      "name": "Roz bel laban",
      "description": "Baked rice pudding with milk."
    },
    {
      "name": "Feteer",
      "description": "Flaky layered pastry, sweet or savoury."
    },
    {
      "name": "Seafood grills",
      "description": "Fresh Mediterranean catch grilled along the Corniche."
    }
  ],
  "emergency": {
    "police": "122",
    "ambulance": "123",
    "fire": "180"
  },
  "localSources": [
    "CAPMAS publications",
    "Alexandria Governorate official portal"
  ],
  "diaspora": null,
  "sources": [
    "Wikidata (identity verified by description, coordinates, population, area, elevation)",
    "Wikipedia (landmark articles, existence-verified at build)",
    "Local data API map 2026-10-22 (localSources)",
    "Official emergency numbers of the country"
  ]
};
