'use client';
import Link from 'next/link';

const CONFLICTS = [
  { region: 'Middle East',       conflicts: 4,  displaced: '8.2M', severity: 'High',   color: '#ef4444', slug: 'red-sea-crisis'     },
  { region: 'Sub-Saharan Africa',conflicts: 12, displaced: '32M',  severity: 'High',   color: '#f97316', slug: 'sudan-conflict'     },
  { region: 'Eastern Europe',    conflicts: 2,  displaced: '6.5M', severity: 'High',   color: '#ef4444', slug: 'russia-ukraine'     },
  { region: 'South Asia',        conflicts: 3,  displaced: '4.1M', severity: 'Medium', color: '#f59e0b', slug: 'myanmar-conflict'   },
  { region: 'Southeast Asia',    conflicts: 4,  displaced: '1.8M', severity: 'Medium', color: '#f59e0b', slug: 'myanmar-conflict'   },
  { region: 'Latin America',     conflicts: 7,  displaced: '7.4M', severity: 'Medium', color: '#f59e0b', slug: 'colombia-conflict'  },
];

export default function ActiveConflictsWidget() {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {CONFLICTS.map((r) => (
          <Link key={r.region} href={`/conflicts/${r.slug}`} className="no-underline group">
            <div className="rounded-xl border p-4 transition-all group-hover:scale-[1.01]"
              style={{ backgroundColor: `${r.color}08`, borderColor: `${r.color}30` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80 font-medium text-sm">{r.region}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: `${r.color}20`, color: r.color }}>{r.severity}</span>
              </div>
              <div className="flex gap-4">
                <div>
                  <div className="text-2xl font-bold" style={{ color: r.color }}>{r.conflicts}</div>
                  <div className="text-white/30 text-xs">conflicts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white/70">{r.displaced}</div>
                  <div className="text-white/30 text-xs">displaced</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <p className="text-white/25 text-xs">Sources: UN, ACLED. Factual data only. No political positions taken.</p>
    </div>
  );
}
