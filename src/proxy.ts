import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// P8 — the root layout cannot see a child page's route params, so the
// request pathname is passed to server components as a request header.
// Only the ticker's prayer entry reads it (via TickerBarSlot, the
// Suspense-wrapped child of the root layout); the proxy changes
// nothing else about the request or response.
//
// final30 B11 — 301 from the legacy Islamabad alias to its canonical page.
// /pakistan/islamabad/islamabad renders only a thin Coming Soon shell:
// the city dataset (CITY_DB) has no such key — the canonical key is
// /pakistan/islamabad-capital-territory/islamabad, which renders the
// full city guide (population, weather, prayer times, gold, news,
// events, economy). The alias must therefore consolidate to the
// canonical URL instead of lingering as thin duplicate content.
//
// Why here, not a separate middleware file: Next.js 16 allows only ONE
// of proxy.ts / middleware.ts — both files together fail the build
// ("Both middleware file and proxy file are detected"). So the 301
// lives in this proxy, checked first; every other request falls
// through to the P8 header behaviour below. next.config's
// permanent:true emits a 308, and the page-level redirect() helper
// emits a 307 — the item specifies a 301, so the status is set
// explicitly here.
export function proxy(req: NextRequest) {
  if (
    req.nextUrl.pathname === '/pakistan/islamabad/islamabad' ||
    req.nextUrl.pathname === '/pakistan/islamabad/islamabad/'
  ) {
    const url = req.nextUrl.clone();
    url.pathname = '/pakistan/islamabad-capital-territory/islamabad';
    return NextResponse.redirect(url, 301);
  }
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-wch-pathname', req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
