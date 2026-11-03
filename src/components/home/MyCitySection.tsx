import { getMyCityData, MY_CITY_META } from '@/lib/home-mycity';
import MyCityPanel from './MyCityPanel';

// My City panel — server wrapper (WP2 Slice 4 / Q4). Fetches the
// default city's (Lahore) figures server-side and hands them to the
// interactive panel as props. Stage 2 (2026-11-03): the panel shows
// the figures only after the visitor opts in via My Location (before
// that it renders an invitation), and it can quietly switch to the
// visitor's nearest published city once he has opted in.
export default async function MyCitySection() {
  const initial = await getMyCityData('lahore').catch(() => null);
  if (!initial) return null;
  return <MyCityPanel initial={initial} metas={MY_CITY_META} />;
}
