'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchGrowthDashboardData, type GrowthDashboardData, type GrowthDataPoint } from '@/lib/apis/worldbank';

interface GrowthDashboardProps {
  countryCode: string; // ISO2, e.g. 'PK'
  accentColor?: string;
}

function formatCompact(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(0);
}

function GrowthChart({
  title,
  data,
  color,
  prefix = '',
}: {
  title: string;
  data: GrowthDataPoint[];
  color: string;
  prefix?: string;
}) {
  if (!data.length) {
    return (
      <div className="rounded-2xl border border-white/8 p-5">
        <h3 className="font-bold text-white mb-3">{title}</h3>
        <p className="text-sm text-gray-500">10-year trend data is temporarily unavailable.</p>
      </div>
    );
  }

  const latest = data[data.length - 1];
  const earliest = data[0];
  const pctChange =
    earliest.value && latest.value
      ? (((latest.value - earliest.value) / earliest.value) * 100).toFixed(1)
      : null;

  const gradId = `growthGrad-${title.replace(/\s+/g, '')}`;

  return (
    <div className="rounded-2xl border border-white/8 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-white">{title}</h3>
        {pctChange !== null && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {Number(pctChange) >= 0 ? '+' : ''}
            {pctChange}% over {data.length} yrs
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="year"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval={1}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v) => `${prefix}${formatCompact(v)}`}
          />
          <Tooltip
            contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb', fontSize: '12px' }}
            formatter={(v: number) => [`${prefix}${formatCompact(v)}`, title]}
          />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${gradId})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function GrowthDashboard({ countryCode, accentColor = '#10B981' }: GrowthDashboardProps) {
  const [data, setData] = useState<GrowthDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchGrowthDashboardData(countryCode).then((d) => {
      if (!cancelled) {
        setData(d);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [countryCode]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-white/8 p-5 h-[220px] animate-pulse bg-white/[0.02]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <GrowthChart title="GDP (10-year)" data={data?.gdp ?? []} color={accentColor} prefix="$" />
      <GrowthChart title="Population (10-year)" data={data?.population ?? []} color="#3b82f6" />
      <GrowthChart title="Exports (10-year)" data={data?.exports ?? []} color="#f59e0b" prefix="$" />
    </div>
  );
}
