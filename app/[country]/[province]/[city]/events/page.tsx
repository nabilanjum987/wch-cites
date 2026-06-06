'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple mock data for events
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'City Festival 2024',
        date: 'June 15, 2024',
        time: '10:00 AM',
        location: 'Central Park',
        category: 'Cultural',
        attendees: 5000,
      },
      {
        id: '2',
        title: 'Local Sports Tournament',
        date: 'June 20, 2024',
        time: '3:00 PM',
        location: 'Sports Complex',
        category: 'Sports',
        attendees: 1200,
      },
      {
        id: '3',
        title: 'Food & Culinary Festival',
        date: 'June 25, 2024',
        time: '5:00 PM',
        location: 'Downtown Area',
        category: 'Food',
        attendees: 3000,
      },
      {
        id: '4',
        title: 'Community Music Concert',
        date: 'July 5, 2024',
        time: '7:00 PM',
        location: 'Amphitheater',
        category: 'Music',
        attendees: 2500,
      },
    ];

    setEvents(mockEvents);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Upcoming Events
          </h1>
          <p className="text-slate-400 mb-8">
            Discover exciting events happening in your city
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg p-6 hover:border-cyan-400/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium">
                    {event.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Calendar size={18} className="text-cyan-400" />
                    <span>{event.date}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <Clock size={18} className="text-cyan-400" />
                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin size={18} className="text-cyan-400" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <Users size={18} className="text-cyan-400" />
                    <span>{event.attendees.toLocaleString()} attending</span>
                  </div>
                </div>

                <button className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300">
                  Learn More
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-semibold transition-all duration-300"
          >
            ? Back to City
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
