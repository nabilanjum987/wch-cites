import { Landmark, ArrowRight, Sun, Cloud } from 'lucide-react';

const wonders = [
  {
    name: 'Petra',
    country: 'Jordan',
    countryCode: 'JO',
    image: 'https://images.pexels.com/photos/2114014/pexels-photo-2114014.jpeg?auto=compress&cs=tinysrgb&w=800',
    weather: { temp: 28, condition: 'sunny' }
  },
  {
    name: 'Great Wall of China',
    country: 'China',
    countryCode: 'CN',
    image: 'https://images.pexels.com/photos/2387878/pexels-photo-2387878.jpeg?auto=compress&cs=tinysrgb&w=800',
    weather: { temp: 24, condition: 'cloudy' }
  },
  {
    name: 'Christ the Redeemer',
    country: 'Brazil',
    countryCode: 'BR',
    image: 'https://images.pexels.com/photos/1166200/pexels-photo-1166200.jpeg?auto=compress&cs=tinysrgb&w=800',
    weather: { temp: 32, condition: 'sunny' }
  },
  {
    name: 'Machu Picchu',
    country: 'Peru',
    countryCode: 'PE',
    image: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=800',
    weather: { temp: 18, condition: 'cloudy' }
  },
  {
    name: 'Chichen Itza',
    country: 'Mexico',
    countryCode: 'MX',
    image: 'https://images.pexels.com/photos/4058028/pexels-photo-4058028.jpeg?auto=compress&cs=tinysrgb&w=800',
    weather: { temp: 35, condition: 'sunny' }
  },
  {
    name: 'Roman Colosseum',
    country: 'Italy',
    countryCode: 'IT',
    image: 'https://images.pexels.com/photos/1702572/pexels-photo-1702572.jpeg?auto=compress&cs=tinysrgb&w=800',
    weather: { temp: 22, condition: 'sunny' }
  },
  {
    name: 'Taj Mahal',
    country: 'India',
    countryCode: 'IN',
    image: 'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800',
    weather: { temp: 38, condition: 'sunny' }
  }
];

const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default function FeaturedWonders() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Landmark className="w-5 h-5 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Featured Wonders</h2>
        </div>
        <button className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
          <span>Explore all wonders</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {wonders.map((wonder) => (
          <button
            key={wonder.name}
            className="min-w-[280px] bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all flex-shrink-0 group"
          >
            <div className="relative h-44">
              <img
                src={wonder.image}
                alt={wonder.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getCountryFlag(wonder.countryCode)}</span>
                  <span className="text-white font-semibold">{wonder.name}</span>
                </div>
                <div className="text-gray-300 text-sm">{wonder.country}</div>
              </div>
            </div>

            <div className="p-3 flex items-center justify-between">
              <span className="text-gray-400 text-sm">Weather TODAY</span>
              <div className="flex items-center space-x-2">
                {wonder.weather.condition === 'sunny' ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Cloud className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-white font-medium">{wonder.weather.temp}°C</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
