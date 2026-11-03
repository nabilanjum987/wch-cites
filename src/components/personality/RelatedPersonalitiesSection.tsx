// ── Related Personalities (final28: template Section 10) ────────────────────
// PLAIN SERVER COMPONENT — no 'use client', no animation wrappers — so the
// section (and every link in it) is present in the raw server-rendered
// HTML, which is what the batch's server-render rule and SEO require.
// Returns null when there are no related profiles: the template omits
// the section entirely rather than rendering an empty shell.
//
// "See All" target: the profile's own city page, whose #personalities
// section lists that city's profiles (cityHref is passed in as
// `/{country}/{province}/{city}` and the anchor is appended here). The
// /personalities hub (B1) indexes every profile, but the city listing
// is the closest relative of this section, so it stays the target.
//
// S2 + B4: the pool functions now fall through to the seed on an empty
// database result (previously an empty verified-rows response
// suppressed this section entirely), and each card carries the
// profile's photo where one exists, framed by the same measured
// 4/5 + per-slug object-position rule as the profile hero.
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  type PersonalityProfile,
  personalityImagePosition,
} from '@/lib/personalities';

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
        <h2 className="font-semibold text-white text-base">Related Personalities</h2>
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
              className="block rounded-xl overflow-hidden hover:opacity-80 transition"
            >
              {p.imageUrl && (
                <span className="block aspect-[4/5] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full object-cover ${personalityImagePosition(p.slug)}`}
                  />
                </span>
              )}
              <span className="block px-4 py-3">
                <span className="block font-semibold text-white text-sm">{p.name}</span>
                <span className="block text-xs text-gray-400 mt-0.5">{p.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
