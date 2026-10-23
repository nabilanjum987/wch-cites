import type { CountryPackage } from './types';

// Kuwait — country package, batch 2 (BUILD ONLY, not wired to any page).
// Carries two extra fields beyond CountryPackage (qid, eventsNotes, resolverNote where present) —
// typed via the exported const assertion below.
export const COUNTRY_KUWAIT = {
  "slug": "kuwait",
  "name": "Kuwait",
  "iso2": "KW",
  "iso3": "KWT",
  "isoNote": "Explicit slug→ISO map (Panama law) — never derived from the slug.",
  "qid": "Q817",
  "capital": {
    "name": "Kuwait City",
    "lat": 29.367,
    "lng": 47.97429
  },
  "areaKm2": 17818.0,
  "currency": {
    "code": "KWD",
    "name": "Kuwaiti dinar"
  },
  "languages": [
    "Arabic"
  ],
  "callingCode": "+965",
  "population": {
    "value": 4865298,
    "year": 2025,
    "indicator": "SP.POP.TOTL"
  },
  "economySnapshot": {
    "source": "World Bank API — packaged snapshot pulled 2026-10-22; same 16-indicator set as fetchWorldBankLatest (src/lib/apis/worldbank.ts); live at activation via the one-cached-dataset pattern.",
    "indicators": {
      "gdpUsd": {
        "value": 157209026926.418,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.CD"
      },
      "gdpGrowth": {
        "value": 2.731825804492,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.KD.ZG"
      },
      "gdpPerCapita": {
        "value": 32312.3119953634,
        "year": 2025,
        "indicator": "NY.GDP.PCAP.CD"
      },
      "inflation": {
        "value": 2.36195936682045,
        "year": 2025,
        "indicator": "FP.CPI.TOTL.ZG"
      },
      "unemployment": {
        "value": 2.181,
        "year": 2025,
        "indicator": "SL.UEM.TOTL.ZS"
      },
      "population": {
        "value": 4865298,
        "year": 2025,
        "indicator": "SP.POP.TOTL"
      },
      "laborForce": {
        "value": 2927890,
        "year": 2025,
        "indicator": "SL.TLF.TOTL.IN"
      },
      "lifeExpectancy": {
        "value": 84.580487804878,
        "year": 2024,
        "indicator": "SP.DYN.LE00.IN"
      },
      "literacy": {
        "value": 96.4599990844727,
        "year": 2020,
        "indicator": "SE.ADT.LITR.ZS"
      },
      "fdiUsd": {
        "value": 413089668.749062,
        "year": 2025,
        "indicator": "BX.KLT.DINV.CD.WD"
      },
      "remittancesUsd": {
        "value": 23930165.460158,
        "year": 2025,
        "indicator": "BX.TRF.PWKR.CD.DT"
      },
      "tradeBalanceUsd": {
        "value": 16276674173.3727,
        "year": 2025,
        "indicator": "BN.GSR.GNFS.CD"
      },
      "realRate": {
        "value": 10.520668024163,
        "year": 2025,
        "indicator": "FR.INR.RINR"
      }
    }
  },
  "subdivisionType": "Governorate",
  "subdivisions": [
    {
      "name": "Al Asimah",
      "capital": "Kuwait City"
    },
    {
      "name": "Hawalli",
      "capital": "Hawalli"
    },
    {
      "name": "Al Farwaniya",
      "capital": "Al Farwaniyah"
    },
    {
      "name": "Mubarak Al-Kabeer",
      "capital": "Mubarak Al-Kabeer"
    },
    {
      "name": "Al Ahmadi",
      "capital": "Al Ahmadi"
    },
    {
      "name": "Al Jahra",
      "capital": "Al Jahra"
    }
  ],
  "subdivisionsSource": "Wikipedia: Governorates of Kuwait",
  "personalitiesPool": [
    {
      "slug": "jaber-al-ahmad-al-sabah",
      "name": "Jaber Al-Ahmad Al-Sabah",
      "note": "Emir of Kuwait (1977–2006)",
      "years": "1926–2006",
      "wikiUrl": "https://en.wikipedia.org/wiki/Jaber_Al-Ahmad_Al-Sabah",
      "wikiVerified": true
    },
    {
      "slug": "sabah-al-ahmad-al-jaber-al-sabah",
      "name": "Sabah Al-Ahmad Al-Jaber Al-Sabah",
      "note": "Emir of Kuwait (2006–2020)",
      "years": "1929–2020",
      "wikiUrl": "https://en.wikipedia.org/wiki/Sabah_Al-Ahmad_Al-Jaber_Al-Sabah",
      "wikiVerified": true
    },
    {
      "slug": "abdullah-al-salim-al-sabah",
      "name": "Abdullah Al-Salim Al-Sabah",
      "note": "First Emir of Kuwait",
      "years": "1895–1965",
      "wikiUrl": "https://en.wikipedia.org/wiki/Abdullah_Al-Salim_Al-Sabah",
      "wikiVerified": true
    },
    {
      "slug": "souad-abdullah",
      "name": "Souad Abdullah",
      "note": "Actress",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Souad_Abdullah",
      "wikiVerified": true
    },
    {
      "slug": "abdulhussain-abdulredha",
      "name": "Abdulhussain Abdulredha",
      "note": "Actor and comedian",
      "years": "1939–2017",
      "wikiUrl": "https://en.wikipedia.org/wiki/Abdulhussain_Abdulredha",
      "wikiVerified": true
    },
    {
      "slug": "fahaid-al-deehani",
      "name": "Fahaid Al-Deehani",
      "note": "Sport shooter; Olympic medalist (Wikipedia article not verified under this spelling at build — entry kept as unverified seed, to be resolved in the verification pass)",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Fahaid_Al-Deehani",
      "wikiVerified": false
    },
    {
      "slug": "hayat-al-fahad",
      "name": "Hayat Al-Fahad",
      "note": "Actress",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Hayat_Al-Fahad",
      "wikiVerified": true
    },
    {
      "slug": "tariq-al-ali",
      "name": "Tariq Al-Ali",
      "note": "Actor and comedian",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Tariq_Al-Ali",
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
  ],
  "resolverNote": "Entity corrected at build: search resolution initially matched Q37643 (\"Gulf War\") because its description contains the word \"country\"; the country entity is Q817, verified by description \"sovereign state in Western Asia\". Facts re-pulled from Q817."
} as unknown as CountryPackage & { qid: string; eventsNotes: unknown; resolverNote?: string };
