import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import Navbar from '@/components/shared/Navbar'
import TickerBarSlot from '@/components/shared/TickerBarSlot'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // P8 rework (billi FAIL fix) — this layout is deliberately STATIC:
  // no request-header read, no ticker fetch, not async. The ticker
  // fetch lives in TickerBarSlot, a Suspense-wrapped child below, so
  // the ticker does not opt the layout shell into request-time
  // rendering. (The slot still reads the page city from the proxy
  // header and falls back to Lahore for the homepage / non-city
  // pages.)
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
          <Suspense fallback={null}>
            <TickerBarSlot />
          </Suspense>
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
