'use client'

export default function TickerBar() {
  return (
    <div className="w-full bg-[#0f172a] border-b border-[#6366f1]/20 overflow-hidden h-8 z-50 fixed top-0 left-0">
      <div style={{
        display: 'flex',
        width: 'max-content',
        animation: 'ticker 40s linear infinite',
      }}>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-6 h-8 text-xs text-slate-300 whitespace-nowrap">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
              <span className="text-red-400 font-bold">LIVE</span>
            </span>
            <span>🥇 Gold <span className="text-emerald-400">$2,351/oz ▲</span></span>
            <span className="text-white/20">│</span>
            <span>₿ BTC <span className="text-emerald-400">$67,420 ▲</span></span>
            <span className="text-white/20">│</span>
            <span>🛢️ Oil WTI <span className="text-amber-400">$82.30</span></span>
            <span className="text-white/20">│</span>
            <span>💵 USD/PKR <span className="text-cyan-400">278.50</span></span>
            <span className="text-white/20">│</span>
            <span>🇵🇰 Lahore <span className="text-white">34°C ☀️</span></span>
            <span className="text-white/20">│</span>
            <span>🇦🇪 Dubai <span className="text-white">38°C ☀️</span></span>
            <span className="text-white/20">│</span>
            <span>🇬🇧 London <span className="text-white">18°C ⛅</span></span>
            <span className="text-white/20">│</span>
            <span>🕌 Mecca Maghrib in <span className="text-[#6366f1]">2h 15m</span></span>
            <span className="text-white/20">│</span>
            <span>🇸🇦 Mecca <span className="text-white">38°C ☀️</span></span>
            <span className="text-white/20">│</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
