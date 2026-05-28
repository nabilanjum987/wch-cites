'use client';

import { useEffect, useState } from 'react';
import type { City } from '@/types/city';

interface TickerData {
  goldPrice: string;
  btcPrice: string;
  temperature: string;
  nextPrayer: string;
  headline: string;
}

async function fetchBTCPrice(): Promise<string> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    );
    const data = await response.json();
    return Math.round(data.bitcoin.usd).toString();
  } catch {
    return 'N/A';
  }
}

export function TickerBar({ city }: { city: City }) {
  const [data, setData] = useState<TickerData>({
    goldPrice: 'Loading...',
    btcPrice: 'Loading...',
    temperature: 'N/A',
    nextPrayer: 'Fajr',
    headline: 'WorldCityHub - Global City Information Platform',
  });

  useEffect(() => {
    async function fetchData() {
      const btc = await fetchBTCPrice();
      setData((prev) => ({
        ...prev,
        btcPrice: btc,
      }));
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const tickerContent = `Gold PKR ${data.goldPrice}/g  |  BTC $${data.btcPrice}  |  ${city.name} ${data.temperature}°C  |  Next Prayer ${data.nextPrayer}  |  ${data.headline}`;

  return (
    <div
      className="w-full overflow-hidden py-2 px-4"
      style={{ backgroundColor: city.primary_color }}
    >
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .ticker-animate {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      <div className="ticker-animate whitespace-nowrap text-white font-bold text-sm">
        {tickerContent}  |  {tickerContent}  |  {tickerContent}
      </div>
    </div>
  );
}
