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

export default async function PersonalityPage({ params }: PageProps) {
  const { slug } = await params;
  const p = await getPersonalityBySlug(slug);
  if (!p) notFound();

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

        <PersonalityBreadcrumb name={p.name} birthYear={p.birthDate?.split(' ').pop()} />
      </div>
    </div>
  );
}
