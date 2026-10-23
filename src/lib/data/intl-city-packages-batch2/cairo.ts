import type { IntlCityPackage } from './types';

// Cairo — international city package, batch 2 (BUILD ONLY).
export const CITY_CAIRO: IntlCityPackage = {
  "qid": "Q85",
  "slug": "cairo",
  "name": "Cairo",
  "countrySlug": "egypt",
  "countryIsoNote": "Parent country ISO is resolved from the country package via the explicit slug->ISO map (Panama law).",
  "province": "Cairo Governorate",
  "timezone": "Africa/Cairo",
  "lat": 30.044444444444444,
  "lng": 31.235833333333332,
  "glance": {
    "population": {
      "value": 9801536.0,
      "year": 2023,
      "source": "Wikidata P1082 (statement with latest point-in-time where dated; year may be null when the source statement is undated)"
    },
    "areaKm2": 528.0,
    "elevationM": 23.0,
    "glanceSource": "Wikidata"
  },
  "landmarks": [
    {
      "name": "Egyptian Museum",
      "wikiUrl": "https://en.wikipedia.org/wiki/Egyptian_Museum",
      "wikiVerified": true
    },
    {
      "name": "Cairo Citadel",
      "wikiUrl": "https://en.wikipedia.org/wiki/Cairo_Citadel",
      "wikiVerified": true
    },
    {
      "name": "Khan el-Khalili",
      "wikiUrl": "https://en.wikipedia.org/wiki/Khan_el-Khalili",
      "wikiVerified": true
    },
    {
      "name": "Coptic Cairo",
      "wikiUrl": "https://en.wikipedia.org/wiki/Coptic_Cairo",
      "wikiVerified": true
    },
    {
      "name": "Al-Azhar Mosque",
      "wikiUrl": "https://en.wikipedia.org/wiki/Al-Azhar_Mosque",
      "wikiVerified": true
    }
  ],
  "foods": [
    {
      "name": "Koshari",
      "description": "Rice, lentils, pasta and chickpeas with spiced tomato sauce — Egypt's national dish."
    },
    {
      "name": "Ful medames",
      "description": "Stewed fava beans with oil and lemon, the classic breakfast."
    },
    {
      "name": "Ta'ameya",
      "description": "Fava-bean falafel, green with herbs."
    },
    {
      "name": "Mahshi",
      "description": "Vegetables stuffed with herbed rice."
    },
    {
      "name": "Umm Ali",
      "description": "Bread pudding with milk, nuts and coconut."
    }
  ],
  "emergency": {
    "police": "122",
    "ambulance": "123",
    "fire": "180"
  },
  "localSources": [
    "CAPMAS (Central Agency for Public Mobilization and Statistics) publications",
    "Egypt open data initiatives"
  ],
  "diaspora": null,
  "sources": [
    "Wikidata (identity verified by description, coordinates, population, area, elevation)",
    "Wikipedia (landmark articles, existence-verified at build)",
    "Local data API map 2026-10-22 (localSources)",
    "Official emergency numbers of the country"
  ]
};
