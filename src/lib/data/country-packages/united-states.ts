import type { CountryPackage } from './types';

// United States — country package (BUILD ONLY, not wired to any page).
// Facts: Wikidata identity + World Bank economy snapshot (2026-10-22) + Wikipedia-verified lists.
export const COUNTRY_UNITED_STATES: CountryPackage = {
  "slug": "united-states",
  "name": "United States",
  "iso2": "US",
  "iso3": "USA",
  "isoNote": "Explicit slug→ISO map (Panama law) — never derived from the slug.",
  "capital": {
    "name": "Washington, D.C.",
    "lat": 38.9,
    "lng": -77.04
  },
  "areaKm2": 9826675.0,
  "currency": {
    "code": "USD",
    "name": "United States dollar"
  },
  "languages": [
    "English",
    "Hawaiian",
    "Spanish",
    "Samoan",
    "Chamorro",
    "Carolinian"
  ],
  "callingCode": "+1",
  "population": {
    "value": 341784857,
    "year": 2025,
    "indicator": "SP.POP.TOTL"
  },
  "economySnapshot": {
    "source": "World Bank API (api.worldbank.org) — packaged snapshot pulled 2026-10-22; at activation the country page reads the SAME indicator set live via fetchWorldBankLatest(iso3) / getCountryEconomy (one-cached-dataset pattern). Missing keys = the World Bank publishes no recent value; consumers hide them.",
    "indicators": {
      "gdpUsd": {
        "value": 30769700000000,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.CD"
      },
      "gdpGrowth": {
        "value": 2.16,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.KD.ZG"
      },
      "gdpPerCapita": {
        "value": 90026.52,
        "year": 2025,
        "indicator": "NY.GDP.PCAP.CD"
      },
      "inflation": {
        "value": 2.95,
        "year": 2024,
        "indicator": "FP.CPI.TOTL.ZG"
      },
      "unemployment": {
        "value": 4.2,
        "year": 2025,
        "indicator": "SL.UEM.TOTL.ZS"
      },
      "population": {
        "value": 341784857,
        "year": 2025,
        "indicator": "SP.POP.TOTL"
      },
      "laborForce": {
        "value": 174833917,
        "year": 2025,
        "indicator": "SL.TLF.TOTL.IN"
      },
      "lifeExpectancy": {
        "value": 78.89,
        "year": 2024,
        "indicator": "SP.DYN.LE00.IN"
      },
      "gini": {
        "value": 41.8,
        "year": 2024,
        "indicator": "SI.POV.GINI"
      },
      "poverty": {
        "value": 1.1,
        "year": 2024,
        "indicator": "SI.POV.DDAY"
      },
      "fdiUsd": {
        "value": 307018000000,
        "year": 2025,
        "indicator": "BX.KLT.DINV.CD.WD"
      },
      "remittancesUsd": {
        "value": 9345000000,
        "year": 2025,
        "indicator": "BX.TRF.PWKR.CD.DT"
      },
      "tradeBalanceUsd": {
        "value": -931962000000,
        "year": 2025,
        "indicator": "BN.GSR.GNFS.CD"
      },
      "realRate": {
        "value": -1.26,
        "year": 2021,
        "indicator": "FR.INR.RINR"
      },
      "debtPctGdp": {
        "value": 115.79,
        "year": 2024,
        "indicator": "GC.DOD.TOTL.GD.ZS"
      }
    }
  },
  "subdivisionType": "State",
  "subdivisions": [
    {
      "name": "Alabama",
      "capital": "Montgomery"
    },
    {
      "name": "Alaska",
      "capital": "Juneau"
    },
    {
      "name": "Arizona",
      "capital": "Phoenix"
    },
    {
      "name": "Arkansas",
      "capital": "Little Rock"
    },
    {
      "name": "California",
      "capital": "Sacramento"
    },
    {
      "name": "Colorado",
      "capital": "Denver"
    },
    {
      "name": "Connecticut",
      "capital": "Hartford"
    },
    {
      "name": "Delaware",
      "capital": "Dover"
    },
    {
      "name": "Florida",
      "capital": "Tallahassee"
    },
    {
      "name": "Georgia",
      "capital": "Atlanta"
    },
    {
      "name": "Hawaii",
      "capital": "Honolulu"
    },
    {
      "name": "Idaho",
      "capital": "Boise"
    },
    {
      "name": "Illinois",
      "capital": "Springfield"
    },
    {
      "name": "Indiana",
      "capital": "Indianapolis"
    },
    {
      "name": "Iowa",
      "capital": "Des Moines"
    },
    {
      "name": "Kansas",
      "capital": "Topeka"
    },
    {
      "name": "Kentucky",
      "capital": "Frankfort"
    },
    {
      "name": "Louisiana",
      "capital": "Baton Rouge"
    },
    {
      "name": "Maine",
      "capital": "Augusta"
    },
    {
      "name": "Maryland",
      "capital": "Annapolis"
    },
    {
      "name": "Massachusetts",
      "capital": "Boston"
    },
    {
      "name": "Michigan",
      "capital": "Lansing"
    },
    {
      "name": "Minnesota",
      "capital": "Saint Paul"
    },
    {
      "name": "Mississippi",
      "capital": "Jackson"
    },
    {
      "name": "Missouri",
      "capital": "Jefferson City"
    },
    {
      "name": "Montana",
      "capital": "Helena"
    },
    {
      "name": "Nebraska",
      "capital": "Lincoln"
    },
    {
      "name": "Nevada",
      "capital": "Carson City"
    },
    {
      "name": "New Hampshire",
      "capital": "Concord"
    },
    {
      "name": "New Jersey",
      "capital": "Trenton"
    },
    {
      "name": "New Mexico",
      "capital": "Santa Fe"
    },
    {
      "name": "New York",
      "capital": "Albany"
    },
    {
      "name": "North Carolina",
      "capital": "Raleigh"
    },
    {
      "name": "North Dakota",
      "capital": "Bismarck"
    },
    {
      "name": "Ohio",
      "capital": "Columbus"
    },
    {
      "name": "Oklahoma",
      "capital": "Oklahoma City"
    },
    {
      "name": "Oregon",
      "capital": "Salem"
    },
    {
      "name": "Pennsylvania",
      "capital": "Harrisburg"
    },
    {
      "name": "Rhode Island",
      "capital": "Providence"
    },
    {
      "name": "South Carolina",
      "capital": "Columbia"
    },
    {
      "name": "South Dakota",
      "capital": "Pierre"
    },
    {
      "name": "Tennessee",
      "capital": "Nashville"
    },
    {
      "name": "Texas",
      "capital": "Austin"
    },
    {
      "name": "Utah",
      "capital": "Salt Lake City"
    },
    {
      "name": "Vermont",
      "capital": "Montpelier"
    },
    {
      "name": "Virginia",
      "capital": "Richmond"
    },
    {
      "name": "Washington",
      "capital": "Olympia"
    },
    {
      "name": "West Virginia",
      "capital": "Charleston"
    },
    {
      "name": "Wisconsin",
      "capital": "Madison"
    },
    {
      "name": "Wyoming",
      "capital": "Cheyenne"
    },
    {
      "name": "District of Columbia",
      "capital": "Washington"
    }
  ],
  "subdivisionsSource": "Wikipedia: List of states and territories of the United States",
  "personalitiesPool": [
    {
      "slug": "george-washington",
      "name": "George Washington",
      "note": "First President of the United States",
      "years": "1732–1799",
      "wikiUrl": "https://en.wikipedia.org/wiki/George_Washington",
      "wikiVerified": true
    },
    {
      "slug": "abraham-lincoln",
      "name": "Abraham Lincoln",
      "note": "16th President; led the Union through the Civil War",
      "years": "1809–1865",
      "wikiUrl": "https://en.wikipedia.org/wiki/Abraham_Lincoln",
      "wikiVerified": true
    },
    {
      "slug": "martin-luther-king-jr",
      "name": "Martin Luther King Jr.",
      "note": "Civil rights leader",
      "years": "1929–1968",
      "wikiUrl": "https://en.wikipedia.org/wiki/Martin_Luther_King_Jr.",
      "wikiVerified": true
    },
    {
      "slug": "neil-armstrong",
      "name": "Neil Armstrong",
      "note": "First person to walk on the Moon",
      "years": "1930–2012",
      "wikiUrl": "https://en.wikipedia.org/wiki/Neil_Armstrong",
      "wikiVerified": true
    },
    {
      "slug": "oprah-winfrey",
      "name": "Oprah Winfrey",
      "note": "Television host and media executive",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Oprah_Winfrey",
      "wikiVerified": true
    },
    {
      "slug": "barack-obama",
      "name": "Barack Obama",
      "note": "44th President of the United States",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Barack_Obama",
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
