'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import TickerBar from '@/components/shared/TickerBar'
import type { MarketItem } from '@/lib/tickers'

// Fix batch (4 Nov 2026): this slot used to be an async server
// component reading the x-wch-pathname request header. A headers()
// read anywhere in the root layout tree opted EVERY route into
// dynamic rendering (Cache-Control: private, no-store), which blocked
// ISR for the whole site — the city route's revalidate = 300 could
// never engage. The slot now derives the page city from the client
// pathname (the same 3rd-segment rule as before) and fetches the
// items from /api/ticker, where the original server logic runs
// unchanged: same items, same Lahore fallback, same prayer gate.
// Until the fetch lands the slot renders nothing — the same null the
// old Suspense fallback rendered while the server fetch streamed in.
// TickerBar itself is untouched, so the ticker's content, appearance
// and gating are identical; only the delivery path changed.
export default function TickerBarSlot() {
  const pathname = usePathname() ?? ''
  const segs = pathname.split('/').filter(Boolean)
  const pageCity = segs.length >= 3 ? segs[2] : undefined
  const [data, setData] = useState<{ items: MarketItem[]; gatePrayer: boolean } | null>(null)

  useEffect(() => {
    let live = true
    const url = pageCity ? `/api/ticker?city=${encodeURIComponent(pageCity)}` : '/api/ticker'
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (live) setData({ items: Array.isArray(d?.items) ? d.items : [], gatePrayer: !!d?.gatePrayer })
      })
      .catch(() => {
        if (live) setData({ items: [], gatePrayer: true })
      })
    return () => {
      live = false
    }
  }, [pageCity])

  if (!data) return null
  return <TickerBar items={data.items} gatePrayer={data.gatePrayer} />
}
