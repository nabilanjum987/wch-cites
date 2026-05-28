import { motion } from 'framer-motion';
import { TreePine, Utensils, Building2, ExternalLink } from 'lucide-react';

interface Props {
  cityName: string;
  primaryColor: string;
}

export default function TourAffiliates({ cityName, primaryColor }: Props) {
  const tours = [
    {
      icon: <TreePine size={20} />,
      title: `Heritage Walk ${cityName}`,
      desc: 'Guided walking tour through historic landmarks and hidden gems',
      provider: 'Viator',
      commission: '8%',
      url: `https://www.viator.com/searchResults/all?text=${encodeURIComponent(cityName + ' heritage walk')}`,
      color: '#0F766E',
    },
    {
      icon: <Utensils size={20} />,
      title: `Street Food Tour`,
      desc: 'Taste the best local street food with an expert guide',
      provider: 'GetYourGuide',
      commission: '8%',
      url: `https://www.getyourguide.com/s?q=${encodeURIComponent(cityName + ' street food tour')}`,
      color: '#C2410C',
    },
    {
      icon: <Building2 size={20} />,
      title: `Book Hotels for Event`,
      desc: 'Find the best hotels near event venues in the city',
      provider: 'Booking.com',
      commission: '4%',
      url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(cityName)}&aid=worldcityhub`,
      color: '#1D4ED8',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tours.map((tour) => (
          <a
            key={tour.provider}
            href={tour.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col hover:shadow-md transition-all"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-white"
              style={{ backgroundColor: tour.color }}
            >
              {tour.icon}
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:underline">{tour.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">{tour.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600">
                {tour.provider}
              </span>
              <span
                className="flex items-center gap-1 text-xs font-semibold transition-colors"
                style={{ color: primaryColor }}
              >
                Book Now <ExternalLink size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
