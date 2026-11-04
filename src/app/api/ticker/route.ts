import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getMarketTickerItems, PUBLISHED_CITIES } from '@/lib/tickers'

// Fix batch (4 Nov 2026): the market ticker's data endpoint. This is
// the exact logic the old server-side TickerBarSlot ran per request —
// same item builder, same Lahore fallback for an unknown/absent city,
// same prayer gate — moved behind a route handler so the root layout
// no longer reads request headers while rendering. Reading headers()
// in the layout tree opted EVERY route into dynamic rendering
// (private, no-store), which blocked ISR site-wide; the slot now
// derives the page city client-side (usePathname) and fetches here.
// MarketItem is plain JSON (strings + epoch numbers), so the items
// cross this boundary unchanged.
export async function GET(req: NextRequest) {
  const pageCity = req.nextUrl.searchParams.get('city') ?? undefined
  const items = await getMarketTickerItems(pageCity).catch(() => [])
  // Stage 2 gate input, computed exactly as the old slot computed it:
  // the prayer entry is the page city's own only on a published city
  // page; everywhere else it is the Lahore fallback and stays gated
  // until the visitor uses My Location.
  const onCityPage = !!pageCity && PUBLISHED_CITIES.some((c) => c.slug === pageCity)
  return NextResponse.json({ items, gatePrayer: !onCityPage })
}
