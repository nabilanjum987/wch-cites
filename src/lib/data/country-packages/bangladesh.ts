import type { CountryPackage } from './types';

// Bangladesh — country package (BUILD ONLY, not wired to any page).
// Facts: Wikidata identity + World Bank economy snapshot (2026-10-22) + Wikipedia-verified lists.
export const COUNTRY_BANGLADESH: CountryPackage = {
  "slug": "bangladesh",
  "name": "Bangladesh",
  "iso2": "BD",
  "iso3": "BGD",
  "isoNote": "Explicit slug→ISO map (Panama law) — never derived from the slug.",
  "capital": {
    "name": "Dhaka",
    "lat": 23.71,
    "lng": 90.41
  },
  "areaKm2": 147570.0,
  "currency": {
    "code": "BDT",
    "name": "Bangladeshi taka"
  },
  "languages": [
    "Bangla"
  ],
  "callingCode": "+880",
  "population": {
    "value": 175686899,
    "year": 2025,
    "indicator": "SP.POP.TOTL"
  },
  "economySnapshot": {
    "source": "World Bank API (api.worldbank.org) — packaged snapshot pulled 2026-10-22; at activation the country page reads the SAME indicator set live via fetchWorldBankLatest(iso3) / getCountryEconomy (one-cached-dataset pattern). Missing keys = the World Bank publishes no recent value; consumers hide them.",
    "indicators": {
      "gdpUsd": {
        "value": 456319229255.58,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.CD"
      },
      "gdpGrowth": {
        "value": 3.49,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.KD.ZG"
      },
      "gdpPerCapita": {
        "value": 2597.34,
        "year": 2025,
        "indicator": "NY.GDP.PCAP.CD"
      },
      "inflation": {
        "value": 8.77,
        "year": 2025,
        "indicator": "FP.CPI.TOTL.ZG"
      },
      "unemployment": {
        "value": 3.78,
        "year": 2025,
        "indicator": "SL.UEM.TOTL.ZS"
      },
      "population": {
        "value": 175686899,
        "year": 2025,
        "indicator": "SP.POP.TOTL"
      },
      "laborForce": {
        "value": 74739682,
        "year": 2025,
        "indicator": "SL.TLF.TOTL.IN"
      },
      "lifeExpectancy": {
        "value": 74.93,
        "year": 2024,
        "indicator": "SP.DYN.LE00.IN"
      },
      "literacy": {
        "value": 79,
        "year": 2022,
        "indicator": "SE.ADT.LITR.ZS"
      },
      "gini": {
        "value": 30.9,
        "year": 2022,
        "indicator": "SI.POV.GINI"
      },
      "poverty": {
        "value": 5.9,
        "year": 2022,
        "indicator": "SI.POV.DDAY"
      },
      "fdiUsd": {
        "value": 1784539607.08,
        "year": 2025,
        "indicator": "BX.KLT.DINV.CD.WD"
      },
      "remittancesUsd": {
        "value": 33879048131.61,
        "year": 2025,
        "indicator": "BX.TRF.PWKR.CD.DT"
      },
      "tradeBalanceUsd": {
        "value": -28482230325.19,
        "year": 2025,
        "indicator": "BN.GSR.GNFS.CD"
      },
      "realRate": {
        "value": 1.97,
        "year": 2025,
        "indicator": "FR.INR.RINR"
      }
    }
  },
  "subdivisionType": "Division",
  "subdivisions": [
    {
      "name": "Dhaka",
      "capital": "Dhaka"
    },
    {
      "name": "Chattogram",
      "capital": "Chattogram"
    },
    {
      "name": "Khulna",
      "capital": "Khulna"
    },
    {
      "name": "Rajshahi",
      "capital": "Rajshahi"
    },
    {
      "name": "Barishal",
      "capital": "Barishal"
    },
    {
      "name": "Sylhet",
      "capital": "Sylhet"
    },
    {
      "name": "Rangpur",
      "capital": "Rangpur"
    },
    {
      "name": "Mymensingh",
      "capital": "Mymensingh"
    }
  ],
  "subdivisionsSource": "Wikipedia: Divisions of Bangladesh",
  "personalitiesPool": [
    {
      "slug": "sheikh-mujibur-rahman",
      "name": "Sheikh Mujibur Rahman",
      "note": "Founding leader of Bangladesh",
      "years": "1920–1975",
      "wikiUrl": "https://en.wikipedia.org/wiki/Sheikh_Mujibur_Rahman",
      "wikiVerified": true
    },
    {
      "slug": "muhammad-yunus",
      "name": "Muhammad Yunus",
      "note": "Economist; Nobel Peace Prize laureate; founder of Grameen Bank",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Muhammad_Yunus",
      "wikiVerified": true
    },
    {
      "slug": "kazi-nazrul-islam",
      "name": "Kazi Nazrul Islam",
      "note": "National poet of Bangladesh",
      "years": "1899–1976",
      "wikiUrl": "https://en.wikipedia.org/wiki/Kazi_Nazrul_Islam",
      "wikiVerified": true
    },
    {
      "slug": "humayun-ahmed",
      "name": "Humayun Ahmed",
      "note": "Novelist and filmmaker",
      "years": "1948–2012",
      "wikiUrl": "https://en.wikipedia.org/wiki/Humayun_Ahmed",
      "wikiVerified": true
    },
    {
      "slug": "shakib-al-hasan",
      "name": "Shakib Al Hasan",
      "note": "Cricketer",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Shakib_Al_Hasan",
      "wikiVerified": true
    },
    {
      "slug": "rokeya-sakhawat-hossain",
      "name": "Rokeya Sakhawat Hossain",
      "note": "Writer and women's education advocate",
      "years": "1880–1932",
      "wikiUrl": "https://en.wikipedia.org/wiki/Rokeya_Sakhawat_Hossain",
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
