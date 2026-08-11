'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin, Thermometer, Waves, Wind, Anchor, Fish, Ship, AlertTriangle, Globe, TrendingUp, TrendingDown, ExternalLink, Calendar, Users, Building, Droplets, Activity, Anchor as AnchorIcon, Home } from 'lucide-react';
import {
  generateLiveConditionsParagraph, generateLiveConditionsAfter,
  generateHistoryGeoParagraph, generateHistoryGeoAfter,
  generateMarineLifeParagraph, generateMarineLifeAfter,
  generateShippingParagraph, generateShippingAfter,
  generateMonsoonParagraph, generateMonsoonAfter,
  generateClimateParagraph, generateClimateAfter,
  generateBorderingParagraph, generateBorderingAfter,
} from '@/lib/paragraphs/oceans';

interface Ocean {
  name: string;
  slug: string;
  image: string;
  area: number;
  avgDepth: number;
  maxDepth: number;
  marineConditions: {
    temperature: number;
    waveHeight: number;
    windSpeed: number;
    swells: string;
    visibility: string;
    lastUpdated: string;
  };
  conditionsRating: {
    shipping: { rating: string; score: number; status: string };
    swimming: { rating: string; score: number; status: string };
    diving: { rating: string; score: number; status: string };
    fishing: { rating: string; score: number; status: string };
    boating: { rating: string; score: number; status: string };
  };
  history: string;
  geography: string;
  marineLife: {
    mammals: string[];
    fish: string[];
    endangeredSpecies: string[];
  };
  shipping: {
    importance: string;
    majorPorts: { name: string; country: string; throughput: string }[];
    majorRoutes: string[];
  };
  monsoonPatterns: {
    seasons: { name: string; months: string; description: string }[];
    impact: string;
  };
  climateChange: {
    impact: string;
    seaLevelRise: string;
    temperatureRise: string;
    effects: string[];
  };
  borderingCities: {
    name: string;
    country: string;
    slug: string;
    importance: string;
  }[];
  activities: {
    diving: string;
    cruise: string;
  };
}

const arabianSea: Ocean = {
  name: 'Arabian Sea',
  slug: 'arabian-sea',
  image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600',
  area: 3862000,
  avgDepth: 2734,
  maxDepth: 4652,
  marineConditions: {
    temperature: 28,
    waveHeight: 1.5,
    windSpeed: 18,
    swells: 'Moderate (2-3m)',
    visibility: 'Good (15-20m)',
    lastUpdated: new Date().toISOString(),
  },
  conditionsRating: {
    shipping: { rating: 'Excellent', score: 90, status: 'High traffic, busy ports' },
    swimming: { rating: 'Good', score: 75, status: 'Calm waters most areas' },
    diving: { rating: 'Very Good', score: 85, status: 'Good visibility, diverse marine life' },
    fishing: { rating: 'Moderate', score: 65, status: 'Seasonal restrictions apply' },
    boating: { rating: 'Good', score: 80, status: 'Favorable conditions' },
  },
  history: 'The Arabian Sea has been a crucial maritime route for over 5000 years, connecting ancient civilizations of the Indus Valley, Mesopotamia, Egypt, and the Mediterranean. Named after Arab merchants who dominated trade routes from the 8th to 15th centuries, this body of water facilitated the exchange of spices, textiles, precious metals, and ideas between East and West.',
  geography: 'Located in the northwestern part of the Indian Ocean, the Arabian Sea is bounded by India to the east, Pakistan and Iran to the north, the Arabian Peninsula to the west, and the open Indian Ocean to the south. It covers approximately 3.86 million square kilometers.',
  marineLife: {
    mammals: ['Blue Whale', 'Humpback Whale', 'Sperm Whale', "Bryde's Whale", 'Indo-Pacific Humpback Dolphin', 'Spinner Dolphin', 'Dugong', 'Finless Porpoise'],
    fish: ['Yellowfin Tuna', 'Skipjack Tuna', 'King Mackerel', 'Mahi-Mahi (Dolphinfish)', 'Barracuda', 'Giant Trevally', 'Reef Shark', 'Hammerhead Shark', 'Manta Ray', 'Marlin', 'Snapper', 'Groupers'],
    endangeredSpecies: ['Blue Whale (Endangered)', 'Humpback Whale (Endangered)', 'Dugong (Vulnerable)', 'Green Sea Turtle (Endangered)', 'Hawksbill Turtle (Critically Endangered)', 'Whale Shark (Endangered)', 'Giant Grouper (Vulnerable)'],
  },
  shipping: {
    importance: "One of the world's busiest sea lanes, handling approximately 17% of global oil trade and 50,000+ vessel transits annually. Strategic chokepoints include the Strait of Hormuz.",
    majorPorts: [
      { name: 'Jawaharlal Nehru Port', country: 'India', throughput: '5.1M TEU/year' },
      { name: 'Jebel Ali Port', country: 'UAE', throughput: '15.1M TEU/year' },
      { name: 'Karachi Port', country: 'Pakistan', throughput: '1.4M TEU/year' },
    ],
    majorRoutes: ['Strait of Hormuz → Gulf of Oman → Arabian Sea → Indian Ocean', 'Persian Gulf → Arabian Sea → Red Sea → Suez Canal → Mediterranean'],
  },
  monsoonPatterns: {
    seasons: [
      { name: 'Northeast Monsoon (Winter)', months: 'November - March', description: 'Dry season with offshore winds, calm seas, ideal for shipping and fishing.' },
      { name: 'Southwest Monsoon (Summer)', months: 'June - September', description: 'Wet season with strong onshore winds, rough seas, heavy rainfall.' },
    ],
    impact: 'The monsoon cycle dictates maritime activities, fishing seasons, and port operations across the region.',
  },
  climateChange: {
    impact: 'The Arabian Sea is experiencing accelerated warming and rising sea levels, intensifying tropical cyclones.',
    seaLevelRise: 'Global mean sea level rise: 3.2mm/year, threatening coastal cities including Mumbai, Karachi, and Dubai.',
    temperatureRise: 'Sea surface temperature has increased by 0.5°C since 1990.',
    effects: ['Intensifying cyclones', 'Coral bleaching events', 'Shifting fish populations', 'Mangrove loss', 'Increased coastal erosion'],
  },
  borderingCities: [
    { name: 'Mumbai', country: 'India', slug: 'mumbai', importance: 'Major port and financial center' },
    { name: 'Karachi', country: 'Pakistan', slug: 'karachi', importance: 'Largest port in Pakistan' },
    { name: 'Dubai', country: 'UAE', slug: 'dubai', importance: 'Global trade hub' },
  ],
  activities: {
    diving: 'Explore coral reefs in Lakshadweep Islands and encounter whale sharks off the Gujarat coast.',
    cruise: 'Luxury cruises from Dubai to Mumbai, and coastal voyages along the Konkan coast.',
  },
};

const pacificOcean: Ocean = {
  name: 'Pacific Ocean',
  slug: 'pacific-ocean',
  image: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=1600',
  area: 165250000,
  avgDepth: 4280,
  maxDepth: 10935,
  marineConditions: {
    temperature: 18,
    waveHeight: 2.2,
    windSpeed: 22,
    swells: 'Moderate to Rough (2-4m)',
    visibility: 'Good (10-25m, varies by region)',
    lastUpdated: new Date().toISOString(),
  },
  conditionsRating: {
    shipping: { rating: 'Excellent', score: 95, status: "World's busiest trade routes" },
    swimming: { rating: 'Good', score: 78, status: 'Varies widely by coastline and season' },
    diving: { rating: 'Excellent', score: 92, status: 'Coral Triangle biodiversity hotspot' },
    fishing: { rating: 'Excellent', score: 88, status: 'Major tuna and salmon fisheries' },
    boating: { rating: 'Good', score: 75, status: 'Open-ocean swells require experience' },
  },
  history: 'The Pacific Ocean was named "Mar Pacifico" (peaceful sea) by Portuguese explorer Ferdinand Magellan in 1521 after experiencing calm waters during his crossing. It has been navigated for millennia by Polynesian, Micronesian, and Melanesian voyagers using wayfinding techniques, and later became the stage for major exploration by Spanish, British, and Dutch fleets, as well as pivotal naval history in the 20th century.',
  geography: 'The largest and deepest ocean on Earth, the Pacific stretches from the Arctic in the north to the Southern Ocean, bordered by Asia and Australia to the west and the Americas to the east. It covers roughly one-third of the Earth\'s surface and contains the Mariana Trench, the deepest point in any ocean, along with tens of thousands of islands.',
  marineLife: {
    mammals: ['Blue Whale', 'Gray Whale', 'Orca (Killer Whale)', 'Humpback Whale', 'Sea Otter', 'California Sea Lion', 'Dugong'],
    fish: ['Pacific Bluefin Tuna', 'Salmon', 'Mahi-Mahi', 'Yellowfin Tuna', 'Swordfish', 'Great White Shark', 'Whale Shark', 'Clownfish', 'Parrotfish'],
    endangeredSpecies: ['Blue Whale (Endangered)', 'Vaquita (Critically Endangered)', 'Hawksbill Turtle (Critically Endangered)', 'Steller Sea Lion (Near Threatened)', 'Giant Pacific Octopus (data deficient, declining locally)'],
  },
  shipping: {
    importance: 'The Pacific carries the largest share of global container shipping, linking East Asian manufacturing hubs with North American markets. Trans-Pacific routes are among the most heavily trafficked shipping lanes in the world.',
    majorPorts: [
      { name: 'Port of Shanghai', country: 'China', throughput: '47M TEU/year' },
      { name: 'Port of Singapore', country: 'Singapore', throughput: '37M TEU/year' },
      { name: 'Port of Los Angeles', country: 'USA', throughput: '9.2M TEU/year' },
      { name: 'Port of Busan', country: 'South Korea', throughput: '22M TEU/year' },
    ],
    majorRoutes: ['Shanghai → Los Angeles (Trans-Pacific)', 'Singapore → Panama Canal → Atlantic', 'Tokyo → San Francisco', 'Sydney → Auckland → South Pacific islands'],
  },
  monsoonPatterns: {
    seasons: [
      { name: 'El Niño Phase', months: 'Irregular, 2-7 year cycle', description: 'Warmer surface waters in the eastern Pacific, disrupting weather patterns globally and affecting fisheries.' },
      { name: 'La Niña Phase', months: 'Irregular, 2-7 year cycle', description: 'Cooler surface waters, stronger trade winds, and increased upwelling supporting fish stocks off South America.' },
      { name: 'Typhoon Season (Western Pacific)', months: 'June - November', description: 'Tropical cyclones form regularly, affecting the Philippines, Japan, and Southeast Asia.' },
    ],
    impact: 'The El Niño–Southern Oscillation (ENSO) cycle centered in the Pacific is the single largest driver of year-to-year climate variability on Earth, affecting rainfall, fisheries, and storm patterns worldwide.',
  },
  climateChange: {
    impact: 'The Pacific is warming steadily, driving coral bleaching across the Coral Triangle and Great Barrier Reef, and fueling more intense typhoons in the western basin.',
    seaLevelRise: 'Low-lying Pacific Island nations such as Tuvalu and Kiribati face existential risk from sea level rise projected at 0.4-1m by 2100.',
    temperatureRise: 'Sea surface temperatures in parts of the Pacific have risen by over 1°C since the early 20th century.',
    effects: ['Coral bleaching across the Coral Triangle', 'Threatened low-lying island nations', 'Shifting tuna migration patterns', 'More intense typhoons', 'Ocean acidification affecting shellfish', 'Melting Arctic-adjacent sea ice in the North Pacific'],
  },
  borderingCities: [
    { name: 'Tokyo', country: 'Japan', slug: 'tokyo', importance: 'Major port and global financial center' },
    { name: 'Los Angeles', country: 'USA', slug: 'los-angeles', importance: 'Largest container port in the Americas' },
    { name: 'Sydney', country: 'Australia', slug: 'sydney', importance: 'Major Southern Hemisphere port and harbor city' },
    { name: 'Shanghai', country: 'China', slug: 'shanghai', importance: "World's busiest container port" },
  ],
  activities: {
    diving: 'Dive the Coral Triangle near Indonesia and the Philippines, or explore kelp forests off California.',
    cruise: 'Trans-Pacific cruises between Asia and the Americas, or island-hopping routes through the South Pacific.',
  },
};

const atlanticOcean: Ocean = {
  name: 'Atlantic Ocean',
  slug: 'atlantic-ocean',
  image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600',
  area: 106460000,
  avgDepth: 3646,
  maxDepth: 8486,
  marineConditions: {
    temperature: 16,
    waveHeight: 1.8,
    windSpeed: 20,
    swells: 'Moderate (2-3m)',
    visibility: 'Good (10-20m)',
    lastUpdated: new Date().toISOString(),
  },
  conditionsRating: {
    shipping: { rating: 'Excellent', score: 93, status: 'Historic and heavily used trade lanes' },
    swimming: { rating: 'Good', score: 72, status: 'Cooler waters, best in Caribbean and Mediterranean-adjacent zones' },
    diving: { rating: 'Good', score: 78, status: 'Wrecks, reefs, and Caribbean sites' },
    fishing: { rating: 'Very Good', score: 82, status: 'Historic cod and tuna fishing grounds' },
    boating: { rating: 'Good', score: 76, status: 'Well-charted with established marinas' },
  },
  history: 'The Atlantic has shaped world history more than any other ocean, serving as the route for the Age of Exploration beginning with Columbus in 1492, the transatlantic slave trade, and mass migration between Europe and the Americas. It takes its name from the Greek god Atlas, and became the primary theater of naval conflict in both World Wars.',
  geography: 'The second-largest ocean, the Atlantic separates the Americas to the west from Europe and Africa to the east. It is divided into North and South Atlantic by the equator, and features the Mid-Atlantic Ridge, an underwater mountain range formed by the boundary between tectonic plates.',
  marineLife: {
    mammals: ['North Atlantic Right Whale', 'Humpback Whale', 'Atlantic Bottlenose Dolphin', 'Harbor Seal', 'Grey Seal', 'Orca'],
    fish: ['Atlantic Cod', 'Bluefin Tuna', 'Atlantic Salmon', 'Swordfish', 'Herring', 'Mackerel', 'Great White Shark', 'Marlin'],
    endangeredSpecies: ['North Atlantic Right Whale (Critically Endangered, fewer than 400 remain)', 'Atlantic Bluefin Tuna (Endangered)', 'Loggerhead Turtle (Vulnerable)', 'European Eel (Critically Endangered)'],
  },
  shipping: {
    importance: 'The Atlantic hosts some of the oldest and busiest commercial shipping routes in the world, connecting North America and Europe, and linking to the Mediterranean, West Africa, and South America.',
    majorPorts: [
      { name: 'Port of Rotterdam', country: 'Netherlands', throughput: '14.5M TEU/year' },
      { name: 'Port of New York/New Jersey', country: 'USA', throughput: '8.9M TEU/year' },
      { name: 'Port of Antwerp', country: 'Belgium', throughput: '13M TEU/year' },
      { name: 'Port of Santos', country: 'Brazil', throughput: '4.3M TEU/year' },
    ],
    majorRoutes: ['Rotterdam → New York (Transatlantic)', 'Lisbon → Rio de Janeiro', 'Southampton → Halifax', 'West Africa → Northern Europe'],
  },
  monsoonPatterns: {
    seasons: [
      { name: 'Atlantic Hurricane Season', months: 'June - November', description: 'Tropical storms and hurricanes form in the warm waters off West Africa and track toward the Caribbean and North America, peaking in September.' },
      { name: 'Winter Storm Season (North Atlantic)', months: 'November - March', description: 'Strong low-pressure systems bring rough seas and high winds across northern shipping lanes.' },
    ],
    impact: 'Hurricane season significantly affects shipping schedules, Caribbean tourism, and coastal communities along the US Gulf and East Coast each year.',
  },
  climateChange: {
    impact: 'The Atlantic Meridional Overturning Circulation (AMOC), a critical current system, is showing signs of slowing, which could disrupt weather patterns across Europe and North America.',
    seaLevelRise: 'US East Coast cities are experiencing sea level rise faster than the global average, at up to 4-5mm/year in some areas.',
    temperatureRise: 'North Atlantic surface waters have warmed measurably over the past century, contributing to more intense hurricanes.',
    effects: ['Weakening AMOC circulation', 'Stronger, wetter hurricanes', 'Coastal erosion in the US Northeast', 'Declining cod stocks', 'Ocean acidification', 'Coral stress in Caribbean reefs'],
  },
  borderingCities: [
    { name: 'New York', country: 'USA', slug: 'new-york', importance: 'Major financial and shipping hub' },
    { name: 'London', country: 'UK', slug: 'london', importance: 'Historic maritime and financial center' },
    { name: 'Lisbon', country: 'Portugal', slug: 'lisbon', importance: 'Historic Age of Exploration port' },
    { name: 'Rio de Janeiro', country: 'Brazil', slug: 'rio-de-janeiro', importance: 'Major South Atlantic port city' },
  ],
  activities: {
    diving: 'Explore shipwrecks off Bermuda and the Carolinas, or coral reefs in the Caribbean.',
    cruise: 'Classic transatlantic crossings, Caribbean island-hopping, and Mediterranean-adjacent voyages.',
  },
};

const indianOcean: Ocean = {
  name: 'Indian Ocean',
  slug: 'indian-ocean',
  image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600',
  area: 70560000,
  avgDepth: 3741,
  maxDepth: 7290,
  marineConditions: {
    temperature: 24,
    waveHeight: 1.6,
    windSpeed: 19,
    swells: 'Moderate (2-3m), stronger during monsoon',
    visibility: 'Very Good (15-30m)',
    lastUpdated: new Date().toISOString(),
  },
  conditionsRating: {
    shipping: { rating: 'Excellent', score: 91, status: 'Critical energy and trade corridor' },
    swimming: { rating: 'Excellent', score: 88, status: 'Warm year-round waters' },
    diving: { rating: 'Excellent', score: 90, status: 'Maldives, Red Sea, and East Africa reefs' },
    fishing: { rating: 'Very Good', score: 80, status: 'Major tuna fishing grounds' },
    boating: { rating: 'Good', score: 77, status: 'Monsoon timing affects conditions' },
  },
  history: 'The Indian Ocean has been a hub of trade and cultural exchange for over 2,000 years, connecting East Africa, the Middle East, India, and Southeast Asia through monsoon-driven maritime trade networks long before European exploration. It carried spices, textiles, and ideas along routes used by Arab, Indian, Chinese, and later Portuguese and British traders.',
  geography: 'The third-largest ocean, the Indian Ocean is bounded by Africa to the west, Asia to the north, Australia to the east, and the Southern Ocean to the south. It includes major seas and gulfs such as the Arabian Sea, Bay of Bengal, Red Sea, and Persian Gulf.',
  marineLife: {
    mammals: ['Blue Whale', 'Sperm Whale', 'Dugong', 'Spinner Dolphin', 'Indo-Pacific Humpback Dolphin'],
    fish: ['Yellowfin Tuna', 'Skipjack Tuna', 'Whale Shark', 'Manta Ray', 'Clownfish', 'Napoleon Wrasse', 'Marlin'],
    endangeredSpecies: ['Dugong (Vulnerable)', 'Hawksbill Turtle (Critically Endangered)', 'Whale Shark (Endangered)', 'Green Sea Turtle (Endangered)'],
  },
  shipping: {
    importance: 'A vital energy corridor carrying much of the world\'s oil shipments from the Persian Gulf, and a key link between Europe, Africa, and Asia via the Suez Canal and Cape of Good Hope routes.',
    majorPorts: [
      { name: 'Port of Singapore', country: 'Singapore', throughput: '37M TEU/year' },
      { name: 'Jawaharlal Nehru Port', country: 'India', throughput: '5.1M TEU/year' },
      { name: 'Port of Colombo', country: 'Sri Lanka', throughput: '7.2M TEU/year' },
      { name: 'Port of Durban', country: 'South Africa', throughput: '2.9M TEU/year' },
    ],
    majorRoutes: ['Persian Gulf → Indian Ocean → Malacca Strait → East Asia', 'Suez Canal → Red Sea → Indian Ocean', 'Cape of Good Hope → Indian Ocean → Australia'],
  },
  monsoonPatterns: {
    seasons: [
      { name: 'Southwest Monsoon', months: 'June - September', description: 'Strong winds and heavy rainfall across South Asia and East Africa, rougher seas.' },
      { name: 'Northeast Monsoon', months: 'November - March', description: 'Drier conditions with calmer seas, favorable for shipping and fishing.' },
    ],
    impact: 'The Indian Ocean monsoon system is one of the most powerful seasonal wind patterns on Earth, historically dictating trade sailing schedules and still shaping agriculture across the region today.',
  },
  climateChange: {
    impact: 'The Indian Ocean is warming faster than the global average, driving widespread coral bleaching and more intense cyclones in the Bay of Bengal and Arabian Sea.',
    seaLevelRise: 'Low-lying areas including the Maldives and Bangladesh coast face severe risk, with projected rise of 0.3-1m by 2100.',
    temperatureRise: 'Surface temperatures have risen by around 1°C over the past century, among the fastest-warming ocean basins.',
    effects: ['Severe coral bleaching in the Maldives', 'More intense cyclones', 'Threatened island nations', 'Disrupted monsoon reliability', 'Declining fish stocks', 'Mangrove loss along coastlines'],
  },
  borderingCities: [
    { name: 'Mumbai', country: 'India', slug: 'mumbai', importance: 'Major port and financial center' },
    { name: 'Dubai', country: 'UAE', slug: 'dubai', importance: 'Global trade and logistics hub' },
    { name: 'Colombo', country: 'Sri Lanka', slug: 'colombo', importance: 'Key transshipment port' },
    { name: 'Cape Town', country: 'South Africa', slug: 'cape-town', importance: 'Strategic Cape route port' },
  ],
  activities: {
    diving: 'World-class diving in the Maldives, Red Sea, and along the Great African reef systems.',
    cruise: 'Island-hopping through the Maldives and Seychelles, or coastal voyages along East Africa.',
  },
};

const arcticOcean: Ocean = {
  name: 'Arctic Ocean',
  slug: 'arctic-ocean',
  image: 'https://images.unsplash.com/photo-1517783999520-f068d7431a60?w=1600',
  area: 14060000,
  avgDepth: 1205,
  maxDepth: 5550,
  marineConditions: {
    temperature: -2,
    waveHeight: 0.8,
    windSpeed: 15,
    swells: 'Light to Moderate, ice-dampened',
    visibility: 'Excellent under ice-free conditions (20m+)',
    lastUpdated: new Date().toISOString(),
  },
  conditionsRating: {
    shipping: { rating: 'Moderate', score: 55, status: 'Seasonal Northern Sea Route, ice-dependent' },
    swimming: { rating: 'Poor', score: 15, status: 'Sub-zero waters, extreme cold risk' },
    diving: { rating: 'Moderate', score: 50, status: 'Specialist ice diving only' },
    fishing: { rating: 'Good', score: 68, status: 'Cod and Arctic char fisheries' },
    boating: { rating: 'Moderate', score: 45, status: 'Ice conditions limit navigation season' },
  },
  history: 'The Arctic Ocean was long considered impassable and remained largely unexplored by outsiders until 19th and 20th century expeditions, including those seeking the fabled Northwest and Northeast Passages. Indigenous peoples including the Inuit, Sami, and Chukchi have lived along its coasts and depended on its ice and marine life for thousands of years.',
  geography: 'The smallest and shallowest of the world\'s oceans, the Arctic Ocean is centered on the North Pole and is largely surrounded by the landmasses of North America, Europe, and Asia. Much of its surface is covered by sea ice, which expands in winter and retreats in summer.',
  marineLife: {
    mammals: ['Polar Bear', 'Narwhal', 'Beluga Whale', 'Bowhead Whale', 'Ringed Seal', 'Walrus'],
    fish: ['Arctic Cod', 'Arctic Char', 'Greenland Halibut', 'Capelin'],
    endangeredSpecies: ['Polar Bear (Vulnerable, declining due to sea ice loss)', 'Bowhead Whale (regionally endangered)', 'Narwhal (Near Threatened)'],
  },
  shipping: {
    importance: 'The Arctic\'s Northern Sea Route and Northwest Passage are opening up as sea ice retreats, offering shorter shipping links between Europe and Asia, though traffic remains a fraction of southern routes and is highly seasonal.',
    majorPorts: [
      { name: 'Port of Murmansk', country: 'Russia', throughput: '1.2M TEU-equivalent/year' },
      { name: 'Port of Sabetta', country: 'Russia', throughput: 'Major LNG export terminal' },
    ],
    majorRoutes: ['Northern Sea Route (Murmansk → Bering Strait)', 'Northwest Passage (Atlantic → Pacific via Canadian Arctic)'],
  },
  monsoonPatterns: {
    seasons: [
      { name: 'Polar Winter', months: 'October - March', description: 'Continuous darkness in much of the region, maximum sea ice extent, waters largely icebound.' },
      { name: 'Polar Summer', months: 'April - September', description: 'Continuous daylight, sea ice retreats to minimum extent, brief shipping and research window opens.' },
    ],
    impact: 'Unlike lower-latitude oceans, the Arctic is governed by seasonal ice extent rather than monsoon winds — the summer ice-free window determines the entire shipping and research season.',
  },
  climateChange: {
    impact: 'The Arctic is warming nearly four times faster than the global average, making it ground zero for observable climate change, with dramatic and accelerating sea ice loss.',
    seaLevelRise: 'While floating sea ice melt doesn\'t directly raise sea levels, Arctic warming is accelerating melt of the Greenland ice sheet, a major contributor to global sea level rise.',
    temperatureRise: 'Arctic average temperatures have risen by more than 2-3°C since the late 19th century, far outpacing the global average.',
    effects: ['Rapid summer sea ice decline', 'Melting Greenland ice sheet', 'Habitat loss for polar bears and walruses', 'Permafrost thaw releasing methane', 'Opening shipping routes', 'Coastal erosion of Arctic communities'],
  },
  borderingCities: [
    { name: 'Murmansk', country: 'Russia', slug: 'murmansk', importance: 'Largest city north of the Arctic Circle, key Arctic port' },
    { name: 'Tromsø', country: 'Norway', slug: 'tromso', importance: 'Arctic research and fishing hub' },
    { name: 'Utqiagvik', country: 'USA', slug: 'utqiagvik', importance: 'Northernmost US city' },
  ],
  activities: {
    diving: 'Specialist ice diving beneath Arctic sea ice for experienced divers only, viewing under-ice ecosystems.',
    cruise: 'Expedition cruises through the Northwest Passage and around Svalbard, wildlife and ice-viewing focused.',
  },
};

const southernOcean: Ocean = {
  name: 'Southern Ocean',
  slug: 'southern-ocean',
  image: 'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=1600',
  area: 21960000,
  avgDepth: 3270,
  maxDepth: 7434,
  marineConditions: {
    temperature: 2,
    waveHeight: 3.5,
    windSpeed: 35,
    swells: 'Rough to Very Rough (4-6m)',
    visibility: 'Good in open water (15-25m)',
    lastUpdated: new Date().toISOString(),
  },
  conditionsRating: {
    shipping: { rating: 'Moderate', score: 50, status: 'Limited traffic, extreme conditions' },
    swimming: { rating: 'Poor', score: 10, status: 'Near-freezing waters, not recommended' },
    diving: { rating: 'Moderate', score: 45, status: 'Expedition-level ice diving only' },
    fishing: { rating: 'Good', score: 65, status: 'Regulated krill and toothfish fisheries' },
    boating: { rating: 'Poor', score: 30, status: "Among the roughest seas on Earth (the 'Furious Fifties')" },
  },
  history: 'Formally recognized as a distinct ocean by the International Hydrographic Organization in 2000, the Southern Ocean encircles Antarctica and was long treated as the southern extensions of the Pacific, Atlantic, and Indian Oceans. Its waters were charted through perilous 19th and 20th century expeditions by explorers such as James Cook, Ernest Shackleton, and Roald Amundsen.',
  geography: 'The Southern Ocean surrounds Antarctica from the coastline to 60°S latitude, where the cold, nutrient-rich Antarctic waters meet the warmer waters of the Pacific, Atlantic, and Indian Oceans at the Antarctic Convergence. It is defined by the powerful, unbroken Antarctic Circumpolar Current.',
  marineLife: {
    mammals: ['Blue Whale', 'Orca (Killer Whale)', 'Leopard Seal', 'Weddell Seal', 'Southern Elephant Seal'],
    fish: ['Antarctic Toothfish', 'Antarctic Krill', 'Icefish', 'Patagonian Toothfish'],
    endangeredSpecies: ['Blue Whale (Endangered)', 'Emperor Penguin (Near Threatened, declining)', 'Wandering Albatross (Vulnerable)'],
  },
  shipping: {
    importance: 'Commercial shipping is minimal due to extreme weather; traffic is mostly research vessels, regulated fishing fleets, and Antarctic tourism expedition ships operating within strict international agreements.',
    majorPorts: [
      { name: 'Ushuaia', country: 'Argentina', throughput: 'Primary gateway port for Antarctic expeditions' },
      { name: 'Punta Arenas', country: 'Chile', throughput: 'Secondary Antarctic gateway port' },
    ],
    majorRoutes: ['Ushuaia → Drake Passage → Antarctic Peninsula', 'Hobart → Ross Sea (research resupply)'],
  },
  monsoonPatterns: {
    seasons: [
      { name: 'Austral Summer', months: 'November - March', description: 'Relatively milder conditions, sea ice retreat, main window for research and tourism voyages.' },
      { name: 'Austral Winter', months: 'April - October', description: 'Extreme cold, extensive sea ice coverage, near-total absence of surface shipping.' },
    ],
    impact: 'Rather than a monsoon, the Southern Ocean is dominated by the "Roaring Forties," "Furious Fifties," and "Screaming Sixties" wind belts, among the strongest and most consistent winds on Earth, driving the Antarctic Circumpolar Current.',
  },
  climateChange: {
    impact: 'The Southern Ocean absorbs a disproportionate share of global excess heat and carbon dioxide, making it a critical regulator of global climate, while Antarctic sea ice has shown unusual and rapid recent declines.',
    seaLevelRise: 'Melting of the West Antarctic Ice Sheet, influenced by warming Southern Ocean waters, is one of the largest long-term threats to global sea levels.',
    temperatureRise: 'Deep Southern Ocean waters have measurably warmed in recent decades, contributing to ice shelf melt from below.',
    effects: ['Record-low Antarctic sea ice extent in recent years', 'Ice shelf thinning and collapse risk', 'Ocean acidification affecting krill', 'Shifting penguin colony locations', 'Changing Antarctic Circumpolar Current dynamics'],
  },
  borderingCities: [
    { name: 'Ushuaia', country: 'Argentina', slug: 'ushuaia', importance: "World's southernmost city, primary Antarctic gateway" },
    { name: 'Hobart', country: 'Australia', slug: 'hobart', importance: 'Major Antarctic research and logistics hub' },
    { name: 'Punta Arenas', country: 'Chile', slug: 'punta-arenas', importance: 'Southern gateway port for Antarctic operations' },
  ],
  activities: {
    diving: 'Extreme expedition diving beneath Antarctic ice for highly experienced divers, viewing unique cold-water ecosystems.',
    cruise: 'Antarctic expedition cruises departing from Ushuaia across the Drake Passage to the Antarctic Peninsula.',
  },
};

const OCEANS: Record<string, Ocean> = {
  'pacific-ocean': pacificOcean,
  'atlantic-ocean': atlanticOcean,
  'indian-ocean': indianOcean,
  'arctic-ocean': arcticOcean,
  'southern-ocean': southernOcean,
  'arabian-sea': arabianSea,
};

export default function OceanPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [ocean, setOcean] = useState<Ocean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setOcean(OCEANS[slug] ?? null);
      setLoading(false);
    }, 600);
  }, [slug]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!ocean) {
    return <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh" }} className="flex items-center justify-center text-white">Ocean not found</div>;
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Very Good':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Moderate':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", position: "relative" }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[50vh] overflow-hidden"
      >
        <img
          src={ocean.image}
          alt={ocean.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-blue-900/70 to-gray-900/90" />

        <div className="absolute top-4 left-4">
          <div className="bg-blue-600/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
            <span className="font-semibold text-white">Ocean / Sea</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {ocean.name}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
              <div className="backdrop-blur-sm bg-white/20 rounded-lg px-4 py-2">
                <div className="text-xs text-blue-100">Surface Area</div>
                <div className="font-semibold">{(ocean.area / 1000000).toFixed(2)}M km²</div>
              </div>
              <div className="backdrop-blur-sm bg-white/20 rounded-lg px-4 py-2">
                <div className="text-xs text-blue-100">Average Depth</div>
                <div className="font-semibold">{ocean.avgDepth.toLocaleString()}m</div>
              </div>
              <div className="backdrop-blur-sm bg-white/20 rounded-lg px-4 py-2">
                <div className="text-xs text-blue-100">Max Depth</div>
                <div className="font-semibold">{ocean.maxDepth.toLocaleString()}m</div>
              </div>
              <div className="backdrop-blur-sm bg-white/20 rounded-lg px-4 py-2">
                <div className="text-xs text-blue-100">Conditions</div>
                <div className="font-semibold">{ocean.marineConditions.swells}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* Live Sea Conditions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Waves className="w-7 h-7 text-blue-600" />
              Live Sea Conditions
            </h2>
            <div className="text-sm text-gray-500">
              Updated: {new Date(ocean.marineConditions.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateLiveConditionsParagraph(ocean.name)}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-5">
              <Thermometer className="w-6 h-6 text-red-600 mb-2" />
              <div className="text-xs text-gray-600 mb-1">Temperature</div>
              <div className="text-2xl font-bold text-gray-900">{ocean.marineConditions.temperature}°C</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
              <Waves className="w-6 h-6 text-blue-600 mb-2" />
              <div className="text-xs text-gray-600 mb-1">Wave Height</div>
              <div className="text-2xl font-bold text-gray-900">{ocean.marineConditions.waveHeight}m</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-200 rounded-xl p-5">
              <Wind className="w-6 h-6 text-cyan-600 mb-2" />
              <div className="text-xs text-gray-600 mb-1">Wind Speed</div>
              <div className="text-2xl font-bold text-gray-900">{ocean.marineConditions.windSpeed} km/h</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-5">
              <Droplets className="w-6 h-6 text-purple-600 mb-2" />
              <div className="text-xs text-gray-600 mb-1">Visibility</div>
              <div className="text-2xl font-bold text-gray-900">{ocean.marineConditions.visibility}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
              <Activity className="w-6 h-6 text-green-600 mb-2" />
              <div className="text-xs text-gray-600 mb-1">Swells</div>
              <div className="text-xl font-bold text-gray-900">{ocean.marineConditions.swells}</div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateLiveConditionsAfter(ocean.name)}
          </p>
        </motion.section>

        {/* Conditions Rating */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Conditions Rating</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(ocean.conditionsRating).map(([key, value]) => (
              <div key={key} className={`bg-white rounded-xl p-5 border ${getRatingColor(value.rating)}`}>
                <div className="flex items-center gap-2 mb-3">
                  {key === 'shipping' && <Ship className="w-5 h-5" />}
                  {key === 'swimming' && <Droplets className="w-5 h-5" />}
                  {key === 'diving' && <Anchor className="w-5 h-5" />}
                  {key === 'fishing' && <Fish className="w-5 h-5" />}
                  {key === 'boating' && <AnchorIcon className="w-5 h-5" />}
                  <span className="font-semibold capitalize text-gray-900">{key}</span>
                </div>
                <div className="text-3xl font-bold mb-1">{value.score}%</div>
                <div className="text-sm font-medium mb-2">{value.rating}</div>
                <div className="text-xs text-gray-600">{value.status}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* History & Geography */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateHistoryGeoParagraph(ocean.name)}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Globe className="w-7 h-7 text-indigo-600" />
                History
              </h2>
              <p className="text-gray-700 leading-relaxed">{ocean.history}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <MapPin className="w-7 h-7 text-red-600" />
                Geography
              </h2>
              <p className="text-gray-700 leading-relaxed">{ocean.geography}</p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateHistoryGeoAfter(ocean.name)}
          </p>
        </motion.section>

        {/* Marine Life */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Fish className="w-7 h-7 text-cyan-600" />
            Marine Life
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateMarineLifeParagraph(ocean.name)}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mammals */}
            <div className="bg-cyan- from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Marine Mammals
              </h3>
              <ul className="space-y-1.5">
                {ocean.marineLife.mammals.map((mammal, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    {mammal}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fish */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Fish className="w-5 h-5 text-emerald-600" />
                Fish Species
              </h3>
              <ul className="space-y-1.5">
                {ocean.marineLife.fish.map((fish, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                    {fish}
                  </li>
                ))}
              </ul>
            </div>

            {/* Endangered Species */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Endangered Species
              </h3>
              <ul className="space-y-1.5">
                {ocean.marineLife.endangeredSpecies.map((species, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                    {species}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateMarineLifeAfter(ocean.name)}
          </p>
        </motion.section>

        {/* Shipping Importance */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Ship className="w-7 h-7 text-gray-700" />
            Shipping Importance
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateShippingParagraph(ocean.name)}
          </p>

          <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">{ocean.shipping.importance}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Major Ports */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Major Ports</h3>
              <div className="space-y-3">
                {ocean.shipping.majorPorts.map((port, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="font-semibold text-gray-900">{port.name}</div>
                    <div className="text-sm text-gray-600">{port.country}</div>
                    <div className="text-sm text-gray-500 mt-1">{port.throughput}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Major Routes */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Major Shipping Routes</h3>
              <div className="space-y-2">
                {ocean.shipping.majorRoutes.map((route, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-gray-200 flex items-start gap-2">
                    <Anchor className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{route}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateShippingAfter(ocean.name)}
          </p>
        </motion.section>

        {/* Monsoon Patterns */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-indigo-600" />
            Monsoon & Seasonal Patterns
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateMonsoonParagraph(ocean.name)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {ocean.monsoonPatterns.seasons.map((season, i) => (
              <div key={i} className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5">
                <div className="font-semibold text-gray-900 mb-1">{season.name}</div>
                <div className="text-sm text-indigo-600 mb-2">{season.months}</div>
                <div className="text-sm text-gray-700">{season.description}</div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">Historical Impact</h3>
            <p className="text-amber-800 text-sm">{ocean.monsoonPatterns.impact}</p>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateMonsoonAfter(ocean.name)}
          </p>
        </motion.section>

        {/* Climate Change Impact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200 p-6"
        >
          <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-red-600" />
            Climate Change Impact
          </h2>
          <p className="text-red-900 leading-relaxed text-sm mb-6">
            {generateClimateParagraph(ocean.name)}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-5 border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-gray-900">Temperature Rise</span>
              </div>
              <p className="text-gray-700 text-sm">{ocean.climateChange.temperatureRise}</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-gray-900">Sea Level Rise</span>
              </div>
              <p className="text-gray-700 text-sm">{ocean.climateChange.seaLevelRise}</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-gray-900">Overall Impact</span>
              </div>
              <p className="text-gray-700 text-sm">{ocean.climateChange.impact}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-red-200">
            <h3 className="font-semibold text-gray-900 mb-3">Effects</h3>
            <ul className="space-y-2">
              {ocean.climateChange.effects.map((effect, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                  <TrendingDown className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  {effect}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-red-800 leading-relaxed text-sm mt-6">
            {generateClimateAfter(ocean.name)}
          </p>
        </motion.section>

        {/* Bordering Cities */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Building className="w-7 h-7 text-gray-700" />
            Bordering Cities
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateBorderingParagraph(ocean.name)}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ocean.borderingCities.map((city, i) => (
              <motion.a
                key={i}
                href={`/india/${city.slug}`}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-600">{city.country}</div>
                    <div className="text-xs text-gray-500 mt-1">{city.importance}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </motion.a>
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateBorderingAfter(ocean.name)}
          </p>
        </motion.section>

        {/* Activities */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.a
            href={`https://www.viator.com/searchResults/all?text=${encodeURIComponent(ocean.name + ' diving')}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl p-6 text-white"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-semibold text-lg">Diving Tours</div>
                <div className="text-cyan-100 text-sm">Explore underwater world</div>
              </div>
              <ExternalLink className="w-5 h-5" />
            </div>
            <p className="text-sm text-cyan-100">{ocean.activities.diving}</p>
          </motion.a>

          <motion.a
            href={`https://www.viator.com/searchResults/all?text=${encodeURIComponent(ocean.name + ' cruise')}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-semibold text-lg">Cruise Packages</div>
                <div className="text-indigo-100 text-sm">Luxury sea voyages</div>
              </div>
              <ExternalLink className="w-5 h-5" />
            </div>
            <p className="text-sm text-indigo-100">{ocean.activities.cruise}</p>
          </motion.a>
        </motion.section>

      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh" }} className="animate-pulse">
      <div className="h-[50vh] bg-gray-300"></div>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 h-40"></div>
        ))}
      </div>

      {/* Back to Homepage */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          <Home className="w-5 h-5" />
          Back to Homepage
        </a>
      </div>
    </div>
  );
}
