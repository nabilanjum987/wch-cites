# City Voice — Public Page Design

## ⚠️ DESIGN ONLY — NOT BUILT

This is a paper design for the owner's later decision, prepared
under the Round 4 design-only authorization. It changes no frozen
design, ships no code, and opens no route. Source idea:
`wch-complete-handover-package-2026-10-22.md` §6C (post-freeze
vision). The existing `/improve` suggestion form is the private
ancestor of this page; City Voice is its public, moderated,
grown-up form.

## Purpose

A public page where anyone can submit, in a structured form, how
their city or country can be made better — a problem, a proposed
solution, the place it belongs to, and a category — and where
accepted submissions are displayed, voted on, and aggregated into a
citizen-priorities dataset that no API sells. The dataset, not the
page, is the asset: monthly public reports per city first, then
universities/NGOs/local bodies, then governments — in that order,
and only when the data has real volume and credibility.

## Audience

- Residents with a specific, fixable problem (a broken interchange,
  a dark park, a missing bus route).
- Local experts and students who can propose credible solutions.
- Readers (the majority) who vote and browse their city's agenda.
- Later: institutions consuming the anonymized aggregate reports.

## Design language

Built entirely inside the frozen visual system (homepage spec
§1–§24): English only, everywhere, including form labels, category
names, buttons and alt text. Same header/footer, same panel
grammar (heading → real written content → live figure → hook
line). No new visual identity; City Voice should feel like a
WorldCityHub page that happens to listen.

## Page anatomy (section by section)

1. **Header band** — "City Voice" + one line of purpose + the
   honesty strip: "Every published entry is human-moderated.
   Nothing appears here automatically."
2. **Live figures band** — real counts only, from the submissions
   store: entries published, cities covered, votes cast this
   month. A figure with no store behind it is not shown.
3. **Submit band** — the structured form (see data model):
   problem · proposed solution · country/city (from the published
   registry ONLY — a submission cannot invent a city page) ·
   category (fixed list: Transport, Water & Sanitation, Power,
   Parks & Public Space, Safety, Health, Education, Waste,
   Digital Access, Other). Name optional; contact optional and
   never displayed. The /improve anti-spam stack applies unchanged
   (honeypot, time-trap, validation, per-IP rate limit,
   insert-only store).
4. **Browse band** — published entries, newest first, filterable
   by city + category; each entry shows problem, solution, place,
   category, date published, vote count, and status chips
   (Acknowledged / In discussion / Reported fixed — a status
   changes only on evidence, see integrity rules).
5. **City agenda band** — per published city: its top-voted open
   problems as a ranked list (the "citizen agenda"), each linking
   to the city's page. This is the SEO heart: real, unique,
   citizen-written content under a heading, per the site's SEO
   rule.
6. **How moderation works band** — the moderation flow (below) in
   plain English, with realistic timelines. Trust is the product.
7. **Reports band** — the monthly public report per city (PDF/
   page) once volume justifies it; until then the band states
   plainly that reports begin when a city reaches a stated entry
   threshold — a number the owner sets (open question).
8. **Footer** — standard frozen footer; links only to published
   pages (L1).

## Data model (sketch)

- `voice_submissions` — id, created_at, problem (text, capped),
  solution (text, capped), country_slug, city_slug, category
  (enum), submitter_name (optional, private), contact (optional,
  private, never displayed), status (pending / published /
  rejected / merged-duplicate), moderator_note (private),
  published_at. Insert-only for the public role (RLS), exactly
  like the suggestions drop box; reads only via the moderation
  view.
- `voice_votes` — submission_id, voter_fingerprint (coarse,
  privacy-respecting), created_at; one vote per fingerprint per
  entry; counts are computed, never stored editable.
- `voice_status_events` — submission_id, status, evidence_url,
  changed_by, changed_at (the audit trail behind every
  "Reported fixed" chip).

## Moderation flow

1. Submission lands as `pending` (invisible publicly). Bot
   defences run first (honeypot/time-trap/rate limit).
2. A human moderator checks: is it a real place in the registry?
   Is the problem specific? Is the solution lawful and safe?
   Duplicates are merged into the strongest existing entry (the
   submitter's text preserved in the merge record).
3. Publish, reject (with a private reason), or hold for
   clarification. Nothing auto-publishes — the /improve law
   carries over at full strength.
4. Status changes after publication require evidence (a news
   link, an official notice, a dated photo) recorded in
   `voice_status_events`. "Reported fixed" without evidence is
   forbidden.
5. Monthly: per-city agenda snapshot frozen for the report.

## Integrity rules

- No unverified claim is presented as fact; entries are labelled
  as citizen submissions, and the site's voice never adopts a
  submission's claims as its own.
- No personal data is displayed (names/contacts stay private);
  entries naming private individuals in accusations are rejected.
- No partisan framing by the site: entries across viewpoints are
  moderated by the same specificity/lawfulness tests.
- Voting is one-per-fingerprint, rate-limited, and counts are
  shown as counts — never converted into "the city demands…"
  editorial claims.
- Where a category touches the conflicts/charity rules (e.g. an
  entry about aid), the frozen rules apply: charity links 0%
  commission, no weapons/defence content.

## Open questions for the owner

1. Entry threshold per city before its monthly report starts?
2. Moderation staffing: who moderates, and what daily volume
   triggers a pause on submissions?
3. Do votes require the existing (future) account system, or is
   the fingerprint model acceptable long-term?
4. Should solutions allow links (evidence) from submitters, with
   nofollow, or text only?
5. Does a submission about an unpublished city queue silently
   until that city activates, or redirect to /improve?
6. Legal: what takedown/defamation process is published alongside
   launch, and in which jurisdiction's terms?

**DESIGN ONLY — NOT BUILT.**
