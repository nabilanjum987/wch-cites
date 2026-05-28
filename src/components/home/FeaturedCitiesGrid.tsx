import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface FeaturedCity {
  name: string;
  city_slug: string;
  country: string;
  country_code: string;
  population: number;
  famous_for: string;
  temperature: number;
  weatherEmoji: string;
  nextPrayer: string;
  imageUrl: string;
}

const featuredCitySlugs = [
  'mecca', 'vatican', 'jerusalem', 'amritsar',
  'lahore', 'mumbai', 'dhaka', 'karachi',
  'dubai', 'london', 'new-york', 'tokyo'
];

const placeholderImages = {
  mecca: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Mecca_photo.jpg/800px-Mecca_photo.jpg',
  vatican: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Vatican_City%2C_view_from_Saint_Peter%27s_Basilica.jpg/800px-Vatican_City%2C_view_from_Saint_Peter%27s_Basilica.jpg',
  jerusalem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Jerusalem-panorama.jpg/800px-Jerusalem-panorama.jpg',
  amritsar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Golden_Temple%2C_Amritsar.jpg/800px-Golden_Temple%2C_Amritsar.jpg',
  lahore: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Badshahi_March.jpg/800px-Badshahi_March.jpg',
  mumbai: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Mumbai_Presidency_area.jpg/800px-Mumbai_Presidency_area.jpg',
  dhaka: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Aerial_view_of_Dhaka_city.jpg/800px-Aerial_view_of_Dhaka_city.jpg',
  karachi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Karachi_Port%2C_Clifton_Beach_view.jpg/800px-Karachi_Port%2C_Clifton_Beach_view.jpg',
  dubai: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
  london: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800',
  'new-york': 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
  tokyo: 'https://images.pexels.com/photos/2506926/pexels-photo-2506926.jpeg?auto=compress&cs=tinysrgb&w=800'
};

export default function FeaturedCitiesGrid() {
  const [cities, setCities] = useState<FeaturedCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('name, city_slug, country, country_code, population, famous_for')
        .in('city_slug', featuredCitySlugs)
        .eq('is_active', true);

      if (!error && data) {
        const citiesWithWeather = data.map(city => {
          const temp = Math.floor(15 + Math.random() * 25);
          return {
            ...city,
            temperature: temp,
            weatherEmoji: temp > 30 ? '☀️' : temp > 20 ? '🌤️' : '🌥️',
            nextPrayer: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'][Math.floor(Math.random() * 5)],
            imageUrl: placeholderImages[city.city_slug as keyof typeof placeholderImages] || 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800'
          };
        });

        const sortedCities = featuredCitySlugs.map(slug =>
          citiesWithWeather.find(c => c.city_slug === slug)
        ).filter(Boolean) as FeaturedCity[];

        setCities(sortedCities);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCountryFlag = (countryCode: string): string => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Featured Cities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-white/10 rounded-2xl overflow-hidden h-64"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Featured Cities</h2>
        <span className="text-gray-400">Explore world destinations</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cities.map((city) => (
          <div
            key={city.city_slug}
            className="relative group cursor-pointer"
            onMouseEnter={() => setHoveredCity(city.city_slug)}
            onMouseLeave={() => setHoveredCity(null)}
          >
            <div className="overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all">
              <div className="relative h-40">
                <img
                  src={city.imageUrl}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              <div className="p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">{city.name}</h3>
                    <span className="text-2xl">{getCountryFlag(city.country_code)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <span>{city.weatherEmoji}</span>
                    <span>{city.temperature}°C</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-green-400">🕌</span>
                    <span className="text-gray-400 text-xs">{city.nextPrayer}</span>
                  </div>
                </div>
              </div>
            </div>

            {hoveredCity === city.city_slug && city.famous_for && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-white whitespace-nowrap z-50 border border-white/20 shadow-xl">
                <div className="font-semibold mb-1">{city.name}</div>
                <div className="text-gray-300 text-xs">{city.famous_for}</div>
                <div className="text-gray-400 text-xs mt-1">Population: {city.population.toLocaleString()}</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black/90 border-r border-b border-white/20" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
