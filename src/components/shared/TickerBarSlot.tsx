import { headers } from 'next/headers'
import TickerBar from '@/components/shared/TickerBar'
import { getMarketTickerItems } from '@/lib/tickers'

// P8 rework (billi FAIL fix) — the ticker fetch lives HERE, in a
// Suspense-wrapped child of the root layout, NOT in the root layout
// itself. The root layout (src/app/layout.tsx) must stay static: it
// calls no headers(), performs no fetch, and is not async, so nothing
// in the layout opts routes into dynamic rendering at the layout
// level. Only this slot reads the request (via the x-wch-pathname
// header set by src/proxy.ts) and fetches the ticker items; the
// layout renders it inside <Suspense>, so the static layout shell
// streams first and this slot streams in behind the boundary.
//
// Page-city rule (unchanged from the original P8 fix): city pages
// live at /<country>/<province>/<city>/..., so the city slug is the
// 3rd path segment. Anything else (homepage, country/province pages,
// hubs) yields no match and getMarketTickerItems falls back to
// Lahore, exactly as before.
export default async function TickerBarSlot() {
  const pathname = (await headers()).get('x-wch-pathname') ?? ''
  const segs = pathname.split('/').filter(Boolean)
  const pageCity = segs.length >= 3 ? segs[2] : undefined
  const tickerItems = await getMarketTickerItems(pageCity).catch(() => [])
  return <TickerBar items={tickerItems} />
}
