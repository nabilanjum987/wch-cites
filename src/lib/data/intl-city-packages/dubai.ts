import type { IntlCityPackage } from './types';

// Dubai — international city package (BUILD ONLY, not wired to any page).
export const CITY_DUBAI: IntlCityPackage = {
  "qid": "Q612",
  "slug": "dubai",
  "name": "Dubai",
  "countrySlug": "united-arab-emirates",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Dubai",
  "timezone": "Asia/Dubai",
  "lat": 25.269722222222,
  "lng": 55.309444444444,
  "glance": {
    "population": {
      "value": 3944751.0,
      "year": 2025,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 35.0,
    "elevationM": 0.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Burj Khalifa",
      "wikiUrl": "https://en.wikipedia.org/wiki/Burj_Khalifa",
      "wikiVerified": true
    },
    {
      "name": "Dubai Mall",
      "wikiUrl": "https://en.wikipedia.org/wiki/Dubai_Mall",
      "wikiVerified": true
    },
    {
      "name": "Palm Jumeirah",
      "wikiUrl": "https://en.wikipedia.org/wiki/Palm_Jumeirah",
      "wikiVerified": true
    },
    {
      "name": "Dubai Creek",
      "wikiUrl": "https://en.wikipedia.org/wiki/Dubai_Creek",
      "wikiVerified": true
    },
    {
      "name": "Jumeirah Mosque",
      "wikiUrl": "https://en.wikipedia.org/wiki/Jumeirah_Mosque",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Al Harees",
      "description": "Wheat and meat porridge, a traditional Emirati dish served at festivals."
    },
    {
      "name": "Luqaimat",
      "description": "Sweet saffron dumplings drizzled with date syrup."
    },
    {
      "name": "Machboos",
      "description": "Spiced rice with meat or seafood, the Gulf biryani-style staple."
    },
    {
      "name": "Shawarma",
      "description": "Levantine-style marinated meat wraps, ubiquitous across the city."
    },
    {
      "name": "Balaleet",
      "description": "Sweet vermicelli with saffron and cardamom, eaten for breakfast."
    }
  ],
  "emergency": {
    "police": "999",
    "ambulance": "998",
    "fire": "997"
  },
  "localSources": [
    "UAE open data portal (Bayanat)",
    "Dubai Statistics Center publications"
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
