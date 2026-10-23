import type { CountryPackage } from './types';

// Oman — country package, batch 2 (BUILD ONLY, not wired to any page).
// Carries two extra fields beyond CountryPackage (qid, eventsNotes, resolverNote where present) —
// typed via the exported const assertion below.
export const COUNTRY_OMAN = {
  "slug": "oman",
  "name": "Oman",
  "iso2": "OM",
  "iso3": "OMN",
  "isoNote": "Explicit slug→ISO map (Panama law) — never derived from the slug.",
  "qid": "Q842",
  "capital": {
    "name": "Muscat",
    "lat": 23.58413,
    "lng": 58.40778
  },
  "areaKm2": 309500.0,
  "currency": {
    "code": "OMR",
    "name": "Omani rial"
  },
  "languages": [
    "Arabic"
  ],
  "callingCode": "+968",
  "population": {
    "value": 5494691,
    "year": 2025,
    "indicator": "SP.POP.TOTL"
  },
  "economySnapshot": {
    "source": "World Bank API — packaged snapshot pulled 2026-10-22; same 16-indicator set as fetchWorldBankLatest (src/lib/apis/worldbank.ts); live at activation via the one-cached-dataset pattern.",
    "indicators": {
      "gdpUsd": {
        "value": 109604780696.23,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.CD"
      },
      "gdpGrowth": {
        "value": 2.39787382295398,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.KD.ZG"
      },
      "gdpPerCapita": {
        "value": 19947.3966227092,
        "year": 2025,
        "indicator": "NY.GDP.PCAP.CD"
      },
      "inflation": {
        "value": 0.967741935483927,
        "year": 2025,
        "indicator": "FP.CPI.TOTL.ZG"
      },
      "unemployment": {
        "value": 3.251,
        "year": 2025,
        "indicator": "SL.UEM.TOTL.ZS"
      },
      "population": {
        "value": 5494691,
        "year": 2025,
        "indicator": "SP.POP.TOTL"
      },
      "laborForce": {
        "value": 2843365,
        "year": 2025,
        "indicator": "SL.TLF.TOTL.IN"
      },
      "lifeExpectancy": {
        "value": 80.246,
        "year": 2024,
        "indicator": "SP.DYN.LE00.IN"
      },
      "literacy": {
        "value": 97.3399963378906,
        "year": 2022,
        "indicator": "SE.ADT.LITR.ZS"
      },
      "fdiUsd": {
        "value": 6747204161.24834,
        "year": 2025,
        "indicator": "BX.KLT.DINV.CD.WD"
      },
      "remittancesUsd": {
        "value": 39011703.5110533,
        "year": 2025,
        "indicator": "BX.TRF.PWKR.CD.DT"
      },
      "tradeBalanceUsd": {
        "value": 13042219713.2414,
        "year": 2025,
        "indicator": "BN.GSR.GNFS.CD"
      },
      "realRate": {
        "value": -5.92398070330169,
        "year": 2021,
        "indicator": "FR.INR.RINR"
      }
    }
  },
  "subdivisionType": "Governorate",
  "subdivisions": [
    {
      "name": "Muscat",
      "capital": "Muscat"
    },
    {
      "name": "Dhofar",
      "capital": "Salalah"
    },
    {
      "name": "Musandam",
      "capital": "Khasab"
    },
    {
      "name": "Al Buraimi",
      "capital": "Al Buraimi"
    },
    {
      "name": "Ad Dakhiliyah",
      "capital": "Nizwa"
    },
    {
      "name": "Al Batinah North",
      "capital": "Sohar"
    },
    {
      "name": "Al Batinah South",
      "capital": "Rustaq"
    },
    {
      "name": "Ash Sharqiyah South",
      "capital": "Sur"
    },
    {
      "name": "Ash Sharqiyah North",
      "capital": "Ibra"
    },
    {
      "name": "Ad Dhahirah",
      "capital": "Ibri"
    },
    {
      "name": "Al Wusta",
      "capital": "Haima"
    }
  ],
  "subdivisionsSource": "Wikipedia: Governorates of Oman",
  "personalitiesPool": [
    {
      "slug": "qaboos-bin-said",
      "name": "Qaboos bin Said",
      "note": "Sultan of Oman (1970–2020)",
      "years": "1940–2020",
      "wikiUrl": "https://en.wikipedia.org/wiki/Qaboos_bin_Said",
      "wikiVerified": true
    },
    {
      "slug": "haitham-bin-tariq",
      "name": "Haitham bin Tariq",
      "note": "Sultan of Oman",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Haitham_bin_Tariq",
      "wikiVerified": true
    },
    {
      "slug": "ali-al-habsi",
      "name": "Ali Al-Habsi",
      "note": "Football goalkeeper",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Ali_Al-Habsi",
      "wikiVerified": true
    },
    {
      "slug": "yusuf-bin-alawi",
      "name": "Yusuf bin Alawi",
      "note": "Long-serving foreign minister",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Yusuf_bin_Alawi",
      "wikiVerified": true
    },
    {
      "slug": "jokha-alharthi",
      "name": "Jokha Alharthi",
      "note": "Novelist; International Booker Prize winner",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Jokha_Alharthi",
      "wikiVerified": true
    },
    {
      "slug": "fatma-al-nabhani",
      "name": "Fatma Al Nabhani",
      "note": "Tennis player",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Fatma_Al_Nabhani",
      "wikiVerified": true
    }
  ],
  "eventsNotes": {
    "nationalHolidays": null,
    "note": "Data-only seed note for the events system: fixed public holidays from the cited source. Movable religious holidays follow official announcements and are NOT packaged as fixed dates.",
    "holidaysStatus": "NOT COVERED by date.nager.at (HTTP 204 at build, 2026-10-22) — the same non-coverage as Pakistan. National holidays are omitted from this package and must be curated from the official gazette / government portal at activation; nothing is estimated."
  },
  "sources": [
    "Wikidata (identity facts, entity verified by description)",
    "World Bank API (population + economy snapshot with years)",
    "Wikipedia list article for subdivisions",
    "Wikipedia (personality entries, existence-verified 2026-10-22)",
    "date.nager.at (national holidays 2026, where covered)",
    "Workspace dataset world_capitals.csv (capital coordinates)"
  ]
} as unknown as CountryPackage & { qid: string; eventsNotes: unknown; resolverNote?: string };
