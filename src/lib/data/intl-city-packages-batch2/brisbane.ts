import type { IntlCityPackage } from './types';

// Brisbane — international city package, batch 2 (BUILD ONLY).
export const CITY_BRISBANE: IntlCityPackage = {
  "qid": "Q34932",
  "slug": "brisbane",
  "name": "Brisbane",
  "countrySlug": "australia",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Queensland",
  "timezone": "Australia/Brisbane",
  "lat": -27.467777777778,
  "lng": 153.02777777778,
  "glance": {
    "population": {
      "value": 2706966.0,
      "year": 2023,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 15826.0,
    "elevationM": 0.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Story Bridge",
      "wikiUrl": "https://en.wikipedia.org/wiki/Story_Bridge",
      "wikiVerified": true
    },
    {
      "name": "South Bank Parklands",
      "wikiUrl": "https://en.wikipedia.org/wiki/South_Bank_Parklands",
      "wikiVerified": true
    },
    {
      "name": "Lone Pine Koala Sanctuary",
      "wikiUrl": "https://en.wikipedia.org/wiki/Lone_Pine_Koala_Sanctuary",
      "wikiVerified": true
    },
    {
      "name": "Queensland Gallery of Modern Art",
      "wikiUrl": "https://en.wikipedia.org/wiki/Queensland_Gallery_of_Modern_Art",
      "wikiVerified": true
    },
    {
      "name": "Mount Coot-tha, Brisbane",
      "wikiUrl": null,
      "wikiVerified": false,
      "note": "No Wikipedia article verified at build time; link omitted."
    }
  ],
  "foods": [
    {
      "name": "Meat pie",
      "description": "The Australian hand-held classic."
    },
    {
      "name": "Moreton Bay bug",
      "description": "Native slipper lobster, a Brisbane seafood specialty."
    },
    {
      "name": "Lamington",
      "description": "Chocolate-coconut sponge (claimed as a Queensland invention)."
    },
    {
      "name": "Pavlova",
      "description": "Meringue, cream and fruit."
    },
    {
      "name": "Barramundi",
      "description": "Grilled native fish."
    }
  ],
  "emergency": {
    "emergency": "000"
  },
  "localSources": [
    "ABS Data API",
    "Queensland Government open data portal"
  ],
  "diaspora": null,
  "sources": [
    "Wikidata (identity verified by description, coordinates, population, area, elevation)",
    "Wikipedia (landmark articles, existence-verified at build)",
    "Local data API map 2026-10-22 (localSources)",
    "Official emergency numbers of the country"
  ]
};
