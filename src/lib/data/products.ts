// ─── Shared Products Data ───────────────────────────────────────────────────
// Single source of truth for heritage products across the site.
// Each product is tagged with its origin city, so both the homepage
// (Heritage Spotlight) and city pages can pull products for a given
// city automatically as more cities get built out.

export interface Product {
  name: string;
  slug: string;
  origin: {
    city: string;
    citySlug: string;
    country: string;
    countrySlug: string;
    region: string;
  };
  image: string;
  caption: string;
  age: number;
  unescoStatus: string | null;
  annualExports: number;
  description: string;
  history: {
    started: string;
    founders: string;
    evolution: string[];
  };
  timeline: { year: string; event: string }[];
  making: {
    materials: string[];
    timeToMake: string;
    skills: string[];
    steps: { step: number; title: string; description: string }[];
    videoSearch: string;
  };
  productTypes: {
    category: string;
    size: string;
    priceRange: string;
    buyLink: string;
    image: string;
  }[];
  authenticity: {
    checklist: { feature: string; authentic: string; fake: string }[];
    tips: string[];
  };
  whereToBuy: {
    inPerson: {
      name: string;
      address: string;
      city: string;
      hours: string;
      mapUrl: string;
    }[];
    online: {
      platform: string;
      url: string;
      logo: string;
      shipsWorldwide: boolean;
    }[];
    priceGuide: {
      small: { min: number; max: number };
      medium: { min: number; max: number };
      large: { min: number; max: number };
    };
  };
  artisan: {
    name: string;
    photo: string;
    generation: string;
    specialty: string;
    experience: number;
    quote: string;
  };
  similarProducts: {
    name: string;
    origin: string;
    slug: string;
    image: string;
  }[];
}

const multanBluePottery: Product = {
  name: 'Multan Blue Pottery',
  slug: 'multan-blue-pottery',
  origin: {
    city: 'Multan',
    citySlug: 'multan',
    country: 'Pakistan',
    countrySlug: 'pakistan',
    region: 'Punjab',
  },
  image: 'https://images.unsplash.com/photo-1565193566173-7a46c8b6d712?w=1200',
  caption: 'Traditional handcrafted blue pottery from Multan, featuring intricate Persian-inspired designs',
  age: 800,
  unescoStatus: 'Intangible Cultural Heritage of Pakistan (2018)',
  annualExports: 5200000,
  description: 'Multan Blue Pottery, also known as Kashigari, is a traditional ceramic art form that has been practiced in Multan for over 800 years. Characterized by its distinctive cobalt blue glaze and intricate geometric patterns, this craft represents a beautiful fusion of Persian, Central Asian, and indigenous artistic traditions.',
  history: {
    started: '13th century (1200s)',
    founders: 'Persian artisans brought by Sufi saints to Multan',
    evolution: [
      '13th century: Persian potters introduce the technique with arrival of Sufi saints',
      '14th-16th century: Development of unique Multani style under Mughal patronage',
      '17th-18th century: Peak of production with royal commissions',
      '19th century: Decline during colonial period but preservation through family traditions',
      '20th century: Revival efforts by government and artisan cooperatives',
      '21st century: Modern adaptations while maintaining traditional methods',
    ],
  },
  timeline: [
    { year: '1250', event: 'Persian artisans arrive in Multan with Sufi saints' },
    { year: '1350', event: 'First distinctive Multani patterns develop' },
    { year: '1550', event: 'Mughal Emperor commissions royal pottery sets' },
    { year: '1700', event: 'Golden age of Multan pottery art' },
    { year: '1850', event: 'British colonial period causes decline' },
    { year: '1950', event: 'Government establishes artisan training programs' },
    { year: '2018', event: 'UNESCO recognition as Intangible Cultural Heritage' },
    { year: '2024', event: 'Modern artisans blend tradition with contemporary designs' },
  ],
  making: {
    materials: ['Local Multani clay (special composition)', 'Cobalt oxide for blue pigment', 'White quartz powder', 'Natural glazing compounds', 'Wood-fired kiln'],
    timeToMake: '2-4 weeks per piece',
    skills: ['Clay preparation and shaping', 'Wheel throwing or hand molding', 'Pattern design and drawing', 'Glaze preparation and application', 'Temperature-controlled firing'],
    steps: [
      { step: 1, title: 'Clay Preparation', description: 'Local clay is sourced, cleaned, aged for weeks, and kneaded to perfect consistency' },
      { step: 2, title: 'Shaping', description: 'The clay is thrown on a wheel or hand-molded into the desired form based on design' },
      { step: 3, title: 'First Firing', description: 'Bisque firing at 900°C creates a durable base for glazing' },
      { step: 4, title: 'Design Drawing', description: 'Traditional geometric patterns are hand-painted using cobalt blue pigment' },
      { step: 5, title: 'Glazing', description: 'Clear glaze is applied to protect the design and create glossy finish' },
      { step: 6, title: 'Final Firing', description: 'Second firing at 1100°C fuses the glaze and reveals the signature blue color' },
    ],
    videoSearch: 'Multan blue pottery making process',
  },
  productTypes: [
    { category: 'Tiles', size: 'Small', priceRange: '$10-30', buyLink: 'https://www.etsy.com/search?q=multan+pottery+tile', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { category: 'Bowls', size: 'Medium', priceRange: '$50-150', buyLink: 'https://www.etsy.com/search?q=multan+pottery+bowl', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400' },
    { category: 'Vases', size: 'Large/Premium', priceRange: '$200-500', buyLink: 'https://www.1stdibs.com/search/?q=multan+pottery', image: 'https://images.unsplash.com/photo-1578749556568-20315a468dc3?w=400' },
  ],
  authenticity: {
    checklist: [
      { feature: 'Texture', authentic: 'Slightly uneven surface from hand-crafting', fake: 'Perfectly smooth, machine-made uniformity' },
      { feature: 'Weight', authentic: 'Substantial weight, solid feel', fake: 'Lightweight, hollow feel' },
      { feature: 'Imperfections', authentic: 'Small variations = handmade authenticity', fake: 'Flawless uniformity = mass produced' },
      { feature: 'Blue Color', authentic: 'Deep, rich cobalt blue, slightly varies', fake: 'Flat, consistent blue, often too bright' },
      { feature: 'Patterns', authentic: 'Hand-drawn, slight variations between pieces', fake: 'Machine-printed, identical patterns' },
      { feature: 'Signature', authentic: 'Artisan mark or signature on bottom', fake: 'No maker marks or generic labels' },
    ],
    tips: [
      'Ask for certificate of authenticity from reputable sellers',
      'Visit artisan workshops in Multan for guaranteed authentic pieces',
      'Check for artisan signatures or family marks on the piece',
      'Authentic pieces often have slight color variations in the blue',
      'Traditional patterns are geometric - avoid floral patterns claiming to be authentic',
    ],
  },
  whereToBuy: {
    inPerson: [
      { name: 'Multan Arts Council Gallery', address: 'Lohari Gate, Multan', city: 'Multan, Pakistan', hours: '9 AM - 6 PM, Mon-Sat', mapUrl: 'https://maps.google.com/?q=Multan+Arts+Council' },
      { name: 'Heritage Craft Center', address: 'Chowk Bazaar, Multan', city: 'Multan, Pakistan', hours: '10 AM - 8 PM, Daily', mapUrl: 'https://maps.google.com/?q=Chowk+Bazaar+Multan' },
    ],
    online: [
      { platform: 'Etsy', url: 'https://www.etsy.com/search?q=multan+blue+pottery', logo: 'etsy', shipsWorldwide: true },
      { platform: 'Amazon', url: 'https://www.amazon.com/s?k=multan+pottery', logo: 'amazon', shipsWorldwide: true },
      { platform: 'eBay', url: 'https://www.ebay.com/sch/i.html?_nkw=multan+pottery', logo: 'ebay', shipsWorldwide: true },
      { platform: '1stDibs', url: 'https://www.1stdibs.com/search/?q=multan+pottery', logo: '1stdibs', shipsWorldwide: true },
    ],
    priceGuide: { small: { min: 10, max: 30 }, medium: { min: 50, max: 150 }, large: { min: 200, max: 500 } },
  },
  artisan: {
    name: 'Muhammad Ashraf',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    generation: '5th Generation Artisan',
    specialty: 'Traditional geometric patterns and tile making',
    experience: 35,
    quote: 'My family has been making this pottery for 300 years. Each piece carries the prayers and skill of my ancestors. When you hold our pottery, you hold our history.',
  },
  similarProducts: [
    { name: 'Iznik Pottery', origin: 'Turkey', slug: 'iznik-pottery', image: 'https://images.unsplash.com/photo-1590736969955-71cc9490c3c7?w=400' },
    { name: 'Delft Blue', origin: 'Netherlands', slug: 'delft-blue-pottery', image: 'https://images.unsplash.com/photo-1565193566173-7a46c8b6d712?w=400' },
    { name: 'Majolica', origin: 'Spain', slug: 'spanish-majolica', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { name: 'Chinese Blue & White', origin: 'China', slug: 'chinese-blue-white-porcelain', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400' },
    { name: 'Portuguese Azulejos', origin: 'Portugal', slug: 'portuguese-azulejos', image: 'https://images.unsplash.com/photo-1578749556568-20315a468dc3?w=400' },
    { name: 'Persian Ceramics', origin: 'Iran', slug: 'persian-ceramics', image: 'https://images.unsplash.com/photo-1565193566173-7a46c8b6d712?w=400' },
  ],
};

const lahoriKhussa: Product = {
  name: 'Lahori Khussa',
  slug: 'lahori-khussa',
  origin: {
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    countrySlug: 'pakistan',
    region: 'Punjab',
  },
  image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200',
  caption: 'Handcrafted traditional leather footwear from Lahore, known for its pointed toe and intricate embroidery',
  age: 400,
  unescoStatus: null,
  annualExports: 3100000,
  description: "The Lahori Khussa is a traditional handcrafted leather shoe from Lahore, instantly recognizable by its curled, pointed toe and richly embroidered upper. Made without a left-right distinction so both shoes mold to the wearer's feet over time, the khussa has been a staple of Punjabi dress for centuries and remains closely tied to Lahore's identity as a craft city.",
  history: {
    started: '16th-17th century (Mughal era)',
    founders: 'Punjabi cobbler communities in and around Lahore',
    evolution: [
      'Mughal era: Khussa-making develops as a royal and court craft in Lahore',
      '18th-19th century: Craft spreads through Punjab, distinct regional styles emerge',
      'Colonial period: Khussa becomes everyday footwear across Punjab, less exclusively royal',
      '20th century: Inner-city Lahore neighborhoods like Anarkali become khussa-making hubs',
      '21st century: Designer and export-focused khussa brands emerge alongside traditional artisans',
    ],
  },
  timeline: [
    { year: '1600s', event: 'Khussa-making established as a specialized craft in Mughal Lahore' },
    { year: '1800s', event: 'Craft spreads across Punjab, regional embroidery styles develop' },
    { year: '1947', event: 'Partition disrupts artisan communities; Lahore remains a core production center' },
    { year: '1980s', event: 'Anarkali and inner-city markets become known khussa retail hubs' },
    { year: '2010s', event: 'Export demand grows via online marketplaces' },
    { year: '2024', event: 'Modern designers blend traditional khussa with contemporary fashion' },
  ],
  making: {
    materials: ['Genuine or synthetic leather', 'Cotton or silk embroidery thread', 'Traditional wooden shoe last', 'Beads, mirrors and sequins (for embellished styles)', 'Natural adhesives and hand stitching thread'],
    timeToMake: '2-5 days per pair',
    skills: ['Leather cutting and shaping', 'Hand embroidery (zari, tilla, or thread work)', 'Sole stitching and shaping', 'Toe curling and finishing', 'Quality leather selection'],
    steps: [
      { step: 1, title: 'Leather Selection', description: 'Leather is chosen and cut into upper and sole pieces based on the design pattern' },
      { step: 2, title: 'Embroidery', description: 'Artisans hand-embroider the upper with traditional Punjabi motifs before assembly' },
      { step: 3, title: 'Shaping', description: 'The upper is shaped over a wooden last to form the distinctive curled toe' },
      { step: 4, title: 'Stitching', description: 'Sole and upper are hand-stitched together, a skill passed down through families' },
      { step: 5, title: 'Finishing', description: 'Edges are trimmed, embellishments added, and the final pair is polished' },
    ],
    videoSearch: 'Lahori khussa making process Lahore',
  },
  productTypes: [
    { category: 'Plain Leather', size: 'Everyday', priceRange: '$15-35', buyLink: 'https://www.etsy.com/search?q=lahori+khussa', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
    { category: 'Embroidered', size: 'Formal', priceRange: '$30-70', buyLink: 'https://www.etsy.com/search?q=embroidered+khussa', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
    { category: 'Bridal / Heavily Embellished', size: 'Occasion', priceRange: '$80-200', buyLink: 'https://www.etsy.com/search?q=bridal+khussa', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
  ],
  authenticity: {
    checklist: [
      { feature: 'Stitching', authentic: 'Visible hand-stitching, slightly irregular', fake: 'Perfectly uniform machine stitching' },
      { feature: 'Leather smell', authentic: 'Natural leather scent', fake: 'Chemical or plastic smell (synthetic)' },
      { feature: 'Embroidery', authentic: 'Raised, textured hand embroidery', fake: 'Flat, printed or glued-on patterns' },
      { feature: 'Toe shape', authentic: 'Naturally curled from shaping process', fake: 'Overly stiff or uniform curl from molding' },
      { feature: 'Sole', authentic: 'Hand-cut leather sole with visible stitching', fake: 'Rubber or synthetic sole, glued not stitched' },
    ],
    tips: [
      'Buy from established Lahore markets like Anarkali Bazaar for guaranteed authenticity',
      'Genuine leather khussas soften and mold to your feet within a few wears',
      'Ask whether the pair is hand-stitched or machine-stitched before buying',
      'Expect slight asymmetry between the two shoes in a truly handmade pair',
    ],
  },
  whereToBuy: {
    inPerson: [
      { name: 'Anarkali Bazaar Khussa Shops', address: 'Anarkali Bazaar, Lahore', city: 'Lahore, Pakistan', hours: '11 AM - 9 PM, Daily', mapUrl: 'https://maps.google.com/?q=Anarkali+Bazaar+Lahore' },
      { name: 'Liberty Market', address: 'Gulberg, Lahore', city: 'Lahore, Pakistan', hours: '11 AM - 10 PM, Daily', mapUrl: 'https://maps.google.com/?q=Liberty+Market+Lahore' },
    ],
    online: [
      { platform: 'Etsy', url: 'https://www.etsy.com/search?q=lahori+khussa', logo: 'etsy', shipsWorldwide: true },
      { platform: 'Amazon', url: 'https://www.amazon.com/s?k=khussa+shoes', logo: 'amazon', shipsWorldwide: true },
      { platform: 'eBay', url: 'https://www.ebay.com/sch/i.html?_nkw=khussa+shoes', logo: 'ebay', shipsWorldwide: true },
    ],
    priceGuide: { small: { min: 15, max: 35 }, medium: { min: 30, max: 70 }, large: { min: 80, max: 200 } },
  },
  artisan: {
    name: 'Ghulam Rasool',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    generation: '3rd Generation Artisan',
    specialty: 'Hand-embroidered bridal khussa',
    experience: 28,
    quote: 'Every khussa we make in Anarkali carries the same techniques my grandfather used. A machine can copy the shape, but not the hand that shapes it.',
  },
  similarProducts: [
    { name: 'Multan Blue Pottery', origin: 'Multan, Pakistan', slug: 'multan-blue-pottery', image: 'https://images.unsplash.com/photo-1565193566173-7a46c8b6d712?w=400' },
    { name: 'Kashmiri Shawl', origin: 'Kashmir', slug: 'kashmiri-shawl', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400' },
    { name: 'Jutti (Punjab, India)', origin: 'Punjab, India', slug: 'punjabi-jutti', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
    { name: 'Moroccan Babouche', origin: 'Morocco', slug: 'moroccan-babouche', image: 'https://images.unsplash.com/photo-1590736969955-71cc9490c3c7?w=400' },
  ],
};

export const PRODUCTS: Record<string, Product> = {
  'multan-blue-pottery': multanBluePottery,
  'lahori-khussa': lahoriKhussa,
};

export function getProductBySlug(slug: string): Product | null {
  return PRODUCTS[slug] ?? null;
}

export function getProductsByCity(citySlug: string): Product[] {
  return Object.values(PRODUCTS).filter((p) => p.origin.citySlug === citySlug);
}

export function getAllProducts(): Product[] {
  return Object.values(PRODUCTS);
}
