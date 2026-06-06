'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Users, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCityData } from '@/lib/getCityData';
import type { City } from '@/types/city';
import {
  generateEconomyIntroductionParagraph,
  generateGDPAndGrowthParagraph,
  generateIndustriesAndEmploymentParagraph,
  generateBusinessEnvironmentParagraph,
  generateForeignInvestmentParagraph,
  generateSkillsAndWorkforceParagraph,
  generateEconomicChallengesParagraph,
  generateFutureEconomicParagraph,
} from '@/lib/paragraphs/economyParagraphs';
import { generateBreadcrumbSchema } from '@/lib/seo/schemaMarkup';

export const revalidate = 3600;

interface EconomicIndicator {
  name: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface Industry {
  name: string;
  employees: string;
  growth: number;
}

export default function EconomyPage() {
  const params = useParams();
  const [city, setCity] = useState<City | null>(null);
  const [indicators, setIndicators] = useState<EconomicIndicator[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const country = Array.isArray(params.country) ? params.country[0] : params.country;
        const province = Array.isArray(params.province) ? params.province[0] : params.province;
        const citySlug = Array.isArray(params.city) ? params.city[0] : params.city;

        const cityData = await getCityData(country, province, citySlug);
        if (!cityData) {
          setLoading(false);
          return;
        }
        setCity(cityData);
      } catch (err) {
        console.error(err);
      }

      // Mock economic data
      const mockIndicators: EconomicIndicator[] = [
        {
          name: 'GDP Growth',
          value: '4.2%',
          change: 2.3,
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'from-green-500 to-green-400',
        },
        {
          name: 'Unemployment Rate',
          value: '3.8%',
          change: -0.5,
          icon: <TrendingDown className="w-6 h-6" />,
          color: 'from-blue-500 to-blue-400',
        },
        {
          name: 'Inflation Rate',
          value: '2.1%',
          change: -0.3,
          icon: <DollarSign className="w-6 h-6" />,
          color: 'from-amber-500 to-amber-400',
        },
        {
          name: 'Average Income',
          value: '\,000',
          change: 3.2,
          icon: <Briefcase className="w-6 h-6" />,
          color: 'from-pink-500 to-pink-400',
        },
      ];

      const mockIndustries: Industry[] = [
        { name: 'Technology', employees: '125,000', growth: 15.2 },
        { name: 'Retail & Commerce', employees: '89,000', growth: 5.1 },
        { name: 'Manufacturing', employees: '76,000', growth: 2.3 },
        { name: 'Healthcare', employees: '65,000', growth: 8.7 },
        { name: 'Education', employees: '54,000', growth: 3.2 },
        { name: 'Finance', employees: '42,000', growth: 6.5 },
      ];

      setIndicators(mockIndicators);
      setIndustries(mockIndustries);
      setLoading(false);
    };

    loadData();
  }, [params]);

  // Inject schema markup for SEO
  useEffect(() => {
    if (!city) return;

    // Create and inject breadcrumb schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'breadcrumb-schema-economy';
    breadcrumbScript.textContent = JSON.stringify(generateBreadcrumbSchema(city, 'economy'));
    document.head.appendChild(breadcrumbScript);

    // Update meta tags
    document.title = `${city.name} Economy & Business — GDP, Industries & Investment`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        `Economy and business information for ${city.name}: GDP growth, industries, employment, investment opportunities, and economic indicators.`
      );
    }

    return () => {
      breadcrumbScript.remove();
    };
  }, [city]);

  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Economy & Business
          </h1>
          <p className="text-slate-400 mb-8">
            Key economic indicators and industry overview for your city
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
          </div>
        ) : (
          <>
            {/* Economic Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {indicators.map((indicator, index) => (
                <motion.div
                  key={indicator.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-300">
                      {indicator.name}
                    </h3>
                    <div className="text-pink-400">
                      {indicator.icon}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-3xl font-bold text-white">
                      {indicator.value}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {indicator.change >= 0 ? (
                      <>
                        <TrendingUp size={16} className="text-green-400" />
                        <span className="text-sm text-green-400 font-semibold">
                          +{indicator.change}%
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown size={16} className="text-red-400" />
                        <span className="text-sm text-red-400 font-semibold">
                          {indicator.change}%
                        </span>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Industries Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-pink-400" />
                <h2 className="text-2xl font-bold text-white">
                  Major Industries
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {industries.map((industry, index) => (
                  <motion.div
                    key={industry.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="p-4 border border-white/10 rounded-lg hover:border-pink-400/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">
                        {industry.name}
                      </h3>
                      <div className="flex items-center gap-1 text-green-400">
                        <TrendingUp size={16} />
                        <span className="text-sm font-semibold">
                          +{industry.growth}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      <Users size={16} className="text-pink-400" />
                      <span className="text-sm">
                        {industry.employees} employees
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-pink-500 to-pink-400"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-semibold transition-all duration-300"
          >
            ? Back to City
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
