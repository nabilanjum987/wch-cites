import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const featuredCountries = [
  { name: 'Pakistan',       flag: '🇵🇰', cities: 312,  slug: 'pakistan',       color: '#01411C' },
  { name: 'Saudi Arabia',   flag: '🇸🇦', cities: 89,   slug: 'saudi-arabia',   color: '#006C35' },
  { name: 'India',          flag: '🇮🇳', cities: 640,  slug: 'india',          color: '#FF9933' },
  { name: 'UAE',            flag: '🇦🇪', cities: 42,   slug: 'uae',            color: '#00732F' },
  { name: 'United Kingdom', flag: '🇬🇧', cities: 185,  slug: 'uk',             color: '#012169' },
  { name: 'USA',            flag: '🇺🇸', cities: 924,  slug: 'usa',            color: '#B22234' },
  { name: 'Turkey',         flag: '🇹🇷', cities: 148,  slug: 'turkey',         color: '#E30A17' },
  { name: 'Egypt',          flag: '🇪🇬', cities: 97,   slug: 'egypt',          color: '#CE1126' },
  { name: 'Indonesia',      flag: '🇮🇩', cities: 210,  slug: 'indonesia',      color: '#CE1126' },
  { name: 'Malaysia',       flag: '🇲🇾', cities: 78,   slug: 'malaysia',       color: '#CC0001' },
  { name: 'China',          flag: '🇨🇳', cities: 370,  slug: 'china',          color: '#DE2910' },
  { name: 'France',         flag: '🇫🇷', cities: 156,  slug: 'france',         color: '#002395' },
];

export default function FeaturedCountries() {
  return (
    <div className="mb-4">
      {/* Section SEO Paragraph */}
      <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-4xl">
        WorldCityHub spans 195 countries and every major territory on earth. Each country page brings
        together weather across major cities, prayer and faith times, gold and currency rates,
        national news, heritage products, and a full guide to the country's provinces and cities.
        Below are twelve of the most visited countries on the platform. Click any country to explore
        its cities, or browse the full directory to find any nation in the world.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        {featuredCountries.map((country) => (
          <Link
            key={country.slug}
            href={`/${country.slug}`}
            className="group relative rounded-2xl border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all p-4 flex flex-col items-center text-center gap-2"
          >
            <span className="text-4xl leading-none">{country.flag}</span>
            <span className="text-white font-semibold text-sm leading-tight">{country.name}</span>
            <span className="text-gray-500 text-xs">{country.cities.toLocaleString()} cities</span>
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: country.color }}
            />
          </Link>
        ))}
      </div>

      <div className="flex justify-center">
        <Link
          href="/countries"
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all hover:border-white/40"
        >
          View all 195 countries
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
