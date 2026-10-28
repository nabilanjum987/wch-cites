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
  // Duplicate-person consolidation (owner decision, 28 Oct 2026, final):
  // `abdus-salam` → `dr-abdus-salam`, `muhammad-ali-jinnah` →
  // `quaid-e-azam-jinnah`. Same mechanism as the B11 alias above:
  // explicit 301 (Next's permanent:true would emit 308, redirect()
  // would emit 307). The survivor URLs are deliberately NOT in this
  // map — no redirect loops. Trailing-slash variants included, as
  // with B11. The loser rows stay in the database (history); the
  // proxy is the single mechanism that retires their URLs.
  if (
    req.nextUrl.pathname === '/personalities/abdus-salam' ||
    req.nextUrl.pathname === '/personalities/abdus-salam/'
  ) {
    const url = req.nextUrl.clone();
    url.pathname = '/personalities/dr-abdus-salam';
    return NextResponse.redirect(url, 301);
  }
  if (
    req.nextUrl.pathname === '/personalities/muhammad-ali-jinnah' ||
    req.nextUrl.pathname === '/personalities/muhammad-ali-jinnah/'
  ) {
    const url = req.nextUrl.clone();
    url.pathname = '/personalities/quaid-e-azam-jinnah';
    return NextResponse.redirect(url, 301);
  }
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-wch-pathname', req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
