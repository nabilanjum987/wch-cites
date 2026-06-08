'use client'
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MECCA_LAT = 21.4225;
const MECCA_LNG = 39.8262;

function calcQibla(lat: number, lng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const lat1 = toRad(lat);
  const lat2 = toRad(MECCA_LAT);
  const dLng = toRad(MECCA_LNG - lng);
  const y = Math.sin(dLng);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng);
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

interface Props {
  lat: number;
  lng: number;
  cityName: string;
}

export default function QiblaCompass({ lat, lng, cityName }: Props) {
  const [qibla, setQibla] = useState<number>(0);
  const [deviceAngle, setDeviceAngle] = useState<number | null>(null);
  const [permDenied, setPermDenied] = useState(false);

  useEffect(() => {
    setQibla(calcQibla(lat, lng));
  }, [lat, lng]);

  const requestDeviceOrientation = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
      // @ts-expect-error requestPermission is iOS-only
      typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        // @ts-expect-error requestPermission is iOS-only
        const perm = await DeviceOrientationEvent.requestPermission();
        if (perm !== 'granted') { setPermDenied(true); return; }
      } catch { setPermDenied(true); return; }
    }
    window.addEventListener('deviceorientationabsolute', (e: DeviceOrientationEvent) => {
      if (e.alpha != null) setDeviceAngle(e.alpha);
    });
    window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
      if (e.alpha != null) setDeviceAngle(e.alpha);
    });
  };

  const arrowAngle = deviceAngle != null ? (qibla - deviceAngle + 360) % 360 : qibla;

  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);
  const cardinals = ['N', 'E', 'S', 'W'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-4"
    >
      <div className="relative w-64 h-64">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#f0fdf4" stroke="#d1fae5" strokeWidth="2" />
          <circle cx="100" cy="100" r="85" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
          {ticks.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const isMain = deg % 90 === 0;
            const isMed = deg % 45 === 0;
            const r1 = isMain ? 70 : isMed ? 72 : 74;
            const r2 = 80;
            return (
              <line
                key={deg}
                x1={100 + r1 * Math.sin(rad)}
                y1={100 - r1 * Math.cos(rad)}
                x2={100 + r2 * Math.sin(rad)}
                y2={100 - r2 * Math.cos(rad)}
                stroke={isMain ? '#6b7280' : '#d1d5db'}
                strokeWidth={isMain ? 2 : isMed ? 1.5 : 1}
              />
            );
          })}
          {cardinals.map((c, i) => {
            const rad = (i * 90 * Math.PI) / 180;
            const r = 62;
            return (
              <text
                key={c}
                x={100 + r * Math.sin(rad)}
                y={100 - r * Math.cos(rad) + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill={c === 'N' ? '#dc2626' : '#374151'}
              >
                {c}
              </text>
            );
          })}
          <g transform={`rotate(${arrowAngle}, 100, 100)`}>
            <motion.polygon
              points="100,20 94,100 100,110 106,100"
              fill="#059669"
              opacity="0.9"
              animate={{ rotate: arrowAngle }}
            />
            <polygon points="100,180 94,100 100,90 106,100" fill="#6b7280" opacity="0.5" />
            <circle cx="100" cy="100" r="6" fill="white" stroke="#059669" strokeWidth="2" />
          </g>
          <text x="100" y="155" textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="600">
            Qibla
          </text>
          <text x="100" y="165" textAnchor="middle" fontSize="8" fill="#059669" fontWeight="700">
            {qibla.toFixed(1)}°
          </text>
        </svg>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Qibla direction from <span className="font-semibold text-gray-800">{cityName}</span>
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{qibla.toFixed(2)}° from North</p>
      </div>

      {deviceAngle === null && !permDenied && (
        <button
          onClick={requestDeviceOrientation}
          className="text-xs bg-emerald-600 text-white px-4 py-1.5 rounded-full hover:bg-emerald-700 transition-colors"
        >
          Use Live Compass
        </button>
      )}
      {permDenied && (
        <p className="text-xs text-red-500">Compass permission denied</p>
      )}
      {deviceAngle !== null && (
        <p className="text-xs text-emerald-600 font-semibold">Live compass active</p>
      )}
    </motion.div>
  );
}
