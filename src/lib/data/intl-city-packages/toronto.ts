import type { IntlCityPackage } from './types';

// Toronto — international city package (BUILD ONLY, not wired to any page).
export const CITY_TORONTO: IntlCityPackage = {
  "qid": "Q172",
  "slug": "toronto",
  "name": "Toronto",
  "countrySlug": "canada",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Ontario",
  "timezone": "America/Toronto",
  "lat": 43.670277777778,
  "lng": -79.386666666667,
  "glance": {
    "population": {
      "value": 2794356.0,
      "year": 2021,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 630.21,
    "elevationM": 76.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "CN Tower",
      "wikiUrl": "https://en.wikipedia.org/wiki/CN_Tower",
      "wikiVerified": true
    },
    {
      "name": "Royal Ontario Museum",
      "wikiUrl": "https://en.wikipedia.org/wiki/Royal_Ontario_Museum",
      "wikiVerified": true
    },
    {
      "name": "Toronto Islands",
      "wikiUrl": "https://en.wikipedia.org/wiki/Toronto_Islands",
      "wikiVerified": true
    },
    {
      "name": "Casa Loma",
      "wikiUrl": "https://en.wikipedia.org/wiki/Casa_Loma",
      "wikiVerified": true
    },
    {
      "name": "St. Lawrence Market",
      "wikiUrl": "https://en.wikipedia.org/wiki/St._Lawrence_Market",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Peameal bacon sandwich",
      "description": "Cornmeal-crusted back bacon on a bun, a St. Lawrence Market icon."
    },
    {
      "name": "Poutine",
      "description": "Fries with cheese curds and gravy, from Quebec and now nationwide."
    },
    {
      "name": "Butter tart",
      "description": "Flaky pastry with a butter, sugar and raisin filling."
    },
    {
      "name": "Beaver Tail",
      "description": "Fried dough pastry topped with cinnamon sugar (Ottawa-born, sold citywide)."
    },
    {
      "name": "Toronto street hot dog",
      "description": "Cart-grilled sausage with a wide choice of toppings."
    }
  ],
  "emergency": {
    "police": "911",
    "ambulance": "911",
    "fire": "911"
  },
  "localSources": [
    "Statistics Canada Web Data Service (census + indicators)",
    "City of Toronto Open Data portal"
  ],
  "diaspora": null,
  "sources": [
    "Wikidata (identity, coordinates, population, area, elevation) — entity verified by description",
    "Wikipedia (landmark articles, existence-verified at build)",
    "Local data API map 2026-10-22 (localSources)",
    "Official emergency numbers of the country"
  ]
};
