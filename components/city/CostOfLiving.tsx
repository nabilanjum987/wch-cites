'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

interface CostScores {
  housing: number;
  food: number;
  transport: number;
  entertainment: number;
  total: number;
}

interface TeleportData {
  housing: number;
  costOfLiving: number;
  startups: number;
  commute: number;
  businessFreedom: number;
  safety: number;
  healthcare: number;
  education: number;
  environmentalQuality: number;
  economy: number;
  taxation: number;
  internetAccess: number;
  leisure: number;
  outdoors: number;
  travelConnectivity: number;
}

const DEFAULT_COSTS: Record<string, CostScores> = {
  lahore: { housing: 25, food: 20, transport: 30, entertainment: 35, total: 28 },
  karachi: { housing: 30, food: 22, transport: 28, entertainment: 32, total: 29 },
  islamabad: { housing: 35, food: 25, transport: 25, entertainment: 38, total: 32 },
};

const MONTHLY_BUDGETS: Record<string, { single: number; family: number }> = {
  lahore: { single: 45000, family: 120000 },
  karachi: { single: 50000, family: 140000 },
  islamabad: { single: 60000, family: 160000 },
};

async function fetchTeleportData(
  citySlug: string
): Promise<TeleportData | null> {
  try {
    const response = await fetch(
      `https://api.teleport.org/api/urban_areas/slug:${citySlug}/scores/`
    );

    if (!response.ok) return null;
    const data = await response.json();

    const findScore = (name: string): number => {
      const category = data.categories.find(
        (c: { name: string }) =>
          c.name.toLowerCase().includes(name.toLowerCase()) ||
          c.name.toLowerCase() === name.toLowerCase()
      );
      return category ? Math.round(category.score_out_of_10 * 10) : 0;
    };

    return {
      housing: findScore('housing'),
      costOfLiving: findScore('cost of living'),
      startups: findScore('startups'),
      commute: findScore('commute'),
      businessFreedom: findScore('business freedom'),
      safety: findScore('safety'),
      healthcare: findScore('healthcare'),
      education: findScore('education'),
      environmentalQuality: findScore('environmental quality'),
      economy: findScore('economy'),
      taxation: findScore('taxation'),
      internetAccess: findScore('internet access'),
      leisure: findScore('leisure'),
      outdoors: findScore('outdoors'),
      travelConnectivity: findScore('travel connectivity'),
    };
  } catch {
    return null;
  }
}

function CostBar({
  label,
  score,
  maxScore = 100,
  color = '#22c55e',
}: {
  label: string;
  score: number;
  maxScore?: number;
  color?: string;
}) {
  const percentage = Math.min((score / maxScore) * 100, 100);

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{score.toFixed(0)}%</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function CostOfLiving({ city }: { city: City }) {
  const [costData, setCostData] = useState<CostScores | null>(null);
  const [budgetData, setBudgetData] = useState<{
    single: number;
    family: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const teleportSlug = city.name.toLowerCase().replace(/\s+/g, '-');
      const data = await fetchTeleportData(teleportSlug);

      if (data) {
        setCostData({
          housing: data.housing || 30,
          food: data.costOfLiving || 25,
          transport: data.commute || 28,
          entertainment: data.leisure || 32,
          total: Math.round(
            ((data.housing || 30) +
              (data.costOfLiving || 25) +
              (data.commute || 28) +
              (data.leisure || 32)) /
              4
          ),
        });
      } else {
        const defaults =
          DEFAULT_COSTS[city.city_slug] || DEFAULT_COSTS[city.name.toLowerCase()] || {
            housing: 28,
            food: 25,
            transport: 26,
            entertainment: 30,
            total: 27,
          };
        setCostData(defaults);
      }

      setBudgetData(
        MONTHLY_BUDGETS[city.city_slug] ||
          MONTHLY_BUDGETS[city.name.toLowerCase()] || {
            single: 50000,
            family: 130000,
          }
      );

      setLoading(false);
    }

    load();
  }, [city.city_slug, city.name]);

  const currencyLabel = city.country_code === 'PK' ? 'PKR' : city.country_code === 'IN' ? 'INR' : 'USD';

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">💰</span>
        Cost of Living
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : costData ? (
        <>
          <div className="mb-6">
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-emerald-600">
                {costData.total}%
              </span>
              <span className="text-gray-500 text-sm mb-1">affordability index</span>
            </div>
            <p className="text-xs text-gray-500">
              Lower is better. Index compared to global average.
            </p>
          </div>

          <div className="mb-6">
            <CostBar
              label="Housing"
              score={costData.housing}
              color="#22c55e"
            />
            <CostBar
              label="Food & Groceries"
              score={costData.food}
              color="#3b82f6"
            />
            <CostBar
              label="Transport"
              score={costData.transport}
              color="#f59e0b"
            />
            <CostBar
              label="Entertainment"
              score={costData.entertainment}
              color="#ec4899"
            />
          </div>

          {budgetData && (
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
              <h3 className="text-sm font-semibold text-emerald-800 uppercase tracking-wider mb-3">
                Monthly Budget Estimate
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">👤</span>
                    <span className="text-sm text-gray-600">Single Person</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700">
                    {budgetData.single.toLocaleString()} {currencyLabel}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Rent + Food + Utils + Transport
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">👨‍👩‍👧‍👦</span>
                    <span className="text-sm text-gray-600">Family of 4</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700">
                    {budgetData.family.toLocaleString()} {currencyLabel}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Including education & healthcare
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <p className="text-3xl mb-2">📊</p>
          <p>Cost of living data not available</p>
        </div>
      )}
    </motion.div>
  );
}
