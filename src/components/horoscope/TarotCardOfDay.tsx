import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, Share2, X } from 'lucide-react';
import { getTarotCardForToday, getShareText, SUIT_COLORS } from '../../lib/apis/tarot';
import type { TarotCard } from '../../types/tarot';

interface Props {
  primaryColor: string;
}

function TarotSVG({ card, isReversed }: { card: TarotCard; isReversed: boolean }) {
  const baseColor = card.arcana === 'major' ? '#1E293B' : (card.suit ? SUIT_COLORS[card.suit] : '#64748B');

  const symbolMap: Record<string, React.ReactNode> = {
    // Major Arcana symbols
    fool: (
      <>
        <path d="M40 25 Q50 15 60 25 L55 60 L45 60 Z" fill={baseColor} />
        <circle cx="50" cy="35" r="6" fill="white" />
        <circle cx="50" cy="35" r="3" fill={baseColor} />
      </>
    ),
    magician: (
      <>
        <line x1="50" y1="20" x2="50" y2="70" stroke={baseColor} strokeWidth="3" />
        <circle cx="50" cy="20" r="8" fill={baseColor} />
        <path d="M40 75 Q50 85 60 75" stroke={baseColor} strokeWidth="2" fill="none" />
      </>
    ),
    priestess: (
      <>
        <circle cx="35" cy="50" r="12" fill={baseColor} />
        <circle cx="65" cy="50" r="12" fill={baseColor} />
        <circle cx="50" cy="50" r="10" fill="white" />
        <path d="M50 60 L50 85" stroke={baseColor} strokeWidth="3" />
      </>
    ),
    empress: (
      <>
        <path d="M40 30 Q50 15 60 30 L55 80 L45 80 Z" fill={baseColor} />
        <circle cx="45" cy="25" r="2" fill="#EAB308" />
        <circle cx="55" cy="20" r="2" fill="#EAB308" />
        <circle cx="50" cy="17" r="2" fill="#EAB308" />
      </>
    ),
    emperor: (
      <>
        <rect x="35" y="20" width="30" height="30" fill={baseColor} />
        <path d="M40 55 L40 85 M60 55 L60 85" stroke={baseColor} strokeWidth="4" />
        <path d="M45 30 L55 30 L55 45 L45 45 Z" fill="white" />
      </>
    ),
    hierophant: (
      <>
        <path d="M35 30 L50 15 L65 30 L65 75 L35 75 Z" fill={baseColor} />
        <path d="M40 40 L50 30 L60 40" stroke="white" strokeWidth="2" fill="none" />
      </>
    ),
    lovers: (
      <>
        <circle cx="35" cy="25" r="10" fill={baseColor} />
        <circle cx="65" cy="25" r="10" fill={baseColor} />
        <path d="M35 40 L35 70 M65 40 L65 70" stroke={baseColor} strokeWidth="3" />
        <path d="M30 80 Q50 65 70 80" stroke="#EF4444" strokeWidth="2" fill="none" />
      </>
    ),
    chariot: (
      <>
        <rect x="30" y="30" width="40" height="25" fill={baseColor} />
        <circle cx="32" cy="70" r="8" fill={baseColor} />
        <circle cx="68" cy="70" r="8" fill={baseColor} />
        <circle cx="32" cy="70" r="4" fill="white" />
        <circle cx="68" cy="70" r="4" fill="white" />
        <circle cx="50" cy="20" r="5" fill={baseColor} />
      </>
    ),
    strength: (
      <>
        <path d="M40 55 Q50 70 60 55" fill={baseColor} />
        <path d="M44 45 Q50 35 56 45" fill="white" />
        <circle cx="42" cy="42" r="2" fill={baseColor} />
        <circle cx="58" cy="42" r="2" fill={baseColor} />
        <circle cx="50" cy="20" r="8" fill="none" stroke={baseColor} strokeWidth="3" />
      </>
    ),
    hermit: (
      <>
        <path d="M45 15 L45 60 M45 15 L55 40" stroke={baseColor} strokeWidth="3" />
        <circle cx="65" cy="25" r="5" fill="#FDE68A" />
        <line x1="65" y1="30" x2="65" y2="45" stroke={baseColor} strokeWidth="2" />
      </>
    ),
    wheel: (
      <>
        <circle cx="50" cy="50" r="30" fill="none" stroke={baseColor} strokeWidth="4" />
        <circle cx="50" cy="50" r="8" fill={baseColor} />
        <line x1="50" y1="20" x2="50" y2="42" stroke={baseColor} strokeWidth="2" />
        <line x1="50" y1="58" x2="50" y2="80" stroke={baseColor} strokeWidth="2" />
        <line x1="20" y1="50" x2="42" y2="50" stroke={baseColor} strokeWidth="2" />
        <line x1="58" y1="50" x2="80" y2="50" stroke={baseColor} strokeWidth="2" />
      </>
    ),
    justice: (
      <>
        <path d="M30 40 L30 80 M70 40 L70 80" stroke={baseColor} strokeWidth="4" />
        <path d="M30 40 L70 40" stroke={baseColor} strokeWidth="4" />
        <line x1="42" y1="50" x2="58" y2="50" stroke={baseColor} strokeWidth="2" />
        <line x1="50" y1="35" x2="50" y2="65" stroke={baseColor} strokeWidth="2" />
      </>
    ),
    hanged: (
      <>
        <line x1="50" y1="20" x2="20" y2="55" stroke={baseColor} strokeWidth="4" />
        <line x1="50" y1="20" x2="80" y2="55" stroke={baseColor} strokeWidth="4" />
        <path d="M50 55 L50 85" stroke={baseColor} strokeWidth="3" />
        <circle cx="50" cy="65" r="8" fill={baseColor} />
      </>
    ),
    death: (
      <>
        <circle cx="50" cy="30" r="15" fill={baseColor} />
        <circle cx="45" cy="28" r="2" fill="white" />
        <circle cx="55" cy="28" r="2" fill="white" />
        <path d="M40 45 L60 45 M45 45 L45 70 M55 45 L55 70" stroke={baseColor} strokeWidth="3" />
        <path d="M35 75 L45 90 M65 75 L55 90" stroke={baseColor} strokeWidth="4" />
      </>
    ),
    temperance: (
      <>
        <path d="M30 50 L45 70 L30 90" stroke={baseColor} strokeWidth="3" fill="none" />
        <path d="M70 50 L55 70 L70 90" stroke={baseColor} strokeWidth="3" fill="none" />
        <path d="M45 35 L55 35 L55 65 L45 65 Z" fill={baseColor} />
        <path d="M40 30 L60 30" stroke={baseColor} strokeWidth="3" />
        <path d="M40 70 L60 70" stroke={baseColor} strokeWidth="3" />
      </>
    ),
    devil: (
      <>
        <path d="M40 25 L50 20 L60 25 L55 45 L45 45 Z" fill={baseColor} />
        <circle cx="45" cy="32" r="2" fill="white" />
        <circle cx="55" cy="32" r="2" fill="white" />
        <path d="M37 20 L45 30 M63 20 L55 30" stroke={baseColor} strokeWidth="2" />
        <line x1="40" y1="50" x2="40" y2="85" stroke={baseColor} strokeWidth="3" />
        <line x1="60" y1="50" x2="60" y2="85" stroke={baseColor} strokeWidth="3" />
        <path d="M35 85 L45 85 M55 85 L65 85" stroke="#EF4444" strokeWidth="3" />
      </>
    ),
    tower: (
      <>
        <rect x="38" y="25" width="24" height="60" fill={baseColor} />
        <path d="M35 25 L50 15 L65 25" stroke={baseColor} strokeWidth="3" fill="none" />
        <line x1="35" y1="45" x2="65" y2="45" stroke="white" strokeWidth="2" />
        <path d="M40 85 L30 85 M60 85 L70 85" stroke={baseColor} strokeWidth="3" />
        <path d="M50 25 L50 35 M45 30 L55 30" stroke="#FDE68A" strokeWidth="2" />
      </>
    ),
    star: (
      <>
        <polygon points="50,15 54,35 75,35 58,48 65,70 50,55 35,70 42,48 25,35 46,35" fill={baseColor} />
        <circle cx="30" cy="25" r="2" fill="#FDE68A" />
        <circle cx="70" cy="25" r="2" fill="#FDE68A" />
        <circle cx="25" cy="50" r="2" fill="#FDE68A" />
        <circle cx="75" cy="60" r="2" fill="#FDE68A" />
        <circle cx="50" cy="75" r="2" fill="#FDE68A" />
      </>
    ),
    moon: (
      <>
        <path d="M60 10 Q50 25 60 40 Q45 25 60 10" fill={baseColor} />
        <path d="M33 30 L33 55 M27 43 L39 43" stroke={baseColor} strokeWidth="2" />
        <path d="M67 30 L67 55 M61 43 L73 43" stroke={baseColor} strokeWidth="2" />
        <path d="M20 85 Q30 70 20 55" fill={baseColor} />
        <path d="M80 85 Q70 70 80 55" fill={baseColor} />
      </>
    ),
    sun: (
      <>
        <circle cx="50" cy="50" r="20" fill="#FDE68A" />
        <circle cx="50" cy="50" r="15" fill={baseColor} />
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * 2 * Math.PI;
          const x1 = 50 + 25 * Math.cos(angle);
          const y1 = 50 + 25 * Math.sin(angle);
          const x2 = 50 + 35 * Math.cos(angle);
          const y2 = 50 + 35 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={baseColor} strokeWidth="2" />;
        })}
      </>
    ),
    judgement: (
      <>
        <path d="M30 15 L50 30 L70 15 L70 45 L30 45 Z" fill={baseColor} />
        <circle cx="40" cy="35" r="8" fill="white" />
        <circle cx="60" cy="35" r="8" fill="white" />
        <circle cx="50" cy="55" r="8" fill="white" />
        <path d="M40 50 L40 85 M60 50 L60 85 M50 65 L50 85" stroke={baseColor} strokeWidth="2" />
      </>
    ),
    world: (
      <>
        <ellipse cx="50" cy="50" rx="30" ry="35" fill="none" stroke={baseColor} strokeWidth="3" />
        <path d="M35 30 Q50 45 65 30" stroke={baseColor} strokeWidth="2" fill="none" />
        <path d="M35 70 Q50 55 65 70" stroke={baseColor} strokeWidth="2" fill="none" />
        <ellipse cx="50" cy="50" rx="15" ry="18" fill={baseColor} opacity="0.3" />
      </>
    ),
    // Minor arcana suits
    wands_ace: <polygon points="50,15 55,40 80,40 60,55 70,85 50,65 30,85 40,55 20,40 45,40" fill={baseColor} />,
    wands_knight: <>
      <polygon points="50,20 55,35 75,45 55,45 50,70 45,45 25,45 45,35" fill={baseColor} />
      <circle cx="50" cy="55" r="4" fill="white" />
    </>,
    wands_king: <><rect x="35" y="25" width="30" height="35" fill={baseColor} /><circle cx="50" cy="35" r="5" fill="white" /><polygon points="50,60 55,85 45,85" fill={baseColor} /></>,
    cups_ace: <path d="M35 35 Q50 55 65 35 L55 20 L45 20 Z M38 55 L38 85 M62 55 L62 85 M50 20 L50 15" fill={baseColor} />,
    cups_knight: <path d="M40 25 Q50 50 60 25 L55 50 Q50 60 45 50 Z M45 60 L45 85 M55 60 L55 85" fill={baseColor} />,
    swords_ace: <><line x1="50" y1="15" x2="50" y2="70" stroke={baseColor} strokeWidth="4" /><path d="M40 15 L50 30 L60 15" stroke={baseColor} strokeWidth="2" fill="none" /><path d="M40 70 L50 55 L60 70" stroke={baseColor} strokeWidth="2" fill="none" /></>,
    swords_knight: <><path d="M50 10 L55 50 Q50 55 45 50 Z" fill={baseColor} /><circle cx="50" cy="68" r="6" fill={baseColor} /><line x1="40" y1="80" x2="60" y2="80" stroke={baseColor} strokeWidth="3" /></>,
    pentacles_ace: <><circle cx="50" cy="45" r="20" fill={baseColor} /><circle cx="50" cy="45" r="14" fill="white" /><polygon points="50,30 55,45 70,45 58,55 63,70 50,60 37,70 42,55 30,45 45,45" fill={baseColor} /></>,
    pentacles_knight: <><circle cx="50" cy="35" r="15" fill={baseColor} /><polygon points="50,22 54,35 65,35 55,43 59,55 50,47 41,55 45,43 35,35 46,35" fill="white" /><line x1="35" y1="55" x2="35" y2="80" stroke={baseColor} strokeWidth="3" /><line x1="65" y1="55" x2="65" y2="80" stroke={baseColor} strokeWidth="3" /></>,
  };

  const getSymbol = () => {
    if (card.svgSymbol && symbolMap[card.svgSymbol]) {
      return symbolMap[card.svgSymbol];
    }

    if (card.suit === 'wands') {
      if (card.number && card.number <= 10) {
        return (
          <>
            {Array.from({ length: card.number }).map((_, i) => (
              <line
                key={i}
                x1={20 + (i % 5) * 15}
                y1={30 + Math.floor(i / 5) * 25}
                x2={20 + (i % 5) * 15}
                y2={55 + Math.floor(i / 5) * 25}
                stroke={baseColor}
                strokeWidth="3"
              />
            ))}
          </>
        );
      }
      return symbolMap.wands_king;
    }

    if (card.suit === 'cups') {
      if (card.number && card.number <= 10) {
        return (
          <>
            {Array.from({ length: card.number }).map((_, i) => (
              <path
                key={i}
                d={`M${18 + (i % 5) * 16},${35 + Math.floor(i / 5) * 20} Q${25 + (i % 5) * 16},${25 + Math.floor(i / 5) * 20} ${32 + (i % 5) * 16},${35 + Math.floor(i / 5) * 20} L${30 + (i % 5) * 16},${50 + Math.floor(i / 5) * 20} L${20 + (i % 5) * 16},${50 + Math.floor(i / 5) * 20} Z`}
                fill={baseColor}
              />
            ))}
          </>
        );
      }
      return symbolMap.cups_knight;
    }

    if (card.suit === 'swords') {
      if (card.number && card.number <= 10) {
        return (
          <>
            {Array.from({ length: card.number }).map((_, i) => (
              <line
                key={i}
                x1={15 + (i % 5) * 14}
                y1={25 + Math.floor(i / 5) * 28}
                x2={25 + (i % 5) * 14}
                y2={65 + Math.floor(i / 5) * 28}
                stroke={baseColor}
                strokeWidth="2"
              />
            ))}
          </>
        );
      }
      return symbolMap.swords_knight;
    }

    if (card.suit === 'pentacles') {
      return (
        <>
          {Array.from({ length: card.number ?? 1 }).map((_, i) => (
            <circle
              key={i}
              cx={22 + (i % 4) * 18}
              cy={30 + Math.floor(i / 4) * 28}
              r={8}
              fill={baseColor}
            />
          ))}
        </>
      );
    }

    return <circle cx="50" cy="50" r="25" fill={baseColor} />;
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      style={{ transform: isReversed ? 'rotate(180deg)' : 'none' }}
    >
      {/* Card border/background */}
      <rect x="5" y="5" width="90" height="90" rx="4" fill="white" stroke={baseColor} strokeWidth="2" />
      {/* Inner frame */}
      <rect x="12" y="12" width="76" height="76" rx="2" fill="none" stroke={baseColor} strokeWidth="1" opacity="0.3" />
      {/* Symbol */}
      {getSymbol()}
      {/* Card number/name at bottom */}
      {card.arcana === 'major' && (
        <text x="50" y="96" textAnchor="middle" fontSize="6" fill="#666">
          {card.name.replace('The ', '')}
        </text>
      )}
    </svg>
  );
}

export default function TarotCardOfDay({ primaryColor }: Props) {
  const card = getTarotCardForToday();
  const [showReversed, setShowReversed] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShare = async () => {
    const text = getShareText(card);
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Today\'s Tarot', text });
        return;
      } catch {}
    }
    setShowShareModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
    >
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Sparkles size={18} style={{ color: primaryColor }} />
        <h2 className="font-semibold text-gray-900 text-sm">Tarot Card of the Day</h2>
      </div>

      <div className="p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Card Image */}
          <div className="sm:w-48 sm:h-72 w-40 h-60 mx-auto sm:mx-0 shrink-0">
            <TarotSVG card={card} isReversed={showReversed} />
          </div>

          {/* Card Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{card.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {card.arcana === 'major' ? 'Major Arcana' : `${card.suit?.charAt(0).toUpperCase()}${card.suit?.slice(1)} Suit`}
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                #{card.id + 1}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {card.keywords.map((kw) => (
                <span key={kw} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg">{kw}</span>
              ))}
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Upright Meaning</p>
                <p className="text-sm text-gray-700">{card.upright}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Reversed Meaning</p>
                <p className="text-sm text-gray-700">{card.reversed}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowReversed(!showReversed)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-colors"
              >
                <RotateCcw size={14} />
                {showReversed ? 'Show Upright' : 'Show Reversed'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                <Share2 size={14} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900">Share Your Card</h4>
              <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-sm text-gray-700">{getShareText(card)}</p>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(getShareText(card)); setShowShareModal(false); }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
