import { createClient } from '@supabase/supabase-js';

// Fallback placeholder URLs prevent createClient from throwing at build time
// when env vars aren't available (e.g. during next build in CI / Vercel).
// Real values must be set in Vercel env vars or .env.local for data to load.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://placeholder.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
