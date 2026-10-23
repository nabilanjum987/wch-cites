import type { IntlCityPackage } from './types';

// Muscat — international city package, batch 2 (BUILD ONLY).
export const CITY_MUSCAT: IntlCityPackage = {
  "qid": "Q3826",
  "slug": "muscat",
  "name": "Muscat",
  "countrySlug": "oman",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Muscat Governorate",
  "timezone": "Asia/Muscat",
  "lat": 23.613888888889,
  "lng": 58.592222222222,
  "glance": {
    "population": {
      "value": 1421409.0,
      "year": 2019,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 3500.0,
    "elevationM": 69.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Sultan Qaboos Grand Mosque, Muscat",
      "wikiUrl": null,
      "wikiVerified": false,
      "note": "No Wikipedia article verified at build time; link omitted."
    },
    {
      "name": "Muttrah Corniche",
      "wikiUrl": "https://en.wikipedia.org/wiki/Muttrah_Corniche",
      "wikiVerified": true,
      "resolvedFrom": "Mutrah Corniche"
    },
    {
      "name": "Al Alam Palace",
      "wikiUrl": "https://en.wikipedia.org/wiki/Al_Alam_Palace",
      "wikiVerified": true
    },
    {
      "name": "Royal Opera House Muscat",
      "wikiUrl": "https://en.wikipedia.org/wiki/Royal_Opera_House_Muscat",
      "wikiVerified": true
    },
    {
      "name": "Querim Beach",
      "wikiUrl": "https://en.wikipedia.org/wiki/Querim_Beach",
      "wikiVerified": true,
      "resolvedFrom": "Qurum Beach"
    }
  ],
  "foods": [
    {
      "name": "Shuwa",
      "description": "Slow-roasted marinated lamb cooked in an underground sand oven — Oman's festive dish."
    },
    {
      "name": "Mashuai",
      "description": "Grilled kingfish served with lemon rice."
    },
    {
      "name": "Harees",
      "description": "Wheat and meat porridge."
    },
    {
      "name": "Halwa",
      "description": "Omani halwa — a gelatinous sweet of starch, ghee, saffron and nuts, served with qahwa."
    },
    {
      "name": "Laban",
      "description": "Salted yogurt drink served with meals."
    }
  ],
  "emergency": {
    "emergency": "9999"
  },
  "localSources": [
    "National Centre for Statistics and Information (NCSI) Oman",
    "Oman open data portal (data.gov.om)"
  ],
  "diaspora": {
    "figures": "OMITTED at build time — no official nationality-breakdown table could be fetched and verified for this city during the build.",
    "note": "Exact diaspora shares enter only from an official census/statistics release."
  },
  "sources": [
    "Wikidata (identity verified by description, coordinates, population, area, elevation)",
    "Wikipedia (landmark articles, existence-verified at build)",
    "Local data API map 2026-10-22 (localSources)",
    "Official emergency numbers of the country"
  ]
};
