import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

function resolveSupabaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (typeof fromEnv === 'string' && fromEnv.length > 0) return fromEnv;
  return 'https://placeholder.supabase.co';
}

function resolveSupabaseAnonKey(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (typeof fromEnv === 'string' && fromEnv.length > 0) return fromEnv;
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';
}

/**
 * Returns the shared Supabase client, creating it on first call.
 *
 * IMPORTANT: this is a plain function, NOT a module-level object/Proxy export.
 * Earlier versions exported a ready-made `supabase` object (via direct
 * `createClient()` at module scope, then via a Proxy wrapper), but Turbopack's
 * production bundler was observed inlining/hoisting that pattern back down
 * into a raw `createClient(process.env.X, process.env.Y)` call with no
 * fallback and no try/catch in at least one route's compiled chunk —
 * crashing that page when the env vars are unset. Requiring every call site
 * to invoke this function explicitly, inside its own try/catch, has no
 * module-level client object for the bundler to hoist or inline away.
 */
export function getSupabase(): SupabaseClient {
  if (!_client) {
    try {
      _client = createClient(resolveSupabaseUrl(), resolveSupabaseAnonKey());
    } catch (err) {
      console.error('Supabase client init failed, using hardcoded placeholder:', err);
      _client = createClient(
        'https://placeholder.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
      );
    }
  }
  return _client;
}
