import type { CountryPackage } from './types';

// Canada — country package, batch 2 (BUILD ONLY, not wired to any page).
// Carries two extra fields beyond CountryPackage (qid, eventsNotes, resolverNote where present) —
// typed via the exported const assertion below.
export const COUNTRY_CANADA = {
  "slug": "canada",
  "name": "Canada",
  "iso2": "CA",
  "iso3": "CAN",
  "isoNote": "Explicit slug→ISO map (Panama law) — never derived from the slug.",
  "qid": "Q16",
  "capital": {
    "name": "Ottawa",
    "lat": 45.41117,
    "lng": -75.69812
  },
  "areaKm2": 9984670.0,
  "currency": {
    "code": "CAD",
    "name": "Canadian dollar"
  },
  "languages": [
    "English",
    "French"
  ],
  "callingCode": "+1",
  "population": {
    "value": 41651653,
    "year": 2025,
    "indicator": "SP.POP.TOTL"
  },
  "economySnapshot": {
    "source": "World Bank API — packaged snapshot pulled 2026-10-22; same 16-indicator set as fetchWorldBankLatest (src/lib/apis/worldbank.ts); live at activation via the one-cached-dataset pattern.",
    "indicators": {
      "gdpUsd": {
        "value": 2319899772425.92,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.CD"
      },
      "gdpGrowth": {
        "value": 1.74268536175708,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.KD.ZG"
      },
      "gdpPerCapita": {
        "value": 55697.6639660837,
        "year": 2025,
        "indicator": "NY.GDP.PCAP.CD"
      },
      "inflation": {
        "value": 2.07232411149103,
        "year": 2025,
        "indicator": "FP.CPI.TOTL.ZG"
      },
      "unemployment": {
        "value": 6.907,
        "year": 2025,
        "indicator": "SL.UEM.TOTL.ZS"
      },
      "population": {
        "value": 41651653,
        "year": 2025,
        "indicator": "SP.POP.TOTL"
      },
      "laborForce": {
        "value": 22846475,
        "year": 2025,
        "indicator": "SL.TLF.TOTL.IN"
      },
      "lifeExpectancy": {
        "value": 82.1080487804878,
        "year": 2024,
        "indicator": "SP.DYN.LE00.IN"
      },
      "gini": {
        "value": 31.5,
        "year": 2022,
        "indicator": "SI.POV.GINI"
      },
      "poverty": {
        "value": 0.3,
        "year": 2022,
        "indicator": "SI.POV.DDAY"
      },
      "fdiUsd": {
        "value": 70134322393.9651,
        "year": 2025,
        "indicator": "BX.KLT.DINV.CD.WD"
      },
      "remittancesUsd": {
        "value": 834011822.892797,
        "year": 2025,
        "indicator": "BX.TRF.PWKR.CD.DT"
      },
      "tradeBalanceUsd": {
        "value": -21097150925.5153,
        "year": 2025,
        "indicator": "BN.GSR.GNFS.CD"
      },
      "realRate": {
        "value": 0.125617247961227,
        "year": 2017,
        "indicator": "FR.INR.RINR"
      },
      "debtPctGdp": {
        "value": 64.1314232901439,
        "year": 2024,
        "indicator": "GC.DOD.TOTL.GD.ZS"
      }
    }
  },
  "subdivisionType": "Province / Territory",
  "subdivisions": [
    {
      "name": "Ontario",
      "capital": "Toronto"
    },
    {
      "name": "Quebec",
      "capital": "Quebec City"
    },
    {
      "name": "British Columbia",
      "capital": "Victoria"
    },
    {
      "name": "Alberta",
      "capital": "Edmonton"
    },
    {
      "name": "Manitoba",
      "capital": "Winnipeg"
    },
    {
      "name": "Saskatchewan",
      "capital": "Regina"
    },
    {
      "name": "Nova Scotia",
      "capital": "Halifax"
    },
    {
      "name": "New Brunswick",
      "capital": "Fredericton"
    },
    {
      "name": "Newfoundland and Labrador",
      "capital": "St. John's"
    },
    {
      "name": "Prince Edward Island",
      "capital": "Charlottetown"
    },
    {
      "name": "Northwest Territories",
      "capital": "Yellowknife"
    },
    {
      "name": "Yukon",
      "capital": "Whitehorse"
    },
    {
      "name": "Nunavut",
      "capital": "Iqaluit"
    }
  ],
  "subdivisionsSource": "Wikipedia: Provinces and territories of Canada",
  "personalitiesPool": [
    {
      "slug": "pierre-trudeau",
      "name": "Pierre Trudeau",
      "note": "Prime Minister of Canada (1968–79; 1980–84)",
      "years": "1919–2000",
      "wikiUrl": "https://en.wikipedia.org/wiki/Pierre_Trudeau",
      "wikiVerified": true
    },
    {
      "slug": "terry-fox",
      "name": "Terry Fox",
      "note": "Cancer research fundraiser; Marathon of Hope",
      "years": "1958–1981",
      "wikiUrl": "https://en.wikipedia.org/wiki/Terry_Fox",
      "wikiVerified": true
    },
    {
      "slug": "wayne-gretzky",
      "name": "Wayne Gretzky",
      "note": "Ice hockey player",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Wayne_Gretzky",
      "wikiVerified": true
    },
    {
      "slug": "leonard-cohen",
      "name": "Leonard Cohen",
      "note": "Singer-songwriter and poet",
      "years": "1934–2016",
      "wikiUrl": "https://en.wikipedia.org/wiki/Leonard_Cohen",
      "wikiVerified": true
    },
    {
      "slug": "margaret-atwood",
      "name": "Margaret Atwood",
      "note": "Author",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Margaret_Atwood",
      "wikiVerified": true
    },
    {
      "slug": "celine-dion",
      "name": "Celine Dion",
      "note": "Singer",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Celine_Dion",
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
          "date": "2026-02-16",
          "name": "Louis Riel Day"
        },
        {
          "date": "2026-02-16",
          "name": "Islander Day"
        },
        {
          "date": "2026-02-16",
          "name": "Heritage Day"
        },
        {
          "date": "2026-02-16",
          "name": "Family Day"
        },
        {
          "date": "2026-03-17",
          "name": "Saint Patrick's Day"
        },
        {
          "date": "2026-04-03",
          "name": "Good Friday"
        },
        {
          "date": "2026-04-06",
          "name": "Easter Monday"
        },
        {
          "date": "2026-04-23",
          "name": "Saint George's Day"
        },
        {
          "date": "2026-05-18",
          "name": "National Patriots' Day"
        },
        {
          "date": "2026-05-18",
          "name": "Victoria Day"
        },
        {
          "date": "2026-06-21",
          "name": "National Aboriginal Day"
        },
        {
          "date": "2026-06-24",
          "name": "Discovery Day"
        },
        {
          "date": "2026-06-24",
          "name": "National Holiday"
        },
        {
          "date": "2026-07-01",
          "name": "Canada Day"
        },
        {
          "date": "2026-07-12",
          "name": "Orangemen's Day"
        },
        {
          "date": "2026-08-03",
          "name": "Civic Holiday"
        },
        {
          "date": "2026-08-03",
          "name": "British Columbia Day"
        },
        {
          "date": "2026-08-03",
          "name": "Heritage Day"
        },
        {
          "date": "2026-08-03",
          "name": "New Brunswick Day"
        },
        {
          "date": "2026-08-03",
          "name": "Natal Day"
        },
        {
          "date": "2026-08-03",
          "name": "Saskatchewan Day"
        },
        {
          "date": "2026-08-17",
          "name": "Gold Cup Parade Day"
        },
        {
          "date": "2026-08-17",
          "name": "Discovery Day"
        },
        {
          "date": "2026-09-07",
          "name": "Labour Day"
        },
        {
          "date": "2026-09-30",
          "name": "National Day for Truth and Reconciliation"
        },
        {
          "date": "2026-10-12",
          "name": "Thanksgiving"
        },
        {
          "date": "2026-11-11",
          "name": "Armistice Day"
        },
        {
          "date": "2026-11-11",
          "name": "Remembrance Day"
        },
        {
          "date": "2026-12-25",
          "name": "Christmas Day"
        },
        {
          "date": "2026-12-26",
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
