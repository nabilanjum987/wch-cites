'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

interface EmergencyData {
  police: string;
  ambulance: string;
  fire: string;
}

const DEFAULT_EMERGENCY: Record<string, EmergencyData> = {
  PK: { police: '15', ambulance: '1122', fire: '16' },
  IN: { police: '100', ambulance: '102', fire: '101' },
  US: { police: '911', ambulance: '911', fire: '911' },
  GB: { police: '999', ambulance: '999', fire: '999' },
  AE: { police: '999', ambulance: '998', fire: '997' },
  SA: { police: '112', ambulance: '112', fire: '112' },
};

const WOMEN_HELPLINES: Record<string, string> = {
  PK: '1091',
  IN: '1091',
};

const CHILD_HELPLINES: Record<string, string> = {
  PK: '1123',
  IN: '1098',
};

async function fetchEmergencyAPI(
  countryCode: string
): Promise<EmergencyData | null> {
  try {
    const response = await fetch(
      `https://emergencynumberapi.com/api/country/${countryCode}`
    );

    if (!response.ok) return null;
    const data = await response.json();

    return {
      police: data.data?.police?.all?.[0]?.number?.toString() || 'Unknown',
      ambulance: data.data?.ambulance?.all?.[0]?.number?.toString() || 'Unknown',
      fire: data.data?.fire?.all?.[0]?.number?.toString() || 'Unknown',
    };
  } catch {
    return null;
  }
}

function EmergencyButton({
  label,
  number,
  icon,
  bgColor,
}: {
  label: string;
  number: string;
  icon: string;
  bgColor: string;
}) {
  const handleCall = () => {
    window.location.href = `tel:${number}`;
  };

  return (
    <button
      onClick={handleCall}
      className={`relative overflow-hidden rounded-xl p-5 ${bgColor} text-white transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div className="text-left">
          <span className="text-3xl">{icon}</span>
          <p className="text-lg font-bold mt-2">{label}</p>
          <p className="text-2xl font-mono font-bold mt-1">{number}</p>
        </div>
        <div className="px-4 py-2 bg-white/30 rounded-full text-sm font-medium">
          Tap to Call
        </div>
      </div>
      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
    </button>
  );
}

export function EmergencyContacts({ city }: { city: City }) {
  const [emergency, setEmergency] = useState<EmergencyData | null>(null);
  const [women, setWomen] = useState<string | null>(null);
  const [child, setChild] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const fromAPI = await fetchEmergencyAPI(city.country_code);

      if (fromAPI) {
        setEmergency(fromAPI);
      } else {
        setEmergency(
          DEFAULT_EMERGENCY[city.country_code] || {
            police: 'Emergency',
            ambulance: 'Services',
            fire: 'Contact',
          }
        );
      }

      setWomen(WOMEN_HELPLINES[city.country_code] || null);
      setChild(CHILD_HELPLINES[city.country_code] || null);

      setLoading(false);
    }

    load();
  }, [city.country_code]);

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">🆘</span>
        Emergency Contacts
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <EmergencyButton
              label="Police"
              number={emergency?.police || '15'}
              icon="👮"
              bgColor="bg-gradient-to-br from-blue-600 to-blue-700"
            />
            <EmergencyButton
              label="Ambulance"
              number={emergency?.ambulance || '1122'}
              icon="🚑"
              bgColor="bg-gradient-to-br from-green-600 to-green-700"
            />
            <EmergencyButton
              label="Fire"
              number={emergency?.fire || '16'}
              icon="🚒"
              bgColor="bg-gradient-to-br from-red-600 to-red-700"
            />
          </div>

          {(women || child) && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 mt-6">
                Special Helplines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {women && (
                  <button
                    onClick={() => (window.location.href = `tel:${women}`)}
                    className="flex items-center gap-4 bg-purple-50 rounded-lg p-4 border border-purple-200 hover:bg-purple-100 transition-colors text-left"
                  >
                    <span className="text-3xl">👩</span>
                    <div className="flex-1">
                      <p className="font-medium text-purple-900">
                        Women's Helpline
                      </p>
                      <p className="text-lg font-mono font-bold text-purple-700">
                        {women}
                      </p>
                    </div>
                    <span className="text-purple-500">📞</span>
                  </button>
                )}
                {child && (
                  <button
                    onClick={() => (window.location.href = `tel:${child}`)}
                    className="flex items-center gap-4 bg-pink-50 rounded-lg p-4 border border-pink-200 hover:bg-pink-100 transition-colors text-left"
                  >
                    <span className="text-3xl">👶</span>
                    <div className="flex-1">
                      <p className="font-medium text-pink-900">
                        Child Helpline
                      </p>
                      <p className="text-lg font-mono font-bold text-pink-700">
                        {child}
                      </p>
                    </div>
                    <span className="text-pink-500">📞</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
