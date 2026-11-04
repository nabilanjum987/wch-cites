// Embeddable clock (feat/pin-clock): GET /embed/clock?city=karachi[&design=pakistan]
// A route HANDLER, not a page — it returns one self-contained HTML
// document, so the root layout (navbar, ticker) can never leak into
// the frame. Any website can iframe it; the document carries the
// WorldCityHub name + link in its own footer, generated here on the
// server — the branding is part of the widget, not a removable
// option. Times are computed in the visitor's browser from the
// clock's IANA timezone; nothing about the visitor is collected.

import { NextRequest, NextResponse } from 'next/server';
import { getClock } from '@/components/clocks/clock-data';
import { getDesign, ownDesignFor } from '@/components/clocks/designs';

const SITE = 'https://worldcityhub.vercel.app';

function page(title: string, body: string, status = 200) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: #0a0f1e; color: #fff; display: flex; align-items: stretch; justify-content: center;
  }
  .card {
    position: relative; overflow: hidden; width: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 6px; padding: 16px 12px 12px; text-align: center;
  }
  .flag-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .38; }
  .scrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(8,12,24,.55), rgba(8,12,24,.8)); }
  .inner { position: relative; display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .city { font-size: 17px; font-weight: 700; letter-spacing: .01em; }
  .country { font-size: 11px; color: rgba(255,255,255,.55); margin-top: -3px; }
  .time { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 21px; color: rgba(255,255,255,.92); }
  .date { font-size: 12px; color: rgba(255,255,255,.45); }
  .brand {
    position: relative; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,.14);
    font-size: 11.5px; color: rgba(255,255,255,.55);
  }
  .brand a { color: #7dd3fc; font-weight: 700; text-decoration: none; }
  .brand a:hover { text-decoration: underline; }
</style>
</head>
<body>
${body}
</body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const clock = getClock(params.get('city'));
  if (!clock) {
    return page(
      'WorldCityHub Clock',
      `<div class="card"><div class="inner">
        <div class="city">Pick a city</div>
        <p style="font-size:13px;color:rgba(255,255,255,.65);max-width:260px">
          This free clock widget needs a city. Build yours in a few seconds on WorldCityHub.
        </p>
        <div class="brand">Free clock by <a href="${SITE}/clock-widgets" target="_blank" rel="noopener">WorldCityHub</a> · worldcityhub.vercel.app</div>
      </div></div>`,
      404,
    );
  }

  const designParam = params.get('design');
  const design = designParam ? getDesign(designParam) : ownDesignFor(clock.code);
  const ring = design.ring ?? clock.primary;
  const flag = design.flagCode ?? clock.code;

  const body = `<div class="card">
  ${flag ? `<img class="flag-bg" src="/images/flags/${flag}.png" alt="" aria-hidden="true"><div class="scrim"></div>` : ''}
  <div class="inner">
    <svg id="dial" width="148" height="148" viewBox="0 0 148 148" role="img" aria-label="Clock for ${clock.name}">
      <circle cx="74" cy="74" r="70" fill="#101828" stroke="${ring}" stroke-width="2.5"></circle>
      <g id="ticks"></g>
      <line id="hh" x1="74" y1="74" x2="74" y2="39" stroke="${ring}" stroke-width="4.5" stroke-linecap="round"></line>
      <line id="mh" x1="74" y1="74" x2="74" y2="24" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round"></line>
      <line id="sh" x1="74" y1="74" x2="74" y2="15" stroke="#ef4444" stroke-width="1.2" stroke-linecap="round"></line>
      <circle cx="74" cy="74" r="4.5" fill="${ring}"></circle>
    </svg>
    <div class="city">${clock.name}</div>
    <div class="country">${clock.country}</div>
    <div class="time" id="time">--:--</div>
    <div class="date" id="date"></div>
    <div class="brand">Live clock by <a href="${SITE}" target="_blank" rel="noopener">WorldCityHub</a> · worldcityhub.vercel.app</div>
  </div>
</div>
<script>
(function () {
  var TZ = ${JSON.stringify(clock.tz)};
  var ticks = document.getElementById('ticks');
  var NS = 'http://www.w3.org/2000/svg';
  for (var i = 0; i < 12; i++) {
    var a = (i * 30 - 90) * Math.PI / 180;
    var line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', 74 + 63 * Math.cos(a)); line.setAttribute('y1', 74 + 63 * Math.sin(a));
    line.setAttribute('x2', 74 + 70 * Math.cos(a)); line.setAttribute('y2', 74 + 70 * Math.sin(a));
    line.setAttribute('stroke', 'rgba(255,255,255,.35)'); line.setAttribute('stroke-width', '1.6');
    ticks.appendChild(line);
  }
  function hand(el, angleDeg, len) {
    var rad = (angleDeg - 90) * Math.PI / 180;
    el.setAttribute('x2', 74 + len * Math.cos(rad));
    el.setAttribute('y2', 74 + len * Math.sin(rad));
  }
  var hh = document.getElementById('hh'), mh = document.getElementById('mh'), sh = document.getElementById('sh');
  function tick() {
    var now = new Date();
    var str24 = now.toLocaleTimeString('en-US', { timeZone: TZ, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    var p = str24.split(':').map(Number);
    var h = p[0] || 0, m = p[1] || 0, s = p[2] || 0;
    hand(hh, ((h % 12) + m / 60) * 30, 35);
    hand(mh, (m + s / 60) * 6, 50);
    hand(sh, s * 6, 59);
    document.getElementById('time').textContent =
      now.toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true });
    document.getElementById('date').textContent =
      now.toLocaleDateString('en-US', { timeZone: TZ, weekday: 'short', month: 'short', day: 'numeric' });
  }
  tick();
  setInterval(tick, 1000);
})();
</script>`;

  return page(`${clock.name} Clock | WorldCityHub`, body);
}
