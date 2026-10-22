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

export const PUBLISHED_WONDERS: Wonder[] = [TAJ_MAHAL];

// The other New7Wonders — listed on the index as content only (no links)
// until each one's own golden build is verified and published.
export const UPCOMING_WONDERS: { name: string; place: string }[] = [
  { name: 'Great Wall of China', place: 'China' },
  { name: 'Petra', place: 'Ma\u2019an, Jordan' },
  { name: 'Christ the Redeemer', place: 'Rio de Janeiro, Brazil' },
  { name: 'Machu Picchu', place: 'Cusco Region, Peru' },
  { name: 'Chichen Itza', place: 'Yucat\u00e1n, Mexico' },
  { name: 'Colosseum', place: 'Rome, Italy' },
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
  return PUBLISHED_WONDERS.find((w) => w.slug === slug) ?? null;
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
