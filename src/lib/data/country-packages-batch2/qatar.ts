import type { CountryPackage } from './types';

// Qatar — country package, batch 2 (BUILD ONLY, not wired to any page).
// Carries two extra fields beyond CountryPackage (qid, eventsNotes, resolverNote where present) —
// typed via the exported const assertion below.
export const COUNTRY_QATAR = {
  "slug": "qatar",
  "name": "Qatar",
  "iso2": "QA",
  "iso3": "QAT",
  "isoNote": "Explicit slug→ISO map (Panama law) — never derived from the slug.",
  "qid": "Q846",
  "capital": {
    "name": "Doha",
    "lat": 25.28545,
    "lng": 51.53096
  },
  "areaKm2": 11437.0,
  "currency": {
    "code": "QAR",
    "name": "Qatari riyal"
  },
  "languages": [
    "Arabic"
  ],
  "callingCode": "+974",
  "population": {
    "value": 2972215,
    "year": 2025,
    "indicator": "SP.POP.TOTL"
  },
  "economySnapshot": {
    "source": "World Bank API — packaged snapshot pulled 2026-10-22; same 16-indicator set as fetchWorldBankLatest (src/lib/apis/worldbank.ts); live at activation via the one-cached-dataset pattern.",
    "indicators": {
      "gdpUsd": {
        "value": 215559615384.615,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.CD"
      },
      "gdpGrowth": {
        "value": 2.90166036660493,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.KD.ZG"
      },
      "gdpPerCapita": {
        "value": 72524.9066385222,
        "year": 2025,
        "indicator": "NY.GDP.PCAP.CD"
      },
      "inflation": {
        "value": 1.26734310292375,
        "year": 2024,
        "indicator": "FP.CPI.TOTL.ZG"
      },
      "unemployment": {
        "value": 0.13,
        "year": 2025,
        "indicator": "SL.UEM.TOTL.ZS"
      },
      "population": {
        "value": 2972215,
        "year": 2025,
        "indicator": "SP.POP.TOTL"
      },
      "laborForce": {
        "value": 2198274,
        "year": 2025,
        "indicator": "SL.TLF.TOTL.IN"
      },
      "lifeExpectancy": {
        "value": 82.522,
        "year": 2024,
        "indicator": "SP.DYN.LE00.IN"
      },
      "literacy": {
        "value": 97.75,
        "year": 2014,
        "indicator": "SE.ADT.LITR.ZS"
      },
      "gini": {
        "value": 35.1,
        "year": 2017,
        "indicator": "SI.POV.GINI"
      },
      "poverty": {
        "value": 0,
        "year": 2017,
        "indicator": "SI.POV.DDAY"
      },
      "fdiUsd": {
        "value": 3032967032.96703,
        "year": 2025,
        "indicator": "BX.KLT.DINV.CD.WD"
      },
      "remittancesUsd": {
        "value": 1257967032.96703,
        "year": 2025,
        "indicator": "BX.TRF.PWKR.CD.DT"
      },
      "tradeBalanceUsd": {
        "value": 48744230769.2308,
        "year": 2025,
        "indicator": "BN.GSR.GNFS.CD"
      },
      "realRate": {
        "value": 8.16104576821988,
        "year": 2025,
        "indicator": "FR.INR.RINR"
      }
    }
  },
  "subdivisionType": "Municipality",
  "subdivisions": [
    {
      "name": "Ad Dawhah",
      "capital": "Ad Dawhah"
    },
    {
      "name": "Al Rayyan",
      "capital": "Al Rayyan"
    },
    {
      "name": "Al Wakrah",
      "capital": "Al Wakrah"
    },
    {
      "name": "Al Khor and Al Thakhira",
      "capital": "Al Khor and Al Thakhira"
    },
    {
      "name": "Al Daayen",
      "capital": "Al Daayen"
    },
    {
      "name": "Al Shamal",
      "capital": "Al Shamal"
    },
    {
      "name": "Al-Shahaniya",
      "capital": "Al-Shahaniya"
    },
    {
      "name": "Umm Salal",
      "capital": "Umm Salal"
    }
  ],
  "subdivisionsSource": "Wikipedia: Municipalities of Qatar",
  "personalitiesPool": [
    {
      "slug": "tamim-bin-hamad-al-thani",
      "name": "Tamim bin Hamad Al Thani",
      "note": "Emir of Qatar",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Tamim_bin_Hamad_Al_Thani",
      "wikiVerified": true
    },
    {
      "slug": "hamad-bin-khalifa-al-thani",
      "name": "Hamad bin Khalifa Al Thani",
      "note": "Emir of Qatar (1995–2013)",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Hamad_bin_Khalifa_Al_Thani",
      "wikiVerified": true
    },
    {
      "slug": "moza-bint-nasser",
      "name": "Moza bint Nasser",
      "note": "Sheikha; education and social development advocate",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Moza_bint_Nasser",
      "wikiVerified": true
    },
    {
      "slug": "al-mayassa-bint-hamad-al-thani",
      "name": "Al-Mayassa bint Hamad Al Thani",
      "note": "Chairperson of Qatar Museums",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Al-Mayassa_bint_Hamad_Al_Thani",
      "wikiVerified": true
    },
    {
      "slug": "nasser-al-attiyah",
      "name": "Nasser Al-Attiyah",
      "note": "Rally driver and Olympic medal-winning shooter",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Nasser_Al-Attiyah",
      "wikiVerified": true
    },
    {
      "slug": "mutaz-essa-barshim",
      "name": "Mutaz Essa Barshim",
      "note": "High jumper; Olympic champion",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Mutaz_Essa_Barshim",
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
