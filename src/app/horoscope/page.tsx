import type { Metadata } from 'next';
import HoroscopeIndexClient from '@/components/horoscope/HoroscopeIndexClient';

export const metadata: Metadata = {
  title: 'Daily Horoscope, Moon Calendar & Astrology | WorldCityHub',
  description: 'Daily horoscope for all 12 zodiac signs: Chinese zodiac, life-path numerology, moon phases, tarot card of the day and sky right now.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/horoscope' },
};

export default function HoroscopePage() {
  return <HoroscopeIndexClient />;
}
