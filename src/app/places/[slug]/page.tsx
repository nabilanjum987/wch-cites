import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import FlagSymbolBackground from '@/components/shared/FlagSymbolBackground';
import {
  ArrowLeft, MapPin, Clock, Ticket, Camera, Star,
  ExternalLink, Navigation, Info, Sun, Users,
  BookOpen, Globe, Heart
} from 'lucide-react';
import {
  generateFactsParagraph, generateFactsAfter,
  generateTipsParagraph, generateTipsAfter,
  generateNearbyParagraph, generateNearbyAfter,
  generateVisitorInfoParagraph, generateVisitorInfoAfter,
} from '@/lib/paragraphs/places';
import { DirectAnswer, FaqBlock, type AeoFaq } from '@/components/aeo/AnswerLayer';

// ── Place data ────────────────────────────────────────────────────────────────

interface Place {
  slug: string;
  name: string;
  city: string;
  citySlug: string;
  country: string;
  countrySlug: string;
  province: string;
  provinceSlug: string;
  tagline: string;
  description: string;
  imageUrl?: string;
  // B8 (final30): visible hero credit line for local licensed photos.
  // Only set alongside a local /images/places/*.webp file whose licence
  // is recorded in docs/media-registry/subjects/places-b8-2026-10-28.json.
  imageCredit?: string;
  gallery?: string[];
  primaryColor: string;
  category: string;
  unescoStatus?: string;
  builtYear?: string;
  openHours: string;
  entryFee: string;
  address: string;
  lat: number;
  lng: number;
  bestTimeToVisit: string;
  averageVisit: string;
  tips: string[];
  nearbyPlaces: { name: string; slug: string; distance: string }[];
  history: string;
  significance: string;
  thingsToKnow: string[];
  bookingUrl?: string;
  wikiUrl?: string;
}

const PLACES: Record<string, Place> = {
  'badshahi-mosque': {
    slug: 'badshahi-mosque',
    name: 'Badshahi Mosque',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    tagline: 'The Emperor\'s Mosque — one of the largest in the world',
    description: 'Built by Mughal Emperor Aurangzeb in 1673, Badshahi Mosque is one of the largest mosques in the world. Its magnificent red sandstone structure with white marble domes has been an iconic symbol of Lahore for over 350 years.',
    primaryColor: '#8B1A1A',
    category: 'Mosque / Heritage',
    builtYear: '1671–1673 AD',
    unescoStatus: 'Tentative UNESCO World Heritage Site',
    openHours: '7:00 AM – 10:00 PM (closed during prayer times)',
    entryFee: 'Free for Muslims. PKR 100 for non-Muslim visitors.',
    address: 'Walled City, Lahore, Punjab, Pakistan',
    lat: 31.5882, lng: 74.3101,
    bestTimeToVisit: 'October to March (cool season). Avoid peak prayer times.',
    averageVisit: '1–2 hours',
    tips: [
      'Visit early morning for the best light for photography',
      'Dress modestly — headscarves available at entrance for women',
      'Climb the minarets for panoramic views of the Walled City',
      'The mosque is most beautiful illuminated at night',
      'Allama Iqbal\'s tomb is at the entrance — visit both together',
    ],
    nearbyPlaces: [
      { name: 'Lahore Fort', slug: 'lahore-fort', distance: '0.3 km' },
      { name: 'Allama Iqbal Tomb', slug: 'allama-iqbal-tomb', distance: '0.1 km' },
      // D18: 'walled-city-lahore' was a dead link (plain row, Batch 4 L1
      // rule); the Walled City page now publishes as 'walled-city', so
      // this row links again.
      { name: 'Walled City of Lahore', slug: 'walled-city', distance: '0.5 km' },
    ],
    history: 'Commissioned by the sixth Mughal Emperor Aurangzeb in 1671 and completed in 1673, Badshahi Mosque was the largest mosque in the world for over 300 years. It was built to replace the earlier Wazir Khan Mosque as Lahore\'s principal congregational mosque. During the Sikh Empire, the mosque was used as a military garrison. The British used it as a barracks during colonial rule. It was returned to Muslim use after the 1947 partition.',
    // F1 (Batch 4 findings fix): courtyard capacity unified on 100,000 in
    // both fields below (significance + thingsToKnow previously disagreed:
    // 100,000 vs 95,000). Verified 2026-10-23: UNESCO's Tentative List
    // entry (Ref. 1277) states no capacity; Wikidata Q330872 records
    // capacity (P1083) = 100,000, and Wikipedia's Courtyard section —
    // citing Asian Historical Architecture — states the courtyard "can
    // accommodate 100,000 worshipers when functioning as an Idgah"
    // (https://en.wikipedia.org/wiki/Badshahi_Mosque#Courtyard). The
    // 95,000 figure traces to an older hall/courtyard split that no
    // current strong source reproduces for the courtyard itself.
    significance: 'Badshahi Mosque is the defining symbol of Lahore and one of the finest examples of Mughal architecture in the world. Its grand prayer hall can accommodate 55,000 worshippers. The courtyard alone holds 100,000 people — making it one of the largest open-air prayer spaces on earth.',
    thingsToKnow: [
      'Capacity: 55,000 inside, 100,000 in the courtyard',
      'Built with red Lahori brick and white marble',
      'Four minarets, each 53m tall',
      'Relics of the Prophet Muhammad ﷺ are preserved in the mosque',
      'Named after the Mughal Emperor — "Badshah" means "King" in Urdu',
    ],
    bookingUrl: 'https://www.viator.com/Lahore/d24054-ttd',
    wikiUrl: 'https://en.wikipedia.org/wiki/Badshahi_Mosque',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Badshahi_Mosque_July_1_2005_pic32_by_Ali_Imran.jpg/1280px-Badshahi_Mosque_July_1_2005_pic32_by_Ali_Imran.jpg',
  },
  'lahore-fort': {
    slug: 'lahore-fort',
    name: 'Lahore Fort',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    tagline: 'UNESCO World Heritage — 1000 years of Mughal history',
    description: 'Lahore Fort, also known as Shahi Qila (Royal Fort), is a UNESCO World Heritage Site. Built over centuries from 1566 by the Mughal Emperors, it contains 21 notable monuments representing various eras of Mughal grandeur, including the Sheesh Mahal (Palace of Mirrors).',
    primaryColor: '#8B6914',
    category: 'Fort / UNESCO Heritage',
    builtYear: 'Current structure from 1566 AD (Akbar)',
    unescoStatus: '✅ UNESCO World Heritage Site (1981)',
    openHours: '8:30 AM – 5:30 PM (Tue–Sun). Closed Monday.',
    entryFee: 'PKR 500 locals / PKR 1,000 foreigners',
    address: 'Lahore Fort Road, Walled City, Lahore',
    lat: 31.5881, lng: 74.3150,
    bestTimeToVisit: 'November to February. Morning visits avoid crowds.',
    averageVisit: '2–3 hours',
    tips: [
      'Hire a local guide — the history is rich and complex',
      'The Sheesh Mahal (Mirror Palace) is the must-see highlight',
      'Combine with Badshahi Mosque — they face each other across Hazuri Bagh',
      'Bring water — it\'s a large complex with a lot of walking',
      'Photography is free in most areas',
      'Dress modestly and wear comfortable walking shoes — the visit covers a large complex with a lot of walking',
    ],
    nearbyPlaces: [
      { name: 'Badshahi Mosque', slug: 'badshahi-mosque', distance: '0.3 km' },
      { name: 'Hazuri Bagh', slug: 'hazuri-bagh', distance: '0.1 km' },
    ],
    history: 'The origins of Lahore Fort trace back to antiquity, though the current structure was largely built during the Mughal era. Emperor Akbar rebuilt it in burnt brick in 1566. Subsequent emperors — Jahangir, Shah Jahan and Aurangzeb — each added magnificent new sections. The Sikh Empire under Ranjit Singh and later the British colonial administration also left their marks. Today 21 monuments within the fort span different eras.',
    significance: 'As a UNESCO World Heritage Site since 1981, Lahore Fort is Pakistan\'s most important historical monument. It represents the full arc of Mughal civilization at its peak, from military fortification to intimate royal quarters and the world-famous Sheesh Mahal. Unlike the mosque across Hazuri Bagh, Lahore Fort has no single published visitor capacity: a UNESCO/ICOMOS mission notes that different monuments within the fort have different carrying capacities, so visitors explore it as a walking route across more than 20 hectares and 21 monuments rather than as a single hall.',
    thingsToKnow: [
      'Area: 45 acres containing 21 historic monuments',
      'Sheesh Mahal decorated with thousands of glass mirror pieces',
      'Alamgiri Gate (1674) is the main entrance, facing Badshahi Mosque',
      'Naulakha Pavilion inlaid with semi-precious stones',
      'Featured on Pakistan\'s 1,000 rupee note',
    ],
    bookingUrl: 'https://www.viator.com/tours/Lahore/Lahore-Fort',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lahore_Fort',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Lahore_Fort_-_from_outside.jpg/1280px-Lahore_Fort_-_from_outside.jpg',
  },
  // ── D18 (28 Oct final sitting): four previously unpublished Lahore
  // places. Every fact below was verified against a real source (see
  // PR body source list); hours/fees appear ONLY where a source
  // supports them — Shalimar's day fee is deliberately NOT a number,
  // because published day-fee figures conflict. No imageUrl: per the
  // PR #87 media rule, photos must be local licensed/open files with
  // registry records, never hotlinks, so these pages use the
  // template's gradient hero until local photos are supplied.
  // B8 (final30) supplies those local photos for all four pages
  // (public/images/places/*.webp + media-registry records), so the
  // gradient fallback now applies to no published place page.
  // Nearby links point ONLY at published place slugs.
  'shalimar-gardens': {
    slug: 'shalimar-gardens',
    name: 'Shalimar Gardens',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    tagline: 'A Mughal paradise garden of terraces, marble pavilions and 410 fountains',
    description: 'Shah Jahan built Shalimar Gardens in 1641–42: three terraces, marble pavilions and 410 fountains — a UNESCO World Heritage Site since 1981.',
    primaryColor: '#2E7D32',
    category: 'Garden / UNESCO Heritage',
    builtYear: '1641–1642 AD',
    unescoStatus: '✅ UNESCO World Heritage Site (1981)',
    openHours: '8:00 AM – 6:00 PM daily',
    entryFee: 'Ticketed; fees differ for local and foreign visitors — check at the entrance',
    address: 'Grand Trunk Road, Baghbanpura, Lahore, Punjab, Pakistan',
    lat: 31.58583, lng: 74.38194,
    bestTimeToVisit: 'October to March. Early morning or late afternoon for the best light.',
    averageVisit: '1–2 hours',
    tips: [
      'Walk the terraces from top to bottom to follow the water downhill',
      'Come early for the softest light on the marble pavilions',
      'Combine with Lahore Fort — the two share one UNESCO listing',
      'Wear comfortable shoes; the garden is 658 metres long',
      'Mornings are quietest; evenings are popular with local families',
    ],
    nearbyPlaces: [
      { name: 'Walled City', slug: 'walled-city', distance: '6.0 km' },
      { name: 'Lahore Fort', slug: 'lahore-fort', distance: '6.3 km' },
      { name: 'Badshahi Mosque', slug: 'badshahi-mosque', distance: '6.8 km' },
    ],
    history: 'Construction of Shalimar Gardens began in 1641 under Mughal Emperor Shah Jahan and was completed in 1642. The gardens were laid out as a Persian paradise garden in the charbagh (four-part) style, under the superintendence of the court noble Khalilullah Khan, with Ali Mardan Khan. The site at Baghbanpura had been given by the Mian family, who then held custodianship of the gardens for over 350 years. Water reached the fountains through the Shah Nahar canal, brought from over 161 kilometres away. In 1981 the gardens were inscribed as a UNESCO World Heritage Site together with Lahore Fort, and in 2012 they were removed from the World Heritage in Danger list after conservation progress.',
    significance: 'Shalimar Gardens is Mughal garden design at its apogee — the reason UNESCO inscribed it, with Lahore Fort, in 1981. Its three descending terraces each carry a name: Farah Baksh (Bestower of Pleasure) at the top, Faiz Baksh (Bestower of Goodness) in the middle, and Hayat Baksh (Bestower of Life) at the bottom. The 410 fountains, fed by a gravity hydraulic system, cooled the air and made the garden a working piece of paradise-garden symbolism, not just decoration.',
    thingsToKnow: [
      '410 fountains in total: 105 on the upper terrace, 152 on the middle, 153 on the lower',
      'The garden measures 658 metres north to south and 258 metres east to west',
      'UNESCO listing “Fort and Shalamar Gardens in Lahore”, reference 171-002, criteria (i), (ii) and (iii)',
      'Water arrived via the Shah Nahar (Royal) canal, from over 161 km away',
      'Removed from the World Heritage in Danger list in 2012 after restoration work',
      'In October 2026 the Walled City of Lahore Authority opened the gardens for night visits, 7:00–11:00 PM',
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Shalimar_Gardens,_Lahore',
    // B8 (final30): local licensed photo — see the media-registry record.
    imageUrl: '/images/places/shalimar-gardens.webp',
    imageCredit: 'M Umair Astro · CC BY-SA 4.0, via Wikimedia Commons',
  },
  'data-darbar': {
    slug: 'data-darbar',
    name: 'Data Darbar',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    tagline: 'South Asia\'s largest Sufi shrine — the heart of Lahore\'s spiritual life',
    description: 'Data Darbar, beside Bhati Gate, is South Asia\'s largest Sufi shrine — resting place of the 11th-century saint Ali al-Hujwiri, Data Ganj Bakhsh.',
    primaryColor: '#1B5E20',
    category: 'Sufi Shrine / Heritage',
    builtYear: 'Shrine from the Mughal period; rebuilt and greatly expanded in the 1980s',
    openHours: '24 hours a day, every day',
    entryFee: 'Free entry (donations voluntary)',
    address: 'Lower Mall Road, near Bhati Gate, Lahore, Punjab, Pakistan',
    lat: 31.57898, lng: 74.30474,
    bestTimeToVisit: 'Early morning for quiet, or Thursday evenings, when qawwali fills the shrine.',
    averageVisit: '1–2 hours',
    tips: [
      'Dress modestly and be ready to remove your shoes',
      'Thursday evenings are the traditional night for shrine visits — expect crowds',
      'Try the free langar meal, served to all visitors',
      'Expect security checks at the entrances',
      'Combine with a walk through the nearby Walled City gates',
    ],
    nearbyPlaces: [
      { name: 'Badshahi Mosque', slug: 'badshahi-mosque', distance: '1.1 km' },
      { name: 'Lahore Museum', slug: 'lahore-museum', distance: '1.2 km' },
      { name: 'Lahore Fort', slug: 'lahore-fort', distance: '1.4 km' },
      { name: 'Walled City', slug: 'walled-city', distance: '1.4 km' },
    ],
    history: 'Ali al-Hujwiri, known as Data Ganj Bakhsh, came to Lahore from Ghazni in the 11th century, during the Ghaznavid period, and built a mosque on what was then the edge of the city. His grave beside that mosque became a shrine in the Mughal period, was expanded in the 19th century, and came under government control through the Auqaf Ordinance of 1960. In the 1980s the complex was rebuilt on its present vast scale, with a new mosque, library, madrasa and free kitchen. Hujwiri\'s Kashf al-Mahjub is the oldest treatise on Sufism written in Persian.',
    significance: 'Data Darbar is the largest Sufi shrine in South Asia and is considered the most sacred place in Lahore. It draws 30,000 to 60,000 visitors on an ordinary day, double that on Thursdays and religious holidays, and up to one million devotees at its annual three-day urs festival in the Islamic month of Safar. Its free kitchen continues a centuries-old tradition of feeding visitors, with up to 50,000 free meals served in a day.',
    thingsToKnow: [
      'Hujwiri wrote Kashf al-Mahjub, the oldest Persian treatise on Sufism',
      'The annual urs lasts three days in Safar and draws up to one million devotees',
      'The free kitchen (langar) serves up to 50,000 free meals a day',
      'The rebuilt complex has one dome and four minarets',
      'The shrine is served by the Bhati Chowk station of the Lahore Metrobus',
      'The shrine\'s tomb is of carved white marble, set in a large marble courtyard',
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Data_Darbar',
    // B8 (final30): local licensed photo — see the media-registry record.
    imageUrl: '/images/places/data-darbar.webp',
    imageCredit: 'Guilhem Vellut · CC BY 2.0, via Wikimedia Commons',
  },
  'walled-city': {
    slug: 'walled-city',
    name: 'Walled City',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    tagline: 'Old Lahore — thirteen gates, a thousand lanes, and the city\'s living heart',
    description: 'The Walled City is old Lahore: bazaars, havelis and mosques inside Akbar\'s 16th-century walls, entered through six surviving historic gates.',
    primaryColor: '#6D4C41',
    category: 'Historic District / Heritage',
    builtYear: 'Fortified in the Mughal era; Akbar\'s walls, mid-16th century',
    openHours: '24 hours a day — it is a living neighbourhood, not a gated site',
    entryFee: 'Free to walk the old city; individual monuments may charge separately',
    address: 'Walled City (Androon Shehr), Lahore, Punjab, Pakistan',
    lat: 31.5833, lng: 74.3183,
    bestTimeToVisit: 'October to March. Go in the morning for quieter lanes.',
    averageVisit: 'Half a day on foot',
    tips: [
      'Start at Delhi Gate and follow the Shahi Guzargah (Royal Passage) toward Wazir Khan Mosque',
      'Hire a local guide — the lanes are a maze',
      'Wear walking shoes; streets are narrow and uneven',
      'Try the old city\'s breakfast stalls and food streets',
      'Keep valuables close in the crowded bazaars',
    ],
    nearbyPlaces: [
      { name: 'Lahore Fort', slug: 'lahore-fort', distance: '0.6 km' },
      { name: 'Badshahi Mosque', slug: 'badshahi-mosque', distance: '0.9 km' },
      { name: 'Data Darbar', slug: 'data-darbar', distance: '1.4 km' },
      { name: 'Lahore Museum', slug: 'lahore-museum', distance: '1.9 km' },
    ],
    history: 'The early settlements of Lahore were established between the 1st and 7th centuries, and Lahore became a proper city in 1040, fortified through the medieval era. Akbar walled the city in the mid-16th century with twelve gates and one narrow passage — thirteen openings in all — and its doors were shut every evening. After the British annexed Punjab in 1849 they demolished most of the walls and gates to weaken the old city\'s defences, replacing the walls with gardens. Six gates survive today: Bhati, Delhi, Kashmiri, Lohari, Roshnai and Shairanwala. The Walled City of Lahore Authority, with the Aga Khan Trust for Culture, has restored stretches including Delhi Gate and the Shahi Guzargah, whose first phase was completed in 2015.',
    significance: 'The Walled City is the cultural heart of the Punjab: the historic core where Lahore\'s Mughal, Sikh and British layers sit side by side in one dense, living district. It covers about 256 hectares and is home to around 200,000 people. Its lanes hold the lavishly decorated Wazir Khan Mosque and the Shahi Hammam, and its edges hold the Badshahi Mosque and Lahore Fort — which is why a walk here, not a single monument, is the essential Lahore experience.',
    thingsToKnow: [
      'The thirteen original gates: Akbari, Bhati, Delhi, Kashmiri, Lohari, Masti, Mochi, Mori, Roshnai, Shahalmi, Shairanwala, Taxali and Yakki',
      'Six gates survive: Bhati, Delhi, Kashmiri, Lohari, Roshnai and Shairanwala',
      'Area about 256 hectares, population around 200,000',
      'Circular Road rings the old city, linking it to the wider city',
      'Delhi Gate and the adjacent Shahi Hammam were restored in 2015 by Aga Khan Cultural Service Pakistan',
      'Also called the Old City, or Androon Shehr — the “Inner City”',
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Walled_City_of_Lahore',
    // B8 (final30): local licensed photo — see the media-registry record.
    imageUrl: '/images/places/walled-city.webp',
    imageCredit: 'Guilhem Vellut · CC BY 2.0, via Wikimedia Commons',
  },
  'lahore-museum': {
    slug: 'lahore-museum',
    name: 'Lahore Museum',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    tagline: 'Pakistan\'s largest museum — 60,000 objects from Gandhara to the Pakistan Movement',
    description: 'Founded in 1865 and on The Mall since 1894, Lahore Museum is Pakistan\'s largest museum — 60,000 objects, from Gandhara sculpture to the Fasting Buddha.',
    primaryColor: '#7B1FA2',
    category: 'Museum / Heritage',
    builtYear: 'Founded 1865; present building 1894',
    openHours: '9:00 AM – 4:00 PM in winter, 9:00 AM – 5:00 PM in summer; closed Fridays and the first Monday of each month',
    entryFee: 'PKR 50 adults / PKR 20 students & children / PKR 1,000 foreigners (per the museum\'s official site)',
    address: 'Shahrah-e-Quaid-e-Azam (The Mall), Lahore, Punjab, Pakistan',
    lat: 31.568226, lng: 74.308174,
    bestTimeToVisit: 'Weekday mornings, when the galleries are quietest.',
    averageVisit: '2–3 hours',
    tips: [
      'Start with the Gandhara gallery and the Fasting Buddha',
      'Look up in the entrance hall for Sadequain\'s mural',
      'Do not miss the Zamzama gun outside the front — the cannon from Kipling\'s Kim',
      'Photography rules vary by gallery — ask staff',
      'Combine with a walk past the Mall\'s other colonial-era buildings',
    ],
    nearbyPlaces: [
      { name: 'Data Darbar', slug: 'data-darbar', distance: '1.2 km' },
      { name: 'Walled City', slug: 'walled-city', distance: '1.4 km' },
      { name: 'Badshahi Mosque', slug: 'badshahi-mosque', distance: '2.2 km' },
      { name: 'Lahore Fort', slug: 'lahore-fort', distance: '2.3 km' },
    ],
    history: 'Lahore Museum was originally established in 1865–66 on the site of the hall built for the 1864 Punjab Exhibition, on the site of today\'s Tollinton Market. The foundation stone of its present building was laid on 3 February 1890 by Prince Albert Victor, and the collection moved there in 1894, when the building opened as the Jubilee Museum for Queen Victoria\'s Golden Jubilee. John Lockwood Kipling, father of Rudyard Kipling, was one of the museum\'s earliest curators, and the museum and the Zamzama gun outside it open Rudyard Kipling\'s novel Kim. At the 1948 partition of Punjab the collection was divided, with the Lahore museum retaining about 60% of its artefacts.',
    significance: 'Lahore Museum is Pakistan\'s largest museum and one of its most visited, holding some 60,000 objects. Its Indo-Saracenic building on The Mall houses galleries spanning pre-history to the present day: Indus Valley material, Gandhara Buddhist sculpture, Mughal and Sikh miniatures and arms, coins, textiles and a Pakistan Movement gallery. Its centrepiece is the emaciated Fasting Buddha, one of the finest Gandhara sculptures anywhere, and the entrance hall ceiling carries a large mural by Sadequain.',
    thingsToKnow: [
      'Collection of about 60,000 objects',
      'The Fasting Buddha, from the Gandhara period, is its most famous object',
      'The Zamzama gun, cast in 1762, stands in front of the building',
      'Galleries span pre-history to the Pakistan Movement',
      'Over 250,000 visitors were registered in 2005',
      'The entrance hall ceiling features a large mural by Sadequain',
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Lahore_Museum',
    // B8 (final30): local licensed photo — see the media-registry record.
    imageUrl: '/images/places/lahore-museum.webp',
    imageCredit: 'Muhammad Ashar · CC BY-SA 3.0, via Wikimedia Commons',
  },
};

async function getPlace(slug: string): Promise<Place | null> {
  return PLACES[slug] ?? null;
}

// ── Metadata ──────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlace(slug);
  if (!place) return { title: 'Place Not Found | WorldCityHub' };
  // Defensive guard (CARD C, mirroring the CARD 0 personalities fix):
  // metadata generation must never be able to throw on a record
  // field — a place whose description is missing degrades to
  // name + city, it does not fail the build.
  const desc = (typeof place.description === 'string' ? place.description.trim() : '') || `${place.name} — ${place.city}`;
  // D18: QA gate is title ≤60 chars DECODED, description ≤155. The old
  // formula (“…, Visitor Guide, History & Tips | WorldCityHub”) ran
  // past 60 for every place, and slice(0, 160) past 155 — both fixed
  // here. This shortens the two pre-existing place titles too; no
  // other copy changes.
  return {
    title: `${place.name}, ${place.city} | WorldCityHub`,
    description: desc.slice(0, 155),
    alternates: { canonical: `https://worldcityhub.vercel.app/places/${slug}` },
    openGraph: {
      title: `${place.name} | WorldCityHub`,
      description: desc.slice(0, 155),
      images: place.imageUrl ? [{ url: place.imageUrl }] : [],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(PLACES).map(slug => ({ slug }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

// ─── Batch 4 Item 2: AEO answer layer ─────────────────────────────────────
// Direct-answer block + FAQ block for the places template, composed ONLY
// from the place's own record fields above (description, history,
// significance, hours, fee, best time, tips, nearby) — no new facts are
// introduced. Questions are the mined guide phrasings (see
// evidence/batch4-item2/question-bank.md). Answers accumulate whole
// record sentences until they reach the 50–70 word band. This template
// previously emitted NO JSON-LD at all, so the FAQ block also emits
// FAQPage schema from the same array (emitSchema).
function sentencesOf(text: string): string[] {
  return (text.match(/[^.!?]+[.!?]+/g) ?? [text]).map((s) => s.trim()).filter(Boolean);
}
function wc(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}
function asSentence(s: string): string {
  const t = s.trim();
  return /[.!?]$/.test(t) ? t : `${t}.`;
}
function accumulate(base: string, extra: string[], min = 50): string {
  let out = base;
  for (const s of extra) {
    if (wc(out) >= min) break;
    // Max-guard: skip a sentence that would overshoot the 70-word band
    // when the answer is already close, and try a shorter later one.
    if (wc(out) + wc(s) > 70 && wc(out) >= 42) continue;
    out += ` ${s}`;
  }
  return out;
}
function lowerFirst(s: string): string {
  // Lowercase a leading capital only for ordinary words ("Free…" → "free…"),
  // never for acronyms ("PKR…" stays "PKR…").
  return s.length > 1 && /[a-z]/.test(s.charAt(1)) ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

function buildPlaceAeo(place: Place): { directAnswer: string; faqs: AeoFaq[] } {
  const desc = sentencesOf(place.description);
  const hist = sentencesOf(place.history);
  const sig = sentencesOf(place.significance);
  const openClean = place.openHours.replace(/\.$/, '');
  const feeClean = place.entryFee.replace(/\.$/, '');
  const openSentence = asSentence(`${place.name} is open ${openClean}`);
  const visitSentence = `A typical visit takes ${place.averageVisit}.`;
  const bestSentence = asSentence(`The best time to visit is ${place.bestTimeToVisit.replace(/\.$/, '')}`);
  const tipSentences = place.tips.map((t) => asSentence(t.charAt(0).toUpperCase() + t.slice(1)));
  const nearbySentence = place.nearbyPlaces[0]
    ? `${place.nearbyPlaces[0].name} is just ${place.nearbyPlaces[0].distance} away, so the two are usually visited together.`
    : '';

  const directAnswer = [
    desc[0] ?? place.description,
    asSentence(`You will find it at ${place.address.replace(/\.$/, '')}`),
    asSentence(`It is open ${openClean}`),
    asSentence(`Entry: ${lowerFirst(feeClean)}`),
    bestSentence,
  ].join(' ');

  const faqs: AeoFaq[] = [
    {
      q: `Who built ${place.name}, and when?`,
      a: accumulate(hist[0] ?? '', [hist[1] ?? '', hist[2] ?? '', sig[0] ?? '']),
    },
    {
      q: `What are the opening hours of ${place.name}?`,
      a: accumulate(`${openSentence} ${visitSentence}`, [bestSentence, ...tipSentences]),
    },
    {
      q: `How much is the entry fee for ${place.name}?`,
      a: accumulate(asSentence(`The entry fee for ${place.name}: ${feeClean}`), [
        openSentence,
        `Plan ${place.averageVisit} for the visit.`,
        bestSentence,
        nearbySentence,
      ]),
    },
    {
      q: `What is the best time to visit ${place.name}?`,
      a: accumulate(`${bestSentence} ${openSentence} ${visitSentence}`, tipSentences),
    },
    {
      q: `Why is ${place.name} famous?`,
      a: accumulate(sig.join(' '), desc),
    },
  ];

  // Bank Q6 (capacity) — emitted only when the record's own significance
  // text states a capacity, and composed from those sentences alone.
  // (thingsToKnow is deliberately NOT used: the Badshahi record's
  // thingsToKnow capacity figure contradicts its significance text —
  // that contradiction is the F1 card's, not this generator's.)
  const capSentences = sig.filter((s) => /worshippers|accommodate|holds|capacity/i.test(s));
  if (capSentences.length > 0) {
    faqs.push({
      q: `How many people can ${place.name} hold?`,
      a: accumulate(capSentences.join(' '), [sig[0] ?? '', desc[0] ?? '', desc[1] ?? '']),
    });
  }

  // Bank Q7 (dress code) — emitted only when the record's own tips carry
  // one; a place whose record has no dress guidance gets no dress FAQ.
  const dressTips = tipSentences.filter((s) => /dress|modest|scarf|wear|clothing/i.test(s));
  if (dressTips.length > 0) {
    faqs.push({
      q: `What should visitors wear at ${place.name}?`,
      a: accumulate(dressTips.join(' '), [
        ...tipSentences.filter((s) => !dressTips.includes(s)),
        openSentence,
        bestSentence,
      ]),
    });
  }

  return { directAnswer, faqs };
}

export default async function FamousPlacePage({ params }: PageProps) {
  const { slug } = await params;
  const place = await getPlace(slug);
  if (!place) notFound();

  // ── Schema (SEO completion, Batch 4 Item 1): TouristAttraction +
  // BreadcrumbList, built ONLY from this record's fields. No FAQPage
  // node here (merge prep, billi's merge rule): on place pages the
  // surviving FAQPage is the one emitted from PR #85's visible answer
  // layer, so exactly one FAQPage remains after the merge.
  const placeUrl = `https://worldcityhub.vercel.app/places/${place.slug}`;
  const descText = (typeof place.description === 'string' ? place.description.trim() : '') || `${place.name} — ${place.city}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristAttraction',
        name: place.name,
        description: descText,
        url: placeUrl,
        geo: { '@type': 'GeoCoordinates', latitude: place.lat, longitude: place.lng },
        address: {
          '@type': 'PostalAddress',
          streetAddress: place.address,
          addressLocality: place.city,
          addressRegion: place.province,
          addressCountry: place.country,
        },
        ...(place.imageUrl ? { image: place.imageUrl } : {}),
        ...(place.wikiUrl ? { sameAs: [place.wikiUrl] } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://worldcityhub.vercel.app' },
          { '@type': 'ListItem', position: 2, name: place.country, item: `https://worldcityhub.vercel.app/${place.countrySlug}` },
          { '@type': 'ListItem', position: 3, name: place.province, item: `https://worldcityhub.vercel.app/${place.countrySlug}/${place.provinceSlug}` },
          { '@type': 'ListItem', position: 4, name: place.city, item: `https://worldcityhub.vercel.app/${place.countrySlug}/${place.provinceSlug}/${place.citySlug}` },
          { '@type': 'ListItem', position: 5, name: place.name, item: placeUrl },
        ],
      },
    ],
  };

  const mapsUrl = `https://www.google.com/maps?q=${place.lat},${place.lng}`;

  // Batch 4 Item 2: AEO answer layer data (from this place's own record).
  const { directAnswer: placeDirectAnswer, faqs: placeFaqs } = buildPlaceAeo(place);
  const placeAeoSource = `Hours, fees & facts: WorldCityHub place record — the same values shown in the visitor panel on this page`;

  return (
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Flag background symbol */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <FlagSymbolBackground countrySlug={place.countrySlug} />
      </div>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }} className="px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <Link href={`/${place.countrySlug}`} className="hover:text-gray-700">{place.country}</Link>
          <span>/</span>
          <Link href={`/${place.countrySlug}/${place.provinceSlug}/${place.citySlug}`} className="hover:text-gray-700">{place.city}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{place.name}</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {place.imageUrl
          ? <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${place.primaryColor} 0%, ${place.primaryColor}88 100%)` }} />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-5xl mx-auto">
            <Link href={`/${place.countrySlug}/${place.provinceSlug}/${place.citySlug}`}
              className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition">
              <ArrowLeft size={14} /> Back to {place.city}
            </Link>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium text-white border border-white/40">
                {place.category}
              </span>
              {place.unescoStatus && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-400/90 text-yellow-900">
                  🏛️ {place.unescoStatus.includes('✅') ? 'UNESCO World Heritage' : 'UNESCO Tentative'}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">{place.name}</h1>
            <p className="text-white/80 text-sm flex items-center gap-1.5">
              <MapPin size={13} /> {place.city}, {place.country}
            </p>
          </div>
        </div>
      </div>

      {/* B8 (final30): photo credit line under the hero, only on pages
          with a local licensed photo. Reuses existing small-text styling;
          no layout or design change beyond this caption line. */}
      {place.imageCredit && (
        <div className="max-w-5xl mx-auto px-4 pt-2">
          <p className="text-xs text-gray-400">Photo: {place.imageCredit}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Batch 4 Item 2: direct-answer block, first card under the heading */}
            <DirectAnswer answer={placeDirectAnswer} source={placeAeoSource} />

            {/* Tagline */}
            <div style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-2xl p-5">
              <p className="text-lg font-medium text-gray-800 italic">"{place.tagline}"</p>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{place.description}</p>
            </div>

            {/* History */}
            <div style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} style={{ color: place.primaryColor }} />
                <h2 className="font-bold text-gray-900">History</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{place.history}</p>
            </div>

            {/* Significance */}
            <div style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={16} style={{ color: place.primaryColor }} />
                <h2 className="font-bold text-gray-900">Why It Matters</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{place.significance}</p>
            </div>

            {/* Things to Know */}
            <div style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} style={{ color: place.primaryColor }} />
                <h2 className="font-bold text-gray-900">Key Facts</h2>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {generateFactsParagraph(place.name, place.city)}
              </p>
              <ul className="space-y-2">
                {place.thingsToKnow.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: place.primaryColor }}>
                      {i + 1}
                    </span>
                    {fact}
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 text-sm leading-relaxed mt-4">
                {generateFactsAfter(place.name, place.city)}
              </p>
            </div>

            {/* Visitor Tips */}
            <div style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Heart size={16} style={{ color: place.primaryColor }} />
                <h2 className="font-bold text-gray-900">Insider Tips</h2>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {generateTipsParagraph(place.name)}
              </p>
              <ul className="space-y-2">
                {place.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span style={{ color: place.primaryColor }}>✓</span> {tip}
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 text-sm leading-relaxed mt-4">
                {generateTipsAfter(place.name)}
              </p>
            </div>

            {/* Nearby places */}
            {place.nearbyPlaces.length > 0 && (
              <div style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Navigation size={16} style={{ color: place.primaryColor }} />
                  <h2 className="font-bold text-gray-900">Nearby Places</h2>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {generateNearbyParagraph(place.name, place.city)}
                </p>
                <div className="space-y-2">
                  {place.nearbyPlaces.map(nearby => {
                    // Link only to places that exist today (L1): a nearby
                    // name whose page is not published renders as a plain
                    // row — name + distance, no dead link. (Link audit,
                    // Batch 4 Item 1: allama-iqbal-tomb, hazuri-bagh and
                    // walled-city-lahore were linked here and 404'd.)
                    const rowInner = (
                      <>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} style={{ color: place.primaryColor }} />
                          <span className="text-sm font-medium text-gray-800">{nearby.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{nearby.distance}</span>
                      </>
                    );
                    return PLACES[nearby.slug] ? (
                      <Link key={nearby.slug} href={`/places/${nearby.slug}`}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition group">
                        {rowInner}
                      </Link>
                    ) : (
                      <div key={nearby.slug}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                        {rowInner}
                      </div>
                    );
                  })}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mt-4">
                  {generateNearbyAfter(place.name, place.city)}
                </p>
              </div>
            )}
            {/* Batch 4 Item 2: FAQ block + FAQPage schema (this template had no JSON-LD before) */}
            <FaqBlock faqs={placeFaqs} source={placeAeoSource} emitSchema />
          </div>

          {/* Right: Info sidebar */}
          <div className="space-y-4">

            {/* Visitor Info Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <h3 className="font-bold text-gray-900 mb-1">Visitor Information</h3>
              <p className="text-gray-700 text-xs leading-relaxed">
                {generateVisitorInfoParagraph(place.name)}
              </p>
              <div className="flex items-start gap-2 text-sm">
                <Clock size={15} style={{ color: place.primaryColor }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Opening Hours</p>
                  <p className="text-gray-500 text-xs mt-0.5">{place.openHours}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Ticket size={15} style={{ color: place.primaryColor }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Entry Fee</p>
                  <p className="text-gray-500 text-xs mt-0.5">{place.entryFee}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Sun size={15} style={{ color: place.primaryColor }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Best Time to Visit</p>
                  <p className="text-gray-500 text-xs mt-0.5">{place.bestTimeToVisit}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Users size={15} style={{ color: place.primaryColor }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Average Visit Duration</p>
                  <p className="text-gray-500 text-xs mt-0.5">{place.averageVisit}</p>
                </div>
              </div>
              {place.builtYear && (
                <div className="flex items-start gap-2 text-sm">
                  <Info size={15} style={{ color: place.primaryColor }} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700">Built</p>
                    <p className="text-gray-500 text-xs mt-0.5">{place.builtYear}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2 text-sm">
                <MapPin size={15} style={{ color: place.primaryColor }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Address</p>
                  <p className="text-gray-500 text-xs mt-0.5">{place.address}</p>
                </div>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed pt-2 border-t border-gray-100">
                {generateVisitorInfoAfter(place.name)}
              </p>
            </div>

            {/* Action buttons */}
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-medium text-sm transition hover:opacity-90"
              style={{ backgroundColor: place.primaryColor }}>
              <Navigation size={16} /> Get Directions
            </a>

            {place.bookingUrl && (
              <a href={place.bookingUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 font-medium text-sm transition hover:bg-gray-50"
                style={{ borderColor: place.primaryColor, color: place.primaryColor }}>
                <Ticket size={16} /> Book a Tour
              </a>
            )}

            {place.wikiUrl && (
              <a href={place.wikiUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm transition hover:bg-gray-50">
                <ExternalLink size={16} /> Wikipedia
              </a>
            )}

            {/* Map embed */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 h-48">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.lng - 0.01}%2C${place.lat - 0.01}%2C${place.lng + 0.01}%2C${place.lat + 0.01}&layer=mapnik&marker=${place.lat}%2C${place.lng}`}
                className="w-full h-full"
                style={{ border: 'none' }}
                title={`Map of ${place.name}`}
              />
            </div>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-center block text-gray-400 hover:text-gray-600 transition">
              View larger map ↗
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}
