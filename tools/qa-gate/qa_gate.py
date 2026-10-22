#!/usr/bin/env python3
"""WorldCityHub QA-GATE checker (Round 4, card T3) — stdlib only.

Implements the frozen QA gate for any URL set:
  - HTTP 200
  - SSR content presence: visible-text length above a threshold +
    client-shell suspicion (large HTML, almost no visible text)
  - exactly 1 canonical, self-referencing
  - title <= 60 chars, meta description <= 155 chars
  - placeholder scan ("loading...", "Lorem", "Coming soon", known
    hard-coded counters, TODO markers)
  - dead-internal-link crawl: every internal link found on the
    checked pages is itself fetched once (cached) and must be 200.

Usage:
  python3 qa_gate.py --sitemap https://worldcityhub.vercel.app/sitemap.xml [--out report.md]
  python3 qa_gate.py https://example.com/page1 https://example.com/page2
Exit code 0 = all pages pass, 1 = at least one failure.
"""
import html as htmlmod
import re
import sys
import urllib.request
import urllib.error

UA = {"User-Agent": "WorldCityHub-QAGate/1.0 (internal QA; contact: site team)"}
TIMEOUT = 25
TEXT_MIN = 800
PLACEHOLDERS = ["loading...", "loading…", "lorem ipsum", "coming soon", "cities 10247",
                "placeholder text", "todo:", "fixme", "sample text", "dummy data"]

def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            return r.status, r.read().decode("utf-8", "replace"), r.geturl()
    except urllib.error.HTTPError as e:
        try: body = e.read().decode("utf-8", "replace")
        except Exception: body = ""
        return e.code, body, url
    except Exception as e:
        return 0, f"FETCH-ERROR: {e}", url

def visible_text(html):
    h = re.sub(r"(?is)<script.*?</script>|<style.*?</style>|<!--.*?-->", " ", html)
    h = re.sub(r"(?s)<[^>]+>", " ", h)
    return re.sub(r"\s+", " ", htmlmod.unescape(h)).strip()

def get_meta(html, name):
    m = re.search(r'<meta[^>]+name=["\']' + name + r'["\'][^>]+content=["\']([^"\']*)', html, re.I)
    if not m:
        m = re.search(r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']' + name + r'["\']', html, re.I)
    return m.group(1) if m else None

def check_page(url, origin):
    status, html, final = fetch(url)
    row = {"url": url, "status": status, "text": 0, "canon": "-", "title_len": "-",
           "desc_len": "-", "placeholders": [], "links": [], "fails": []}
    if status != 200:
        row["fails"].append(f"HTTP {status}")
        return row, html
    row["text"] = len(visible_text(html))
    if row["text"] < TEXT_MIN:
        row["fails"].append(f"thin SSR text ({row['text']} chars < {TEXT_MIN}) — possible client shell")
    canons = re.findall(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)', html, re.I)
    canons += re.findall(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']', html, re.I)
    row["canon"] = str(len(canons))
    if len(canons) != 1:
        row["fails"].append(f"canonical count = {len(canons)}")
    else:
        cpath = re.sub(r"^https?://[^/]+", "", canons[0]).rstrip("/") or "/"
        upath = re.sub(r"^https?://[^/]+", "", url).rstrip("/") or "/"
        if cpath != upath:
            row["fails"].append(f"canonical not self-referencing ({canons[0]})")
    t = re.search(r"(?is)<title>(.*?)</title>", html)
    title = htmlmod.unescape(t.group(1)).strip() if t else ""
    row["title_len"] = len(title)
    if not title: row["fails"].append("missing title")
    elif len(title) > 60: row["fails"].append(f"title {len(title)} > 60")
    desc = get_meta(html, "description")
    row["desc_len"] = len(desc) if desc else 0
    if not desc: row["fails"].append("missing description")
    elif len(desc) > 155: row["fails"].append(f"description {len(desc)} > 155")
    low = html.lower()
    row["placeholders"] = [p for p in PLACEHOLDERS if p in low]
    if row["placeholders"]:
        row["fails"].append("placeholder strings: " + ", ".join(row["placeholders"]))
    hrefs = set(re.findall(r'href=["\']([^"\']+)["\']', html))
    internal = set()
    for h in hrefs:
        if h.startswith("/") and not h.startswith("//"):
            internal.add(origin + h.split("#")[0])
        elif h.startswith(origin):
            internal.add(h.split("#")[0])
    row["links"] = sorted(x for x in internal if x and x != url)
    return row, html

def main():
    args = sys.argv[1:]
    out = None
    urls = []
    i = 0
    while i < len(args):
        if args[i] == "--sitemap":
            _, xml, _ = fetch(args[i + 1])
            urls = re.findall(r"<loc>([^<]+)</loc>", xml)
            i += 2
        elif args[i] == "--out":
            out = args[i + 1]; i += 2
        else:
            urls.append(args[i]); i += 1
    if not urls:
        print(__doc__); return 2
    origin = re.match(r"^https?://[^/]+", urls[0]).group(0)
    rows, link_targets = [], set()
    for u in urls:
        row, _ = check_page(u, origin)
        rows.append(row)
        link_targets.update(row["links"])
        print(f"checked {u} -> {row['status']}, text {row['text']}, fails {len(row['fails'])}", flush=True)
    link_targets -= set(urls)
    dead = {}
    cache = {r["url"]: r["status"] for r in rows}
    for link in sorted(link_targets):
        if link in cache:
            st = cache[link]
        else:
            st, _, _ = fetch(link)
            cache[link] = st
        if st != 200:
            dead[link] = st
        print(f"link {link} -> {st}", flush=True)
    for r in rows:
        mydead = [l for l in r["links"] if l in dead]
        if mydead:
            r["fails"].append(f"dead internal links: {len(mydead)} ({', '.join(mydead[:3])})")
    lines = ["| URL | HTTP | SSR text | Canon | Title | Desc | Verdict |",
             "|---|---|---|---|---|---|---|"]
    for r in rows:
        verdict = "PASS" if not r["fails"] else "FAIL — " + "; ".join(r["fails"])
        lines.append(f"| {r['url']} | {r['status']} | {r['text']} | {r['canon']} | {r['title_len']} | {r['desc_len']} | {verdict} |")
    lines.append("")
    lines.append(f"Checked {len(rows)} pages, {len(link_targets)} additional internal links, dead links found: {len(dead)}")
    for l, st in sorted(dead.items()):
        lines.append(f"- DEAD {l} -> HTTP {st}")
    report = "\n".join(lines) + "\n"
    if out:
        open(out, "w").write(report)
    print(report)
    return 1 if any(r["fails"] for r in rows) else 0

if __name__ == "__main__":
    sys.exit(main())
