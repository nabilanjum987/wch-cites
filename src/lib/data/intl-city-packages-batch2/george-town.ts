import type { IntlCityPackage } from './types';

// George Town — international city package, batch 2 (BUILD ONLY).
export const CITY_GEORGE_TOWN: IntlCityPackage = {
  "qid": "Q61092",
  "slug": "george-town",
  "name": "George Town",
  "countrySlug": "malaysia",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Penang",
  "timezone": "Asia/Kuala_Lumpur",
  "lat": 5.4145,
  "lng": 100.3292,
  "glance": {
    "population": {
      "value": 794313.0,
      "year": 2020,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 305.77,
    "elevationM": 4.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Kek Lok Si",
      "wikiUrl": "https://en.wikipedia.org/wiki/Kek_Lok_Si",
      "wikiVerified": true
    },
    {
      "name": "Penang Hill",
      "wikiUrl": "https://en.wikipedia.org/wiki/Penang_Hill",
      "wikiVerified": true
    },
    {
      "name": "Cheong Fatt Tze Mansion",
      "wikiUrl": "https://en.wikipedia.org/wiki/Cheong_Fatt_Tze_Mansion",
      "wikiVerified": true
    },
    {
      "name": "Clan Jetties",
      "wikiUrl": "https://en.wikipedia.org/wiki/Clan_Jetties",
      "wikiVerified": true
    },
    {
      "name": "Khoo Kongsi",
      "wikiUrl": "https://en.wikipedia.org/wiki/Khoo_Kongsi",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Char kway teow",
      "description": "Penang's celebrated wok-fried flat noodles."
    },
    {
      "name": "Asam laksa",
      "description": "Tangy tamarind fish noodle soup, a George Town icon."
    },
    {
      "name": "Nasi kandar",
      "description": "Rice with a mix of curries, born in Penang."
    },
    {
      "name": "Hokkien mee",
      "description": "Prawn-stock noodle soup with pork and egg."
    },
    {
      "name": "Cendol",
      "description": "Shaved ice with coconut milk, palm sugar and green rice-flour jelly."
    }
  ],
  "emergency": {
    "emergency": "999"
  },
  "localSources": [
    "Department of Statistics Malaysia (DOSM)",
    "Penang state open data"
  ],
  "diaspora": null,
  "sources": [
    "Wikidata (identity verified by description, coordinates, population, area, elevation)",
    "Wikipedia (landmark articles, existence-verified at build)",
    "Local data API map 2026-10-22 (localSources)",
    "Official emergency numbers of the country"
  ]
};
