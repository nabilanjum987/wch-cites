import { getWebsiteTickerItems } from '@/lib/tickers';
import Ticker2Rotator from './Ticker2Rotator';

// Ticker 2 — server wrapper (WP2 Slice 1). Placement is LOCKED in the
// frozen spec: directly under the My City panel position (homepage
// §4), which is where the homepage renders this slot.
export default async function WebsiteTicker() {
  const items = await getWebsiteTickerItems().catch(() => []);
  if (!items.length) return null;
  return <Ticker2Rotator items={items} />;
}
