// Hub Q&A for /horoscope. ONE array, two consumers: HoroscopeIndexClient
// renders it visibly and src/app/horoscope/page.tsx emits it as FAQPage
// JSON-LD, so the visible text and the schema can never drift apart
// (the FaqBlock pattern used by the places template).
import type { AeoFaq } from '@/components/aeo/AnswerLayer';

export const HUB_FAQS: AeoFaq[] = [
  {
    q: "What is today's horoscope?",
    a: "Today's horoscope is a daily astrological reading for each of the twelve zodiac signs, covering love, career, finance, health and spirituality. On this page, choose your sign to open its daily reading, with star ratings, lucky number and colour, and compatibility for today. Readings are generated from computed planetary positions and are for entertainment only, not professional advice.",
  },
  {
    q: "How do I find my sign's horoscope today?",
    a: "Find your birth date range in the Choose Your Sign grid, then open that sign's page for its daily reading, weekly forecast and monthly outlook. The Daily tab shows today's star ratings, lucky elements and compatibility, while the Weekly tab covers the week ahead. If you are on a date boundary, check both neighbouring signs, since sign dates follow the traditional zodiac calendar.",
  },
  {
    q: 'Are horoscope readings accurate?',
    a: "Horoscope readings are entertainment, not measured predictions: they translate traditional astrological associations and today's computed planetary positions into guidance for the day. Treat strong or weak ratings as prompts for reflection, not as facts about what will happen. For decisions about health, money or relationships, rely on qualified professional advice rather than any horoscope page.",
  },
];

/** Visible method note shared by the hub's horoscope sections. */
export const HOROSCOPE_METHOD_NOTE =
  "How this is calculated: the planetary positions behind these readings are computed from Keplerian orbital elements using Schlyter's algorithm, and each reading is composed from those computed positions for the day. Horoscope readings are for entertainment only.";
