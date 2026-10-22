import { redirect } from 'next/navigation';

// The original per-conflict client page rendered hard-coded mock data —
// invented displacement and civilian-casualty figures presented as
// fact. That violates this site's strictest editorial rules (UN/ICRC
// sources only, verified figures only), so the mock page is removed.
// Until per-conflict pages are rebuilt on whitelisted live data
// (UNHCR / ReliefWeb / wire whitelist), visitors are sent to the
// factual world overview.
export default function ConflictSlugRedirect() {
  redirect('/conflicts');
}
