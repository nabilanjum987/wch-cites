import type { IntlCityPackage } from './types';

// Doha — international city package (BUILD ONLY, not wired to any page).
export const CITY_DOHA: IntlCityPackage = {
  "qid": "Q3861",
  "slug": "doha",
  "name": "Doha",
  "countrySlug": "qatar",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Ad Dawhah",
  "timezone": "Asia/Qatar",
  "lat": 25.28611111111111,
  "lng": 51.529444444444444,
  "glance": {
    "population": {
      "value": 1186023.0,
      "year": 2020,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 132000000.0,
    "elevationM": 0.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Museum of Islamic Art, Doha",
      "wikiUrl": "https://en.wikipedia.org/wiki/Museum_of_Islamic_Art%2C_Doha",
      "wikiVerified": true
    },
    {
      "name": "Souq Waqif",
      "wikiUrl": "https://en.wikipedia.org/wiki/Souq_Waqif",
      "wikiVerified": true
    },
    {
      "name": "Katara Cultural Village",
      "wikiUrl": "https://en.wikipedia.org/wiki/Katara_Cultural_Village",
      "wikiVerified": true
    },
    {
      "name": "The Pearl Island",
      "wikiUrl": "https://en.wikipedia.org/wiki/The_Pearl_Island",
      "wikiVerified": true
    },
    {
      "name": "National Museum of Qatar",
      "wikiUrl": "https://en.wikipedia.org/wiki/National_Museum_of_Qatar",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Machboos",
      "description": "Spiced rice with meat or seafood, Qatar's national dish."
    },
    {
      "name": "Harees",
      "description": "Wheat and meat porridge served in Ramadan."
    },
    {
      "name": "Luqaimat",
      "description": "Sweet dumplings with date syrup."
    },
    {
      "name": "Balaleet",
      "description": "Sweet vermicelli breakfast with saffron."
    },
    {
      "name": "Thareed",
      "description": "Bread layered in meat stew."
    }
  ],
  "emergency": {
    "police": "999",
    "ambulance": "999",
    "fire": "999"
  },
  "localSources": [
    "Qatar Planning and Statistics Authority publications",
    "Qatar Open Data Portal"
  ],
  "diaspora": {
    "figures": "OMITTED at build time — no official nationality-breakdown table could be fetched and verified for this city during the build; do not publish diaspora percentages from secondary sources.",
    "note": "Expatriate-majority character is documented qualitatively in official statistics publications listed in localSources; exact shares enter only from an official census/statistics release."
  },
  "sources": [
    "Wikidata (identity, coordinates, population, area, elevation) — entity verified by description",
    "Wikipedia (landmark articles, existence-verified at build)",
    "Local data API map 2026-10-22 (localSources)",
    "Official emergency numbers of the country"
  ]
};
