import type { IntlCityPackage } from './types';

// New York City — international city package (BUILD ONLY, not wired to any page).
export const CITY_NEW_YORK: IntlCityPackage = {
  "qid": "Q60",
  "slug": "new-york",
  "name": "New York City",
  "countrySlug": "united-states",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "New York State",
  "timezone": "America/New_York",
  "lat": 40.71277777777778,
  "lng": -74.00611111111111,
  "glance": {
    "population": {
      "value": 8804190.0,
      "year": 2020,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 1213.369839,
    "elevationM": 25.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Statue of Liberty",
      "wikiUrl": "https://en.wikipedia.org/wiki/Statue_of_Liberty",
      "wikiVerified": true
    },
    {
      "name": "Empire State Building",
      "wikiUrl": "https://en.wikipedia.org/wiki/Empire_State_Building",
      "wikiVerified": true
    },
    {
      "name": "Central Park",
      "wikiUrl": "https://en.wikipedia.org/wiki/Central_Park",
      "wikiVerified": true
    },
    {
      "name": "Times Square",
      "wikiUrl": "https://en.wikipedia.org/wiki/Times_Square",
      "wikiVerified": true
    },
    {
      "name": "Brooklyn Bridge",
      "wikiUrl": "https://en.wikipedia.org/wiki/Brooklyn_Bridge",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "New York-style pizza",
      "description": "Large, thin, foldable slices sold by pizzerias citywide."
    },
    {
      "name": "Bagel",
      "description": "Chewy boiled-then-baked ring bread, a deli staple."
    },
    {
      "name": "New York cheesecake",
      "description": "Dense baked cheesecake with a biscuit base."
    },
    {
      "name": "Pastrami sandwich",
      "description": "Cured, smoked beef piled on rye at classic delis."
    },
    {
      "name": "Hot dog",
      "description": "Street-cart frankfurter with mustard, onions or sauerkraut."
    }
  ],
  "emergency": {
    "police": "911",
    "ambulance": "911",
    "fire": "911"
  },
  "localSources": [
    "NWS api.weather.gov (official weather, no key)",
    "US Census API (city demographics)",
    "api.data.gov umbrella (EPA AirNow AQI, EIA, NPS)"
  ],
  "diaspora": null,
  "sources": [
    "Wikidata (identity, coordinates, population, area, elevation) — entity verified by description",
    "Wikipedia (landmark articles, existence-verified at build)",
    "Local data API map 2026-10-22 (localSources)",
    "Official emergency numbers of the country"
  ]
};
