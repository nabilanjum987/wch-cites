// Extension data — personalities + events for the R4B batch-2 cities
// (Round 2 extension, R6B). Build-only dataset mirroring migration 0013.
// Every birth/death date was checked on Wikidata on 2026-10-22 (QID in
// each profile’s sources); all rows verified = false — the human
// verification gate is unchanged. Events follow the R7 pattern
// (source + last-verified date per row, status draft).

export interface ExtensionPersonality {
  slug: string; name: string; title: string; occupation: string;
  birthDate: string; deathDate: string | null; nationality: string;
  citySlug: string; provinceSlug: string; countrySlug: string;
  cityName: string; provinceName: string; countryName: string;
  summary: string;
  achievements: { icon: string; title: string; description: string }[];
  timeline: { year: string; title: string; description: string }[];
  works: unknown[]; quotes: unknown[]; descriptionSections: unknown[];
  imageUrl: string | null; imageCredit: string | null; imageLicence: string | null;
  primaryColor: string;
  sources: { name: string; url: string }[];
  verified: boolean;
}

export const EXTENSION_PERSONALITIES: ExtensionPersonality[] = [
  {
    "slug": "mohammad-hafeez",
    "name": "Mohammad Hafeez",
    "title": "The Professor — Pakistan All-Rounder",
    "occupation": "Cricketer",
    "birthDate": "17 October 1980",
    "deathDate": null,
    "nationality": "Pakistani",
    "citySlug": "sargodha",
    "provinceSlug": "punjab",
    "countrySlug": "pakistan",
    "cityName": "Sargodha",
    "provinceName": "Punjab",
    "countryName": "Pakistan",
    "summary": "Mohammad Hafeez, born in Sargodha in 1980, served Pakistan cricket for two decades as an opening batter and off-spinner — nicknamed 'The Professor' for his analytical game. He captained Pakistan's T20 side and played in the team that won the 2017 Champions Trophy.",
    "achievements": [
      {
        "icon": "🏏",
        "title": "Two Decades for Pakistan",
        "description": "Represented Pakistan from 2003 to 2021 across all three formats."
      },
      {
        "icon": "🏆",
        "title": "Champions Trophy Winner (2017)",
        "description": "Part of the Pakistan squad that won the ICC Champions Trophy in England."
      },
      {
        "icon": "🧢",
        "title": "T20 Captain",
        "description": "Led Pakistan in T20 internationals, including a World T20 semi-final run."
      }
    ],
    "timeline": [
      {
        "year": "1980",
        "title": "Born in Sargodha",
        "description": "Born on 17 October 1980 in Sargodha, Punjab."
      },
      {
        "year": "2003",
        "title": "International debut",
        "description": "Makes his Pakistan debut against Zimbabwe."
      },
      {
        "year": "2017",
        "title": "Champions Trophy",
        "description": "Wins the ICC Champions Trophy with Pakistan at The Oval."
      },
      {
        "year": "2022",
        "title": "Retires",
        "description": "Announces retirement from international cricket in January 2022."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Mohammad_Hafeez"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q3535271"
      }
    ],
    "verified": false
  },
  {
    "slug": "feroz-khan-noon",
    "name": "Feroz Khan Noon",
    "title": "Prime Minister of Pakistan (1957–58)",
    "occupation": "Statesman",
    "birthDate": "18 June 1893",
    "deathDate": "9 December 1970",
    "nationality": "Pakistani",
    "citySlug": "sargodha",
    "provinceSlug": "punjab",
    "countrySlug": "pakistan",
    "cityName": "Sargodha",
    "provinceName": "Punjab",
    "countryName": "Pakistan",
    "summary": "Malik Feroz Khan Noon, from Shahpur in the Sargodha region, was Pakistan's seventh prime minister (1957–58) and before that a minister in British India's wartime government and Pakistan's ambassador to the United Nations. His government negotiated the purchase of Gwadar from Oman in 1958. (Birth date per Wikidata; some references give 7 May 1893.)",
    "achievements": [
      {
        "icon": "🏛️",
        "title": "Prime Minister (1957–58)",
        "description": "Led the Republican Party coalition government until martial law in October 1958."
      },
      {
        "icon": "🌍",
        "title": "UN Ambassador",
        "description": "Served as Pakistan’s permanent representative to the United Nations."
      },
      {
        "icon": "🗺️",
        "title": "Gwadar Acquisition",
        "description": "His tenure saw the 1958 agreement bringing Gwadar into Pakistan."
      }
    ],
    "timeline": [
      {
        "year": "1893",
        "title": "Born in Shahpur",
        "description": "Born in Hamoka village, Shahpur district — today’s Sargodha division."
      },
      {
        "year": "1940s",
        "title": "Minister in British India",
        "description": "Serves in the Viceroy’s Executive Council during the Second World War."
      },
      {
        "year": "1957",
        "title": "Prime Minister",
        "description": "Takes office as Pakistan’s seventh prime minister."
      },
      {
        "year": "1970",
        "title": "Dies",
        "description": "Passes away on 9 December 1970."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Feroz_Khan_Noon"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q1561693"
      }
    ],
    "verified": false
  },
  {
    "slug": "mushaf-ali-mir",
    "name": "Mushaf Ali Mir",
    "title": "Air Chief Marshal — Chief of Air Staff (2000–2003)",
    "occupation": "Air force officer",
    "birthDate": "5 March 1947",
    "deathDate": "20 February 2003",
    "nationality": "Pakistani",
    "citySlug": "sargodha",
    "provinceSlug": "punjab",
    "countrySlug": "pakistan",
    "cityName": "Sargodha",
    "provinceName": "Punjab",
    "countryName": "Pakistan",
    "summary": "Air Chief Marshal Mushaf Ali Mir led the Pakistan Air Force from 2000 until his death in a Fokker F27 crash near Kohat in 2003. PAF Base Mushaf — Sargodha's great air base and the source of its 'City of Eagles' identity — is named in his honour; his association with the city is institutional rather than by birth, and it is recorded that way.",
    "achievements": [
      {
        "icon": "✈️",
        "title": "Chief of Air Staff",
        "description": "Headed the Pakistan Air Force from November 2000 to February 2003."
      },
      {
        "icon": "🏅",
        "title": "Decorated Fighter Pilot",
        "description": "Rose through fighter squadrons over a 37-year career."
      },
      {
        "icon": "🛩️",
        "title": "PAF Base Mushaf Namesake",
        "description": "Sargodha’s principal air base carries his name."
      }
    ],
    "timeline": [
      {
        "year": "1947",
        "title": "Born",
        "description": "Born on 5 March 1947."
      },
      {
        "year": "2000",
        "title": "Air Chief",
        "description": "Becomes Chief of the Air Staff of the Pakistan Air Force."
      },
      {
        "year": "2003",
        "title": "Dies in service",
        "description": "Killed in the Kohat Fokker crash on 20 February 2003, with senior officers and his wife."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Mushaf_Ali_Mir"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q6941222"
      }
    ],
    "verified": false
  },
  {
    "slug": "bahawal-khan-i",
    "name": "Bahawal Khan I",
    "title": "Founder of Bahawalpur",
    "occupation": "Ruler",
    "birthDate": "1715",
    "deathDate": "12 June 1750",
    "nationality": "Pakistani",
    "citySlug": "bahawalpur",
    "provinceSlug": "punjab",
    "countrySlug": "pakistan",
    "cityName": "Bahawalpur",
    "provinceName": "Punjab",
    "countryName": "Pakistan",
    "summary": "Nawab Bahawal Khan I, of the Daudpotra Abbasi family, founded Bahawalpur in 1748 after migrating from Sindh, and made it his clan's capital in place of Derawar. The city still carries his name. (Dates are year-precise at best on Wikidata: born c. 1715, died 12 June 1750.)",
    "achievements": [
      {
        "icon": "🏙️",
        "title": "Founded Bahawalpur (1748)",
        "description": "Established the city that became the capital of the Bahawalpur princely state."
      },
      {
        "icon": "🏰",
        "title": "Shifted the Capital",
        "description": "Moved the seat of power from Derawar to the new city on the Sutlej trade routes."
      }
    ],
    "timeline": [
      {
        "year": "1715",
        "title": "Born",
        "description": "Born into the Daudpotra family of Sindh (year per Wikidata)."
      },
      {
        "year": "1748",
        "title": "Founds Bahawalpur",
        "description": "Establishes the city and his capital."
      },
      {
        "year": "1750",
        "title": "Dies",
        "description": "Dies on 12 June 1750 (Wikidata); the succession continues the Abbasi line of Nawabs."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Bahawal_Khan_I"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q20885288"
      }
    ],
    "verified": false
  },
  {
    "slug": "sadiq-muhammad-khan-iv",
    "name": "Sadiq Muhammad Khan IV",
    "title": "Nawab of Bahawalpur (r. 1866–1899)",
    "occupation": "Ruler",
    "birthDate": "11 November 1861",
    "deathDate": "14 February 1899",
    "nationality": "Pakistani",
    "citySlug": "bahawalpur",
    "provinceSlug": "punjab",
    "countrySlug": "pakistan",
    "cityName": "Bahawalpur",
    "provinceName": "Punjab",
    "countryName": "Pakistan",
    "summary": "Sadiq Muhammad Khan IV ruled Bahawalpur state for over three decades of its princely-era consolidation. The Noor Mahal — the city's signature palace — was built in his reign (1872), and the state's treaty relations with the British Crown were formalised in his time.",
    "achievements": [
      {
        "icon": "🏰",
        "title": "Noor Mahal Era",
        "description": "The Palace of Light was built in 1872 during his reign as a royal residence."
      },
      {
        "icon": "📜",
        "title": "Princely Consolidation",
        "description": "A 33-year reign that stabilised the state’s administration and court culture."
      }
    ],
    "timeline": [
      {
        "year": "1861",
        "title": "Born",
        "description": "Born on 11 November 1861."
      },
      {
        "year": "1866",
        "title": "Ascends the throne",
        "description": "Becomes Nawab as a minor; the state is administered with British oversight during his minority."
      },
      {
        "year": "1872",
        "title": "Noor Mahal built",
        "description": "The palace is constructed in Bahawalpur city."
      },
      {
        "year": "1899",
        "title": "Dies",
        "description": "Dies on 14 February 1899."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Sadiq_Muhammad_Khan_IV"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q55418437"
      }
    ],
    "verified": false
  },
  {
    "slug": "sadiq-muhammad-khan-v",
    "name": "Sadiq Muhammad Khan V",
    "title": "Last Nawab of Bahawalpur",
    "occupation": "Ruler",
    "birthDate": "29 September 1904",
    "deathDate": "24 May 1966",
    "nationality": "Pakistani",
    "citySlug": "bahawalpur",
    "provinceSlug": "punjab",
    "countrySlug": "pakistan",
    "cityName": "Bahawalpur",
    "provinceName": "Punjab",
    "countryName": "Pakistan",
    "summary": "Sadiq Muhammad Khan V, the twelfth and last ruling Nawab of Bahawalpur (r. 1907–1955), was the first princely ruler to pledge his state's resources to the Allied war effort in 1939, and he acceded Bahawalpur to Pakistan on 7 October 1947. His palaces — Noor Mahal, Darbar Mahal, Gulzar Mahal — remain the city's architectural inheritance.",
    "achievements": [
      {
        "icon": "🤝",
        "title": "Acceded to Pakistan (1947)",
        "description": "Signed Bahawalpur’s accession to Pakistan on 7 October 1947."
      },
      {
        "icon": "🎖️",
        "title": "First to Offer War Support (1939)",
        "description": "The first princely ruler to place his state’s resources at the Crown’s disposal in WWII."
      },
      {
        "icon": "🏛️",
        "title": "Palace Builder’s Heir",
        "description": "Presided over the court that maintained Darbar Mahal and the state’s institutions."
      }
    ],
    "timeline": [
      {
        "year": "1904",
        "title": "Born",
        "description": "Born on 29 September 1904 at Derawar."
      },
      {
        "year": "1907",
        "title": "Ascends the throne",
        "description": "Becomes Nawab as a child on his father’s death."
      },
      {
        "year": "1947",
        "title": "Accession",
        "description": "Bahawalpur accedes to Pakistan under his signature."
      },
      {
        "year": "1966",
        "title": "Dies",
        "description": "Dies on 24 May 1966 in London."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Sadiq_Muhammad_Khan_V"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q7397806"
      }
    ],
    "verified": false
  },
  {
    "slug": "james-abbott",
    "name": "James Abbott",
    "title": "Founder of Abbottabad",
    "occupation": "Army officer and administrator",
    "birthDate": "12 March 1807",
    "deathDate": "6 October 1896",
    "nationality": "Pakistani",
    "citySlug": "abbottabad",
    "provinceSlug": "khyber-pakhtunkhwa",
    "countrySlug": "pakistan",
    "cityName": "Abbottabad",
    "provinceName": "Khyber Pakhtunkhwa",
    "countryName": "Pakistan",
    "summary": "General Sir James Abbott, the East India Company officer who served as the first Deputy Commissioner of Hazara, founded the town of Abbottabad in January 1853 — and the city still bears his name (Abbott + abad, 'Abbott's town'). His farewell poem 'Abbottabad' is displayed in the city's Lady Garden. (No Wikidata item was located in this pass; dates per his Wikipedia biography.)",
    "achievements": [
      {
        "icon": "🏙️",
        "title": "Founded Abbottabad (1853)",
        "description": "Laid out the town that became Hazara’s headquarters and cantonment."
      },
      {
        "icon": "✒️",
        "title": "The Poem",
        "description": "His poem \"Abbottabad\" is inscribed in Lady Garden Park in the city."
      }
    ],
    "timeline": [
      {
        "year": "1807",
        "title": "Born",
        "description": "Born on 12 March 1807 in Kent, England."
      },
      {
        "year": "1847",
        "title": "Deputy Commissioner of Hazara",
        "description": "Takes charge of the Hazara district for the East India Company."
      },
      {
        "year": "1853",
        "title": "Founds Abbottabad",
        "description": "Founds the town in January 1853 during his tenure."
      },
      {
        "year": "1896",
        "title": "Dies",
        "description": "Dies on 6 October 1896 in the Isle of Wight."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/James_Abbott"
      },
      {
        "name": "Wikipedia biography",
        "url": "https://en.wikipedia.org/wiki/James_Abbott_(Indian_Army_officer)"
      }
    ],
    "verified": false
  },
  {
    "slug": "sardar-mehtab-abbasi",
    "name": "Sardar Mehtab Ahmed Khan",
    "title": "Sardar of Abbottabad — former Chief Minister & Governor of KP",
    "occupation": "Politician",
    "birthDate": "15 December 1952",
    "deathDate": null,
    "nationality": "Pakistani",
    "citySlug": "abbottabad",
    "provinceSlug": "khyber-pakhtunkhwa",
    "countrySlug": "pakistan",
    "cityName": "Abbottabad",
    "provinceName": "Khyber Pakhtunkhwa",
    "countryName": "Pakistan",
    "summary": "Sardar Mehtab Ahmed Khan Abbasi, born in Malkot in Abbottabad district in 1952, is Hazara's most prominent modern politician: Chief Minister of the North-West Frontier Province (1997–99) and later Governor of Khyber Pakhtunkhwa (2014–16), besides federal aviation office.",
    "achievements": [
      {
        "icon": "🏛️",
        "title": "Chief Minister (1997–99)",
        "description": "Led the NWFP government in the late 1990s."
      },
      {
        "icon": "🎖️",
        "title": "Governor of KP (2014–16)",
        "description": "Served as the province’s governor."
      },
      {
        "icon": "✈️",
        "title": "Federal Aviation Role",
        "description": "Chaired Pakistan International Airlines and served as aviation minister."
      }
    ],
    "timeline": [
      {
        "year": "1952",
        "title": "Born in Abbottabad district",
        "description": "Born on 15 December 1952 in Malkot village."
      },
      {
        "year": "1997",
        "title": "Chief Minister",
        "description": "Takes office as NWFP chief minister."
      },
      {
        "year": "2014",
        "title": "Governor",
        "description": "Appointed Governor of Khyber Pakhtunkhwa."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Sardar_Mehtab_Ahmed_Khan"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q6809885"
      }
    ],
    "verified": false
  },
  {
    "slug": "haider-zaman-khan",
    "name": "Haider Zaman Khan",
    "title": "Leader of the Hazara Province Movement",
    "occupation": "Politician",
    "birthDate": "1936",
    "deathDate": "24 October 2018",
    "nationality": "Pakistani",
    "citySlug": "abbottabad",
    "provinceSlug": "khyber-pakhtunkhwa",
    "countrySlug": "pakistan",
    "cityName": "Abbottabad",
    "provinceName": "Khyber Pakhtunkhwa",
    "countryName": "Pakistan",
    "summary": "Baba Haider Zaman Khan of Abbottabad led the movement demanding a separate Hazara province — the cause that defined Abbottabad's politics after 2010, when the province was renamed Khyber Pakhtunkhwa. A long-serving district nazim, his funeral in 2018 drew the region's political class. (Birth year only on Wikidata: 1936.)",
    "achievements": [
      {
        "icon": "✊",
        "title": "Hazara Movement Leader",
        "description": "Fronted Tehreek-e-Suba Hazara after the 2010 renaming of the province."
      },
      {
        "icon": "🏛️",
        "title": "District Nazim",
        "description": "Served as Abbottabad’s district nazim in the Musharraf-era local government."
      }
    ],
    "timeline": [
      {
        "year": "1936",
        "title": "Born",
        "description": "Born in Abbottabad district (year per Wikidata)."
      },
      {
        "year": "2010",
        "title": "Leads the Hazara movement",
        "description": "Heads the campaign for a separate Hazara province."
      },
      {
        "year": "2018",
        "title": "Dies",
        "description": "Dies on 24 October 2018 in Islamabad."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Haider_Zaman_Khan"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q3694907"
      }
    ],
    "verified": false
  },
  {
    "slug": "khurshid-ahmed-shah",
    "name": "Syed Khurshid Ahmed Shah",
    "title": "Veteran Parliamentarian from Sukkur",
    "occupation": "Politician",
    "birthDate": "20 April 1952",
    "deathDate": null,
    "nationality": "Pakistani",
    "citySlug": "sukkur",
    "provinceSlug": "sindh",
    "countrySlug": "pakistan",
    "cityName": "Sukkur",
    "provinceName": "Sindh",
    "countryName": "Pakistan",
    "summary": "Syed Khurshid Ahmed Shah, born in Sukkur in 1952, is among Pakistan's longest-serving parliamentarians — repeatedly elected from Sukkur since 1988, a federal minister in several governments, and Leader of the Opposition in the National Assembly (2013–18). (Birth date per Wikidata; some references give 13 April 1952.)",
    "achievements": [
      {
        "icon": "🏛️",
        "title": "Leader of the Opposition (2013–18)",
        "description": "Led the opposition benches in the National Assembly."
      },
      {
        "icon": "🗳️",
        "title": "Sukkur’s Long-Serving MNA",
        "description": "Elected from Sukkur constituencies across four decades."
      }
    ],
    "timeline": [
      {
        "year": "1952",
        "title": "Born in Sukkur",
        "description": "Born in Sukkur, Sindh (date per Wikidata Q17388811)."
      },
      {
        "year": "1988",
        "title": "Enters the Assembly",
        "description": "Begins his parliamentary career from Sukkur."
      },
      {
        "year": "2013",
        "title": "Opposition Leader",
        "description": "Becomes Leader of the Opposition in the National Assembly."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Syed_Khurshid_Ahmed_Shah"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q17388811"
      }
    ],
    "verified": false
  },
  {
    "slug": "mir-muhammad-masum",
    "name": "Mir Muhammad Masum",
    "title": "Historian of Sindh — author of Tarikh-i-Masumi",
    "occupation": "Historian and poet",
    "birthDate": "1538",
    "deathDate": "1606",
    "nationality": "Pakistani",
    "citySlug": "sukkur",
    "provinceSlug": "sindh",
    "countrySlug": "pakistan",
    "cityName": "Sukkur",
    "provinceName": "Sindh",
    "countryName": "Pakistan",
    "summary": "Mir Muhammad Masum of Bhakkar, in the Sukkur region, was a Mughal-era historian, poet and physician whose Tarikh-i-Masumi (c. 1600) remains a foundational history of Sindh. Sukkur's great minaret — the Minar of Masum Shah — was raised by his son Mir Buzurg in his memory in 1607. (Years per Wikidata Q20101203; the R4B package seed's birth year is corrected here from 1576 to 1538.)",
    "achievements": [
      {
        "icon": "📜",
        "title": "Tarikh-i-Masumi",
        "description": "His Persian history of Sindh is a primary source for the region’s medieval centuries."
      },
      {
        "icon": "🗼",
        "title": "The Minaret",
        "description": "Sukkur’s 1607 Masum Shah minaret memorialises his family’s seat in the city."
      }
    ],
    "timeline": [
      {
        "year": "1538",
        "title": "Born",
        "description": "Born in Bhakkar, in the Sukkur region (year per Wikidata)."
      },
      {
        "year": "c. 1600",
        "title": "Tarikh-i-Masumi",
        "description": "Completes his history of Sindh at Akbar’s court."
      },
      {
        "year": "1606",
        "title": "Dies",
        "description": "Dies in 1606 (year per Wikidata)."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Mir_Muhammad_Masum"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q20101203"
      }
    ],
    "verified": false
  },
  {
    "slug": "nasir-hussain-shah",
    "name": "Syed Nasir Hussain Shah",
    "title": "Sindh Minister from Sukkur",
    "occupation": "Politician",
    "birthDate": "1964",
    "deathDate": null,
    "nationality": "Pakistani",
    "citySlug": "sukkur",
    "provinceSlug": "sindh",
    "countrySlug": "pakistan",
    "cityName": "Sukkur",
    "provinceName": "Sindh",
    "countryName": "Pakistan",
    "summary": "Syed Nasir Hussain Shah, born in 1964 and long associated with Sukkur's politics, is a senior Pakistan Peoples Party figure who has held major Sindh portfolios including Local Government and Energy. (Birth year per Wikidata Q47394189, which records 1 January 1964 at year precision.)",
    "achievements": [
      {
        "icon": "🏛️",
        "title": "Provincial Minister",
        "description": "Has held senior Sindh cabinet portfolios across PPP governments."
      },
      {
        "icon": "🗳️",
        "title": "Sukkur Politics",
        "description": "A fixture of the Sukkur division’s political landscape for decades."
      }
    ],
    "timeline": [
      {
        "year": "1964",
        "title": "Born",
        "description": "Born in 1964 (Wikidata year precision)."
      },
      {
        "year": "2008",
        "title": "Provincial office",
        "description": "Rises to senior ministerial roles in Sindh governments."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Syed_Nasir_Hussain_Shah"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q47394189"
      }
    ],
    "verified": false
  },
  {
    "slug": "younis-khan",
    "name": "Younis Khan",
    "title": "Pakistan’s Highest Test Run-Scorer",
    "occupation": "Cricketer",
    "birthDate": "29 November 1977",
    "deathDate": null,
    "nationality": "Pakistani",
    "citySlug": "mardan",
    "provinceSlug": "khyber-pakhtunkhwa",
    "countrySlug": "pakistan",
    "cityName": "Mardan",
    "provinceName": "Khyber Pakhtunkhwa",
    "countryName": "Pakistan",
    "summary": "Younis Khan, born in Mardan in 1977, is Pakistan's most prolific Test batter — the only Pakistani past 10,000 Test runs — and the captain who lifted the 2009 ICC World Twenty20 trophy at Lord's. Mardan's most famous sporting son.",
    "achievements": [
      {
        "icon": "🏏",
        "title": "10,099 Test Runs",
        "description": "Pakistan’s all-time leading Test scorer, with 34 centuries."
      },
      {
        "icon": "🏆",
        "title": "World T20 Captain (2009)",
        "description": "Captained Pakistan to the World Twenty20 title at Lord’s."
      },
      {
        "icon": "🎖️",
        "title": "Pride of Performance & Sitara-e-Imtiaz",
        "description": "Honoured with Pakistan’s civil awards for services to cricket."
      }
    ],
    "timeline": [
      {
        "year": "1977",
        "title": "Born in Mardan",
        "description": "Born on 29 November 1977 in Mardan, KP."
      },
      {
        "year": "2000",
        "title": "Test debut",
        "description": "Debuts for Pakistan against Sri Lanka, scoring a century in his second innings."
      },
      {
        "year": "2009",
        "title": "World T20 title",
        "description": "Leads Pakistan to the World Twenty20 crown."
      },
      {
        "year": "2017",
        "title": "Retires past 10,000",
        "description": "Ends his career as Pakistan’s first 10,000-run Test batter."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Younis_Khan"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q3352654"
      }
    ],
    "verified": false
  },
  {
    "slug": "ameer-haider-khan-hoti",
    "name": "Ameer Haider Khan Hoti",
    "title": "Chief Minister of Khyber Pakhtunkhwa (2008–2013)",
    "occupation": "Politician",
    "birthDate": "5 February 1971",
    "deathDate": null,
    "nationality": "Pakistani",
    "citySlug": "mardan",
    "provinceSlug": "khyber-pakhtunkhwa",
    "countrySlug": "pakistan",
    "cityName": "Mardan",
    "provinceName": "Khyber Pakhtunkhwa",
    "countryName": "Pakistan",
    "summary": "Ameer Haider Khan Hoti of Mardan led Khyber Pakhtunkhwa as its chief minister from 2008 to 2013 — the ANP government that governed through the province's hardest militancy years and renamed the province itself in the 18th Amendment era.",
    "achievements": [
      {
        "icon": "🏛️",
        "title": "Chief Minister (2008–13)",
        "description": "Led the ANP-led provincial government for a full term."
      },
      {
        "icon": "📜",
        "title": "The Renaming Era",
        "description": "His tenure covered the province’s renaming to Khyber Pakhtunkhwa (2010)."
      }
    ],
    "timeline": [
      {
        "year": "1971",
        "title": "Born in Mardan",
        "description": "Born on 5 February 1971 into Mardan’s Hoti family."
      },
      {
        "year": "2008",
        "title": "Chief Minister",
        "description": "Takes office as the province’s chief minister."
      },
      {
        "year": "2013",
        "title": "Term ends",
        "description": "Completes the full assembly term."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Ameer_Haider_Khan_Hoti"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q2842534"
      }
    ],
    "verified": false
  },
  {
    "slug": "azam-khan-hoti",
    "name": "Azam Khan Hoti",
    "title": "Senator and Federal Minister from Mardan",
    "occupation": "Politician",
    "birthDate": "27 April 1946",
    "deathDate": "15 April 2015",
    "nationality": "Pakistani",
    "citySlug": "mardan",
    "provinceSlug": "khyber-pakhtunkhwa",
    "countrySlug": "pakistan",
    "cityName": "Mardan",
    "provinceName": "Khyber Pakhtunkhwa",
    "countryName": "Pakistan",
    "summary": "Azam Khan Hoti (1946–2015), of Mardan's Hoti family, was a senator and federal minister (communications) and a pillar of the Awami National Party in the Mardan valley; his son Ameer Haider Khan Hoti became the province's chief minister.",
    "achievements": [
      {
        "icon": "🏛️",
        "title": "Senator & Federal Minister",
        "description": "Served in the Senate and held the federal communications portfolio."
      },
      {
        "icon": "🌹",
        "title": "ANP Pillar in Mardan",
        "description": "Anchored the Awami National Party in its Mardan heartland."
      }
    ],
    "timeline": [
      {
        "year": "1946",
        "title": "Born",
        "description": "Born on 27 April 1946."
      },
      {
        "year": "1990s",
        "title": "Federal office",
        "description": "Serves as federal minister and senator."
      },
      {
        "year": "2015",
        "title": "Dies",
        "description": "Dies on 15 April 2015 in Islamabad."
      }
    ],
    "works": [],
    "quotes": [],
    "descriptionSections": [],
    "imageUrl": null,
    "imageCredit": null,
    "imageLicence": null,
    "primaryColor": "#01411C",
    "sources": [
      {
        "name": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Azam_Khan_Hoti"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q6677741"
      }
    ],
    "verified": false
  }
];

export const EXTENSION_EVENTS = [
  {
    "title": "21st TDCP International Cholistan Desert Jeep Rally 2026",
    "slug": "cholistan-desert-jeep-rally-2026",
    "city": "bahawalpur",
    "venue": "Derawar Fort & Dilwash Stadium, Cholistan Desert (near Bahawalpur)",
    "starts": "2026-02-11",
    "ends": "2026-02-15",
    "category": "motorsport",
    "description": "The 21st edition of the TDCP International Cholistan Desert Jeep Rally, organised by the Tourism Development Corporation of Punjab: 120+ drivers over a ~500 km desert route past Derawar and Jamgarh forts, in Prepared, Stock, Women’s, dirt-bike, quad and truck classes. Khalid Hameed Khan won Prepared A in a record 3:54:12 (Dawn/PakWheels results coverage). Dates note: the rally was announced in some schedules for 4–8 February 2026; post-event reporting (Wikipedia, PakWheels, BeNewz) records the held dates as 11–15 February 2026, which this row uses. Seeded retrospectively as a dated edition record (R7 pattern); the next edition’s dates are the organiser’s to announce.",
    "sourceName": "Wikipedia — Cholistan Desert Jeep Rally; PakWheels (results, 20 Feb 2026)",
    "sourceUrl": "https://en.wikipedia.org/wiki/Cholistan_Desert_Jeep_Rally"
  }
] as const;
