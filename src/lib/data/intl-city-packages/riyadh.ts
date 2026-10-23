import type { IntlCityPackage } from './types';

// Riyadh — international city package (BUILD ONLY, not wired to any page).
export const CITY_RIYADH: IntlCityPackage = {
  "qid": "Q3692",
  "slug": "riyadh",
  "name": "Riyadh",
  "countrySlug": "saudi-arabia",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Riyadh Region",
  "timezone": "Asia/Riyadh",
  "lat": 24.638333333333332,
  "lng": 46.715,
  "glance": {
    "population": {
      "value": 7009100.0,
      "year": 2022,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 1798.0,
    "elevationM": 612.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Kingdom Centre",
      "wikiUrl": "https://en.wikipedia.org/wiki/Kingdom_Centre",
      "wikiVerified": true
    },
    {
      "name": "Al Rajhi Grand Mosque",
      "wikiUrl": "https://en.wikipedia.org/wiki/Al_Rajhi_Grand_Mosque",
      "wikiVerified": true
    },
    {
      "name": "Diriyah",
      "wikiUrl": "https://en.wikipedia.org/wiki/Diriyah",
      "wikiVerified": true
    },
    {
      "name": "National Museum of Saudi Arabia",
      "wikiUrl": "https://en.wikipedia.org/wiki/National_Museum_of_Saudi_Arabia",
      "wikiVerified": true
    },
    {
      "name": "King Abdulaziz Historical Center",
      "wikiUrl": "https://en.wikipedia.org/wiki/King_Abdulaziz_Historical_Center",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Kabsa",
      "description": "Spiced rice with chicken or lamb, the Saudi national dish."
    },
    {
      "name": "Jareesh",
      "description": "Crushed wheat cooked with meat and yogurt."
    },
    {
      "name": "Saleeg",
      "description": "Creamy short-grain rice porridge from the Hejaz, popular in the capital."
    },
    {
      "name": "Mutabbaq",
      "description": "Stuffed savoury pancake, a beloved street food."
    },
    {
      "name": "Qahwa",
      "description": "Arabic coffee served with dates, the symbol of Saudi hospitality."
    }
  ],
  "emergency": {
    "police": "911",
    "ambulance": "997",
    "fire": "998"
  },
  "localSources": [
    "Saudi Open Data Portal (GASTAT)",
    "Saudi Press Agency / official municipal publications"
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
