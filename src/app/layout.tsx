import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/shared/Navbar'
import TickerBar from '@/components/shared/TickerBar'
import { getMarketTickerItems } from '@/lib/tickers'

export const metadata: Metadata = {
  metadataBase: new URL('https://worldcityhub.vercel.app'),
  title: 'WorldCityHub - Every City, Live',
  description: 'Live weather, prayer times, gold rates for every city',
  verification: {
    // Code shown by Google in THIS property's Verify-ownership dialog
    // (2026-10-07). Note: it differs from the Cleared/CalcuFintor code —
    // Google issued a separate code for this property.
    google: '5pPSofE81SlcAaE1vQ_ZmI4-SL3__BMpzd0hQjkuPYE',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tickerItems = await getMarketTickerItems().catch(() => []);
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Theme init (Polish Card 5): set data-theme from localStorage
            BEFORE first paint so there is no flash of the wrong theme.
            Default (no stored choice) is dark — the :root token set —
            and the server HTML carries no attribute. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('wch-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}}catch(e){}`,
          }}
        />
      </head>
      <body>
        {/* Fixed top bar: ticker + navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <TickerBar items={tickerItems} />
          <Navbar />
        </div>
        {/* Spacer: ticker ~28px + navbar 64px */}
        <div style={{ paddingTop: '92px' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
