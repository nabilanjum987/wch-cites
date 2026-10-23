import { NextResponse } from 'next/server';
import { getApprovedEvents } from '@/lib/events';

// Public read-only events API (events strategy, step 3 — shipped early
// because the data layer made it nearly free): other sites/apps can
// consume WorldCityHub's verified events. Only approved + verified
// events are exposed. While migration 0003 is unapplied the API answers
// an honest 503 "not_active" instead of an empty or fake list.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json({ ok: false, code: 'not_active' }, { status: 503 });
  }
  // Probe table existence so "no events yet" (200, empty) is never
  // confused with "system not switched on" (503).
  try {
    const probe = await fetch(`${url}/rest/v1/events?select=id&limit=1`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
      signal: AbortSignal.timeout(6000),
    });
    if (probe.status === 404) {
      return NextResponse.json({ ok: false, code: 'not_active' }, { status: 503 });
    }
  } catch {
    return NextResponse.json({ ok: false, code: 'upstream' }, { status: 502 });
  }
  const city = searchParams.get('city') ?? undefined;
  const limitRaw = Number(searchParams.get('limit') ?? '100');
  const events = await getApprovedEvents({
    citySlug: city,
    limit: Number.isFinite(limitRaw) ? limitRaw : 100,
  });
  return NextResponse.json(
    { ok: true, count: events.length, events },
    { headers: { 'Cache-Control': 'public, max-age=300' } },
  );
}
