import type { CountryPackage } from './types';

// United Kingdom — country package (BUILD ONLY, not wired to any page).
// Facts: Wikidata identity + World Bank economy snapshot (2026-10-22) + Wikipedia-verified lists.
export const COUNTRY_UNITED_KINGDOM: CountryPackage = {
  "slug": "united-kingdom",
  "name": "United Kingdom",
  "iso2": "GB",
  "iso3": "GBR",
  "isoNote": "Explicit slug→ISO map (Panama law) — never derived from the slug.",
  "capital": {
    "name": "London",
    "lat": 51.51,
    "lng": -0.13
  },
  "areaKm2": 242495.0,
  "currency": {
    "code": "GBP",
    "name": "pound sterling"
  },
  "languages": [
    "English",
    "Welsh",
    "Scottish Gaelic",
    "Scots",
    "Cornish",
    "Irish",
    "Ulster Scots",
    "British Sign Language"
  ],
  "callingCode": "+44",
  "population": {
    "value": 69487000,
    "year": 2025,
    "indicator": "SP.POP.TOTL"
  },
  "economySnapshot": {
    "source": "World Bank API (api.worldbank.org) — packaged snapshot pulled 2026-10-22; at activation the country page reads the SAME indicator set live via fetchWorldBankLatest(iso3) / getCountryEconomy (one-cached-dataset pattern). Missing keys = the World Bank publishes no recent value; consumers hide them.",
    "indicators": {
      "gdpUsd": {
        "value": 4002587541846.01,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.CD"
      },
      "gdpGrowth": {
        "value": 1.39,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.KD.ZG"
      },
      "gdpPerCapita": {
        "value": 57601.96,
        "year": 2025,
        "indicator": "NY.GDP.PCAP.CD"
      },
      "inflation": {
        "value": 3.88,
        "year": 2025,
        "indicator": "FP.CPI.TOTL.ZG"
      },
      "unemployment": {
        "value": 4.75,
        "year": 2025,
        "indicator": "SL.UEM.TOTL.ZS"
      },
      "population": {
        "value": 69487000,
        "year": 2025,
        "indicator": "SP.POP.TOTL"
      },
      "laborForce": {
        "value": 35409108,
        "year": 2025,
        "indicator": "SL.TLF.TOTL.IN"
      },
      "lifeExpectancy": {
        "value": 81.39,
        "year": 2024,
        "indicator": "SP.DYN.LE00.IN"
      },
      "gini": {
        "value": 32.4,
        "year": 2021,
        "indicator": "SI.POV.GINI"
      },
      "poverty": {
        "value": 0.4,
        "year": 2021,
        "indicator": "SI.POV.DDAY"
      },
      "fdiUsd": {
        "value": 37588831510.97,
        "year": 2025,
        "indicator": "BX.KLT.DINV.CD.WD"
      },
      "remittancesUsd": {
        "value": 5363775142.14,
        "year": 2025,
        "indicator": "BX.TRF.PWKR.CD.DT"
      },
      "tradeBalanceUsd": {
        "value": -52248152850.78,
        "year": 2025,
        "indicator": "BN.GSR.GNFS.CD"
      },
      "realRate": {
        "value": -1.08,
        "year": 2014,
        "indicator": "FR.INR.RINR"
      },
      "debtPctGdp": {
        "value": 130.74,
        "year": 2024,
        "indicator": "GC.DOD.TOTL.GD.ZS"
      }
    }
  },
  "subdivisionType": "Constituent country",
  "subdivisions": [
    {
      "name": "England",
      "capital": "London"
    },
    {
      "name": "Scotland",
      "capital": "Edinburgh"
    },
    {
      "name": "Wales",
      "capital": "Cardiff"
    },
    {
      "name": "Northern Ireland",
      "capital": "Belfast"
    }
  ],
  "subdivisionsSource": "Wikipedia: Countries of the United Kingdom",
  "personalitiesPool": [
    {
      "slug": "william-shakespeare",
      "name": "William Shakespeare",
      "note": "Playwright and poet",
      "years": "1564–1616",
      "wikiUrl": "https://en.wikipedia.org/wiki/William_Shakespeare",
      "wikiVerified": true
    },
    {
      "slug": "isaac-newton",
      "name": "Isaac Newton",
      "note": "Physicist and mathematician",
      "years": "1643–1727",
      "wikiUrl": "https://en.wikipedia.org/wiki/Isaac_Newton",
      "wikiVerified": true
    },
    {
      "slug": "winston-churchill",
      "name": "Winston Churchill",
      "note": "Prime Minister during the Second World War",
      "years": "1874–1965",
      "wikiUrl": "https://en.wikipedia.org/wiki/Winston_Churchill",
      "wikiVerified": true
    },
    {
      "slug": "elizabeth-ii",
      "name": "Elizabeth II",
      "note": "Queen of the United Kingdom (1952–2022)",
      "years": "1926–2022",
      "wikiUrl": "https://en.wikipedia.org/wiki/Elizabeth_II",
      "wikiVerified": true
    },
    {
      "slug": "charles-darwin",
      "name": "Charles Darwin",
      "note": "Naturalist; theory of evolution",
      "years": "1809–1882",
      "wikiUrl": "https://en.wikipedia.org/wiki/Charles_Darwin",
      "wikiVerified": true
    },
    {
      "slug": "ada-lovelace",
      "name": "Ada Lovelace",
      "note": "Mathematician; first computer programmer",
      "years": "1815–1852",
      "wikiUrl": "https://en.wikipedia.org/wiki/Ada_Lovelace",
      "wikiVerified": true
    }
  ],
  "sources": [
    "Wikidata (identity facts: capital, area, currency, languages, calling code)",
    "World Bank API (population + economy snapshot, each value carries its year)",
    "Wikipedia list article for subdivisions (see subdivisionsSource)",
    "Wikipedia (personality entries, existence-verified 2026-10-22)",
    "Workspace dataset world_capitals.csv (capital coordinates)"
  ]
};
