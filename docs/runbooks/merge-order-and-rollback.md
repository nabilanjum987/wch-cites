# Runbook — Merge Order + Rollback

How the marathon's stacked branches land safely, and how to undo
one that lands badly. Topology and conventions are as actually
built on 2026-10-22 (Rounds 1–4).

## The topology you are merging

- **One card = one branch = one PR.** Commit messages and PR titles
  carry the card ID (Q7, R2, T1…). Evidence packs are the PR bodies.
- **Branches stack inside a territory:** a card's base is the
  previous card's branch, so each PR's diff is only its own card.
  Round 1 examples:
  - Homepage chain: `main` → `wp2-slice1-tickers` (Q1) →
    `wp2-s2-header-search` (Q2) → `wp2-s3-hero` (Q3) →
    `wp2-s4-my-city` (Q4) → `wp2-s5-panels-1` (Q5) →
    `wp2-s6-panels-2` (Q6).
  - City chain: `main` → `wp3-pc1-polish` (Q7) →
    `wp3-related-pages` (Q8) → `wp6-countries-cities` (Q11).
  - Golden chain: `main` → `wp4-golden-wonder` (Q9) →
    `wp5-golden-ocean` (Q10).
  - Systems chain: `main` → `wp7-events-system` (Q12) →
    `wp8-news-system` (Q13) → `wp9-personalities-system` (Q14).
  - Round 4 chains on `r4-` prefixes the same way
    (`r4-t1-image-bank` → `r4-t2-video-briefs` → `r4-t3-qa-gate` → …).
- **Migrations are coordinator-numbered and ship inside their PR**
  (0001 wonders, 0002 oceans, 0003 events, 0004 news
  subscriptions, 0005 personalities; Rounds 2+ continue the
  sequence). A migration is applied by the **owner**, never by the
  builder, and never before its PR merges.

## Merge discipline

1. **Nothing merges without billi's PASS on that PR** — verified
   independently, in-branch, against the evidence pack. A PASS on
   one card does not cover its stack neighbours.
2. **Merge in stack order, base first.** Q1 before Q2 before Q3…
   Merging a child before its parent pulls the parent's whole diff
   into production unreviewed. After each merge, GitHub retargets
   the next PR's base to `main` automatically when the parent
   branch is deleted — confirm the retarget and that the child's
   diff now shows only its own card before its audit.
3. **One stack at a time per merge session; verify production
   after each merge** (the merged card's surfaces only): run
   `tools/qa-gate/qa_gate.py` against the affected production URLs
   and eyeball one raw-HTML sample. A failed check stops the
   session — do not "merge through" a red production.
4. **Apply the PR's migration (owner) immediately after its
   merge**, then re-check the surface that was degrading honestly
   (e.g. a form's "being activated" state should clear). Until the
   migration is applied, honest degradation is the CORRECT state —
   do not treat it as a merge failure.
5. **Sitemap truth after each merge:** fetch `/sitemap.xml`;
   its URL count must equal the expected set exactly (Round 1
   baseline: 53; +2 for Q9/Q10's golden routes when they land; +4
   for Q8's footer pages). Any extra URL is a page that slipped
   the gate; any missing one is a merge that didn't take.

## Rollback

Decide by blast radius, in this order:

1. **Migration not yet applied + code merge bad → revert the
   merge commit** (`git revert -m 1 <merge-sha>` on main, via a
   rollback PR — never force-push main). Production returns to
   the pre-merge state; the card's branch is untouched and can be
   fixed and re-audited.
2. **Migration applied + code bad, migration is additive**
   (new tables/columns — all Round 1 migrations are): revert the
   code merge as above and LEAVE the migration in place. The
   schema is inert without the code; dropping tables in a panic
   destroys data the fixed code will need. Record the orphan
   schema in the day log.
3. **Migration applied and itself harmful** (wrong data seeded,
   constraint breaking writes): owner runs a corrective SQL in
   the Supabase SQL Editor, written as a NEW forward fix (never
   edit the merged migration file — history must stay truthful).
   Log the corrective SQL alongside the migration it repairs.
4. **A whole stack is suspect:** stop merging further up the
   stack, revert merges in REVERSE order (child first), one at a
   time, re-running the production QA spot-check after each
   revert. Branches keep the work; nothing is lost by reverting a
   merge.

## After any rollback

- Note it in the day log with: merge SHA, revert SHA, production
  state verified after, migration state (applied/not), and what
  must change before re-merge.
- The card returns to the audit queue. A re-merge needs a fresh
  billi PASS on the updated PR — the old PASS does not carry over.
