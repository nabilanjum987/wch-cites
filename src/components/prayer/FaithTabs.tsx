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
  accent?: string;
}

export default function FaithTabs({ active, onChange, accent = '#10b981' }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {FAITHS.map((f) => {
        const isActive = active === f.key;
        return (
          <motion.button
            key={f.key}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(f.key)}
            className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border"
            style={
              isActive
                ? { backgroundColor: accent, color: '#fff', borderColor: accent, boxShadow: `0 0 16px ${accent}55` }
                : { backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.1)' }
            }
          >
            <span className="text-base leading-none">{f.emoji}</span>
            <span>{f.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
