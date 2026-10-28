import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// final30 B11 — 301 from the legacy Islamabad alias to its canonical page.
//
// /pakistan/islamabad/islamabad renders only a thin Coming Soon shell:
// the city dataset (CITY_DB) has no such key — the canonical key is
// /pakistan/islamabad-capital-territory/islamabad, which renders the
// full city guide (population, weather, prayer times, gold, news,
// events, economy). The alias must therefore consolidate to the
// canonical URL instead of lingering as thin duplicate content.
//
// Why middleware, not next.config redirects: next.config's
// permanent:true emits a 308, and the page-level redirect() helper
// emits a 307. The item specifies a 301, so the status is set
// explicitly here. The matcher limits this middleware to the alias
// path (plus its trailing-slash spelling); every other request is
// untouched — there is no pass-through branch because unmatched
// paths never invoke this middleware.
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/pakistan/islamabad-capital-territory/islamabad';
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: ['/pakistan/islamabad/islamabad', '/pakistan/islamabad/islamabad/'],
};
