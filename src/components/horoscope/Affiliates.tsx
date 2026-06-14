import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, Layers, Gem, Sparkles } from 'lucide-react';

interface Props {
  primaryColor: string;
}

interface AffiliateLink {
  id: string;
  title: string;
  description: string;
  cta: string;
  url: string;
  commission: string;
  icon: React.ReactNode;
  bgColor: string;
}

const AFFILIATES: AffiliateLink[] = [
  {
    id: 'keen',
    title: 'Full Birth Chart Reading',
    description: 'Get a personalized birth chart reading from expert astrologers at Keen.',
    cta: 'Get Full Reading ',
    url: 'https://www.keen.com',
    commission: '30% commission',
    icon: <Sparkles size={18} />,
    bgColor: 'bg-gradient-to-r from-violet-50 to-purple-50',
  },
  {
    id: 'udemy',
    title: 'Astrology Course',
    description: 'Learn to read birth charts with comprehensive astrology courses on Udemy.',
    cta: 'Browse Courses ',
    url: 'https://www.udemy.com',
    commission: '40% commission',
    icon: <BookOpen size={18} />,
    bgColor: 'bg-gradient-to-r from-blue-50 to-cyan-50',
  },
  {
    id: 'tarot-deck',
    title: 'Tarot Deck Collection',
    description: 'Beautiful tarot decks for your spiritual practice, from classic Rider-Waite to artistic indie decks.',
    cta: 'Shop Tarot Decks ',
    url: 'https://www.amazon.com/s?k=tarot+deck',
    commission: '8% commission',
    icon: <Layers size={18} />,
    bgColor: 'bg-gradient-to-r from-amber-50 to-yellow-50',
  },
  {
    id: 'crystals',
    title: 'Crystal Healing Set',
    description: 'Healing crystals chosen for each zodiac sign. Perfect for meditation and energy work.',
    cta: 'Shop Crystals ',
    url: 'https://www.amazon.com/s?k=healing+crystals+zodiac',
    commission: '8% commission',
    icon: <Gem size={18} />,
    bgColor: 'bg-gradient-to-r from-emerald-50 to-teal-50',
  },
];

export default function Affiliates({ primaryColor }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
    >
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Sparkles size={18} style={{ color: primaryColor }} />
        <h2 className="font-semibold text-gray-900 text-sm">Explore More</h2>
      </div>

      <div className="p-5 space-y-3">
        {AFFILIATES.map((aff, i) => (
          <motion.a
            key={aff.id}
            href={aff.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`${aff.bgColor} rounded-xl p-4 flex items-start gap-4 hover:shadow-md transition-shadow block border border-gray-100`}
          >
            <div className="shrink-0">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                {aff.icon}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">{aff.title}</h3>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{aff.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-xs font-semibold flex items-center gap-1"
                  style={{ color: primaryColor }}
                >
                  {aff.cta}
                  <ExternalLink size={10} />
                </span>
              </div>
            </div>
          </motion.a>
        ))}

        <p className="text-[10px] text-gray-400 text-center pt-2">
          Affiliate links. Purchases support this site at no extra cost to you.
        </p>
      </div>
    </motion.div>
  );
}
