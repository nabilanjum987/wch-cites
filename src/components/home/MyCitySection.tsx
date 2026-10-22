import { getMyCityData, MY_CITY_META } from '@/lib/home-mycity';
import MyCityPanel from './MyCityPanel';

// My City panel — server wrapper (WP2 Slice 4 / Q4). Fetches the
// default city's (Lahore) figures server-side so they render in the
// server HTML, then hands them to the interactive panel, which can
// quietly switch to the visitor's nearest published city if he opted
// in to location in the hero.
export default async function MyCitySection() {
  const initial = await getMyCityData('lahore').catch(() => null);
  if (!initial) return null;
  return <MyCityPanel initial={initial} metas={MY_CITY_META} />;
}
