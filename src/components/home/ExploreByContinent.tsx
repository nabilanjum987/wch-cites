import { ArrowRight } from 'lucide-react';

const continents = [
  {
    name: 'Asia',
    image: 'https://images.pexels.com/photos/1624076/pexels-photo-1624076.jpeg?auto=compress&cs=tinysrgb&w=800',
    countries: 48,
    cities: 4521,
    gradient: 'from-red-600 to-orange-600'
  },
  {
    name: 'Middle East',
    image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
    countries: 18,
    cities: 892,
    gradient: 'from-amber-600 to-yellow-600'
  },
  {
    name: 'Africa',
    image: 'https://images.pexels.com/photos/1048929/pexels-photo-1048929.jpeg?auto=compress&cs=tinysrgb&w=800',
    countries: 54,
    cities: 1845,
    gradient: 'from-emerald-600 to-teal-600'
  },
  {
    name: 'Europe',
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800',
    countries: 44,
    cities: 2156,
    gradient: 'from-blue-600 to-indigo-600'
  },
  {
    name: 'N. America',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
    countries: 23,
    cities: 1102,
    gradient: 'from-blue-700 to-cyan-600'
  },
  {
    name: 'S. America',
    image: 'https://images.pexels.com/photos/1106127/pexels-photo-1106127.jpeg?auto=compress&cs=tinysrgb&w=800',
    countries: 12,
    cities: 789,
    gradient: 'from-green-600 to-lime-600'
  },
  {
    name: 'SE Asia',
    image: 'https://images.pexels.com/photos/1709229/pexels-photo-1709229.jpeg?auto=compress&cs=tinysrgb&w=800',
    countries: 11,
    cities: 654,
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    name: 'Oceania',
    image: 'https://images.pexels.com/photos/1680247/pexels-photo-1680247.jpeg?auto=compress&cs=tinysrgb&w=800',
    countries: 14,
    cities: 288,
    gradient: 'from-cyan-600 to-teal-600'
  }
];

export default function ExploreByContinent() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Explore by Continent</h2>
        <span className="text-gray-400">Discover cities worldwide</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {continents.map((continent) => (
          <button
            key={continent.name}
            className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all"
          >
            <div className="relative h-48">
              <img
                src={continent.image}
                alt={continent.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${continent.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-bold text-white mb-2">{continent.name}</h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-gray-200">
                    <span className="font-semibold text-white">{continent.countries}</span> countries
                  </div>
                  <div className="text-gray-200">
                    <span className="font-semibold text-white">{continent.cities.toLocaleString()}</span> cities
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
