// ─────────────────────────────────────────────────────────────────────────────
// Wonders data layer (WP4 / marathon Q9) — SERVER ONLY.
//
// Golden-template rule (blueprint §2/§6): no fact renders without a source
// record. Static facts live in the database (migration 0001: `wonders`,
// `wonder_media`, `wonder_sources`) once the owner applies it; until then
// this module serves the SAME verified dataset baked from the WP2-prep
// data pack, reconciled against the golden blueprint and re-verified
// live on 2026-10-22 (Wikidata Q9141, UNESCO list 252, Commons API,
// tajmahal.gov.in). The page renders identical real content either way.
//
// Live layer (weather / sun / golden hour) is fetched per request from
// Open-Meteo with a 30-minute cache — never stored, never invented; if
// the API is down the live blocks simply do not render (fallback rule).
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase } from '@/lib/supabase';

export interface WonderMedia {
  fileTitle: string;
  fileUrl: string;
  pageUrl: string;
  width: number;
  height: number;
  licence: string;
  licenceUrl: string;
  author: string;
  attribution: string;
  role: 'hero' | 'gallery' | 'timeline' | 'detail';
  alt: string;
  sortOrder: number;
}

export interface WonderSource {
  claim: string;
  sourceName: string;
  sourceUrl: string;
  checkedAt: string; // ISO date the claim was verified
}

export interface WonderFact {
  label: string;
  value: string;
  source: string; // short source name, detailed in `sources`
}

export interface TimelineEntry {
  year: string;
  title: string;
  text: string;
  mediaFileTitle?: string;
}

export interface MythCard {
  claim: string;
  verdict: 'TRUE' | 'FALSE' | 'PARTLY TRUE';
  evidence: string;
  sourceName: string;
  sourceUrl: string;
}

export interface Wonder {
  slug: string;
  name: string;
  category: string;
  wikidataQid: string;
  unescoId: number | null;
  unescoYear: number | null;
  cityName: string;
  regionName: string;
  countryName: string;
  lat: number;
  lng: number;
  timezone: string;
  officialUrl: string;
  ticketUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  intro: string[]; // The Story paragraphs, written from the source pack
  facts: WonderFact[];
  architecture: {
    paragraphs: string[];
    geniusPoints: string[];
    dimensions: { label: string; value: string }[];
    materials: string[];
  };
  timeline: TimelineEntry[];
  visitor: {
    hoursText: string;
    closedDays: string;
    // null = fees not verified from the official source → block hidden
    fees: { visitor: string; amount: string; note?: string }[] | null;
    feesNote: string | null;
    gatesText: string;
    lastVerified: string;
    sourceName: string;
    sourceUrl: string;
  };
  myths: MythCard[];
  photoSpots: { name: string; description: string; mediaFileTitle?: string }[];
  faqs: { q: string; a: string }[];
  nearby: { name: string; relation: string; lat: number; lng: number; url: string; urlLabel: string }[];
  media: WonderMedia[];
  sources: WonderSource[];
}

const CHECKED = '2026-10-22';

// ── Taj Mahal — the golden instance ─────────────────────────────────────────
// Facts: Wikidata Q9141 (pulled 2026-10-22) + UNESCO WHC 252 brief
// synthesis (fetched 2026-10-22) + Wikipedia REST summary + official
// visitor site tajmahal.gov.in (fetched 2026-10-22). Media: Wikimedia
// Commons imageinfo records pulled 2026-10-22 — licence + author on
// every record; no image without both is used.
const TAJ_MAHAL: Wonder = {
  slug: 'taj-mahal',
  name: 'Taj Mahal',
  category: 'New7Wonders of the World',
  wikidataQid: 'Q9141',
  unescoId: 252,
  unescoYear: 1983,
  cityName: 'Agra',
  regionName: 'Uttar Pradesh',
  countryName: 'India',
  lat: 27.175,
  lng: 78.041944,
  timezone: 'Asia/Kolkata',
  officialUrl: 'https://www.tajmahal.gov.in/',
  ticketUrl: 'https://asi.payumoney.com/',
  seoTitle: 'Taj Mahal: Live Weather, Timings, Fees & Visitor Guide',
  seoDescription:
    'Taj Mahal today: live weather, sunrise & golden hour, opening times, official ticket prices, UNESCO facts, credited photos and myth checks. Agra, India.',
  intro: [
    'The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in Agra, Uttar Pradesh, India. It was commissioned in 1631 by the fifth Mughal emperor, Shah Jahan, to house the tomb of his late wife, Mumtaz Mahal; it also houses the tomb of Shah Jahan himself. The tomb is the centrepiece of a 17-hectare (42-acre) complex, which includes a mosque and a guest house, and is set in formal gardens bounded on three sides by a crenellated wall.',
    'UNESCO, which inscribed the Taj Mahal as World Heritage Site 252 in 1983, calls it "the greatest architectural achievement in the whole range of Indo-Islamic architecture". For its construction, masons, stone-cutters, inlayers, carvers, painters, calligraphers and dome builders were requisitioned from across the empire and from Central Asia and Iran, under the main architect Ustad Ahmad Lahori.',
    'Today the complex is managed by the Archaeological Survey of India. A 10,400 sq km Taj Trapezium Zone around the monument restricts polluting industry to protect the marble — one reason the live air and weather picture on this page matters to a visit, not just the history.',
  ],
  facts: [
    { label: 'Commissioned', value: '1631, by Shah Jahan', source: 'Wikipedia / UNESCO' },
    { label: 'Built', value: '1632–1648 (complex completed 1653)', source: 'UNESCO' },
    { label: 'Height', value: '73 m', source: 'Wikidata' },
    { label: 'Complex area', value: '17 hectares (42 acres)', source: 'Wikidata / UNESCO' },
    { label: 'Main material', value: 'White marble', source: 'Wikidata' },
    { label: 'Architect', value: 'Ahmad Lahori (Ustad Ahmad Lahori)', source: 'Wikidata / UNESCO' },
    { label: 'Style', value: 'Mughal · Islamic · Persian', source: 'Wikidata' },
    { label: 'UNESCO World Heritage', value: 'Site 252 · inscribed 1983 · criterion (i)', source: 'UNESCO' },
    { label: 'Visitors', value: '6,532,366 in 2018', source: 'Wikidata' },
    { label: 'Coordinates', value: '27.175° N, 78.0419° E', source: 'Wikidata' },
  ],
  architecture: {
    paragraphs: [
      'The tomb stands on a square platform at the northern end of the charbagh garden — placed at the garden\u2019s end rather than its exact centre, an innovation UNESCO singles out for the depth and perspective it gives the distant view. The plan is in perfect bilateral symmetry along a central axis: an octagonal tomb chamber at the centre, encompassed by portal halls and four corner rooms, with four free-standing minarets framing the platform\u2019s corners.',
      'The building is brick-in-lime mortar veneered with red sandstone and marble, the tomb itself in white marble inlaid with precious and semi-precious stones (pietra dura). Inside, an octagonal marble lattice screen of superb workmanship surrounds the cenotaphs of Mumtaz Mahal and Shah Jahan; the real graves lie in the crypt below, as in other imperial Mughal tombs. The mosque and guest house flanking the tomb are built of red sandstone in deliberate contrast.',
    ],
    geniusPoints: [
      'Tomb placed at the end of the quadripartite garden, not the centre — added depth and perspective (UNESCO)',
      'The raised-tomb design: the mausoleum stands on a square platform reached by a lateral flight of steps',
      'Four minarets give the edifice a three-dimensional frame and act as a spatial reference',
      'Colour play: lush green garden, reddish pathways and blue sky set the marble in ever-changing tints (UNESCO)',
      'Pietra dura inlay so fine the flowers in the stone appear almost real',
    ],
    dimensions: [
      { label: 'Height of the mausoleum', value: '73 m' },
      { label: 'Walled complex', value: '17 hectares (42 acres)' },
      { label: 'Garden form', value: 'Charbagh — quadripartite, subdivided by walkways and water channels' },
      { label: 'Minarets', value: '4, free-standing, at the platform corners' },
    ],
    materials: ['White marble', 'Red sandstone', 'Brick-in-lime mortar', 'Precious and semi-precious stone inlay'],
  },
  timeline: [
    {
      year: '1631',
      title: 'Commissioned',
      text: 'Shah Jahan commissions a tomb for his wife Mumtaz Mahal on the right bank of the Yamuna in Agra.',
      mediaFileTitle: 'Taj Mahal, Agra, India edit3.jpg',
    },
    {
      year: '1632',
      title: 'Construction begins',
      text: 'Work starts, drawing masons, stone-cutters, inlayers and calligraphers from across the empire, Central Asia and Iran (UNESCO).',
    },
    {
      year: '1648',
      title: 'Main structures completed',
      text: 'The mausoleum, mosque and guest house are completed, per the UNESCO chronology.',
      mediaFileTitle: 'Taj Mahal (22595078173).jpg',
    },
    {
      year: '1653',
      title: 'The complex is finished',
      text: 'The main gateway, outer courtyard and cloisters complete the walled complex (UNESCO).',
      mediaFileTitle: 'Taj gate.jpg',
    },
    {
      year: '1865',
      title: 'Among the first photographs',
      text: 'Felice Beato photographs the Taj Mahal — one of the earliest photographic records of the monument.',
      mediaFileTitle: 'Felice Beato Taj Mahal 1865 (01).jpg',
    },
    {
      year: '1983',
      title: 'UNESCO World Heritage',
      text: 'Inscribed on the World Heritage List as site 252 under criterion (i), a masterpiece of human creative genius.',
      mediaFileTitle: 'Taj Mahal (Edited).jpeg',
    },
  ],
  visitor: {
    hoursText: 'Opens 30 minutes before sunrise and closes 30 minutes before sunset.',
    closedDays: 'Closed on Fridays for general viewing.',
    fees: [
      { visitor: 'Foreign tourist', amount: '₹1,100', note: '+ ₹200 (optional) for the main mausoleum' },
      { visitor: 'Citizens of SAARC & BIMSTEC countries', amount: '₹540', note: '+ ₹200 (optional) for the main mausoleum' },
      { visitor: 'Domestic / Indian / OCI cardholder', amount: '₹50', note: '+ ₹200 (optional) for the main mausoleum' },
      { visitor: 'Children below 15 years', amount: 'Free', note: 'Domestic and foreign' },
    ],
    feesNote:
      'Fees are inclusive of ASI & ADA charges, as published on the official site. Online tickets are discounted ₹5 (Indian) / ₹50 (foreigner) per ticket.',
    gatesText:
      'Entry tickets are sold at the Western Gate (near Saheli Burj) and the Eastern Gate, from one hour before sunrise until 45 minutes before sunset. The Southern Gate is exit only. There are separate queues for foreign and domestic tourists.',
    lastVerified: CHECKED,
    sourceName: 'Official Taj Mahal website (tajmahal.gov.in)',
    sourceUrl: 'https://www.tajmahal.gov.in/visiting-hours.aspx',
  },
  myths: [
    {
      claim: 'Shah Jahan cut off the hands of the craftsmen so they could never build anything as beautiful again.',
      verdict: 'FALSE',
      evidence:
        'No Mughal court chronicle, Persian history or contemporary traveller account mentions any such punishment — and the empire\u2019s artisans were needed, and used, for later imperial projects. The story appears only in later popular retellings and guide lore.',
      sourceName: 'Historians\u2019 consensus — no contemporary record (see Wikipedia, "Taj Mahal", and its references)',
      sourceUrl: 'https://en.wikipedia.org/wiki/Taj_Mahal',
    },
    {
      claim: 'A mirror-image "Black Taj" in black marble was planned across the Yamuna for Shah Jahan himself.',
      verdict: 'PARTLY TRUE',
      evidence:
        'The tale traces to the 17th-century traveller Jean-Baptiste Tavernier. There IS a real riverside complex opposite — Mehtab Bagh, a moonlit garden aligned with the Taj — but Archaeological Survey of India excavations there found a garden, not the foundations of a black-marble mausoleum; the dark stones were discoloured white marble.',
      sourceName: 'Archaeological Survey of India excavations at Mehtab Bagh (see Wikipedia, "Mehtab Bagh")',
      sourceUrl: 'https://en.wikipedia.org/wiki/Mehtab_Bagh',
    },
    {
      claim: 'The Taj Mahal was originally a Shiva temple called "Tejo Mahalaya".',
      verdict: 'FALSE',
      evidence:
        'The claim has been rejected by historians and by the Archaeological Survey of India, whose position is that the monument is the tomb complex built by Shah Jahan; Indian courts, including the Supreme Court of India, have dismissed petitions based on the theory. Court chronicles and inscriptions on the building itself record its construction as a mausoleum.',
      sourceName: 'Archaeological Survey of India; Supreme Court of India',
      sourceUrl: 'https://en.wikipedia.org/wiki/Taj_Mahal',
    },
    {
      claim: 'The Taj changes colour through the day — pinkish at dawn, white at noon, golden in moonlight.',
      verdict: 'TRUE',
      evidence:
        'The translucent white marble takes on the light around it. UNESCO describes the colour combination of green garden, reddish pathways and blue sky as showing "the monument in ever changing tints and moods" — the effect visitors photograph at sunrise and sunset on this page\u2019s golden-hour windows.',
      sourceName: 'UNESCO World Heritage Centre, site 252',
      sourceUrl: 'https://whc.unesco.org/en/list/252/',
    },
  ],
  photoSpots: [
    {
      name: 'The Yamuna bank view',
      description: 'The classic postcard angle: the tomb and its reflection axis from the river side, as in our hero photograph.',
      mediaFileTitle: 'Taj Mahal (Edited).jpeg',
    },
    {
      name: 'Through the Great Gate',
      description: 'The main gateway (darwaza) frames the tomb at the end of the charbagh — arrive at opening time for the softest light.',
      mediaFileTitle: 'Taj gate.jpg',
    },
    {
      name: 'The fountain axis',
      description: 'Along the central water channel of the charbagh, looking to the Assembly Hall side of the complex.',
      mediaFileTitle: 'Fountain Facing Assembly Hall - Taj Mahal Complex - Agra 2014-05-14 3810.JPG',
    },
    {
      name: 'Mehtab Bagh, across the river',
      description: 'The moonlit garden opposite the Taj gives the sunset and moonrise view — the same alignment Shah Jahan\u2019s planners built into the complex.',
    },
  ],
  faqs: [
    {
      q: 'What are the Taj Mahal opening hours?',
      a: 'The Taj Mahal opens 30 minutes before sunrise and closes 30 minutes before sunset, and it is closed on Fridays for general viewing (official site, tajmahal.gov.in). Today\u2019s exact opening and closing times, from live sunrise and sunset data, are shown in the Quick Answer box at the top of this page.',
    },
    {
      q: 'How much is a Taj Mahal ticket?',
      a: 'Per the official site: foreign tourists ₹1,100, citizens of SAARC and BIMSTEC countries ₹540, and Indian/domestic visitors (including OCI cardholders) ₹50 — with an optional ₹200 extra for the main mausoleum. Children under 15 enter free. Fees include ASI and ADA charges.',
    },
    {
      q: 'When is the best time to visit the Taj Mahal?',
      a: 'At opening time, just before sunrise: the marble glows pinkish in the first light, the crowds are thinnest, and temperatures are at their coolest. This page shows today\u2019s sunrise, sunset and golden-hour windows live, plus what to wear for today\u2019s weather at the site.',
    },
    {
      q: 'Who built the Taj Mahal, and why?',
      a: 'The Mughal emperor Shah Jahan commissioned it in 1631 as the tomb of his wife Mumtaz Mahal; Shah Jahan himself is also buried there. The main architect was Ustad Ahmad Lahori, and craftsmen were drawn from across the empire, Central Asia and Iran (UNESCO).',
    },
    {
      q: 'Is the Taj Mahal a UNESCO World Heritage Site?',
      a: 'Yes — it was inscribed in 1983 as World Heritage Site 252, under criterion (i), and UNESCO calls it the greatest architectural achievement in the whole range of Indo-Islamic architecture.',
    },
  ],
  nearby: [
    {
      name: 'Agra Fort',
      relation: 'UNESCO World Heritage Site in the same Taj Trapezium Zone',
      lat: 27.179583,
      lng: 78.021297,
      url: 'https://whc.unesco.org/en/list/251/',
      urlLabel: 'UNESCO listing',
    },
    {
      name: 'Fatehpur Sikri',
      relation: 'UNESCO World Heritage Site in the same Taj Trapezium Zone',
      lat: 27.091111,
      lng: 77.661111,
      url: 'https://whc.unesco.org/en/list/255/',
      urlLabel: 'UNESCO listing',
    },
  ],
  media: [
    {
      fileTitle: 'Taj Mahal (Edited).jpeg',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Taj_Mahal_(Edited).jpeg',
      width: 3840,
      height: 2525,
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      author: 'Yann Forget, edited by Jim Carter',
      attribution: '"Taj Mahal (Edited).jpeg" by Yann Forget, edited by Jim Carter — CC BY-SA 4.0, via Wikimedia Commons',
      role: 'hero',
      alt: 'The Taj Mahal seen from the Yamuna river side, its white marble dome and minarets above the garden wall',
      sortOrder: 1,
    },
    {
      fileTitle: 'Taj Mahal, Agra, India edit3.jpg',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Taj_Mahal,_Agra,_India_edit3.jpg',
      width: 3144,
      height: 2173,
      licence: 'CC BY-SA 3.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      author: 'Yann Forget, edited by King of Hearts',
      attribution: '"Taj Mahal, Agra, India edit3.jpg" — Yann Forget, edited by King of Hearts — CC BY-SA 3.0, via Wikimedia Commons',
      role: 'gallery',
      alt: 'Front view of the Taj Mahal across the charbagh garden and reflecting channel',
      sortOrder: 2,
    },
    {
      fileTitle: 'Taj gate.jpg',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Taj_gate.jpg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Taj_gate.jpg',
      width: 5832,
      height: 3888,
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      author: 'CR Pushpa',
      attribution: '"Taj gate.jpg" by CR Pushpa — CC BY-SA 4.0, via Wikimedia Commons',
      role: 'gallery',
      alt: 'The Great Gate (Darwaza-i rauza) of the Taj Mahal complex, red sandstone with white marble inlay',
      sortOrder: 3,
    },
    {
      fileTitle: 'Taj Mahal (22595078173).jpg',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Taj_Mahal_%2822595078173%29.jpg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Taj_Mahal_(22595078173).jpg',
      width: 5184,
      height: 3456,
      licence: 'CC0',
      licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/deed.en',
      author: 'Gary Todd',
      attribution: '"Taj Mahal (22595078173).jpg" by Gary Todd — CC0, via Wikimedia Commons',
      role: 'gallery',
      alt: 'The Taj Mahal mausoleum with its dome and four minarets under a clear sky',
      sortOrder: 4,
    },
    {
      fileTitle: 'Fountain Facing Assembly Hall - Taj Mahal Complex - Agra 2014-05-14 3810.JPG',
      fileUrl:
        'https://upload.wikimedia.org/wikipedia/commons/5/5b/Fountain_Facing_Assembly_Hall_-_Taj_Mahal_Complex_-_Agra_2014-05-14_3810.JPG',
      pageUrl:
        'https://commons.wikimedia.org/wiki/File:Fountain_Facing_Assembly_Hall_-_Taj_Mahal_Complex_-_Agra_2014-05-14_3810.JPG',
      width: 6016,
      height: 4000,
      licence: 'CC BY 3.0',
      licenceUrl: 'https://creativecommons.org/licenses/by/3.0',
      author: 'Biswarup Ganguly',
      attribution:
        '"Fountain Facing Assembly Hall – Taj Mahal Complex – Agra" by Biswarup Ganguly — CC BY 3.0, via Wikimedia Commons',
      role: 'gallery',
      alt: 'A fountain on the central axis of the Taj Mahal charbagh garden facing the Assembly Hall',
      sortOrder: 5,
    },
    {
      fileTitle: 'Northern Octagonal Tower - West View - Assembly Hall - Taj Mahal Complex - Agra 2014-05-14 3817.JPG',
      fileUrl:
        'https://upload.wikimedia.org/wikipedia/commons/2/24/Northern_Octagonal_Tower_-_West_View_-_Assembly_Hall_-_Taj_Mahal_Complex_-_Agra_2014-05-14_3817.JPG',
      pageUrl:
        'https://commons.wikimedia.org/wiki/File:Northern_Octagonal_Tower_-_West_View_-_Assembly_Hall_-_Taj_Mahal_Complex_-_Agra_2014-05-14_3817.JPG',
      width: 5677,
      height: 3775,
      licence: 'CC BY 3.0',
      licenceUrl: 'https://creativecommons.org/licenses/by/3.0',
      author: 'Biswarup Ganguly',
      attribution:
        '"Northern Octagonal Tower – West View – Assembly Hall – Taj Mahal Complex – Agra" by Biswarup Ganguly — CC BY 3.0, via Wikimedia Commons',
      role: 'detail',
      alt: 'The northern octagonal tower of the Taj Mahal enclosure wall, west view toward the Assembly Hall',
      sortOrder: 6,
    },
    {
      fileTitle: 'Octagonal Pavilion on the enclosure wall, Taj Mahal.jpg',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Octagonal_Pavilion_on_the_enclosure_wall%2C_Taj_Mahal.jpg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Octagonal_Pavilion_on_the_enclosure_wall,_Taj_Mahal.jpg',
      width: 4928,
      height: 3264,
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      author: 'Abhinay Prakash',
      attribution: '"Octagonal Pavilion on the enclosure wall, Taj Mahal" by Abhinay Prakash — CC BY-SA 4.0, via Wikimedia Commons',
      role: 'detail',
      alt: 'An octagonal pavilion (chhatri) on the enclosure wall of the Taj Mahal complex',
      sortOrder: 7,
    },
    {
      fileTitle: 'Felice Beato Taj Mahal 1865 (01).jpg',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Felice_Beato_Taj_Mahal_1865_%2801%29.jpg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Felice_Beato_Taj_Mahal_1865_(01).jpg',
      width: 2536,
      height: 1976,
      licence: 'Public domain',
      licenceUrl: 'https://commons.wikimedia.org/wiki/Commons:Public_domain',
      author: 'Felice A. Beato',
      attribution: '"Felice Beato Taj Mahal 1865" by Felice A. Beato — public domain, via Wikimedia Commons',
      role: 'timeline',
      alt: 'The Taj Mahal photographed by Felice Beato in 1865, among the earliest photographs of the monument',
      sortOrder: 8,
    },
  ],
  sources: [
    { claim: 'Identity, coordinates, height, area, material, architect, styles, official site, 2018 visitor count', sourceName: 'Wikidata — Q9141 (Taj Mahal)', sourceUrl: 'https://www.wikidata.org/wiki/Q9141', checkedAt: CHECKED },
    { claim: 'UNESCO status, site ID 252, inscription year 1983, construction chronology 1632–1648–1653, architecture and significance', sourceName: 'UNESCO World Heritage Centre — Taj Mahal (site 252)', sourceUrl: 'https://whc.unesco.org/en/list/252/', checkedAt: CHECKED },
    { claim: 'Commissioned 1631 by Shah Jahan for Mumtaz Mahal; 17-hectare complex; mosque and guest house', sourceName: 'Wikipedia — "Taj Mahal" (REST summary, cross-checked)', sourceUrl: 'https://en.wikipedia.org/wiki/Taj_Mahal', checkedAt: CHECKED },
    { claim: 'Opening rule, Friday closure, ticket prices, gates and outlets', sourceName: 'Official Taj Mahal website — Visiting Hours', sourceUrl: 'https://www.tajmahal.gov.in/visiting-hours.aspx', checkedAt: CHECKED },
    { claim: 'All photographs: licence, author, dimensions', sourceName: 'Wikimedia Commons — imageinfo records (per-file links in the credits)', sourceUrl: 'https://commons.wikimedia.org/', checkedAt: CHECKED },
    { claim: 'Live weather, sunrise, sunset, UV and forecast at the site', sourceName: 'Open-Meteo API (forecast, at 27.175, 78.041944)', sourceUrl: 'https://open-meteo.com/', checkedAt: CHECKED },
    { claim: 'Agra Fort and Fatehpur Sikri coordinates (nearby distances)', sourceName: 'Wikidata — Q171857 (Agra Fort), Q179046 (Fatehpur Sikri)', sourceUrl: 'https://www.wikidata.org/wiki/Q171857', checkedAt: CHECKED },
  ],
};

// ── Batch 1 replication (Round 2, R2) ─────────────────────────────────────
// Seven wonders built on the golden pattern, verified live on
// 2026-10-22 (Wikidata description-matched QIDs, UNESCO list pages,
// Commons imageinfo). They are BUILT, not published: they render at
// their URLs on this branch for QA, but stay OUT of
// PUBLISHED_WONDERS (the hub) and OUT of the sitemap until billi’s
// switch-on after the PR #7 merge. Migration 0008 seeds them as
// status='draft' for the same reason.

const GREAT_WALL_OF_CHINA: Wonder = {
  "slug": "great-wall-of-china",
  "name": "Great Wall of China",
  "category": "New7Wonders of the World",
  "wikidataQid": "Q12501",
  "unescoId": 438,
  "unescoYear": 1987,
  "cityName": "Beijing (Badaling section)",
  "regionName": "Northern China",
  "countryName": "China",
  "lat": 40.431389,
  "lng": 116.564444,
  "timezone": "Asia/Shanghai",
  "officialUrl": "http://www.thegreatwall.com.cn/en",
  "ticketUrl": null,
  "seoTitle": "Great Wall of China: Live Weather, Guide & Facts",
  "seoDescription": "Great Wall of China today: live weather at Badaling, visiting guide, UNESCO facts, credited photos and myth checks. The 21,196 km Ming-era wonder.",
  "intro": [
    "The Great Wall of China is a series of fortifications built across the historical northern borders of China, from the 7th century BC to the Ming dynasty (1368–1644). It is not one wall but many — rammed-earth frontier works of early states, stone and brick Ming walls, trenches and natural barriers — surveyed in 2012 at a combined length of 21,196 km.",
    "UNESCO inscribed The Great Wall as World Heritage Site 438 in 1987, describing it as an outstanding and unique example of a military architectural ensemble whose defensive purpose endured for two thousand years. The best-preserved sections are Ming: brick-faced walls averaging 6–7 metres high with watchtowers, passes and signal towers, following mountain ridgelines such as those at Badaling and Mutianyu outside Beijing.",
    "In 2007 the Great Wall was voted one of the New7Wonders of the World. The live weather block on this page is sampled at Badaling (40.4314° N, 116.5644° E), the most visited section — mountain weather there changes fast, and conditions decide what a visit feels like more than any other single factor."
  ],
  "facts": [
    {
      "label": "Total length",
      "value": "21,196 km — all dynasties and branches (2012 official Chinese survey)",
      "source": "UNESCO / Wikipedia"
    },
    {
      "label": "Built",
      "value": "7th century BC – 1644 (Ming sections 1368–1644)",
      "source": "Wikidata / UNESCO"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Site 438 · inscribed 1987 · criteria (i)(ii)(iii)(iv)(vi)",
      "source": "UNESCO"
    },
    {
      "label": "Main materials",
      "value": "Stone, brick and rammed earth",
      "source": "Wikidata"
    },
    {
      "label": "Visitors",
      "value": "About 16 million a year",
      "source": "Wikidata"
    },
    {
      "label": "Coordinates (Badaling)",
      "value": "40.4314° N, 116.5644° E",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "The Ming wall is an engineered system, not a single barrier: a brick-and-stone faced rampart with a paved top wide enough for troops to march along, drainage spouts, parapets on both sides in steep terrain, and watchtowers at signalling distance. Passes such as Badaling and Shanhaiguan were fortified gates where the wall met the roads it existed to control.",
      "Earlier walls were humbler — tamped earth and gravel between wooden frames — and thousands of kilometres of them survive as eroded ridges in the desert west. The wall also includes signal towers for smoke and fire beacons, barracks, and natural defences incorporated into the line; the 2012 survey counted 43,721 heritage sites in the whole system."
    ],
    "geniusPoints": [
      "A defensive system, not a wall: ramparts, passes, signal towers and natural barriers working as one (UNESCO)",
      "Built along ridgelines so the terrain itself multiplies the wall’s effect",
      "Beacon towers relayed signals along the frontier by smoke by day and fire by night",
      "Sticky-rice mortar in Ming sections — lime slaked with rice soup — proved unusually durable"
    ],
    "dimensions": [
      {
        "label": "Combined length",
        "value": "21,196 km (all walls, trenches and branches)"
      },
      {
        "label": "Ming wall",
        "value": "8,850 km including 6,259 km of man-made wall"
      },
      {
        "label": "Typical Ming section height",
        "value": "6–7 m"
      },
      {
        "label": "Watchtowers",
        "value": "25,000+ along the Ming line (survey count)"
      }
    ],
    "materials": [
      "Stone",
      "Brick",
      "Rammed earth",
      "Sticky-rice lime mortar"
    ]
  },
  "timeline": [
    {
      "year": "7th c. BC",
      "title": "First frontier walls",
      "text": "Chinese states including Chu, Qi and Wei raise rammed-earth border walls — the works later connected into the Great Wall system."
    },
    {
      "year": "220 BC",
      "title": "Qin connection",
      "text": "After unifying China, Qin Shi Huang links and extends the northern walls against nomadic incursions from the steppe."
    },
    {
      "year": "1368–1644",
      "title": "The Ming wall",
      "text": "The Ming dynasty rebuilds the frontier in brick and stone — the wall visitors see today, including Badaling (built 1505)."
    },
    {
      "year": "1987",
      "title": "UNESCO World Heritage",
      "text": "Inscribed as site 438, recognised as a masterpiece of defensive architecture spanning two millennia."
    },
    {
      "year": "2007",
      "title": "New7Wonders",
      "text": "Named one of the New7Wonders of the World in the global vote announced on 7 July 2007."
    },
    {
      "year": "2012",
      "title": "Full length surveyed",
      "text": "China’s heritage authorities announce the surveyed total: 21,196 km across all dynasties and branches."
    }
  ],
  "visitor": {
    "hoursText": "Opening hours and entry fees vary by section and season. The two sections most visitors use — Badaling and Mutianyu, both outside Beijing — open daily from early morning; the official site and each section’s own announcements publish the current schedule.",
    "closedDays": "Sections open year-round; individual sections can close in severe mountain weather.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Badaling is reached from Beijing by bus and the S2 suburban rail / high-speed rail to Badaling Great Wall station; Mutianyu is served by shuttle buses from Dongzhimen. Passport-based ticket booking applies to foreign visitors at major sections.",
    "lastVerified": "2026-10-22",
    "sourceName": "The Great Wall official site",
    "sourceUrl": "http://www.thegreatwall.com.cn/en"
  },
  "myths": [
    {
      "claim": "The Great Wall is visible from space with the naked eye.",
      "verdict": "FALSE",
      "evidence": "Astronauts including China’s Yang Liwei have said it is not visible unaided from orbit, and NASA confirms the wall — narrow and earth-coloured — cannot be picked out with the naked eye from low Earth orbit, let alone from the Moon.",
      "sourceName": "NASA / astronaut testimony (see Wikipedia, \"Great Wall of China\")",
      "sourceUrl": "https://en.wikipedia.org/wiki/Great_Wall_of_China"
    },
    {
      "claim": "It is one single, continuous wall built all at once.",
      "verdict": "PARTLY TRUE",
      "evidence": "The system was built over two thousand years by successive states and dynasties, and includes parallel walls, branches, trenches and natural barriers. The famous stone wall is mostly Ming (1368–1644) work.",
      "sourceName": "UNESCO site 438; 2012 Chinese national survey",
      "sourceUrl": "https://whc.unesco.org/en/list/438/"
    },
    {
      "claim": "Dead workers were buried inside the wall, making it the world’s longest cemetery.",
      "verdict": "FALSE",
      "evidence": "Construction deaths are historically documented, but no evidence supports bodies entombed within the wall as building fill; the \"longest cemetery\" line is a later legend, not an archaeological finding.",
      "sourceName": "Historians’ consensus (see Wikipedia, \"Great Wall of China\", legends)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Great_Wall_of_China"
    }
  ],
  "photoSpots": [
    {
      "name": "Badaling ridgeline",
      "description": "The restored Ming wall snaking over the ridges north of Beijing — the hero view on this page, photographed by CEphoto (Uwe Aranas).",
      "mediaFileTitle": "Badaling China Great-Wall-of-China-06.jpg"
    },
    {
      "name": "Jinshanling at dawn",
      "description": "A wilder, less-restored stretch prized by photographers; our gallery shot by Jakub Hałun shows the wall crossing tower after tower of peaks.",
      "mediaFileTitle": "20090529 Great Wall 8125.jpg"
    }
  ],
  "faqs": [
    {
      "q": "How long is the Great Wall of China?",
      "a": "21,196 km in total, counting every dynasty’s walls, branches and trenches — the figure announced by China’s heritage authorities after the 2012 national survey. The Ming wall alone runs 8,850 km."
    },
    {
      "q": "Can you see the Great Wall from space?",
      "a": "Not with the naked eye. Astronauts, including China’s first astronaut Yang Liwei, report it cannot be picked out unaided from orbit; NASA states the same."
    },
    {
      "q": "Which section should a first-time visitor choose?",
      "a": "Badaling is the closest and most restored section from Beijing; Mutianyu is slightly farther, greener and usually quieter, with a cable car and toboggan. Both open daily from early morning; schedules vary by season."
    },
    {
      "q": "When was the Great Wall built?",
      "a": "In stages over roughly two thousand years: the first frontier walls in the 7th century BC, connections under Qin Shi Huang after 220 BC, and the brick-and-stone wall seen today under the Ming dynasty (1368–1644)."
    },
    {
      "q": "Is the Great Wall a UNESCO World Heritage Site?",
      "a": "Yes — inscribed in 1987 as site 438, and named one of the New7Wonders of the World in 2007."
    }
  ],
  "nearby": [
    {
      "name": "Forbidden City",
      "relation": "UNESCO World Heritage Site in Beijing, the usual base city for wall sections",
      "lat": 39.916389,
      "lng": 116.397222,
      "url": "https://whc.unesco.org/en/list/439/",
      "urlLabel": "UNESCO listing"
    },
    {
      "name": "Ming Tombs",
      "relation": "Imperial Ming necropolis on the road between Beijing and the wall",
      "lat": 40.253,
      "lng": 116.218,
      "url": "https://whc.unesco.org/en/list/1004/",
      "urlLabel": "UNESCO listing"
    }
  ],
  "media": [
    {
      "fileTitle": "Badaling China Great-Wall-of-China-06.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Badaling_China_Great-Wall-of-China-06.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Badaling_China_Great-Wall-of-China-06.jpg",
      "width": 4093,
      "height": 2729,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "CEphoto, Uwe Aranas",
      "attribution": "\"Badaling China Great-Wall-of-China-06.jpg\" by CEphoto, Uwe Aranas — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "The Great Wall of China crossing forested mountain ridges at Badaling",
      "sortOrder": 1
    },
    {
      "fileTitle": "20090529 Great Wall 8125.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/5/50/20090529_Great_Wall_8125.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:20090529_Great_Wall_8125.jpg",
      "width": 3008,
      "height": 2000,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Jakub Hałun",
      "attribution": "\"20090529 Great Wall 8125.jpg\" by Jakub Hałun — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "The Great Wall at Jinshanling winding over a chain of watchtowers and peaks",
      "sortOrder": 2
    }
  ],
  "sources": [
    {
      "claim": "Identity, coordinates, materials, official site, annual visitors",
      "sourceName": "Wikidata — Q12501 (Great Wall of China)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q12501",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status, site ID 438, inscription year 1987, total length 21,196 km (2012 survey)",
      "sourceName": "UNESCO World Heritage Centre — The Great Wall (site 438)",
      "sourceUrl": "https://whc.unesco.org/en/list/438/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Space-visibility and burial legends checked against astronaut testimony and historians",
      "sourceName": "Wikipedia — \"Great Wall of China\" (cross-checked)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Great_Wall_of_China",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "All photographs: licence, author, dimensions",
      "sourceName": "Wikimedia Commons — imageinfo records (per-file links in the credits)",
      "sourceUrl": "https://commons.wikimedia.org/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Live weather and sun times at the site",
      "sourceName": "Open-Meteo API (forecast, at 40.431389, 116.564444)",
      "sourceUrl": "https://open-meteo.com/",
      "checkedAt": "2026-10-22"
    }
  ]
};

const EIFFEL_TOWER: Wonder = {
  "slug": "eiffel-tower",
  "name": "Eiffel Tower",
  "category": "Iconic Landmark",
  "wikidataQid": "Q243",
  "unescoId": 600,
  "unescoYear": 1991,
  "cityName": "Paris",
  "regionName": "Île-de-France",
  "countryName": "France",
  "lat": 48.858296,
  "lng": 2.294479,
  "timezone": "Europe/Paris",
  "officialUrl": "https://www.toureiffel.paris",
  "ticketUrl": "https://ticket.toureiffel.paris",
  "seoTitle": "Eiffel Tower: Live Weather, Guide, Facts & Myths",
  "seoDescription": "Eiffel Tower today: live weather, visiting guide, UNESCO Paris facts, credited photos and myth checks. Eiffel’s 1889 iron tower on the Champ de Mars.",
  "intro": [
    "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, built as the centrepiece of the 1889 World’s Fair (Exposition Universelle) marking the centenary of the French Revolution. It was designed by engineers Maurice Koechlin and Émile Nouguier of Gustave Eiffel’s company, with architect Stephen Sauvestre shaping its appearance; Eiffel bought the rights and gave it his name.",
    "At 300 metres as built — 324 metres including antennas at Wikidata’s survey, and 330 metres since a 2022 antenna — it was the world’s tallest structure until 1930. Paris kept it after its 20-year permit expired because it proved invaluable as a radio-telegraphy mast; today it stands inside the UNESCO-listed Banks of the Seine (site 600, inscribed 1991).",
    "Around seven million people a year ascend it (Wikidata records 7,097,302 visitors), making it the world’s most-visited paid monument. The live block on this page samples weather at the tower itself — Paris wind matters: the summit sways only a few centimetres, but queues and views are weather games."
  ],
  "facts": [
    {
      "label": "Built",
      "value": "1887–1889, for the 1889 World’s Fair",
      "source": "Wikidata / UNESCO"
    },
    {
      "label": "Height",
      "value": "324 m including antennas (300 m as built, 1889)",
      "source": "Wikidata"
    },
    {
      "label": "Designers",
      "value": "Maurice Koechlin & Émile Nouguier; architect Stephen Sauvestre; Gustave Eiffel’s company",
      "source": "Wikidata / Wikipedia"
    },
    {
      "label": "Material",
      "value": "Puddled (wrought) iron — 18,038 parts, 2.5 million rivets",
      "source": "Wikidata / official site"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Within \"Paris, Banks of the Seine\" — site 600 · inscribed 1991",
      "source": "UNESCO"
    },
    {
      "label": "Visitors",
      "value": "7,097,302 a year",
      "source": "Wikidata"
    },
    {
      "label": "Coordinates",
      "value": "48.8583° N, 2.2945° E",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "The tower is a kit of 18,038 prefabricated puddled-iron parts, drawn to a tenth of a millimetre and joined by some 2.5 million rivets; assembly took just over two years with a workforce of a few hundred — and, remarkably, only one fatality. Its curved profile is engineering made visible: the piers flare outward to resist wind, the force Eiffel’s calculations put at the centre of the design.",
      "Three levels carry restaurants, exhibitions and the restored office of Gustave Eiffel at the summit. The tower is repainted roughly every seven years with about 60 tonnes of paint — the current colour is the official \"Eiffel Tower brown\". Its night-time sparkling lights and golden illumination are a separate, copyrighted artwork in France, which is why this page’s photographs are daytime shots."
    ],
    "geniusPoints": [
      "A wind-resisting curve: the silhouette follows the mathematics of wind pressure (Eiffel’s own calculations)",
      "18,038 prefabricated parts assembled on site in 2 years, 2 months and 5 days",
      "Saved from dismantling by science — first military radio telegraphy, then broadcasting antennas",
      "Repainted every ~7 years by painter-steeplejacks using ~60 tonnes of paint (official site)"
    ],
    "dimensions": [
      {
        "label": "Height as built (1889)",
        "value": "300 m — tallest structure in the world until 1930"
      },
      {
        "label": "Height incl. antennas",
        "value": "324 m (Wikidata); 330 m since the 2022 antenna"
      },
      {
        "label": "Base",
        "value": "125 m square"
      },
      {
        "label": "Weight",
        "value": "10,100 tonnes total; 7,300 tonnes of iron"
      }
    ],
    "materials": [
      "Puddled iron (wrought iron)",
      "Rivets (2.5 million)"
    ]
  },
  "timeline": [
    {
      "year": "1887",
      "title": "Construction begins",
      "text": "Foundations start on the Champ de Mars in January 1887; the artists of Paris publish their famous protest letter against the \"useless and monstrous\" tower."
    },
    {
      "year": "1889",
      "title": "Opened",
      "text": "Gustave Eiffel climbs the 1,665 steps to plant the French flag on 31 March 1889; lifts open to the public for the World’s Fair in May."
    },
    {
      "year": "1909",
      "title": "Saved by the antenna",
      "text": "The 20-year permit expires, but the tower’s value for radio telegraphy earns it a permanent place on the skyline."
    },
    {
      "year": "1991",
      "title": "UNESCO World Heritage",
      "text": "The tower is included in the \"Paris, Banks of the Seine\" World Heritage listing, site 600."
    },
    {
      "year": "2022",
      "title": "Six metres taller",
      "text": "A new radio antenna raises the summit to 330 m — the tower has grown by antennas several times since 1889."
    }
  ],
  "visitor": {
    "hoursText": "The tower is open every day of the year. Lift and stair hours shift with the season — mid-morning to late evening, later in summer; the official site publishes the day’s exact schedule and same-day ticket availability.",
    "closedDays": "Open daily, year-round (closures only for exceptional weather or security).",
    "fees": null,
    "feesNote": null,
    "gatesText": "Entrances are at the base of each pillar inside the secured esplanade (glass-wall perimeter, security check before entry). Online timed tickets from the official ticket site are the reliable way to skip the longest queues.",
    "lastVerified": "2026-10-22",
    "sourceName": "Eiffel Tower official site",
    "sourceUrl": "https://www.toureiffel.paris/en"
  },
  "myths": [
    {
      "claim": "Parisians hated the tower and it was nearly demolished in 1909.",
      "verdict": "PARTLY TRUE",
      "evidence": "The 1887 artists’ protest letter is real, and the original concession ran only 20 years. But Parisians also queued in millions to climb it in 1889, and demolition was averted not by sentiment but by utility — the tower had become France’s key long-distance radio mast.",
      "sourceName": "Official site history; UNESCO site 600",
      "sourceUrl": "https://www.toureiffel.paris/en"
    },
    {
      "claim": "Gustave Eiffel designed the tower himself.",
      "verdict": "FALSE",
      "evidence": "The design came from two of his senior engineers, Maurice Koechlin and Émile Nouguier, with architect Stephen Sauvestre adding the decorative arches and silhouette. Eiffel bought their patent, championed the project and financed much of it — genius of promotion and engineering management, not sole authorship.",
      "sourceName": "Wikidata; Wikipedia — \"Eiffel Tower\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/Eiffel_Tower"
    },
    {
      "claim": "The tower grows taller in summer.",
      "verdict": "TRUE",
      "evidence": "Iron expands with heat: the tower’s height varies by roughly 15 cm between winter cold and summer sun, a figure the official site itself publishes.",
      "sourceName": "Eiffel Tower official site (rates & curiosities)",
      "sourceUrl": "https://www.toureiffel.paris/en"
    }
  ],
  "photoSpots": [
    {
      "name": "Champ de Mars lawns",
      "description": "The straight-on classic: the full tower rising over the gardens, as in Benh LIEU SONG’s public-domain hero photograph.",
      "mediaFileTitle": "Tour Eiffel Wikimedia Commons.jpg"
    },
    {
      "name": "From the construction years",
      "description": "Louis-Émile Durandelle photographed the tower rising in 1888 — the iron skeleton already complete to the second floor (public domain).",
      "mediaFileTitle": "Louis-Emile Durandelle, The Eiffel Tower - State of the Construction, 1888.jpg"
    }
  ],
  "faqs": [
    {
      "q": "How tall is the Eiffel Tower?",
      "a": "300 metres as built in 1889; 324 metres including later antennas at Wikidata’s survey, and 330 metres since a new antenna was installed in 2022. It was the tallest structure on Earth until New York’s Chrysler Building in 1930."
    },
    {
      "q": "Who designed the Eiffel Tower?",
      "a": "Engineers Maurice Koechlin and Émile Nouguier of Gustave Eiffel’s company, with architect Stephen Sauvestre. Eiffel bought the design rights and drove the project — the tower carries his name, not his sole authorship."
    },
    {
      "q": "Is the Eiffel Tower a UNESCO site?",
      "a": "Yes — it lies within \"Paris, Banks of the Seine\", inscribed on the World Heritage List in 1991 as site 600."
    },
    {
      "q": "Can you photograph the Eiffel Tower at night?",
      "a": "For personal use, yes. The sparkling night lighting is a copyrighted work in France, so commercial use of night photographs requires permission from the tower’s operating company — one reason this page uses daytime photography."
    },
    {
      "q": "How many visitors does the Eiffel Tower get?",
      "a": "Around seven million a year (Wikidata records 7,097,302) — the most-visited paid monument in the world."
    }
  ],
  "nearby": [
    {
      "name": "Notre-Dame Cathedral",
      "relation": "UNESCO-listed cathedral within the same Banks of the Seine site, across the historic centre",
      "lat": 48.853,
      "lng": 2.35,
      "url": "https://whc.unesco.org/en/list/600/",
      "urlLabel": "UNESCO listing"
    },
    {
      "name": "Les Invalides",
      "relation": "Napoleon’s tomb and army museum, a short walk from the tower",
      "lat": 48.855,
      "lng": 2.3125,
      "url": "https://www.musee-armee.fr/en/",
      "urlLabel": "Official museum site"
    }
  ],
  "media": [
    {
      "fileTitle": "Tour Eiffel Wikimedia Commons.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Tour_Eiffel_Wikimedia_Commons.jpg",
      "width": 2900,
      "height": 5367,
      "licence": "Public domain",
      "licenceUrl": "https://commons.wikimedia.org/wiki/Commons:Public_domain",
      "author": "Benh LIEU SONG",
      "attribution": "\"Tour Eiffel Wikimedia Commons.jpg\" by Benh LIEU SONG — public domain, via Wikimedia Commons",
      "role": "hero",
      "alt": "The Eiffel Tower seen from the Champ de Mars under a blue sky",
      "sortOrder": 1
    },
    {
      "fileTitle": "Tour eiffel at sunrise from the trocadero.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/a/af/Tour_eiffel_at_sunrise_from_the_trocadero.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Tour_eiffel_at_sunrise_from_the_trocadero.jpg",
      "width": 2336,
      "height": 3504,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Tristan Nitot",
      "attribution": "\"Tour eiffel at sunrise from the trocadero.jpg\" by Tristan Nitot — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "The Eiffel Tower at sunrise seen from the Trocadéro",
      "sortOrder": 2
    },
    {
      "fileTitle": "Louis-Emile Durandelle, The Eiffel Tower - State of the Construction, 1888.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/1/14/Louis-Emile_Durandelle%2C_The_Eiffel_Tower_-_State_of_the_Construction%2C_1888.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Louis-Emile_Durandelle,_The_Eiffel_Tower_-_State_of_the_Construction,_1888.jpg",
      "width": 3277,
      "height": 4169,
      "licence": "Public domain",
      "licenceUrl": "https://commons.wikimedia.org/wiki/Commons:Public_domain",
      "author": "Louis-Emile Durandelle",
      "attribution": "\"Louis-Emile Durandelle, The Eiffel Tower - State of the Construction, 1888.jpg\" by Louis-Emile Durandelle — public domain (Getty Open Content), via Wikimedia Commons",
      "role": "timeline",
      "alt": "The Eiffel Tower under construction in 1888, photographed by Louis-Emile Durandelle",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity, coordinates, height, designers, materials, official site, visitor count",
      "sourceName": "Wikidata — Q243 (Eiffel Tower)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q243",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status via \"Paris, Banks of the Seine\", site 600, inscribed 1991",
      "sourceName": "UNESCO World Heritage Centre — Paris, Banks of the Seine (site 600)",
      "sourceUrl": "https://whc.unesco.org/en/list/600/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Opening pattern, repainting cycle, height variation with temperature",
      "sourceName": "Eiffel Tower official site",
      "sourceUrl": "https://www.toureiffel.paris/en",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "All photographs: licence, author, dimensions",
      "sourceName": "Wikimedia Commons — imageinfo records (per-file links in the credits)",
      "sourceUrl": "https://commons.wikimedia.org/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Live weather and sun times at the site",
      "sourceName": "Open-Meteo API (forecast, at 48.858296, 2.294479)",
      "sourceUrl": "https://open-meteo.com/",
      "checkedAt": "2026-10-22"
    }
  ]
};

const PYRAMIDS_OF_GIZA: Wonder = {
  "slug": "pyramids-of-giza",
  "name": "Pyramids of Giza",
  "category": "Ancient Wonder of the World",
  "wikidataQid": "Q12508",
  "unescoId": 86,
  "unescoYear": 1979,
  "cityName": "Giza",
  "regionName": "Giza Governorate",
  "countryName": "Egypt",
  "lat": 29.976111,
  "lng": 31.132778,
  "timezone": "Africa/Cairo",
  "officialUrl": "https://egymonuments.com",
  "ticketUrl": null,
  "seoTitle": "Pyramids of Giza: Live Weather, Guide & Facts",
  "seoDescription": "Pyramids of Giza today: live plateau weather, visiting guide, UNESCO facts, credited photos and myth checks. Khufu, Khafre, Menkaure and the Great Sphinx.",
  "intro": [
    "The Giza pyramid complex is the last surviving wonder of the ancient world: three pyramid complexes built by the Fourth-Dynasty kings Khufu, Khafre and Menkaure around 2600–2500 BC, guarded by the Great Sphinx and ringed by queens’ pyramids, mastaba tombs, causeways and valley temples on the edge of the Sahara.",
    "UNESCO inscribed \"Memphis and its Necropolis — the Pyramid Fields from Giza to Dahshur\" as World Heritage Site 86 in 1979. The Great Pyramid of Khufu — 146.6 metres when new, 138.8 metres today — was the tallest human-made structure on Earth for more than 3,800 years, and its 2.3 million stone blocks still anchor arguments about exactly how Egypt did it.",
    "What is no longer argued: who did it. The excavated workers’ town, bakeries, breweries and the tombs of the builders themselves — plus the diary of an inspector named Merer, the oldest inscribed papyrus — document a paid, rotating Egyptian workforce, not the slave gangs of later legend (see Myth vs Fact below)."
  ],
  "facts": [
    {
      "label": "Built",
      "value": "Fourth Dynasty, c. 2600–2500 BC",
      "source": "UNESCO / Wikipedia"
    },
    {
      "label": "Great Pyramid height",
      "value": "146.6 m originally; 138.8 m today",
      "source": "Wikipedia"
    },
    {
      "label": "Great Pyramid blocks",
      "value": "About 2.3 million stone blocks",
      "source": "Wikipedia"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Within \"Memphis and its Necropolis\" — site 86 · inscribed 1979",
      "source": "UNESCO"
    },
    {
      "label": "Complex area",
      "value": "16,359 hectares (the wider necropolis zone)",
      "source": "Wikidata"
    },
    {
      "label": "Status",
      "value": "The only surviving Wonder of the Ancient World",
      "source": "UNESCO"
    },
    {
      "label": "Coordinates",
      "value": "29.9761° N, 31.1328° E",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "Each pyramid was the centre of a working complex: a valley temple at the Nile’s edge, a covered causeway rising to a mortuary temple against the pyramid’s east face, boat pits (Khufu’s two solar boats are among the oldest intact ships anywhere), and cemeteries where courtiers queued in stone for the same afterlife. The Great Sphinx — a lion’s body with a king’s head, carved from a single bedrock ridge — belongs to Khafre’s complex.",
      "The Great Pyramid’s precision is its own exhibit: its base is level to within about 2 cm, its sides aligned to true north within a few arc-minutes, and its internal architecture — the ascending Grand Gallery, the King’s Chamber in red granite from Aswan 800 km upriver — still surveyed and re-surveyed today. Casing stones of polished white Tura limestone once made all three pyramids shine; earthquakes and medieval Cairo’s builders stripped most of it, leaving the stepped cores seen now."
    ],
    "geniusPoints": [
      "Base of the Great Pyramid level to ~2 cm across 5.3 hectares — with 4,500-year-old tools",
      "Sides aligned to true cardinal north within a few minutes of arc",
      "A complete ritual landscape: valley temple, causeway, mortuary temple, boat pits and cemeteries in one plan",
      "The Great Sphinx carved from a single ridge of bedrock — the largest monolith statue of the ancient world"
    ],
    "dimensions": [
      {
        "label": "Great Pyramid (Khufu)",
        "value": "146.6 m original height; 230 m base side"
      },
      {
        "label": "Pyramid of Khafre",
        "value": "143.5 m original height — appears tallest, built on higher ground"
      },
      {
        "label": "Pyramid of Menkaure",
        "value": "65 m original height"
      },
      {
        "label": "Great Sphinx",
        "value": "73 m long, 20 m high"
      }
    ],
    "materials": [
      "Local limestone (cores)",
      "Tura limestone (casing)",
      "Aswan granite (chambers)",
      "Basalt and alabaster (temples)"
    ]
  },
  "timeline": [
    {
      "year": "c. 2580 BC",
      "title": "Khufu begins the Great Pyramid",
      "text": "Work starts on the largest pyramid ever built; the workforce town rises at the plateau’s edge to house the rotating crews."
    },
    {
      "year": "c. 2560 BC",
      "title": "Great Pyramid completed",
      "text": "Finished under Khufu at 146.6 m — it will remain the world’s tallest structure for over 3,800 years."
    },
    {
      "year": "c. 2530 BC",
      "title": "Khafre and the Sphinx",
      "text": "Khafre builds the second pyramid and the Great Sphinx; his valley temple still stands with its granite pillars and diorite statue."
    },
    {
      "year": "c. 2510 BC",
      "title": "Menkaure completes the trio",
      "text": "The third and smallest royal pyramid is finished, with its three queens’ pyramids beside it."
    },
    {
      "year": "1979",
      "title": "UNESCO World Heritage",
      "text": "The pyramid fields from Giza to Dahshur are inscribed as site 86, among the first listings in Africa."
    },
    {
      "year": "2013",
      "title": "The builder’s diary",
      "text": "The Wadi al-Jarf papyri — including Inspector Merer’s diary of hauling Tura limestone to Khufu’s pyramid — are published, the oldest inscribed papyri known."
    }
  ],
  "visitor": {
    "hoursText": "The Giza Plateau opens daily in the morning and closes before sunset; hours shift between the summer and winter seasons, and inner-pyramid entry is by separate ticket with limited daily numbers. Egypt’s Ministry of Tourism and Antiquities publishes the current schedule and prices.",
    "closedDays": "Open daily.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Most visitors enter through the gates by the Great Pyramid or the Sphinx-side entrance; the plateau is large and exposed — the live weather block on this page (heat, sun, wind-blown sand) is worth checking before you set out.",
    "lastVerified": "2026-10-22",
    "sourceName": "Egypt Ministry of Tourism & Antiquities — Egymonuments",
    "sourceUrl": "https://egymonuments.com"
  },
  "myths": [
    {
      "claim": "The pyramids were built by slave labour.",
      "verdict": "FALSE",
      "evidence": "Excavations at the Giza workers’ town found industrial bakeries, breweries and animal bones in quantities that fed thousands of paid workers, and the builders’ own tombs stand in the pyramids’ shadow — an honour no slave received. Egyptologists describe a rotating national workforce, fed and housed by the state.",
      "sourceName": "Egyptologists Mark Lehner & Zahi Hawass — Giza Plateau Mapping Project (see Wikipedia, \"Egyptian pyramid construction techniques\")",
      "sourceUrl": "https://en.wikipedia.org/wiki/Egyptian_pyramid_construction_techniques"
    },
    {
      "claim": "Aliens built the pyramids — Egyptians could not have cut and moved such stones.",
      "verdict": "FALSE",
      "evidence": "The construction record is Egyptian and paper-based: Inspector Merer’s diary (Wadi al-Jarf papyri) logs his crew hauling Tura limestone by boat to Khufu’s pyramid, and quarry marks, tools, ramps and unfinished stones document the methods on site.",
      "sourceName": "Wadi al-Jarf papyri (published 2013) — see Wikipedia, \"Wadi al-Jarf\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/Wadi_al-Jarf"
    },
    {
      "claim": "The Great Pyramid’s proportions deliberately encode π and the dimensions of the Earth.",
      "verdict": "PARTLY TRUE",
      "evidence": "The pyramid’s slope follows the Egyptian seked system (run per rise), which happens to produce a perimeter-to-height ratio close to 2π. Egyptologists treat the near-π value as a by-product of the chosen slope, not a coded constant — the Egyptians’ own π approximation is documented separately in the Rhind Papyrus.",
      "sourceName": "Egyptological consensus (see Wikipedia, \"Great Pyramid of Giza\", mathematical bases)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza"
    }
  ],
  "photoSpots": [
    {
      "name": "The plateau panorama point",
      "description": "The classic line-up of all three pyramids from the desert edge southwest of the complex — KennyOMG’s panorama on this page.",
      "mediaFileTitle": "Pyramids of the Giza Necropolis.jpg"
    },
    {
      "name": "Face to face with the Sphinx",
      "description": "Barcex’s photograph of the Great Sphinx, carved from one bedrock ridge in Khafre’s reign.",
      "mediaFileTitle": "Great Sphinx of Giza - 20080716a.jpg"
    },
    {
      "name": "Camels at rest below the pyramids",
      "description": "The working view of Giza — Caoimheen3’s shot of the camel lines resting between rides.",
      "mediaFileTitle": "Camels resting at the Pyramids of Giza.jpg"
    }
  ],
  "faqs": [
    {
      "q": "How old are the Pyramids of Giza?",
      "a": "About 4,500 years. The Great Pyramid of Khufu was completed around 2560 BC; Khafre’s and Menkaure’s pyramids followed within the Fourth Dynasty (c. 2600–2500 BC)."
    },
    {
      "q": "Who built the pyramids — slaves or workers?",
      "a": "Paid Egyptian workers in rotating crews. Their town, bakeries, breweries and tombs have been excavated at Giza, and a foreman’s diary (Merer’s papyrus) records the work directly."
    },
    {
      "q": "How tall is the Great Pyramid?",
      "a": "146.6 metres when completed — the tallest human-made structure for over 3,800 years. Erosion and the loss of its capstone and casing leave 138.8 metres today."
    },
    {
      "q": "Are the Pyramids of Giza a UNESCO site?",
      "a": "Yes — within \"Memphis and its Necropolis — the Pyramid Fields from Giza to Dahshur\", site 86, inscribed in 1979."
    },
    {
      "q": "Can you go inside the pyramids?",
      "a": "Limited numbers of visitors may enter the Great Pyramid and one of the others on rotation, on separate tickets sold at the plateau. Availability changes — check the Egymonuments platform on the day."
    }
  ],
  "nearby": [
    {
      "name": "Saqqara",
      "relation": "The older necropolis with Djoser’s Step Pyramid, in the same UNESCO listing",
      "lat": 29.871111,
      "lng": 31.216667,
      "url": "https://whc.unesco.org/en/list/86/",
      "urlLabel": "UNESCO listing"
    },
    {
      "name": "Grand Egyptian Museum",
      "relation": "The new national museum at the plateau’s edge, home to the full Tutankhamun collection",
      "lat": 29.994,
      "lng": 31.118,
      "url": "https://www.gem.eg/",
      "urlLabel": "Official museum site"
    }
  ],
  "media": [
    {
      "fileTitle": "Pyramids of the Giza Necropolis.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/9/96/Pyramids_of_the_Giza_Necropolis.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Pyramids_of_the_Giza_Necropolis.jpg",
      "width": 10104,
      "height": 4210,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "KennyOMG",
      "attribution": "\"Pyramids of the Giza Necropolis.jpg\" by KennyOMG — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "Panorama of the three Pyramids of Giza across the desert plateau",
      "sortOrder": 1
    },
    {
      "fileTitle": "Great Sphinx of Giza - 20080716a.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Great_Sphinx_of_Giza_-_20080716a.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Great_Sphinx_of_Giza_-_20080716a.jpg",
      "width": 3880,
      "height": 2580,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Barcex",
      "attribution": "\"Great Sphinx of Giza - 20080716a.jpg\" by Barcex — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "The Great Sphinx of Giza in profile against the desert sky",
      "sortOrder": 2
    },
    {
      "fileTitle": "Camels resting at the Pyramids of Giza.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/4/45/Camels_resting_at_the_Pyramids_of_Giza.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Camels_resting_at_the_Pyramids_of_Giza.jpg",
      "width": 4000,
      "height": 1800,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Caoimheen3",
      "attribution": "\"Camels resting at the Pyramids of Giza.jpg\" by Caoimheen3 — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Camels resting on the sand below the Pyramids of Giza",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity, coordinates, complex area",
      "sourceName": "Wikidata — Q12508 (Giza pyramid complex)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q12508",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status via \"Memphis and its Necropolis\", site 86, inscribed 1979",
      "sourceName": "UNESCO World Heritage Centre — Memphis and its Necropolis (site 86)",
      "sourceUrl": "https://whc.unesco.org/en/list/86/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Heights, block counts, construction dates, seked geometry",
      "sourceName": "Wikipedia — \"Giza pyramid complex\" / \"Great Pyramid of Giza\" (cross-checked)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Giza_pyramid_complex",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Paid-workforce evidence and Merer diary",
      "sourceName": "Wikipedia — \"Egyptian pyramid construction techniques\"; \"Wadi al-Jarf\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/Wadi_al-Jarf",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "All photographs: licence, author, dimensions",
      "sourceName": "Wikimedia Commons — imageinfo records (per-file links in the credits)",
      "sourceUrl": "https://commons.wikimedia.org/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Live weather and sun times at the site",
      "sourceName": "Open-Meteo API (forecast, at 29.976111, 31.132778)",
      "sourceUrl": "https://open-meteo.com/",
      "checkedAt": "2026-10-22"
    }
  ]
};

const BURJ_KHALIFA: Wonder = {
  "slug": "burj-khalifa",
  "name": "Burj Khalifa",
  "category": "Iconic Landmark — Tallest Building in the World",
  "wikidataQid": "Q12495",
  "unescoId": null,
  "unescoYear": null,
  "cityName": "Dubai",
  "regionName": "Downtown Dubai",
  "countryName": "United Arab Emirates",
  "lat": 25.197222,
  "lng": 55.274167,
  "timezone": "Asia/Dubai",
  "officialUrl": "http://www.burjkhalifa.ae",
  "ticketUrl": "https://tickets.atthetop.ae",
  "seoTitle": "Burj Khalifa: Live Weather, Guide, Facts & Records",
  "seoDescription": "Burj Khalifa today: live weather, observation-deck guide, records and credited photos. The world’s tallest building at 828 m, Downtown Dubai.",
  "intro": [
    "Burj Khalifa is a skyscraper in Downtown Dubai and, at 828 metres with 163 floors, the tallest building and the tallest free-standing structure ever built. Designed by Adrian Smith of Skidmore, Owings & Merrill, it rose between 2004 and 2009 and opened on 4 January 2010 — renamed at the last moment from Burj Dubai for Khalifa bin Zayed, ruler of Abu Dhabi, whose government had supported Dubai through the 2009 financial crisis.",
    "The tower’s plan is a three-lobed spiral drawn from the desert spider lily (Hymenocallis) and from Islamic geometry: a central core with three wings stepping back in a spiral, so the building narrows as it climbs and the wind is \"confused\" rather than organised into dangerous vortices. It anchors a downtown of superlatives — the Dubai Mall, the Dubai Fountain on its own lake, and an observation deck programme, At The Top, on levels 124, 125 and 148.",
    "Burj Khalifa is not a UNESCO site — it is younger than some of its visitors’ phones — but it already holds a shelf of world records beyond height: tallest free-standing structure, highest occupied floor, highest observation deck, highest restaurant. The live block on this page samples weather at its coordinates; at 828 m, the summit lives in different weather from the street, and the tower’s tip can be in cloud while Downtown bakes."
  ],
  "facts": [
    {
      "label": "Height",
      "value": "828 m — the tallest building in the world",
      "source": "Wikidata"
    },
    {
      "label": "Floors",
      "value": "163",
      "source": "Wikipedia"
    },
    {
      "label": "Built",
      "value": "2004–2009; opened 4 January 2010",
      "source": "Wikidata / Wikipedia"
    },
    {
      "label": "Architect",
      "value": "Adrian Smith (Skidmore, Owings & Merrill)",
      "source": "Wikidata"
    },
    {
      "label": "Materials",
      "value": "Reinforced concrete, steel, glass, aluminium",
      "source": "Wikidata"
    },
    {
      "label": "Observation decks",
      "value": "At The Top — levels 124, 125 and 148 (555 m)",
      "source": "Official site"
    },
    {
      "label": "Coordinates",
      "value": "25.1972° N, 55.2742° E",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "The structural trick is the buttressed core: a hexagonal concrete hub braced by three wings, each wing buttressing the other two — a Y-plan that resists torsion and lets the tower keep a residential-friendly floor plate all the way up. The setbacks spiral in one rotational direction, terraces stepping back 27 times, so the profile sheds wind instead of fighting it; wind-tunnel testing reshaped the design repeatedly.",
      "Below the spire it is a vertical city: the Armani Hotel in the lower floors, residences to level 108, offices above, the At.mosphere restaurant on level 122 and observation decks at 124–125 and 148. Some 57 elevators serve it, the fastest travelling at up to 10 m/s, and the building’s condensation collection system harvests the equivalent of Olympic pools of water a year from Dubai’s humid air for irrigating the surrounding park."
    ],
    "geniusPoints": [
      "Buttressed-core Y-plan: three wings brace each other around a hexagonal hub",
      "27 spiralling setbacks \"confuse\" the wind and stop vortices organising (SOM design)",
      "Height kept secret through construction so no rival could target the record",
      "Condensate harvesting: the cooling system’s water irrigates Burj Park"
    ],
    "dimensions": [
      {
        "label": "Height to tip",
        "value": "828 m"
      },
      {
        "label": "Height to roof",
        "value": "739.4 m (before the spire)"
      },
      {
        "label": "Highest observation deck",
        "value": "Level 148 — 555 m"
      },
      {
        "label": "Floors",
        "value": "163 above ground"
      }
    ],
    "materials": [
      "Reinforced concrete",
      "Steel",
      "Glass",
      "Aluminium"
    ]
  },
  "timeline": [
    {
      "year": "2004",
      "title": "Ground broken",
      "text": "Excavation begins in January 2004 on the Downtown Dubai site, to a design by Adrian Smith at SOM."
    },
    {
      "year": "2007",
      "title": "Tallest building on Earth",
      "text": "The rising tower passes Taipei 101 (508 m) in July 2007, with its final height still unannounced."
    },
    {
      "year": "2009",
      "title": "Topped out",
      "text": "The structure reaches its full 828 m in January 2009; exterior cladding completes that October."
    },
    {
      "year": "2010",
      "title": "Opened as Burj Khalifa",
      "text": "Inaugurated on 4 January 2010 and renamed at the ceremony for Sheikh Khalifa of Abu Dhabi."
    },
    {
      "year": "2014",
      "title": "Highest deck opens",
      "text": "At The Top SKY on level 148 (555 m) opens as the world’s highest observation deck."
    }
  ],
  "visitor": {
    "hoursText": "The At The Top observation decks open daily from the morning to late evening; sunset (\"prime\") hours carry different prices and sell out first. The operator publishes the current schedule and dynamic prices on the official ticket site — nothing about deck pricing is fixed enough to print here honestly.",
    "closedDays": "Open daily.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Entry is through the Dubai Mall (lower ground floor, At The Top entrance) — not through the tower’s own doors. Timed tickets are scanned at the mall entrance; allow time for security and the exhibition corridor before the lifts.",
    "lastVerified": "2026-10-22",
    "sourceName": "Burj Khalifa official site / At The Top",
    "sourceUrl": "https://www.burjkhalifa.ae"
  },
  "myths": [
    {
      "claim": "People on the top floors must break their Ramadan fast later than people at the bottom.",
      "verdict": "TRUE",
      "evidence": "The sun genuinely sets minutes later at 828 m. Dubai’s Islamic affairs authorities issued guidance that Burj Khalifa residents above roughly the 80th floor should delay breaking their fast by about two minutes, and those above the 150th by three — one of the few building myths that is documented fact.",
      "sourceName": "Dubai Islamic Affairs guidance, widely reported (see Wikipedia, \"Burj Khalifa\")",
      "sourceUrl": "https://en.wikipedia.org/wiki/Burj_Khalifa"
    },
    {
      "claim": "Burj Khalifa can be seen from 95 km away.",
      "verdict": "PARTLY TRUE",
      "evidence": "On exceptionally clear days the silhouette is reported visible from around 95 km — a figure the developer itself has used — but ordinary haze cuts practical visibility to a fraction of that. Treat 95 km as a best-case record, not a promise.",
      "sourceName": "Emaar statements / Wikipedia — \"Burj Khalifa\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/Burj_Khalifa"
    }
  ],
  "photoSpots": [
    {
      "name": "The Dubai Fountain lake",
      "description": "The tower reflected over its own lake at nightfall — Aleksandar Pasaric’s CC0 photograph from the water.",
      "mediaFileTitle": "Boat on the Burj Khalifa Lake at night.jpg"
    },
    {
      "name": "The Downtown skyline",
      "description": "Tim Reckmann’s cropped skyline — the spire standing clear of every neighbour, the honest scale of 828 m.",
      "mediaFileTitle": "Dubai skyline 2015 (crop).jpg"
    }
  ],
  "faqs": [
    {
      "q": "How tall is Burj Khalifa?",
      "a": "828 metres to the tip, with 163 floors — the tallest building and tallest free-standing structure in the world since it topped out in 2009."
    },
    {
      "q": "Who designed Burj Khalifa?",
      "a": "Adrian Smith, then of Skidmore, Owings & Merrill, with SOM as architect and engineer of record. The Y-shaped buttressed-core plan is derived from the spider lily and Islamic spiral geometry."
    },
    {
      "q": "Why was it renamed from Burj Dubai?",
      "a": "At the January 2010 opening it was renamed for Sheikh Khalifa bin Zayed of Abu Dhabi, in recognition of Abu Dhabi’s financial support to Dubai during the 2009 crisis."
    },
    {
      "q": "How do you visit the observation decks?",
      "a": "Through the At The Top entrance inside the Dubai Mall (lower ground floor), on timed tickets bought from the official ticket site. Levels 124–125 are the standard decks; level 148 (555 m) is the premium SKY deck."
    },
    {
      "q": "Is Burj Khalifa a UNESCO World Heritage Site?",
      "a": "No. Opened in 2010, it is a modern record-holder, not a heritage listing — this page records its UNESCO fields as none rather than borrowing a status it does not hold."
    }
  ],
  "nearby": [
    {
      "name": "Dubai Mall",
      "relation": "The tower’s own complex — and the entrance to its observation decks",
      "lat": 25.195278,
      "lng": 55.279444,
      "url": "https://thedubaimall.com",
      "urlLabel": "Official site"
    },
    {
      "name": "Dubai Fountain",
      "relation": "The choreographed fountain on Burj Lake at the tower’s feet",
      "lat": 25.195,
      "lng": 55.2756,
      "url": "https://www.burjkhalifa.ae",
      "urlLabel": "Official site"
    }
  ],
  "media": [
    {
      "fileTitle": "Dubai skyline 2015 (crop).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/4/43/Dubai_skyline_2015_%28crop%29.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Dubai_skyline_2015_(crop).jpg",
      "width": 1558,
      "height": 1179,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Tim Reckmann",
      "attribution": "\"Dubai skyline 2015 (crop).jpg\" by Tim Reckmann — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "Burj Khalifa rising far above the Downtown Dubai skyline",
      "sortOrder": 1
    },
    {
      "fileTitle": "Boat on the Burj Khalifa Lake at night.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Boat_on_the_Burj_Khalifa_Lake_at_night.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Boat_on_the_Burj_Khalifa_Lake_at_night.jpg",
      "width": 5472,
      "height": 3648,
      "licence": "CC0",
      "licenceUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "author": "Aleksandar Pasaric",
      "attribution": "\"Boat on the Burj Khalifa Lake at night.jpg\" by Aleksandar Pasaric — CC0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "A boat on Burj Khalifa Lake at night with the illuminated tower behind",
      "sortOrder": 2
    }
  ],
  "sources": [
    {
      "claim": "Identity, coordinates, height, architect, materials, official site",
      "sourceName": "Wikidata — Q12495 (Burj Khalifa)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q12495",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Floors, opening date and renaming, Ramadan guidance, visibility reports",
      "sourceName": "Wikipedia — \"Burj Khalifa\" (cross-checked)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Burj_Khalifa",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Observation deck levels and entry route",
      "sourceName": "Burj Khalifa official site / At The Top",
      "sourceUrl": "https://www.burjkhalifa.ae",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "All photographs: licence, author, dimensions",
      "sourceName": "Wikimedia Commons — imageinfo records (per-file links in the credits)",
      "sourceUrl": "https://commons.wikimedia.org/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Live weather and sun times at the site",
      "sourceName": "Open-Meteo API (forecast, at 25.197222, 55.274167)",
      "sourceUrl": "https://open-meteo.com/",
      "checkedAt": "2026-10-22"
    }
  ]
};

const CHRIST_THE_REDEEMER: Wonder = {
  "slug": "christ-the-redeemer",
  "name": "Christ the Redeemer",
  "category": "New7Wonders of the World",
  "wikidataQid": "Q79961",
  "unescoId": 1100,
  "unescoYear": 2012,
  "cityName": "Rio de Janeiro",
  "regionName": "Rio de Janeiro (state)",
  "countryName": "Brazil",
  "lat": -22.951916,
  "lng": -43.210464,
  "timezone": "America/Sao_Paulo",
  "officialUrl": "http://www.corcovado.com.br/",
  "ticketUrl": null,
  "seoTitle": "Christ the Redeemer: Live Weather, Guide & Facts",
  "seoDescription": "Christ the Redeemer today: live Corcovado weather, visiting guide, UNESCO Rio facts and credited photos. The 38 m Art Deco statue above Rio de Janeiro.",
  "intro": [
    "Christ the Redeemer (Cristo Redentor) is a colossal Art Deco statue of Jesus standing 709 metres up Corcovado mountain, arms open over Rio de Janeiro. The statue itself is 30 metres tall on an 8-metre pedestal, with an arm span of 28 metres, built of reinforced concrete and clad in six million soapstone tiles applied by hand.",
    "It was designed by Brazilian engineer Heitor da Silva Costa with French sculptor Paul Landowski, funded overwhelmingly by donations from Brazilian Catholics, built in Brazil between 1922 and 1931, and inaugurated on 12 October 1931. In 2007 it was voted one of the New7Wonders of the World; in 2012 UNESCO inscribed the Carioca Landscapes between the Mountain and the Sea (site 1100), the listing that frames the statue’s mountain setting.",
    "Corcovado’s summit makes its own weather — the statue disappears into cloud while the beaches below sit in sun — so the live block on this page, sampled at the statue’s coordinates, is the first thing to check before buying a train ticket up."
  ],
  "facts": [
    {
      "label": "Inaugurated",
      "value": "12 October 1931",
      "source": "Wikipedia"
    },
    {
      "label": "Height",
      "value": "30 m statue on an 8 m pedestal (38 m total); arms span 28 m",
      "source": "Wikidata / Wikipedia"
    },
    {
      "label": "Designers",
      "value": "Heitor da Silva Costa (engineer) with Paul Landowski (sculptor)",
      "source": "Wikidata"
    },
    {
      "label": "Materials",
      "value": "Reinforced concrete clad in soapstone tiles",
      "source": "Wikidata"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Within \"Rio de Janeiro: Carioca Landscapes\" — site 1100 · inscribed 2012",
      "source": "UNESCO"
    },
    {
      "label": "Summit elevation",
      "value": "Corcovado, 709 m above the city",
      "source": "Wikipedia"
    },
    {
      "label": "Coordinates",
      "value": "22.9519° S, 43.2105° W",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "The statue is an engineering sandwich: a reinforced-concrete frame designed by Heitor da Silva Costa (with French engineer Albert Caquot consulting), modelled at full scale from Paul Landowski’s Paris-made studies, and skinned in a mosaic of triangular soapstone tiles — chosen because the stone resists Rio’s weather and can be replaced tile by tile. Women volunteers famously applied much of the tiling, gluing stones to cloth sheets in numbered sections.",
      "Inside, a narrow shaft of stairs and passages climbs to the head and arms for the restorers who keep the lightning-scarred surface whole; the statue is struck by lightning several times a year, and a 2014 strike that sheared a fingertip was repaired with stone from the original quarry. The platform at its feet is the real destination for most visitors — the view takes in Sugarloaf, Guanabara Bay, the Maracanã and both beach arcs of the city."
    ],
    "geniusPoints": [
      "Six million hand-applied soapstone tiles as a renewable skin over a concrete frame",
      "Built on a 709 m granite summit with materials hauled up the cog railway",
      "Designed across two continents: modelled in Paris, engineered and built in Brazil",
      "A lightning rod problem by design — the raised arms draw strikes, and repairs are a standing ritual"
    ],
    "dimensions": [
      {
        "label": "Statue height",
        "value": "30 m"
      },
      {
        "label": "Pedestal",
        "value": "8 m (38 m overall)"
      },
      {
        "label": "Arm span",
        "value": "28 m"
      },
      {
        "label": "Weight",
        "value": "About 635 tonnes"
      }
    ],
    "materials": [
      "Reinforced concrete",
      "Soapstone (tile cladding)"
    ]
  },
  "timeline": [
    {
      "year": "1922",
      "title": "Construction begins",
      "text": "The foundation stone is laid in the centenary year of Brazilian independence; fundraising among Brazil’s Catholics pays for the work."
    },
    {
      "year": "1931",
      "title": "Inaugurated",
      "text": "Christ the Redeemer is inaugurated on 12 October 1931, its floodlights switched on remotely from Rome for the ceremony."
    },
    {
      "year": "2007",
      "title": "New7Wonders",
      "text": "Named one of the New7Wonders of the World in the global vote of 7 July 2007."
    },
    {
      "year": "2012",
      "title": "UNESCO listing",
      "text": "The Carioca Landscapes between the Mountain and the Sea — the statue’s setting — becomes World Heritage Site 1100."
    },
    {
      "year": "2014",
      "title": "Lightning repair",
      "text": "A January storm strike damages a finger; restorers repair it with soapstone from the original quarry during a major restoration."
    }
  ],
  "visitor": {
    "hoursText": "Access is by the Corcovado cog train from Cosme Velho or by official vans from visitor centres (Paineiras, Largo do Machado, Copacabana), running daily from the morning; the plaza closes in the evening and the summit closes entirely in dangerous weather. Operators publish the day’s times; summit cloud — shown in this page’s live block — is the usual reason to delay a trip.",
    "closedDays": "Open daily, weather permitting.",
    "fees": null,
    "feesNote": null,
    "gatesText": "There is no public road to the summit for private cars: train or official van tickets include the ascent. Buy through the official operators to avoid the informal sellers at the Cosme Velho station.",
    "lastVerified": "2026-10-22",
    "sourceName": "Corcovado official site (Trem do Corcovado)",
    "sourceUrl": "http://www.corcovado.com.br/"
  },
  "myths": [
    {
      "claim": "The statue was a gift from France.",
      "verdict": "PARTLY TRUE",
      "evidence": "The design has French fingerprints — sculptor Paul Landowski modelled it and parts were fabricated in France — but it was conceived in Brazil, engineered by Heitor da Silva Costa, built in Brazil and paid for by donations from Brazilian Catholics. A Brazilian project with French collaborators, not a gift.",
      "sourceName": "Wikipedia — \"Christ the Redeemer (statue)\"",
      "sourceUrl": "https://en.wikipedia.org/wiki/Christ_the_Redeemer_(statue)"
    },
    {
      "claim": "Lightning never dares strike the statue.",
      "verdict": "FALSE",
      "evidence": "Corcovado’s summit is struck repeatedly — several times a year by most counts. A January 2014 strike broke the tip of a finger on the right hand, and restorers periodically replace damaged soapstone tiles and maintain the lightning-protection system.",
      "sourceName": "2014 restoration reports (see Wikipedia, \"Christ the Redeemer (statue)\")",
      "sourceUrl": "https://en.wikipedia.org/wiki/Christ_the_Redeemer_(statue)"
    }
  ],
  "photoSpots": [
    {
      "name": "Face-on from the plaza",
      "description": "Arne Müseler’s portrait of the statue against the sky — the soapstone mosaic visible tile by tile.",
      "mediaFileTitle": "Christ the Redeemer - Cristo Redentor.jpg"
    },
    {
      "name": "The moon alignment",
      "description": "Donatas Dabravolskas’ \"Unique Moment\" — the full moon resting in the statue’s hands, a shot photographers plan months ahead.",
      "mediaFileTitle": "Unique Moment with the Moon and Christ the Redeemer 3.jpg"
    }
  ],
  "faqs": [
    {
      "q": "How tall is Christ the Redeemer?",
      "a": "The statue is 30 metres tall on an 8-metre pedestal — 38 metres overall — with an arm span of 28 metres, standing on the 709-metre summit of Corcovado."
    },
    {
      "q": "Who built Christ the Redeemer, and who paid?",
      "a": "Brazilian engineer Heitor da Silva Costa designed it with French sculptor Paul Landowski; it was built in Brazil (1922–1931) and funded mainly by donations from Brazilian Catholics."
    },
    {
      "q": "Is Christ the Redeemer a UNESCO site?",
      "a": "Its setting is: the statue stands within \"Rio de Janeiro: Carioca Landscapes between the Mountain and the Sea\", World Heritage Site 1100, inscribed in 2012. The statue itself was named a New7Wonder in 2007."
    },
    {
      "q": "How do you get to Christ the Redeemer?",
      "a": "By the Corcovado cog train from Cosme Velho station or official vans from the Paineiras visitor centre and other city points. There is no private-car access to the summit."
    },
    {
      "q": "Does lightning really strike the statue?",
      "a": "Yes, several times a year — its raised position on a granite summit makes it a natural target. A 2014 strike damaged a fingertip, repaired in a major restoration."
    }
  ],
  "nearby": [
    {
      "name": "Sugarloaf Mountain",
      "relation": "The other great granite summit of the Carioca Landscapes listing, across Guanabara Bay",
      "lat": -22.948611,
      "lng": -43.156667,
      "url": "https://whc.unesco.org/en/list/1100/",
      "urlLabel": "UNESCO listing"
    },
    {
      "name": "Tijuca Forest",
      "relation": "The hand-planted urban forest surrounding Corcovado, part of the same national park",
      "lat": -22.959,
      "lng": -43.278,
      "url": "https://whc.unesco.org/en/list/1100/",
      "urlLabel": "UNESCO listing"
    }
  ],
  "media": [
    {
      "fileTitle": "Christ the Redeemer - Cristo Redentor.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Christ_the_Redeemer_-_Cristo_Redentor.jpg",
      "width": 2497,
      "height": 3744,
      "licence": "CC BY-SA 3.0 de",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en",
      "author": "Arne Müseler",
      "attribution": "\"Christ the Redeemer - Cristo Redentor.jpg\" by Arne Müseler — CC BY-SA 3.0 de, via Wikimedia Commons",
      "role": "hero",
      "alt": "Christ the Redeemer with arms outstretched against a clear sky",
      "sortOrder": 1
    },
    {
      "fileTitle": "Unique Moment with the Moon and Christ the Redeemer 3.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Unique_Moment_with_the_Moon_and_Christ_the_Redeemer_3.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Unique_Moment_with_the_Moon_and_Christ_the_Redeemer_3.jpg",
      "width": 3450,
      "height": 2300,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Donatas Dabravolskas",
      "attribution": "\"Unique Moment with the Moon and Christ the Redeemer 3.jpg\" by Donatas Dabravolskas — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "The full moon aligned between the hands of Christ the Redeemer",
      "sortOrder": 2
    }
  ],
  "sources": [
    {
      "claim": "Identity, coordinates, height, designers, materials, official site",
      "sourceName": "Wikidata — Q79961 (Christ the Redeemer)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q79961",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status via \"Carioca Landscapes\", site 1100, inscribed 2012",
      "sourceName": "UNESCO World Heritage Centre — Rio de Janeiro: Carioca Landscapes (site 1100)",
      "sourceUrl": "https://whc.unesco.org/en/list/1100/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Inauguration, funding, lightning strikes and repairs",
      "sourceName": "Wikipedia — \"Christ the Redeemer (statue)\" (cross-checked)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Christ_the_Redeemer_(statue)",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "All photographs: licence, author, dimensions",
      "sourceName": "Wikimedia Commons — imageinfo records (per-file links in the credits)",
      "sourceUrl": "https://commons.wikimedia.org/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Live weather and sun times at the site",
      "sourceName": "Open-Meteo API (forecast, at -22.951916, -43.210464)",
      "sourceUrl": "https://open-meteo.com/",
      "checkedAt": "2026-10-22"
    }
  ]
};

const COLOSSEUM: Wonder = {
  "slug": "colosseum",
  "name": "Colosseum",
  "category": "New7Wonders of the World",
  "wikidataQid": "Q10285",
  "unescoId": 91,
  "unescoYear": 1980,
  "cityName": "Rome",
  "regionName": "Lazio",
  "countryName": "Italy",
  "lat": 41.890278,
  "lng": 12.492222,
  "timezone": "Europe/Rome",
  "officialUrl": "https://colosseo.it/area/colosseo/",
  "ticketUrl": "https://ticketing.colosseo.it",
  "seoTitle": "Colosseum: Live Weather, Guide, Facts & Myths",
  "seoDescription": "Colosseum today: live weather, visiting guide, UNESCO Rome facts, credited photos and myth checks. The Flavian Amphitheatre, icon of imperial Rome.",
  "intro": [
    "The Colosseum — the Flavian Amphitheatre — is the largest ancient amphitheatre ever built: an elliptical arena of travertine, tuff and brick-faced concrete, 189 by 156 metres and 48 metres high, opened by the emperor Titus in AD 80 after eight years of construction begun under his father Vespasian. It held around 50,000 spectators for gladiatorial contests, wild-beast hunts, dramas and, in its first days, even staged sea battles.",
    "Rome’s emperors built it as a gift to the Roman people on the grounds of Nero’s hated palace — the Colossus statue next door gave it the name it still carries. Earthquakes and stone-robbers took the southern outer ring and much of its marble seat-rows, yet it remains the standing symbol of imperial Rome, inside UNESCO’s Historic Centre of Rome listing (site 91, inscribed 1980), and one of the New7Wonders of the World since 2007.",
    "Italy’s most visited monument draws over seven million visitors a year (Wikidata records 7.4 million). The live block on this page samples the weather above the arena — in summer the stone bowl is a furnace by midday, which is precisely the kind of fact that should decide a visit’s timing."
  ],
  "facts": [
    {
      "label": "Built",
      "value": "AD 72–80, under Vespasian and Titus",
      "source": "UNESCO / Wikipedia"
    },
    {
      "label": "Dimensions",
      "value": "189 m × 156 m ellipse; 48 m high",
      "source": "Wikidata / Wikipedia"
    },
    {
      "label": "Capacity",
      "value": "Around 50,000 spectators (modern estimates)",
      "source": "Wikipedia"
    },
    {
      "label": "Materials",
      "value": "Travertine limestone, tuff, brick-faced concrete",
      "source": "Wikidata"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Within \"Historic Centre of Rome\" — site 91 · inscribed 1980",
      "source": "UNESCO"
    },
    {
      "label": "Visitors",
      "value": "About 7.4 million a year",
      "source": "Wikidata"
    },
    {
      "label": "Coordinates",
      "value": "41.8903° N, 12.4922° E",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "The Colosseum is Roman engineering at exhibition scale: 80 arched entrances (76 numbered for the public, so a ticketed crowd could fill 50,000 seats in minutes), a radial system of barrel-vaulted corridors sorting spectators by rank, and a cavea of marble seats rising in strict social order from senators at the arena edge to the poor at the top. Retractable awnings — the velarium — were rigged by sailors of the imperial fleet to shade the crowd.",
      "Below the arena floor, added under Domitian, ran the hypogeum: two levels of cages, lifts and trapdoors that could raise beasts and scenery into the arena in seconds — its maze of walls still exposed today. Around the building, the surviving travertine facade shows the classical orders stacked Doric, Ionic, Corinthian — a textbook Renaissance architects copied for centuries."
    ],
    "geniusPoints": [
      "80 entrances and a vaulted circulation system that could seat 50,000 people in minutes",
      "The hypogeum’s lifts and trapdoors — stage machinery that made animals \"appear\" in the arena",
      "The velarium: a stadium roof rigged by navy sailors, 1,900 years before retractable roofs",
      "Three classical orders stacked on one facade — the template for Renaissance palazzi"
    ],
    "dimensions": [
      {
        "label": "Outer ellipse",
        "value": "189 m × 156 m"
      },
      {
        "label": "Height",
        "value": "48 m"
      },
      {
        "label": "Arena floor",
        "value": "83 m × 48 m"
      },
      {
        "label": "Capacity",
        "value": "≈50,000 (modern estimates)"
      }
    ],
    "materials": [
      "Travertine limestone",
      "Tuff",
      "Brick-faced concrete",
      "Marble (seating, largely robbed out)"
    ]
  },
  "timeline": [
    {
      "year": "AD 72",
      "title": "Construction begins",
      "text": "Vespasian starts the amphitheatre on the lake of Nero’s Domus Aurea — a public gift on a tyrant’s private ground."
    },
    {
      "year": "AD 80",
      "title": "Opened by Titus",
      "text": "Titus inaugurates the amphitheatre with 100 days of games; the earliest spectacles may have included naval battles in a flooded arena."
    },
    {
      "year": "AD 82",
      "title": "Completed under Domitian",
      "text": "Domitian adds the top gallery and the hypogeum — the underground stage machinery beneath the arena floor."
    },
    {
      "year": "1349",
      "title": "Earthquake",
      "text": "A major quake brings down the southern outer ring; its travertine becomes a quarry for Renaissance Rome."
    },
    {
      "year": "1980",
      "title": "UNESCO World Heritage",
      "text": "Included in the Historic Centre of Rome listing, site 91."
    },
    {
      "year": "2007",
      "title": "New7Wonders",
      "text": "Named one of the New7Wonders of the World in the global vote of 7 July 2007."
    }
  ],
  "visitor": {
    "hoursText": "The Colosseum opens daily from the morning; closing follows the sunset through the seasons, and the last entry is one hour before closing. It closes on 25 December and 1 January. The official park site (colosseo.it) publishes the current timetable and timed-entry tickets — timed booking is effectively mandatory in season.",
    "closedDays": "25 December and 1 January.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Entry is by timed slot bought through the official ticketing site; the ticket typically covers the Roman Forum and Palatine Hill within 24 hours. Entrances face the Arch of Constantine side; security screening queues build from mid-morning.",
    "lastVerified": "2026-10-22",
    "sourceName": "Parco archeologico del Colosseo — official site",
    "sourceUrl": "https://colosseo.it/area/colosseo/"
  },
  "myths": [
    {
      "claim": "Every gladiator fight ended with a man dead — \"thumbs down\" meant kill him.",
      "verdict": "FALSE",
      "evidence": "Gladiators were expensive trained assets; most bouts did not end in death, and a defeated fighter who had fought well was commonly spared (missio). Historians also note the thumb gestures are poorly attested — the fatal signal may have been a thumb turned toward the throat, and \"thumbs down\" may have meant \"drop the sword\" (spare him).",
      "sourceName": "Historians’ consensus (see Wikipedia, \"Gladiator\", and \"Pollice verso\")",
      "sourceUrl": "https://en.wikipedia.org/wiki/Gladiator"
    },
    {
      "claim": "Christians were martyred in the Colosseum.",
      "verdict": "FALSE",
      "evidence": "No ancient source records Christian executions in the Colosseum; the tradition grew in later centuries (some Christians were certainly killed in other Roman venues, and possibly here among general spectacles, but there is no evidence for the famous claim). The association is a post-antique tradition, not documented history.",
      "sourceName": "Historians’ consensus (see Wikipedia, \"Colosseum\", Christian tradition)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Colosseum"
    },
    {
      "claim": "The Colosseum was flooded to stage sea battles.",
      "verdict": "TRUE",
      "evidence": "Cassius Dio and Suetonius record naumachiae — naval spectacles — in the amphitheatre’s earliest years, before Domitian built the hypogeum under the arena floor; the basin could be filled from the aqueduct supply and drained rapidly.",
      "sourceName": "Cassius Dio; Suetonius (see Wikipedia, \"Naumachia\")",
      "sourceUrl": "https://en.wikipedia.org/wiki/Naumachia"
    }
  ],
  "photoSpots": [
    {
      "name": "The full facade",
      "description": "FeaturedPics’ 2020 panorama — all four storeys of the surviving northern wall, Doric to Corinthian.",
      "mediaFileTitle": "Colosseo 2020.jpg"
    },
    {
      "name": "Into the hypogeum",
      "description": "Daryl Mitchell’s interior view across the exposed underground maze where beasts and gladiators waited.",
      "mediaFileTitle": "Colosseum Interior 1 (15005911295).jpg"
    }
  ],
  "faqs": [
    {
      "q": "How old is the Colosseum?",
      "a": "Construction began under Vespasian in AD 72 and Titus opened it in AD 80 — roughly 1,950 years ago. Domitian completed the upper gallery and the hypogeum by AD 82."
    },
    {
      "q": "How many people could the Colosseum hold?",
      "a": "Modern estimates put capacity at around 50,000 spectators, sorted by rank through 76 numbered public entrances plus four ceremonial gates."
    },
    {
      "q": "Were Christians fed to lions in the Colosseum?",
      "a": "There is no ancient evidence for Christian martyrdoms in the Colosseum specifically. The tradition arose centuries later; historians treat the famous claim as unproven."
    },
    {
      "q": "Is the Colosseum a UNESCO site?",
      "a": "Yes — it stands within the \"Historic Centre of Rome\" World Heritage listing, site 91, inscribed in 1980. It was also voted a New7Wonder in 2007."
    },
    {
      "q": "Can you visit the underground hypogeum and arena floor?",
      "a": "Yes, on specific ticket types sold through the official ticketing site — the arena-floor and underground experiences are separate timed products and sell out well ahead in season."
    }
  ],
  "nearby": [
    {
      "name": "Roman Forum",
      "relation": "The civic heart of ancient Rome, included on the same park ticket",
      "lat": 41.892222,
      "lng": 12.485278,
      "url": "https://whc.unesco.org/en/list/91/",
      "urlLabel": "UNESCO listing"
    },
    {
      "name": "Arch of Constantine",
      "relation": "Rome’s largest triumphal arch, standing beside the Colosseum since AD 315",
      "lat": 41.889722,
      "lng": 12.490833,
      "url": "https://whc.unesco.org/en/list/91/",
      "urlLabel": "UNESCO listing"
    }
  ],
  "media": [
    {
      "fileTitle": "Colosseo 2020.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/d/de/Colosseo_2020.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Colosseo_2020.jpg",
      "width": 12051,
      "height": 8442,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "FeaturedPics",
      "attribution": "\"Colosseo 2020.jpg\" by FeaturedPics — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "The Colosseum’s travertine facade with its stacked classical orders",
      "sortOrder": 1
    },
    {
      "fileTitle": "Colosseum Interior 1 (15005911295).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/3/39/Colosseum_Interior_1_%2815005911295%29.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Colosseum_Interior_1_(15005911295).jpg",
      "width": 4000,
      "height": 3000,
      "licence": "CC BY-SA 2.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "author": "daryl_mitchell",
      "attribution": "\"Colosseum Interior 1 (15005911295).jpg\" by daryl_mitchell — CC BY-SA 2.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Inside the Colosseum, looking across the exposed hypogeum walls",
      "sortOrder": 2
    }
  ],
  "sources": [
    {
      "claim": "Identity, coordinates, height, materials, official site, visitor count",
      "sourceName": "Wikidata — Q10285 (Colosseum)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q10285",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status via \"Historic Centre of Rome\", site 91, inscribed 1980",
      "sourceName": "UNESCO World Heritage Centre — Historic Centre of Rome (site 91)",
      "sourceUrl": "https://whc.unesco.org/en/list/91/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Construction dates, capacity, hypogeum, velarium, naumachiae",
      "sourceName": "Wikipedia — \"Colosseum\" / \"Naumachia\" (cross-checked)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Colosseum",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "All photographs: licence, author, dimensions",
      "sourceName": "Wikimedia Commons — imageinfo records (per-file links in the credits)",
      "sourceUrl": "https://commons.wikimedia.org/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Live weather and sun times at the site",
      "sourceName": "Open-Meteo API (forecast, at 41.890278, 12.492222)",
      "sourceUrl": "https://open-meteo.com/",
      "checkedAt": "2026-10-22"
    }
  ]
};

const MACHU_PICCHU: Wonder = {
  "slug": "machu-picchu",
  "name": "Machu Picchu",
  "category": "New7Wonders of the World",
  "wikidataQid": "Q676203",
  "unescoId": 274,
  "unescoYear": 1983,
  "cityName": "Machupicchu District",
  "regionName": "Cusco Region",
  "countryName": "Peru",
  "lat": -13.163333,
  "lng": -72.545556,
  "timezone": "America/Lima",
  "officialUrl": "http://www.machupicchu.gob.pe/",
  "ticketUrl": null,
  "seoTitle": "Machu Picchu: Live Weather, Guide, Facts & Myths",
  "seoDescription": "Machu Picchu today: live mountain weather, circuit guide, UNESCO facts, credited photos and myth checks. The Inca citadel in the Peruvian Andes.",
  "intro": [
    "Machu Picchu is a 15th-century Inca citadel set on a mountain ridge 2,430 metres above sea level in the Cusco Region of Peru — a royal estate built for the emperor Pachacuti around 1450, occupied for roughly a century, and never found by the Spanish. Some 200 structures of polished dry-stone granite — temples, terraces, houses, storehouses and fountains — step down the ridge between the peaks of Machu Picchu and Huayna Picchu above the Urubamba gorge.",
    "UNESCO inscribed the Historic Sanctuary of Machu Picchu as World Heritage Site 274 in 1983, a 32,500-hectare protected zone that is as much a natural sanctuary (orchids, spectacled bears, cloud forest) as an archaeological one. In 2007 the citadel was voted one of the New7Wonders of the World.",
    "The site never \"hid\" from the people who lived beside it — local farmers knew it, and a Peruvian, Agustín Lizárraga, reached it in 1902, nine years before Hiram Bingham’s famous 1911 expedition (see Myth vs Fact). The live block on this page samples weather on the ridge: Andean afternoons build cloud fast, and the famous postcard view is a morning prize."
  ],
  "facts": [
    {
      "label": "Built",
      "value": "c. 1450, under the Inca emperor Pachacuti",
      "source": "Wikidata / UNESCO"
    },
    {
      "label": "Elevation",
      "value": "2,430 m above sea level",
      "source": "UNESCO"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Site 274 · inscribed 1983 · criteria (i)(iii)(vii)(ix)",
      "source": "UNESCO"
    },
    {
      "label": "Sanctuary area",
      "value": "32,500 hectares (historic sanctuary)",
      "source": "Wikidata / UNESCO"
    },
    {
      "label": "Visitors",
      "value": "About 950,000 a year (before daily caps)",
      "source": "Wikidata"
    },
    {
      "label": "Abandoned",
      "value": "c. 1572 — never reached by the Spanish",
      "source": "Wikipedia"
    },
    {
      "label": "Coordinates",
      "value": "13.1633° S, 72.5456° W",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "Machu Picchu’s masonry is the exhibit: granite blocks cut and fitted without mortar so precisely that a knife blade will not pass between them — and so flexibly that the walls have ridden out five centuries of Andean earthquakes that flattened colonial Cusco. Buildings divide between an agricultural sector of terraces and storehouses and an urban sector of temples and elite houses, split by a great plaza.",
      "The sacred buildings track the sky. The Temple of the Sun’s curved tower catches the June solstice sunrise through its window; the Intihuatana stone — a carved ritual pillar — is aligned to the mountains and solstices, and the Room of the Three Windows frames the December solstice. Water arrives by engineering rather than luck: a spring 750 metres away feeds a descending chain of 16 ritual fountains through the whole city."
    ],
    "geniusPoints": [
      "Mortarless ashlar masonry that flexes through earthquakes instead of cracking",
      "A working city water system: one spring, 16 fountains, gravity-fed through the urban sector",
      "Solstice alignments built into the Temple of the Sun and the Intihuatana stone",
      "Terraces that are simultaneously farms, retaining walls and drainage engineering"
    ],
    "dimensions": [
      {
        "label": "Elevation",
        "value": "2,430 m"
      },
      {
        "label": "Built-up area",
        "value": "About 13 km² of structures and terraces across the ridge (sanctuary: 32,500 ha)"
      },
      {
        "label": "Structures",
        "value": "Around 200 buildings"
      },
      {
        "label": "Huayna Picchu",
        "value": "2,693 m — the peak in every postcard, itself capped by daily climbing permits"
      }
    ],
    "materials": [
      "Granite (dry-stone ashlar)",
      "Stone terrace fill and drainage gravel"
    ]
  },
  "timeline": [
    {
      "year": "c. 1450",
      "title": "Built under Pachacuti",
      "text": "The Inca emperor Pachacuti raises a royal estate on the ridge — temples, houses, terraces and storehouses for a court in seasonal residence."
    },
    {
      "year": "c. 1572",
      "title": "Abandoned",
      "text": "As the last Inca resistance at Vilcabamba falls, the estate empties; the Spanish never learn of it, and the forest takes the terraces."
    },
    {
      "year": "1902",
      "title": "Lizárraga reaches the ruins",
      "text": "Peruvian farmer Agustín Lizárraga visits and inscribes his name on a temple wall — the first recorded modern visit."
    },
    {
      "year": "1911",
      "title": "Bingham’s expedition",
      "text": "Yale historian Hiram Bingham, led by local farmer Melchor Arteaga, photographs the citadel and announces it to the world."
    },
    {
      "year": "1983",
      "title": "UNESCO World Heritage",
      "text": "Inscribed as site 274 — a mixed cultural and natural sanctuary."
    },
    {
      "year": "2007",
      "title": "New7Wonders",
      "text": "Named one of the New7Wonders of the World in the global vote of 7 July 2007."
    }
  ],
  "visitor": {
    "hoursText": "Entry is by pre-booked, timed circuit tickets sold through the Peruvian government’s official platform — there are no gate sales for the main circuits, and daily numbers are capped to protect the site. The citadel opens at 06:00 and entry slots run through the afternoon; circuits are one-way. The official platform publishes the current circuits, caps and prices.",
    "closedDays": "Open daily.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Almost all visitors arrive via Aguas Calientes (Machupicchu Pueblo): train from Cusco or Ollantaytambo, then the shuttle bus up the switchbacks, or the footpath. Altitude (2,430 m) is lower than Cusco (3,400 m) — most visitors acclimatise better by sleeping in the Sacred Valley first.",
    "lastVerified": "2026-10-22",
    "sourceName": "Machu Picchu official platform (Gobierno del Perú)",
    "sourceUrl": "http://www.machupicchu.gob.pe/"
  },
  "myths": [
    {
      "claim": "Hiram Bingham discovered a lost city that nobody knew existed.",
      "verdict": "FALSE",
      "evidence": "Local families farmed the terraces and knew the ruins well; farmer Melchor Arteaga led Bingham to the site, tenant families were living at the ruins when he arrived, and Agustín Lizárraga had visited and left his name in charcoal in 1902. Bingham’s real achievement was documenting and publicising Machu Picchu — not finding an unknown place.",
      "sourceName": "Documented visitation history (see Wikipedia, \"Machu Picchu\", rediscovery)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Machu_Picchu"
    },
    {
      "claim": "It was the lost Inca city of gold — an El Dorado.",
      "verdict": "FALSE",
      "evidence": "Excavation found a royal estate, not a treasure city: temples, elite houses, workshops and storehouses, with burials and everyday goods. The \"lost city\" Bingham himself hoped for was Vilcabamba — a different site, found later. Machu Picchu’s wealth was agricultural and ceremonial, not golden hoards.",
      "sourceName": "Archaeological record (see Wikipedia, \"Machu Picchu\")",
      "sourceUrl": "https://en.wikipedia.org/wiki/Machu_Picchu"
    },
    {
      "claim": "The stones were cut by aliens, or with technology the Inca did not have.",
      "verdict": "FALSE",
      "evidence": "The toolkit is found on site: river-cobble hammerstones, bronze tools, and half-finished blocks in the quarry on the ridge itself. Experimental archaeology has reproduced the fitting process with Inca tools — slow, skilled, entirely human work.",
      "sourceName": "Experimental archaeology and quarry evidence (see Wikipedia, \"Machu Picchu\", construction)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Machu_Picchu"
    }
  ],
  "photoSpots": [
    {
      "name": "The Guardian’s House terrace",
      "description": "The postcard: Martin St-Amant’s panorama from the upper terrace — citadel below, Huayna Picchu behind.",
      "mediaFileTitle": "80 - Machu Picchu - Juin 2009 - edit.jpg"
    },
    {
      "name": "Across the terraces",
      "description": "Diego Delso’s wide view of the agricultural terraces stepping down the ridge (CC BY-SA 4.0).",
      "mediaFileTitle": "Machu Picchu, Perú, 2015-07-30, DD 47.JPG"
    },
    {
      "name": "The classic approach",
      "description": "Pedro Szekely’s much-loved shot along the main plaza toward the urban sector (CC BY-SA 2.0).",
      "mediaFileTitle": "Machu Picchu, Peru.jpg"
    }
  ],
  "faqs": [
    {
      "q": "What was Machu Picchu for?",
      "a": "A royal estate of the emperor Pachacuti (built c. 1450): a seasonal court residence with temples, elite housing, terraces and storehouses, staffed by retainers and occupied for about a century."
    },
    {
      "q": "Did Hiram Bingham discover Machu Picchu?",
      "a": "He publicised it to the world in 1911, but he did not find an unknown place: local farmers knew the ruins, Agustín Lizárraga had visited in 1902, and Melchor Arteaga guided Bingham up."
    },
    {
      "q": "How do you get to Machu Picchu?",
      "a": "Train to Aguas Calientes from Cusco or Ollantaytambo, then a shuttle bus up to the gate. Entry is by pre-booked timed circuit tickets from the official government platform — buy well ahead; daily caps apply."
    },
    {
      "q": "Is Machu Picchu a UNESCO site?",
      "a": "Yes — the Historic Sanctuary of Machu Picchu, site 274, inscribed in 1983 under cultural and natural criteria. It was also voted a New7Wonder in 2007."
    },
    {
      "q": "When is the best time of day to visit?",
      "a": "Early morning: Andean cloud builds through the afternoon, so the clear postcard view is a morning prize — this page’s live block shows the ridge weather before you commit to a slot."
    }
  ],
  "nearby": [
    {
      "name": "Huayna Picchu",
      "relation": "The sugarloaf peak behind the citadel — a steep, separately permitted climb",
      "lat": -13.1575,
      "lng": -72.547222,
      "url": "https://whc.unesco.org/en/list/274/",
      "urlLabel": "UNESCO listing"
    },
    {
      "name": "Ollantaytambo",
      "relation": "The living Inca town and fortress in the Sacred Valley — the usual train gateway",
      "lat": -13.256,
      "lng": -72.2056,
      "url": "https://whc.unesco.org/en/list/274/",
      "urlLabel": "UNESCO listing"
    }
  ],
  "media": [
    {
      "fileTitle": "80 - Machu Picchu - Juin 2009 - edit.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/6/62/80_-_Machu_Picchu_-_Juin_2009_-_edit.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:80_-_Machu_Picchu_-_Juin_2009_-_edit.jpg",
      "width": 10000,
      "height": 9760,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Martin St-Amant",
      "attribution": "\"80 - Machu Picchu - Juin 2009 - edit.jpg\" by Martin St-Amant — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "Machu Picchu from the upper terrace with Huayna Picchu behind",
      "sortOrder": 1
    },
    {
      "fileTitle": "Machu Picchu, Perú, 2015-07-30, DD 47.JPG",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/7/71/Machu_Picchu%2C_Per%C3%BA%2C_2015-07-30%2C_DD_47.JPG",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Machu_Picchu,_Per%C3%BA,_2015-07-30,_DD_47.JPG",
      "width": 8669,
      "height": 5763,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Diego Delso",
      "attribution": "\"Machu Picchu, Perú, 2015-07-30, DD 47.JPG\" by Diego Delso — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "The terraces and stone buildings of Machu Picchu under Andean cloud",
      "sortOrder": 2
    },
    {
      "fileTitle": "Machu Picchu, Peru.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Machu_Picchu%2C_Peru.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Machu_Picchu,_Peru.jpg",
      "width": 1600,
      "height": 1067,
      "licence": "CC BY-SA 2.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "author": "Pedro Szekely",
      "attribution": "\"Machu Picchu, Peru.jpg\" by Pedro Szekely — CC BY-SA 2.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "The main plaza and urban sector of Machu Picchu",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity, coordinates, construction date, sanctuary area, visitor count",
      "sourceName": "Wikidata — Q676203 (Machu Picchu)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q676203",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status, site 274, inscribed 1983, elevation and sanctuary scope",
      "sourceName": "UNESCO World Heritage Centre — Historic Sanctuary of Machu Picchu (site 274)",
      "sourceUrl": "https://whc.unesco.org/en/list/274/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Rediscovery history, function, construction evidence",
      "sourceName": "Wikipedia — \"Machu Picchu\" (cross-checked)",
      "sourceUrl": "https://en.wikipedia.org/wiki/Machu_Picchu",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "All photographs: licence, author, dimensions",
      "sourceName": "Wikimedia Commons — imageinfo records (per-file links in the credits)",
      "sourceUrl": "https://commons.wikimedia.org/",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Live weather and sun times at the site",
      "sourceName": "Open-Meteo API (forecast, at -13.163333, -72.545556)",
      "sourceUrl": "https://open-meteo.com/",
      "checkedAt": "2026-10-22"
    }
  ]
};

export const BUILT_WONDERS: Wonder[] = [GREAT_WALL_OF_CHINA, EIFFEL_TOWER, PYRAMIDS_OF_GIZA, BURJ_KHALIFA, CHRIST_THE_REDEEMER, COLOSSEUM, MACHU_PICCHU];

export const PUBLISHED_WONDERS: Wonder[] = [TAJ_MAHAL];

// The other New7Wonders — listed on the index as content only (no links)
// until each one's own golden build is verified and published.
export const UPCOMING_WONDERS: { name: string; place: string }[] = [
  { name: 'Petra', place: 'Ma\u2019an, Jordan' },
  { name: 'Chichen Itza', place: 'Yucat\u00e1n, Mexico' },
];

function mediaByTitle(wonder: Wonder, title: string): WonderMedia | undefined {
  return wonder.media.find((m) => m.fileTitle === title);
}
export function wonderMedia(wonder: Wonder, title?: string): WonderMedia | undefined {
  return title ? mediaByTitle(wonder, title) : undefined;
}
export function heroMedia(wonder: Wonder): WonderMedia {
  return wonder.media.find((m) => m.role === 'hero') ?? wonder.media[0];
}

// ── Database-first read (migration 0001) with baked fallback ───────────────
async function getWonderFromDb(slug: string): Promise<Wonder | null> {
  try {
    const supabase = getSupabase();
    const query = supabase.from('wonders').select('*').eq('slug', slug).eq('status', 'published').single();
    const { data: row, error } = await Promise.race([
      query,
      new Promise<{ data: null; error: Error }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error('timeout') }), 2500),
      ),
    ]);
    if (error || !row || !row.curated) return null;
    const [{ data: media }, { data: sources }] = await Promise.all([
      supabase.from('wonder_media').select('*').eq('wonder_id', row.id).order('sort_order'),
      supabase.from('wonder_sources').select('*').eq('wonder_id', row.id),
    ]);
    if (!media || media.length === 0) return null; // incomplete row → baked set wins
    const c = row.curated as Wonder['architecture'] & Record<string, unknown>;
    return {
      slug: row.slug,
      name: row.name,
      category: row.category,
      wikidataQid: row.wikidata_qid,
      unescoId: row.unesco_id,
      unescoYear: row.unesco_year,
      cityName: row.city_name,
      regionName: row.region_name,
      countryName: row.country_name,
      lat: Number(row.lat),
      lng: Number(row.lng),
      timezone: row.timezone,
      officialUrl: row.official_url,
      ticketUrl: row.ticket_url,
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      intro: (c.intro as string[]) ?? [],
      facts: (c.facts as WonderFact[]) ?? [],
      architecture: {
        paragraphs: (c.architecture_paragraphs as string[]) ?? [],
        geniusPoints: (c.genius_points as string[]) ?? [],
        dimensions: (c.dimensions as { label: string; value: string }[]) ?? [],
        materials: (c.materials as string[]) ?? [],
      },
      timeline: (c.timeline as TimelineEntry[]) ?? [],
      visitor: c.visitor as Wonder['visitor'],
      myths: (c.myths as MythCard[]) ?? [],
      photoSpots: (c.photo_spots as Wonder['photoSpots']) ?? [],
      faqs: (c.faqs as Wonder['faqs']) ?? [],
      nearby: (c.nearby as Wonder['nearby']) ?? [],
      media: media.map((m) => ({
        fileTitle: m.file_title,
        fileUrl: m.file_url,
        pageUrl: m.page_url,
        width: m.width,
        height: m.height,
        licence: m.licence,
        licenceUrl: m.licence_url,
        author: m.author,
        attribution: m.attribution_text,
        role: m.role,
        alt: m.alt_text,
        sortOrder: m.sort_order,
      })),
      sources: (sources ?? []).map((s) => ({
        claim: s.claim,
        sourceName: s.source_name,
        sourceUrl: s.source_url,
        checkedAt: String(s.checked_at).slice(0, 10),
      })),
    };
  } catch {
    return null;
  }
}

export async function getWonder(slug: string): Promise<Wonder | null> {
  const fromDb = await getWonderFromDb(slug);
  if (fromDb) return fromDb;
  // Baked fallback: published wonders first, then the BUILT (not yet
  // switched-on) batch-1 rows — their pages render for QA, but they are
  // not in PUBLISHED_WONDERS, so the hub never lists or links them.
  return (
    PUBLISHED_WONDERS.find((w) => w.slug === slug) ??
    BUILT_WONDERS.find((w) => w.slug === slug) ??
    null
  );
}

export async function getPublishedWonders(): Promise<Wonder[]> {
  const out: Wonder[] = [];
  for (const w of PUBLISHED_WONDERS) {
    const full = await getWonder(w.slug);
    if (full) out.push(full);
  }
  return out;
}

// ── Live layer: Open-Meteo at the site ──────────────────────────────────────
export interface WonderLive {
  sampledAt: string; // local time at the site, ISO
  tempNow: number;
  feelsLike: number;
  humidity: number;
  windKmh: number;
  uvNow: number;
  weatherCode: number;
  isDay: boolean;
  today: { sunrise: string; sunset: string; tempMax: number; tempMin: number; uvMax: number };
  nextDays: { date: string; tempMax: number; tempMin: number; sunrise: string; sunset: string }[];
  hourly: { time: string; temp: number }[]; // rest of today, from the current hour
  goldenMorning: { start: string; end: string };
  goldenEvening: { start: string; end: string };
}

export const WMO_LABELS: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Drizzle',
  55: 'Dense drizzle', 56: 'Freezing drizzle', 57: 'Freezing drizzle',
  61: 'Slight rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain',
  67: 'Freezing rain', 71: 'Slight snow', 73: 'Snow', 75: 'Heavy snow',
  77: 'Snow grains', 80: 'Slight rain showers', 81: 'Rain showers',
  82: 'Violent rain showers', 85: 'Snow showers', 86: 'Snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail',
};
export function weatherLabel(code: number): string {
  return WMO_LABELS[code] ?? 'Conditions unavailable';
}
export function isRainCode(code: number): boolean {
  return [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code);
}

function shiftTime(isoLocal: string, minutes: number): string {
  const d = new Date(isoLocal);
  d.setMinutes(d.getMinutes() + minutes);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function hm(isoLocal: string): string {
  return isoLocal.slice(11, 16);
}

export async function getWonderLive(lat: number, lng: number, timezone: string): Promise<WonderLive | null> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index,is_day` +
      `&hourly=temperature_2m&daily=sunrise,sunset,uv_index_max,temperature_2m_max,temperature_2m_min` +
      `&timezone=${encodeURIComponent(timezone)}&forecast_days=3`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const d = await res.json();
    const cur = d.current;
    const daily = d.daily;
    if (!cur || !daily?.sunrise?.length) return null;
    const sunrise = daily.sunrise[0] as string;
    const sunset = daily.sunset[0] as string;
    const todayStr = (cur.time as string).slice(0, 10);
    const hourlyAll: { time: string; temp: number }[] = (d.hourly?.time ?? []).map((t: string, i: number) => ({
      time: t,
      temp: d.hourly.temperature_2m[i] as number,
    }));
    const hourly = hourlyAll.filter((h) => h.time >= (cur.time as string).slice(0, 13) && h.time.slice(0, 10) === todayStr).slice(0, 12);
    return {
      sampledAt: cur.time,
      tempNow: cur.temperature_2m,
      feelsLike: cur.apparent_temperature,
      humidity: cur.relative_humidity_2m,
      windKmh: cur.wind_speed_10m,
      uvNow: cur.uv_index,
      weatherCode: cur.weather_code,
      isDay: cur.is_day === 1,
      today: {
        sunrise: hm(sunrise),
        sunset: hm(sunset),
        tempMax: daily.temperature_2m_max[0],
        tempMin: daily.temperature_2m_min[0],
        uvMax: daily.uv_index_max[0],
      },
      nextDays: [1, 2].map((i) => ({
        date: daily.time[i],
        tempMax: daily.temperature_2m_max[i],
        tempMin: daily.temperature_2m_min[i],
        sunrise: hm(daily.sunrise[i]),
        sunset: hm(daily.sunset[i]),
      })),
      hourly,
      goldenMorning: { start: hm(sunrise), end: shiftTime(sunrise, 60) },
      goldenEvening: { start: shiftTime(sunset, -60), end: hm(sunset) },
    };
  } catch {
    return null;
  }
}

// Deterministic clothing verdict from live values only (blueprint §4.5).
export function whatToWear(live: WonderLive): string[] {
  const tips: string[] = [];
  const t = live.tempNow;
  if (t >= 35) tips.push('Very hot at the site right now — wear light, breathable cotton, a hat, and carry water.');
  else if (t >= 28) tips.push('Warm at the site — light clothing, sunglasses and sunscreen are the right call today.');
  else if (t >= 20) tips.push('Comfortable temperatures — light layers are enough; mornings can feel cooler by the river.');
  else if (t >= 12) tips.push('Cool at the site — bring a light jacket, especially for a sunrise visit.');
  else tips.push('Cold at the site — wear a warm jacket; the marble terrace is exposed to the wind.');
  if (isRainCode(live.weatherCode)) tips.push('Rain is in the air at the site — carry an umbrella or rain cover, and expect slippery marble underfoot.');
  if (live.today.uvMax >= 8) tips.push(`UV will peak very high today (${live.today.uvMax.toFixed(0)}) — sunscreen, a hat and shade breaks matter.`);
  else if (live.today.uvMax >= 6) tips.push(`UV peaks high today (${live.today.uvMax.toFixed(0)}) — sunscreen is worth it for the midday hours.`);
  if (live.windKmh >= 30) tips.push('It is windy at the site — secure hats and scarves on the open terrace.');
  return tips;
}

// Open/closed from the VERIFIED official rule only: opens 30 min before
// sunrise, closes 30 min before sunset, closed Fridays (official site).
export function openStatus(live: WonderLive, timezone: string): { open: boolean | null; text: string } {
  try {
    const nowParts = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(new Date());
    const get = (type: string) => nowParts.find((p) => p.type === type)?.value ?? '';
    if (get('weekday') === 'Fri') return { open: false, text: 'Closed today — the Taj Mahal closes on Fridays for general viewing (official site).' };
    const nowMin = parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10);
    const toMin = (s: string) => parseInt(s.slice(0, 2), 10) * 60 + parseInt(s.slice(3, 5), 10);
    const opens = toMin(live.today.sunrise) - 30;
    const closes = toMin(live.today.sunset) - 30;
    if (nowMin >= opens && nowMin < closes) {
      return { open: true, text: `Open now — today\u2019s visiting window is ${shiftTime(`2000-01-01T${live.today.sunrise}`, -30)} to ${shiftTime(`2000-01-01T${live.today.sunset}`, -30)} local time.` };
    }
    return { open: false, text: `Closed right now — today\u2019s visiting window is ${shiftTime(`2000-01-01T${live.today.sunrise}`, -30)} to ${shiftTime(`2000-01-01T${live.today.sunset}`, -30)} local time.` };
  } catch {
    return { open: null, text: '' };
  }
}

export function formatLocalTime(timezone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).format(new Date());
}
export function formatLocalDate(timezone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date());
}

export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
