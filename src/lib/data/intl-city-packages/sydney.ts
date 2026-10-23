import type { IntlCityPackage } from './types';

// Sydney — international city package (BUILD ONLY, not wired to any page).
export const CITY_SYDNEY: IntlCityPackage = {
  "qid": "Q3130",
  "slug": "sydney",
  "name": "Sydney",
  "countrySlug": "australia",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "New South Wales",
  "timezone": "Australia/Sydney",
  "lat": -33.867777777777775,
  "lng": 151.21,
  "glance": {
    "population": {
      "value": 5450496.0,
      "year": 2023,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 12144.6,
    "elevationM": 6.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Sydney Opera House",
      "wikiUrl": "https://en.wikipedia.org/wiki/Sydney_Opera_House",
      "wikiVerified": true
    },
    {
      "name": "Sydney Harbour Bridge",
      "wikiUrl": "https://en.wikipedia.org/wiki/Sydney_Harbour_Bridge",
      "wikiVerified": true
    },
    {
      "name": "Bondi Beach",
      "wikiUrl": "https://en.wikipedia.org/wiki/Bondi_Beach",
      "wikiVerified": true
    },
    {
      "name": "Royal Botanic Garden, Sydney",
      "wikiUrl": "https://en.wikipedia.org/wiki/Royal_Botanic_Garden%2C_Sydney",
      "wikiVerified": true
    },
    {
      "name": "The Rocks, Sydney",
      "wikiUrl": "https://en.wikipedia.org/wiki/The_Rocks%2C_Sydney",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Meat pie",
      "description": "Savoury minced-meat pie, the classic Australian hand-held meal."
    },
    {
      "name": "Barramundi",
      "description": "Native fish served grilled across harbour-side restaurants."
    },
    {
      "name": "Lamington",
      "description": "Sponge cake coated in chocolate and desiccated coconut."
    },
    {
      "name": "Pavlova",
      "description": "Meringue dessert with cream and fruit (shared heritage with New Zealand)."
    },
    {
      "name": "Vegemite on toast",
      "description": "Savoury yeast spread on buttered toast, a breakfast icon."
    }
  ],
  "emergency": {
    "police": "000",
    "ambulance": "000",
    "fire": "000"
  },
  "localSources": [
    "ABS Data API (Australian Bureau of Statistics, free)",
    "Bureau of Meteorology observations"
  ],
  "diaspora": null,
  "sources": [
    "Wikidata (identity, coordinates, population, area, elevation) — entity verified by description",
    "Wikipedia (landmark articles, existence-verified at build)",
    "Local data API map 2026-10-22 (localSources)",
    "Official emergency numbers of the country"
  ]
};
