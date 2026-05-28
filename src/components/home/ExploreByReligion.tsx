import { ArrowRight } from 'lucide-react';

const religions = [
  {
    name: 'Islam',
    icon: '☪️',
    color: '#01411C',
    gradient: 'from-green-600 to-green-800',
    description: 'Discover prayer times for Mecca, Medina, and cities with Islamic heritage',
    cities: ['Mecca', 'Medina', 'Istanbul', 'Cairo', 'Lahore']
  },
  {
    name: 'Christianity',
    icon: '✝️',
    color: '#1a237e',
    gradient: 'from-blue-700 to-blue-900',
    description: 'Explore Vatican City, Jerusalem, and cities with Christian history',
    cities: ['Vatican City', 'Jerusalem', 'Rome', 'Bethlehem']
  },
  {
    name: 'Hinduism',
    icon: '🕉️',
    color: '#e65100',
    gradient: 'from-orange-600 to-orange-800',
    description: 'Visit Varanasi, Haridwar, and sacred Hindu pilgrimage sites',
    cities: ['Varanasi', 'Haridwar', 'Rishikesh', 'Ayodhya']
  },
  {
    name: 'Judaism',
    icon: '✡️',
    color: '#0d47a1',
    gradient: 'from-blue-600 to-blue-800',
    description: 'Explore Jerusalem, Tel Aviv, and cities with Jewish heritage',
    cities: ['Jerusalem', 'Tel Aviv', 'Hebron', 'Safed']
  },
  {
    name: 'Buddhism',
    icon: '☸️',
    color: '#4a148c',
    gradient: 'from-purple-700 to-purple-900',
    description: 'Discover Lumbini, Bodh Gaya, and Buddhist pilgrimage sites',
    cities: ['Lumbini', 'Bodh Gaya', 'Kushinagar', 'Sarnath']
  },
  {
    name: 'Sikhism',
    icon: '🙏',
    color: '#f57f17',
    gradient: 'from-yellow-600 to-orange-600',
    description: 'Visit Amritsar, Anandpur Sahib, and Sikh holy places',
    cities: ['Amritsar', 'Anandpur Sahib', 'Nanded', 'Patna Sahib']
  },
  {
    name: 'No Religion',
    icon: '🧘',
    color: '#004d40',
    gradient: 'from-teal-600 to-teal-800',
    description: 'Explore secular cities and places of spiritual diversity',
    cities: ['Tokyo', 'Berlin', 'Amsterdam', 'Stockholm']
  }
];

export default function ExploreByReligion() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Explore by Religion</h2>
        <span className="text-gray-400">Find cities by faith</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {religions.map((religion) => (
          <button
            key={religion.name}
            className={`bg-gradient-to-br ${religion.gradient} rounded-2xl p-6 text-left hover:scale-105 transition-all group border border-white/10`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-5xl">{religion.icon}</span>
              <div
                className="w-4 h-4 rounded-full border-2 border-white/30"
                style={{ backgroundColor: religion.color }}
              />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{religion.name}</h3>

            <p className="text-gray-200 text-sm mb-4 line-clamp-2">
              {religion.description}
            </p>

            <div className="flex items-center text-white/80 text-sm font-medium group-hover:text-white transition-colors">
              Explore prayer times
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
