import type { IntlCityPackage } from './types';

// Abu Dhabi — international city package (BUILD ONLY, not wired to any page).
export const CITY_ABU_DHABI: IntlCityPackage = {
  "qid": "Q1519",
  "slug": "abu-dhabi",
  "name": "Abu Dhabi",
  "countrySlug": "united-arab-emirates",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Abu Dhabi",
  "timezone": "Asia/Dubai",
  "lat": 24.45111111111111,
  "lng": 54.39694444444444,
  "glance": {
    "population": {
      "value": 1570000.0,
      "year": 2023,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 972.0,
    "elevationM": 14.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Sheikh Zayed Grand Mosque",
      "wikiUrl": "https://en.wikipedia.org/wiki/Sheikh_Zayed_Grand_Mosque",
      "wikiVerified": true
    },
    {
      "name": "Emirates Palace",
      "wikiUrl": "https://en.wikipedia.org/wiki/Emirates_Palace",
      "wikiVerified": true
    },
    {
      "name": "Qasr al-Hosn",
      "wikiUrl": "https://en.wikipedia.org/wiki/Qasr_al-Hosn",
      "wikiVerified": true
    },
    {
      "name": "Louvre Abu Dhabi",
      "wikiUrl": "https://en.wikipedia.org/wiki/Louvre_Abu_Dhabi",
      "wikiVerified": true
    },
    {
      "name": "Corniche Road, Abu Dhabi",
      "wikiUrl": null,
      "wikiVerified": false,
      "note": "No Wikipedia article verified at build time; name kept from the curated list, link omitted."
    }
  ],
  "foods": [
    {
      "name": "Al Harees",
      "description": "Wheat and meat porridge served at weddings and Ramadan."
    },
    {
      "name": "Thareed",
      "description": "Bread soaked in meat and vegetable stew."
    },
    {
      "name": "Machboos",
      "description": "Spiced rice with chicken, lamb or fish."
    },
    {
      "name": "Luqaimat",
      "description": "Fried sweet dumplings with date syrup."
    },
    {
      "name": "Khanfaroosh",
      "description": "Saffron and cardamom fried cakes served with tea."
    }
  ],
  "emergency": {
    "police": "999",
    "ambulance": "998",
    "fire": "997"
  },
  "localSources": [
    "UAE open data portal (Bayanat)",
    "Statistics Centre Abu Dhabi (SCAD) publications"
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
