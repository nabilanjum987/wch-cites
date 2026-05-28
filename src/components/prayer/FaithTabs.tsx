import { motion } from 'framer-motion';

export type FaithKey = 'islam' | 'christian' | 'hindu' | 'jewish' | 'sikh' | 'none';

interface FaithTabsProps {
  activeKey: FaithKey;
  onChange: (key: FaithKey) => void;
}

const FAITHS: { key: FaithKey; label: string; icon: string; color: string }[] = [
  { key: 'islam', label: 'Islam', icon: '☪', color: 'bg-emerald-500' },
  { key: 'christian', label: 'Christian', icon: '✝', color: 'bg-sky-500' },
  { key: 'hindu', label: 'Hindu', icon: '🕉', color: 'bg-orange-500' },
  { key: 'jewish', label: 'Jewish', icon: '✡', color: 'bg-blue-500' },
  { key: 'sikh', label: 'Sikh', icon: '☬', color: 'bg-amber-500' },
  { key: 'none', label: 'None', icon: '🧘', color: 'bg-teal-500' },
];

export default function FaithTabs({ activeKey, onChange }: FaithTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {FAITHS.map((faith) => (
        <button
          key={faith.key}
          onClick={() => onChange(faith.key)}
          className="relative px-4 py-2 rounded-lg font-semibold text-sm transition-all"
        >
          {activeKey === faith.key && (
            <motion.div
              layoutId="faith-tab"
              className={`absolute inset-0 ${faith.color} rounded-lg`}
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2 text-white">
            <span>{faith.icon}</span>
            <span>{faith.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
