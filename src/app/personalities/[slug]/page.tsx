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

function buildPersonalityAeo(p: NonNullable<Profile>): { directAnswer: string; faqs: AeoFaq[] } {
  const descSentences = sOf(p.description ?? '');
  const timeline = p.timeline ?? [];
  const achievements = p.achievements ?? [];
  const works = p.works ?? [];
  const quotes = p.quotes ?? [];
  const past = Boolean(p.deathDate);
  const achLine = (i: number) =>
    achievements[i] ? `${achievements[i].title}: ${achievements[i].description}` : '';

  const directParts = [
    descSentences[0] ?? p.description ?? '',
    `Born on ${p.birthDate}${past ? `, died ${p.deathDate}` : ''} — a life anchored in ${p.city}, ${p.country}.`,
    achLine(0),
  ].filter(Boolean);
  if (wcOf(directParts.join(' ')) < 50) {
    directParts.push(`The timeline, works and quotes on this profile tell the full story of the life.`);
  }
  const directAnswer = directParts.join(' ');

  const bornEntry = timeline.find((t) => /born/i.test(t.title));
  const bornIdx = bornEntry ? timeline.indexOf(bornEntry) : -1;
  const afterBorn = bornIdx >= 0 ? timeline.slice(bornIdx + 1).map((t) => t.description) : timeline.map((t) => t.description);

  const faqs: AeoFaq[] = [
    {
      q: `Who ${past ? 'was' : 'is'} ${p.name}?`,
      a: acc(descSentences.join(' '), [achLine(0), achLine(1)], 55),
    },
    {
      q: bornEntry ? `When and where was ${p.name} born?` : `When was ${p.name} born?`,
      a: bornEntry
        ? acc(`${p.name} was born on ${p.birthDate}. ${bornEntry.description}`, afterBorn)
        : acc(
            `${p.name} was born on ${p.birthDate}. A ${p.nationality} figure — ${p.title} — connected with ${p.city}, ${p.country}.`,
            afterBorn,
          ),
    },
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
          .map((w) => `${w.title} (${w.year}) — ${w.description}`)
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
  } else if (quotes.length > 0) {
    faqs.push({
      q: `What is a famous quote by ${p.name}?`,
      a: acc(`"${quotes[0].text}"${quotes[0].context ? ` — ${quotes[0].context}.` : ''}`, [
        `More of ${p.name}'s words are collected in the Famous Quotes section of this profile, alongside the timeline, achievements and works that made the name.`,
        quotes[1] ? `Also widely quoted: "${quotes[1].text}"` : '',
        achLine(0),
      ]),
    });
  }
  return { directAnswer, faqs: faqs.filter((f) => f.a.trim().length > 0) };
}

export default async function PersonalityPage({ params }: PageProps) {
  const { slug } = await params;
  const p = await getPersonalityBySlug(slug);
  if (!p) notFound();

  // Batch 4 Item 2: AEO answer layer data (from this profile's own record).
  const { directAnswer: personalityDirectAnswer, faqs: personalityFaqs } = buildPersonalityAeo(p);
  const personalityAeoSource = `Profile facts: WorldCityHub personalities dataset${p.wikiUrl ? ' · Wikipedia article linked on this page' : ''} · Full timeline, works & quotes on this profile`;

  return (
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", position: "relative" }}>
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
