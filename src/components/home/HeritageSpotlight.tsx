import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

const spotlight = {
  name: 'Lahori Khussa',
  origin: 'Lahore, Pakistan',
  flag: '🇵🇰',
  age: '400+ years',
  workers: '50,000+ artisans',
  image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
  description:
    'Hand-stitched from genuine leather and decorated with intricate thread embroidery, the Lahori Khussa has been made in the walled city of Lahore for over four centuries. Each pair takes a skilled artisan up to three days to complete. Found in the bazaars of Rang Mahal and Androon Lahore, these shoes are now exported to over 40 countries and are considered one of Pakistan\'s finest craft traditions.',
  slug: '/pakistan/punjab/lahore/heritage-products',
  country_slug: '/pakistan',
};

export default function HeritageSpotlight() {
  return (
    <div className="mb-4">
      {/* SEO Paragraph */}
      <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-4xl">
        Every city on earth has something made there that nowhere else can replicate. A craft, a food,
        a textile, a technique passed down through generations. WorldCityHub's Heritage Spotlight
        brings one of these products to the front each month, telling the story of the people who
        make it, how it is made, and where to find it. These are not just products. They are living
        proof of what cities are really made of.
      </p>

      <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative h-64 md:h-auto">
            <img
              src={spotlight.image}
              alt={spotlight.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-400 text-xs font-semibold">Heritage Spotlight</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{spotlight.flag}</span>
                <span className="text-gray-400 text-sm">{spotlight.origin}</span>
              </div>
              <h3 className="text-white text-2xl font-bold mb-3">{spotlight.name}</h3>

              <div className="flex gap-4 mb-4">
                <div className="text-center">
                  <div className="text-amber-400 font-bold text-sm">{spotlight.age}</div>
                  <div className="text-gray-500 text-xs">Craft Age</div>
                </div>
                <div className="text-center">
                  <div className="text-amber-400 font-bold text-sm">{spotlight.workers}</div>
                  <div className="text-gray-500 text-xs">Employed</div>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {spotlight.description}
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href={spotlight.slug}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-all"
              >
                View heritage products
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={spotlight.country_slug}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 transition-all"
              >
                Explore Pakistan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
