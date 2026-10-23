import { NextResponse } from 'next/server';
import { WCH_EVENT_CATEGORIES } from '@/lib/events';

// "List Your Event" submission endpoint. Same security pattern as
// /api/suggest: the browser talks only to this route; the database
// write uses the anon key against `event_submissions`, whose RLS
// allows INSERT of pending rows and nothing else — a write-only box.
// Honeypot + time-trap drop bots with fake success; strict validation
// and length caps; per-IP rate limit; plain text only. A submission is
// NEVER published automatically — a human verifies it first.

const CATEGORY_KEYS = WCH_EVENT_CATEGORIES.map((c) => c.key);
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

const slugify = (s: string): string =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, code: 'bad_request' }, { status: 400 });
  }

  // Bot traps: pretend success, store nothing.
  if (clean(body.fax_number, 200) !== '') return NextResponse.json({ ok: true });
  const startedAt = typeof body.startedAt === 'number' ? body.startedAt : 0;
  if (startedAt > 0 && Date.now() - startedAt < 2500) return NextResponse.json({ ok: true });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, code: 'rate_limited' }, { status: 429 });
  }

  const title = clean(body.title, 160);
  const cityName = clean(body.city, 80);
  const venue = clean(body.venue, 160);
  const category = clean(body.category, 30);
  const description = clean(body.description, 2000);
  const organizerName = clean(body.organizerName, 80);
  const organizerEmail = clean(body.organizerEmail, 120);
  const sourceUrl = clean(body.sourceUrl, 300);
  const startsRaw = clean(body.startsAt, 40);
  const endsRaw = clean(body.endsAt, 40);

  const startsAt = new Date(startsRaw);
  const endsAt = endsRaw ? new Date(endsRaw) : null;

  if (title.length < 3 || cityName.length < 2 || !startsRaw || Number.isNaN(startsAt.getTime())) {
    return NextResponse.json({ ok: false, code: 'validation' }, { status: 400 });
  }
  if (endsAt && (Number.isNaN(endsAt.getTime()) || endsAt.getTime() < startsAt.getTime())) {
    return NextResponse.json({ ok: false, code: 'validation' }, { status: 400 });
  }
  if (!CATEGORY_KEYS.includes(category as (typeof CATEGORY_KEYS)[number])) {
    return NextResponse.json({ ok: false, code: 'validation' }, { status: 400 });
  }
  if (!organizerName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organizerEmail)) {
    return NextResponse.json({ ok: false, code: 'validation' }, { status: 400 });
  }
  if (sourceUrl && !/^https?:\/\//i.test(sourceUrl)) {
    return NextResponse.json({ ok: false, code: 'validation' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json({ ok: false, code: 'not_active' }, { status: 503 });
  }

  try {
    const res = await fetch(`${url}/rest/v1/event_submissions`, {
      method: 'POST',
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        title,
        city_name: cityName,
        city_slug: slugify(cityName),
        venue,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt ? endsAt.toISOString() : null,
        category,
        description,
        organizer_name: organizerName,
        organizer_email: organizerEmail,
        source_url: sourceUrl,
        status: 'pending',
      }),
    });
    if (res.ok) return NextResponse.json({ ok: true });
    const text = await res.text();
    if (res.status === 404 || /event_submissions/.test(text)) {
      return NextResponse.json({ ok: false, code: 'not_active' }, { status: 503 });
    }
    return NextResponse.json({ ok: false, code: 'upstream' }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, code: 'upstream' }, { status: 502 });
  }
}
