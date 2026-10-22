import { NextResponse } from 'next/server';

// News subscription endpoint (Q13 — groundwork only; NO sending exists
// yet — the owner's sender setup comes later). Same drop-box pattern as
// /api/suggest: browser talks only to this route; the write uses the
// anon key against `news_subscriptions`, whose RLS allows INSERT of an
// 'active' row and nothing else. Honeypot + time-trap + validation +
// per-IP rate limit.

const VALID_CATEGORIES = [
  'world', 'pakistan', 'finance', 'crypto', 'health', 'science', 'technology', 'sports',
];
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

  const email = clean(body.email, 160).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, code: 'validation' }, { status: 400 });
  }
  const rawCats = Array.isArray(body.categories) ? body.categories : [];
  const categories = [...new Set(
    rawCats.filter((c): c is string => typeof c === 'string' && VALID_CATEGORIES.includes(c)),
  )];
  if (categories.length === 0) {
    return NextResponse.json({ ok: false, code: 'validation' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json({ ok: false, code: 'not_active' }, { status: 503 });
  }

  try {
    const res = await fetch(`${url}/rest/v1/news_subscriptions`, {
      method: 'POST',
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal,resolution=merge-duplicates',
      },
      body: JSON.stringify({ email, categories, status: 'active' }),
    });
    if (res.ok) return NextResponse.json({ ok: true });
    const text = await res.text();
    if (res.status === 404 || /news_subscriptions/.test(text)) {
      return NextResponse.json({ ok: false, code: 'not_active' }, { status: 503 });
    }
    return NextResponse.json({ ok: false, code: 'upstream' }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, code: 'upstream' }, { status: 502 });
  }
}
