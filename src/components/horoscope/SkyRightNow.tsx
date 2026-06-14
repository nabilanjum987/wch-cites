import { motion } from 'framer-motion';
import { Moon, Sun, Eye, Calendar, Zap, Circle } from 'lucide-react';
import type { SkyRightNowData } from '../../types/horoscope';
import { ZODIAC_SIGNS, ELEMENT_COLORS } from '../../types/horoscope';

interface Props {
  data: SkyRightNowData;
  primaryColor: string;
}

function MoonPhaseVisual({ phase, primaryColor }: { phase: number; primaryColor: string }) {
  // SVG moon phase visualization
  const illumination = phase;

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Dark circle base */}
        <circle cx="50" cy="50" r="45" fill="#1E293B" />
        {/* Lit portion using clip */}
        <defs>
          <clipPath id="moonClip">
            <circle cx="50" cy="50" r="45" />
          </clipPath>
        </defs>
        <g clipPath="url(#moonClip)">
          {/* Full lit circle */}
          <circle cx="50" cy="50" r="45" fill="#FDE68A" />
          {/* Shadow overlay that creates the phase */}
          {illumination <= 0.5 ? (
            // Waxing: shadow on left, shrinking
            <ellipse
              cx={50 + (1 - illumination * 2) * 45}
              cy="50"
              rx={Math.abs(1 - illumination * 2) * 45}
              ry="45"
              fill="#1E293B"
            />
          ) : (
            // Waning: shadow on right, growing
            <ellipse
              cx={50 - ((illumination - 0.5) * 2 - 1) * 45}
              cy="50"
              rx={Math.abs((illumination - 0.5) * 2 - 1) * 45}
              ry="45"
              fill="#1E293B"
            />
          )}
        </g>
        {/* Outer ring */}
        <circle cx="50" cy="50" r="45" fill="none" stroke={primaryColor} strokeWidth="2" opacity="0.4" />
      </svg>
      {/* Glow animation */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 30px ${primaryColor}30` }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}

const EVENT_ICONS: Record<string, React.ReactNode> = {
  full_moon: <Moon size={14} className="text-yellow-500" />,
  eclipse: <Circle size={14} className="text-orange-500" />,
  planet: <Zap size={14} className="text-blue-500" />,
  meteor: <Sun size={14} className="text-amber-500" />,
};

export default function SkyRightNow({ data, primaryColor }: Props) {
  const moonSignData = ZODIAC_SIGNS.find(s => s.key === data.moon.moon_sign);
  const sunSignData = ZODIAC_SIGNS.find(s => s.key === data.sun_sign);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
    >
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Eye size={18} style={{ color: primaryColor }} />
        <h2 className="font-semibold text-gray-900 text-sm">Sky Right Now</h2>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Moon Phase */}
          <div className="text-center">
            <MoonPhaseVisual phase={data.moon.phase} primaryColor={primaryColor} />
            <div className="mt-3">
              <p className="text-lg font-bold text-gray-900">{data.moon.phase_name}</p>
              <p className="text-sm text-gray-500 mt-0.5">{data.moon.illumination}% illuminated</p>
              {moonSignData && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${ELEMENT_COLORS[moonSignData.element]}15`, color: ELEMENT_COLORS[moonSignData.element] }}
                >
                  <span className="text-base">{moonSignData.symbol}</span>
                  Moon in {moonSignData.name}
                </div>
              )}
            </div>
          </div>

          {/* Sun Sign */}
          <div className="flex flex-col items-center justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: `${primaryColor}12` }}
            >
              <Sun size={36} style={{ color: primaryColor }} />
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Sun in</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {sunSignData?.symbol} {sunSignData?.name}
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Calendar size={11} />
              Transitions {data.sun_sign_transition_date}
            </p>
            {sunSignData && (
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${ELEMENT_COLORS[sunSignData.element]}15`, color: ELEMENT_COLORS[sunSignData.element] }}
              >
                {sunSignData.element} sign
              </div>
            )}
          </div>

          {/* Tonight's Constellation */}
          <div className="flex flex-col items-center justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: `${primaryColor}10` }}
            >
              <svg viewBox="0 0 60 60" className="w-10 h-10" style={{ color: primaryColor }}>
                <circle cx="15" cy="15" r="2" fill="currentColor" opacity="0.8" />
                <circle cx="35" cy="10" r="2.5" fill="currentColor" opacity="0.9" />
                <circle cx="50" cy="25" r="2" fill="currentColor" opacity="0.7" />
                <circle cx="40" cy="45" r="2.5" fill="currentColor" opacity="0.85" />
                <circle cx="20" cy="50" r="2" fill="currentColor" opacity="0.75" />
                <circle cx="10" cy="35" r="1.5" fill="currentColor" opacity="0.6" />
                <line x1="15" y1="15" x2="35" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="35" y1="10" x2="50" y2="25" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="50" y1="25" x2="40" y2="45" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="40" y1="45" x2="20" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="20" y1="50" x2="10" y2="35" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="10" y1="35" x2="15" y2="15" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Tonight visible</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{data.visible_constellation}</p>
            <p className="text-xs text-gray-400 mt-1">Look up after sunset</p>
          </div>
        </div>

        {/* Upcoming Sky Events */}
        {data.upcoming_events.length > 0 && (
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Upcoming Sky Events</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {data.upcoming_events.map((ev, i) => {
                const d = new Date(ev.date + 'T00:00:00');
                const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3.5 py-2.5"
                  >
                    <span className="shrink-0">{EVENT_ICONS[ev.type] ?? <Zap size={14} className="text-gray-400" />}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{ev.name}</p>
                      <p className="text-xs text-gray-500">{dateStr}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
