'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Flag symbol definitions per country ─────────────────────────────────────

interface FlagSymbol {
  type: 'svg' | 'emoji' | 'text';
  content: string;       // SVG path, emoji, or unicode text
  label: string;         // accessibility label
}

interface FlagSymbolConfig {
  symbols: FlagSymbol[];
  primaryColor: string;
  secondaryColor: string;
  opacity: number;       // base opacity of the symbols
}

const FLAG_SYMBOLS: Record<string, FlagSymbolConfig> = {
  pakistan: {
    primaryColor: '#0C7A3D',
    secondaryColor: '#FFFFFF',
    opacity: 0.12,
    symbols: [
      {
        type: 'svg',
        label: 'Crescent moon of Pakistan',
        content: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M120 40C85 40 57 68 57 103C57 138 85 166 120 166C135 166 149 161 160 152C145 155 129 152 116 143C94 129 82 104 87 79C92 55 109 36 131 31C127 30 124 30 120 30Z" fill="SYMBOLCOLOR" opacity="1"/>
          <path d="M145 65L148 75L158 72L151 79L157 88L147 84L144 94L141 84L131 87L137 79L130 72L141 75Z" fill="SYMBOLCOLOR"/>
        </svg>`,
      },
    ],
  },

  'saudi-arabia': {
    primaryColor: '#006C35',
    secondaryColor: '#FFFFFF',
    opacity: 0.10,
    symbols: [
      {
        type: 'svg',
        label: 'Shahada sword of Saudi Arabia',
        content: `<svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 100 L240 90 L260 85 L240 80 L20 90 Z" fill="SYMBOLCOLOR"/>
          <path d="M240 80 L270 87 L240 94 Z" fill="SYMBOLCOLOR"/>
          <path d="M20 90 L30 85 L30 95 Z" fill="SYMBOLCOLOR"/>
        </svg>`,
      },
    ],
  },

  turkey: {
    primaryColor: '#E30A17',
    secondaryColor: '#FFFFFF',
    opacity: 0.10,
    symbols: [
      {
        type: 'svg',
        label: 'Crescent and star of Turkey',
        content: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M95 40C65 40 41 64 41 94C41 124 65 148 95 148C110 148 123 142 133 133C121 136 108 134 97 127C78 115 69 93 74 72C79 52 94 37 113 33C107 31 101 30 95 30Z" fill="SYMBOLCOLOR"/>
          <path d="M125 60L128 70L138 67L131 74L137 83L127 79L124 89L121 79L111 82L117 74L110 67L121 70Z" fill="SYMBOLCOLOR"/>
        </svg>`,
      },
    ],
  },

  malaysia: {
    primaryColor: '#CC0001',
    secondaryColor: '#FFCC00',
    opacity: 0.10,
    symbols: [
      {
        type: 'svg',
        label: 'Crescent and star of Malaysia',
        content: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90 45C63 45 41 67 41 94C41 121 63 143 90 143C104 143 116 137 125 128C114 131 102 128 93 121C76 110 68 90 72 71C77 53 90 39 107 35C102 33 96 32 90 32Z" fill="SYMBOLCOLOR"/>
          <path d="M118 62L121 71L130 68L124 75L129 83L120 79L117 88L114 79L105 82L110 75L104 68L114 71Z" fill="SYMBOLCOLOR"/>
        </svg>`,
      },
    ],
  },

  india: {
    primaryColor: '#000080',
    secondaryColor: '#FF9933',
    opacity: 0.10,
    symbols: [
      {
        type: 'svg',
        label: 'Ashoka Chakra of India',
        content: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="55" stroke="SYMBOLCOLOR" stroke-width="4" fill="none"/>
          <circle cx="100" cy="100" r="8" fill="SYMBOLCOLOR"/>
          ${Array.from({length: 24}, (_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = 100 + 12 * Math.cos(angle);
            const y1 = 100 + 12 * Math.sin(angle);
            const x2 = 100 + 50 * Math.cos(angle);
            const y2 = 100 + 50 * Math.sin(angle);
            return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="SYMBOLCOLOR" stroke-width="2"/>`;
          }).join('')}
        </svg>`,
      },
    ],
  },

  china: {
    primaryColor: '#FFDE00',
    secondaryColor: '#DE2910',
    opacity: 0.12,
    symbols: [
      {
        type: 'svg',
        label: 'Stars of China',
        content: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="100,30 112,70 155,70 121,95 133,135 100,110 67,135 79,95 45,70 88,70" fill="SYMBOLCOLOR"/>
          <polygon points="155,45 160,58 174,58 163,67 167,80 155,72 143,80 147,67 136,58 150,58" fill="SYMBOLCOLOR" opacity="0.7"/>
        </svg>`,
      },
    ],
  },

  japan: {
    primaryColor: '#BC002D',
    secondaryColor: '#FFFFFF',
    opacity: 0.10,
    symbols: [
      {
        type: 'svg',
        label: 'Rising sun of Japan',
        content: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="60" fill="SYMBOLCOLOR"/>
        </svg>`,
      },
    ],
  },

  'united-states': {
    primaryColor: '#0A3161',
    secondaryColor: '#B31942',
    opacity: 0.09,
    symbols: [
      {
        type: 'svg',
        label: 'Star of the United States',
        content: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="100,20 115,65 163,65 125,92 140,137 100,110 60,137 75,92 37,65 85,65" fill="SYMBOLCOLOR"/>
        </svg>`,
      },
    ],
  },

  'united-kingdom': {
    primaryColor: '#012169',
    secondaryColor: '#C8102E',
    opacity: 0.09,
    symbols: [
      {
        type: 'svg',
        label: 'Union Jack cross',
        content: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="88" y="20" width="24" height="160" fill="SYMBOLCOLOR"/>
          <rect x="20" y="88" width="160" height="24" fill="SYMBOLCOLOR"/>
          <line x1="30" y1="30" x2="85" y2="88" stroke="SYMBOLCOLOR" stroke-width="12"/>
          <line x1="115" y1="112" x2="170" y2="170" stroke="SYMBOLCOLOR" stroke-width="12"/>
          <line x1="170" y1="30" x2="115" y2="88" stroke="SYMBOLCOLOR" stroke-width="12"/>
          <line x1="85" y1="112" x2="30" y2="170" stroke="SYMBOLCOLOR" stroke-width="12"/>
        </svg>`,
      },
    ],
  },

  'united-arab-emirates': {
    primaryColor: '#00732F',
    secondaryColor: '#FF0000',
    opacity: 0.05,
    symbols: [
      {
        type: 'svg',
        label: 'Falcon of UAE',
        content: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 20C85 35 70 55 75 80C80 105 95 115 100 140C105 115 120 105 125 80C130 55 115 35 100 20Z" fill="SYMBOLCOLOR"/>
          <path d="M75 80C55 70 40 80 35 100C55 105 75 95 75 80Z" fill="SYMBOLCOLOR"/>
          <path d="M125 80C145 70 160 80 165 100C145 105 125 95 125 80Z" fill="SYMBOLCOLOR"/>
          <ellipse cx="100" cy="155" rx="15" ry="25" fill="SYMBOLCOLOR"/>
        </svg>`,
      },
    ],
  },

  egypt: {
    primaryColor: '#C09300',
    secondaryColor: '#CE1126',
    opacity: 0.05,
    symbols: [
      {
        type: 'svg',
        label: 'Eagle of Saladin',
        content: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 40L115 70L148 75L124 98L130 132L100 115L70 132L76 98L52 75L85 70Z" fill="SYMBOLCOLOR"/>
          <rect x="85" y="130" width="30" height="8" rx="2" fill="SYMBOLCOLOR"/>
          <rect x="90" y="138" width="8" height="20" fill="SYMBOLCOLOR"/>
          <rect x="102" y="138" width="8" height="20" fill="SYMBOLCOLOR"/>
        </svg>`,
      },
    ],
  },

  // Default — generic globe for any unlisted country
  _default: {
    primaryColor: '#6366f1',
    secondaryColor: '#06b6d4',
    opacity: 0.08,
    symbols: [
      {
        type: 'svg',
        label: 'Globe',
        content: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="70" stroke="SYMBOLCOLOR" stroke-width="3" fill="none"/>
          <ellipse cx="100" cy="100" rx="35" ry="70" stroke="SYMBOLCOLOR" stroke-width="2" fill="none"/>
          <line x1="30" y1="100" x2="170" y2="100" stroke="SYMBOLCOLOR" stroke-width="2"/>
          <line x1="100" y1="30" x2="100" y2="170" stroke="SYMBOLCOLOR" stroke-width="2"/>
        </svg>`,
      },
    ],
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function getSymbolConfig(countrySlug: string): FlagSymbolConfig {
  return FLAG_SYMBOLS[countrySlug?.toLowerCase()] ?? FLAG_SYMBOLS._default;
}

function buildSVG(svgContent: string, color: string): string {
  return svgContent.replace(/SYMBOLCOLOR/g, color);
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface FlagSymbolBackgroundProps {
  countrySlug: string;
  /** Number of floating symbols — default 3 */
  count?: number;
}

interface FloatingSymbol {
  id: number;
  x: number;       // % from left
  y: number;       // % from top
  size: number;    // px
  parallaxX: number; // how much this symbol moves with cursor (multiplier)
  parallaxY: number;
  scrollSpeed: number; // how much this symbol moves with scroll
  rotation: number;  // base rotation degrees
  color: string;
}

export default function FlagSymbolBackground({
  countrySlug,
  count = 3,
}: FlagSymbolBackgroundProps) {
  const config = getSymbolConfig(countrySlug);
  const symbol = config.symbols[0];

  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef<number>(0);

  // Generate stable symbol positions on mount
  const symbols = useRef<FloatingSymbol[]>([]);
  if (symbols.current.length === 0) {
    const colors = [config.primaryColor, config.secondaryColor, config.primaryColor];
    symbols.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: [12, 70, 52][i] ?? 20 + i * 25,
      y: [15, 55, 80][i] ?? 20 + i * 30,
      size: [420, 300, 220][i] ?? 250,
      parallaxX: [0.025, -0.015, 0.01][i] ?? 0.02,
      parallaxY: [0.02, -0.012, 0.015][i] ?? 0.015,
      scrollSpeed: [0.15, 0.08, 0.12][i] ?? 0.1,
      rotation: [0, 15, -10][i] ?? 0,
      color: colors[i % colors.length],
    }));
  }

  // Smooth cursor tracking
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    targetMouse.current = {
      x: (e.clientX / vw - 0.5) * vw,
      y: (e.clientY / vh - 0.5) * vh,
    };
  }, []);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    let running = true;

    const animate = () => {
      if (!running) return;
      // Lerp mouse position for smooth follow
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.08;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.08;
      setMousePos({ x: currentMouse.current.x, y: currentMouse.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleMouseMove, handleScroll]);

  if (symbol.type !== 'svg') return null;

  const svgWithColor = (color: string) => buildSVG(symbol.content, color);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {symbols.current.map((sym) => {
        const tx = mousePos.x * sym.parallaxX;
        const ty = mousePos.y * sym.parallaxY - scrollY * sym.scrollSpeed;

        return (
          <div
            key={sym.id}
            style={{
              position: 'absolute',
              left: `${sym.x}%`,
              top: `${sym.y}%`,
              width: sym.size,
              height: sym.size,
              opacity: config.opacity,
              transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${sym.rotation}deg)`,
              transition: 'opacity 0.3s ease',
              willChange: 'transform',
              filter: `drop-shadow(0 0 ${sym.size * 0.25}px ${sym.color}80)`,
            }}
            dangerouslySetInnerHTML={{
              __html: svgWithColor(sym.color),
            }}
          />
        );
      })}
    </div>
  );
}
