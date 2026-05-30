import { Waves, Thermometer, Wind } from 'lucide-react';
import Link from 'next/link';

const oceans = [
  {
    name: 'Pacific Ocean',
    temp: 22,
    condition: 'Fair',
    waveHeight: '1.2m',
    image: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'pacific-ocean'
  },
  {
    name: 'Atlantic Ocean',
    temp: 19,
    condition: 'Moderate',
    waveHeight: '1.8m',
    image: 'https://images.pexels.com/photos/1547867/pexels-photo-1547867.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'atlantic-ocean'
  },
  {
    name: 'Indian Ocean',
    temp: 26,
    condition: 'Fair',
    waveHeight: '0.8m',
    image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'indian-ocean'
  },
  {
    name: 'Arctic Ocean',
    temp: 2,
    condition: 'Cold',
    waveHeight: '2.1m',
    image: 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'arctic-ocean'
  },
  {
    name: 'Southern Ocean',
    temp: 5,
    condition: 'Rough',
    waveHeight: '3.5m',
    image: 'https://images.pexels.com/photos/2101867/pexels-photo-2101867.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'southern-ocean'
  }
];

const getConditionColor = (condition: string) => {
  switch (condition) {
    case 'Fair': return 'text-green-400 bg-green-400/20';
    case 'Moderate': return 'text-yellow-400 bg-yellow-400/20';
    case 'Cold': return 'text-blue-400 bg-blue-400/20';
    case 'Rough': return 'text-red-400 bg-red-400/20';
    default: return 'text-gray-400 bg-gray-400/20';
  }
};

export default function OceansToday() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Waves className="w-5 h-5 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Oceans Today</h2>
        </div>
        <span className="text-gray-400 text-sm">Current conditions</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {oceans.map((ocean) => (
          <Link
            key={ocean.name}
            href={`/oceans/${ocean.slug}`}
            className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/30 transition-all group block"
          >
            <div className="relative h-32">
              <img
                src={ocean.image}
                alt={ocean.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-2 left-2">
                <h3 className="text-white font-semibold text-sm">{ocean.name}</h3>
              </div>
            </div>

            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-gray-400 text-xs">
                  <Thermometer className="w-3 h-3" />
                  <span>Water Temp</span>
                </div>
                <span className="text-cyan-400 font-bold">{ocean.temp}°C</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-gray-400 text-xs">
                  <Wind className="w-3 h-3" />
                  <span>Waves</span>
                </div>
                <span className="text-white text-sm">{ocean.waveHeight}</span>
              </div>

              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getConditionColor(ocean.condition)}`}>
                  {ocean.condition}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
