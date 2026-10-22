import type { IntlCityPackage } from './types';

// London — international city package (BUILD ONLY, not wired to any page).
export const CITY_LONDON: IntlCityPackage = {
  "qid": "Q84",
  "slug": "london",
  "name": "London",
  "countrySlug": "united-kingdom",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Greater London",
  "timezone": "Europe/London",
  "lat": 51.507222222222,
  "lng": -0.1275,
  "glance": {
    "population": {
      "value": 8799728.0,
      "year": 2021,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 1572.0,
    "elevationM": 15.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Big Ben",
      "wikiUrl": "https://en.wikipedia.org/wiki/Big_Ben",
      "wikiVerified": true
    },
    {
      "name": "Tower of London",
      "wikiUrl": "https://en.wikipedia.org/wiki/Tower_of_London",
      "wikiVerified": true
    },
    {
      "name": "Buckingham Palace",
      "wikiUrl": "https://en.wikipedia.org/wiki/Buckingham_Palace",
      "wikiVerified": true
    },
    {
      "name": "British Museum",
      "wikiUrl": "https://en.wikipedia.org/wiki/British_Museum",
      "wikiVerified": true
    },
    {
      "name": "London Eye",
      "wikiUrl": "https://en.wikipedia.org/wiki/London_Eye",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Fish and chips",
      "description": "Battered fish with thick-cut chips, the classic takeaway."
    },
    {
      "name": "Full English breakfast",
      "description": "Eggs, bacon, sausage, beans, mushrooms and toast."
    },
    {
      "name": "Sunday roast",
      "description": "Roast meat with Yorkshire pudding and gravy."
    },
    {
      "name": "Pie and mash",
      "description": "Meat pie with mashed potato and parsley liquor sauce."
    },
    {
      "name": "Afternoon tea",
      "description": "Finger sandwiches, scones and cakes with tea."
    }
  ],
  "emergency": {
    "police": "999",
    "ambulance": "999",
    "fire": "999"
  },
  "localSources": [
    "postcodes.io (postcode geography, free, no key)",
    "police.uk API (street-level crime, free)",
    "data.gov.uk / ONS statistics",
    "Met Office climate data"
  ],
  "diaspora": null,
  "sources": [
    "Wikidata (identity, coordinates, population, area, elevation) — entity verified by description",
    "Wikipedia (landmark articles, existence-verified at build)",
    "Local data API map 2026-10-22 (localSources)",
    "Official emergency numbers of the country"
  ]
};
