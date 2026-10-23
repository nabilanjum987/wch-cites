import type { ConflictDetail } from './types';

// Israel–Gaza — conflicts detail data (BUILD ONLY; route still redirects to the hub).
export const CONFLICT_ISRAEL_GAZA: ConflictDetail = {
  "slug": "israel-gaza",
  "name": "Israel–Gaza",
  "unhcr": null,
  "unhcrNote": "Palestine refugees fall under UNRWA's mandate, not UNHCR's; the UNHCR Population Statistics API returns no aggregate for this origin. Gaza displacement figures are published by UN OCHA / UNRWA — no figure is packaged rather than a wrong one.",
  "headlinesSnapshot": {
    "note": "Dated snapshot from whitelist RSS feeds (BBC News, Al Jazeera, UN News) fetched 2026-10-22. Reuters/AP carry no open RSS; at runtime the hub fills headlines live via GNews filtered to the whitelist. An empty set means the feeds carried no matching item that day — it is recorded, not filled.",
    "fetchedAt": "2026-10-22",
    "items": [
      {
        "title": "How do Israel's elections work and who are the main contenders?",
        "source": "BBC News",
        "url": "https://www.bbc.co.uk/news/articles/cx8dz75633vjo?at_medium=RSS&at_campaign=rss",
        "date": "2026-10-22"
      },
      {
        "title": "How Arab parties could hold critical balance of power in Israeli election",
        "source": "BBC News",
        "url": "https://www.bbc.co.uk/news/articles/cx8dzrp768j8o?at_medium=RSS&at_campaign=rss",
        "date": "2026-10-22"
      },
      {
        "title": "Israeli forces kill disabled man in southern Syria raid, state media says",
        "source": "Al Jazeera",
        "url": "https://www.aljazeera.com/news/2026/10/22/israeli-forces-kill-disabled-man-in-southern-syria-raid-state-media-says?traffic_source=rss",
        "date": "2026-10-22"
      },
      {
        "title": "Israeli elections: Is it just right wing versus right?",
        "source": "Al Jazeera",
        "url": "https://www.aljazeera.com/video/newsfeed/2026/10/22/israeli-elections-is-it-just-right-wing-versus-right?traffic_source=rss",
        "date": "2026-10-22"
      },
      {
        "title": "In Israel election, Palestinian citizens weigh fear against disillusionment",
        "source": "Al Jazeera",
        "url": "https://www.aljazeera.com/news/2026/10/22/in-israel-election-palestinian-citizens-weigh-fear-against-disillusionment?traffic_source=rss",
        "date": "2026-10-22"
      }
    ]
  },
  "peaceEfforts": {
    "items": [],
    "standingSources": [
      {
        "name": "ReliefWeb country page (UN OCHA)",
        "url": "https://reliefweb.int/country/pal",
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
