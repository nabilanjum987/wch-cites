# QA Gate — automated checker

`qa_gate.py` runs the frozen WorldCityHub QA gate against any set of
URLs. Python 3 standard library only — nothing to install.

```bash
# whole site via its sitemap
python3 qa_gate.py --sitemap https://worldcityhub.vercel.app/sitemap.xml --out report.md

# or specific pages
python3 qa_gate.py https://worldcityhub.vercel.app/pakistan/punjab/lahore https://worldcityhub.vercel.app/rates
```

Exit code 0 = every checked page passes; 1 = at least one failure.

## What it checks (per page)

| Gate item | Rule |
|---|---|
| HTTP status | must be 200 |
| SSR content | visible text (tags/scripts stripped) ≥ 800 chars — below that, the page is flagged as a possible client shell |
| Canonical | exactly 1 `<link rel="canonical">`, and it must point at the page itself |
| Title | present, ≤ 60 characters |
| Description | present, ≤ 155 characters |
| Placeholders | none of: `loading...`, `loading…`, `Lorem ipsum`, `Coming soon`, `Cities 10247` (known hard-coded counter), `placeholder text`, `TODO:`, `FIXME`, `sample text`, `dummy data` |
| Internal links | every internal href on the page is fetched once (cached across pages) and must return 200 |

## Reading the report

The markdown table lists one row per page with the measured values and
a PASS / FAIL verdict naming each failed rule; dead internal links are
listed again at the bottom with their HTTP status.

## Honest limits

- Visible-text length is a proxy for server rendering, not a proof:
  a page can pass the threshold and still hydrate badly. Pair this
  tool with a periodic manual raw-HTML inspection (see the
  re-verification sweep).
- The link crawl checks the links found on the checked pages only;
  run it against the full sitemap for site-wide coverage.
- Placeholder matching is literal and lower-cased; new placeholder
  phrasings must be added to `PLACEHOLDERS` in the script.

Reports from scheduled runs live in `reports/`.
