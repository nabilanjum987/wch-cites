import type { CountryPackage } from './types';

// Türkiye — country package (BUILD ONLY, not wired to any page).
// Facts: Wikidata identity + World Bank economy snapshot (2026-10-22) + Wikipedia-verified lists.
export const COUNTRY_TURKIYE: CountryPackage = {
  "slug": "turkiye",
  "name": "Türkiye",
  "iso2": "TR",
  "iso3": "TUR",
  "isoNote": "Explicit slug→ISO map (Panama law) — never derived from the slug.",
  "capital": {
    "name": "Ankara",
    "lat": 39.92,
    "lng": 32.85
  },
  "areaKm2": 783562.05,
  "currency": {
    "code": "TRY",
    "name": "Turkish lira"
  },
  "languages": [
    "Turkish"
  ],
  "callingCode": "+90",
  "population": {
    "value": 85878556,
    "year": 2025,
    "indicator": "SP.POP.TOTL"
  },
  "economySnapshot": {
    "source": "World Bank API (api.worldbank.org) — packaged snapshot pulled 2026-10-22; at activation the country page reads the SAME indicator set live via fetchWorldBankLatest(iso3) / getCountryEconomy (one-cached-dataset pattern). Missing keys = the World Bank publishes no recent value; consumers hide them.",
    "indicators": {
      "gdpUsd": {
        "value": 1597293229287,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.CD"
      },
      "gdpGrowth": {
        "value": 3.6,
        "year": 2025,
        "indicator": "NY.GDP.MKTP.KD.ZG"
      },
      "gdpPerCapita": {
        "value": 18599.44,
        "year": 2025,
        "indicator": "NY.GDP.PCAP.CD"
      },
      "inflation": {
        "value": 34.88,
        "year": 2025,
        "indicator": "FP.CPI.TOTL.ZG"
      },
      "unemployment": {
        "value": 8.52,
        "year": 2025,
        "indicator": "SL.UEM.TOTL.ZS"
      },
      "population": {
        "value": 85878556,
        "year": 2025,
        "indicator": "SP.POP.TOTL"
      },
      "laborForce": {
        "value": 36882225,
        "year": 2025,
        "indicator": "SL.TLF.TOTL.IN"
      },
      "lifeExpectancy": {
        "value": 77.42,
        "year": 2024,
        "indicator": "SP.DYN.LE00.IN"
      },
      "literacy": {
        "value": 97.26,
        "year": 2021,
        "indicator": "SE.ADT.LITR.ZS"
      },
      "gini": {
        "value": 43.7,
        "year": 2023,
        "indicator": "SI.POV.GINI"
      },
      "poverty": {
        "value": 0.2,
        "year": 2023,
        "indicator": "SI.POV.DDAY"
      },
      "fdiUsd": {
        "value": 12971000000,
        "year": 2025,
        "indicator": "BX.KLT.DINV.CD.WD"
      },
      "remittancesUsd": {
        "value": 761000000,
        "year": 2025,
        "indicator": "BX.TRF.PWKR.CD.DT"
      },
      "tradeBalanceUsd": {
        "value": -6355000000,
        "year": 2025,
        "indicator": "BN.GSR.GNFS.CD"
      },
      "debtPctGdp": {
        "value": 25.51,
        "year": 2024,
        "indicator": "GC.DOD.TOTL.GD.ZS"
      }
    }
  },
  "subdivisionType": "Province",
  "subdivisions": [
    {
      "name": "Adana",
      "capital": "Adana"
    },
    {
      "name": "Adıyaman",
      "capital": "Adıyaman"
    },
    {
      "name": "Afyonkarahisar",
      "capital": "Afyonkarahisar"
    },
    {
      "name": "Ağrı",
      "capital": "Ağrı"
    },
    {
      "name": "Aksaray",
      "capital": "Aksaray"
    },
    {
      "name": "Amasya",
      "capital": "Amasya"
    },
    {
      "name": "Ankara",
      "capital": "Ankara"
    },
    {
      "name": "Antalya",
      "capital": "Antalya"
    },
    {
      "name": "Ardahan",
      "capital": "Ardahan"
    },
    {
      "name": "Artvin",
      "capital": "Artvin"
    },
    {
      "name": "Aydın",
      "capital": "Aydın"
    },
    {
      "name": "Balıkesir",
      "capital": "Balıkesir"
    },
    {
      "name": "Bartın",
      "capital": "Bartın"
    },
    {
      "name": "Batman",
      "capital": "Batman"
    },
    {
      "name": "Bayburt",
      "capital": "Bayburt"
    },
    {
      "name": "Bilecik",
      "capital": "Bilecik"
    },
    {
      "name": "Bingöl",
      "capital": "Bingöl"
    },
    {
      "name": "Bitlis",
      "capital": "Bitlis"
    },
    {
      "name": "Bolu",
      "capital": "Bolu"
    },
    {
      "name": "Burdur",
      "capital": "Burdur"
    },
    {
      "name": "Bursa",
      "capital": "Bursa"
    },
    {
      "name": "Çanakkale",
      "capital": "Çanakkale"
    },
    {
      "name": "Çankırı",
      "capital": "Çankırı"
    },
    {
      "name": "Çorum",
      "capital": "Çorum"
    },
    {
      "name": "Denizli",
      "capital": "Denizli"
    },
    {
      "name": "Diyarbakır",
      "capital": "Diyarbakır"
    },
    {
      "name": "Düzce",
      "capital": "Düzce"
    },
    {
      "name": "Edirne",
      "capital": "Edirne"
    },
    {
      "name": "Elazığ",
      "capital": "Elazığ"
    },
    {
      "name": "Erzincan",
      "capital": "Erzincan"
    },
    {
      "name": "Erzurum",
      "capital": "Erzurum"
    },
    {
      "name": "Eskişehir",
      "capital": "Eskişehir"
    },
    {
      "name": "Gaziantep",
      "capital": "Gaziantep"
    },
    {
      "name": "Giresun",
      "capital": "Giresun"
    },
    {
      "name": "Gümüşhane",
      "capital": "Gümüşhane"
    },
    {
      "name": "Hakkari",
      "capital": "Hakkari"
    },
    {
      "name": "Hatay",
      "capital": "Antakya"
    },
    {
      "name": "Iğdır",
      "capital": "Iğdır"
    },
    {
      "name": "Isparta",
      "capital": "Isparta"
    },
    {
      "name": "İstanbul",
      "capital": "İstanbul"
    },
    {
      "name": "İzmir",
      "capital": "İzmir"
    },
    {
      "name": "Kahramanmaraş",
      "capital": "Kahramanmaraş"
    },
    {
      "name": "Karabük",
      "capital": "Karabük"
    },
    {
      "name": "Karaman",
      "capital": "Karaman"
    },
    {
      "name": "Kars",
      "capital": "Kars"
    },
    {
      "name": "Kastamonu",
      "capital": "Kastamonu"
    },
    {
      "name": "Kayseri",
      "capital": "Kayseri"
    },
    {
      "name": "Kilis",
      "capital": "Kilis"
    },
    {
      "name": "Kırıkkale",
      "capital": "Kırıkkale"
    },
    {
      "name": "Kırklareli",
      "capital": "Kırklareli"
    },
    {
      "name": "Kırşehir",
      "capital": "Kırşehir"
    },
    {
      "name": "Kocaeli",
      "capital": "İzmit"
    },
    {
      "name": "Konya",
      "capital": "Konya"
    },
    {
      "name": "Kütahya",
      "capital": "Kütahya"
    },
    {
      "name": "Malatya",
      "capital": "Malatya"
    },
    {
      "name": "Manisa",
      "capital": "Manisa"
    },
    {
      "name": "Mardin",
      "capital": "Mardin"
    },
    {
      "name": "Mersin",
      "capital": "Mersin"
    },
    {
      "name": "Muğla",
      "capital": "Muğla"
    },
    {
      "name": "Muş",
      "capital": "Muş"
    },
    {
      "name": "Nevşehir",
      "capital": "Nevşehir"
    },
    {
      "name": "Niğde",
      "capital": "Niğde"
    },
    {
      "name": "Ordu",
      "capital": "Ordu"
    },
    {
      "name": "Osmaniye",
      "capital": "Osmaniye"
    },
    {
      "name": "Rize",
      "capital": "Rize"
    },
    {
      "name": "Sakarya",
      "capital": "Adapazarı"
    },
    {
      "name": "Samsun",
      "capital": "Samsun"
    },
    {
      "name": "Siirt",
      "capital": "Siirt"
    },
    {
      "name": "Sinop",
      "capital": "Sinop"
    },
    {
      "name": "Sivas",
      "capital": "Sivas"
    },
    {
      "name": "Şanlıurfa",
      "capital": "Şanlıurfa"
    },
    {
      "name": "Şırnak",
      "capital": "Şırnak"
    },
    {
      "name": "Tekirdağ",
      "capital": "Tekirdağ"
    },
    {
      "name": "Tokat",
      "capital": "Tokat"
    },
    {
      "name": "Trabzon",
      "capital": "Trabzon"
    },
    {
      "name": "Tunceli",
      "capital": "Tunceli"
    },
    {
      "name": "Uşak",
      "capital": "Uşak"
    },
    {
      "name": "Van",
      "capital": "Van"
    },
    {
      "name": "Yalova",
      "capital": "Yalova"
    },
    {
      "name": "Yozgat",
      "capital": "Yozgat"
    },
    {
      "name": "Zonguldak",
      "capital": "Zonguldak"
    }
  ],
  "subdivisionsSource": "Wikipedia: Provinces of Turkey",
  "personalitiesPool": [
    {
      "slug": "mustafa-kemal-atat-rk",
      "name": "Mustafa Kemal Atatürk",
      "note": "Founder of the Republic of Türkiye",
      "years": "1881–1938",
      "wikiUrl": "https://en.wikipedia.org/wiki/Mustafa_Kemal_Atat%C3%BCrk",
      "wikiVerified": true
    },
    {
      "slug": "mehmed-ii",
      "name": "Mehmed II",
      "note": "Ottoman sultan; conqueror of Constantinople",
      "years": "1432–1481",
      "wikiUrl": "https://en.wikipedia.org/wiki/Mehmed_II",
      "wikiVerified": true
    },
    {
      "slug": "suleiman-the-magnificent",
      "name": "Suleiman the Magnificent",
      "note": "Ottoman sultan (1520–1566)",
      "years": "1494–1566",
      "wikiUrl": "https://en.wikipedia.org/wiki/Suleiman_the_Magnificent",
      "wikiVerified": true
    },
    {
      "slug": "rumi",
      "name": "Rumi",
      "note": "13th-century poet and Sufi mystic (Konya)",
      "years": "1207–1273",
      "wikiUrl": "https://en.wikipedia.org/wiki/Rumi",
      "wikiVerified": true
    },
    {
      "slug": "orhan-pamuk",
      "name": "Orhan Pamuk",
      "note": "Novelist; Nobel Prize in Literature laureate",
      "years": "living",
      "wikiUrl": "https://en.wikipedia.org/wiki/Orhan_Pamuk",
      "wikiVerified": true
    },
    {
      "slug": "n-z-m-hikmet",
      "name": "Nâzım Hikmet",
      "note": "Poet and playwright",
      "years": "1902–1963",
      "wikiUrl": "https://en.wikipedia.org/wiki/N%C3%A2z%C4%B1m_Hikmet",
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
