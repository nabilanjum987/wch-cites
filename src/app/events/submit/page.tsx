import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CalendarPlus } from 'lucide-react';
import EventSubmissionForm from '@/components/events/EventSubmissionForm';

export const metadata: Metadata = {
  title: 'List Your Event — Submit an Event | WorldCityHub',
  description:
    'Organising an event in Pakistan? Submit it to WorldCityHub for free. Every submission is verified by a person before it is listed on the city events page.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/events/submit' },
};

export default function ListYourEventPage() {
  return (
    <div style={{ backgroundColor: '#0a0f1e', minHeight: '100vh' }} className="px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm mb-6 transition">
          <ArrowLeft size={14} /> Back to homepage
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <CalendarPlus size={28} className="text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">List Your Event</h1>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          No international platform covers Pakistan&apos;s events properly — so we are building the
          calendar ourselves. If you are organising a concert, match, festival, expo, conference or
          community gathering, tell us about it here. Listing is free; a person verifies every
          submission before it appears on the city&apos;s events page.
        </p>
        <EventSubmissionForm />
      </div>
    </div>
  );
}
