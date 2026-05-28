import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface QiblaCompassProps {
  qiblaDirection: number;
}

export default function QiblaCompass({ qiblaDirection }: QiblaCompassProps) {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setHeading(e.alpha);
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  const rotation = (qiblaDirection - heading + 360) % 360;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 border-4 border-emerald-200">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="1" />
            <text x="50" y="12" textAnchor="middle" className="text-[8px] fill-gray-600">N</text>
            <text x="88" y="52" textAnchor="middle" className="text-[8px] fill-gray-600">E</text>
            <text x="50" y="92" textAnchor="middle" className="text-[8px] fill-gray-600">S</text>
            <text x="12" y="52" textAnchor="middle" className="text-[8px] fill-gray-600">W</text>
          </svg>
        </div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: rotation }}
        >
          <div className="w-1 h-16 bg-emerald-600 rounded-full relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-600 rounded-full" />
          </div>
        </motion.div>
      </div>
      <p className="text-sm text-gray-600 mt-3">{Math.round(qiblaDirection)} from North</p>
      <p className="text-xs text-gray-400">Rotate device to find Qibla</p>
    </div>
  );
}
