// ── Related Personalities (final28: template Section 10) ────────────────────
// PLAIN SERVER COMPONENT — no 'use client', no animation wrappers — so the
// section (and every link in it) is present in the raw server-rendered
// HTML, which is what the batch's server-render rule and SEO require.
// Returns null when there are no related profiles: the template omits
// the section entirely rather than rendering an empty shell.
//
// "See All" target: there is NO /personalities index page in this repo —
// the live /personalities URL is served by the [country] fallback route
// as a "Check back soon" country-profile shell, so linking there would
// be a link to a shell, which the Link Laws forbid. The honest live
// target is the profile's own city page, whose #personalities section
// lists that city's profiles (cityHref is passed in as
// `/{country}/{province}/{city}` and the anchor is appended here).
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { PersonalityProfile } from '@/lib/personalities';

interface RelatedPersonalitiesSectionProps {
  profiles: PersonalityProfile[];
  city: string;
  cityHref: string;
}

export function RelatedPersonalitiesSection({
  profiles,
  city,
  cityHref,
}: RelatedPersonalitiesSectionProps) {
  if (profiles.length === 0) return null;
  return (
    <section
      id="related-personalities"
      style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
      className="mt-10 p-4 rounded-2xl"
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="font-semibold text-gray-900 text-base">Related Personalities</h2>
        <Link
          href={`${cityHref}#personalities`}
          className="inline-flex items-center gap-1 text-sm font-medium hover:underline shrink-0"
        >
          See all personalities from {city} <ArrowRight size={14} />
        </Link>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {profiles.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/personalities/${p.slug}`}
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              className="block rounded-xl px-4 py-3 hover:opacity-80 transition"
            >
              <span className="block font-semibold text-gray-900 text-sm">{p.name}</span>
              <span className="block text-xs text-gray-500 mt-0.5">{p.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
