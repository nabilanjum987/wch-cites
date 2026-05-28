'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Building, Heart, Globe, ExternalLink, Calendar, Handshake, AlertCircle, Newspaper, Flag } from 'lucide-react';

interface Conflict {
  name: string;
  slug: string;
  region: string;
  countries: string[];
  startDate: string;
  status: 'Active' | 'Resolved' | 'Monitoring' | 'Ceasefire' | 'Negotiations';
  summary: string;
  humanitarianImpact: {
    displacedPersons: number;
    refugees: number;
    civilianCasualties: number;
    humanitarianAccess: string;
    lastUpdated: string;
  };
  economicImpact: {
    global: string;
    regional: string;
    affectedIndustries: string[];
    priceImpact: { commodity: string; change: string }[];
  };
  peaceEfforts: {
    unInitiatives: string[];
    bilateral: string[];
    regional: string[];
    ngos: string[];
  };
  affectedCities: {
    name: string;
    country: string;
    slug: string;
    status: string;
    advisory: string;
  }[];
  humanitarianAid: {
    organization: string;
    name: string;
    url: string;
    description: string;
  }[];
  news: {
    source: string;
    title: string;
    url: string;
    date: string;
  }[];
  travelAdvisories: {
    country: string;
    level: string;
    lastUpdated: string;
    summary: string;
  }[];
}

const mockConflict: Conflict = {
  name: 'Red Sea Crisis',
  slug: 'red-sea-crisis',
  region: 'Middle East / Red Sea',
  countries: ['Yemen', 'Saudi Arabia', 'Eritrea', 'Djibouti', 'Sudan'],
  startDate: 'November 2023',
  status: 'Active',
  summary: 'The Red Sea Crisis began in November 2023 when Houthi forces in Yemen launched attacks on commercial shipping vessels in the Red Sea and Gulf of Aden. The group declared these actions in solidarity with Palestinians during the Israel-Gaza conflict. As of 2024, over 100 attacks have been reported on commercial vessels, resulting in significant disruptions to global trade. Major shipping companies have rerouted vessels around the Cape of Good Hope, adding 10-14 days to shipping times and increasing costs substantially.',
  humanitarianImpact: {
    displacedPersons: 2400000,
    refugees: 850000,
    civilianCasualties: 45000,
    humanitarianAccess: 'Severely restricted in conflict zones',
    lastUpdated: '2024-01-15',
  },
  economicImpact: {
    global: 'Disrupted 12% of global trade; shipping costs increased 300% on Asia-Europe routes; $200B+ economic impact projected',
    regional: 'Yemen GDP decline 15%; Saudi Arabia economic adjustment; Eritrea and Djibouti port revenues affected',
    affectedIndustries: [
      'Global shipping and logistics',
      'Oil and gas transportation',
      'Automotive manufacturing (supply chain delays)',
      'Consumer electronics',
      'Food and agriculture exports',
      'Pharmaceutical supply chains',
    ],
    priceImpact: [
      { commodity: 'Container Shipping Rates', change: '+300-500%' },
      { commodity: 'Insurance Premiums', change: '+1000%' },
      { commodity: 'Energy Prices', change: '+15%' },
      { commodity: 'Consumer Goods', change: '+8-12%' },
    ],
  },
  peaceEfforts: {
    unInitiatives: [
      'UN Security Council Resolution 2722 (January 2024) - condemned attacks, called for cease',
      'UN Special Envoy for Yemen ongoing negotiations',
      'UNHCR humanitarian coordination efforts',
      'UN OCHA facilitating aid delivery',
    ],
    bilateral: [
      'US-led Operation Prosperity Guardian - naval protection coalition',
      'EU Operation Aspides - maritime security mission',
      'Saudi-Houthi indirect negotiations',
      'Oman-mediated talks between parties',
    ],
    regional: [
      'Arab League emergency sessions',
      'GCC (Gulf Cooperation Council) coordination',
      'African Union peace initiatives',
      'Regional naval cooperation agreements',
    ],
    ngos: [
      'International Crisis Group conflict analysis',
      'Carnegie Middle East Center mediation support',
      'International Committee of the Red Cross humanitarian access',
      'Doctors Without Borders medical aid coordination',
    ],
  },
  affectedCities: [
    { name: 'Sana\'a', country: 'Yemen', slug: 'sanaa', status: 'Under control', advisory: 'Do not travel' },
    { name: 'Aden', country: 'Yemen', slug: 'aden', status: 'Active conflict', advisory: 'Do not travel' },
    { name: 'Jeddah', country: 'Saudi Arabia', slug: 'jeddah', status: 'Vigilance advised', advisory: 'Exercise increased caution' },
    { name: 'Djibouti City', country: 'Djibouti', slug: 'djibouti-city', status: 'Refugee influx', advisory: 'Exercise normal precautions' },
    { name: 'Asmara', country: 'Eritrea', slug: 'asmara', status: 'Monitoring', advisory: 'Reconsider travel' },
  ],
  humanitarianAid: [
    {
      organization: 'UNHCR',
      name: 'UN Refugee Agency',
      url: 'https://www.unhcr.org/yemen-emergency.html',
      description: 'Providing shelter, protection, and assistance to displaced persons and refugees',
    },
    {
      organization: 'ICRC',
      name: 'International Committee of the Red Cross',
      url: 'https://www.icrc.org/en/where-we-work/middle-east/yemen',
      description: 'Medical support, family reunification, and humanitarian access coordination',
    },
    {
      organization: 'WFP',
      name: 'World Food Programme',
      url: 'https://www.wfp.org/countries/yemen',
      description: 'Emergency food assistance to millions facing severe hunger',
    },
    {
      organization: 'UNICEF',
      name: 'UN Children\'s Fund',
      url: 'https://www.unicef.org/emergencies/yemen-crisis',
      description: 'Child protection, education, and essential services for children',
    },
    {
      organization: 'MSF',
      name: 'Doctors Without Borders',
      url: 'https://www.doctorswithoutborders.org/what-we-do/countries/yemen',
      description: 'Emergency medical care and hospital support in conflict zones',
    },
    {
      organization: 'OCHA',
      name: 'UN Office for Humanitarian Affairs',
      url: 'https://www.unocha.org/yemen',
      description: 'Coordination of humanitarian response and aid delivery',
    },
  ],
  news: [
    {
      source: 'Reuters',
      title: 'Red Sea shipping attacks continue despite international response',
      url: 'https://www.reuters.com/world/middle-east/red-sea-crisis-2024',
      date: '2024-01-20',
    },
    {
      source: 'AP',
      title: 'UN calls for immediate end to attacks on commercial vessels',
      url: 'https://apnews.com/red-sea-crisis-un',
      date: '2024-01-18',
    },
    {
      source: 'BBC',
      title: 'Analysis: How Red Sea crisis is affecting global supply chains',
      url: 'https://www.bbc.com/news/business-red-sea-shipping',
      date: '2024-01-19',
    },
    {
      source: 'Al Jazeera',
      title: 'Humanitarian situation worsens as conflict escalates',
      url: 'https://www.aljazeera.com/news/yemen-humanitarian-crisis',
      date: '2024-01-21',
    },
  ],
  travelAdvisories: [
    {
      country: 'United Kingdom',
      level: 'Do Not Travel',
      lastUpdated: '2024-01-15',
      summary: 'FCO advises against all travel to Yemen and all but essential travel near Red Sea coast',
    },
    {
      country: 'United States',
      level: 'Do Not Travel',
      lastUpdated: '2024-01-14',
      summary: 'State Department warns against travel to Yemen due to terrorism, civil unrest, and health risks',
    },
    {
      country: 'Canada',
      level: 'Avoid All Travel',
      lastUpdated: '2024-01-16',
      summary: 'Global Affairs Canada advises against all travel to Yemen due to armed conflict and terrorism risk',
    },
    {
      country: 'Australia',
      level: 'Do Not Travel',
      lastUpdated: '2024-01-13',
      summary: 'DFAT advises against all travel to Yemen due to extremely dangerous security situation',
    },
  ],
};

export default function ConflictPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [conflict, setConflict] = useState<Conflict | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setConflict(mockConflict);
      setLoading(false);
    }, 600);
  }, [slug]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!conflict) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Conflict not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Monitoring':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Ceasefire':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Negotiations':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAdvisoryColor = (advisory: string) => {
    if (advisory.includes('Do not travel') || advisory.includes('Avoid All Travel')) {
      return 'bg-red-50 border-red-200 text-red-900';
    }
    if (advisory.includes('Reconsider')) {
      return 'bg-orange-50 border-orange-200 text-orange-900';
    }
    if (advisory.includes('Exercise increased caution')) {
      return 'bg-yellow-50 border-yellow-200 text-yellow-900';
    }
    return 'bg-green-50 border-green-200 text-green-900';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-gray-900 to-gray-700 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Neutral Notice */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-600 text-white px-6 py-4 rounded-xl mb-6 flex items-start gap-3"
          >
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold mb-1">Neutral Notice</div>
              <div className="text-blue-100 text-sm">
                WorldCityHub presents factual information only. No political positions.
                We provide humanitarian aid links to help those affected.
              </div>
            </div>
          </motion.div>

          {/* Title and Status */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{conflict.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className={`px-4 py-2 rounded-lg border font-semibold ${getStatusColor(conflict.status)}`}>
              {conflict.status}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-5 h-5" />
              <span>{conflict.region}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-5 h-5" />
              <span>Started {conflict.startDate}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {conflict.countries.map((country, i) => (
              <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-sm">
                {country}
              </span>
            ))}
          </div>
          <p className="text-gray-300 max-w-4xl leading-relaxed">{conflict.summary}</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* Humanitarian Impact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200 p-6"
        >
          <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-3">
            <Heart className="w-7 h-7 text-red-600" />
            Humanitarian Impact
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 border border-red-200">
              <div className="text-sm text-gray-600 mb-1">Displaced Persons</div>
              <div className="text-3xl font-bold text-red-900">{(conflict.humanitarianImpact.displacedPersons / 1000000).toFixed(1)}M</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-red-200">
              <div className="text-sm text-gray-600 mb-1">Refugees</div>
              <div className="text-3xl font-bold text-red-900">{(conflict.humanitarianImpact.refugees / 1000000).toFixed(2)}M</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-red-200">
              <div className="text-sm text-gray-600 mb-1">Civilian Casualties</div>
              <div className="text-3xl font-bold text-red-900">{(conflict.humanitarianImpact.civilianCasualties / 1000).toFixed(0)}K</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-600">Humanitarian Access</span>
              </div>
              <div className="text-sm font-semibold text-red-900">{conflict.humanitarianImpact.humanitarianAccess}</div>
            </div>
          </div>

          <div className="text-sm text-red-700">
            Last updated: {conflict.humanitarianImpact.lastUpdated} (UNHCR data)
          </div>
        </motion.section>

        {/* Economic Impact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Building className="w-7 h-7 text-gray-700" />
            Economic Impact
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Global Impact</div>
                <div className="text-gray-900">{conflict.economicImpact.global}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Regional Impact</div>
                <div className="text-gray-900">{conflict.economicImpact.regional}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <div className="font-semibold text-gray-900 mb-3">Price Impact</div>
              <div className="space-y-2">
                {conflict.economicImpact.priceImpact.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{item.commodity}</span>
                    <span className="font-semibold text-gray-900">{item.change}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="font-semibold text-gray-900 mb-3">Affected Industries</div>
            <div className="flex flex-wrap gap-2">
              {conflict.economicImpact.affectedIndustries.map((industry, i) => (
                <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200">
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Peace Efforts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Handshake className="w-7 h-7 text-indigo-600" />
            Peace Efforts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* UN Initiatives */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">UN Initiatives</span>
              </div>
              <ul className="space-y-2">
                {conflict.peaceEfforts.unInitiatives.map((item, i) => (
                  <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bilateral */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Handshake className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Bilateral</span>
              </div>
              <ul className="space-y-2">
                {conflict.peaceEfforts.bilateral.map((item, i) => (
                  <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Regional */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Regional</span>
              </div>
              <ul className="space-y-2">
                {conflict.peaceEfforts.regional.map((item, i) => (
                  <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* NGOs */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-amber-900">NGOs</span>
              </div>
              <ul className="space-y-2">
                {conflict.peaceEfforts.ngos.map((item, i) => (
                  <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Affected Cities */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <MapPin className="w-7 h-7 text-red-600" />
            Affected Cities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conflict.affectedCities.map((city, i) => (
              <motion.a
                key={i}
                href={`/yemen/${city.slug}`}
                whileHover={{ scale: 1.02 }}
                className={`rounded-xl p-5 border ${getAdvisoryColor(city.advisory)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-lg">{city.name}</div>
                    <div className="text-sm opacity-80">{city.country}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-60" />
                </div>
                <div className="mt-3 pt-3 border-t border-current/20">
                  <div className="text-sm font-medium mb-1">Status: {city.status}</div>
                  <div className="text-xs opacity-80">{city.advisory}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Humanitarian Aid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-6"
        >
          <h2 className="text-2xl font-bold text-emerald-900 mb-2 flex items-center gap-3">
            <Heart className="w-7 h-7 text-emerald-600" />
            Humanitarian Aid Organizations
          </h2>
          <p className="text-emerald-800 mb-6 text-sm">
            These are legitimate humanitarian organizations - NO affiliate links. We provide these links to help those affected by this conflict.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conflict.humanitarianAid.map((org, i) => (
              <motion.a
                key={i}
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-5 border border-emerald-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">{org.name}</div>
                    <div className="text-xs text-emerald-600 font-medium">{org.organization}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-sm text-gray-600 mt-2">{org.description}</p>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Latest News */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Newspaper className="w-7 h-7 text-gray-700" />
            Latest News
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Sources: Reuters, AP, BBC, Al Jazeera only - no partisan sources
          </p>

          <div className="space-y-4">
            {conflict.news.map((article, i) => (
              <motion.a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="block bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-800 rounded text-xs font-medium">
                        {article.source}
                      </span>
                      <span className="text-xs text-gray-500">{article.date}</span>
                    </div>
                    <div className="font-semibold text-gray-900">{article.title}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Travel Advisories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-6"
        >
          <h2 className="text-2xl font-bold text-orange-900 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-orange-600" />
            Travel Advisories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conflict.travelAdvisories.map((advisory, i) => (
              <div
                key={i}
                className={`rounded-xl p-5 border ${
                  advisory.level.includes('Do Not') || advisory.level.includes('Avoid')
                    ? 'bg-red-50 border-red-300'
                    : 'bg-amber-50 border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">{advisory.country}</div>
                    <div className={`text-sm font-medium ${
                      advisory.level.includes('Do Not') || advisory.level.includes('Avoid')
                        ? 'text-red-700'
                        : 'text-amber-700'
                    }`}>
                      {advisory.level}
                    </div>
                  </div>
                  <Flag className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-700">{advisory.summary}</p>
                <div className="text-xs text-gray-500 mt-2">
                  Updated: {advisory.lastUpdated}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="bg-gray-700 h-40"></div>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 h-40"></div>
        ))}
      </div>
    </div>
  );
}
