import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, BookOpen, MapPin } from 'lucide-react';
import { PersonalityHero } from '@/components/personality/PersonalityHero';
import { LifeTimeline } from '@/components/personality/LifeTimeline';
import { AchievementsSection } from '@/components/personality/AchievementsSection';
import { FamousWorksSection } from '@/components/personality/FamousWorksSection';
import { FamousQuotesSection } from '@/components/personality/FamousQuotesSection';
import { PersonalityBreadcrumb } from '@/components/personality/PersonalityBreadcrumb';
import FlagSymbolBackground from '@/components/shared/FlagSymbolBackground';
import { getPersonalityBySlug, getAllPersonalitySlugs } from '@/lib/personalities';
import { PersonalityDescription } from '@/components/personality/PersonalityDescription';
import { DirectAnswer, FaqBlock, type AeoFaq } from '@/components/aeo/AnswerLayer';
import {
  generateTimelineParagraph, generateTimelineAfter,
  generateAchievementsParagraph, generateAchievementsAfter,
  generateWorksParagraph, generateWorksAfter,
  generateQuotesParagraph, generateQuotesAfter,
} from '@/lib/paragraphs/personality';

// ── Personality data ──────────────────────────────────────────────────────────
// Q14: profiles now come from src/lib/personalities.ts — the Supabase
// `personalities` dataset (migration 0005) with the extracted seed as
// fallback while the migration is unapplied. See the lib for the pool
// and 24-month rotation rules (package §16).

// ── Metadata ──────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPersonalityBySlug(slug);
  if (!p) return { title: 'Personality Not Found | WorldCityHub' };
  // Defensive guard (CARD 0): the data layer guarantees a non-empty
  // description, but metadata generation must never be able to throw
  // on a profile field again — a bad record degrades to name + title,
  // it does not fail the build.
  const desc = (typeof p.description === 'string' ? p.description.trim() : '') || `${p.name} — ${p.title}`;
  return {
    title: `${p.name} — ${p.title} | WorldCityHub`,
    description: desc.slice(0, 160),
    alternates: { canonical: `https://worldcityhub.vercel.app/personalities/${slug}` },
    openGraph: {
      title: `${p.name} | WorldCityHub`,
      description: desc.slice(0, 160),
      images: p.imageUrl ? [{ url: p.imageUrl }] : [],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPersonalitySlugs();
  return slugs.map(slug => ({ slug }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

// ─── Batch 4 Item 2: AEO answer layer ─────────────────────────────────────
// Direct-answer block + FAQ block for the personalities template, composed
// ONLY from the profile record's own fields (description, birth/death
// dates, timeline, achievements, works, quotes) — no new facts. Questions
// follow the mined phrasings (see evidence/batch4-item2/question-bank.md:
// "Who is Imran Khan?", "Where was Allama Muhammad Iqbal born?", "What is
// the meaning of Khudi…?"). This template previously emitted no FAQPage
// schema, so the FAQ block emits it from the same array (emitSchema).
type Profile = Awaited<ReturnType<typeof getPersonalityBySlug>>;

function sOf(text: string): string[] {
  return (text.match(/[^.!?]+[.!?]+/g) ?? [text]).map((s) => s.trim()).filter(Boolean);
}
function wcOf(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}
function acc(base: string, extra: string[], min = 50): string {
  let out = base;
  for (const s of extra) {
    if (wcOf(out) >= min) break;
    if (!s) continue;
    // Max-guard: skip a sentence that would overshoot the 70-word band
    // when the answer is already close, and try a shorter later one.
    if (wcOf(out) + wcOf(s) > 70 && wcOf(out) >= 42) continue;
    out += ` ${s}`;
  }
  return out;
}

// ─── Birth-date guard (billi merge prep, 2026-10-23) ─────────────────────
// The "Born on …" sentence (direct answer) and the "… was born on …" lead
// (born FAQ) may only be composed when the record carries a COMPLETE,
// cleanly-formed birth date — display form "9 November 1877" or ISO
// "1877-11-09". A record whose birthDate is missing, empty or partial
// (e.g. a bare year) emits NO born line at all: unguarded, an absent date
// renders literally as "Born on undefined". One guard, used by every
// composition site below. Returns the record's original string when the
// date is usable, so records with a clean date render byte-identically.
const BIRTH_MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];
function usableBirthDate(p: NonNullable<Profile>): string | null {
  const raw = typeof p.birthDate === 'string' ? p.birthDate.trim() : '';
  if (!raw) return null;
  const disp = raw.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{3,4})$/);
  if (disp) {
    const day = parseInt(disp[1], 10);
    return day >= 1 && day <= 31 && BIRTH_MONTHS.includes(disp[2].toLowerCase())
      ? (p.birthDate as string)
      : null;
  }
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const d = new Date(`${raw}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) &&
      d.getUTCFullYear() === Number(iso[1]) &&
      d.getUTCMonth() + 1 === Number(iso[2]) &&
      d.getUTCDate() === Number(iso[3])
      ? (p.birthDate as string)
      : null;
  }
  return null;
}

// ─── Work-year guard (billi, 2026-10-24) ──────────────────────────────
// The works FAQ composes each work as "Title (year) — …". A work whose
// record carries NO year renders by title alone — no parentheses, no
// placeholder: unguarded, an absent year prints literally as
// "Title (undefined)". The year part appears only when the record holds
// a real value: a non-empty string/number, never undefined, null, an
// empty string or the literal text "undefined". One guard for every
// composition site; it returns the record's original string when the
// year is usable, so works WITH a year render byte-identically. (The
// page body's works section needs no guard: FamousWorksSection renders
// its year line only when a year is present — {work.year && …}.)
function usableWorkYear(w: { year?: string | number | null }): string | null {
  const y = w.year;
  if (typeof y === 'number') return Number.isFinite(y) ? String(y) : null;
  if (typeof y !== 'string') return null;
  const t = y.trim().toLowerCase();
  return t && t !== 'undefined' && t !== 'null' ? y : null;
}
function formatWorkTitle(w: { title: string; year?: string | number | null }): string {
  const y = usableWorkYear(w);
  return y ? `${w.title} (${y})` : w.title;
}

function buildPersonalityAeo(p: NonNullable<Profile>): { directAnswer: string; faqs: AeoFaq[] } {
  const descSentences = sOf(p.description ?? '');
  const timeline = p.timeline ?? [];
  const achievements = p.achievements ?? [];
  const works = p.works ?? [];
  const quotes = p.quotes ?? [];
  const past = Boolean(p.deathDate);
  const born = usableBirthDate(p);
  const achLine = (i: number) =>
    achievements[i] ? `${achievements[i].title}: ${achievements[i].description}` : '';

  const directParts = [
    descSentences[0] ?? p.description ?? '',
    ...(born
      ? [`Born on ${born}${past ? `, died ${p.deathDate}` : ''} — a life anchored in ${p.city}, ${p.country}.`]
      : []),
    achLine(0),
  ].filter(Boolean);
  if (wcOf(directParts.join(' ')) < 50) {
    directParts.push(`The timeline, works and quotes on this profile tell the full story of the life.`);
  }
  const directAnswer = directParts.join(' ');

  const bornEntry = timeline.find((t) => /born/i.test(t.title));
  const bornIdx = bornEntry ? timeline.indexOf(bornEntry) : -1;
  const afterBorn = bornIdx >= 0 ? timeline.slice(bornIdx + 1).map((t) => t.description) : timeline.map((t) => t.description);

  // Born FAQ — guarded by usableBirthDate like the direct answer. With a
  // usable date the composition is exactly as before. Without one, the
  // timeline's own birth entry (when the record carries it) answers a
  // "Where … born?" question with no date claim; with neither, the
  // question cannot be answered from the record and is omitted.
  const bornFaq: AeoFaq | null = born
    ? {
        q: bornEntry ? `When and where was ${p.name} born?` : `When was ${p.name} born?`,
        a: bornEntry
          ? acc(`${p.name} was born on ${born}. ${bornEntry.description}`, afterBorn)
          : acc(
              `${p.name} was born on ${born}. A ${p.nationality} figure — ${p.title} — connected with ${p.city}, ${p.country}.`,
              afterBorn,
            ),
      }
    : bornEntry
      ? { q: `Where was ${p.name} born?`, a: acc(bornEntry.description, afterBorn) }
      : null;

  const faqs: AeoFaq[] = [
    {
      q: `Who ${past ? 'was' : 'is'} ${p.name}?`,
      a: acc(descSentences.join(' '), [achLine(0), achLine(1)], 55),
    },
    ...(bornFaq ? [bornFaq] : []),
    {
      q: `What is ${p.name} famous for?`,
      a: acc(achLine(0), [achLine(1), achLine(2), achLine(3), ...descSentences.slice(1)]),
    },
  ];
  if (works.length > 0) {
    faqs.push({
      q: `What are ${p.name}'s best-known works?`,
      a: acc(
        works
          .slice(0, 3)
          .map((w) => `${formatWorkTitle(w)} — ${w.description}`)
          .join(' '),
        [`The works section of this profile lists ${works.length} works in full, each with its year and a note on why it matters.`, descSentences[1] ?? ''],
      ),
    });
  }
  if (past) {
    faqs.push({
      q: `When did ${p.name} die?`,
      a: acc(`${p.name} died on ${p.deathDate}.`, [
        timeline[timeline.length - 1]?.description ?? '',
        timeline[timeline.length - 2]?.description ?? '',
        descSentences[0] ?? '',
      ]),
    });
  }
  // Fix 2 (billi audit): the quote question was living-profiles-only; a
  // deceased profile with recorded quotes gets it too — it is a bank
  // question (Q4) and the record carries the data for every live profile.
  if (quotes.length > 0) {
    faqs.push({
      q: `What is a famous quote by ${p.name}?`,
      a: acc(`"${quotes[0].text}"${quotes[0].context ? ` — ${quotes[0].context}.` : ''}`, [
        `More of ${p.name}'s words are collected in the Famous Quotes section of this profile, alongside the timeline, achievements and works that made the name.`,
        quotes[1] ? `Also widely quoted: "${quotes[1].text}"` : '',
        achLine(0),
      ]),
    });
  }
  // Bank Q6 (impact areas) — gated on the record carrying at least two
  // achievements; composed from the achievement titles + their own text.
  if (achievements.length >= 2) {
    faqs.push({
      q: `What are the key areas of ${p.name}'s impact?`,
      a: acc(
        `Two key areas of ${p.name}'s impact are ${achievements[0].title.toLowerCase()} and ${achievements[1].title.toLowerCase()}.`,
        [achLine(2), achLine(3), descSentences[1] ?? ''],
      ),
    });
  }
  // Top-up to the bank count (7): if the structured fields above still
  // leave the block short, FAQs are derived from the profile's own
  // narrative sections, one per section, until the count is reached.
  // (For Imran Khan this yields the bank's verbatim-mined "What is Imran
  // Khan's cricket career like?" from his "Cricket Career" section.)
  for (const section of p.descriptionSections ?? []) {
    if (faqs.length >= 7) break;
    faqs.push({
      q: `What is ${p.name}'s ${section.title.toLowerCase()}?`,
      a: acc(sOf(section.content).join(' '), [descSentences[1] ?? '']),
    });
  }
  return { directAnswer, faqs: faqs.filter((f) => f.a.trim().length > 0) };
}

export default async function PersonalityPage({ params }: PageProps) {
  const { slug } = await params;
  const p = await getPersonalityBySlug(slug);
  if (!p) notFound();

  // ── Schema (SEO completion, Batch 4 Item 1): Person, built ONLY from
  // the profile record. Dates are stored as text ("9 November 1877");
  // they are converted to ISO only when they parse cleanly, otherwise
  // the property is omitted — never guessed.
  const MONTH_NUM: Record<string, string> = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
  };
  const toISODate = (s?: string): string | undefined => {
    if (!s) return undefined;
    const m = s.trim().match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (!m) return undefined;
    const mon = MONTH_NUM[m[2].toLowerCase()];
    return mon ? `${m[3]}-${mon}-${m[1].padStart(2, '0')}` : undefined;
  };
  const birthISO = toISODate(p.birthDate);
  const deathISO = toISODate(p.deathDate);
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    jobTitle: p.title,
    description: p.description,
    url: `https://worldcityhub.vercel.app/personalities/${p.slug}`,
    ...(p.imageUrl ? { image: p.imageUrl } : {}),
    ...(birthISO ? { birthDate: birthISO } : {}),
    ...(deathISO ? { deathDate: deathISO } : {}),
    nationality: { '@type': 'Country', name: p.country },
    homeLocation: { '@type': 'Place', name: `${p.city}, ${p.country}` },
    ...(p.wikiUrl ? { sameAs: [p.wikiUrl] } : {}),
  };

  // Batch 4 Item 2: AEO answer layer data (from this profile's own record).
  const { directAnswer: personalityDirectAnswer, faqs: personalityFaqs } = buildPersonalityAeo(p);
  const personalityAeoSource = `Profile facts: WorldCityHub personalities dataset${p.wikiUrl ? ' · Wikipedia article linked on this page' : ''} · Full timeline, works & quotes on this profile`;

  return (
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      {/* Flag background symbol */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <FlagSymbolBackground countrySlug={p.countrySlug} />
      </div>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }} className="px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <Link href={`/${p.countrySlug}`} className="hover:text-gray-700">{p.country}</Link>
          <span>/</span>
          <Link href={`/${p.countrySlug}/${p.provinceSlug}/${p.citySlug}`} className="hover:text-gray-700">{p.city}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{p.name}</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${p.primaryColor} 0%, ${p.primaryColor}bb 100%)` }} className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href={`/${p.countrySlug}/${p.provinceSlug}/${p.citySlug}`}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-6 transition">
            <ArrowLeft size={14} /> Back to {p.city}
          </Link>
          <PersonalityHero
            name={p.name}
            title={p.title}
            imageUrl={p.imageUrl}
            birthDate={p.birthDate}
            deathDate={p.deathDate}
            nationality={p.nationality}
            description={p.description}
          />
        </div>
      </div>

      {/* City connection badge */}
      <div className="max-w-5xl mx-auto px-4 -mt-4 mb-6">
        <div style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
          <MapPin size={14} style={{ color: p.primaryColor }} />
          <span className="text-gray-600">Connected to</span>
          <Link href={`/${p.countrySlug}/${p.provinceSlug}/${p.citySlug}`}
            className="font-semibold hover:underline" style={{ color: p.primaryColor }}>
            {p.city}, {p.country}
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 pb-16">

        {/* Batch 4 Item 2: direct-answer block, first block under the hero/heading */}
        <div className="mb-8">
          <DirectAnswer answer={personalityDirectAnswer} source={personalityAeoSource} />
        </div>

        {/* Description sections */}
        <PersonalityDescription sections={p.descriptionSections} />

        {/* Timeline */}
        {p.timeline.length > 0 && (
          <div>
            <p className="text-gray-700 leading-relaxed text-sm mt-8 mb-4">
              {generateTimelineParagraph(p.name, p.city)}
            </p>
            <LifeTimeline events={p.timeline} />
            <p className="text-gray-600 leading-relaxed text-sm mt-4">
              {generateTimelineAfter(p.name, p.city)}
            </p>
          </div>
        )}

        {/* Achievements */}
        {p.achievements.length > 0 && (
          <div>
            <p className="text-gray-700 leading-relaxed text-sm mt-8 mb-4">
              {generateAchievementsParagraph(p.name)}
            </p>
            <AchievementsSection achievements={p.achievements} />
            <p className="text-gray-600 leading-relaxed text-sm mt-4">
              {generateAchievementsAfter(p.name)}
            </p>
          </div>
        )}

        {/* Famous Works */}
        {p.works.length > 0 && (
          <div>
            <p className="text-gray-700 leading-relaxed text-sm mt-8 mb-4">
              {generateWorksParagraph(p.name)}
            </p>
            <FamousWorksSection works={p.works} />
            {p.amazonSearch && (
              <div className="mt-3 flex justify-center">
                <a href={p.amazonSearch} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium shadow hover:opacity-90 transition"
                  style={{ backgroundColor: '#FF9900' }}>
                  <BookOpen size={15} /> Buy Books on Amazon
                </a>
              </div>
            )}
            <p className="text-gray-600 leading-relaxed text-sm mt-4">
              {generateWorksAfter(p.name)}
            </p>
          </div>
        )}

        {/* Famous Quotes */}
        {p.quotes.length > 0 && (
          <div>
            <p className="text-gray-700 leading-relaxed text-sm mt-8 mb-4">
              {generateQuotesParagraph(p.name)}
            </p>
            <FamousQuotesSection quotes={p.quotes} />
            <p className="text-gray-600 leading-relaxed text-sm mt-4">
              {generateQuotesAfter(p.name)}
            </p>
          </div>
        )}

        {/* External links */}
        {p.wikiUrl && (
          <div style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }} className="mt-10 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Learn More</p>
              <p className="text-xs text-gray-500 mt-0.5">External sources for deeper reading</p>
            </div>
            <a href={p.wikiUrl} target="_blank" rel="noopener noreferrer"
              style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition hover:opacity-80">
              Wikipedia <ExternalLink size={13} />
            </a>
          </div>
        )}

        {/* Batch 4 Item 2: FAQ block + FAQPage schema (this template had none before) */}
        <div className="mt-12">
          <FaqBlock faqs={personalityFaqs} source={personalityAeoSource} emitSchema />
        </div>

        <PersonalityBreadcrumb name={p.name} birthYear={p.birthDate?.split(' ').pop()} />
      </div>
    </div>
  );
}
