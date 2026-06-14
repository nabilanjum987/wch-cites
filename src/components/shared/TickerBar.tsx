'use client'
export default function TickerBar() {
  const items = [
    '🔴 LIVE', '🥇 Gold $2,351/oz ▲', '│', '₿ BTC $67,420 ▲', '│',
    '🛢️ Oil $82.30', '│', '💵 USD/PKR 278.50', '│',
    '🇵🇰 Lahore 34°C ☀️', '│', '🇦🇪 Dubai 38°C ☀️', '│',
    '🇸🇦 Mecca 38°C ☀️', '│', '🇬🇧 London 18°C ⛅', '│',
    '🕌 Lahore Maghrib in 2h 38m', '│', '🕌 Mecca Maghrib in 2h 15m', '│',
    '📈 Fear & Greed: 62 Greed', '│',
  ]
  return (
    <div className="w-full bg-[#0a0f1e] border-b border-[#6366f1]/20 overflow-hidden h-7 flex items-center">
      <div style={{ display:'flex', width:'max-content', animation:'tickerScroll 50s linear infinite' }}>
        {[...items,...items].map((item, i) => (
          <span key={i} className={`text-xs px-3 whitespace-nowrap ${item.includes('LIVE') ? 'text-red-400 font-bold' : item === '│' ? 'text-white/20' : item.includes('▲') ? 'text-emerald-400' : item.includes('Maghrib') ? 'text-indigo-400' : 'text-slate-300'}`}>
            {item}
          </span>
        ))}
      </div>
      <style jsx>{`@keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  )
}
