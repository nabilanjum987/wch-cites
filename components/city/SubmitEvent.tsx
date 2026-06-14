import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitPendingEvent } from '../../lib/apis/events';
import type { PendingEvent } from '../../types/city';

interface Props {
  cityName: string;
  countryCode: string;
  primaryColor: string;
}

const CATEGORIES = [
  'sports', 'culture', 'music', 'literature', 'food',
  'religious', 'business', 'film', 'outdoor', 'family', 'conferences',
];

export default function SubmitEvent({ cityName, countryCode, primaryColor }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('culture');
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleSubmit = async () => {
    if (!name.trim() || !date.trim() || !venue.trim()) return;
    setSubmitting(true);
    setResult(null);
    const event: PendingEvent = {
      name: name.trim(),
      date: date.trim(),
      venue: venue.trim(),
      category,
      website: website.trim(),
      city: cityName,
      country_code: countryCode,
    };
    const res = await submitPendingEvent(event);
    setSubmitting(false);
    if (res.success) {
      setResult({ ok: true, msg: 'Event submitted for review!' });
      setName(''); setDate(''); setVenue(''); setCategory('culture'); setWebsite('');
    } else {
      setResult({ ok: false, msg: res.error ?? 'Submission failed' });
    }
  };

  return (
    <>
      {/* CTA button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className="w-full bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 p-5 flex items-center justify-center gap-3 text-gray-500 hover:border-gray-300 hover:text-gray-600 transition-colors mb-8"
      >
        <Plus size={20} style={{ color: primaryColor }} />
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-800">Submit Your Event</p>
          <p className="text-xs">List FREE on WorldCityHub</p>
        </div>
      </motion.button>

      {/* modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">Submit Your Event</h3>
                  <p className="text-xs text-gray-500 mt-0.5">List FREE on WorldCityHub — we'll review within 24h</p>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Event Name *</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Karachi Jazz Night"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-gray-300"
                    style={{ outlineColor: primaryColor }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Venue *</label>
                  <input
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. National Arena"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-gray-300"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Website</label>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-gray-300"
                  />
                </div>

                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl ${result.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                  >
                    {result.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {result.msg}
                  </motion.div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !name.trim() || !date.trim() || !venue.trim()}
                  className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send size={15} />
                  {submitting ? 'Submitting...' : 'Submit for Review'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
