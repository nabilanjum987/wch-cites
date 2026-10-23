import type { ConflictDetail } from './types';

// Ukraine–Russia — conflicts detail data (BUILD ONLY; route still redirects to the hub).
export const CONFLICT_UKRAINE_RUSSIA: ConflictDetail = {
  "slug": "ukraine-russia",
  "name": "Ukraine–Russia",
  "unhcr": {
    "year": 2024,
    "refugees": 5120036,
    "asylumSeekers": 44349,
    "idps": 3665000,
    "stateless": "0",
    "returnedRefugees": 209064,
    "source": "UNHCR Population Statistics API, country of origin UKR, year 2024 (aggregate asylum row)"
  },
  "unhcrNote": null,
  "headlinesSnapshot": {
    "note": "Dated snapshot from whitelist RSS feeds (BBC News, Al Jazeera, UN News) fetched 2026-10-22. Reuters/AP carry no open RSS; at runtime the hub fills headlines live via GNews filtered to the whitelist. An empty set means the feeds carried no matching item that day — it is recorded, not filled.",
    "fetchedAt": "2026-10-22",
    "items": [
      {
        "title": "Missiles hit Kyiv after Russia agrees to US call to resume Ukraine peace talks",
        "source": "BBC News",
        "url": "https://www.bbc.co.uk/news/articles/cq3djn5nxx12o?at_medium=RSS&at_campaign=rss",
        "date": "2026-10-21"
      },
      {
        "title": "Ukraine says it carried out first drone airlift of wounded soldier from front line",
        "source": "BBC News",
        "url": "https://www.bbc.co.uk/news/videos/c3vgx05p149wo?at_medium=RSS&at_campaign=rss",
        "date": "2026-10-19"
      },
      {
        "title": "Rosenberg: Russia agrees to Ukraine talks but sees little to talk about in new peace push",
        "source": "BBC News",
        "url": "https://www.bbc.co.uk/news/articles/cm98zn5j89kdo?at_medium=RSS&at_campaign=rss",
        "date": "2026-10-21"
      },
      {
        "title": "Russia and Ukraine trade attacks despite pledging to resume peace talks",
        "source": "Al Jazeera",
        "url": "https://www.aljazeera.com/video/newsfeed/2026/10/22/russia-and-ukraine-trade-attacks-despite-pledging-to-resume-peace-talks?traffic_source=rss",
        "date": "2026-10-22"
      },
      {
        "title": "Russian strikes hit Kyiv after Witkoff meets Putin",
        "source": "Al Jazeera",
        "url": "https://www.aljazeera.com/news/2026/10/22/russian-strikes-hit-kyiv-after-witkoff-meets-putin?traffic_source=rss",
        "date": "2026-10-22"
      }
    ]
  },
  "peaceEfforts": {
    "items": [
      {
        "title": "Missiles hit Kyiv after Russia agrees to US call to resume Ukraine peace talks",
        "source": "BBC News",
        "url": "https://www.bbc.co.uk/news/articles/cq3djn5nxx12o?at_medium=RSS&at_campaign=rss",
        "date": "2026-10-21"
      },
      {
        "title": "Rosenberg: Russia agrees to Ukraine talks but sees little to talk about in new peace push",
        "source": "BBC News",
        "url": "https://www.bbc.co.uk/news/articles/cm98zn5j89kdo?at_medium=RSS&at_campaign=rss",
        "date": "2026-10-21"
      },
      {
        "title": "Russia and Ukraine trade attacks despite pledging to resume peace talks",
        "source": "Al Jazeera",
        "url": "https://www.aljazeera.com/video/newsfeed/2026/10/22/russia-and-ukraine-trade-attacks-despite-pledging-to-resume-peace-talks?traffic_source=rss",
        "date": "2026-10-22"
      }
    ],
    "standingSources": [
      {
        "name": "ReliefWeb country page (UN OCHA)",
        "url": "https://reliefweb.int/country/ukr",
        "note": "Continuously updated humanitarian situation reports and peace-process statements."
      },
      {
        "name": "UN News",
        "url": "https://news.un.org",
        "note": "UN statements, Security Council action and mediation reporting (whitelist source)."
      }
    ],
    "note": "Peace Efforts is a compulsory section on this site. Entries are neutral, dated and sourced; no party claims are reproduced as fact."
  },
  "charity": {
    "commissionStatement": "WorldCityHub takes 0% commission on these links. Every donation goes directly to the organisation.",
    "organisations": [
      {
        "name": "UNHCR — UN Refugee Agency",
        "url": "https://www.unhcr.org",
        "donateUrl": "https://donate.unhcr.org"
      },
      {
        "name": "ICRC — Red Cross",
        "url": "https://www.icrc.org",
        "donateUrl": "https://www.icrc.org/en/donate"
      },
      {
        "name": "WFP — World Food Programme",
        "url": "https://www.wfp.org",
        "donateUrl": "https://www.wfp.org/donate"
      },
      {
        "name": "MSF — Doctors Without Borders",
        "url": "https://www.msf.org",
        "donateUrl": "https://www.msf.org/donate"
      },
      {
        "name": "UNICEF",
        "url": "https://www.unicef.org",
        "donateUrl": "https://www.unicef.org/donate"
      }
    ],
    "note": "Same organisation set as the live hub (src/lib/conflicts.ts HUMANITARIAN_ORGS). No weapons or defence-related links — banned on this site."
  },
  "editorialRules": [
    "Whitelist sources only: Reuters, AP, BBC, Al Jazeera, UN News, UNHCR, ICRC, ReliefWeb.",
    "No casualty figures from the parties themselves.",
    "No editorialising: reproduce wire titles with attribution and link.",
    "Peace Efforts section is compulsory.",
    "Charity links are 0% commission; weapons/defence affiliates banned."
  ]
};
