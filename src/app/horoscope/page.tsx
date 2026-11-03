import type { Metadata } from 'next';
import HoroscopeIndexClient from '@/components/horoscope/HoroscopeIndexClient';

export const metadata: Metadata = {
  title: 'Horoscope Today | All 12 Signs Daily | WorldCityHub',
  description: 'Horoscope today for all 12 zodiac signs: daily readings, moon phases, tarot card of the day, Chinese zodiac and numerology — free on WorldCityHub.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/horoscope' },
};

export default function HoroscopePage() {
  return <HoroscopeIndexClient />;
}
