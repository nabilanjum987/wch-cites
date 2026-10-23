# GSC Prep — 1 November Review: Evidence Checklist

**For the owner to execute on review day (1 Nov 2026). The agent
touches no Google property.** The freeze plan gates further
expansion on indexation evidence; this checklist captures exactly
that evidence, from GSC and from the site, in one sitting.

## A. From Google Search Console

- [ ] **Sitemap status:** submitted sitemap(s) read successfully;
      record discovered-URL count shown by GSC.
- [ ] **Coverage / Pages report:** counts for Indexed · Not indexed
      (broken out by reason: Crawled–not indexed, Discovered–not
      indexed, Duplicate/canonical issues, Soft 404, 404).
- [ ] **Indexation ratio per cluster:** indexed ÷ submitted for
      (a) golden pages, (b) Lahore cluster, (c) Karachi cluster,
      (d) Islamabad cluster, (e) hubs. (If segmentation has not
      landed, compute per cluster from the URL Inspection sample +
      Pages report filters.)
- [ ] **Priority URL inspections:** homepage, /countries,
      /wonders/taj-mahal, /oceans/arabian-sea, Islamabad economy
      page (the Panama-fix page — confirm the indexed copy shows
      Pakistan's figures), ICT province page (confirm it indexes
      as ICT, not Punjab). Record: indexed? canonical chosen =
      ours? last crawl date?
- [ ] **Request-indexing log check:** every request made from the
      prioritized list — URL, date requested, today's verdict.
      Note any URL requested >10 days ago and still not indexed.
- [ ] **Performance (last 28 days):** total clicks/impressions,
      top 20 queries, top 20 pages; record any query where a page
      ranks 4–20 (striking distance) — these feed the next content
      round.
- [ ] **Core Web Vitals report:** mobile + desktop status per
      template group; record any group flagged Poor/Need
      improvement (the Round 2 performance pass consumes this).
- [ ] **Manual actions / Security issues:** screenshot or note
      "none" explicitly — absence recorded is evidence; absence
      unrecorded is a gap.

## B. From the site itself (same day)

- [ ] Re-run the QA gate on production:
      `python3 tools/qa-gate/qa_gate.py --sitemap https://worldcityhub.vercel.app/sitemap.xml --out reports/nov-1.md`
      and attach the table. Any FAIL is listed with its owner
      territory.
- [ ] Sitemap count check: submitted count vs live count vs the
      expected set (53 + merged additions). Any drift is a named
      defect, not a shrug.
- [ ] Spot-verify 5 live figures against sources (gold tola vs
      CoinGecko, USD/PKR vs the open endpoint, one city's weather,
      one capital's table temperature, Brent vs FRED) — value +
      source + time recorded.
- [ ] Migration state: which of 0001–0005 are applied; any surface
      still in honest-degradation mode (e.g. forms "being
      activated") listed by name.

## C. The decision the evidence feeds

Per the freeze plan, record the review's verdict in the day log:

- [ ] Indexation ratio per cluster — does it justify opening the
      next activation batch (and which one)?
- [ ] Any cluster whose ratio is poor: the named cause (thin
      content? crawl delay? canonical issue?) and the fix owner.
- [ ] Striking-distance queries (A) routed to the content stream
      as its next brief.

**Rule:** no new activation batch opens on enthusiasm. It opens
on this checklist, filled in.
