import type { CountryPackage } from './types';

// Australia — country package, batch 2 (BUILD ONLY, not wired to any page).
// Carries two extra fields beyond CountryPackage (qid, eventsNotes, resolverNote where present) —
// typed via the exported const assertion below.
export const COUNTRY_AUSTRALIA = {
  "slug": "australia",
  "name": "Australia",
  "iso2": "AU",
  "iso3": "AUS",
  "isoNote": "Explicit slug→ISO map (Panama law) — never derived from the slug.",
  "qid": "Q408",
  "capital": {
    "name": "Canberra",
    "lat": -35.28346,
    "lng": 149.12807
  },
  "areaKm2": 7692024.0,
  "currency": {
    "code": "AUD",
    "name": "Australian dollar"
  },
  "languages": [
    "Australian English",
    "Auslan",
    "English"
  ],
  "callingCode": "+61",
  "population": {
    "value": 27614411,
    "year": 2025,
    "indicator": "SP.POP.TOTL"
  },
  "economySnapshot": {
    "source": "World Bank API — packaged snapshot pulled 2026-10-22; same 16-indicator set as fetchWorldBankLatest (src/lib/apis/worldbank.ts); live at activation via the one-cached-dataset pattern.",
    "indicators": {
      "gdpUsd": {
        "value": 1798518933689.21,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.CD"
      },
      "gdpGrowth": {
        "value": 1.35039785076631,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.KD.ZG"
      },
      "gdpPerCapita": {
        "value": 65129.7227990563,
        "year": 2025,
        "indicator": "NY.GDP.PCAP.CD"
      },
      "inflation": {
        "value": 2.87403791660173,
        "year": 2025,
        "indicator": "FP.CPI.TOTL.ZG"
      },
      "unemployment": {
        "value": 4.09,
        "year": 2025,
        "indicator": "SL.UEM.TOTL.ZS"
      },
      "population": {
        "value": 27614411,
        "year": 2025,
        "indicator": "SP.POP.TOTL"
      },
      "laborForce": {
        "value": 15125385,
        "year": 2025,
        "indicator": "SL.TLF.TOTL.IN"
      },
      "lifeExpectancy": {
        "value": 83.0512195121951,
        "year": 2024,
        "indicator": "SP.DYN.LE00.IN"
      },
      "gini": {
        "value": 33.8,
        "year": 2020,
        "indicator": "SI.POV.GINI"
      },
      "poverty": {
        "value": 0.9,
        "year": 2020,
        "indicator": "SI.POV.DDAY"
      },
      "fdiUsd": {
        "value": 37438451002.7093,
        "year": 2025,
        "indicator": "BX.KLT.DINV.CD.WD"
      },
      "remittancesUsd": {
        "value": 2008646267.24894,
        "year": 2025,
        "indicator": "BX.TRF.PWKR.CD.DT"
      },
      "tradeBalanceUsd": {
        "value": 4584442592.4521,
        "year": 2025,
        "indicator": "BN.GSR.GNFS.CD"
      },
      "realRate": {
        "value": 1.56982320729507,
        "year": 2019,
        "indicator": "FR.INR.RINR"
      },
      "debtPctGdp": {
        "value": 57.8834285733848,
        "year": 2022,
        "indicator": "GC.DOD.TOTL.GD.ZS"
      }
    }
  },
  "subdivisionType": "State / Territory",
  "subdivisions": [
    {
      "name": "New South Wales",
      "capital": "Sydney"
    },
    {
      "name": "Victoria",
      "capital": "Melbourne"
    },
    {
      "name": "Queensland",
      "capital": "Brisbane"
    },
    {
      "name": "Western Australia",
      "capital": "Perth"
    },
    {
      "name": "South Australia",
      "capital": "Adelaide"
    },
    {
      "name": "Tasmania",
      "capital": "Hobart"
    },
    {
      "name": "Australian Capital Territory",
      "capital": "Canberra"
    },
    {
      "name": "Northern Territory",
      "capital": "Darwin"
    }
  ],
  "subdivisionsSource": "Wikipedia: States and territories of Australia",
  "personalitiesPool": [
    {
      "slug": "don-bradman",
      "name": "Don Bradman",
      "note": "Cricketer",
      "years": "1908–2001",
      "wikiUrl": "https://en.wikipedia.org/wiki/Don_Bradman",
      "wikiVerified": true
    },
    {
      "slug": "howard-florey",
      "name": "Howard Florey",
      "note": "Pharmacologist; Nobel laureate for penicillin",
      "years": "1898–1968",
      "wikiUrl": "https://en.wikipedia.org/wiki/Howard_Florey",
      "wikiVerified": true
    },
    {
      "slug": "steve-irwin",
      "name": "Steve Irwin",
      "note": "Wildlife conservationist and broadcaster",
      "years": "1962–2006",
      "wikiUrl": "https://en.wikipedia.org/wiki/Steve_Irwin",
      "wikiVerified": true
    },
    {
      "slug": "cathy-freeman",
      "name": "Cathy Freeman",
      "note": "Sprinter; Olympic champion",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Cathy_Freeman",
      "wikiVerified": true
    },
    {
      "slug": "hugh-jackman",
      "name": "Hugh Jackman",
      "note": "Actor",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Hugh_Jackman",
      "wikiVerified": true
    },
    {
      "slug": "nicole-kidman",
      "name": "Nicole Kidman",
      "note": "Actress",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Nicole_Kidman",
      "wikiVerified": true
    }
  ],
  "eventsNotes": {
    "nationalHolidays": {
      "year": 2026,
      "source": "date.nager.at Public Holidays API (fetched 2026-10-22)",
      "items": [
        {
          "date": "2026-01-01",
          "name": "New Year's Day"
        },
        {
          "date": "2026-01-26",
          "name": "Australia Day"
        },
        {
          "date": "2026-03-02",
          "name": "Labour Day"
        },
        {
          "date": "2026-03-09",
          "name": "Canberra Day"
        },
        {
          "date": "2026-03-09",
          "name": "Adelaide Cup Day"
        },
        {
          "date": "2026-03-09",
          "name": "Eight Hours Day"
        },
        {
          "date": "2026-03-09",
          "name": "Labour Day"
        },
        {
          "date": "2026-04-03",
          "name": "Good Friday"
        },
        {
          "date": "2026-04-04",
          "name": "Holy Saturday"
        },
        {
          "date": "2026-04-05",
          "name": "Easter Sunday"
        },
        {
          "date": "2026-04-06",
          "name": "Easter Monday"
        },
        {
          "date": "2026-04-25",
          "name": "Anzac Day"
        },
        {
          "date": "2026-04-27",
          "name": "Anzac Day"
        },
        {
          "date": "2026-04-25",
          "name": "Anzac Day"
        },
        {
          "date": "2026-05-04",
          "name": "May Day"
        },
        {
          "date": "2026-05-04",
          "name": "Labour Day"
        },
        {
          "date": "2026-06-01",
          "name": "Reconciliation Day"
        },
        {
          "date": "2026-06-01",
          "name": "Western Australia Day"
        },
        {
          "date": "2026-06-08",
          "name": "King's Birthday"
        },
        {
          "date": "2026-08-03",
          "name": "Picnic Day"
        },
        {
          "date": "2026-09-25",
          "name": "Friday before AFL Grand Final"
        },
        {
          "date": "2026-09-28",
          "name": "King's Birthday"
        },
        {
          "date": "2026-10-05",
          "name": "Labour Day"
        },
        {
          "date": "2026-10-05",
          "name": "King's Birthday"
        },
        {
          "date": "2026-11-03",
          "name": "Melbourne Cup"
        },
        {
          "date": "2026-12-25",
          "name": "Christmas Day"
        },
        {
          "date": "2026-12-28",
          "name": "St. Stephen's Day"
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
