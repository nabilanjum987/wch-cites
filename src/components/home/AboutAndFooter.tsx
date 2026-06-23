import Link from 'next/link';
import { Globe, Mail, Github } from 'lucide-react';

const footerLinks = {
  Explore: [
    { label: 'All Countries', href: '/countries' },
    { label: 'World Wonders', href: '/wonders' },
    { label: 'Oceans & Seas', href: '/oceans' },
    { label: 'Active Conflicts', href: '/conflicts' },
    { label: 'Compare Cities', href: '/compare' },
  ],
  'Tools & Data': [
    { label: 'Prayer Times', href: '/prayer-times' },
    { label: 'Gold & Rates', href: '/rates' },
    { label: 'World Weather', href: '/weather' },
    { label: 'Horoscope', href: '/horoscope' },
    { label: 'My Location', href: '/my-location' },
  ],
  'Top Cities': [
    { label: 'Lahore', href: '/pakistan/punjab/lahore' },
    { label: 'Dubai', href: '/uae/dubai/dubai' },
    { label: 'Istanbul', href: '/turkey/istanbul/istanbul' },
    { label: 'London', href: '/uk/england/london' },
    { label: 'Tokyo', href: '/japan/tokyo/tokyo' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Data Sources', href: '/sources' },
    { label: 'Contact Us', href: '/contact' },
  ],
};

export default function AboutAndFooter() {
  return (
    <>
      {/* About Section */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">About WorldCityHub</h2>
              </div>
              <p className="text-gray-400 text-base leading-relaxed mb-4">
                WorldCityHub was built on one simple idea: every city on earth deserves its own
                page with real, useful, daily-updated information. Not just a Wikipedia summary,
                but live weather, prayer and faith times, gold rates, local news, heritage
                products, famous people, and cultural events all in one place.
              </p>
              <p className="text-gray-400 text-base leading-relaxed">
                We cover 10,247 cities across 195 countries, with data updated throughout the day.
                Whether you are a traveller, a member of a diaspora community, a student, or
                just someone curious about the world, WorldCityHub is built for you.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '10,247', label: 'Cities Covered' },
                { value: '195', label: 'Countries' },
                { value: '20+', label: 'Data Points Per City' },
                { value: '24/7', label: 'Live Updates' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center"
                >
                  <div className="text-indigo-400 text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/30 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              <span className="text-white font-bold">WorldCityHub</span>
              <span className="text-gray-600 text-sm">— Every City. Every Culture. Every Day.</span>
            </div>
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} WorldCityHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
