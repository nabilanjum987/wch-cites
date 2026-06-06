import { motion } from 'framer-motion';

export type FaithKey = 'islam' | 'christian' | 'hindu' | 'jewish' | 'buddhist' | 'sikh' | 'none';

export const FAITHS: { key: FaithKey; label: string; emoji: string }[] = [
  { key: 'islam', label: 'Islam', emoji: '☪️' },
  { key: 'christian', label: 'Christian', emoji: '✝️' },
  { key: 'hindu', label: 'Hindu', emoji: '🕉️' },
  { key: 'jewish', label: 'Jewish', emoji: '✡️' },
  { key: 'buddhist', label: 'Buddhist', emoji: '☸️' },
  { key: 'sikh', label: 'Sikh', emoji: '🙏' },
  { key: 'none', label: 'None', emoji: '🧘' },
];

interface Props {
  active: FaithKey;
  onChange: (key: FaithKey) => void;
}

export default function FaithTabs({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {FAITHS.map((f) => (
        <motion.button
          key={f.key}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(f.key)}
          className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
            active === f.key
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200'
              : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-700'
          }`}
        >
          <span className="text-base leading-none">{f.emoji}</span>
          <span>{f.label}</span>
          {active === f.key && (
            <motion.span
              layoutId="faith-pill"
              className="absolute inset-0 rounded-full bg-emerald-600 -z-10"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
