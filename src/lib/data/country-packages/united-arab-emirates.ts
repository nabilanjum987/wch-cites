import type { CountryPackage } from './types';

// United Arab Emirates — country package (BUILD ONLY, not wired to any page).
// Facts: Wikidata identity + World Bank economy snapshot (2026-10-22) + Wikipedia-verified lists.
export const COUNTRY_UNITED_ARAB_EMIRATES: CountryPackage = {
  "slug": "united-arab-emirates",
  "name": "United Arab Emirates",
  "iso2": "AE",
  "iso3": "ARE",
  "isoNote": "Explicit slug→ISO map (Panama law) — never derived from the slug.",
  "capital": {
    "name": "Abu Dhabi",
    "lat": 24.45,
    "lng": 54.4
  },
  "areaKm2": 83600.0,
  "currency": {
    "code": "AED",
    "name": "United Arab Emirates dirham"
  },
  "languages": [
    "Arabic"
  ],
  "callingCode": "+971",
  "population": {
    "value": 11513149,
    "year": 2025,
    "indicator": "SP.POP.TOTL"
  },
  "economySnapshot": {
    "source": "World Bank API (api.worldbank.org) — packaged snapshot pulled 2026-10-22; at activation the country page reads the SAME indicator set live via fetchWorldBankLatest(iso3) / getCountryEconomy (one-cached-dataset pattern). Missing keys = the World Bank publishes no recent value; consumers hide them.",
    "indicators": {
      "gdpUsd": {
        "value": 552324919095.87,
        "year": 2024,
        "indicator": "NY.GDP.MKTP.CD"
      },
      "gdpGrowth": {
        "value": 3.99,
        "year": 2024,
        "indicator": "NY.GDP.MKTP.KD.ZG"
      },
      "gdpPerCapita": {
        "value": 50273.51,
        "year": 2024,
        "indicator": "NY.GDP.PCAP.CD"
      },
      "inflation": {
        "value": 1.25,
        "year": 2025,
        "indicator": "FP.CPI.TOTL.ZG"
      },
      "unemployment": {
        "value": 2.17,
        "year": 2025,
        "indicator": "SL.UEM.TOTL.ZS"
      },
      "population": {
        "value": 11513149,
        "year": 2025,
        "indicator": "SP.POP.TOTL"
      },
      "laborForce": {
        "value": 7602907,
        "year": 2025,
        "indicator": "SL.TLF.TOTL.IN"
      },
      "lifeExpectancy": {
        "value": 83.07,
        "year": 2024,
        "indicator": "SP.DYN.LE00.IN"
      },
      "literacy": {
        "value": 98.81,
        "year": 2024,
        "indicator": "SE.ADT.LITR.ZS"
      },
      "gini": {
        "value": 26.4,
        "year": 2018,
        "indicator": "SI.POV.GINI"
      },
      "poverty": {
        "value": 0,
        "year": 2018,
        "indicator": "SI.POV.DDAY"
      },
      "fdiUsd": {
        "value": 48243430905.38,
        "year": 2025,
        "indicator": "BX.KLT.DINV.CD.WD"
      },
      "tradeBalanceUsd": {
        "value": 123049748127.98,
        "year": 2025,
        "indicator": "BN.GSR.GNFS.CD"
      },
      "debtPctGdp": {
        "value": 1.8,
        "year": 2013,
        "indicator": "GC.DOD.TOTL.GD.ZS"
      }
    }
  },
  "subdivisionType": "Emirate",
  "subdivisions": [
    {
      "name": "Abu Dhabi",
      "capital": "Abu Dhabi"
    },
    {
      "name": "Dubai",
      "capital": "Dubai"
    },
    {
      "name": "Sharjah",
      "capital": "Sharjah"
    },
    {
      "name": "Ajman",
      "capital": "Ajman"
    },
    {
      "name": "Fujairah",
      "capital": "Fujairah"
    },
    {
      "name": "Ras Al Khaimah",
      "capital": "Ras Al Khaimah"
    },
    {
      "name": "Umm Al Quwain",
      "capital": "Umm Al Quwain"
    }
  ],
  "subdivisionsSource": "Wikipedia: Emirates of the United Arab Emirates",
  "personalitiesPool": [
    {
      "slug": "zayed-bin-sultan-al-nahyan",
      "name": "Zayed bin Sultan Al Nahyan",
      "note": "Founder and first President of the UAE",
      "years": "1918–2004",
      "wikiUrl": "https://en.wikipedia.org/wiki/Zayed_bin_Sultan_Al_Nahyan",
      "wikiVerified": true
    },
    {
      "slug": "khalifa-bin-zayed-al-nahyan",
      "name": "Khalifa bin Zayed Al Nahyan",
      "note": "Second President of the UAE",
      "years": "1948–2022",
      "wikiUrl": "https://en.wikipedia.org/wiki/Khalifa_bin_Zayed_Al_Nahyan",
      "wikiVerified": true
    },
    {
      "slug": "mohamed-bin-zayed-al-nahyan",
      "name": "Mohamed bin Zayed Al Nahyan",
      "note": "President of the UAE",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Mohamed_bin_Zayed_Al_Nahyan",
      "wikiVerified": true
    },
    {
      "slug": "mohammed-bin-rashid-al-maktoum",
      "name": "Mohammed bin Rashid Al Maktoum",
      "note": "Ruler of Dubai; Vice President and Prime Minister",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Mohammed_bin_Rashid_Al_Maktoum",
      "wikiVerified": true
    },
    {
      "slug": "lubna-khalid-al-qasimi",
      "name": "Lubna Khalid Al Qasimi",
      "note": "First woman minister in the UAE",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Lubna_Khalid_Al_Qasimi",
      "wikiVerified": true
    },
    {
      "slug": "hazza-al-mansouri",
      "name": "Hazza Al Mansouri",
      "note": "First Emirati astronaut",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Hazza_Al_Mansouri",
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
