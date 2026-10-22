import type { IntlCityPackage } from './types';

// Sharjah — international city package (BUILD ONLY, not wired to any page).
export const CITY_SHARJAH: IntlCityPackage = {
  "qid": "Q188810",
  "slug": "sharjah",
  "name": "Sharjah",
  "countrySlug": "united-arab-emirates",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Sharjah",
  "timezone": "Asia/Dubai",
  "lat": 25.35,
  "lng": 55.433055555555555,
  "glance": {
    "population": {
      "value": 1405843.0,
      "year": 2015,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 2590.0,
    "elevationM": 174.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Al Noor Mosque (Sharjah)",
      "wikiUrl": "https://en.wikipedia.org/wiki/Al_Noor_Mosque_%28Sharjah%29",
      "wikiVerified": true,
      "resolvedFrom": "Al Noor Mosque, Sharjah"
    },
    {
      "name": "Sharjah Museum of Islamic Civilization",
      "wikiUrl": "https://en.wikipedia.org/wiki/Sharjah_Museum_of_Islamic_Civilization",
      "wikiVerified": true
    },
    {
      "name": "Al Majaz Waterfront",
      "wikiUrl": null,
      "wikiVerified": false,
      "note": "No Wikipedia article verified at build time; name kept from the curated list, link omitted."
    },
    {
      "name": "Heart of Sharjah",
      "wikiUrl": "https://en.wikipedia.org/wiki/Heart_of_Sharjah",
      "wikiVerified": true
    },
    {
      "name": "Sharjah Art Foundation",
      "wikiUrl": "https://en.wikipedia.org/wiki/Sharjah_Art_Foundation",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Al Harees",
      "description": "Traditional wheat and meat dish."
    },
    {
      "name": "Machboos",
      "description": "Spiced rice with meat or seafood."
    },
    {
      "name": "Luqaimat",
      "description": "Sweet dumplings with date syrup."
    },
    {
      "name": "Regag",
      "description": "Thin Emirati crepe-style bread, a street-food favourite."
    },
    {
      "name": "Shawarma",
      "description": "Marinated meat wraps sold across the old souks."
    }
  ],
  "emergency": {
    "police": "999",
    "ambulance": "998",
    "fire": "997"
  },
  "localSources": [
    "UAE open data portal (Bayanat)",
    "Sharjah Department of Statistics and Community Development publications"
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
