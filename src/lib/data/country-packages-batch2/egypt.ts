import type { CountryPackage } from './types';

// Egypt — country package, batch 2 (BUILD ONLY, not wired to any page).
// Carries two extra fields beyond CountryPackage (qid, eventsNotes, resolverNote where present) —
// typed via the exported const assertion below.
export const COUNTRY_EGYPT = {
  "slug": "egypt",
  "name": "Egypt",
  "iso2": "EG",
  "iso3": "EGY",
  "isoNote": "Explicit slug→ISO map (Panama law) — never derived from the slug.",
  "qid": "Q79",
  "capital": {
    "name": "Cairo",
    "lat": 30.06263,
    "lng": 31.24967
  },
  "areaKm2": 1010407.87,
  "currency": {
    "code": "EGP",
    "name": "Egyptian pound"
  },
  "languages": [
    "Arabic"
  ],
  "callingCode": "+20",
  "population": {
    "value": 118365995,
    "year": 2025,
    "indicator": "SP.POP.TOTL"
  },
  "economySnapshot": {
    "source": "World Bank API — packaged snapshot pulled 2026-10-22; same 16-indicator set as fetchWorldBankLatest (src/lib/apis/worldbank.ts); live at activation via the one-cached-dataset pattern.",
    "indicators": {
      "gdpUsd": {
        "value": 365254630179.737,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.CD"
      },
      "gdpGrowth": {
        "value": 4.39201068570188,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.KD.ZG"
      },
      "gdpPerCapita": {
        "value": 3085.80712036204,
        "year": 2025,
        "indicator": "NY.GDP.PCAP.CD"
      },
      "inflation": {
        "value": 14.0735136645933,
        "year": 2025,
        "indicator": "FP.CPI.TOTL.ZG"
      },
      "unemployment": {
        "value": 6.781,
        "year": 2025,
        "indicator": "SL.UEM.TOTL.ZS"
      },
      "population": {
        "value": 118365995,
        "year": 2025,
        "indicator": "SP.POP.TOTL"
      },
      "laborForce": {
        "value": 36106369,
        "year": 2025,
        "indicator": "SL.TLF.TOTL.IN"
      },
      "lifeExpectancy": {
        "value": 71.806,
        "year": 2024,
        "indicator": "SP.DYN.LE00.IN"
      },
      "literacy": {
        "value": 79.4531619498685,
        "year": 2022,
        "indicator": "SE.ADT.LITR.ZS"
      },
      "gini": {
        "value": 28.5,
        "year": 2021,
        "indicator": "SI.POV.GINI"
      },
      "poverty": {
        "value": 1.4,
        "year": 2021,
        "indicator": "SI.POV.DDAY"
      },
      "fdiUsd": {
        "value": 15452700000,
        "year": 2025,
        "indicator": "BX.KLT.DINV.CD.WD"
      },
      "remittancesUsd": {
        "value": 41517400000,
        "year": 2025,
        "indicator": "BX.TRF.PWKR.CD.DT"
      },
      "tradeBalanceUsd": {
        "value": -38621700000,
        "year": 2025,
        "indicator": "BN.GSR.GNFS.CD"
      },
      "realRate": {
        "value": -7.03099094109377,
        "year": 2024,
        "indicator": "FR.INR.RINR"
      }
    }
  },
  "subdivisionType": "Governorate",
  "subdivisions": [
    {
      "name": "Cairo",
      "capital": "Cairo"
    },
    {
      "name": "Giza",
      "capital": "Giza"
    },
    {
      "name": "Alexandria",
      "capital": "Alexandria"
    },
    {
      "name": "Dakahlia",
      "capital": "Mansoura"
    },
    {
      "name": "Red Sea",
      "capital": "Hurghada"
    },
    {
      "name": "Beheira",
      "capital": "Damanhur"
    },
    {
      "name": "Faiyum",
      "capital": "Faiyum"
    },
    {
      "name": "Gharbia",
      "capital": "Tanta"
    },
    {
      "name": "Ismailia",
      "capital": "Ismailia"
    },
    {
      "name": "Monufia",
      "capital": "Shibin El Kom"
    },
    {
      "name": "Minya",
      "capital": "Minya"
    },
    {
      "name": "Qalyubia",
      "capital": "Benha"
    },
    {
      "name": "New Valley",
      "capital": "Kharga Oasis"
    },
    {
      "name": "Suez",
      "capital": "Suez"
    },
    {
      "name": "Aswan",
      "capital": "Aswan"
    },
    {
      "name": "Assiut",
      "capital": "Assiut"
    },
    {
      "name": "Beni Suef",
      "capital": "Beni Suef"
    },
    {
      "name": "Port Said",
      "capital": "Port Said"
    },
    {
      "name": "Damietta",
      "capital": "Damietta"
    },
    {
      "name": "Sharkia",
      "capital": "Zagazig"
    },
    {
      "name": "South Sinai",
      "capital": "El Tor"
    },
    {
      "name": "Kafr El Sheikh",
      "capital": "Kafr El Sheikh"
    },
    {
      "name": "Matrouh",
      "capital": "Marsa Matruh"
    },
    {
      "name": "Luxor",
      "capital": "Luxor"
    },
    {
      "name": "Qena",
      "capital": "Qena"
    },
    {
      "name": "North Sinai",
      "capital": "Arish"
    },
    {
      "name": "Sohag",
      "capital": "Sohag"
    }
  ],
  "subdivisionsSource": "Wikipedia: Governorates of Egypt",
  "personalitiesPool": [
    {
      "slug": "naguib-mahfouz",
      "name": "Naguib Mahfouz",
      "note": "Novelist; Nobel Prize in Literature laureate",
      "years": "1911–2006",
      "wikiUrl": "https://en.wikipedia.org/wiki/Naguib_Mahfouz",
      "wikiVerified": true
    },
    {
      "slug": "umm-kulthum",
      "name": "Umm Kulthum",
      "note": "Singer, \"Star of the East\"",
      "years": "1898–1975",
      "wikiUrl": "https://en.wikipedia.org/wiki/Umm_Kulthum",
      "wikiVerified": true
    },
    {
      "slug": "gamal-abdel-nasser",
      "name": "Gamal Abdel Nasser",
      "note": "President of Egypt (1956–1970)",
      "years": "1918–1970",
      "wikiUrl": "https://en.wikipedia.org/wiki/Gamal_Abdel_Nasser",
      "wikiVerified": true
    },
    {
      "slug": "anwar-sadat",
      "name": "Anwar Sadat",
      "note": "President of Egypt (1970–1981); Nobel Peace Prize laureate",
      "years": "1918–1981",
      "wikiUrl": "https://en.wikipedia.org/wiki/Anwar_Sadat",
      "wikiVerified": true
    },
    {
      "slug": "omar-sharif",
      "name": "Omar Sharif",
      "note": "Film actor",
      "years": "1932–2015",
      "wikiUrl": "https://en.wikipedia.org/wiki/Omar_Sharif",
      "wikiVerified": true
    },
    {
      "slug": "mohamed-salah",
      "name": "Mohamed Salah",
      "note": "Footballer",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Mohamed_Salah",
      "wikiVerified": true
    }
  ],
  "eventsNotes": {
    "nationalHolidays": {
      "year": 2026,
      "source": "date.nager.at Public Holidays API (fetched 2026-10-22)",
      "items": [
        {
          "date": "2026-01-07",
          "name": "Christmas Day (Orthodox)"
        },
        {
          "date": "2026-01-29",
          "name": "Revolution Day 2011 / National Police Day"
        },
        {
          "date": "2026-04-13",
          "name": "Easter Monday"
        },
        {
          "date": "2026-04-25",
          "name": "Sinai Liberation Day"
        },
        {
          "date": "2026-05-07",
          "name": "Labour Day"
        },
        {
          "date": "2026-05-27",
          "name": "Eid Al-Adha"
        },
        {
          "date": "2026-05-28",
          "name": "Eid Al-Adha"
        },
        {
          "date": "2026-05-29",
          "name": "Eid Al-Adha"
        },
        {
          "date": "2026-05-30",
          "name": "Eid Al-Adha"
        },
        {
          "date": "2026-05-31",
          "name": "Eid Al-Adha"
        },
        {
          "date": "2026-06-18",
          "name": "Islamic New Year"
        },
        {
          "date": "2026-07-02",
          "name": "June 30 Revolution"
        },
        {
          "date": "2026-07-23",
          "name": "Revolution Day"
        },
        {
          "date": "2026-08-26",
          "name": "Prophet Muhammad's Birthday"
        },
        {
          "date": "2026-10-06",
          "name": "Armed Forces Day"
        }
      ]
    },
    "note": "Data-only seed note for the events system: fixed public holidays from the cited source. Movable religious holidays follow official announcements and are NOT packaged as fixed dates."
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
