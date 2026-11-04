// ─── Continent records ──────────────────────────────────────────────────────
// Golden continent template data (Asia first, 4 Nov 2026). The continent
// page template (src/app/continents/[slug]/page.tsx) renders EVERYTHING
// from one record of this shape: a new continent joins the site by adding
// ONE record here and adding its slug to PUBLISHED_CONTINENTS once the
// record is complete. No template code changes are needed to replicate.
//
// Source discipline (owner rule): every figure in a record carries its
// source inline, and the page prints a Sources & credits section built
// from the same fields. Nothing renders without a source.

export interface ContinentMedia {
  role: 'hero' | 'gallery';
  fileUrl: string; // local vendored derivative (public/)
  width: number; // served derivative dimensions
  height: number;
  alt: string;
  attribution: string; // printed under the photo and in Sources & credits
  author: string;
  licence: string;
  licenceUrl: string;
  pageUrl: string; // Wikimedia Commons file page
}

export interface ContinentRegion {
  name: string;
  scope: string; // the countries/areas the region covers (UN geoscheme)
  body: string[];
  photo?: ContinentMedia; // optional region photo (media index into record usage, wired inline)
}

export interface ContinentCapital {
  city: string;
  country: string;
  timezone: string; // IANA
}

export interface Continent {
  slug: string;
  name: string;
  wikidataQid: string;
  wikiTitle: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  // 50-70 word direct answer printed directly under the H1.
  directAnswer: string;
  directAnswerSource: string;
  intro: string[];
  facts: { label: string; value: string; source: string }[];
  regions: ContinentRegion[];
  // Ranked lists, figures rounded and sourced.
  largestCountriesByArea: { name: string; value: string; note: string }[];
  largestCountriesByPopulation: { name: string; value: string; note: string }[];
  largestCities: { name: string; country: string; value: string }[];
  citySource: string;
  cityPhoto?: ContinentMedia; // optional photo heading the largest-cities section
  extremes: { label: string; title: string; body: string[]; photo?: ContinentMedia }[];
  faithsIntro: string;
  faiths: { name: string; share: string; note: string }[];
  faithsSource: string;
  timezoneBody: string[];
  capitals: ContinentCapital[];
  explore: { label: string; href: string; note: string }[];
  faqs: { q: string; a: string }[];
  media: ContinentMedia[]; // media[0] is the hero; region/extreme photos repeat their entries here
  sources: string[];
}

const MEDIA = {
  greatWall: {
    role: 'hero',
    fileUrl: '/images/continents/great-wall.webp',
    width: 1280,
    height: 958,
    alt: 'The Great Wall of China winding over green forested hills under a blue sky',
    attribution: '"Great Wall of China July 2006" by Velatrix, CC0, via Wikimedia Commons',
    author: 'Velatrix',
    licence: 'CC0',
    licenceUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Great_Wall_of_China_July_2006.JPG',
  },
  everest: {
    role: 'gallery',
    fileUrl: '/images/continents/mount-everest.webp',
    width: 1280,
    height: 853,
    alt: "Mount Everest's snow-covered summit pyramid rising above the Khumbu icefall, seen from Kala Patthar",
    attribution: '"Close Up View of Mount Everest from Kala Patthar" by Bijay Chaurasia, CC BY-SA 4.0, via Wikimedia Commons',
    author: 'Bijay Chaurasia',
    licence: 'CC BY-SA 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Close_Up_View_of_Mount_Everest_from_Kala_Patthar_(5644_m)_in_2023-IMG-3485.jpg',
  },
  deadSea: {
    role: 'gallery',
    fileUrl: '/images/continents/dead-sea.webp',
    width: 1280,
    height: 872,
    alt: 'The green water and rocky shore of the Dead Sea beside the coastal road, with a boat anchored offshore',
    attribution: '"Israel Dead Sea shore" by Marc Tarlock, CC BY-SA 2.0, via Wikimedia Commons',
    author: 'Marc Tarlock',
    licence: 'CC BY-SA 2.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Israel_Dead_Sea_shore_(4264506785).jpg',
  },
  yangtze: {
    role: 'gallery',
    fileUrl: '/images/continents/yangtze-river.webp',
    width: 1280,
    height: 840,
    alt: 'The Yangtze River flowing between the steep cliffs of the Three Gorges',
    attribution: '"Yangtze river three gorges" by Jan Kranendonk, CC BY-SA 4.0, via Wikimedia Commons',
    author: 'Jan Kranendonk',
    licence: 'CC BY-SA 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Yangtze_river_three_gorges.jpg',
  },
  tokyo: {
    role: 'gallery',
    fileUrl: '/images/continents/tokyo-skyline.webp',
    width: 1280,
    height: 853,
    alt: "Tokyo's skyline at sunset with the illuminated Tokyo Skytree complete on the right and Mount Fuji silhouetted on the left",
    attribution: '"Tokyo - Sunset Skyline" by Fred Cherrygarden, CC BY-SA 4.0, via Wikimedia Commons',
    author: 'Fred Cherrygarden',
    licence: 'CC BY-SA 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Tokyo_-_Sunset_Skyline.jpg',
  },
  registan: {
    role: 'gallery',
    fileUrl: '/images/continents/registan-samarkand.webp',
    width: 1280,
    height: 816,
    alt: 'The Registan square in Samarkand with its three tiled madrasas, domes and minarets under a blue sky',
    attribution: '"Memorial complex Registan in Samarkand" by Ziegler175, CC BY-SA 4.0, via Wikimedia Commons',
    author: 'Ziegler175',
    licence: 'CC BY-SA 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Memorial_complex_%22Registan%22_in_Samarkand_(0).jpg',
  },
  angkor: {
    role: 'gallery',
    fileUrl: '/images/continents/angkor-wat.webp',
    width: 1280,
    height: 853,
    alt: "Angkor Wat's five towers silhouetted at dawn and reflected in the moat, Cambodia",
    attribution: '"Sunrise at Angkor Wat Cambodia" by Vladimir Pankratov, CC BY-SA 2.0, via Wikimedia Commons',
    author: 'Vladimir Pankratov',
    licence: 'CC BY-SA 2.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Sunrise_at_Angkor_Wat_Cambodia.jpg',
  },
} satisfies Record<string, ContinentMedia>;

export const ASIA: Continent = {
  slug: 'asia',
  name: 'Asia',
  wikidataQid: 'Q48',
  wikiTitle: 'Asia',
  tagline: 'The largest continent on Earth',
  seoTitle: 'Asia: Largest Continent | Countries, Cities & Live Times',
  seoDescription:
    "Asia, Earth's largest continent: 44.58 million km², 4.81 billion people, 49 countries. Regions, cities, Everest, the Dead Sea, faiths and live times.",
  directAnswer:
    "Asia is the largest continent on Earth: the landmass east of the Ural Mountains and the Suez Canal, holding 49 countries and about 4.81 billion people. This page maps its six regions, its record breakers from Everest to the Dead Sea, its faiths, and the live local time in its great capitals right now.",
  directAnswerSource:
    'Area: Encyclopaedia Britannica, "Asia" · Population and country count: United Nations, World Population Prospects 2024 and the UN geoscheme',
  intro: [
    "Asia is the largest and most populous of the seven continents. It covers 44,579,000 square kilometres, about 30 percent of all the land on Earth, and in mid-2024 it was home to 4,806,898,007 people, about 59 percent of the world's population (United Nations, World Population Prospects 2024). More people live in Asia than in all the other continents combined.",
    'The continent runs from the Arctic Ocean in the north to the Indian Ocean in the south, and from the Pacific Ocean in the east to the Ural Mountains, the Caucasus and the Suez Canal in the west, where it meets Europe and Africa. Inside that frame sit the highest mountain on Earth, the lowest dry land on the planet and two of the five longest rivers in the world.',
    "WorldCityHub's published guides begin in Asia. The Pakistan country guide and its cities, Lahore and Karachi, are live today, and the explore section below links to every Asian page on this site. More country guides open here as each one passes review, and this page is updated as they do.",
  ],
  facts: [
    { label: 'Total area', value: '44,579,000 km² (about 30% of Earth\u2019s land)', source: 'Encyclopaedia Britannica, "Asia"' },
    { label: 'Population', value: '4,806,898,007 in mid-2024 (about 59% of the world)', source: 'United Nations, World Population Prospects 2024' },
    { label: 'Countries', value: '49 UN member states', source: 'United Nations geoscheme' },
    { label: 'Bordering oceans', value: 'Pacific (east), Indian (south), Arctic (north)', source: 'Encyclopaedia Britannica, "Asia"' },
    { label: 'Highest point', value: 'Mount Everest, 8,848.86 m', source: '2020 China and Nepal joint survey' },
    { label: 'Lowest point', value: 'Dead Sea shore, about 430 m below sea level', source: 'Encyclopaedia Britannica, "Dead Sea"' },
    { label: 'Longest river', value: 'Yangtze, about 6,300 km', source: 'Encyclopaedia Britannica, "Yangtze River"' },
    { label: 'Deepest lake', value: 'Lake Baikal, 1,642 m deep (Siberia)', source: 'Encyclopaedia Britannica, "Lake Baikal"' },
    { label: 'Standard time span', value: 'UTC+02:00 to UTC+12:00', source: 'Wikipedia, "Asia" (checked 2026-11-04)' },
  ],
  regions: [
    {
      name: 'East Asia',
      scope: 'China, Japan, South Korea, North Korea, Mongolia and Taiwan',
      body: [
        'East Asia is the economic engine of the continent. China alone holds 1.42 billion people (2024), Japan another 124 million, and Tokyo is the largest metropolitan area on Earth. The Yangtze and the Yellow River watered some of the oldest farming civilisations on the planet, and their basins still feed hundreds of millions.',
        'China keeps one single time zone, UTC+08:00, from its Pacific coast to its Central Asian border, a span wide enough for five natural time zones.',
      ],
    },
    {
      name: 'South Asia',
      scope: 'India, Pakistan, Bangladesh, Nepal, Bhutan, Sri Lanka, Afghanistan and the Maldives',
      body: [
        "South Asia is the most densely peopled large region on Earth. India, with 1.45 billion people in 2024, is the world's most populous country; Pakistan holds 251 million and Bangladesh 174 million. The Himalaya wall the region's north, crowned by Everest, and the Indus, Ganges and Brahmaputra rivers drain from those mountains to the Arabian Sea and the Bay of Bengal.",
        "WorldCityHub's first published country guide is here: Pakistan, with its provinces and the Lahore and Karachi city guides live today.",
      ],
    },
    {
      name: 'Southeast Asia',
      scope: 'Indonesia, Vietnam, the Philippines, Thailand, Myanmar, Malaysia, Cambodia, Laos, Singapore, Brunei and Timor-Leste',
      body: [
        "Southeast Asia splits into a mainland and a sea of islands. Indonesia, the world's largest archipelago country, holds about 283 million people across more than 17,000 islands, and the Philippines another 116 million. The region sits on the equator and runs on monsoon seasons.",
        'In Cambodia stands Angkor Wat, the largest religious monument ever built, raised in the 12th century as the heart of the Khmer Empire.',
      ],
      photo: MEDIA.angkor,
    },
    {
      name: 'West Asia',
      scope: 'Turkey, Iran, Iraq, Saudi Arabia, Yemen, Syria, Jordan, Israel, Lebanon, Palestine, Qatar, the United Arab Emirates, Oman, Kuwait, Bahrain, Cyprus and Georgia, Armenia and Azerbaijan in the Caucasus',
      body: [
        "West Asia is where Asia meets Europe and Africa, and it is the birthplace of Judaism, Christianity and Islam. Iran holds about 92 million people and Turkey about 85 million, the region's two largest populations. The lands around the Persian Gulf hold a large share of the world's proven oil and gas reserves.",
        "The Dead Sea, bordered by Jordan, Israel and the West Bank, is the lowest land on Earth. At the region's western edge, Turkey and the Caucasus countries straddle the line into Europe.",
      ],
    },
    {
      name: 'Central Asia',
      scope: 'Kazakhstan, Uzbekistan, Turkmenistan, Kyrgyzstan and Tajikistan',
      body: [
        "Central Asia is the landlocked heart of the continent, five countries between Russia, China, Iran and Afghanistan. Kazakhstan is the largest landlocked country in the world. The region's dry steppes and deserts are crossed by two great rivers, the Amu Darya and the Syr Darya.",
        "For a thousand years the Silk Road crossed here, and its caravan cities still stand. Samarkand's Registan, in Uzbekistan, is the most famous square of that trading age.",
      ],
      photo: MEDIA.registan,
    },
    {
      name: 'North Asia',
      scope: 'The Asian part of Russia: Siberia and the Russian Far East',
      body: [
        "North Asia is Siberia: the roughly 13 million square kilometres of Russia east of the Ural Mountains, about three quarters of the country's land, holding fewer than 40 million people. It is the largest and emptiest part of the continent, a land of taiga forest, tundra and long winters.",
        'Lake Baikal here is the deepest lake on Earth at 1,642 metres, and holds about a fifth of the world\u2019s fresh surface water. The Trans-Siberian Railway crosses the whole region, about 9,289 kilometres from Moscow to Vladivostok, the longest railway journey on the planet.',
      ],
    },
  ],
  largestCountriesByArea: [
    { name: 'Russia', value: '17.10 million km²', note: 'Largest country on Earth; about 13.1 million km² of it lies in Asia (Siberia)' },
    { name: 'China', value: '9.60 million km²', note: 'The largest country lying entirely in Asia' },
    { name: 'India', value: '3.29 million km²', note: 'The largest country in South Asia' },
    { name: 'Kazakhstan', value: '2.72 million km²', note: 'The largest landlocked country in the world' },
    { name: 'Saudi Arabia', value: '2.15 million km²', note: 'The largest country on the Arabian Peninsula' },
  ],
  largestCountriesByPopulation: [
    { name: 'India', value: '1.45 billion', note: 'Passed China in 2023 to become the world\u2019s most populous country' },
    { name: 'China', value: '1.42 billion', note: 'Second in Asia and in the world' },
    { name: 'Indonesia', value: '283 million', note: 'The largest country in Southeast Asia' },
    { name: 'Pakistan', value: '251 million', note: 'Fifth most populous country in the world' },
    { name: 'Bangladesh', value: '174 million', note: 'One of the most densely populated large countries on Earth' },
  ],
  largestCities: [
    { name: 'Tokyo', country: 'Japan', value: 'about 37 million' },
    { name: 'Delhi', country: 'India', value: 'about 33 million' },
    { name: 'Shanghai', country: 'China', value: 'about 30 million' },
    { name: 'Dhaka', country: 'Bangladesh', value: 'about 24 million' },
    { name: 'Beijing', country: 'China', value: 'about 22 million' },
  ],
  citySource: 'United Nations urban agglomeration estimates, rounded. Metropolitan areas, not city boundaries.',
  cityPhoto: MEDIA.tokyo,
  extremes: [
    {
      label: 'Highest point',
      title: 'Mount Everest, 8,848.86 metres',
      body: [
        'Everest stands on the border between Nepal and China, in the Himalaya. Its official height, 8,848.86 metres, comes from the joint Chinese and Nepali survey announced in 2020, and it grows by a few millimetres a year as the Indian plate keeps pushing into Asia.',
        'The mountain is called Sagarmatha in Nepali and Chomolungma in Tibetan. Every one of the world\u2019s fourteen peaks above 8,000 metres stands in Asia, in the Himalaya or the neighbouring Karakoram.',
      ],
      photo: MEDIA.everest,
    },
    {
      label: 'Lowest point',
      title: 'The Dead Sea shore, about 430 metres below sea level',
      body: [
        'The lowest dry land on Earth is the shore of the Dead Sea, the salt lake shared by Jordan, Israel and the West Bank. No river flows out of it: water leaves only by evaporation, which is why the lake is nearly ten times saltier than the ocean.',
        'Its surface keeps falling by roughly a metre a year as the Jordan River is diverted upstream, so the lowest point on Earth sinks a little lower every year.',
      ],
      photo: MEDIA.deadSea,
    },
    {
      label: 'Longest river',
      title: 'The Yangtze, about 6,300 kilometres',
      body: [
        'The Yangtze is the longest river in Asia and the third longest in the world, after the Nile and the Amazon. It rises on the Tibetan Plateau and flows east across the whole width of China to the East China Sea at Shanghai.',
        'On its way it cuts the Three Gorges and passes the Three Gorges Dam, the largest hydroelectric station on Earth. More than 400 million people live in its basin.',
      ],
      photo: MEDIA.yangtze,
    },
  ],
  faithsIntro:
    'No continent is more religiously varied than Asia. Three of the great world faiths began in West Asia, two more in South Asia, and the largest populations of five world faiths live here today. The shares below follow population, largest first.',
  faiths: [
    { name: 'Religiously unaffiliated', share: '32.8%', note: 'The largest single group, about 1.5 billion people, most of them in China, where Pew counts people with no formal affiliation, including many who keep folk practices.' },
    { name: 'Islam', share: '26.1%', note: 'About 1.2 billion people. The region holds about 59 percent of the world\u2019s Muslims, and Indonesia is the world\u2019s largest Muslim-majority country.' },
    { name: 'Hinduism', share: '25.7%', note: 'About 1.2 billion people. About 99 percent of the world\u2019s Hindus live in this region, and about 95 percent of them in India alone.' },
    { name: 'Buddhism', share: '7.0%', note: 'About 316 million people. About 98 percent of the world\u2019s Buddhists live in the region where Buddhism began.' },
    { name: 'Christianity', share: '5.9%', note: 'About 270 million people. The Philippines is Asia\u2019s largest Christian-majority country; South Korea, China and India hold large communities too.' },
    { name: 'Other religions', share: '2.5%', note: 'Folk and traditional religions, Sikhism (centred in Punjab), Jainism, the Bah\u00e1\u02bc\u00ed faith and others.' },
    { name: 'Judaism', share: 'under 0.1%', note: 'One of the three faiths born in West Asia; its Asian community today lives mostly in Israel.' },
  ],
  faithsSource:
    'Pew Research Center, "How the Global Religious Landscape Changed From 2010 to 2020" (2025). Pew reports an Asia-Pacific region: Asia plus Australia and the Pacific islands. The shares are for that region; the picture for Asia alone is close.',
  timezoneBody: [
    'Asia runs on eleven standard time offsets, from UTC+02:00 at its western edge to UTC+12:00 in Russia\u2019s far east. When it is noon in Istanbul, it is already evening in Tokyo.',
    'Two systems stand out. China keeps one single time, UTC+08:00, across a country wide enough for five natural zones, so the sun rises at very different clock times from one side to the other. Nepal keeps UTC+05:45, one of only two three-quarter-hour offsets used anywhere in the world.',
  ],
  capitals: [
    { city: 'Beijing', country: 'China', timezone: 'Asia/Shanghai' },
    { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
    { city: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta' },
    { city: 'New Delhi', country: 'India', timezone: 'Asia/Kolkata' },
    { city: 'Islamabad', country: 'Pakistan', timezone: 'Asia/Karachi' },
    { city: 'Dhaka', country: 'Bangladesh', timezone: 'Asia/Dhaka' },
    { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
    { city: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh' },
  ],
  explore: [
    { label: 'Pakistan country guide', href: '/pakistan', note: 'WorldCityHub\u2019s first full country guide, live today' },
    { label: 'Punjab province', href: '/pakistan/punjab', note: 'Provinces, cities and live data' },
    { label: 'Sindh province', href: '/pakistan/sindh', note: 'Provinces, cities and live data' },
    { label: 'Lahore city guide', href: '/pakistan/punjab/lahore', note: 'Weather, prayer times, rates and more' },
    { label: 'Karachi city guide', href: '/pakistan/sindh/karachi', note: 'Weather, prayer times, rates and more' },
    { label: 'Lahore prayer times', href: '/pakistan/punjab/lahore/prayer-times', note: 'Full-year prayer calendar for the city' },
    { label: 'Badshahi Mosque', href: '/places/badshahi-mosque', note: 'A published place guide in Lahore' },
    { label: 'Lahore Fort', href: '/places/lahore-fort', note: 'A published place guide in Lahore' },
    { label: 'Taj Mahal', href: '/wonders/taj-mahal', note: 'The published wonder guide, in India' },
    { label: 'Arabian Sea', href: '/oceans/arabian-sea', note: 'Live waves and coastal weather' },
    { label: 'Indian Ocean', href: '/oceans/indian-ocean', note: 'The ocean at Asia\u2019s south' },
    { label: 'Bay of Bengal', href: '/oceans/bay-of-bengal', note: 'Live waves and coastal weather' },
    { label: 'Pacific Ocean', href: '/oceans/pacific-ocean', note: 'The ocean at Asia\u2019s east' },
    { label: 'All Asian countries', href: '/countries?continent=asia', note: 'Every Asian country on WorldCityHub' },
  ],
  faqs: [
    {
      q: 'What is the largest continent in the world?',
      a: "Asia is the largest continent in the world by both land area and population. It covers about 44.58 million square kilometres, close to 30 percent of Earth's land, and holds about 4.81 billion people, roughly 59 percent of the world's population (United Nations, World Population Prospects 2024). Africa is second on both measures.",
    },
    {
      q: 'How many countries are there in Asia?',
      a: 'The United Nations geoscheme counts 49 member states in Asia, from Cyprus and Turkey in the west to Japan and Indonesia in the east. A few are transcontinental, with land in two continents: Russia and Kazakhstan stretch into Europe, Turkey straddles Europe and Asia, and Egypt reaches into Asia at the Sinai Peninsula.',
    },
    {
      q: 'What is the most populous country in Asia?',
      a: "India is Asia's most populous country, with about 1.45 billion people in 2024. The United Nations estimates that India passed China in 2023; China follows with about 1.42 billion. Together the two countries hold well over a third of everyone alive, and both sit ahead of the next Asian country, Indonesia, by more than a billion people.",
    },
    {
      q: 'What is the highest point in Asia?',
      a: "Mount Everest, on the border between Nepal and China, is the highest point in Asia and on Earth at 8,848.86 metres above sea level. The figure comes from the joint Chinese and Nepali survey announced in 2020. Asia's northern mountain belt holds all fourteen of the world's 8,000-metre peaks, every one of them in the Himalaya or the neighbouring Karakoram.",
    },
    {
      q: 'What is the lowest point in Asia?',
      a: "The shore of the Dead Sea, shared by Jordan, Israel and the West Bank, is the lowest land on Earth at about 430 metres below sea level. The lake's surface keeps falling by roughly a metre a year as river water is diverted and minerals are extracted, so its shore sinks a little further below sea level every year.",
    },
    {
      q: 'What is the longest river in Asia?',
      a: "The Yangtze in China is Asia's longest river at about 6,300 kilometres, and the third longest in the world after the Nile and the Amazon. It rises on the Tibetan Plateau and flows east through the Three Gorges to the East China Sea at Shanghai, draining a basin that is home to more than 400 million people.",
    },
    {
      q: 'What is the largest city in Asia?',
      a: "Tokyo is Asia's largest city and the largest urban area in the world, with about 37 million people in its metropolitan area on United Nations estimates. Delhi follows at about 33 million and is growing faster, then Shanghai at about 30 million. The ranking measures whole built-up metropolitan areas, not city boundaries drawn on a map.",
    },
    {
      q: 'How many time zones does Asia span?',
      a: "Asia's standard times run from UTC+02:00 in the west to UTC+12:00 in Russia's far east, eleven offsets in all. Two stand out: China keeps one single time, UTC+08:00, across a country wide enough for five natural zones, and Nepal keeps UTC+05:45, one of only two three-quarter-hour offsets used anywhere in the world.",
    },
  ],
  media: [MEDIA.greatWall, MEDIA.everest, MEDIA.deadSea, MEDIA.yangtze, MEDIA.tokyo, MEDIA.registan, MEDIA.angkor],
  sources: [
    'United Nations, World Population Prospects 2024 (population, country populations)',
    'United Nations geoscheme (country count and region groupings)',
    'Pew Research Center, "How the Global Religious Landscape Changed From 2010 to 2020", 2025 (faith shares, Asia-Pacific)',
    'Encyclopaedia Britannica, "Asia", "Dead Sea", "Yangtze River" and "Lake Baikal" (area, extremes)',
    '2020 China and Nepal joint survey (height of Mount Everest)',
    'United Nations urban agglomeration estimates (largest cities, rounded)',
    'Photo credits are printed under every photo and listed in the media registry (docs/media-registry/subjects/asia.json)',
  ],
};

// Continents with a complete record and a live page. Replication rule:
// a slug enters this list ONLY when its record above is complete and its
// page passes the QA gate (200 + real content + self-canonical + meta
// limits). The hub links exactly these slugs and no others.
export const PUBLISHED_CONTINENTS: Continent[] = [ASIA];

export function getContinent(slug: string): Continent | null {
  return PUBLISHED_CONTINENTS.find((c) => c.slug === slug) ?? null;
}

// Hub cards for all seven continents. Only published continents carry a
// live page; the hub renders the rest unlinked (Link Law), and a card
// becomes a link automatically when its slug joins PUBLISHED_CONTINENTS.
// Card photos are the homepage continent tiles (vendored, credited in
// docs/media-registry/subjects/homepage-imagery-2026-10-28.json).
export const CONTINENT_CARDS = [
  { slug: 'asia', name: 'Asia', desc: 'Largest & most populous continent', img: '/images/home28/cont-asia.webp', imgAlt: 'The Great Wall of China winding over green hills' },
  { slug: 'africa', name: 'Africa', desc: 'Richest biodiversity', img: '/images/home28/cont-africa.webp', imgAlt: 'Mount Kilimanjaro rising above the Amboseli plain' },
  { slug: 'europe', name: 'Europe', desc: 'Art & culture hub', img: '/images/home28/cont-europe.webp', imgAlt: 'The Colosseum in Rome' },
  { slug: 'north-america', name: 'North America', desc: 'Arctic to Caribbean', img: '/images/home28/cont-namerica.webp', imgAlt: 'The Statue of Liberty in New York Harbour' },
  { slug: 'south-america', name: 'South America', desc: 'Amazon & the Andes', img: '/images/home28/cont-samerica.webp', imgAlt: 'Machu Picchu above the Urubamba valley' },
  { slug: 'oceania', name: 'Oceania', desc: 'Pacific & Australia', img: '/images/home28/cont-oceania.webp', imgAlt: 'Sydney Opera House on the harbour' },
  { slug: 'antarctica', name: 'Antarctica', desc: 'The frozen continent', img: '/images/home28/cont-antarctica.webp', imgAlt: 'McMurdo Station in Antarctica, seen from Observation Hill' },
] as const;

export const CONTINENT_CARD_CREDITS =
  'Photos: Asia: Velatrix, CC0; Africa: Sergey Pesterev, CC BY-SA 4.0; Europe: Diliff, CC BY-SA 2.5; North America: William Warby, CC BY 2.0; South America: Martin St-Amant, CC BY-SA 3.0; Oceania: Diliff, CC BY-SA 3.0; Antarctica: owamux, CC BY 2.0 (all via Wikimedia Commons).';
