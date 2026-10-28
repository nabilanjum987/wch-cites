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
    // Verified night-viewing rule (official Taj Mahal site FAQs; only
    // where the monument runs a night programme) — null elsewhere.
    nightText?: string | null;
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
    // Night viewing: official Taj Mahal site FAQs (tajmahal.gov.in),
    // cross-checked 2026-10-23 — five nights around the full moon, eight
    // batches of at most 50 visitors, separate ticket, report at Shilpgram.
    nightText:
      'Night viewing is offered on five nights around the full moon — the full-moon night and two nights before and after — except Fridays and during Ramadan. Viewing runs in eight batches of at most 50 visitors, 30 minutes each, on a separate ticket; visitors report at Shilpgram, near the Eastern Gate, for security checks.',
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
      a: 'The Taj Mahal opens 30 minutes before sunrise and closes 30 minutes before sunset, and it is closed on Fridays for general viewing (official site, tajmahal.gov.in). Today\u2019s exact opening and closing times, from live sunrise and sunset data, are shown in the Quick Answer box at the top of this page. Arrive before opening time for the quietest hour of the day, before the tour groups reach the complex.',
    },
    {
      // Fallback text only — at render the page replaces this answer with
      // feesAnswerText() (Fix 3, billi audit), which composes the answer
      // from the structured fee rows in visitor.fees above, category by
      // category. No category (e.g. free entry for children) may be
      // hard-coded here; it appears only when the record carries the row.
      q: 'How much is a Taj Mahal ticket?',
      a: 'Per the official site: foreign tourists ₹1,100, citizens of SAARC and BIMSTEC countries ₹540, and Indian/domestic visitors (including OCI cardholders) ₹50 — with an optional ₹200 extra for the main mausoleum. Fees include ASI and ADA charges. Buying online through the Archaeological Survey of India discounts the foreign ticket by \u20B950 and the Indian ticket by \u20B95.',
    },
    {
      q: 'When is the best time to visit the Taj Mahal?',
      a: 'At opening time, just before sunrise: the marble glows pinkish in the first light, the crowds are thinnest, and temperatures are at their coolest. This page shows today\u2019s sunrise, sunset and golden-hour windows live, plus what to wear for today\u2019s weather at the site. UNESCO notes the monument appears in \u201Cever changing tints and moods\u201D through the day, which is why photographers plan their visit around those golden-hour windows.',
    },
    {
      q: 'Who built the Taj Mahal, and why?',
      a: 'The Mughal emperor Shah Jahan commissioned it in 1631 as the tomb of his wife Mumtaz Mahal; Shah Jahan himself is also buried there. The main architect was Ustad Ahmad Lahori, and craftsmen were drawn from across the empire, Central Asia and Iran (UNESCO). The tomb is the centrepiece of a 17-hectare complex on the Yamuna\u2019s right bank, with a mosque and a guest house set in formal gardens.',
    },
    {
      q: 'Is the Taj Mahal a UNESCO World Heritage Site?',
      a: 'Yes — it was inscribed in 1983 as World Heritage Site 252, under criterion (i), and UNESCO calls it the greatest architectural achievement in the whole range of Indo-Islamic architecture. UNESCO also describes it as \u201Cthe jewel of Muslim art in India and one of the universally admired masterpieces of the world\u2019s heritage\u201D. The listing covers the tomb, its mosque and guest house, and the formal gardens.',
    },
    {
      // Bank Q2 — composed from visitor.closedDays + visitor.hoursText.
      q: 'Is the Taj Mahal open on Fridays?',
      a: 'No — the Taj Mahal is closed on Fridays for general viewing, as the official site states. On all other days it opens 30 minutes before sunrise and closes 30 minutes before sunset, and today’s exact opening and closing times, from live sunrise and sunset data, are shown in the Quick Answer box at the top of this page.',
    },
    {
      // Bank Q7 — composed from visitor.gatesText.
      q: 'Which gate should I use to enter the Taj Mahal?',
      a: 'Entry tickets are sold at the Western Gate, near Saheli Burj, and at the Eastern Gate, from one hour before sunrise until 45 minutes before sunset. The Southern Gate is exit only. There are separate queues for foreign and domestic tourists at the gates, and this page’s visitor panel carries the official gate, hours and fee information for the site.',
    },
    {
      // Bank Q5 — composed from visitor.nightText (official site FAQs).
      q: 'Can I visit the Taj Mahal at night?',
      a: 'Yes — night viewing is offered on five nights around the full moon: the full-moon night and two nights before and after, except Fridays and during Ramadan. Viewing runs in eight batches of at most 50 visitors, 30 minutes each, on a separate ticket, and visitors report at Shilpgram, near the Eastern Gate, for security checks before their batch.',
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

// ─── BATCH 2 (R2B, 2026-10-22) ─────────────────────────────────────────
// Ten more wonders on the golden pattern. QIDs verified by description
// match; UNESCO id/year verified at whc.unesco.org; media = Commons
// imageinfo records with licence + author on every record. fees null
// (no official-source verification) so the fees block hides. Rows are
// BUILT (QA-renderable via BUILT_WONDERS); publication stays Taj-only.

const STATUE_OF_LIBERTY: Wonder = {
  "slug": "statue-of-liberty",
  "name": "Statue of Liberty",
  "category": "Symbolic landmark",
  "wikidataQid": "Q9202",
  "unescoId": 307,
  "unescoYear": 1984,
  "cityName": "New York City",
  "regionName": "New York",
  "countryName": "United States",
  "lat": 40.6892,
  "lng": -74.0444,
  "timezone": "America/New_York",
  "officialUrl": "https://www.nps.gov/stli/",
  "ticketUrl": null,
  "seoTitle": "Statue of Liberty: Weather, Facts, History & Guide",
  "seoDescription": "Statue of Liberty today: live New York Harbor weather, UNESCO facts, the Eiffel connection, credited photos and myth checks.",
  "intro": [
    "The Statue of Liberty — Liberty Enlightening the World — is a colossal copper statue on Liberty Island in New York Harbor, a gift from the people of France to the United States. It was designed by the French sculptor Frédéric Auguste Bartholdi, and its internal iron armature was engineered by Gustave Eiffel — the same engineer whose tower anchors the batch before this one.",
    "Dedicated on 28 October 1886, the robed figure of Libertas holds a torch above her head in her right hand and a tablet inscribed with the date of American independence in her left. A broken chain at her feet marks the abolition of slavery, and her crown's seven rays stand for the seven seas and continents.",
    "The statue's copper skin, just 2.4 millimetres thick, weathered from a shining penny-brown to its famous green within about two decades. The National Park Service manages the monument today, and the original torch — replaced in 1986 — is displayed in the Statue of Liberty Museum on the island."
  ],
  "facts": [
    {
      "label": "Dedicated",
      "value": "28 October 1886",
      "source": "Wikipedia / NPS"
    },
    {
      "label": "Height",
      "value": "93 m, ground to torch; the statue itself is 46 m",
      "source": "NPS"
    },
    {
      "label": "Sculptor",
      "value": "Frédéric Auguste Bartholdi",
      "source": "Wikipedia"
    },
    {
      "label": "Armature engineer",
      "value": "Gustave Eiffel",
      "source": "Wikipedia / NPS"
    },
    {
      "label": "Copper skin",
      "value": "2.4 mm thick — about two pennies",
      "source": "NPS"
    },
    {
      "label": "Gift",
      "value": "From the people of France; the pedestal was funded in the United States",
      "source": "Wikipedia"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Site 307 · inscribed 1984",
      "source": "UNESCO"
    },
    {
      "label": "Coordinates",
      "value": "40.6892° N, 74.0444° W",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "The figure is built like a building: a central iron pylon designed by Gustave Eiffel carries a secondary framework from which the hammered-copper skin hangs, free to flex slightly in the harbour winds. Bartholdi's workshop in Paris shaped over 300 copper sheets by repoussé — hammering them into wooden moulds — before the statue was assembled in Paris, dismantled into 350 pieces, and shipped to New York in 1885.",
      "The neoclassical design dresses the Roman goddess Libertas in a stola, with a radiant crown whose spikes double as a halo of light. The pedestal, designed by the American architect Richard Morris Hunt, rises from the star-shaped Fort Wood, an early-19th-century harbour fortification whose walls form the monument's base."
    ],
    "geniusPoints": [
      "Iron armature by Gustave Eiffel — a bridge engineer's skeleton inside a classical statue",
      "Copper skin hung loose from the frame so wind and temperature can move it",
      "The seven crown rays represent the seven seas and continents",
      "Fort Wood's star-fort walls form the base of the pedestal"
    ],
    "dimensions": [
      {
        "label": "Height to torch",
        "value": "93 m"
      },
      {
        "label": "Statue alone",
        "value": "46 m"
      },
      {
        "label": "Copper skin thickness",
        "value": "2.4 mm"
      },
      {
        "label": "Crown windows",
        "value": "25"
      }
    ],
    "materials": [
      "Copper",
      "Wrought iron armature",
      "Granite-faced concrete pedestal"
    ]
  },
  "timeline": [
    {
      "year": "1875",
      "title": "Construction begins in Paris",
      "text": "Bartholdi's Paris workshop starts hammering the copper sections."
    },
    {
      "year": "1884",
      "title": "Completed in Paris",
      "text": "The finished statue is formally presented to the US ambassador in Paris on 4 July 1884, then dismantled for shipping."
    },
    {
      "year": "1886",
      "title": "Dedicated in New York",
      "text": "President Grover Cleveland dedicates the statue on 28 October 1886 before a harbour crowd."
    },
    {
      "year": "1986",
      "title": "Centenary restoration",
      "text": "The statue is restored for its centenary and a new gold-leafed torch replaces the corroded original."
    }
  ],
  "myths": [
    {
      "claim": "The statue was always green",
      "verdict": "FALSE",
      "evidence": "It began as bright copper — the colour of a new penny. The green patina is oxidation that formed over roughly 20 years and now protects the metal.",
      "sourceName": "Wikipedia — Statue of Liberty",
      "sourceUrl": "https://en.wikipedia.org/wiki/Statue_of_Liberty"
    },
    {
      "claim": "France paid for the whole monument",
      "verdict": "FALSE",
      "evidence": "France funded the statue; Americans had to fund the pedestal, and fundraising stalled until Joseph Pulitzer's newspaper campaign drew over 120,000 small donations.",
      "sourceName": "Wikipedia — Statue of Liberty",
      "sourceUrl": "https://en.wikipedia.org/wiki/Statue_of_Liberty"
    },
    {
      "claim": "The face is Bartholdi's mother",
      "verdict": "PARTLY TRUE",
      "evidence": "The likeness to Charlotte Bartholdi is a long-told story and the features do resemble her — but no document from the sculptor confirms the model, so it stays a story, not a record.",
      "sourceName": "Wikipedia — Statue of Liberty",
      "sourceUrl": "https://en.wikipedia.org/wiki/Statue_of_Liberty"
    },
    {
      "claim": "The torch you see is the 1886 original",
      "verdict": "FALSE",
      "evidence": "The original torch, damaged by decades of weather and modifications, was removed in 1984 and is now in the museum; the flame-tipped replacement is gilded in gold leaf.",
      "sourceName": "Wikipedia — Statue of Liberty",
      "sourceUrl": "https://en.wikipedia.org/wiki/Statue_of_Liberty"
    }
  ],
  "media": [
    {
      "fileTitle": "Currier and Ives Liberty2.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ed/Currier_and_Ives_Liberty2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Currier_and_Ives_Liberty2.jpg",
      "width": 4653,
      "height": 7400,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "Currier &amp; Ives",
      "attribution": "\"Currier and Ives Liberty2.jpg\" by Currier &amp; Ives — Public domain, via Wikimedia Commons",
      "role": "hero",
      "alt": "The Statue of Liberty holding her torch above New York Harbor",
      "sortOrder": 1
    },
    {
      "fileTitle": "LibertyStatue.JPG",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/6/67/LibertyStatue.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:LibertyStatue.JPG",
      "width": 2592,
      "height": 1944,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Jyothis at Malayalam Wikipedia",
      "attribution": "\"LibertyStatue.JPG\" by Jyothis at Malayalam Wikipedia — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Statue of Liberty — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Liberty Island photo Don Ramey Logan.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Liberty_Island_photo_Don_Ramey_Logan.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Liberty_Island_photo_Don_Ramey_Logan.jpg",
      "width": 4800,
      "height": 3200,
      "licence": "CC BY 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/4.0",
      "author": "Don Ramey Logan",
      "attribution": "\"Liberty Island photo Don Ramey Logan.jpg\" by Don Ramey Logan — CC BY 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Statue of Liberty — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity and coordinates",
      "sourceName": "Wikidata — Q9202 (Statue of Liberty)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q9202",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status, site ID 307, inscription year 1984",
      "sourceName": "UNESCO World Heritage Centre — list 307",
      "sourceUrl": "https://whc.unesco.org/en/list/307",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Labelled facts as cited per row (managing authorities and foundations)",
      "sourceName": "Wikipedia — Statue of Liberty",
      "sourceUrl": "https://en.wikipedia.org/wiki/Statue_of_Liberty",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Photographs: licence and author per record",
      "sourceName": "Wikimedia Commons imageinfo",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Currier_and_Ives_Liberty2.jpg",
      "checkedAt": "2026-10-22"
    }
  ],
  "visitor": {
    "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
    "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Access and entry details are published by the managing authority on the official site.",
    "lastVerified": "2026-10-22",
    "sourceName": "Official site (see official_url)",
    "sourceUrl": "https://www.nps.gov/stli/"
  },
  "photoSpots": [
    {
      "name": "Statue of Liberty — hero view",
      "description": "Gallery image by Currier &amp; Ives (Public domain), via Wikimedia Commons.",
      "mediaFileTitle": "Currier and Ives Liberty2.jpg"
    }
  ],
  "faqs": [
    {
      "q": "Where is the Statue of Liberty?",
      "a": "New York City, New York, United States — at 40.6892° N, 74.0444° W (Wikidata Q9202)."
    },
    {
      "q": "Is the Statue of Liberty a UNESCO World Heritage Site?",
      "a": "Yes — inscribed in 1984 (site 307)."
    },
    {
      "q": "What is the Statue of Liberty known for?",
      "a": "The Statue of Liberty — Liberty Enlightening the World — is a colossal copper statue on Liberty Island in New York Harbor, a gift from the people of France to the United States."
    }
  ],
  "nearby": []
};

const ACROPOLIS_ATHENS: Wonder = {
  "slug": "acropolis-athens",
  "name": "Acropolis of Athens",
  "category": "Ancient site",
  "wikidataQid": "Q131013",
  "unescoId": 404,
  "unescoYear": 1987,
  "cityName": "Athens",
  "regionName": "Attica",
  "countryName": "Greece",
  "lat": 37.9717,
  "lng": 23.7261,
  "timezone": "Europe/Athens",
  "officialUrl": "https://odysseus.culture.gr/",
  "ticketUrl": null,
  "seoTitle": "Acropolis of Athens: Weather, Facts & Visitor Guide",
  "seoDescription": "Acropolis today: live Athens weather, Parthenon facts, UNESCO history, credited photos and myth checks. Greece.",
  "intro": [
    "The Acropolis is a limestone rock rising about 156 metres above sea level in the centre of Athens, crowned by the most influential buildings of classical antiquity. Its centrepiece, the Parthenon, was built between 447 and 432 BC as the temple of Athena Parthenos, the city's patron goddess.",
    "The Periclean building programme also raised the Propylaea gateway, the Erechtheion with its famous Caryatid porch, and the small Temple of Athena Nike — a ensemble UNESCO calls the greatest architectural and artistic complex bequeathed by Greek antiquity to the world.",
    "The rock has been inhabited since the Neolithic and served as fortress, sanctuary and symbol in turn. Since 1975 a Greek state restoration programme has been dismantling and re-setting the marble buildings block by block, repairing earlier restorations and earthquake damage with new Pentelic marble and titanium."
  ],
  "facts": [
    {
      "label": "Parthenon built",
      "value": "447–432 BC",
      "source": "UNESCO / Wikipedia"
    },
    {
      "label": "Parthenon architects",
      "value": "Iktinos and Kallikrates",
      "source": "Wikipedia"
    },
    {
      "label": "Dedicated to",
      "value": "Athena Parthenos",
      "source": "Wikipedia"
    },
    {
      "label": "The rock",
      "value": "156 m above sea level",
      "source": "Wikipedia"
    },
    {
      "label": "Main material",
      "value": "Pentelic marble",
      "source": "Wikipedia"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Site 404 · inscribed 1987 · criteria (i)(ii)(iii)(iv)(vi)",
      "source": "UNESCO"
    },
    {
      "label": "Coordinates",
      "value": "37.9717° N, 23.7261° E",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "The Parthenon is a Doric temple of deceptive subtlety: almost nothing in it is straight. The columns swell slightly (entasis), lean inward by centimetres, and stand on a platform that curves upward toward the centre — refinements that counteract the optical illusions that would make a truly straight temple look sagging and splayed. Its 46 outer columns frame an interior that held Pheidias's colossal gold-and-ivory statue of Athena.",
      "Next door, the Erechtheion (421–406 BC) housed Athens's oldest cults and the marks of Poseidon's trident and Athena's olive; its south porch is carried by the six Caryatids — the originals are in the Acropolis Museum, one is in the British Museum."
    ],
    "geniusPoints": [
      "Entasis and a curved stylobate — the Parthenon corrects the eye's illusions with geometry",
      "The Parthenon sculptures were painted; the white-marble look is time, not intent",
      "The Caryatid porch: six maidens as load-bearing columns",
      "The Propylaea aligns the visitor's first view of the Parthenon at a three-quarter angle"
    ],
    "dimensions": [
      {
        "label": "Parthenon platform",
        "value": "69.5 × 30.9 m"
      },
      {
        "label": "Outer columns",
        "value": "46"
      },
      {
        "label": "Inner columns",
        "value": "23 (two tiers)"
      },
      {
        "label": "Rock height",
        "value": "156 m above sea level"
      }
    ],
    "materials": [
      "Pentelic marble",
      "Limestone foundations"
    ]
  },
  "timeline": [
    {
      "year": "447 BC",
      "title": "Parthenon construction begins",
      "text": "Work starts under Pericles, nine years after the decision to rebuild the temples the Persians burned."
    },
    {
      "year": "432 BC",
      "title": "Parthenon complete",
      "text": "The temple and its gold-and-ivory Athena are finished; the building programme continues on the rock."
    },
    {
      "year": "1801–1812",
      "title": "Sculptures removed",
      "text": "Lord Elgin's agents remove roughly half the surviving Parthenon sculptures; most are now in the British Museum — their return remains disputed."
    },
    {
      "year": "2009",
      "title": "Acropolis Museum opens",
      "text": "The new museum at the rock's foot displays the originals, with a gallery aligned to the Parthenon itself."
    }
  ],
  "myths": [
    {
      "claim": "The Parthenon is perfectly straight and regular",
      "verdict": "FALSE",
      "evidence": "Almost the opposite: columns swell and lean, the floor curves — the temple is a masterpiece of deliberate irregularity that only looks perfectly straight.",
      "sourceName": "Wikipedia — Acropolis of Athens",
      "sourceUrl": "https://en.wikipedia.org/wiki/Acropolis_of_Athens"
    },
    {
      "claim": "The marble was always gleaming white",
      "verdict": "FALSE",
      "evidence": "Traces of pigment show the sculptures and architectural details were painted in colour; the white ruin is what 2,400 years left behind.",
      "sourceName": "Wikipedia — Acropolis of Athens",
      "sourceUrl": "https://en.wikipedia.org/wiki/Acropolis_of_Athens"
    },
    {
      "claim": "The missing sculptures were destroyed in antiquity",
      "verdict": "FALSE",
      "evidence": "Most of the removed Parthenon sculptures survive — divided since the early 1800s between the Acropolis Museum in Athens and the British Museum in London, an ongoing dispute between Greece and the UK.",
      "sourceName": "Wikipedia — Acropolis of Athens",
      "sourceUrl": "https://en.wikipedia.org/wiki/Acropolis_of_Athens"
    }
  ],
  "media": [
    {
      "fileTitle": "Acropolis Parthenon Athens Greece.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/2/25/Acropolis_Parthenon_Athens_Greece.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Acropolis_Parthenon_Athens_Greece.jpg",
      "width": 4397,
      "height": 1885,
      "licence": "CC0",
      "licenceUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "author": "Jebulon",
      "attribution": "\"Acropolis Parthenon Athens Greece.jpg\" by Jebulon — CC0, via Wikimedia Commons",
      "role": "hero",
      "alt": "The Parthenon on the Acropolis rock above Athens",
      "sortOrder": 1
    },
    {
      "fileTitle": "Athens Acropolis Parthenon (27827579884).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ee/Athens_Acropolis_Parthenon_%2827827579884%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Athens_Acropolis_Parthenon_(27827579884).jpg",
      "width": 5184,
      "height": 3456,
      "licence": "CC0",
      "licenceUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "author": "Gary Todd from Xinzheng, China",
      "attribution": "\"Athens Acropolis Parthenon (27827579884).jpg\" by Gary Todd from Xinzheng, China — CC0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Acropolis of Athens — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Athens Acropolis Parthenon (27827974593).jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/4/49/Athens_Acropolis_Parthenon_%2827827974593%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Athens_Acropolis_Parthenon_(27827974593).jpg",
      "width": 5184,
      "height": 3456,
      "licence": "CC0",
      "licenceUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "author": "Gary Todd from Xinzheng, China",
      "attribution": "\"Athens Acropolis Parthenon (27827974593).jpg\" by Gary Todd from Xinzheng, China — CC0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Acropolis of Athens — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity and coordinates",
      "sourceName": "Wikidata — Q131013 (Acropolis of Athens)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q131013",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status, site ID 404, inscription year 1987",
      "sourceName": "UNESCO World Heritage Centre — list 404",
      "sourceUrl": "https://whc.unesco.org/en/list/404",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Labelled facts as cited per row (managing authorities and foundations)",
      "sourceName": "Wikipedia — Acropolis of Athens",
      "sourceUrl": "https://en.wikipedia.org/wiki/Acropolis_of_Athens",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Photographs: licence and author per record",
      "sourceName": "Wikimedia Commons imageinfo",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Acropolis_Parthenon_Athens_Greece.jpg",
      "checkedAt": "2026-10-22"
    }
  ],
  "visitor": {
    "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
    "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Access and entry details are published by the managing authority on the official site.",
    "lastVerified": "2026-10-22",
    "sourceName": "Official site (see official_url)",
    "sourceUrl": "https://odysseus.culture.gr/"
  },
  "photoSpots": [
    {
      "name": "Acropolis of Athens — hero view",
      "description": "Gallery image by Jebulon (CC0), via Wikimedia Commons.",
      "mediaFileTitle": "Acropolis Parthenon Athens Greece.jpg"
    }
  ],
  "faqs": [
    {
      "q": "Where is the Acropolis of Athens?",
      "a": "Athens, Attica, Greece — at 37.9717° N, 23.7261° E (Wikidata Q131013)."
    },
    {
      "q": "Is the Acropolis of Athens a UNESCO World Heritage Site?",
      "a": "Yes — inscribed in 1987 (site 404)."
    },
    {
      "q": "What is the Acropolis of Athens known for?",
      "a": "The Acropolis is a limestone rock rising about 156 metres above sea level in the centre of Athens, crowned by the most influential buildings of classical antiquity."
    }
  ],
  "nearby": []
};

const STONEHENGE: Wonder = {
  "slug": "stonehenge",
  "name": "Stonehenge",
  "category": "Prehistoric monument",
  "wikidataQid": "Q39671",
  "unescoId": 373,
  "unescoYear": 1986,
  "cityName": "Amesbury",
  "regionName": "Wiltshire",
  "countryName": "United Kingdom",
  "lat": 51.1789,
  "lng": -1.8261,
  "timezone": "Europe/London",
  "officialUrl": "https://www.english-heritage.org.uk/visit/places/stonehenge/",
  "ticketUrl": null,
  "seoTitle": "Stonehenge: Weather, Facts, History & Myth Checks",
  "seoDescription": "Stonehenge today: live Wiltshire weather, the Welsh bluestones, solstice alignment, credited photos and myth checks.",
  "intro": [
    "Stonehenge is a prehistoric ring of standing stones on Salisbury Plain in Wiltshire, England — the most architecturally sophisticated surviving stone circle in the world, and the most famous. Its sarsen stones, capped by lintels in a unique jointed construction, were raised around 2500 BC; the circle sits inside earthworks begun centuries earlier, around 3000 BC.",
    "The monument's bluestones came from the Preseli Hills of Wales, some 240 kilometres away, while the great sarsens — averaging 25 tonnes — were sourced from woods near Marlborough, about 25 kilometres north, a feat of Neolithic logistics settled by geological fingerprinting only in 2020.",
    "Stonehenge is part of a dense ritual landscape of avenues, barrows and cursus monuments inscribed by UNESCO together with Avebury. It is owned by the Crown, managed by English Heritage, and aligned on the solstices — the Avenue points to midsummer sunrise and midwinter sunset."
  ],
  "facts": [
    {
      "label": "Built",
      "value": "In stages, c. 3000–2000 BC",
      "source": "English Heritage / UNESCO"
    },
    {
      "label": "Sarsen stones",
      "value": "Average 25 tonnes; from West Woods, ~25 km away",
      "source": "Wikipedia / 2020 source study"
    },
    {
      "label": "Bluestones",
      "value": "From the Preseli Hills, Wales, ~240 km away",
      "source": "Wikipedia"
    },
    {
      "label": "Managed by",
      "value": "English Heritage (Crown-owned)",
      "source": "English Heritage"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Site 373 · inscribed 1986 (with Avebury)",
      "source": "UNESCO"
    },
    {
      "label": "Coordinates",
      "value": "51.1789° N, 1.8261° W",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "Stonehenge's builders shaped stone with stone: the sarsens were dressed with hammerstones and joined like timber — mortise holes bored into the uprights receive tenons carved on top, and the lintels lock end-to-end with tongue-and-groove joints, a carpentry logic translated into 25-tonne masonry. The outer sarsen circle, about 33 metres across, originally carried a continuous ring of lintels, of which one arc survives intact.",
      "Inside stood five great trilithons in a horseshoe, the tallest upright about 7.4 metres. The bluestones — smaller pillars of spotted dolerite and other Welsh rocks — were rearranged several times, ending in a circle and an inner oval. Cremation burials in and around the monument span centuries, making it one of Britain's largest late-Neolithic cemeteries."
    ],
    "geniusPoints": [
      "Timber-style joints — mortise, tenon and tongue-and-groove — executed in stone",
      "The only lintelled stone circle of its kind surviving anywhere",
      "Solstice axis: the Avenue aligns on midsummer sunrise / midwinter sunset",
      "Stones sourced from two directions — Welsh bluestones, local sarsens"
    ],
    "dimensions": [
      {
        "label": "Sarsen circle diameter",
        "value": "≈33 m"
      },
      {
        "label": "Tallest trilithon upright",
        "value": "≈7.4 m"
      },
      {
        "label": "Heaviest stones",
        "value": "≈25 tonnes (sarsens)"
      }
    ],
    "materials": [
      "Sarsen (silicified sandstone)",
      "Bluestone (dolerite and others)"
    ]
  },
  "timeline": [
    {
      "year": "c. 3000 BC",
      "title": "First earthworks",
      "text": "A circular ditch and bank are dug on Salisbury Plain; cremation burials begin."
    },
    {
      "year": "c. 2500 BC",
      "title": "Stones raised",
      "text": "The sarsen circle and trilithons go up and the bluestones are set in their late arrangement."
    },
    {
      "year": "1986",
      "title": "World Heritage",
      "text": "UNESCO inscribes Stonehenge with Avebury and their associated sites."
    },
    {
      "year": "2013",
      "title": "Visitor centre opens",
      "text": "A new visitor centre opens 2.4 km away and the old road beside the stones is closed and grassed over."
    }
  ],
  "myths": [
    {
      "claim": "The Druids built Stonehenge",
      "verdict": "FALSE",
      "evidence": "The monument was already some 2,000 years old when Druids appear in the historical record. The Druid link was invented by 17th–18th-century antiquarians — though modern Druids do celebrate there today.",
      "sourceName": "Wikipedia — Stonehenge",
      "sourceUrl": "https://en.wikipedia.org/wiki/Stonehenge"
    },
    {
      "claim": "Merlin raised the stones by magic",
      "verdict": "FALSE",
      "evidence": "Geoffrey of Monmouth's 12th-century tale has Merlin move the stones from Ireland for King Arthur's uncle. A charming origin for the legend: the bluestones really did come from the far west — Wales, not Ireland, and by human hauling.",
      "sourceName": "Wikipedia — Stonehenge",
      "sourceUrl": "https://en.wikipedia.org/wiki/Stonehenge"
    },
    {
      "claim": "Nobody knows what it was for at all",
      "verdict": "PARTLY TRUE",
      "evidence": "Its solstice alignment and cremation cemetery are firmly evidenced, so \"ceremonial and burial landscape aligned on the sun\" is solid ground — but the full meaning to its builders is genuinely unrecoverable. Scholars state the evidence, not a single purpose.",
      "sourceName": "Wikipedia — Stonehenge",
      "sourceUrl": "https://en.wikipedia.org/wiki/Stonehenge"
    }
  ],
  "media": [
    {
      "fileTitle": "Maryhill stonehenge WWI monument.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0c/Maryhill_stonehenge_WWI_monument.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Maryhill_stonehenge_WWI_monument.jpg",
      "width": 2112,
      "height": 2816,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "PWhittle at English Wikipedia",
      "attribution": "\"Maryhill stonehenge WWI monument.jpg\" by PWhittle at English Wikipedia — Public domain, via Wikimedia Commons",
      "role": "hero",
      "alt": "The Stonehenge stone circle on Salisbury Plain",
      "sortOrder": 1
    },
    {
      "fileTitle": "Stonehenge, England 1979.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Stonehenge%2C_England_1979.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Stonehenge,_England_1979.jpg",
      "width": 4277,
      "height": 2613,
      "licence": "CC BY-SA 2.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "author": "John Atherton",
      "attribution": "\"Stonehenge, England 1979.jpg\" by John Atherton — CC BY-SA 2.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Stonehenge — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Stonehenge-Aotearoa.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/4/47/Stonehenge-Aotearoa.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Stonehenge-Aotearoa.jpg",
      "width": 1600,
      "height": 1074,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "The original uploader was Jackol at English Wikipedia.",
      "attribution": "\"Stonehenge-Aotearoa.jpg\" by The original uploader was Jackol at English Wikipedia. — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Stonehenge — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity and coordinates",
      "sourceName": "Wikidata — Q39671 (Stonehenge)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q39671",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status, site ID 373, inscription year 1986",
      "sourceName": "UNESCO World Heritage Centre — list 373",
      "sourceUrl": "https://whc.unesco.org/en/list/373",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Labelled facts as cited per row (managing authorities and foundations)",
      "sourceName": "Wikipedia — Stonehenge",
      "sourceUrl": "https://en.wikipedia.org/wiki/Stonehenge",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Photographs: licence and author per record",
      "sourceName": "Wikimedia Commons imageinfo",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Maryhill_stonehenge_WWI_monument.jpg",
      "checkedAt": "2026-10-22"
    }
  ],
  "visitor": {
    "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
    "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Access and entry details are published by the managing authority on the official site.",
    "lastVerified": "2026-10-22",
    "sourceName": "Official site (see official_url)",
    "sourceUrl": "https://www.english-heritage.org.uk/visit/places/stonehenge/"
  },
  "photoSpots": [
    {
      "name": "Stonehenge — hero view",
      "description": "Gallery image by PWhittle at English Wikipedia (Public domain), via Wikimedia Commons.",
      "mediaFileTitle": "Maryhill stonehenge WWI monument.jpg"
    }
  ],
  "faqs": [
    {
      "q": "Where is the Stonehenge?",
      "a": "Amesbury, Wiltshire, United Kingdom — at 51.1789° N, 1.8261° W (Wikidata Q39671)."
    },
    {
      "q": "Is the Stonehenge a UNESCO World Heritage Site?",
      "a": "Yes — inscribed in 1986 (site 373)."
    },
    {
      "q": "What is the Stonehenge known for?",
      "a": "Stonehenge is a prehistoric ring of standing stones on Salisbury Plain in Wiltshire, England — the most architecturally sophisticated surviving stone circle in the world, and the most famous."
    }
  ],
  "nearby": []
};

const SYDNEY_OPERA_HOUSE: Wonder = {
  "slug": "sydney-opera-house",
  "name": "Sydney Opera House",
  "category": "Modern architectural icon",
  "wikidataQid": "Q45178",
  "unescoId": 166,
  "unescoYear": 2007,
  "cityName": "Sydney",
  "regionName": "New South Wales",
  "countryName": "Australia",
  "lat": -33.8571,
  "lng": 151.2149,
  "timezone": "Australia/Sydney",
  "officialUrl": "https://www.sydneyoperahouse.com/",
  "ticketUrl": null,
  "seoTitle": "Sydney Opera House: Weather, Facts & History",
  "seoDescription": "Sydney Opera House today: live harbour weather, the one-sphere secret, Utzon's story, credited photos and myth checks.",
  "intro": [
    "The Sydney Opera House is a multi-venue performing arts centre at Bennelong Point on Sydney Harbour, and one of the most recognisable buildings on Earth. Its white shell vaults — universally read as sails — were designed by the Danish architect Jørn Utzon, who won the 1957 international competition with a sketch-like entry famously retrieved from the reject pile by juror Eero Saarinen.",
    "Construction began in 1959 and ran for 14 difficult years: Utzon resigned in 1966 amid cost and political disputes, and an Australian team led by Peter Hall completed the interiors. The final bill, A$102 million against a A$7 million estimate, was largely paid by a state lottery created for the purpose.",
    "Queen Elizabeth II opened the building on 20 October 1973. In 2007 UNESCO inscribed it as World Heritage Site 166 — the youngest site on the list at the time and one of very few recognised in their architect's lifetime; Utzon, who never returned to see it finished, died the following year."
  ],
  "facts": [
    {
      "label": "Opened",
      "value": "20 October 1973, by Queen Elizabeth II",
      "source": "Wikipedia"
    },
    {
      "label": "Architect",
      "value": "Jørn Utzon (1957 competition winner); interiors completed under Peter Hall",
      "source": "Wikipedia / UNESCO"
    },
    {
      "label": "Cost",
      "value": "A$102 million (estimate had been A$7 million)",
      "source": "Wikipedia"
    },
    {
      "label": "Tiles on the shells",
      "value": "1,056,006 Swedish ceramic tiles",
      "source": "Sydney Opera House"
    },
    {
      "label": "Tallest shell",
      "value": "67 m above sea level",
      "source": "Wikipedia"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Site 166 · inscribed 2007",
      "source": "UNESCO"
    },
    {
      "label": "Coordinates",
      "value": "33.8571° S, 151.2149° E",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "The breakthrough that made the shells buildable came in 1961: Utzon realised every shell could be cut from the surface of a single sphere, 185 metres in diameter. That one geometry let the ribs be mass-produced as precast segments from repeated moulds — a sculptural idea rescued by industrial logic. The shells rest on a vast podium that houses the two main halls in its roofline.",
      "Inside, the Concert Hall and Opera Theatre sit side by side under the two largest shell groups — a plan that forced the halls' long axes parallel to the harbour, one of the design's famous compromises. The podium's beech and white birch interiors, and Hall's completion of Utzon's concepts, give the building its warm counterpoint to the tiled exterior."
    ],
    "geniusPoints": [
      "All shells derived from one sphere — the geometric key to the whole building",
      "Over a million tiles that never need cleaning: rain washes the glossy/matte chevron pattern",
      "The podium contains the city: foyers, halls and services under one platform",
      "A competition sketch, fished from the rejects, became a national symbol"
    ],
    "dimensions": [
      {
        "label": "Tallest shell",
        "value": "67 m"
      },
      {
        "label": "Building length",
        "value": "185 m"
      },
      {
        "label": "Width",
        "value": "120 m"
      },
      {
        "label": "Tiles",
        "value": "1,056,006"
      }
    ],
    "materials": [
      "Precast concrete ribs",
      "Ceramic tiles (Höganäs)",
      "Glass",
      "Australian white birch and brush box"
    ]
  },
  "timeline": [
    {
      "year": "1957",
      "title": "Utzon wins the competition",
      "text": "Jørn Utzon's entry — initially set aside — is championed by Eero Saarinen and wins."
    },
    {
      "year": "1966",
      "title": "Utzon resigns",
      "text": "After a change of government and payment disputes, Utzon resigns and leaves Australia; Peter Hall's team takes over."
    },
    {
      "year": "1973",
      "title": "Opening",
      "text": "Queen Elizabeth II opens the Sydney Opera House on 20 October 1973."
    },
    {
      "year": "2007",
      "title": "World Heritage",
      "text": "UNESCO lists the building — among the youngest sites ever inscribed, and Utzon is alive to hear it."
    }
  ],
  "myths": [
    {
      "claim": "The shells are sails copied from yachts",
      "verdict": "PARTLY TRUE",
      "evidence": "Utzon never confirmed a single source: peeled orange segments, Mayan platforms and the harbour's sails are all cited. What is certain is the geometry — every shell is a slice of one sphere.",
      "sourceName": "Wikipedia — Sydney Opera House",
      "sourceUrl": "https://en.wikipedia.org/wiki/Sydney_Opera_House"
    },
    {
      "claim": "Utzon was fired for incompetence",
      "verdict": "FALSE",
      "evidence": "He resigned after the new state government withheld payments and refused his fee claim amid a political fight over costs — a dispute about money and control, later widely regretted; NSW formally reconciled with him in the 1990s.",
      "sourceName": "Wikipedia — Sydney Opera House",
      "sourceUrl": "https://en.wikipedia.org/wiki/Sydney_Opera_House"
    },
    {
      "claim": "The acoustics were always perfect",
      "verdict": "FALSE",
      "evidence": "The halls' acoustics were long criticised, and the Concert Hall underwent a major renewal (completed 2022) that rebuilt its acoustic reflectors and staging — the sound today is a 2020s achievement, not a 1973 one.",
      "sourceName": "Wikipedia — Sydney Opera House",
      "sourceUrl": "https://en.wikipedia.org/wiki/Sydney_Opera_House"
    }
  ],
  "media": [
    {
      "fileTitle": "ESEAP 2022 dinner cruise - Sydney Harbour Bridge and Sydney Opera House - view from the waters.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/2/26/ESEAP_2022_dinner_cruise_-_Sydney_Harbour_Bridge_and_Sydney_Opera_House_-_view_from_the_waters.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:ESEAP_2022_dinner_cruise_-_Sydney_Harbour_Bridge_and_Sydney_Opera_House_-_view_from_the_waters.jpg",
      "width": 5751,
      "height": 3834,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Robertsky",
      "attribution": "\"ESEAP 2022 dinner cruise - Sydney Harbour Bridge and Sydney Opera House - view from the waters.jpg\" by Robertsky — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "The Sydney Opera House shells on the harbour at Bennelong Point",
      "sortOrder": 1
    },
    {
      "fileTitle": "MC Sydney Opera House.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/4/45/MC_Sydney_Opera_House.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:MC_Sydney_Opera_House.jpg",
      "width": 5131,
      "height": 1750,
      "licence": "CC BY 2.5",
      "licenceUrl": "https://creativecommons.org/licenses/by/2.5",
      "author": "Christian Mehlführer, User:Chmehl",
      "attribution": "\"MC Sydney Opera House.jpg\" by Christian Mehlführer, User:Chmehl — CC BY 2.5, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Sydney Opera House — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Sydney (AU), View from Opera House, Harbour Bridge -- 2019 -- 3070.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/3/33/Sydney_%28AU%29%2C_View_from_Opera_House%2C_Harbour_Bridge_--_2019_--_3070.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Sydney_(AU),_View_from_Opera_House,_Harbour_Bridge_--_2019_--_3070.jpg",
      "width": 6720,
      "height": 3780,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Dietmar Rabich",
      "attribution": "\"Sydney (AU), View from Opera House, Harbour Bridge -- 2019 -- 3070.jpg\" by Dietmar Rabich — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Sydney Opera House — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity and coordinates",
      "sourceName": "Wikidata — Q45178 (Sydney Opera House)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q45178",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status, site ID 166, inscription year 2007",
      "sourceName": "UNESCO World Heritage Centre — list 166",
      "sourceUrl": "https://whc.unesco.org/en/list/166",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Labelled facts as cited per row (managing authorities and foundations)",
      "sourceName": "Wikipedia — Sydney Opera House",
      "sourceUrl": "https://en.wikipedia.org/wiki/Sydney_Opera_House",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Photographs: licence and author per record",
      "sourceName": "Wikimedia Commons imageinfo",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:ESEAP_2022_dinner_cruise_-_Sydney_Harbour_Bridge_and_Sydney_Opera_House_-_view_from_the_waters.jpg",
      "checkedAt": "2026-10-22"
    }
  ],
  "visitor": {
    "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
    "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Access and entry details are published by the managing authority on the official site.",
    "lastVerified": "2026-10-22",
    "sourceName": "Official site (see official_url)",
    "sourceUrl": "https://www.sydneyoperahouse.com/"
  },
  "photoSpots": [
    {
      "name": "Sydney Opera House — hero view",
      "description": "Gallery image by Robertsky (CC BY-SA 4.0), via Wikimedia Commons.",
      "mediaFileTitle": "ESEAP 2022 dinner cruise - Sydney Harbour Bridge and Sydney Opera House - view from the waters.jpg"
    }
  ],
  "faqs": [
    {
      "q": "Where is the Sydney Opera House?",
      "a": "Sydney, New South Wales, Australia — at 33.8571° S, 151.2149° E (Wikidata Q45178)."
    },
    {
      "q": "Is the Sydney Opera House a UNESCO World Heritage Site?",
      "a": "Yes — inscribed in 2007 (site 166)."
    },
    {
      "q": "What is the Sydney Opera House known for?",
      "a": "The Sydney Opera House is a multi-venue performing arts centre at Bennelong Point on Sydney Harbour, and one of the most recognisable buildings on Earth."
    }
  ],
  "nearby": []
};

const HAGIA_SOPHIA: Wonder = {
  "slug": "hagia-sophia",
  "name": "Hagia Sophia",
  "category": "Historic religious landmark",
  "wikidataQid": "Q12506",
  "unescoId": 356,
  "unescoYear": 1985,
  "cityName": "Istanbul",
  "regionName": "Marmara",
  "countryName": "Turkey",
  "lat": 41.0083,
  "lng": 28.98,
  "timezone": "Europe/Istanbul",
  "officialUrl": "https://muze.gov.tr/",
  "ticketUrl": null,
  "seoTitle": "Hagia Sophia: Weather, Facts, History & Guide",
  "seoDescription": "Hagia Sophia today: live Istanbul weather, the floating dome, 1,500 years of history, credited photos and myth checks.",
  "intro": [
    "Hagia Sophia — the Church of the Holy Wisdom — was built in Constantinople in just five years, from 532 to 537, on the orders of the emperor Justinian I. Its architects, Anthemius of Tralles and Isidore of Miletus, were mathematicians, and their vast dome, 31 metres across and floating on a ring of 40 windows, seemed to contemporaries to hang from heaven by a chain.",
    "For nearly a thousand years it was the largest cathedral in the world and the seat of the Ecumenical Patriarch; in 1453 it became an imperial Ottoman mosque, gaining its minarets, mihrab and great calligraphic roundels. In 1935 the Turkish Republic made it a museum, and in 2020 it returned to use as a mosque, with its Byzantine mosaics preserved under a managed covering regime during prayers.",
    "Hagia Sophia stands in Istanbul's Sultanahmet district within the Historic Areas of Istanbul, inscribed by UNESCO in 1985. Its dome-and-semi-dome cascade invented the architecture that Ottoman masters — above all Sinan, whose own tomb-side buttresses brace the building — spent centuries answering."
  ],
  "facts": [
    {
      "label": "Built",
      "value": "532–537, under Justinian I",
      "source": "Wikipedia / UNESCO"
    },
    {
      "label": "Architects",
      "value": "Anthemius of Tralles and Isidore of Miletus",
      "source": "Wikipedia"
    },
    {
      "label": "Dome",
      "value": "31 m diameter; crown 55 m above the floor",
      "source": "Wikipedia"
    },
    {
      "label": "Record",
      "value": "Largest cathedral in the world for nearly 1,000 years",
      "source": "Wikipedia"
    },
    {
      "label": "Lives",
      "value": "Cathedral (537–1453) · mosque (1453–1931) · museum (1935–2020) · mosque (2020–)",
      "source": "Wikipedia"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Within site 356, Historic Areas of Istanbul · inscribed 1985",
      "source": "UNESCO"
    },
    {
      "label": "Coordinates",
      "value": "41.0083° N, 28.98° E",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "The plan fuses a basilica's long nave with a central dome carried on four colossal piers through pendentives — the triangular surfaces that let a round dome sit on a square bay, perfected here at unprecedented scale. East and west, great semi-domes cascade the thrust outward, and the ring of windows at the dome's base dissolves its apparent weight: Procopius wrote that it seemed suspended from heaven.",
      "The interior layered imperial and sacred ceremony: a marble-revetted nave, galleries for the court, and over the apse the great mosaic of the Virgin and Child (inaugurated 867). Ottoman additions — Sinan's external buttresses, the sultan's lodge, the eight 7.5-metre calligraphy roundels — were absorbed without erasing the Byzantine shell, which is precisely the building's UNESCO value."
    ],
    "geniusPoints": [
      "Pendentives at full scale — a round dome on a square hall, solved in 537",
      "A dome that appears to float on its ring of 40 windows",
      "Semi-domes cascade the structure east and west",
      "Sinan's buttresses: the greatest Ottoman architect shoring up a Byzantine church"
    ],
    "dimensions": [
      {
        "label": "Dome diameter",
        "value": "31 m"
      },
      {
        "label": "Height to dome crown",
        "value": "55 m"
      },
      {
        "label": "Nave",
        "value": "≈74 × 70 m"
      },
      {
        "label": "Calligraphic roundels",
        "value": "7.5 m diameter"
      }
    ],
    "materials": [
      "Stone and brick",
      "Marble revetment",
      "Mosaic (gold tesserae)"
    ]
  },
  "timeline": [
    {
      "year": "537",
      "title": "Consecrated",
      "text": "Justinian's cathedral is dedicated on 27 December 537 — legend has him say \"Solomon, I have surpassed thee.\""
    },
    {
      "year": "1453",
      "title": "Becomes a mosque",
      "text": "After the Ottoman conquest, Mehmed II converts Hagia Sophia into an imperial mosque."
    },
    {
      "year": "1935",
      "title": "Opens as a museum",
      "text": "The Turkish Republic secularises the building; it opens as a museum and the mosaics are progressively uncovered."
    },
    {
      "year": "2020",
      "title": "Mosque again",
      "text": "Hagia Sophia returns to worship as a mosque while remaining open to visitors outside prayer times."
    }
  ],
  "myths": [
    {
      "claim": "The dome is held up by a golden chain from heaven",
      "verdict": "FALSE",
      "evidence": "A medieval description of its floating effect, not engineering: the dome is carried by pendentives and piers, and has been repaired after earthquakes many times — including a partial collapse in 558, rebuilt by Isidore the Younger.",
      "sourceName": "Wikipedia — Hagia Sophia",
      "sourceUrl": "https://en.wikipedia.org/wiki/Hagia_Sophia"
    },
    {
      "claim": "It was built as a mosque",
      "verdict": "FALSE",
      "evidence": "It was a Christian cathedral for 916 years before becoming a mosque in 1453 — the minarets, mihrab and roundels are Ottoman additions to a Byzantine church.",
      "sourceName": "Wikipedia — Hagia Sophia",
      "sourceUrl": "https://en.wikipedia.org/wiki/Hagia_Sophia"
    },
    {
      "claim": "The mosaics were destroyed",
      "verdict": "FALSE",
      "evidence": "Many were covered — plastered or veiled — rather than destroyed, which is why conservators could uncover the apse Virgin, the Deësis and imperial portraits in the 20th century; arrangements today keep them preserved outside prayer coverings.",
      "sourceName": "Wikipedia — Hagia Sophia",
      "sourceUrl": "https://en.wikipedia.org/wiki/Hagia_Sophia"
    }
  ],
  "media": [
    {
      "fileTitle": "2017-09-01 Turkey, Istanbul DSC 3529 DxO 1 AF.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/2/22/2017-09-01_Turkey%2C_Istanbul_DSC_3529_DxO_1_AF.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:2017-09-01_Turkey,_Istanbul_DSC_3529_DxO_1_AF.jpg",
      "width": 2848,
      "height": 4459,
      "licence": "CC BY 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/4.0",
      "author": "Laurens R. Krol",
      "attribution": "\"2017-09-01 Turkey, Istanbul DSC 3529 DxO 1 AF.jpg\" by Laurens R. Krol — CC BY 4.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "Hagia Sophia with its dome and minarets in Istanbul",
      "sortOrder": 1
    },
    {
      "fileTitle": "2017-09-01 Turkey, Istanbul DSC 3548 DxO.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5c/2017-09-01_Turkey%2C_Istanbul_DSC_3548_DxO.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:2017-09-01_Turkey,_Istanbul_DSC_3548_DxO.jpg",
      "width": 2765,
      "height": 4165,
      "licence": "CC BY 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/4.0",
      "author": "Laurens R. Krol",
      "attribution": "\"2017-09-01 Turkey, Istanbul DSC 3548 DxO.jpg\" by Laurens R. Krol — CC BY 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Hagia Sophia — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Apse mosaic Hagia Sophia Virgin and Child.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Apse_mosaic_Hagia_Sophia_Virgin_and_Child.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Apse_mosaic_Hagia_Sophia_Virgin_and_Child.jpg",
      "width": 2078,
      "height": 2948,
      "licence": "Public domain",
      "licenceUrl": "",
      "author": "Photograph: Myrabella",
      "attribution": "\"Apse mosaic Hagia Sophia Virgin and Child.jpg\" by Photograph: Myrabella — Public domain, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Hagia Sophia — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity and coordinates",
      "sourceName": "Wikidata — Q12506 (Hagia Sophia)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q12506",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status, site ID 356, inscription year 1985",
      "sourceName": "UNESCO World Heritage Centre — list 356",
      "sourceUrl": "https://whc.unesco.org/en/list/356",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Labelled facts as cited per row (managing authorities and foundations)",
      "sourceName": "Wikipedia — Hagia Sophia",
      "sourceUrl": "https://en.wikipedia.org/wiki/Hagia_Sophia",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Photographs: licence and author per record",
      "sourceName": "Wikimedia Commons imageinfo",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:2017-09-01_Turkey,_Istanbul_DSC_3529_DxO_1_AF.jpg",
      "checkedAt": "2026-10-22"
    }
  ],
  "visitor": {
    "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
    "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Access and entry details are published by the managing authority on the official site.",
    "lastVerified": "2026-10-22",
    "sourceName": "Official site (see official_url)",
    "sourceUrl": "https://muze.gov.tr/"
  },
  "photoSpots": [
    {
      "name": "Hagia Sophia — hero view",
      "description": "Gallery image by Laurens R. Krol (CC BY 4.0), via Wikimedia Commons.",
      "mediaFileTitle": "2017-09-01 Turkey, Istanbul DSC 3529 DxO 1 AF.jpg"
    }
  ],
  "faqs": [
    {
      "q": "Where is the Hagia Sophia?",
      "a": "Istanbul, Marmara, Turkey — at 41.0083° N, 28.98° E (Wikidata Q12506)."
    },
    {
      "q": "Is the Hagia Sophia a UNESCO World Heritage Site?",
      "a": "Yes — inscribed in 1985 (site 356)."
    },
    {
      "q": "What is the Hagia Sophia known for?",
      "a": "Hagia Sophia — the Church of the Holy Wisdom — was built in Constantinople in just five years, from 532 to 537, on the orders of the emperor Justinian I."
    }
  ],
  "nearby": []
};

const ST_PETERS_BASILICA: Wonder = {
  "slug": "st-peters-basilica",
  "name": "St Peter's Basilica",
  "category": "Religious landmark",
  "wikidataQid": "Q12512",
  "unescoId": 286,
  "unescoYear": 1984,
  "cityName": "Vatican City",
  "regionName": "Vatican City",
  "countryName": "Vatican City",
  "lat": 41.9022,
  "lng": 12.4534,
  "timezone": "Europe/Rome",
  "officialUrl": "https://www.basilicasanpietro.va/",
  "ticketUrl": null,
  "seoTitle": "St Peter's Basilica: Weather, Facts & Guide",
  "seoDescription": "St Peter's Basilica today: live Vatican weather, Michelangelo's dome, Bernini's bronze, credited photos and myth checks.",
  "intro": [
    "St Peter's Basilica in Vatican City is the largest church in the world by interior measure and the centre of Roman Catholic devotion. Raised over the Constantinian basilica that stood for 1,200 years, the present church was begun in 1506 and consecrated in 1626 — a 120-year project that passed through Bramante, Raphael, Michelangelo and Bernini.",
    "Michelangelo's dome, completed after his death by Giacomo della Porta, rises 136.6 metres to the cross and remains the tallest dome in the world. Inside are Michelangelo's Pietà (carved at 24), Bernini's bronze Baldacchino over the papal altar, and beneath the altar the tomb traditionally identified as St Peter's.",
    "The basilica stands at the head of Bernini's elliptical St Peter's Square, within the Vatican City World Heritage Site (inscribed 1984). It is a pilgrimage church rather than Rome's cathedral — that honour belongs to St John Lateran — but no church on Earth receives more visitors."
  ],
  "facts": [
    {
      "label": "Built",
      "value": "1506–1626 (consecrated 18 November 1626)",
      "source": "Wikipedia"
    },
    {
      "label": "Dome",
      "value": "Designed by Michelangelo; 136.6 m to the cross — the world's tallest dome",
      "source": "Wikipedia"
    },
    {
      "label": "Interior length",
      "value": "186 m",
      "source": "Wikipedia"
    },
    {
      "label": "Capacity",
      "value": "Over 60,000 people",
      "source": "Wikipedia"
    },
    {
      "label": "Artists",
      "value": "Bramante, Michelangelo, Bernini, Maderno",
      "source": "Wikipedia"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Within site 286, Vatican City · inscribed 1984",
      "source": "UNESCO"
    },
    {
      "label": "Coordinates",
      "value": "41.9022° N, 12.4534° E",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "The plan is a palimpsest of Renaissance ambitions: Bramante's Greek cross, Michelangelo's tightened central plan — which governs the dome and the west end — and Maderno's extended nave and façade, added so the church could hold the crowds of the Counter-Reformation. The result reads as one overwhelming space: a barrel-vaulted nave 90 metres wide in effect, with the dome opening above the crossing.",
      "Bernini finished the interior's theatre: the Baldacchino (1624–33), a 28.7-metre twisted-column canopy in bronze partly stripped from the Pantheon's portico, and at the far end the Cathedra Petri, a gilded throne around the chair tradition assigns to St Peter, lit by an alabaster window of the Holy Spirit."
    ],
    "geniusPoints": [
      "Michelangelo modelled the dome on Florence's — and made it bigger",
      "The Baldacchino's bronze came in part from the Pantheon's roof",
      "Letters around the nave are 2 m tall — the scale deceives every visitor",
      "The Pietà is the only work Michelangelo ever signed"
    ],
    "dimensions": [
      {
        "label": "Height to cross",
        "value": "136.6 m"
      },
      {
        "label": "Interior length",
        "value": "186 m"
      },
      {
        "label": "Nave vault height",
        "value": "46 m"
      },
      {
        "label": "Baldacchino",
        "value": "28.7 m"
      }
    ],
    "materials": [
      "Travertine",
      "Marble",
      "Bronze",
      "Gilded stucco"
    ]
  },
  "timeline": [
    {
      "year": "1506",
      "title": "Foundation stone",
      "text": "Julius II lays the first stone of the new basilica over the old Constantinian church."
    },
    {
      "year": "1546",
      "title": "Michelangelo takes over",
      "text": "Aged 71, Michelangelo becomes architect and designs the dome — his model still governs the silhouette."
    },
    {
      "year": "1626",
      "title": "Consecrated",
      "text": "Urban VIII consecrates the completed basilica, 1,300 years after the first."
    },
    {
      "year": "1984",
      "title": "World Heritage",
      "text": "Vatican City, basilica included, is inscribed by UNESCO."
    }
  ],
  "myths": [
    {
      "claim": "It is the largest church ever built",
      "verdict": "TRUE",
      "evidence": "Measured by interior volume and area, yes — St Peter's is the largest church in the world. The claim needs the qualifier: some churches seat more or stand taller, but none encloses more.",
      "sourceName": "Wikipedia — St Peter's Basilica",
      "sourceUrl": "https://en.wikipedia.org/wiki/St_Peter's_Basilica"
    },
    {
      "claim": "Michelangelo painted the ceiling here",
      "verdict": "FALSE",
      "evidence": "The Sistine Chapel ceiling is a different room — the chapel is in the Apostolic Palace next door, part of the Vatican Museums route, not inside the basilica.",
      "sourceName": "Wikipedia — St Peter's Basilica",
      "sourceUrl": "https://en.wikipedia.org/wiki/St_Peter's_Basilica"
    },
    {
      "claim": "St Peter is certainly buried under the altar",
      "verdict": "PARTLY TRUE",
      "evidence": "A tomb beneath the confessio was excavated in the 1940s and bones were later identified by the Vatican as the Apostle's; scholars remain divided. The page states the tradition and the finding, not a certainty.",
      "sourceName": "Wikipedia — St Peter's Basilica",
      "sourceUrl": "https://en.wikipedia.org/wiki/St_Peter's_Basilica"
    }
  ],
  "media": [
    {
      "fileTitle": "01 St Peter's Basilica Facade.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3c/01_St_Peter%27s_Basilica_Facade.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:01_St_Peter%27s_Basilica_Facade.jpg",
      "width": 6000,
      "height": 4500,
      "licence": "CC BY 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/4.0",
      "author": "NateBergin",
      "attribution": "\"01 St Peter's Basilica Facade.jpg\" by NateBergin — CC BY 4.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "St Peter's Basilica and its dome from St Peter's Square",
      "sortOrder": 1
    },
    {
      "fileTitle": "Basilica di San Pietro in Vaticano September 2015-1a.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f5/Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg",
      "width": 13066,
      "height": 6823,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Alvesgaspar",
      "attribution": "\"Basilica di San Pietro in Vaticano September 2015-1a.jpg\" by Alvesgaspar — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "St Peter's Basilica — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Facade of St. Peter's Basilica.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Facade_of_St._Peter%27s_Basilica.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Facade_of_St._Peter%27s_Basilica.jpg",
      "width": 3072,
      "height": 2304,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
      "author": "Wknight94",
      "attribution": "\"Facade of St. Peter's Basilica.jpg\" by Wknight94 — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "St Peter's Basilica — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity and coordinates",
      "sourceName": "Wikidata — Q12512 (St Peter's Basilica)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q12512",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status, site ID 286, inscription year 1984",
      "sourceName": "UNESCO World Heritage Centre — list 286",
      "sourceUrl": "https://whc.unesco.org/en/list/286",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Labelled facts as cited per row (managing authorities and foundations)",
      "sourceName": "Wikipedia — St Peter's Basilica",
      "sourceUrl": "https://en.wikipedia.org/wiki/St_Peter's_Basilica",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Photographs: licence and author per record",
      "sourceName": "Wikimedia Commons imageinfo",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:01_St_Peter%27s_Basilica_Facade.jpg",
      "checkedAt": "2026-10-22"
    }
  ],
  "visitor": {
    "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
    "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Access and entry details are published by the managing authority on the official site.",
    "lastVerified": "2026-10-22",
    "sourceName": "Official site (see official_url)",
    "sourceUrl": "https://www.basilicasanpietro.va/"
  },
  "photoSpots": [
    {
      "name": "St Peter's Basilica — hero view",
      "description": "Gallery image by NateBergin (CC BY 4.0), via Wikimedia Commons.",
      "mediaFileTitle": "01 St Peter's Basilica Facade.jpg"
    }
  ],
  "faqs": [
    {
      "q": "Where is the St Peter's Basilica?",
      "a": "Vatican City, Vatican City, Vatican City — at 41.9022° N, 12.4534° E (Wikidata Q12512)."
    },
    {
      "q": "Is the St Peter's Basilica a UNESCO World Heritage Site?",
      "a": "Yes — inscribed in 1984 (site 286)."
    },
    {
      "q": "What is the St Peter's Basilica known for?",
      "a": "St Peter's Basilica in Vatican City is the largest church in the world by interior measure and the centre of Roman Catholic devotion."
    }
  ],
  "nearby": []
};

const SAGRADA_FAMILIA: Wonder = {
  "slug": "sagrada-familia",
  "name": "Sagrada Família",
  "category": "Architectural icon",
  "wikidataQid": "Q48435",
  "unescoId": 320,
  "unescoYear": 1984,
  "cityName": "Barcelona",
  "regionName": "Catalonia",
  "countryName": "Spain",
  "lat": 41.4037,
  "lng": 2.1743,
  "timezone": "Europe/Madrid",
  "officialUrl": "https://sagradafamilia.org/",
  "ticketUrl": null,
  "seoTitle": "Sagrada Família: Weather, Facts & Gaudí Guide",
  "seoDescription": "Sagrada Família today: live Barcelona weather, Gaudí's stone forest, completion facts, credited photos and myth checks.",
  "intro": [
    "The Basílica de la Sagrada Família is Antoni Gaudí's unfinished masterpiece in Barcelona's Eixample district — under construction since 1882 and, by design, a building its architect knew he would never see finished. Gaudí took over in 1883, aged 31, and devoted the last 43 years of his life to it, living on site at the end; he is buried in its crypt.",
    "Gaudí's church replaces Gothic structure with geometry drawn from nature: columns that branch like trees, hyperboloid vaults that pour light down the nave, and three grand façades — Nativity (the only one he saw substantially complete), Passion (sculpted by Subirachs) and the still-rising Glory. Pope Benedict XVI consecrated it as a basilica in 2010, with the interior complete enough for worship.",
    "When its central Tower of Jesus Christ reaches the planned 172.5 metres — just under Montjuïc hill, as Gaudí insisted man's work should not exceed God's — the Sagrada Família will be the tallest church building in the world. UNESCO inscribed the crypt and Nativity façade within the Works of Antoni Gaudí in 1984."
  ],
  "facts": [
    {
      "label": "Construction began",
      "value": "19 March 1882",
      "source": "Wikipedia / Sagrada Família"
    },
    {
      "label": "Architect",
      "value": "Antoni Gaudí (from 1883 until his death in 1926)",
      "source": "Wikipedia"
    },
    {
      "label": "Consecrated",
      "value": "7 November 2010, by Pope Benedict XVI",
      "source": "Wikipedia"
    },
    {
      "label": "Planned height",
      "value": "172.5 m (central tower)",
      "source": "Sagrada Família"
    },
    {
      "label": "Funding",
      "value": "Built entirely from donations and visitor income — no church or state money",
      "source": "Sagrada Família Foundation"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Crypt and Nativity façade within site 320, Works of Antoni Gaudí · 1984/2005",
      "source": "UNESCO"
    },
    {
      "label": "Coordinates",
      "value": "41.4037° N, 2.1743° E",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "Gaudí worked out the structure hanging upside-down: a weighted-string model (the funicular model) whose inverted image gives columns that lean exactly along the lines of force. Inside, the columns branch like a stone forest, splitting to carry the vaults, and hyperboloid windows wash the nave in coloured light that shifts from morning blues to evening reds across the stained glass.",
      "The building is a Bible in stone: the Nativity façade teems with life, the Passion façade is gaunt and angular, and the Glory façade — the main entrance — is still under construction. Gaudí left plaster models rather than full drawings; smashed in the Civil War, they were painstakingly reassembled, and today's builders work from the fragments, Gaudí's surviving drawings, and the geometry rules he set down."
    ],
    "geniusPoints": [
      "A church designed from a hanging model of strings and weights",
      "Columns that branch like trees — structure copied from a forest",
      "Morning light arrives blue-green, evening light red-gold, by design of the glass",
      "Gaudí is buried in the crypt of his own unfinished church"
    ],
    "dimensions": [
      {
        "label": "Planned central tower",
        "value": "172.5 m"
      },
      {
        "label": "Nave vault height",
        "value": "45 m"
      },
      {
        "label": "Towers planned",
        "value": "18 (12 apostles, 4 evangelists, Virgin, Jesus)"
      },
      {
        "label": "Site",
        "value": "≈12,800 m²"
      }
    ],
    "materials": [
      "Stone (Montjuïc and others)",
      "Brick",
      "Reinforced concrete (modern phases)",
      "Stained glass"
    ]
  },
  "timeline": [
    {
      "year": "1882",
      "title": "First stone",
      "text": "Construction begins under architect Francisco de Paula del Villar; Gaudí takes over the next year."
    },
    {
      "year": "1926",
      "title": "Gaudí dies",
      "text": "Gaudí is struck by a tram and dies on 10 June 1926; he is buried in the crypt, the work roughly a quarter done."
    },
    {
      "year": "2010",
      "title": "Consecrated as a basilica",
      "text": "With the nave roofed, Benedict XVI consecrates the church for worship."
    },
    {
      "year": "2026",
      "title": "Centenary programme",
      "text": "The centenary of Gaudí's death focuses on completing the central tower — the tower of Jesus Christ topped by its cross."
    }
  ],
  "myths": [
    {
      "claim": "It will be finished in 2026",
      "verdict": "FALSE",
      "evidence": "2026 was a widely repeated target tied to the Gaudí centenary, and the central tower's completion is its centrepiece — but the whole church, including the Glory façade and its staircase, is a longer programme. \"Finished\" headlines should be read as tower headlines.",
      "sourceName": "Wikipedia — Sagrada Família",
      "sourceUrl": "https://en.wikipedia.org/wiki/Sagrada_Família"
    },
    {
      "claim": "Gaudí designed every part you see",
      "verdict": "FALSE",
      "evidence": "Gaudí left models and rules, not a complete design: the Passion façade's sculpture is Josep Maria Subirachs's (1987–2009), and later towers follow Gaudí's geometry executed by successor architects.",
      "sourceName": "Wikipedia — Sagrada Família",
      "sourceUrl": "https://en.wikipedia.org/wiki/Sagrada_Família"
    },
    {
      "claim": "It is Barcelona's cathedral",
      "verdict": "FALSE",
      "evidence": "Barcelona's cathedral is the Gothic Cathedral of the Holy Cross in the old town. The Sagrada Família is a basilica and parish church — an expiatory temple funded by penance and donations.",
      "sourceName": "Wikipedia — Sagrada Família",
      "sourceUrl": "https://en.wikipedia.org/wiki/Sagrada_Família"
    }
  ],
  "media": [
    {
      "fileTitle": "(Barcelona) Armchair dissenyat per Antoni Gaudí - Sagrada Familia.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/7/75/%28Barcelona%29_Armchair_dissenyat_per_Antoni_Gaud%C3%AD_-_Sagrada_Familia.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:(Barcelona)_Armchair_dissenyat_per_Antoni_Gaud%C3%AD_-_Sagrada_Familia.jpg",
      "width": 10180,
      "height": 13043,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Didier Descouens",
      "attribution": "\"(Barcelona) Armchair dissenyat per Antoni Gaudí - Sagrada Familia.jpg\" by Didier Descouens — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "The Sagrada Família towers rising over Barcelona",
      "sortOrder": 1
    },
    {
      "fileTitle": "(Barcelona) Bastidors d'espelmes votives - dissenyat per Antoni Gaudí - Sagrada Familia.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/7/71/%28Barcelona%29_Bastidors_d%27espelmes_votives_-_dissenyat_per_Antoni_Gaud%C3%AD_-_Sagrada_Familia.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:(Barcelona)_Bastidors_d%27espelmes_votives_-_dissenyat_per_Antoni_Gaud%C3%AD_-_Sagrada_Familia.jpg",
      "width": 9012,
      "height": 6259,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Didier Descouens",
      "attribution": "\"(Barcelona) Bastidors d'espelmes votives - dissenyat per Antoni Gaudí - Sagrada Familia.jpg\" by Didier Descouens — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Sagrada Família — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "(Barcelona) Confessionari dissenyat per Antoni Gaudí - Sagrada Familia.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cd/%28Barcelona%29_Confessionari_dissenyat_per_Antoni_Gaud%C3%AD_-_Sagrada_Familia.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:(Barcelona)_Confessionari_dissenyat_per_Antoni_Gaud%C3%AD_-_Sagrada_Familia.jpg",
      "width": 6637,
      "height": 7216,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Didier Descouens",
      "attribution": "\"(Barcelona) Confessionari dissenyat per Antoni Gaudí - Sagrada Familia.jpg\" by Didier Descouens — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Sagrada Família — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity and coordinates",
      "sourceName": "Wikidata — Q48435 (Sagrada Família)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q48435",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status, site ID 320, inscription year 1984",
      "sourceName": "UNESCO World Heritage Centre — list 320",
      "sourceUrl": "https://whc.unesco.org/en/list/320",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Labelled facts as cited per row (managing authorities and foundations)",
      "sourceName": "Wikipedia — Sagrada Família",
      "sourceUrl": "https://en.wikipedia.org/wiki/Sagrada_Família",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Photographs: licence and author per record",
      "sourceName": "Wikimedia Commons imageinfo",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:(Barcelona)_Armchair_dissenyat_per_Antoni_Gaud%C3%AD_-_Sagrada_Familia.jpg",
      "checkedAt": "2026-10-22"
    }
  ],
  "visitor": {
    "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
    "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Access and entry details are published by the managing authority on the official site.",
    "lastVerified": "2026-10-22",
    "sourceName": "Official site (see official_url)",
    "sourceUrl": "https://sagradafamilia.org/"
  },
  "photoSpots": [
    {
      "name": "Sagrada Família — hero view",
      "description": "Gallery image by Didier Descouens (CC BY-SA 4.0), via Wikimedia Commons.",
      "mediaFileTitle": "(Barcelona) Armchair dissenyat per Antoni Gaudí - Sagrada Familia.jpg"
    }
  ],
  "faqs": [
    {
      "q": "Where is the Sagrada Família?",
      "a": "Barcelona, Catalonia, Spain — at 41.4037° N, 2.1743° E (Wikidata Q48435)."
    },
    {
      "q": "Is the Sagrada Família a UNESCO World Heritage Site?",
      "a": "Yes — inscribed in 1984 (site 320)."
    },
    {
      "q": "What is the Sagrada Família known for?",
      "a": "The Basílica de la Sagrada Família is Antoni Gaudí's unfinished masterpiece in Barcelona's Eixample district — under construction since 1882 and, by design, a building its architect knew he would never see finished."
    }
  ],
  "nearby": []
};

const NEUSCHWANSTEIN_CASTLE: Wonder = {
  "slug": "neuschwanstein-castle",
  "name": "Neuschwanstein Castle",
  "category": "Castle landmark",
  "wikidataQid": "Q4152",
  "unescoId": 1726,
  "unescoYear": 2025,
  "cityName": "Schwangau",
  "regionName": "Bavaria",
  "countryName": "Germany",
  "lat": 47.5575,
  "lng": 10.7494,
  "timezone": "Europe/Berlin",
  "officialUrl": "https://www.neuschwanstein.de/",
  "ticketUrl": null,
  "seoTitle": "Neuschwanstein Castle: Weather, Facts & Guide",
  "seoDescription": "Neuschwanstein today: live Bavarian weather, Ludwig II's 172 days, the Disney connection, photos and myth checks.",
  "intro": [
    "Neuschwanstein is a 19th-century Romantic palace on a crag above the village of Hohenschwangau in southwest Bavaria, near the Austrian border. King Ludwig II of Bavaria commissioned it in 1868 as a private refuge and a stage set for the operas of Richard Wagner — its very name, and rooms like the Singers' Hall, are quotations from Lohengrin and Tannhäuser.",
    "The castle was designed not by an architect alone but by the stage designer Christian Jank, whose theatrical sketches Ludwig approved view by view. Inside, the king installed technology far ahead of the fairy-tale shell: running water and flushing toilets on every floor, a warm-air heating system, an electric bell system for servants, and one of the first mobile telephones.",
    "Ludwig lived in the castle for only 172 days before his deposition and death in 1886; weeks later it opened to paying visitors and has never closed its appeal since. In 2025 UNESCO inscribed it within The Palaces of King Ludwig II (Site 1726). Its silhouette, reworked, became the Sleeping Beauty Castle at Disneyland."
  ],
  "facts": [
    {
      "label": "Commissioned",
      "value": "1868, by King Ludwig II of Bavaria",
      "source": "Wikipedia"
    },
    {
      "label": "First stone",
      "value": "5 September 1869",
      "source": "Wikipedia"
    },
    {
      "label": "Designer",
      "value": "Christian Jank (stage designer); architects Eduard Riedel, Georg von Dollmann, Julius Hofmann",
      "source": "Wikipedia"
    },
    {
      "label": "Ludwig's residence",
      "value": "172 days in total",
      "source": "Bavarian Palace Department"
    },
    {
      "label": "Opened to the public",
      "value": "1886, weeks after Ludwig's death",
      "source": "Wikipedia"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Within site 1726, The Palaces of King Ludwig II · inscribed 2025",
      "source": "UNESCO"
    },
    {
      "label": "Coordinates",
      "value": "47.5575° N, 10.7494° E",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "Neuschwanstein is a medieval castle as the 19th century dreamed it: Romanesque Revival towers and oriels outside, and inside a sequence of operatic rooms — the Throne Hall in Byzantine style (its throne never installed), the Singers' Hall modelled on the Wartburg, and Ludwig's bedroom with woodcarving that took 14 carpenters over four years. Murals throughout retell Wagner's operas and the Lohengrin legend of the swan knight.",
      "The site is half the architecture: the castle occupies a narrow ridge between the Pollat gorge — spanned by the Marienbrücke, the bridge from which every famous view is taken — and the Alpsee and Schwansee lakes, with Hohenschwangau Castle, Ludwig's childhood home, in view below."
    ],
    "geniusPoints": [
      "A stage designer's castle — composed like opera scenery, view by view",
      "Modern systems hidden in a medieval shell: heating, running water, telephones",
      "The Singers' Hall is a full-scale tribute to Wagner",
      "The famous profile is best seen from the Marienbrücke over the Pollat gorge"
    ],
    "dimensions": [
      {
        "label": "Castle length",
        "value": "≈150 m"
      },
      {
        "label": "Gatehouse to keep",
        "value": "Five-storey main block on a narrow ridge"
      },
      {
        "label": "Visitors",
        "value": "About 1.4 million a year (pre-2020)"
      }
    ],
    "materials": [
      "Limestone (local)",
      "Marble (interiors)",
      "Brick core with stone facing"
    ]
  },
  "timeline": [
    {
      "year": "1869",
      "title": "Foundation stone laid",
      "text": "Building starts on the ruined medieval castle site above Hohenschwangau."
    },
    {
      "year": "1884",
      "title": "Ludwig moves in",
      "text": "The king takes residence in the palace — he will spend only 172 days there in total."
    },
    {
      "year": "1886",
      "title": "Opened to visitors",
      "text": "Ludwig dies in June; by August the castle opens to the public to help pay his building debts."
    },
    {
      "year": "2025",
      "title": "World Heritage",
      "text": "UNESCO inscribes Neuschwanstein with Linderhof, Schachen and Herrenchiemsee as the Palaces of King Ludwig II."
    }
  ],
  "myths": [
    {
      "claim": "Disney's castle is an exact copy",
      "verdict": "FALSE",
      "evidence": "Walt Disney visited Neuschwanstein in the 1930s and the Sleeping Beauty Castle at Disneyland (1955) was modelled on its silhouette — inspiration, freely adapted, not a replica.",
      "sourceName": "Wikipedia — Neuschwanstein Castle",
      "sourceUrl": "https://en.wikipedia.org/wiki/Neuschwanstein_Castle"
    },
    {
      "claim": "Ludwig built it as a public palace for affairs of state",
      "verdict": "FALSE",
      "evidence": "It was a private retreat for a king who increasingly avoided Munich and government; state business was the last thing it was for.",
      "sourceName": "Wikipedia — Neuschwanstein Castle",
      "sourceUrl": "https://en.wikipedia.org/wiki/Neuschwanstein_Castle"
    },
    {
      "claim": "It bankrupted Bavaria",
      "verdict": "FALSE",
      "evidence": "Ludwig funded his castles from his own civil list and loans, not the state treasury — but his personal debts were real: creditors' pressure was among the triggers of his 1886 deposition.",
      "sourceName": "Wikipedia — Neuschwanstein Castle",
      "sourceUrl": "https://en.wikipedia.org/wiki/Neuschwanstein_Castle"
    }
  ],
  "media": [
    {
      "fileTitle": "Alpsee - Hohenschwangau Castle - Alpenrose - Neuschwanstein Castle 01.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/8/84/Alpsee_-_Hohenschwangau_Castle_-_Alpenrose_-_Neuschwanstein_Castle_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Alpsee_-_Hohenschwangau_Castle_-_Alpenrose_-_Neuschwanstein_Castle_01.jpg",
      "width": 6000,
      "height": 2838,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Llez",
      "attribution": "\"Alpsee - Hohenschwangau Castle - Alpenrose - Neuschwanstein Castle 01.jpg\" by Llez — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "Neuschwanstein Castle on its ridge above the Bavarian lakes",
      "sortOrder": 1
    },
    {
      "fileTitle": "Alpsee - Pindarplatz - Hohenschwangau Castle - Alpenrose - Neuschwanstein Castle 01.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Alpsee_-_Pindarplatz_-_Hohenschwangau_Castle_-_Alpenrose_-_Neuschwanstein_Castle_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Alpsee_-_Pindarplatz_-_Hohenschwangau_Castle_-_Alpenrose_-_Neuschwanstein_Castle_01.jpg",
      "width": 22981,
      "height": 4982,
      "licence": "CC BY-SA 3.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "author": "Llez",
      "attribution": "\"Alpsee - Pindarplatz - Hohenschwangau Castle - Alpenrose - Neuschwanstein Castle 01.jpg\" by Llez — CC BY-SA 3.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Neuschwanstein Castle — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Alpsee Neuschwanstein.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/7/70/Alpsee_Neuschwanstein.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Alpsee_Neuschwanstein.jpg",
      "width": 5000,
      "height": 2775,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Dmytro Balkhovitin",
      "attribution": "\"Alpsee Neuschwanstein.jpg\" by Dmytro Balkhovitin — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Neuschwanstein Castle — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity and coordinates",
      "sourceName": "Wikidata — Q4152 (Neuschwanstein Castle)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q4152",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status, site ID 1726, inscription year 2025",
      "sourceName": "UNESCO World Heritage Centre — list 1726",
      "sourceUrl": "https://whc.unesco.org/en/list/1726",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Labelled facts as cited per row (managing authorities and foundations)",
      "sourceName": "Wikipedia — Neuschwanstein Castle",
      "sourceUrl": "https://en.wikipedia.org/wiki/Neuschwanstein_Castle",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Photographs: licence and author per record",
      "sourceName": "Wikimedia Commons imageinfo",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Alpsee_-_Hohenschwangau_Castle_-_Alpenrose_-_Neuschwanstein_Castle_01.jpg",
      "checkedAt": "2026-10-22"
    }
  ],
  "visitor": {
    "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
    "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Access and entry details are published by the managing authority on the official site.",
    "lastVerified": "2026-10-22",
    "sourceName": "Official site (see official_url)",
    "sourceUrl": "https://www.neuschwanstein.de/"
  },
  "photoSpots": [
    {
      "name": "Neuschwanstein Castle — hero view",
      "description": "Gallery image by Llez (CC BY-SA 3.0), via Wikimedia Commons.",
      "mediaFileTitle": "Alpsee - Hohenschwangau Castle - Alpenrose - Neuschwanstein Castle 01.jpg"
    }
  ],
  "faqs": [
    {
      "q": "Where is the Neuschwanstein Castle?",
      "a": "Schwangau, Bavaria, Germany — at 47.5575° N, 10.7494° E (Wikidata Q4152)."
    },
    {
      "q": "Is the Neuschwanstein Castle a UNESCO World Heritage Site?",
      "a": "Yes — inscribed in 2025 (site 1726)."
    },
    {
      "q": "What is the Neuschwanstein Castle known for?",
      "a": "Neuschwanstein is a 19th-century Romantic palace on a crag above the village of Hohenschwangau in southwest Bavaria, near the Austrian border."
    }
  ],
  "nearby": []
};

const GRAND_CANYON: Wonder = {
  "slug": "grand-canyon",
  "name": "Grand Canyon",
  "category": "Natural wonder",
  "wikidataQid": "Q118841",
  "unescoId": 75,
  "unescoYear": 1979,
  "cityName": "Grand Canyon Village",
  "regionName": "Arizona",
  "countryName": "United States",
  "lat": 36.0975,
  "lng": -112.0953,
  "timezone": "America/Phoenix",
  "officialUrl": "https://www.nps.gov/grca/",
  "ticketUrl": null,
  "seoTitle": "Grand Canyon: Weather, Facts, Depth & Guide",
  "seoDescription": "Grand Canyon today: live rim weather, true depth, two-billion-year rocks, credited photos and myth checks. Arizona.",
  "intro": [
    "The Grand Canyon is a mile-deep gorge carved by the Colorado River through the Colorado Plateau in northern Arizona: 446 kilometres long, up to 29 kilometres wide, and up to 1,857 metres deep. Its exposed rock layers read like a book of Earth's history, from 270-million-year-old Kaibab limestone at the rim to Vishnu schist at the river dated near 1.8 billion years.",
    "The canyon sits within Grand Canyon National Park, protected first as a national monument by Theodore Roosevelt in 1908 — he called it \"the one great sight which every American should see\" — and as a national park from 1919. Most visitors see it from the South Rim, open all year; the higher, quieter North Rim is seasonal.",
    "UNESCO inscribed the park in 1979. The canyon is the ancestral homeland of 11 Native American tribes with historic associations, including the Havasupai and Hualapai — the latter operate the Skywalk glass bridge on tribal land west of the park boundary."
  ],
  "facts": [
    {
      "label": "Length",
      "value": "446 km (277 mi)",
      "source": "NPS"
    },
    {
      "label": "Width",
      "value": "Up to 29 km (18 mi)",
      "source": "NPS"
    },
    {
      "label": "Maximum depth",
      "value": "1,857 m (6,093 ft)",
      "source": "NPS"
    },
    {
      "label": "River",
      "value": "Colorado River",
      "source": "NPS"
    },
    {
      "label": "Oldest rocks",
      "value": "Vishnu schist, ≈1.8 billion years",
      "source": "NPS / USGS"
    },
    {
      "label": "Protection",
      "value": "National monument 1908; national park 1919",
      "source": "NPS"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Site 75 · inscribed 1979",
      "source": "UNESCO"
    },
    {
      "label": "Coordinates",
      "value": "36.0975° N, 112.0953° W",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "There is no architect here — the structure is stratigraphy. The canyon's staircase profile comes from alternating hard and soft rock: cliff-forming Kaibab limestone and Coconino sandstone stand in walls, while soft shales (Bright Angel, Hermit) erode into slopes and platforms like the Tonto. The river did the cutting, but the plateau did half the work by rising: as the Colorado Plateau uplifted over the last tens of millions of years, the river held its course and incised downward.",
      "The main canyon is young by geological standards — most evidence dates its carving to the last 5–6 million years, though some segments may be far older, a live scientific debate. Side canyons, temples (buttes named for world deities by Clarence Dutton) and rapids grade the descent from rim to river."
    ],
    "geniusPoints": [
      "A layer-cake of nearly two billion years of rock history",
      "Hard layers make cliffs, soft layers make slopes — the whole shape explained",
      "The canyon is still widening faster than it deepens",
      "Named viewpoints frame \"temples\" — buttes named after gods and myths"
    ],
    "dimensions": [
      {
        "label": "Length",
        "value": "446 km"
      },
      {
        "label": "Maximum depth",
        "value": "1,857 m"
      },
      {
        "label": "Width range",
        "value": "6.4–29 km"
      },
      {
        "label": "River elevation",
        "value": "≈670 m at Lees Ferry"
      }
    ],
    "materials": [
      "Kaibab limestone",
      "Coconino sandstone",
      "Redwall limestone",
      "Vishnu schist"
    ]
  },
  "timeline": [
    {
      "year": "1908",
      "title": "National monument",
      "text": "President Theodore Roosevelt proclaims Grand Canyon National Monument."
    },
    {
      "year": "1919",
      "title": "National park",
      "text": "Congress establishes Grand Canyon National Park."
    },
    {
      "year": "1979",
      "title": "World Heritage",
      "text": "UNESCO inscribes the park as a World Heritage Site."
    },
    {
      "year": "2019",
      "title": "Centenary",
      "text": "The park marks 100 years; annual visitation stands around six million in peak years (NPS)."
    }
  ],
  "myths": [
    {
      "claim": "It is the deepest canyon in the world",
      "verdict": "FALSE",
      "evidence": "The Grand Canyon's 1,857 m is not the record: Nepal's Kali Gandaki gorge and the Yarlung Tsangpo gorge in Tibet are deeper. The Grand Canyon's claim is scale, colour and exposed geology — not the depth title.",
      "sourceName": "Wikipedia — Grand Canyon",
      "sourceUrl": "https://en.wikipedia.org/wiki/Grand_Canyon"
    },
    {
      "claim": "The Colorado River carved it over billions of years",
      "verdict": "FALSE",
      "evidence": "The rocks are billions of years old in part, but the canyon itself is young: mainstream evidence puts most carving in the last 5–6 million years — the river is fast when the land rises under it.",
      "sourceName": "Wikipedia — Grand Canyon",
      "sourceUrl": "https://en.wikipedia.org/wiki/Grand_Canyon"
    },
    {
      "claim": "You can see it from the Moon",
      "verdict": "FALSE",
      "evidence": "Astronauts can pick it out from low Earth orbit in good light, but from the Moon — 1,000 times farther — the canyon is far below the limit of the naked eye.",
      "sourceName": "Wikipedia — Grand Canyon",
      "sourceUrl": "https://en.wikipedia.org/wiki/Grand_Canyon"
    }
  ],
  "media": [
    {
      "fileTitle": "Grand Canyon (Arizona, USA), South Rim nahe Tusayan -- 2012 -- 5771.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Grand_Canyon_%28Arizona%2C_USA%29%2C_South_Rim_nahe_Tusayan_--_2012_--_5771.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Grand_Canyon_(Arizona,_USA),_South_Rim_nahe_Tusayan_--_2012_--_5771.jpg",
      "width": 4939,
      "height": 3293,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Dietmar Rabich",
      "attribution": "\"Grand Canyon (Arizona, USA), South Rim nahe Tusayan -- 2012 -- 5771.jpg\" by Dietmar Rabich — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "The Grand Canyon opening toward the Colorado River",
      "sortOrder": 1
    },
    {
      "fileTitle": "Grand Canyon (Arizona, USA), South Rim nahe Tusayan -- 2012 -- 5788.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Grand_Canyon_%28Arizona%2C_USA%29%2C_South_Rim_nahe_Tusayan_--_2012_--_5788.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Grand_Canyon_(Arizona,_USA),_South_Rim_nahe_Tusayan_--_2012_--_5788.jpg",
      "width": 5176,
      "height": 3451,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Dietmar Rabich",
      "attribution": "\"Grand Canyon (Arizona, USA), South Rim nahe Tusayan -- 2012 -- 5788.jpg\" by Dietmar Rabich — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Grand Canyon — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Grand Canyon (Arizona, USA), South Rim nahe Tusayan -- 2012 -- 5801.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6d/Grand_Canyon_%28Arizona%2C_USA%29%2C_South_Rim_nahe_Tusayan_--_2012_--_5801.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Grand_Canyon_(Arizona,_USA),_South_Rim_nahe_Tusayan_--_2012_--_5801.jpg",
      "width": 5184,
      "height": 3456,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Dietmar Rabich",
      "attribution": "\"Grand Canyon (Arizona, USA), South Rim nahe Tusayan -- 2012 -- 5801.jpg\" by Dietmar Rabich — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Grand Canyon — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity and coordinates",
      "sourceName": "Wikidata — Q118841 (Grand Canyon)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q118841",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status, site ID 75, inscription year 1979",
      "sourceName": "UNESCO World Heritage Centre — list 75",
      "sourceUrl": "https://whc.unesco.org/en/list/75",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Labelled facts as cited per row (managing authorities and foundations)",
      "sourceName": "Wikipedia — Grand Canyon",
      "sourceUrl": "https://en.wikipedia.org/wiki/Grand_Canyon",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Photographs: licence and author per record",
      "sourceName": "Wikimedia Commons imageinfo",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Grand_Canyon_(Arizona,_USA),_South_Rim_nahe_Tusayan_--_2012_--_5771.jpg",
      "checkedAt": "2026-10-22"
    }
  ],
  "visitor": {
    "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
    "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Access and entry details are published by the managing authority on the official site.",
    "lastVerified": "2026-10-22",
    "sourceName": "Official site (see official_url)",
    "sourceUrl": "https://www.nps.gov/grca/"
  },
  "photoSpots": [
    {
      "name": "Grand Canyon — hero view",
      "description": "Gallery image by Dietmar Rabich (CC BY-SA 4.0), via Wikimedia Commons.",
      "mediaFileTitle": "Grand Canyon (Arizona, USA), South Rim nahe Tusayan -- 2012 -- 5771.jpg"
    }
  ],
  "faqs": [
    {
      "q": "Where is the Grand Canyon?",
      "a": "Grand Canyon Village, Arizona, United States — at 36.0975° N, 112.0953° W (Wikidata Q118841)."
    },
    {
      "q": "Is the Grand Canyon a UNESCO World Heritage Site?",
      "a": "Yes — inscribed in 1979 (site 75)."
    },
    {
      "q": "What is the Grand Canyon known for?",
      "a": "The Grand Canyon is a mile-deep gorge carved by the Colorado River through the Colorado Plateau in northern Arizona: 446 kilometres long, up to 29 kilometres wide, and up to 1,857 metres deep."
    }
  ],
  "nearby": []
};

const GREAT_BARRIER_REEF: Wonder = {
  "slug": "great-barrier-reef",
  "name": "Great Barrier Reef",
  "category": "Natural wonder",
  "wikidataQid": "Q7343",
  "unescoId": 154,
  "unescoYear": 1981,
  "cityName": "Cairns",
  "regionName": "Queensland",
  "countryName": "Australia",
  "lat": -16.4,
  "lng": 145.8,
  "timezone": "Australia/Brisbane",
  "officialUrl": "https://www2.gbrmpa.gov.au/",
  "ticketUrl": null,
  "seoTitle": "Great Barrier Reef: Weather, Facts & Health",
  "seoDescription": "Great Barrier Reef today: live Queensland weather, reef facts, bleaching record, credited photos and myth checks.",
  "intro": [
    "The Great Barrier Reef is the world's largest coral reef system and the largest living structure on Earth: some 2,300 kilometres of reef along Queensland's coast, made of roughly 2,900 individual reefs and 900 islands spread over about 344,400 square kilometres of the Coral Sea. It is not one reef but a mosaic — fringing reefs, ribbon reefs, lagoons and coral cays built by billions of tiny polyps over thousands of years.",
    "The system supports extraordinary biodiversity: around 1,500 species of fish, 400-plus hard corals, dugongs, six of the world's seven sea turtles, and seasonal humpback whale nurseries. The Great Barrier Reef Marine Park, declared in 1975, zones the whole area; UNESCO inscribed it in 1981.",
    "The reef is also the sea country of Aboriginal and Torres Strait Islander peoples whose connection runs back tens of thousands of years. Its modern story includes mass coral bleaching events driven by marine heatwaves (2016, 2017, 2020, 2022, 2024 and a further widespread event reported in 2025) — severe damage, monitored reef by reef, but not a death certificate: recovery between events is documented where local pressures are controlled."
  ],
  "facts": [
    {
      "label": "Length",
      "value": "≈2,300 km",
      "source": "GBRMPA"
    },
    {
      "label": "Area",
      "value": "≈344,400 km²",
      "source": "GBRMPA"
    },
    {
      "label": "Structure",
      "value": "≈2,900 reefs and 900 islands",
      "source": "GBRMPA"
    },
    {
      "label": "Fish species",
      "value": "≈1,500",
      "source": "GBRMPA"
    },
    {
      "label": "Marine park",
      "value": "Declared 1975",
      "source": "GBRMPA"
    },
    {
      "label": "UNESCO World Heritage",
      "value": "Site 154 · inscribed 1981",
      "source": "UNESCO"
    },
    {
      "label": "Coordinates",
      "value": "16.4° S, 145.8° E",
      "source": "Wikidata"
    }
  ],
  "architecture": {
    "paragraphs": [
      "A coral reef is architecture by accretion: each polyp secretes a limestone cup, colonies stack over millennia, and storms and grazers break and cement the rubble into reef. The present reef is young — it grew over the last 6,000–8,000 years as sea level rose after the last ice age and flooded a coastal plain; the limestone beneath it records older reefs going back far longer.",
      "From the coast outward: fringing reefs hug islands and shore, patch reefs dot the lagoon, and at the continental shelf edge the outer ribbon reefs face the Coral Sea in an almost unbroken barrier. Between them run channels and the world's largest green-turtle and seabird rookeries on cays of pure coral sand."
    ],
    "geniusPoints": [
      "The largest structure built by living organisms — billions of polyps, one system",
      "The visible reef is a thin living skin on ancient limestone",
      "Ribbon reefs wall the shelf edge; the lagoon behind is a sheltered sea",
      "Heart Reef is natural — a coral formation, not a planted shape"
    ],
    "dimensions": [
      {
        "label": "Length",
        "value": "≈2,300 km"
      },
      {
        "label": "Area",
        "value": "≈344,400 km²"
      },
      {
        "label": "Reefs",
        "value": "≈2,900"
      },
      {
        "label": "Islands and cays",
        "value": "≈900"
      }
    ],
    "materials": [
      "Coral limestone (aragonite)",
      "Coralline algae",
      "Coral sand"
    ]
  },
  "timeline": [
    {
      "year": "1975",
      "title": "Marine Park declared",
      "text": "Australia creates the Great Barrier Reef Marine Park Authority and the park."
    },
    {
      "year": "1981",
      "title": "World Heritage",
      "text": "UNESCO inscribes the reef — nearly the entire ecosystem in one listing."
    },
    {
      "year": "2016–2017",
      "title": "Back-to-back bleaching",
      "text": "Two consecutive mass bleaching events strike, the first back-to-back pair on record."
    },
    {
      "year": "2024–2025",
      "title": "Further mass bleaching",
      "text": "Another widespread event is reported across 2024–25, underlining the reef's heat exposure."
    }
  ],
  "myths": [
    {
      "claim": "The reef is a single organism",
      "verdict": "FALSE",
      "evidence": "It is an ecosystem of thousands of reefs and billions of individual coral colonies of hundreds of species — vast, connected, but not one creature.",
      "sourceName": "Wikipedia — Great Barrier Reef",
      "sourceUrl": "https://en.wikipedia.org/wiki/Great_Barrier_Reef"
    },
    {
      "claim": "The reef is dead",
      "verdict": "FALSE",
      "evidence": "Mass bleachings have killed large areas of coral, especially in the north in 2016–17, and the threat is real and continuing. But monitoring shows substantial living reef and documented recovery in many sectors — \"dying in places, alive in others, and worth fighting for\" is the scientific summary, not \"dead\".",
      "sourceName": "Wikipedia — Great Barrier Reef",
      "sourceUrl": "https://en.wikipedia.org/wiki/Great_Barrier_Reef"
    },
    {
      "claim": "You can see it from the Moon",
      "verdict": "FALSE",
      "evidence": "Like the Grand Canyon claim, this one fails on distance: the reef is visible from low Earth orbit, but at lunar distance nothing of its scale resolves to the naked eye.",
      "sourceName": "Wikipedia — Great Barrier Reef",
      "sourceUrl": "https://en.wikipedia.org/wiki/Great_Barrier_Reef"
    }
  ],
  "media": [
    {
      "fileTitle": "Aerial View of Great Barrier Reef, Queensland (Ank Kumar) 01.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/2/28/Aerial_View_of_Great_Barrier_Reef%2C_Queensland_%28Ank_Kumar%29_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Aerial_View_of_Great_Barrier_Reef,_Queensland_(Ank_Kumar)_01.jpg",
      "width": 6000,
      "height": 4000,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Ank Kumar",
      "attribution": "\"Aerial View of Great Barrier Reef, Queensland (Ank Kumar) 01.jpg\" by Ank Kumar — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "hero",
      "alt": "Aerial view of coral reefs in the Great Barrier Reef",
      "sortOrder": 1
    },
    {
      "fileTitle": "Aerial View of Great Barrier Reef, Queensland (Ank Kumar) 02.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Aerial_View_of_Great_Barrier_Reef%2C_Queensland_%28Ank_Kumar%29_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Aerial_View_of_Great_Barrier_Reef,_Queensland_(Ank_Kumar)_02.jpg",
      "width": 6000,
      "height": 4000,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Ank Kumar",
      "attribution": "\"Aerial View of Great Barrier Reef, Queensland (Ank Kumar) 02.jpg\" by Ank Kumar — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Great Barrier Reef — gallery view 1",
      "sortOrder": 2
    },
    {
      "fileTitle": "Aerial View of Great Barrier Reef (Ank Kumar) 01.jpg",
      "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/5/50/Aerial_View_of_Great_Barrier_Reef_%28Ank_Kumar%29_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Aerial_View_of_Great_Barrier_Reef_(Ank_Kumar)_01.jpg",
      "width": 6000,
      "height": 4000,
      "licence": "CC BY-SA 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "author": "Ank Kumar",
      "attribution": "\"Aerial View of Great Barrier Reef (Ank Kumar) 01.jpg\" by Ank Kumar — CC BY-SA 4.0, via Wikimedia Commons",
      "role": "gallery",
      "alt": "Great Barrier Reef — gallery view 2",
      "sortOrder": 3
    }
  ],
  "sources": [
    {
      "claim": "Identity and coordinates",
      "sourceName": "Wikidata — Q7343 (Great Barrier Reef)",
      "sourceUrl": "https://www.wikidata.org/wiki/Q7343",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "UNESCO status, site ID 154, inscription year 1981",
      "sourceName": "UNESCO World Heritage Centre — list 154",
      "sourceUrl": "https://whc.unesco.org/en/list/154",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Labelled facts as cited per row (managing authorities and foundations)",
      "sourceName": "Wikipedia — Great Barrier Reef",
      "sourceUrl": "https://en.wikipedia.org/wiki/Great_Barrier_Reef",
      "checkedAt": "2026-10-22"
    },
    {
      "claim": "Photographs: licence and author per record",
      "sourceName": "Wikimedia Commons imageinfo",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Aerial_View_of_Great_Barrier_Reef,_Queensland_(Ank_Kumar)_01.jpg",
      "checkedAt": "2026-10-22"
    }
  ],
  "visitor": {
    "hoursText": "Opening arrangements vary by season and are published by the managing authority — check the official site before visiting.",
    "closedDays": "Closures for weather, conservation work or ceremonies are announced by the managing authority.",
    "fees": null,
    "feesNote": null,
    "gatesText": "Access and entry details are published by the managing authority on the official site.",
    "lastVerified": "2026-10-22",
    "sourceName": "Official site (see official_url)",
    "sourceUrl": "https://www2.gbrmpa.gov.au/"
  },
  "photoSpots": [
    {
      "name": "Great Barrier Reef — hero view",
      "description": "Gallery image by Ank Kumar (CC BY-SA 4.0), via Wikimedia Commons.",
      "mediaFileTitle": "Aerial View of Great Barrier Reef, Queensland (Ank Kumar) 01.jpg"
    }
  ],
  "faqs": [
    {
      "q": "Where is the Great Barrier Reef?",
      "a": "Cairns, Queensland, Australia — at 16.4° S, 145.8° E (Wikidata Q7343)."
    },
    {
      "q": "Is the Great Barrier Reef a UNESCO World Heritage Site?",
      "a": "Yes — inscribed in 1981 (site 154)."
    },
    {
      "q": "What is the Great Barrier Reef known for?",
      "a": "The Great Barrier Reef is the world's largest coral reef system and the largest living structure on Earth: some 2,300 kilometres of reef along Queensland's coast, made of roughly 2,900 individual reefs and 900 islands spread over about 344,400 square kilometres of the Coral Sea."
    }
  ],
  "nearby": []
};

export const BUILT_WONDERS: Wonder[] = [GREAT_WALL_OF_CHINA, EIFFEL_TOWER, PYRAMIDS_OF_GIZA, BURJ_KHALIFA, CHRIST_THE_REDEEMER, COLOSSEUM, MACHU_PICCHU, STATUE_OF_LIBERTY, ACROPOLIS_ATHENS, STONEHENGE, SYDNEY_OPERA_HOUSE, HAGIA_SOPHIA, ST_PETERS_BASILICA, SAGRADA_FAMILIA, NEUSCHWANSTEIN_CASTLE, GRAND_CANYON, GREAT_BARRIER_REEF];

export const PUBLISHED_WONDERS: Wonder[] = [TAJ_MAHAL];

/**
 * Fix 3 (billi audit, Batch 4 Item 2 follow-up): the ticket-fee FAQ answer
 * is COMPOSED from the wonder record's own structured fee rows
 * (visitor.fees) — every visitor category the record carries, priced from
 * its row, and nothing else. A category the record does not carry (for
 * example a free-children row) never appears in the text: the record is
 * the truth. A note shared by every paid row (the optional mausoleum
 * extra) is stated once; the record's own feesNote first sentence closes
 * the answer. Returns null when the record carries no verified fees, in
 * which case the stored FAQ answer is used unchanged.
 */
export function feesAnswerText(wonder: Wonder): string | null {
  const fees = wonder.visitor.fees;
  if (!fees || fees.length === 0) return null;
  const parts = fees.map((f) => {
    if (/free/i.test(f.amount)) {
      return `free entry for ${f.visitor.toLowerCase()}${f.note ? ` (${f.note.toLowerCase()})` : ''}`;
    }
    return `${f.amount} for ${f.visitor.toLowerCase()}`;
  });
  const joined =
    parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0];
  const paidNotes = fees
    .filter((f) => !/free/i.test(f.amount))
    .map((f) => f.note)
    .filter((n): n is string => Boolean(n));
  const sharedNote =
    paidNotes.length > 0 && paidNotes.every((n) => n === paidNotes[0]) ? paidNotes[0] : null;
  let extra = '';
  if (sharedNote) {
    const amt = sharedNote.match(/₹[\d,]+/)?.[0];
    const what = /mausoleum/i.test(sharedNote) ? 'the main mausoleum' : 'the optional extra it covers';
    extra = ` An optional ${amt ? `${amt} ` : ''}extra covers ${what} on each paid ticket.`;
  }
  const noteFirst = wonder.visitor.feesNote
    ? wonder.visitor.feesNote.split(/(?<=\.)\s/)[0]
    : '';
  return `Per the official site, entry to the ${wonder.name} costs ${joined}.${extra}${noteFirst ? ` ${noteFirst}` : ''}`;
}

/**
 * The wonder FAQ list as rendered: the record's FAQs with the ticket-fee
 * answer replaced by the derived feesAnswerText() whenever the record
 * carries structured fees (see above). Single source for both the visible
 * FAQ block and the FAQPage schema on the wonder page.
 */
export function getWonderFaqs(wonder: Wonder): { q: string; a: string }[] {
  const derived = feesAnswerText(wonder);
  if (!derived) return wonder.faqs;
  let replaced = false;
  return wonder.faqs.map((f) => {
    if (!replaced && /ticket|fee|cost/i.test(f.q)) {
      replaced = true;
      return { ...f, a: derived };
    }
    return f;
  });
}

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

// ── P10 (28 Oct final sitting): sibling detail links ─────────────────────
// The "More wonders" section on a wonder detail page is server-rendered
// from this list: every COMPLETE golden build in the dataset (published
// + built), minus the page itself. Content-only UPCOMING_WONDERS (Petra,
// Chichen Itza — no detail build) are deliberately excluded, so a sibling
// link never points at an unfinished page; the hub and the sitemap stay
// published-only and are untouched by this helper. Every slug here renders
// a full detail page at /wonders/<slug> (verified live 200 before use).
export function getSiblingWonders(slug: string): Wonder[] {
  const seen = new Set<string>();
  const out: Wonder[] = [];
  for (const w of [...PUBLISHED_WONDERS, ...BUILT_WONDERS]) {
    if (w.slug === slug || seen.has(w.slug)) continue;
    seen.add(w.slug);
    out.push(w);
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
