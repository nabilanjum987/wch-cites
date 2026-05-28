'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, DollarSign, PieChart, Briefcase, Users, Globe, AlertTriangle, ArrowUpRight, ExternalLink } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts';
import { useState, useEffect } from 'react';

interface EconomicData {
  gdp: {
    total: number;
    perCapita: number;
    perDayPerPerson: number;
    growth: number;
    bySector: { sector: string; value: number; percentage: number }[];
    tenYearGrowth: { year: string; value: number }[];
    projection: { year: string; value: number }[];
  };
  inflation: {
    current: number;
    oneYearAgo: number;
    byCategory: { category: string; rate: number }[];
    purchasingPower: {
      today1000: number;
      monthlyImpact: number;
    };
  };
  employment: {
    unemploymentRate: number;
    youthUnemployment: number;
    femaleUnemployment: number;
    laborForce: number;
    wagesBySector: { sector: string; avgWage: number; growth: number; employment: number }[];
    fastestGrowingJobs: { job: string; growth: number; avgSalary: number }[];
    atRiskJobs: { job: string; risk: string; decline: number }[];
    minimumWage: { current: number; previous: number; effectiveDate: string };
  };
  healthScore: {
    current: number;
    oneYearAgo: number;
    trend: 'improving' | 'declining' | 'stable';
    status: string;
    meaning: string;
  };
  trade: {
    exports: { total: number; categories: { category: string; value: number; percentage: number }[] };
    imports: { total: number; categories: { category: string; value: number; percentage: number }[] };
    balance: number;
    topPartners: { country: string; exports: number; imports: number }[];
    remittances: { total: number; sources: { country: string; amount: number }[] };
  };
  debt: {
    debtToGdp: number;
    total: number;
    perCitizen: number;
    imfStatus: string;
    imfProgram: { active: boolean; amount: number; disbursed: number; remaining: number };
    peerComparison: { country: string; debtToGdp: number }[];
  };
  tenYearDashboard: {
    gdp: { year: string; value: number }[];
    population: { year: string; value: number }[];
    inflation: { year: string; value: number }[];
    stockMarket: { year: string; value: number }[];
  };
}

const COLORS = ['#01411C', '#FF9933', '#00732F', '#006C35', '#E30A17', '#012169', '#B22234', '#002395', '#BC002D'];

const mockEconomicData: EconomicData = {
  healthScore: {
    current: 65,
    oneYearAgo: 58,
    trend: 'improving',
    status: 'RECOVERING',
    meaning: 'The economy is showing positive signs of recovery with improved GDP growth, controlled inflation, and stable employment rates. Current structural reforms and foreign investments are contributing to economic stability, though debt levels remain a concern that needs careful monitoring.'
  },
  gdp: {
    total: 376493000000,
    perCapita: 1675,
    perDayPerPerson: 4.58,
    growth: 3.2,
    bySector: [
      { sector: 'Agriculture', value: 75299, percentage: 20 },
      { sector: 'Industry', value: 90358, percentage: 24 },
      { sector: 'Services', value: 150597, percentage: 40 },
      { sector: 'Construction', value: 30119, percentage: 8 },
      { sector: 'IT & Tech', value: 18825, percentage: 5 },
      { sector: 'Other', value: 11295, percentage: 3 },
    ],
    tenYearGrowth: [
      { year: '2014', value: 250 },
      { year: '2015', value: 270 },
      { year: '2016', value: 285 },
      { year: '2017', value: 305 },
      { year: '2018', value: 318 },
      { year: '2019', value: 320 },
      { year: '2020', value: 280 },
      { year: '2021', value: 315 },
      { year: '2022', value: 341 },
      { year: '2023', value: 350 },
      { year: '2024', value: 376 },
    ],
    projection: [
      { year: '2024', value: 376 },
      { year: '2025', value: 394 },
      { year: '2026', value: 414 },
      { year: '2027', value: 435 },
      { year: '2028', value: 458 },
      { year: '2029', value: 483 },
      { year: '2030', value: 509 },
      { year: '2035', value: 650 },
      { year: '2040', value: 850 },
    ]
  },
  inflation: {
    current: 24.5,
    oneYearAgo: 29.3,
    byCategory: [
      { category: 'Food', rate: 28.5 },
      { category: 'Housing', rate: 22.3 },
      { category: 'Transport', rate: 31.2 },
      { category: 'Healthcare', rate: 18.7 },
      { category: 'Education', rate: 15.4 },
      { category: 'Utilities', rate: 26.8 },
    ],
    purchasingPower: {
      today1000: 803,
      monthlyImpact: 12250
    }
  },
  employment: {
    unemploymentRate: 6.5,
    youthUnemployment: 11.2,
    femaleUnemployment: 8.9,
    laborForce: 73500000,
    minimumWage: {
      current: 32000,
      previous: 25000,
      effectiveDate: 'July 1, 2024'
    },
    wagesBySector: [
      { sector: 'IT & Software', avgWage: 125000, growth: 15.2, employment: 450000 },
      { sector: 'Banking & Finance', avgWage: 95000, growth: 8.5, employment: 620000 },
      { sector: 'Manufacturing', avgWage: 45000, growth: 5.2, employment: 8500000 },
      { sector: 'Agriculture', avgWage: 28000, growth: 3.8, employment: 25000000 },
      { sector: 'Construction', avgWage: 35000, growth: 6.1, employment: 5200000 },
      { sector: 'Healthcare', avgWage: 75000, growth: 12.3, employment: 890000 },
      { sector: 'Education', avgWage: 55000, growth: 4.5, employment: 2100000 },
      { sector: 'Retail', avgWage: 32000, growth: 2.9, employment: 4500000 },
    ],
    fastestGrowingJobs: [
      { job: 'Data Scientist', growth: 45, avgSalary: 180000 },
      { job: 'Cybersecurity Analyst', growth: 38, avgSalary: 145000 },
      { job: 'E-commerce Manager', growth: 32, avgSalary: 95000 },
      { job: 'Renewable Energy Engineer', growth: 28, avgSalary: 120000 },
      { job: 'Digital Marketing Specialist', growth: 25, avgSalary: 85000 },
    ],
    atRiskJobs: [
      { job: 'Retail Cashier', risk: 'High - Automation Risk', decline: 35 },
      { job: 'Data Entry Clerk', risk: 'High - AI Displacement', decline: 42 },
      { job: 'Factory Assembly Worker', risk: 'Medium - Robotics', decline: 28 },
      { job: 'Bank Teller', risk: 'High - Digital Banking', decline: 38 },
      { job: 'Travel Agent', risk: 'High - Online Platforms', decline: 45 },
    ]
  },
  trade: {
    exports: {
      total: 28000000000,
      categories: [
        { category: 'Textiles', value: 14000, percentage: 50 },
        { category: 'Rice', value: 2800, percentage: 10 },
        { category: 'Leather', value: 1960, percentage: 7 },
        { category: 'Sports Goods', value: 1260, percentage: 4.5 },
        { category: 'Medical Instruments', value: 1100, percentage: 3.9 },
      ]
    },
    imports: {
      total: 55000000000,
      categories: [
        { category: 'Petroleum', value: 16500, percentage: 30 },
        { category: 'Machinery', value: 9350, percentage: 17 },
        { category: 'Chemicals', value: 5500, percentage: 10 },
        { category: 'Electronics', value: 4125, percentage: 7.5 },
        { category: 'Vehicles', value: 3300, percentage: 6 },
      ]
    },
    balance: -27000000000,
    topPartners: [
      { country: 'China', exports: 2150, imports: 15200 },
      { country: 'USA', exports: 5600, imports: 2100 },
      { country: 'UAE', exports: 1200, imports: 8500 },
      { country: 'Saudi Arabia', exports: 800, imports: 5200 },
      { country: 'Germany', exports: 1450, imports: 3100 },
    ],
    remittances: {
      total: 30000000000,
      sources: [
        { country: 'Saudi Arabia', amount: 7500 },
        { country: 'UAE', amount: 5800 },
        { country: 'USA', amount: 3200 },
        { country: 'UK', amount: 2800 },
        { country: 'Qatar', amount: 1900 },
      ]
    }
  },
  debt: {
    debtToGdp: 78.5,
    total: 295500000000,
    perCitizen: 1307,
    imfStatus: 'Active Program - Stand-By Arrangement',
    imfProgram: {
      active: true,
      amount: 6000000000,
      disbursed: 2400000000,
      remaining: 3600000000
    },
    peerComparison: [
      { country: 'Pakistan', debtToGdp: 78.5 },
      { country: 'India', debtToGdp: 83.4 },
      { country: 'Bangladesh', debtToGdp: 37.6 },
      { country: 'Sri Lanka', debtToGdp: 119.1 },
      { country: 'Indonesia', debtToGdp: 39.2 },
    ]
  },
  tenYearDashboard: {
    gdp: [
      { year: '2014', value: 250 },
      { year: '2015', value: 270 },
      { year: '2016', value: 285 },
      { year: '2017', value: 305 },
      { year: '2018', value: 318 },
      { year: '2019', value: 320 },
      { year: '2020', value: 280 },
      { year: '2021', value: 315 },
      { year: '2022', value: 341 },
      { year: '2023', value: 350 },
      { year: '2024', value: 376 },
    ],
    population: [
      { year: '2014', value: 185 },
      { year: '2015', value: 189 },
      { year: '2016', value: 193 },
      { year: '2017', value: 197 },
      { year: '2018', value: 201 },
      { year: '2019', value: 205 },
      { year: '2020', value: 209 },
      { year: '2021', value: 213 },
      { year: '2022', value: 217 },
      { year: '2023', value: 221 },
      { year: '2024', value: 225 },
    ],
    inflation: [
      { year: '2014', value: 8.6 },
      { year: '2015', value: 4.5 },
      { year: '2016', value: 3.8 },
      { year: '2017', value: 4.1 },
      { year: '2018', value: 5.1 },
      { year: '2019', value: 10.6 },
      { year: '2020', value: 9.2 },
      { year: '2021', value: 10.9 },
      { year: '2022', value: 25.1 },
      { year: '2023', value: 29.3 },
      { year: '2024', value: 24.5 },
    ],
    stockMarket: [
      { year: '2014', value: 35000 },
      { year: '2015', value: 34000 },
      { year: '2016', value: 47000 },
      { year: '2017', value: 53000 },
      { year: '2018', value: 40000 },
      { year: '2019', value: 34000 },
      { year: '2020', value: 42000 },
      { year: '2021', value: 47000 },
      { year: '2022', value: 42000 },
      { year: '2023', value: 52000 },
      { year: '2024', value: 75000 },
    ]
  }
};

export default function EconomyPage() {
  const params = useParams();
  const country = params.country as string;
  const province = params.province as string;
  const city = params.city as string;

  const [data, setData] = useState<EconomicData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(mockEconomicData);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">No data available</div>;
  }

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const getTrendIcon = () => {
    if (data.healthScore.trend === 'improving') return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (data.healthScore.trend === 'declining') return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="text-sm breadcrumbs mb-2">
            <span className="text-gray-500">{country.charAt(0).toUpperCase() + country.slice(1)}</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-500">{province.charAt(0).toUpperCase() + province.slice(1)}</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700 font-medium">{city.charAt(0).toUpperCase() + city.slice(1)}</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Economy</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {city.charAt(0).toUpperCase() + city.slice(1)} Economy Dashboard
          </h1>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Economic Health Score - Speedometer */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Economic Health Score</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex justify-center">
              <div className="relative w-64 h-32 md:w-80 md:h-40">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#DC2626" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                    <linearGradient id="gradient-yellow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>

                  <path d="M 20 95 A 80 80 0 0 1 180 95" fill="none" stroke="#FEE2E2" strokeWidth="16" strokeLinecap="round" />
                  <path d="M 20 95 A 80 80 0 0 1 180 95" fill="none" stroke="url(#gradient-green)" strokeWidth="16" strokeLinecap="round" />

                  <motion.path
                    d="M 20 95 A 80 80 0 0 1 180 95"
                    fill="none"
                    stroke="#01411C"
                    strokeWidth="16"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: data.healthScore.current / 100 }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />

                  <motion.g
                    initial={{ rotate: -90 }}
                    animate={{ rotate: -90 + (data.healthScore.current * 1.8) }}
                    transition={{ duration: 2, delay: 0.3, type: 'spring' }}
                    style={{ transformOrigin: '100px 95px' }}
                  >
                    <line x1="100" y1="95" x2="100" y2="35" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="100" cy="95" r="8" fill="#1F2937" />
                  </motion.g>
                </svg>

                <motion.div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2, type: 'spring' }}
                >
                  <div className="text-4xl md:text-5xl font-bold text-gray-900">
                    {data.healthScore.current}
                  </div>
                  <div className="text-sm text-gray-500">out of 100</div>
                </motion.div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Current Score</div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{data.healthScore.current}</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon()}
                    <span className={`text-sm font-medium ${data.healthScore.trend === 'improving' ? 'text-green-600' : data.healthScore.trend === 'declining' ? 'text-red-600' : 'text-gray-600'}`}>
                      {data.healthScore.trend}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">1 Year Ago</div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-500">{data.healthScore.oneYearAgo}</span>
                  <span className="text-sm font-medium text-green-600">
                    +{data.healthScore.current - data.healthScore.oneYearAgo} pts
                  </span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-green-700">{city.charAt(0).toUpperCase() + city.slice(1)} is</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-green-600">{data.healthScore.status}</span>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              What This Means
            </h3>
            <p className="text-blue-800 leading-relaxed">{data.healthScore.meaning}</p>
          </div>
        </motion.section>

        {/* GDP Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Gross Domestic Product (GDP)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
              <div className="text-sm text-gray-600 mb-1">Total GDP</div>
              <div className="text-2xl font-bold text-gray-900">${formatNumber(data.gdp.total)}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <div className="text-sm text-gray-600 mb-1">GDP Per Capita</div>
              <div className="text-2xl font-bold text-gray-900">${data.gdp.perCapita.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
              <div className="text-sm text-gray-600 mb-1">Per Day Per Person</div>
              <div className="text-2xl font-bold text-gray-900">${data.gdp.perDayPerPerson}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
              <div className="text-sm text-gray-600 mb-1">Growth Rate</div>
              <div className="text-2xl font-bold text-green-600">+{data.gdp.growth}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                GDP by Sector
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={data.gdp.bySector}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    nameKey="sector"
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    dataKey="percentage"
                  >
                    {data.gdp.bySector.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4">10-Year GDP Growth (USD Billions)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.gdp.tenYearGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#01411C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-gray-800 mb-4">GDP Projection to 2040 (USD Billions)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.gdp.projection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="value" stroke="#01411C" strokeWidth={3} dot={{ fill: '#01411C', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Inflation & Purchasing Power */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Inflation & Purchasing Power</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="text-sm text-gray-600 mb-1">Current Inflation</div>
              <div className="text-3xl font-bold text-red-600">{data.inflation.current}%</div>
              <div className="text-sm text-gray-600 mt-2">vs {data.inflation.oneYearAgo}% last year</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="text-sm text-gray-600 mb-2">What PKR 1,000 Today Equals</div>
              <div className="text-2xl font-bold text-amber-700">PKR {data.inflation.purchasingPower.today1000}</div>
              <div className="text-sm text-gray-600 mt-1">from one year ago</div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
              <div className="text-sm text-gray-600 mb-2">Monthly Household Impact</div>
              <div className="text-2xl font-bold text-orange-700">+PKR {formatNumber(data.inflation.purchasingPower.monthlyImpact)}</div>
              <div className="text-sm text-gray-600 mt-1">Family spending PKR 50K → needs PKR {formatNumber(50000 + data.inflation.purchasingPower.monthlyImpact)}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Inflation by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {data.inflation.byCategory.map((item, index) => (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="bg-gray-50 rounded-lg p-4 text-center"
                >
                  <div className="text-sm text-gray-600 mb-2">{item.category}</div>
                  <div className="text-xl font-bold text-red-600">{item.rate}%</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Wages & Employment */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Wages & Employment
          </h2>

          {/* Employment Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Unemployment</div>
              <div className="text-xl font-bold text-gray-900">{data.employment.unemploymentRate}%</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
              <div className="text-xs text-gray-600 mb-1">Youth</div>
              <div className="text-xl font-bold text-orange-600">{data.employment.youthUnemployment}%</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="text-xs text-gray-600 mb-1">Female</div>
              <div className="text-xl font-bold text-blue-600">{data.employment.femaleUnemployment}%</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <div className="text-xs text-gray-600 mb-1">Labor Force</div>
              <div className="text-xl font-bold text-green-600">{formatNumber(data.employment.laborForce)}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 col-span-2">
              <div className="text-xs text-gray-600 mb-1">Minimum Wage (Effective {data.employment.minimumWage.effectiveDate})</div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-emerald-600">PKR {formatNumber(data.employment.minimumWage.current)}</span>
                <span className="text-sm text-green-600">+{Math.round(((data.employment.minimumWage.current - data.employment.minimumWage.previous) / data.employment.minimumWage.previous) * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Average Wages by Sector - Table */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Average Wages by Sector</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Sector</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Monthly Wage</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">YoY Growth</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Employment</th>
                  </tr>
                </thead>
                <tbody>
                  {data.employment.wagesBySector.map((item) => (
                    <tr key={item.sector} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">{item.sector}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">PKR {formatNumber(item.avgWage)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${item.growth >= 5 ? 'text-green-600' : 'text-gray-600'}`}>
                          +{item.growth}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">{formatNumber(item.employment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Job Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fastest Growing Jobs */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-green-600" />
                Fastest Growing Jobs
              </h3>
              <div className="space-y-3">
                {data.employment.fastestGrowingJobs.map((job, index) => (
                  <motion.div
                    key={job.job}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{job.job}</div>
                      <div className="text-sm text-gray-600">Avg Salary: PKR {formatNumber(job.avgSalary)}</div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">+{job.growth}%</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Jobs at Risk */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Jobs at Risk
              </h3>
              <div className="space-y-3">
                {data.employment.atRiskJobs.map((job, index) => (
                  <motion.div
                    key={job.job}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold text-gray-900">{job.job}</div>
                      <div className="text-xl font-bold text-red-600">-{job.decline}%</div>
                    </div>
                    <div className="text-sm text-gray-600">{job.risk}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Trade Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-600" />
            International Trade
          </h2>

          {/* Trade Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
              <div className="text-sm text-gray-600 mb-1">Total Exports</div>
              <div className="text-3xl font-bold text-green-600">{formatCurrency(data.trade.exports.total)}</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-100">
              <div className="text-sm text-gray-600 mb-1">Total Imports</div>
              <div className="text-3xl font-bold text-red-600">{formatCurrency(data.trade.imports.total)}</div>
            </div>
            <div className={`bg-gradient-to-br rounded-xl p-5 border ${data.trade.balance < 0 ? 'from-red-50 to-orange-50 border-red-100' : 'from-green-50 to-emerald-50 border-green-100'}`}>
              <div className="text-sm text-gray-600 mb-1">Trade Balance</div>
              <div className={`text-3xl font-bold ${data.trade.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {data.trade.balance < 0 ? '' : '+'}{formatCurrency(data.trade.balance)}
              </div>
              <div className="text-sm text-gray-600 mt-1">{data.trade.balance < 0 ? 'Deficit' : 'Surplus'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Exports by Category */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Top Export Categories</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RechartsPie>
                  <Pie
                    data={data.trade.exports.categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    nameKey="category"
                    label={({ name, value }) => `${name}: $${value}M`}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {data.trade.exports.categories.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`$${value}M`, 'Exports']} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>

            {/* Imports by Category */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Top Import Categories</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RechartsPie>
                  <Pie
                    data={data.trade.imports.categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    nameKey="category"
                    label={({ name, value }) => `${name}: $${value}M`}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {data.trade.imports.categories.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`$${value}M`, 'Imports']} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Trading Partners */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Top Trading Partners (USD Millions)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Exports</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Imports</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Trade Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.trade.topPartners.map((partner) => {
                    const balance = partner.exports - partner.imports;
                    return (
                      <tr key={partner.country} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{partner.country}</td>
                        <td className="py-3 px-4 text-right text-green-600 font-semibold">${partner.exports}M</td>
                        <td className="py-3 px-4 text-right text-red-600 font-semibold">${partner.imports}M</td>
                        <td className={`py-3 px-4 text-right font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {balance >= 0 ? '+' : ''}{balance}M
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remittances */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Remittances: {formatCurrency(data.trade.remittances.total)}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {data.trade.remittances.sources.map((source, index) => (
                <motion.div
                  key={source.country}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100"
                >
                  <div className="text-sm text-gray-600 mb-1">{source.country}</div>
                  <div className="text-lg font-bold text-blue-600">${source.amount}M</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Debt Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">National Debt Status</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-100">
              <div className="text-sm text-gray-600 mb-1">Total Debt</div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(data.debt.total)}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100">
              <div className="text-sm text-gray-600 mb-1">Debt/GDP Ratio</div>
              <div className="text-2xl font-bold text-orange-600">{data.debt.debtToGdp}%</div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Debt Per Citizen</div>
              <div className="text-2xl font-bold text-gray-900">${data.debt.perCitizen.toLocaleString()}</div>
            </div>
          </div>

          {/* IMF Program */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              IMF Program Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-blue-700 mb-1">Status</div>
                <div className="font-bold text-blue-900">{data.debt.imfStatus}</div>
              </div>
              <div>
                <div className="text-sm text-blue-700 mb-1">Total Package</div>
                <div className="font-bold text-blue-900">{formatCurrency(data.debt.imfProgram.amount)}</div>
              </div>
              <div>
                <div className="text-sm text-blue-700 mb-1">Disbursed</div>
                <div className="font-bold text-green-600">{formatCurrency(data.debt.imfProgram.disbursed)}</div>
              </div>
              <div>
                <div className="text-sm text-blue-700 mb-1">Remaining</div>
                <div className="font-bold text-orange-600">{formatCurrency(data.debt.imfProgram.remaining)}</div>
              </div>
            </div>
          </div>

          {/* Peer Comparison */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Debt/GDP Ratio: Peer Country Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.debt.peerComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 'dataMax']} />
                <YAxis dataKey="country" type="category" width={100} />
                <RechartsTooltip />
                <Bar dataKey="debtToGdp" radius={[0, 4, 4, 0]}>
                  {data.debt.peerComparison.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.country === 'Pakistan' ? '#01411C' : '#94A3B8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* 10-Year Dashboard */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">10-Year Economic Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GDP Trend */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
              <h3 className="font-semibold text-gray-800 mb-4">GDP (USD Billions)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.tenYearDashboard.gdp}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="value" stroke="#01411C" fill="#01411C" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Population Trend */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <h3 className="font-semibold text-gray-800 mb-4">Population (Millions)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.tenYearDashboard.population}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="value" stroke="#2563EB" fill="#2563EB" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Inflation Trend */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 border border-red-100">
              <h3 className="font-semibold text-gray-800 mb-4">Inflation Rate (%)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.tenYearDashboard.inflation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="value" stroke="#DC2626" fill="#DC2626" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Stock Market Trend */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-100">
              <h3 className="font-semibold text-gray-800 mb-4">KSE-100 Index</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.tenYearDashboard.stockMarket}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="value" stroke="#D97706" fill="#D97706" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.section>

        {/* Affiliate Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 md:p-8 text-white"
        >
          <h2 className="text-xl font-bold mb-6">Investment & Finance Opportunities</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.a
              href="https://www.wise.com/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-5 border border-green-500 hover:border-green-400 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">Send Money to Pakistan</h3>
                <ExternalLink className="w-5 h-5 text-green-200 group-hover:text-white transition-colors" />
              </div>
              <div className="text-green-100 text-sm mb-2">Wise - Low fees, fast transfers</div>
              <div className="bg-green-700/50 rounded-lg px-3 py-2 inline-block text-xs font-semibold">
                $25 Welcome Bonus
              </div>
            </motion.a>

            <motion.a
              href="https://www.psx.com.pk/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 border border-blue-500 hover:border-blue-400 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">Invest in Pakistan KSE</h3>
                <ExternalLink className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors" />
              </div>
              <div className="text-blue-100 text-sm mb-2">Pakistan Stock Exchange</div>
              <div className="bg-blue-700/50 rounded-lg px-3 py-2 inline-block text-xs font-semibold">
                Start Trading Today
              </div>
            </motion.a>

            <motion.a
              href="https://www.coursera.org/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-orange-600 to-amber-700 rounded-xl p-5 border border-orange-500 hover:border-orange-400 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">Economics Course</h3>
                <ExternalLink className="w-5 h-5 text-orange-200 group-hover:text-white transition-colors" />
              </div>
              <div className="text-orange-100 text-sm mb-2">Learn from world-class universities</div>
              <div className="bg-orange-700/50 rounded-lg px-3 py-2 inline-block text-xs font-semibold">
                45% Commission
              </div>
            </motion.a>
          </div>
        </motion.section>

      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="bg-gray-100 rounded-xl p-5 h-24"></div>
              ))}
            </div>
            <div className="bg-gray-100 rounded-lg h-64"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
