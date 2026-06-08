import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WorldCityHub - Every City, Live',
  description: 'Live weather, prayer times, gold rates for every city',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
