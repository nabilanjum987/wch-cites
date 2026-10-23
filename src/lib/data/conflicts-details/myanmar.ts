import type { ConflictDetail } from './types';

// Myanmar — conflicts detail data (BUILD ONLY; route still redirects to the hub).
export const CONFLICT_MYANMAR: ConflictDetail = {
  "slug": "myanmar",
  "name": "Myanmar",
  "unhcr": {
    "year": 2024,
    "refugees": 1322503,
    "asylumSeekers": 65946,
    "idps": 3513867,
    "stateless": "0",
    "returnedRefugees": "0",
    "source": "UNHCR Population Statistics API, country of origin MYA, year 2024 (aggregate asylum row)"
  },
  "unhcrNote": null,
  "headlinesSnapshot": {
    "note": "Dated snapshot from whitelist RSS feeds (BBC News, Al Jazeera, UN News) fetched 2026-10-22. Reuters/AP carry no open RSS; at runtime the hub fills headlines live via GNews filtered to the whitelist. An empty set means the feeds carried no matching item that day — it is recorded, not filled.",
    "fetchedAt": "2026-10-22",
    "items": []
  },
  "peaceEfforts": {
    "items": [],
    "standingSources": [
      {
        "name": "ReliefWeb country page (UN OCHA)",
        "url": "https://reliefweb.int/country/mya",
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
