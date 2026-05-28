import { useState, useEffect } from 'react';

interface CountdownRingProps {
  targetTime: string;
  name: string;
  color: string;
}

export default function CountdownRing({ targetTime, name, color }: CountdownRingProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const [h, m] = targetTime.split(':').map(Number);
      const target = new Date();
      target.setHours(h, m, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      const diff = target.getTime() - now.getTime();
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        total: diff,
      });
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [targetTime]);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, 1 - timeLeft.total / 86400000));
  const dash = circumference * progress;

  return (
    <div className="flex flex-col items-center">
      <svg width="90" height="90">
        <circle cx="45" cy="45" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform="rotate(-90 45 45)"
        />
        <text x="50%" y="45" textAnchor="middle" dominantBaseline="middle" className="text-xs font-bold fill-gray-800">
          {String(timeLeft.hours).padStart(2, '0')}
        </text>
        <text x="50%" y="58" textAnchor="middle" dominantBaseline="middle" className="text-[10px] fill-gray-500">
          {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </text>
      </svg>
      <p className="text-xs font-semibold mt-1 text-gray-700">{name}</p>
    </div>
  );
}
