'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { fetchWikipediaData } from '@/src/lib/apis/wikipedia';
import {
  PersonalityHero,
  PersonalityDescription,
  LifeTimeline,
  AchievementsSection,
  FamousWorksSection,
  FamousQuotesSection,
  PersonalityBreadcrumb,
} from '@/src/components/personality';
import { ANIMATIONS } from '@/lib/design-system';

interface PersonalityData {
  name: string;
  title: string;
  birthDate?: string;
  deathDate?: string;
  nationality?: string;
  imageUrl?: string;
  description: string;
  biography: Array<{ title: string; content: string }>;
  timeline: Array<{ year: string; title: string; description: string }>;
  achievements: Array<{ icon: string; title: string; description: string }>;
  works: Array<{ title: string; year?: string; description: string; type?: string }>;
  quotes: Array<{ text: string; context?: string }>;
}

export default function PersonalityPage() {
  const params = useParams();
  const [personality, setPersonality] = useState<PersonalityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPersonality = async () => {
      try {
        const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
        if (!slug) {
          setError('Personality not found');
          setLoading(false);
          return;
        }

        const decodedName = decodeURIComponent(slug).replace(/-/g, ' ');
        const wikiData = await fetchWikipediaData(decodedName);

        if (!wikiData) {
          setError('Could not load personality data');
          setLoading(false);
          return;
        }

        const personalityData: PersonalityData = {
          name: wikiData.title,
          title: 'Notable Historical Figure',
          imageUrl: wikiData.thumbnail?.source,
          description: wikiData.extract || 'No description available',
          biography: [
            {
              title: 'Overview',
              content: wikiData.extract || 'Information about this personality',
            },
          ],
          timeline: [
            {
              year: 'Early Life',
              title: 'Beginning',
              description: 'Early years and formative experiences',
            },
            {
              year: 'Career',
              title: 'Rise to Prominence',
              description: 'Major career milestones and achievements',
            },
            {
              year: 'Legacy',
              title: 'Impact',
              description: 'Lasting contributions and influence',
            },
          ],
          achievements: [
            {
              icon: '🏆',
              title: 'Major Contributions',
              description: 'Significant impact in their field',
            },
            {
              icon: '📚',
              title: 'Knowledge Advancement',
              description: 'Contributions to learning and understanding',
            },
            {
              icon: '🌟',
              title: 'Legacy',
              description: 'Lasting influence on society',
            },
          ],
          works: [
            {
              title: 'Notable Work',
              description: 'Significant contribution to their field',
              type: 'Achievement',
            },
          ],
          quotes: [
            {
              text: 'A great mind in history',
              context: 'About this personality',
            },
          ],
        };

        setPersonality(personalityData);
      } catch (err) {
        setError('Error loading personality data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPersonality();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-12 w-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full"
        />
      </div>
    );
  }

  if (error || !personality) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-2xl font-bold mb-4">{error || 'Personality not found'}</p>
          <a href="/personalities" className="text-orange-400 hover:text-orange-300">
            Back to personalities
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <div className="w-full px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <PersonalityBreadcrumb name={personality.name} birthYear={personality.birthDate} />

            <PersonalityHero
              name={personality.name}
              title={personality.title}
              imageUrl={personality.imageUrl}
              birthDate={personality.birthDate}
              deathDate={personality.deathDate}
              nationality={personality.nationality}
              description={personality.description}
            />

            <PersonalityDescription sections={personality.biography} />

            <LifeTimeline events={personality.timeline} />

            <AchievementsSection achievements={personality.achievements} />

            <FamousWorksSection works={personality.works} />

            <FamousQuotesSection quotes={personality.quotes} />

            <motion.div
              variants={ANIMATIONS.scaleIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              className="mt-16 text-center"
            >
              <a
                href="/personalities"
                className="inline-block px-8 py-3 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-xl hover:bg-orange-500/30 transition-all"
              >
                View More Personalities
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
