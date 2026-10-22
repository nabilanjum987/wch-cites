import { NextResponse } from 'next/server';

// Suggestion drop-box for /improve. Security by design:
// - The browser only ever talks to THIS route; the database write uses
//   the anon key against a table whose RLS allows INSERT and nothing
//   else (no read, no update, no delete for anon) — a write-only box.
// - Honeypot + time-trap silently drop bots while returning fake success.
// - Strict server-side validation and length caps; plain text only.
// - Best-effort per-IP rate limit. Nothing is ever auto-published.

const CATEGORIES = ['Correction', 'Missing information', 'New place or fact', 'Broken or wrong data', 'Other'];
const PAGE_TYPES = ['City guide', 'Country page', 'Province page', 'Weather', 'Prayer times', 'Rates', 'News', 'Economy', 'Events', 'Sports', 'Other'];
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 5;
}

const clean = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.replace(/<[^>]*>/g, '').trim().slice(0, max) : '';

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, code: 'bad_request' }, { status: 400 });
  }

  // Bot traps: pretend success, store nothing.
  if (clean(body.website, 200) !== '') return NextResponse.json({ ok: true });
  const startedAt = typeof body.startedAt === 'number' ? body.startedAt : 0;
  if (startedAt > 0 && Date.now() - startedAt < 2500) return NextResponse.json({ ok: true });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, code: 'rate_limited' }, { status: 429 });
  }

  const country = clean(body.country, 60);
  const city = clean(body.city, 60);
  const pageType = clean(body.pageType, 30);
  const category = clean(body.category, 40);
  const message = clean(body.message, 2000);
  const name = clean(body.name, 80);
  const email = clean(body.email, 120);

  if (!country || message.length < 10) {
    return NextResponse.json({ ok: false, code: 'validation' }, { status: 400 });
  }
  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ ok: false, code: 'validation' }, { status: 400 });
  }
  if (pageType && !PAGE_TYPES.includes(pageType)) {
    return NextResponse.json({ ok: false, code: 'validation' }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, code: 'validation' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json({ ok: false, code: 'not_active' }, { status: 503 });
  }

  try {
    const res = await fetch(`${url}/rest/v1/suggestions`, {
      method: 'POST',
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        country,
        city: city || null,
        page_type: pageType || null,
        category,
        message,
        name: name || null,
        email: email || null,
      }),
    });
    if (res.ok) return NextResponse.json({ ok: true });
    const text = await res.text();
    // Table not created yet (owner runs the SQL) — surface as "activating".
    if (res.status === 404 || /suggestions/.test(text)) {
      return NextResponse.json({ ok: false, code: 'not_active' }, { status: 503 });
    }
    return NextResponse.json({ ok: false, code: 'upstream' }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, code: 'upstream' }, { status: 502 });
  }
}
