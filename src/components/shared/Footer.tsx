import { Globe, Twitter, Facebook, Instagram, Github, ExternalLink } from 'lucide-react';

const footerLinks = {
  explore: [
    { label: 'Cities', href: '#' },
    { label: 'Countries', href: '#' },
    { label: 'Prayer Times', href: '#' },
    { label: 'Weather', href: '#' },
    { label: 'Gold Rates', href: '#' },
  ],
  discover: [
    { label: 'News', href: '#' },
    { label: 'Events', href: '#' },
    { label: 'Sports', href: '#' },
    { label: 'Horoscope', href: '#' },
    { label: 'Wonders', href: '#' },
  ],
  features: [
    { label: 'Compare Cities', href: '#' },
    { label: 'Oceans', href: '#' },
    { label: 'My Location', href: '#' },
    { label: 'Heritage', href: '#' },
    { label: 'Religion', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Sitemap', href: '#' },
  ],
};

const dataSources = [
  { name: 'OpenWeatherMap', href: 'https://openweathermap.org' },
  { name: 'Aladhan', href: 'https://aladhan.com' },
  { name: 'Wikipedia', href: 'https://wikipedia.org' },
  { name: 'World Bank', href: 'https://worldbank.org' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/10 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-8 h-8 text-teal-400" />
              <span className="text-white font-bold text-xl">WorldCityHub</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your gateway to every city on Earth. Weather, prayer times, gold rates, news, and heritage — all in one place.
            </p>
            <div className="flex items-center space-x-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Discover</h3>
            <ul className="space-y-2">
              {footerLinks.discover.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              {footerLinks.features.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 mb-6">
          <div className="text-gray-400 text-xs mb-3">Data Sources</div>
          <div className="flex flex-wrap gap-4">
            {dataSources.map((source) => (
              <a
                key={source.name}
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-300 text-xs transition-colors"
              >
                <span>{source.name}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} WorldCityHub. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2 md:mt-0">
            Every City. Every Culture. Every Day.
          </p>
        </div>
      </div>
    </footer>
  );
}
