'use client'
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Bell, BellOff } from 'lucide-react';

interface Reciter {
  id: string;
  label: string;
  city: string;
  url: string;
}

const RECITERS: Reciter[] = [
  {
    id: 'mecca',
    label: 'Mecca',
    city: 'Masjid al-Haram',
    url: 'https://download.mp3quran.net/azan/mecca.mp3',
  },
  {
    id: 'medina',
    label: 'Medina',
    city: 'Masjid al-Nabawi',
    url: 'https://download.mp3quran.net/azan/madina.mp3',
  },
  {
    id: 'aqsa',
    label: 'Al-Aqsa',
    city: 'Jerusalem',
    url: 'https://download.mp3quran.net/azan/aqsa.mp3',
  },
  {
    id: 'lahore',
    label: 'Lahore',
    city: 'Badshahi Mosque',
    url: 'https://download.mp3quran.net/azan/lahore.mp3',
  },
  {
    id: 'egypt',
    label: 'Egypt',
    city: 'Cairo',
    url: 'https://download.mp3quran.net/azan/egypt.mp3',
  },
];

interface Props {
  autoPlayEnabled: boolean;
  onToggleAutoPlay: (v: boolean) => void;
  accent?: string;
}

export default function AzanPlayer({ autoPlayEnabled, onToggleAutoPlay, accent = '#10b981' }: Props) {
  const [selected, setSelected] = useState<Reciter>(RECITERS[0]);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      setLoading(true);
      audioRef.current.src = selected.url;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setPlaying(true);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  };

  const handleSelect = (r: Reciter) => {
    if (audioRef.current && playing) {
      audioRef.current.pause();
      setPlaying(false);
    }
    setSelected(r);
  };

  const requestNotifPerm = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      onToggleAutoPlay(perm === 'granted');
    }
  };

  const handleAutoPlayToggle = () => {
    if (!autoPlayEnabled) {
      requestNotifPerm();
    } else {
      onToggleAutoPlay(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <audio ref={audioRef} onEnded={() => setPlaying(false)} />

      <div className="flex flex-wrap gap-2">
        {RECITERS.map((r) => {
          const isSel = selected.id === r.id;
          return (
            <button
              key={r.id}
              onClick={() => handleSelect(r)}
              className="px-3 py-2 rounded-xl text-sm font-medium transition-all border"
              style={
                isSel
                  ? { backgroundColor: accent, color: '#fff', borderColor: accent }
                  : { backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.1)' }
              }
            >
              <div className="font-semibold">{r.label}</div>
              <div className="text-xs opacity-75">
                {r.city}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 rounded-2xl p-4 border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <button
          onClick={handlePlay}
          disabled={loading}
          className="w-12 h-12 rounded-full text-white flex items-center justify-center transition-colors shadow-md disabled:opacity-50"
          style={{ backgroundColor: accent }}
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : playing ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <div className="flex-1">
          <p className="font-semibold text-white text-sm">{selected.label} Azan</p>
          <p className="text-xs text-white/45">{selected.city}</p>
          {playing && (
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
                  className="w-1 h-4 rounded-full origin-bottom"
                  style={{ backgroundColor: accent }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-white/40" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20"
            style={{ accentColor: accent }}
          />
        </div>
      </div>

      <div
        className="flex items-center justify-between rounded-xl px-4 py-3 border"
        style={{ backgroundColor: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)' }}
      >
        <div>
          <p className="text-sm font-semibold text-amber-300">Auto-play at Prayer Time</p>
          <p className="text-xs text-amber-400/70 mt-0.5">Requires browser notification permission</p>
        </div>
        <button
          onClick={handleAutoPlayToggle}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all border"
          style={
            autoPlayEnabled
              ? { backgroundColor: accent, color: '#fff', borderColor: accent }
              : { backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.1)' }
          }
        >
          {autoPlayEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          {autoPlayEnabled ? 'On' : 'Off'}
        </button>
      </div>
    </motion.div>
  );
}
