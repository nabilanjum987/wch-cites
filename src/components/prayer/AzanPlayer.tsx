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
}

export default function AzanPlayer({ autoPlayEnabled, onToggleAutoPlay }: Props) {
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
        {RECITERS.map((r) => (
          <button
            key={r.id}
            onClick={() => handleSelect(r)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
              selected.id === r.id
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'
            }`}
          >
            <div className="font-semibold">{r.label}</div>
            <div className={`text-xs ${selected.id === r.id ? 'text-emerald-100' : 'text-gray-400'}`}>
              {r.city}
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
        <button
          onClick={handlePlay}
          disabled={loading}
          className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50"
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
          <p className="font-semibold text-gray-800 text-sm">{selected.label} Azan</p>
          <p className="text-xs text-gray-500">{selected.city}</p>
          {playing && (
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
                  className="w-1 h-4 bg-emerald-500 rounded-full origin-bottom"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 accent-emerald-600"
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-amber-800">Auto-play at Prayer Time</p>
          <p className="text-xs text-amber-600 mt-0.5">Requires browser notification permission</p>
        </div>
        <button
          onClick={handleAutoPlayToggle}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            autoPlayEnabled
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-400'
          }`}
        >
          {autoPlayEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          {autoPlayEnabled ? 'On' : 'Off'}
        </button>
      </div>
    </motion.div>
  );
}
