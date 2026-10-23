import type { IntlCityPackage } from './types';

// Kuala Lumpur — international city package, batch 2 (BUILD ONLY).
export const CITY_KUALA_LUMPUR: IntlCityPackage = {
  "qid": "Q1865",
  "slug": "kuala-lumpur",
  "name": "Kuala Lumpur",
  "countrySlug": "malaysia",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Federal Territory of Kuala Lumpur",
  "timezone": "Asia/Kuala_Lumpur",
  "lat": 3.1477777777778,
  "lng": 101.69527777778,
  "glance": {
    "population": {
      "value": 9000280.0,
      "year": 2025,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 243.65,
    "elevationM": 66.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Petronas Twin Towers",
      "wikiUrl": "https://en.wikipedia.org/wiki/Petronas_Twin_Towers",
      "wikiVerified": true
    },
    {
      "name": "Batu Caves",
      "wikiUrl": "https://en.wikipedia.org/wiki/Batu_Caves",
      "wikiVerified": true
    },
    {
      "name": "Merdeka Square, Kuala Lumpur",
      "wikiUrl": "https://en.wikipedia.org/wiki/Merdeka_Square%2C_Kuala_Lumpur",
      "wikiVerified": true
    },
    {
      "name": "Kuala Lumpur Tower",
      "wikiUrl": "https://en.wikipedia.org/wiki/Kuala_Lumpur_Tower",
      "wikiVerified": true
    },
    {
      "name": "Perdana Botanical Gardens",
      "wikiUrl": "https://en.wikipedia.org/wiki/Perdana_Botanical_Gardens",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Nasi lemak",
      "description": "Coconut rice with sambal, anchovies, peanuts and egg — Malaysia's national dish."
    },
    {
      "name": "Char kway teow",
      "description": "Stir-fried flat rice noodles with prawns, egg and bean sprouts."
    },
    {
      "name": "Satay",
      "description": "Grilled skewered meat with peanut sauce."
    },
    {
      "name": "Roti canai",
      "description": "Flaky flatbread served with dhal or curry."
    },
    {
      "name": "Teh tarik",
      "description": "Pulled milk tea, frothed by pouring between two vessels."
    }
  ],
  "emergency": {
    "emergency": "999"
  },
  "localSources": [
    "Department of Statistics Malaysia (DOSM)",
    "Malaysia open data portal (data.gov.my)"
  ],
  "diaspora": null,
  "sources": [
    "Wikidata (identity verified by description, coordinates, population, area, elevation)",
    "Wikipedia (landmark articles, existence-verified at build)",
    "Local data API map 2026-10-22 (localSources)",
    "Official emergency numbers of the country"
  ]
};
