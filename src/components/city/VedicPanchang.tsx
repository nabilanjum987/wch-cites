import { motion } from 'framer-motion';
import { Sun, Moon, Clock, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { fetchVedicPanchang } from '../../lib/apis/astro';

interface Props {
  primaryColor: string;
}

export default function VedicPanchang({ primaryColor }: Props) {
  const data = fetchVedicPanchang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
    >
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Sparkles size={18} style={{ color: primaryColor }} />
        <h2 className="font-semibold text-gray-900 text-sm">Vedic Panchang Today</h2>
      </div>

      <div className="p-5">
        {/* Main Panchang Elements */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Tithi', value: data.tithi, icon: <Moon size={16} /> },
            { label: 'Nakshatra', value: data.nakshatra, icon: <Sparkles size={16} /> },
            { label: 'Yoga', value: data.yoga, icon: <Sun size={16} /> },
            { label: 'Karana', value: data.karana, icon: <Clock size={16} /> },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <span className="text-gray-400 flex justify-center mb-1">{item.icon}</span>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Auspicious & Inauspicious Times */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-green-50 rounded-xl p-3.5 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={14} className="text-green-600" />
              <p className="text-xs font-semibold text-green-700">Auspicious Times</p>
            </div>
            <ul className="space-y-1">
              {data.auspicious_times.map((t, i) => (
                <li key={i} className="text-xs text-green-900 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-green-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 rounded-xl p-3.5 border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={14} className="text-red-500" />
              <p className="text-xs font-semibold text-red-700">Inauspicious Times</p>
            </div>
            <ul className="space-y-1">
              {data.inauspicious_times.map((t, i) => (
                <li key={i} className="text-xs text-red-900 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-500" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Deity & Practice */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today's Deity</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{data.deity}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggested Practice</p>
              <p className="text-base font-semibold mt-1" style={{ color: primaryColor }}>{data.practice}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
