import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// P8 — the root layout cannot see a child page's route params, so the
// request pathname is passed to server components as a request header.
// Only the ticker's prayer entry reads it (src/app/layout.tsx); the
// proxy changes nothing else about the request or response.
export function proxy(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-wch-pathname', req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
