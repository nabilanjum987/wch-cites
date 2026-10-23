import type { CountryPackage } from './types';

// India — country package (BUILD ONLY, not wired to any page).
// Facts: Wikidata identity + World Bank economy snapshot (2026-10-22) + Wikipedia-verified lists.
export const COUNTRY_INDIA: CountryPackage = {
  "slug": "india",
  "name": "India",
  "iso2": "IN",
  "iso3": "IND",
  "isoNote": "Explicit slug→ISO map (Panama law) — never derived from the slug.",
  "capital": {
    "name": "New Delhi",
    "lat": 28.62,
    "lng": 77.21
  },
  "areaKm2": 3287263.0,
  "currency": {
    "code": "INR",
    "name": "Indian rupee"
  },
  "languages": [
    "Hindi",
    "English"
  ],
  "callingCode": "+91",
  "population": {
    "value": 1463865525,
    "year": 2025,
    "indicator": "SP.POP.TOTL"
  },
  "economySnapshot": {
    "source": "World Bank API (api.worldbank.org) — packaged snapshot pulled 2026-10-22; at activation the country page reads the SAME indicator set live via fetchWorldBankLatest(iso3) / getCountryEconomy (one-cached-dataset pattern). Missing keys = the World Bank publishes no recent value; consumers hide them.",
    "indicators": {
      "gdpUsd": {
        "value": 3956067115771.63,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.CD"
      },
      "gdpGrowth": {
        "value": 7.57,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.KD.ZG"
      },
      "gdpPerCapita": {
        "value": 2702.48,
        "year": 2025,
        "indicator": "NY.GDP.PCAP.CD"
      },
      "inflation": {
        "value": 2.4,
        "year": 2025,
        "indicator": "FP.CPI.TOTL.ZG"
      },
      "unemployment": {
        "value": 4.22,
        "year": 2025,
        "indicator": "SL.UEM.TOTL.ZS"
      },
      "population": {
        "value": 1463865525,
        "year": 2025,
        "indicator": "SP.POP.TOTL"
      },
      "laborForce": {
        "value": 617625336,
        "year": 2025,
        "indicator": "SL.TLF.TOTL.IN"
      },
      "lifeExpectancy": {
        "value": 72.23,
        "year": 2024,
        "indicator": "SP.DYN.LE00.IN"
      },
      "literacy": {
        "value": 78.16,
        "year": 2024,
        "indicator": "SE.ADT.LITR.ZS"
      },
      "gini": {
        "value": 23,
        "year": 2023,
        "indicator": "SI.POV.GINI"
      },
      "poverty": {
        "value": 2.6,
        "year": 2023,
        "indicator": "SI.POV.DDAY"
      },
      "fdiUsd": {
        "value": 40791693366.98,
        "year": 2025,
        "indicator": "BX.KLT.DINV.CD.WD"
      },
      "remittancesUsd": {
        "value": 150711596171.49,
        "year": 2025,
        "indicator": "BX.TRF.PWKR.CD.DT"
      },
      "tradeBalanceUsd": {
        "value": -103600961848.95,
        "year": 2025,
        "indicator": "BN.GSR.GNFS.CD"
      },
      "realRate": {
        "value": 5.56,
        "year": 2022,
        "indicator": "FR.INR.RINR"
      },
      "debtPctGdp": {
        "value": 46.52,
        "year": 2018,
        "indicator": "GC.DOD.TOTL.GD.ZS"
      }
    }
  },
  "subdivisionType": "State / Union territory",
  "subdivisions": [
    {
      "name": "Andhra Pradesh",
      "capital": "Amaravati"
    },
    {
      "name": "Arunachal Pradesh",
      "capital": "Itanagar"
    },
    {
      "name": "Assam",
      "capital": "Dispur"
    },
    {
      "name": "Bihar",
      "capital": "Patna"
    },
    {
      "name": "Chhattisgarh",
      "capital": "Raipur"
    },
    {
      "name": "Goa",
      "capital": "Panaji"
    },
    {
      "name": "Gujarat",
      "capital": "Gandhinagar"
    },
    {
      "name": "Haryana",
      "capital": "Chandigarh"
    },
    {
      "name": "Himachal Pradesh",
      "capital": "Shimla"
    },
    {
      "name": "Jharkhand",
      "capital": "Ranchi"
    },
    {
      "name": "Karnataka",
      "capital": "Bengaluru"
    },
    {
      "name": "Kerala",
      "capital": "Thiruvananthapuram"
    },
    {
      "name": "Madhya Pradesh",
      "capital": "Bhopal"
    },
    {
      "name": "Maharashtra",
      "capital": "Mumbai"
    },
    {
      "name": "Manipur",
      "capital": "Imphal"
    },
    {
      "name": "Meghalaya",
      "capital": "Shillong"
    },
    {
      "name": "Mizoram",
      "capital": "Aizawl"
    },
    {
      "name": "Nagaland",
      "capital": "Kohima"
    },
    {
      "name": "Odisha",
      "capital": "Bhubaneswar"
    },
    {
      "name": "Punjab",
      "capital": "Chandigarh"
    },
    {
      "name": "Rajasthan",
      "capital": "Jaipur"
    },
    {
      "name": "Sikkim",
      "capital": "Gangtok"
    },
    {
      "name": "Tamil Nadu",
      "capital": "Chennai"
    },
    {
      "name": "Telangana",
      "capital": "Hyderabad"
    },
    {
      "name": "Tripura",
      "capital": "Agartala"
    },
    {
      "name": "Uttar Pradesh",
      "capital": "Lucknow"
    },
    {
      "name": "Uttarakhand",
      "capital": "Dehradun"
    },
    {
      "name": "West Bengal",
      "capital": "Kolkata"
    },
    {
      "name": "Andaman and Nicobar Islands",
      "capital": "Port Blair"
    },
    {
      "name": "Chandigarh",
      "capital": "Chandigarh"
    },
    {
      "name": "Dadra and Nagar Haveli and Daman and Diu",
      "capital": "Daman"
    },
    {
      "name": "Delhi",
      "capital": "New Delhi"
    },
    {
      "name": "Jammu and Kashmir",
      "capital": "Srinagar (summer) / Jammu (winter)"
    },
    {
      "name": "Ladakh",
      "capital": "Leh"
    },
    {
      "name": "Lakshadweep",
      "capital": "Kavaratti"
    },
    {
      "name": "Puducherry",
      "capital": "Puducherry"
    }
  ],
  "subdivisionsSource": "Wikipedia: States and union territories of India",
  "personalitiesPool": [
    {
      "slug": "mahatma-gandhi",
      "name": "Mahatma Gandhi",
      "note": "Leader of the Indian independence movement",
      "years": "1869–1948",
      "wikiUrl": "https://en.wikipedia.org/wiki/Mahatma_Gandhi",
      "wikiVerified": true
    },
    {
      "slug": "jawaharlal-nehru",
      "name": "Jawaharlal Nehru",
      "note": "First Prime Minister of India",
      "years": "1889–1964",
      "wikiUrl": "https://en.wikipedia.org/wiki/Jawaharlal_Nehru",
      "wikiVerified": true
    },
    {
      "slug": "a-p-j-abdul-kalam",
      "name": "A. P. J. Abdul Kalam",
      "note": "Aerospace scientist; 11th President of India",
      "years": "1931–2015",
      "wikiUrl": "https://en.wikipedia.org/wiki/A._P._J._Abdul_Kalam",
      "wikiVerified": true
    },
    {
      "slug": "sachin-tendulkar",
      "name": "Sachin Tendulkar",
      "note": "Cricketer",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Sachin_Tendulkar",
      "wikiVerified": true
    },
    {
      "slug": "lata-mangeshkar",
      "name": "Lata Mangeshkar",
      "note": "Playback singer",
      "years": "1929–2022",
      "wikiUrl": "https://en.wikipedia.org/wiki/Lata_Mangeshkar",
      "wikiVerified": true
    },
    {
      "slug": "shah-rukh-khan",
      "name": "Shah Rukh Khan",
      "note": "Film actor",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Shah_Rukh_Khan",
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
