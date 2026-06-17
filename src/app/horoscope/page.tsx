import type { Metadata } from 'next';
import HoroscopeIndexClient from '@/components/horoscope/HoroscopeIndexClient';

export const metadata: Metadata = {
  title: 'Daily Horoscope, Moon Calendar & Astrology | WorldCityHub',
  description: 'Daily horoscope for all 12 zodiac signs. Moon phase calendar, sky right now, tarot card of the day, compatibility finder, birth chart calculator and Vedic Panchang.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/horoscope' },
};

export default function HoroscopePage() {
  return <HoroscopeIndexClient />;
}
