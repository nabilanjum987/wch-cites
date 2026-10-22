import type { Metadata } from 'next';
import HoroscopeIndexClient from '@/components/horoscope/HoroscopeIndexClient';

export const metadata: Metadata = {
  title: 'Daily Horoscope, Moon Calendar & Astrology | WorldCityHub',
  description: 'Daily horoscope for all 12 zodiac signs: moon phase calendar, sky right now, tarot card of the day, compatibility finder, birth chart and Vedic Panchang.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/horoscope' },
};

export default function HoroscopePage() {
  return <HoroscopeIndexClient />;
}
