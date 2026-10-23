import type { IntlCityPackage } from './types';

// Jeddah — international city package (BUILD ONLY, not wired to any page).
export const CITY_JEDDAH: IntlCityPackage = {
  "qid": "Q374365",
  "slug": "jeddah",
  "name": "Jeddah",
  "countrySlug": "saudi-arabia",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Makkah Region",
  "timezone": "Asia/Riyadh",
  "lat": 21.529166666666665,
  "lng": 39.16111111111111,
  "glance": {
    "population": {
      "value": 4697000.0,
      "year": 2021,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 1600.0,
    "elevationM": 12.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "King Fahd's Fountain",
      "wikiUrl": "https://en.wikipedia.org/wiki/King_Fahd%27s_Fountain",
      "wikiVerified": true
    },
    {
      "name": "Al-Balad, Jeddah",
      "wikiUrl": "https://en.wikipedia.org/wiki/Al-Balad%2C_Jeddah",
      "wikiVerified": true
    },
    {
      "name": "Jeddah Tower",
      "wikiUrl": "https://en.wikipedia.org/wiki/Jeddah_Tower",
      "wikiVerified": true
    },
    {
      "name": "Al-Rahmah Mosque",
      "wikiUrl": "https://en.wikipedia.org/wiki/Al-Rahmah_Mosque",
      "wikiVerified": true,
      "resolvedFrom": "Al Rahmah Mosque"
    },
    {
      "name": "Jeddah Corniche",
      "wikiUrl": "https://en.wikipedia.org/wiki/Jeddah_Corniche",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Saleeg",
      "description": "Hejazi creamy rice porridge, the signature dish of the region."
    },
    {
      "name": "Mutabbaq",
      "description": "Stuffed pancake sold in Al-Balad markets."
    },
    {
      "name": "Sayadieh",
      "description": "Spiced rice with fish, reflecting the Red Sea coast."
    },
    {
      "name": "Foul",
      "description": "Fava bean breakfast dish served with tamis bread."
    },
    {
      "name": "Masoub",
      "description": "Banana and bread pudding with honey and cream."
    }
  ],
  "emergency": {
    "police": "911",
    "ambulance": "997",
    "fire": "998"
  },
  "localSources": [
    "Saudi Open Data Portal (GASTAT)",
    "Official Jeddah municipality publications"
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
