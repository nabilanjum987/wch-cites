import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/shared/Navbar'
import TickerBar from '@/components/shared/TickerBar'

export const metadata: Metadata = {
  title: 'WorldCityHub - Every City, Live',
  description: 'Live weather, prayer times, gold rates for every city',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        {/* Fixed top bar: ticker + navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <TickerBar />
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
