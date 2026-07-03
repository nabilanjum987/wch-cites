'use client';

const EXTREMES = [
  { city: 'Jacobabad, Pakistan', type: 'Hottest',  value: '52°C',        emoji: '🔥', color: '#ef4444' },
  { city: 'Oymyakon, Russia',    type: 'Coldest',  value: '-67°C',       emoji: '🥶', color: '#3b82f6' },
  { city: 'Mawsynram, India',    type: 'Rainiest', value: '11,871mm/yr', emoji: '🌧️', color: '#06b6d4' },
  { city: 'Atacama, Chile',      type: 'Driest',   value: '0.1mm/yr',   emoji: '🏜️', color: '#f59e0b' },
  { city: 'Wellington, NZ',      type: 'Windiest', value: '29km/h avg',  emoji: '💨', color: '#8b5cf6' },
  { city: 'Aomori, Japan',       type: 'Snowiest', value: '792cm/yr',    emoji: '❄️', color: '#67e8f9' },
];

export default function WorldWeatherExtremes() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {EXTREMES.map((e) => (
        <div key={e.type} className="rounded-xl border p-4"
          style={{ background: `${e.color}10`, borderColor: `${e.color}30` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{e.emoji}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${e.color}20`, color: e.color }}>{e.type}</span>
          </div>
          <div className="text-white font-bold text-lg">{e.value}</div>
          <div className="text-white/40 text-xs mt-0.5">{e.city}</div>
        </div>
      ))}
    </div>
  );
}
