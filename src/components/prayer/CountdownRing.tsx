'use client'
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTimeInMinutes, formatTime } from '../../lib/apis/prayer';

interface Prayer {
  name: string;
  time: string;
  arabicName?: string;
}

interface Props {
  prayers: Prayer[];
}

function secondsUntil(timeStr: string): number {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const nowSecs = now.getSeconds();
  const prayerMins = getTimeInMinutes(timeStr);
  let diffMins = prayerMins - nowMins;
  if (diffMins <= 0) diffMins += 1440;
  return diffMins * 60 - nowSecs;
}

function getNextPrayer(prayers: Prayer[]): Prayer | null {
  if (!prayers.length) return null;
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (const p of prayers) {
    if (getTimeInMinutes(p.time) > nowMins) return p;
  }
  return prayers[0];
}

export default function CountdownRing({ prayers }: Props) {
  const [next, setNext] = useState<Prayer | null>(null);
  const [secs, setSecs] = useState(0);
  const [pulse, setPulse] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const update = () => {
      const n = getNextPrayer(prayers);
      setNext(n);
      if (n) setSecs(secondsUntil(n.time));
    };
    update();
    intervalRef.current = setInterval(() => {
      update();
      setPulse((p) => !p);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [prayers]);

  const totalSecs = 6 * 3600;
  const pct = Math.min(1, secs / totalSecs);
  const radius = 90;
  const circ = 2 * Math.PI * radius;
  const dash = circ * (1 - pct);

  const hh = Math.floor(secs / 3600);
  const mm = Math.floor((secs % 3600) / 60);
  const ss = secs % 60;

  if (!next) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#d1fae5" strokeWidth="10" />
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#059669"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dash}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${hh}-${mm}-${ss}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center"
            >
              <span
                className={`text-3xl font-bold tabular-nums transition-colors duration-300 ${
                  pulse ? 'text-emerald-700' : 'text-emerald-800'
                }`}
              >
                {hh.toString().padStart(2, '0')}:{mm.toString().padStart(2, '0')}:{ss.toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-gray-500 mt-1">until</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800">{next.name}</p>
        {next.arabicName && <p className="text-lg text-emerald-600 font-semibold">{next.arabicName}</p>}
        <p className="text-gray-500 mt-1">at {formatTime(next.time)}</p>
      </div>
    </motion.div>
  );
}
