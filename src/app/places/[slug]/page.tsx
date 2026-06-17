import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Clock, Ticket, Camera, Star,
  ExternalLink, Navigation, Info, Sun, Users,
  BookOpen, Globe, Heart
} from 'lucide-react';

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
      { name: 'Walled City of Lahore', slug: 'walled-city-lahore', distance: '0.5 km' },
    ],
    history: 'Commissioned by the sixth Mughal Emperor Aurangzeb in 1671 and completed in 1673, Badshahi Mosque was the largest mosque in the world for over 300 years. It was built to replace the earlier Wazir Khan Mosque as Lahore\'s principal congregational mosque. During the Sikh Empire, the mosque was used as a military garrison. The British used it as a barracks during colonial rule. It was returned to Muslim use after the 1947 partition.',
    significance: 'Badshahi Mosque is the defining symbol of Lahore and one of the finest examples of Mughal architecture in the world. Its grand prayer hall can accommodate 55,000 worshippers. The courtyard alone holds 100,000 people — making it one of the largest open-air prayer spaces on earth.',
    thingsToKnow: [
      'Capacity: 55,000 inside, 95,000 in the courtyard',
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
    ],
    nearbyPlaces: [
      { name: 'Badshahi Mosque', slug: 'badshahi-mosque', distance: '0.3 km' },
      { name: 'Hazuri Bagh', slug: 'hazuri-bagh', distance: '0.1 km' },
    ],
    history: 'The origins of Lahore Fort trace back to antiquity, though the current structure was largely built during the Mughal era. Emperor Akbar rebuilt it in burnt brick in 1566. Subsequent emperors — Jahangir, Shah Jahan and Aurangzeb — each added magnificent new sections. The Sikh Empire under Ranjit Singh and later the British colonial administration also left their marks. Today 21 monuments within the fort span different eras.',
    significance: 'As a UNESCO World Heritage Site since 1981, Lahore Fort is Pakistan\'s most important historical monument. It represents the full arc of Mughal civilization at its peak, from military fortification to intimate royal quarters and the world-famous Sheesh Mahal.',
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
  return {
    title: `${place.name}, ${place.city} — Visitor Guide, History & Tips | WorldCityHub`,
    description: place.description.slice(0, 160),
    alternates: { canonical: `https://worldcityhub.vercel.app/places/${slug}` },
    openGraph: {
      title: `${place.name} | WorldCityHub`,
      description: place.description.slice(0, 160),
      images: place.imageUrl ? [{ url: place.imageUrl }] : [],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(PLACES).map(slug => ({ slug }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function FamousPlacePage({ params }: PageProps) {
  const { slug } = await params;
  const place = await getPlace(slug);
  if (!place) notFound();

  const mapsUrl = `https://www.google.com/maps?q=${place.lat},${place.lng}`;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
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

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Tagline */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-lg font-medium text-gray-800 italic">"{place.tagline}"</p>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{place.description}</p>
            </div>

            {/* History */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} style={{ color: place.primaryColor }} />
                <h2 className="font-bold text-gray-900">History</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{place.history}</p>
            </div>

            {/* Significance */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={16} style={{ color: place.primaryColor }} />
                <h2 className="font-bold text-gray-900">Why It Matters</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{place.significance}</p>
            </div>

            {/* Things to Know */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} style={{ color: place.primaryColor }} />
                <h2 className="font-bold text-gray-900">Key Facts</h2>
              </div>
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
            </div>

            {/* Visitor Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Heart size={16} style={{ color: place.primaryColor }} />
                <h2 className="font-bold text-gray-900">Insider Tips</h2>
              </div>
              <ul className="space-y-2">
                {place.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span style={{ color: place.primaryColor }}>✓</span> {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nearby places */}
            {place.nearbyPlaces.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Navigation size={16} style={{ color: place.primaryColor }} />
                  <h2 className="font-bold text-gray-900">Nearby Places</h2>
                </div>
                <div className="space-y-2">
                  {place.nearbyPlaces.map(nearby => (
                    <Link key={nearby.slug} href={`/places/${nearby.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition group">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} style={{ color: place.primaryColor }} />
                        <span className="text-sm font-medium text-gray-800 group-hover:underline">{nearby.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{nearby.distance}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Info sidebar */}
          <div className="space-y-4">

            {/* Visitor Info Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <h3 className="font-bold text-gray-900 mb-1">Visitor Information</h3>
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
