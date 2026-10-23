import type { CountryPackage } from './types';

// Saudi Arabia — country package (BUILD ONLY, not wired to any page).
// Facts: Wikidata identity + World Bank economy snapshot (2026-10-22) + Wikipedia-verified lists.
export const COUNTRY_SAUDI_ARABIA: CountryPackage = {
  "slug": "saudi-arabia",
  "name": "Saudi Arabia",
  "iso2": "SA",
  "iso3": "SAU",
  "isoNote": "Explicit slug→ISO map (Panama law) — never derived from the slug.",
  "capital": {
    "name": "Riyadh",
    "lat": 24.69,
    "lng": 46.72
  },
  "areaKm2": 2250000.0,
  "currency": {
    "code": "SAR",
    "name": "Saudi riyal"
  },
  "languages": [
    "Arabic"
  ],
  "callingCode": "+966",
  "population": {
    "value": 36973555,
    "year": 2025,
    "indicator": "SP.POP.TOTL"
  },
  "economySnapshot": {
    "source": "World Bank API (api.worldbank.org) — packaged snapshot pulled 2026-10-22; at activation the country page reads the SAME indicator set live via fetchWorldBankLatest(iso3) / getCountryEconomy (one-cached-dataset pattern). Missing keys = the World Bank publishes no recent value; consumers hide them.",
    "indicators": {
      "gdpUsd": {
        "value": 1276942933333.33,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.CD"
      },
      "gdpGrowth": {
        "value": 4.5,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.KD.ZG"
      },
      "gdpPerCapita": {
        "value": 34536.66,
        "year": 2025,
        "indicator": "NY.GDP.PCAP.CD"
      },
      "inflation": {
        "value": 2.04,
        "year": 2025,
        "indicator": "FP.CPI.TOTL.ZG"
      },
      "unemployment": {
        "value": 3.04,
        "year": 2025,
        "indicator": "SL.UEM.TOTL.ZS"
      },
      "population": {
        "value": 36973555,
        "year": 2025,
        "indicator": "SP.POP.TOTL"
      },
      "laborForce": {
        "value": 18383677,
        "year": 2025,
        "indicator": "SL.TLF.TOTL.IN"
      },
      "lifeExpectancy": {
        "value": 78.98,
        "year": 2024,
        "indicator": "SP.DYN.LE00.IN"
      },
      "literacy": {
        "value": 97.93,
        "year": 2024,
        "indicator": "SE.ADT.LITR.ZS"
      },
      "fdiUsd": {
        "value": 32628095187.09,
        "year": 2025,
        "indicator": "BX.KLT.DINV.CD.WD"
      },
      "remittancesUsd": {
        "value": 350569478.58,
        "year": 2025,
        "indicator": "BX.TRF.PWKR.CD.DT"
      },
      "tradeBalanceUsd": {
        "value": 22162950448.49,
        "year": 2025,
        "indicator": "BN.GSR.GNFS.CD"
      }
    }
  },
  "subdivisionType": "Region",
  "subdivisions": [
    {
      "name": "Riyadh",
      "capital": "Riyadh"
    },
    {
      "name": "Makkah",
      "capital": "Mecca"
    },
    {
      "name": "Al Madinah",
      "capital": "Medina"
    },
    {
      "name": "Eastern Province",
      "capital": "Dammam"
    },
    {
      "name": "Asir",
      "capital": "Abha"
    },
    {
      "name": "Tabuk",
      "capital": "Tabuk"
    },
    {
      "name": "Ha'il",
      "capital": "Ha'il"
    },
    {
      "name": "Northern Borders",
      "capital": "Arar"
    },
    {
      "name": "Jazan",
      "capital": "Jazan"
    },
    {
      "name": "Najran",
      "capital": "Najran"
    },
    {
      "name": "Al Bahah",
      "capital": "Al Bahah"
    },
    {
      "name": "Al Jouf",
      "capital": "Sakaka"
    },
    {
      "name": "Al Qassim",
      "capital": "Buraydah"
    }
  ],
  "subdivisionsSource": "Wikipedia: Regions of Saudi Arabia",
  "personalitiesPool": [
    {
      "slug": "ibn-saud",
      "name": "Ibn Saud",
      "note": "Founder of the Kingdom of Saudi Arabia",
      "years": "1875–1953",
      "wikiUrl": "https://en.wikipedia.org/wiki/Ibn_Saud",
      "wikiVerified": true
    },
    {
      "slug": "salman-of-saudi-arabia",
      "name": "Salman of Saudi Arabia",
      "note": "King of Saudi Arabia",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Salman_of_Saudi_Arabia",
      "wikiVerified": true
    },
    {
      "slug": "mohammed-bin-salman",
      "name": "Mohammed bin Salman",
      "note": "Crown Prince and Prime Minister",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Mohammed_bin_Salman",
      "wikiVerified": true
    },
    {
      "slug": "faisal-of-saudi-arabia",
      "name": "Faisal of Saudi Arabia",
      "note": "King of Saudi Arabia (1964–1975)",
      "years": "1906–1975",
      "wikiUrl": "https://en.wikipedia.org/wiki/Faisal_of_Saudi_Arabia",
      "wikiVerified": true
    },
    {
      "slug": "haifa-al-mansour",
      "name": "Haifa al-Mansour",
      "note": "Film director; first Saudi woman feature-film director",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Haifa_al-Mansour",
      "wikiVerified": true
    },
    {
      "slug": "mohammed-abdu",
      "name": "Mohammed Abdu",
      "note": "Singer, \"Artist of the Arabs\"",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Mohammed_Abdu",
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
