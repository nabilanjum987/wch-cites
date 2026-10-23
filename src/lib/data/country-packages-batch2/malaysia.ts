import type { CountryPackage } from './types';

// Malaysia — country package, batch 2 (BUILD ONLY, not wired to any page).
// Carries two extra fields beyond CountryPackage (qid, eventsNotes, resolverNote where present) —
// typed via the exported const assertion below.
export const COUNTRY_MALAYSIA = {
  "slug": "malaysia",
  "name": "Malaysia",
  "iso2": "MY",
  "iso3": "MYS",
  "isoNote": "Explicit slug→ISO map (Panama law) — never derived from the slug.",
  "qid": "Q833",
  "capital": {
    "name": "Kuala Lumpur",
    "lat": 3.1412,
    "lng": 101.68653
  },
  "areaKm2": 330803.0,
  "currency": {
    "code": "MYR",
    "name": "Malaysian ringgit"
  },
  "languages": [
    "Malay"
  ],
  "callingCode": "+60",
  "population": {
    "value": 35977838,
    "year": 2025,
    "indicator": "SP.POP.TOTL"
  },
  "economySnapshot": {
    "source": "World Bank API — packaged snapshot pulled 2026-10-22; same 16-indicator set as fetchWorldBankLatest (src/lib/apis/worldbank.ts); live at activation via the one-cached-dataset pattern.",
    "indicators": {
      "gdpUsd": {
        "value": 472193128644.597,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.CD"
      },
      "gdpGrowth": {
        "value": 5.17127082911057,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.KD.ZG"
      },
      "gdpPerCapita": {
        "value": 13124.5554178269,
        "year": 2025,
        "indicator": "NY.GDP.PCAP.CD"
      },
      "inflation": {
        "value": 1.38060872293691,
        "year": 2025,
        "indicator": "FP.CPI.TOTL.ZG"
      },
      "unemployment": {
        "value": 3.764,
        "year": 2025,
        "indicator": "SL.UEM.TOTL.ZS"
      },
      "population": {
        "value": 35977838,
        "year": 2025,
        "indicator": "SP.POP.TOTL"
      },
      "laborForce": {
        "value": 18719406,
        "year": 2025,
        "indicator": "SL.TLF.TOTL.IN"
      },
      "lifeExpectancy": {
        "value": 76.821,
        "year": 2024,
        "indicator": "SP.DYN.LE00.IN"
      },
      "literacy": {
        "value": 95.7699966430664,
        "year": 2022,
        "indicator": "SE.ADT.LITR.ZS"
      },
      "gini": {
        "value": 40.7,
        "year": 2021,
        "indicator": "SI.POV.GINI"
      },
      "poverty": {
        "value": 0,
        "year": 2021,
        "indicator": "SI.POV.DDAY"
      },
      "fdiUsd": {
        "value": 21618816971.2995,
        "year": 2025,
        "indicator": "BX.KLT.DINV.CD.WD"
      },
      "remittancesUsd": {
        "value": 8935072704.65926,
        "year": 2025,
        "indicator": "BX.TRF.PWKR.CD.DT"
      },
      "tradeBalanceUsd": {
        "value": 25882673676.5697,
        "year": 2025,
        "indicator": "BN.GSR.GNFS.CD"
      },
      "realRate": {
        "value": 5.29831080530282,
        "year": 2025,
        "indicator": "FR.INR.RINR"
      },
      "debtPctGdp": {
        "value": 64.566529006102,
        "year": 2024,
        "indicator": "GC.DOD.TOTL.GD.ZS"
      }
    }
  },
  "subdivisionType": "State / Federal territory",
  "subdivisions": [
    {
      "name": "Johor",
      "capital": "Johor Bahru"
    },
    {
      "name": "Kedah",
      "capital": "Alor Setar"
    },
    {
      "name": "Kelantan",
      "capital": "Kota Bharu"
    },
    {
      "name": "Malacca",
      "capital": "Malacca City"
    },
    {
      "name": "Negeri Sembilan",
      "capital": "Seremban"
    },
    {
      "name": "Pahang",
      "capital": "Kuantan"
    },
    {
      "name": "Penang",
      "capital": "George Town"
    },
    {
      "name": "Perak",
      "capital": "Ipoh"
    },
    {
      "name": "Perlis",
      "capital": "Kangar"
    },
    {
      "name": "Sabah",
      "capital": "Kota Kinabalu"
    },
    {
      "name": "Sarawak",
      "capital": "Kuching"
    },
    {
      "name": "Selangor",
      "capital": "Shah Alam"
    },
    {
      "name": "Terengganu",
      "capital": "Kuala Terengganu"
    },
    {
      "name": "Kuala Lumpur (FT)",
      "capital": "Kuala Lumpur"
    },
    {
      "name": "Putrajaya (FT)",
      "capital": "Putrajaya"
    },
    {
      "name": "Labuan (FT)",
      "capital": "Victoria"
    }
  ],
  "subdivisionsSource": "Wikipedia: States and federal territories of Malaysia",
  "personalitiesPool": [
    {
      "slug": "tunku-abdul-rahman",
      "name": "Tunku Abdul Rahman",
      "note": "First Prime Minister of Malaysia",
      "years": "1903–1990",
      "wikiUrl": "https://en.wikipedia.org/wiki/Tunku_Abdul_Rahman",
      "wikiVerified": true
    },
    {
      "slug": "mahathir-mohamad",
      "name": "Mahathir Mohamad",
      "note": "Prime Minister (1981–2003; 2018–2020)",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Mahathir_Mohamad",
      "wikiVerified": true
    },
    {
      "slug": "anwar-ibrahim",
      "name": "Anwar Ibrahim",
      "note": "Prime Minister of Malaysia",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Anwar_Ibrahim",
      "wikiVerified": true
    },
    {
      "slug": "p-ramlee",
      "name": "P. Ramlee",
      "note": "Actor, director and musician",
      "years": "1929–1973",
      "wikiUrl": "https://en.wikipedia.org/wiki/P._Ramlee",
      "wikiVerified": true
    },
    {
      "slug": "michelle-yeoh",
      "name": "Michelle Yeoh",
      "note": "Actress; Academy Award winner",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Michelle_Yeoh",
      "wikiVerified": true
    },
    {
      "slug": "lee-chong-wei",
      "name": "Lee Chong Wei",
      "note": "Badminton player; world number one",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Lee_Chong_Wei",
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
