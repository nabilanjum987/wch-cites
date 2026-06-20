'use client';

import { useRouter, useParams } from 'next/navigation';
import type { ZodiacSign } from '@/types/horoscope';
import { ZODIAC_SIGNS } from '@/types/horoscope';
import SignDetailPage from '@/components/horoscope/SignDetailPage';
import CompatibilityFinder from '@/components/horoscope/CompatibilityFinder';
import BirthChartCalculator from '@/components/horoscope/BirthChartCalculator';
import Numerology from '@/components/horoscope/Numerology';
import Affiliates from '@/components/horoscope/Affiliates';
import MoonCalendar from '@/components/horoscope/MoonCalendar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import {
  generateSignOverviewParagraph, generateSignOverviewAfter,
  generateMoonParagraph, generateMoonAfter,
  generateCompatibilityParagraph, generateCompatibilityAfter,
  generateBirthChartParagraph, generateBirthChartAfter,
  generateNumerologyParagraph, generateNumerologyAfter,
} from '@/lib/paragraphs/horoscope-sign';

const SIGN_COLORS: Record<string, string> = {
  aries: '#FF4B4B', taurus: '#4CAF50', gemini: '#FFD700', cancer: '#4FC3F7',
  leo: '#FF9800', virgo: '#8BC34A', libra: '#E91E63', scorpio: '#9C27B0',
  sagittarius: '#FF5722', capricorn: '#607D8B', aquarius: '#00BCD4', pisces: '#3F51B5',
};

const VALID_SIGNS = ZODIAC_SIGNS.map(s => s.key);

export default function HoroscopeSignPage() {
  const router = useRouter();
  const params = useParams<{ sign: string }>();
  const signSlug = params?.sign ?? '';

  if (!VALID_SIGNS.includes(signSlug as ZodiacSign)) {
    notFound();
  }

  const sign = signSlug as ZodiacSign;
  const primaryColor = SIGN_COLORS[sign] ?? '#7c3aed';
  const signMeta = ZODIAC_SIGNS.find(s => s.key === sign)!;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link href="/horoscope" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition">
            <ArrowLeft size={14} /> All Signs
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-white font-medium capitalize">{sign}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        <p className="text-gray-300 leading-relaxed text-sm mt-6 mb-4">
          {generateSignOverviewParagraph(signMeta.name, signMeta.dates, signMeta.element, signMeta.ruling_planet)}
        </p>
        <SignDetailPage
          sign={sign}
          onBack={() => router.push('/horoscope')}
          primaryColor={primaryColor}
        />
        <p className="text-gray-400 leading-relaxed text-sm mt-4">
          {generateSignOverviewAfter(signMeta.name, signMeta.element)}
        </p>

        {/* Moon Calendar for this sign */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-white mb-4">Moon Calendar</h2>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">
            {generateMoonParagraph(signMeta.name)}
          </p>
          <MoonCalendar primaryColor={primaryColor} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">
            {generateMoonAfter(signMeta.name)}
          </p>
        </div>

        {/* Compatibility */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-white mb-4">Compatibility Finder</h2>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">
            {generateCompatibilityParagraph(signMeta.name, signMeta.element)}
          </p>
          <CompatibilityFinder primaryColor={primaryColor} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">
            {generateCompatibilityAfter(signMeta.name)}
          </p>
        </div>

        {/* Birth Chart */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-white mb-4">Birth Chart Calculator</h2>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">
            {generateBirthChartParagraph(signMeta.name)}
          </p>
          <BirthChartCalculator primaryColor={primaryColor} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">
            {generateBirthChartAfter(signMeta.name)}
          </p>
        </div>

        {/* Numerology */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-white mb-4">Numerology</h2>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">
            {generateNumerologyParagraph(signMeta.name)}
          </p>
          <Numerology primaryColor={primaryColor} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">
            {generateNumerologyAfter(signMeta.name)}
          </p>
        </div>

        {/* Affiliates */}
        <div className="mt-10">
          <Affiliates primaryColor={primaryColor} />
        </div>
      </div>
    </div>
  );
}
