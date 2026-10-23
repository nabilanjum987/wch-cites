import type { IntlCityPackage } from './types';

// Kuwait City — international city package, batch 2 (BUILD ONLY).
export const CITY_KUWAIT_CITY: IntlCityPackage = {
  "qid": "Q35178",
  "slug": "kuwait-city",
  "name": "Kuwait City",
  "countrySlug": "kuwait",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Al Asimah Governorate",
  "timezone": "Asia/Kuwait",
  "lat": 29.375,
  "lng": 47.98,
  "glance": {
    "population": {
      "value": 2989000.0,
      "year": 2018,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": null,
    "elevationM": 16.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Kuwait Towers",
      "wikiUrl": "https://en.wikipedia.org/wiki/Kuwait_Towers",
      "wikiVerified": true
    },
    {
      "name": "Grand Mosque of Kuwait",
      "wikiUrl": "https://en.wikipedia.org/wiki/Grand_Mosque_of_Kuwait",
      "wikiVerified": true,
      "resolvedFrom": "Grand Mosque, Kuwait"
    },
    {
      "name": "Al Shaheed Park",
      "wikiUrl": "https://en.wikipedia.org/wiki/Al_Shaheed_Park",
      "wikiVerified": true
    },
    {
      "name": "Souq Al-Mubarakiya",
      "wikiUrl": "https://en.wikipedia.org/wiki/Souq_Al-Mubarakiya",
      "wikiVerified": true,
      "resolvedFrom": "Souk Al-Mubarakiya"
    },
    {
      "name": "Liberation Tower",
      "wikiUrl": "https://en.wikipedia.org/wiki/Liberation_Tower",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Machboos",
      "description": "Spiced rice with chicken, lamb or fish — Kuwait's national dish."
    },
    {
      "name": "Harees",
      "description": "Wheat and meat porridge served in Ramadan."
    },
    {
      "name": "Gers Ogaily",
      "description": "Saffron and cardamom sponge cake served with tea."
    },
    {
      "name": "Balaleet",
      "description": "Sweet vermicelli with saffron and egg."
    },
    {
      "name": "Samak Mashwi",
      "description": "Grilled fish, a Gulf-coast staple."
    }
  ],
  "emergency": {
    "emergency": "112"
  },
  "localSources": [
    "Kuwait Central Statistical Bureau publications",
    "Kuwait open data portal (data.gov.kw)"
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
