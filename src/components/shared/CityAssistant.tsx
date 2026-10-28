'use client';

// CityAssistant — Phase 1 rule-based assistant (main-file Section 23).
//
// FREE, no key, no network: every answer is built ONLY from the snapshot
// the host page already loaded (its own live panels). The component never
// fetches, never guesses, and never invents a figure, time, price or
// event. When a question has no matching rule or the snapshot has no
// live value, the bot says so plainly and links the relevant section.
//
// Data scope is whatever the host page passes in: a city page passes
// that city's snapshot only, so Lahore's bot can never answer for
// Karachi. B9 extends the same component to three more levels
// (country / province / homepage) WITHOUT new fetches: those pages
// pass their own snapshot — live values where the page has them,
// nulls elsewhere (the bot then answers "I don't have that yet"),
// plus link overrides to real section anchors (they have no city
// subpages) and verbatim extraFacts built from the page's own data.
// A level bot never answers for a city, and never repeats a figure
// its host page does not carry.

import { useEffect, useRef, useState } from 'react';

export interface AssistantPrayerTimes {
  Fajr?: string;
  Sunrise?: string;
  Dhuhr?: string;
  Asr?: string;
  Maghrib?: string;
  Isha?: string;
}

export interface AssistantLink {
  label: string;
  href: string;
}

export interface AssistantFact {
  /** Lowercase keywords matched against the normalized question. */
  keywords: string[];
  /** Full answer text, built by the host page from its own data only. */
  answer: string;
  link?: AssistantLink;
}

export interface AssistantSnapshot {
  /** Display name of the scope, e.g. "Lahore". */
  scopeName: string;
  /** ISO country code, e.g. "PK" — drives the flag emoji on the icon. */
  countryCode: string;
  /** Canonical base path of the host page, e.g. "/pakistan/punjab/lahore". */
  basePath: string;
  /**
   * B9 — level link overrides. A city page leaves this out and keeps the
   * original behaviour (basePath subpages + #emergency). A country /
   * province / homepage page has no such subpages, so it MUST pass real
   * targets here (its own section anchors or real pages) — otherwise the
   * bot would link to routes that do not exist at that level.
   */
  links?: {
    prayerTimes?: AssistantLink;
    weather?: AssistantLink;
    rates?: AssistantLink;
    events?: AssistantLink;
    emergency?: AssistantLink;
  };
  /**
   * B9 — greeting topics override. Absent = the city wording ("prayer
   * times, weather, gold rates, emergency numbers or events"). A level
   * whose snapshot carries no live prayer/weather/gold values must NOT
   * promise those topics — it names what it can actually answer.
   */
  topics?: string;
  /**
   * B9 — host-page facts, answered verbatim. The host page builds each
   * answer from data it already renders (capital, provinces, divisions,
   * population with source year); the matcher never composes a figure.
   */
  extraFacts?: AssistantFact[];
  /**
   * B9 — fallback section-link overrides ({ label, href } per topic key:
   * news, sports, economy, places, food, jobs, holidays, glance).
   * Absent = the city behaviour (#anchor per key).
   */
  sectionLinks?: Record<string, AssistantLink>;
  prayerTimes: AssistantPrayerTimes | null;
  /** Rounded values exactly as the weather panel renders them. */
  temp: number | null;
  feelsLike: number | null;
  weatherDesc: string | null;
  /** OpenWeather rain volume (mm) for the last hour/3h, null when unreported. */
  rainMm: number | null;
  /** Rounded PKR per gram, exactly as the gold panel renders it. */
  goldPerGram: number | null;
  goldPerTola: number | null;
  /** Emergency numbers exactly as the emergency panel renders them
   *  (panel fallbacks included: 15 / 1122 / 16 when the live feed is empty).
   *  B9: null when the host page carries no emergency panel (homepage) —
   *  the matcher then answers honestly instead of inventing numbers. */
  police: string | null;
  ambulance: string | null;
  fire: string | null;
  /** Real events listed on the host page (city main page lists none). */
  eventsCount: number;
}

interface BotMessage {
  role: 'bot' | 'user';
  text: string;
  link?: { label: string; href: string };
}

function flagEmoji(countryCode: string): string {
  const code = (countryCode || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (code.length !== 2) return '🌍';
  return String.fromCodePoint(
    ...code.split('').map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

const fmt = (n: number) => n.toLocaleString('en-PK');

function normalize(q: string): string {
  return q.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Pure rule matcher: question + snapshot → bot reply. No I/O, no guessing. */
export function matchAnswer(rawQuestion: string, snap: AssistantSnapshot): BotMessage {
  const q = normalize(rawQuestion);
  const scope = snap.scopeName;
  const noData = (topic: string, link: { label: string; href: string }): BotMessage => ({
    role: 'bot',
    text: `I don't have ${topic} for ${scope} yet — the live feed did not return it on this page.`,
    link,
  });

  // Greeting — no data needed.
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)$/.test(q)) {
    return {
      role: 'bot',
      text: snap.topics
        ? `Hi! I'm the ${scope} Assistant. Ask me about ${snap.topics} in ${scope} — or tap a quick button below.`
        : `Hi! I'm the ${scope} Assistant. Ask me about prayer times, weather, gold rates, emergency numbers or events in ${scope} — or tap a quick button below.`,
    };
  }

  // ── Prayer times ──────────────────────────────────────────────────
  const prayerNames: Array<[RegExp, keyof AssistantPrayerTimes, string]> = [
    [/\bfajr\b/, 'Fajr', 'Fajr'],
    [/\bdhuhr\b|\bzuhr\b/, 'Dhuhr', 'Dhuhr'],
    [/\basr\b/, 'Asr', 'Asr'],
    [/\bmaghrib\b/, 'Maghrib', 'Maghrib'],
    [/\bisha\b/, 'Isha', 'Isha'],
    [/\bsunrise\b/, 'Sunrise', 'Sunrise'],
  ];
  if (/\bprayer\b|\bnamaz\b|\bsalah\b|\bazan\b|\badhan\b/.test(q) || prayerNames.some(([re]) => re.test(q))) {
    const prayerLink = snap.links?.prayerTimes ?? { label: `Full prayer timetable for ${scope}`, href: `${snap.basePath}/prayer-times` };
    if (!snap.prayerTimes) return noData('prayer times', prayerLink);
    const named = prayerNames.find(([re]) => re.test(q));
    if (named) {
      const time = snap.prayerTimes[named[1]];
      if (!time) return noData(`${named[2]} time`, prayerLink);
      return {
        role: 'bot',
        text: `${named[2]} in ${scope} today is ${time}.`,
        link: prayerLink,
      };
    }
    const parts = (['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const)
      .map((name) => (snap.prayerTimes?.[name] ? `${name} ${snap.prayerTimes[name]}` : null))
      .filter(Boolean);
    if (parts.length === 0) return noData('prayer times', prayerLink);
    return {
      role: 'bot',
      text: `Prayer times in ${scope} today: ${parts.join(' · ')}.`,
      link: prayerLink,
    };
  }

  // ── Weather ───────────────────────────────────────────────────────
  if (/\bweather\b|\btemperature\b|\btemp\b|\bhot\b|\bcold\b|\brain\b|\bforecast\b/.test(q)) {
    const weatherLink = snap.links?.weather ?? { label: `Full weather forecast for ${scope}`, href: `${snap.basePath}/weather` };
    if (snap.temp === null) return noData('live weather', weatherLink);
    const rain =
      snap.rainMm !== null
        ? ` Rain: ${snap.rainMm} mm reported.`
        : ' Rain: none reported right now.';
    return {
      role: 'bot',
      text: `Weather in ${scope} right now: ${snap.temp}°C${snap.feelsLike !== null ? ` (feels like ${snap.feelsLike}°C)` : ''}${snap.weatherDesc ? `, ${snap.weatherDesc}` : ''}.${rain}`,
      link: weatherLink,
    };
  }

  // ── Gold ──────────────────────────────────────────────────────────
  if (/\bgold\b|\btola\b|\bkarat\b|\bcarat\b|\bmetal\b/.test(q)) {
    const goldLink = snap.links?.rates ?? { label: `Full rates page for ${scope}`, href: `${snap.basePath}/rates` };
    if (snap.goldPerGram === null) return noData('a live gold rate', goldLink);
    const tola = snap.goldPerTola !== null ? ` (${fmt(snap.goldPerTola)} PKR per tola)` : '';
    return {
      role: 'bot',
      text: `Gold rate for ${scope} today: ${fmt(snap.goldPerGram)} PKR per gram (24 karat)${tola}.`,
      link: goldLink,
    };
  }

  // ── Emergency ─────────────────────────────────────────────────────
  if (/\bemergency\b|\bpolice\b|\bambulance\b|\bfire\b|\bhelpline\b|\brescue\b/.test(q)) {
    const emergencyLink = snap.links?.emergency ?? { label: `Emergency contacts section`, href: '#emergency' };
    if (!snap.police || !snap.ambulance || !snap.fire) {
      return {
        role: 'bot',
        text: `I don't have emergency numbers for ${scope} yet — this page carries no emergency panel.`,
        link: emergencyLink,
      };
    }
    return {
      role: 'bot',
      text: `Emergency numbers for ${scope}: Police ${snap.police}, Rescue / Ambulance ${snap.ambulance}, Fire Brigade ${snap.fire}.`,
      link: emergencyLink,
    };
  }

  // ── Events ────────────────────────────────────────────────────────
  // The city main page lists no individual events (its events section
  // is category links only), so the honest Phase 1 answer is "none
  // listed here" + the events page link. NEVER invent an event.
  if (/\bevents?\b|\bweekend\b|\bthings to do\b|\bwhat.s on\b/.test(q)) {
    const eventsLink = snap.links?.events ?? { label: `Full events calendar for ${scope}`, href: `${snap.basePath}/events` };
    if (snap.eventsCount > 0) {
      return {
        role: 'bot',
        text: `I can see events listed for ${scope} on this page — open the full calendar for dates and details.`,
        link: eventsLink,
      };
    }
    return {
      role: 'bot',
      text: `I don't have a list of events for ${scope} on this page yet — no events are listed here.`,
      link: eventsLink,
    };
  }

  // ── B9 host-page facts: verbatim answers from the host page's own
  // data. Checked before the fallback so a level can answer its own
  // questions (capital, provinces, population) without a new rule per
  // fact — and so an unlisted question still falls through honestly.
  if (snap.extraFacts) {
    for (const fact of snap.extraFacts) {
      if (fact.keywords.some((kw) => q.includes(kw))) {
        return { role: 'bot', text: fact.answer, link: fact.link };
      }
    }
  }

  // ── Fallback: honest, with a section link when the topic maps to one ─
  const sectionLinks: Array<[RegExp, string, string]> = [
    [/\bnews\b|\bheadline\b/, 'news', 'News section'],
    [/\bsport\b|\bcricket\b/, 'sports', 'Sports section'],
    [/\beconomy\b|\bgdp\b|\binflation\b/, 'economy', 'Economy section'],
    [/\bplace\b|\blandmark\b|\bvisit\b/, 'places', 'Famous places section'],
    [/\bfood\b|\beat\b|\brestaurant\b/, 'food', 'Street food section'],
    [/\bjob\b|\bwork\b/, 'jobs', 'Jobs section'],
    [/\bholiday\b/, 'holidays', 'Holidays section'],
    [/\bpopulation\b|\barea\b|\belevation\b/, 'glance', 'At a glance section'],
  ];
  const section = sectionLinks.find(([re]) => re.test(q));
  const sectionLink = section
    ? (snap.sectionLinks?.[section[1]] ?? { label: section[2], href: `#${section[1]}` })
    : undefined;
  return {
    role: 'bot',
    text: snap.topics
      ? `I don't have that for ${scope} yet — I can only answer from this page's data (${snap.topics}). Try one of the quick buttons below.`
      : `I don't have that for ${scope} yet — I can only answer from this page's live data (prayer times, weather, gold, emergency numbers, events). Try one of the quick buttons below.`,
    link: sectionLink,
  };
}

const QUICK_BUTTONS = ['Prayer Times', 'Weather Today', 'Gold Rate', 'Emergency', 'Events Today'];

/** "Start Chat →" button for the in-page chatbot section: opens the widget. */
export function OpenAssistantButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('wch:open-assistant'))}
      className="text-white px-6 py-3 rounded-full font-medium transition border border-green-500/50 hover:border-green-400"
      style={{ backgroundColor: 'rgba(12,122,61,0.6)' }}
    >
      Start Chat →
    </button>
  );
}

export default function CityAssistant({ snapshot }: { snapshot: AssistantSnapshot }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      role: 'bot',
      text: snapshot.topics
        ? `Hi! I'm the ${snapshot.scopeName} Assistant. I answer only from this page's data — tap a quick button or ask about ${snapshot.topics}.`
        : `Hi! I'm the ${snapshot.scopeName} Assistant. I answer only from this page's live data — tap a quick button or ask about prayer times, weather, gold, emergency numbers or events.`,
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('wch:open-assistant', handler);
    return () => window.removeEventListener('wch:open-assistant', handler);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }, matchAnswer(trimmed, snapshot)]);
  };

  const flag = flagEmoji(snapshot.countryCode);

  return (
    <>
      {/* Floating icon: small circle, bottom-right, city flag emoji. */}
      <button
        type="button"
        aria-label={`${snapshot.scopeName} Assistant — open chat`}
        title={`${snapshot.scopeName} Assistant`}
        onClick={() => setOpen((v) => !v)}
        className="fixed z-50 bottom-5 right-5 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition hover:scale-105"
        style={{ backgroundColor: '#0C7A3D', border: '2px solid rgba(200,169,81,0.7)' }}
      >
        <span className="text-2xl leading-none" aria-hidden="true">{flag}</span>
        <span className="absolute bottom-0 right-0 text-xs leading-none" aria-hidden="true">💬</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`${snapshot.scopeName} Assistant chat`}
          className="fixed z-50 inset-x-0 bottom-0 sm:inset-x-auto sm:right-5 sm:bottom-24 sm:w-[380px] rounded-t-2xl sm:rounded-2xl border flex flex-col overflow-hidden"
          style={{ backgroundColor: '#101828', borderColor: 'rgba(200,169,81,0.5)', maxHeight: '75vh', height: '520px', maxWidth: '100vw' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div>
              <div className="font-semibold text-white text-sm">
                {flag} {snapshot.scopeName} Assistant
              </div>
              <div className="text-xs text-gray-400">Answers from this page&apos;s live data only</div>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white text-xl leading-none px-2"
            >
              ×
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === 'user' ? 'text-black' : 'text-white'
                  }`}
                  style={{ backgroundColor: m.role === 'user' ? '#C8A951' : 'rgba(255,255,255,0.08)' }}
                >
                  <p>{m.text}</p>
                  {m.link && (
                    <a href={m.link.href} className="inline-block mt-1 text-xs font-medium underline" style={{ color: '#34d399' }}>
                      {m.link.label} →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick buttons — always visible. */}
          <div className="flex flex-wrap gap-2 px-3 py-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            {QUICK_BUTTONS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => ask(label)}
                className="text-xs px-3 py-1.5 rounded-full border border-green-500/40 text-green-200 hover:bg-green-500/20 transition"
              >
                {label}
              </button>
            ))}
          </div>

          <form
            className="flex gap-2 p-3 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
              setInput('');
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${snapshot.scopeName}…`}
              aria-label="Type your question"
              className="flex-1 min-w-0 rounded-full px-3 py-2 text-sm text-white outline-none border border-white/20"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
            />
            <button
              type="submit"
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold text-black"
              style={{ backgroundColor: '#C8A951' }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
