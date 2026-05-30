'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Waves, Home } from 'lucide-react';

interface Ocean {
  name: string;
  slug: string;
  image: string;
  description: string;
  area: number;
  avgDepth: number;
}

const oceans: Ocean[] = [
  {
    name: 'Pacific Ocean',
    slug: 'pacific-ocean',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
    description: 'The largest and deepest of Earth\'s five oceanic divisions. Covers more area than all of Earth\'s land combined.',
    area: 165250000,
    avgDepth: 4280,
  },
  {
    name: 'Atlantic Ocean',
    slug: 'atlantic-ocean',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200',
    description: 'The second-largest ocean, vital for transatlantic commerce and home to the Mid-Atlantic Ridge.',
    area: 106460000,
    avgDepth: 3339,
  },
  {
    name: 'Indian Ocean',
    slug: 'indian-ocean',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
    description: 'The warmest ocean and center of ancient maritime trade, connecting Africa, Asia, and Arabia.',
    area: 70560000,
    avgDepth: 3963,
  },
  {
    name: 'Arctic Ocean',
    slug: 'arctic-ocean',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    description: 'The smallest and shallowest ocean, surrounded by Arctic regions, rapidly changing due to climate change.',
    area: 14060000,
    avgDepth: 1038,
  },
  {
    name: 'Southern Ocean',
    slug: 'southern-ocean',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
    description: 'Circles Antarctica, one of the most remote and dangerous seas, home to unique marine life.',
    area: 21960000,
    avgDepth: 3839,
  },
];

export default function OceansPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[40vh] bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2240%22 fill=%22none%22 stroke=%22white%22 stroke-width=%220.5%22/></svg>')] bg-repeat"></div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative text-center text-white z-10 px-4"
        >
          <div className="flex justify-center mb-4">
            <Waves className="w-16 h-16" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-3">Explore Earth\'s Oceans</h1>
          <p className="text-lg md:text-xl text-cyan-100 max-w-2xl mx-auto">
            Discover the five major oceans that cover 71% of Earth\'s surface and are home to incredible marine life
          </p>
        </motion.div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 border-b border-blue-500/30"
      >
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">71%</div>
            <div className="text-gray-400 text-sm">Earth\'s Surface</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">1.335B</div>
            <div className="text-gray-400 text-sm">Cubic Kilometers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">200M+</div>
            <div className="text-gray-400 text-sm">Marine Species</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">5</div>
            <div className="text-gray-400 text-sm">Major Oceans</div>
          </div>
        </div>
      </motion.div>

      {/* Oceans Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {oceans.map((ocean, index) => (
            <motion.div key={ocean.slug} variants={itemVariants}>
              <Link href={`/oceans/${ocean.slug}`}>
                <motion.div
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                  whileTap={{ y: -4 }}
                  className="group h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-blue-500/20 hover:border-blue-400/60 transition-all cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={ocean.image}
                      alt={ocean.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-white text-xs font-semibold">Ocean {index + 1}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {ocean.name}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{ocean.description}</p>

                    {/* Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Area</span>
                        <span className="text-cyan-400 font-semibold">{(ocean.area / 1000000).toFixed(1)}M km²</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Average Depth</span>
                        <span className="text-cyan-400 font-semibold">{ocean.avgDepth.toLocaleString()}m</span>
                      </div>
                    </div>

                    {/* Button */}
                    <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                      Learn More →
                    </button>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Climate Change Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-t border-b border-red-500/20 py-12 mt-12"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Oceans Under Threat</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Rising temperatures, pollution, and climate change are dramatically affecting ocean ecosystems worldwide. Every ocean featured here faces unique challenges that require immediate global action.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 border border-red-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-400 mb-2">+0.5°C</div>
              <div className="text-sm text-gray-400">Average ocean warming since 1990</div>
            </div>
            <div className="bg-gray-800/50 border border-red-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-400 mb-2">3.4mm/yr</div>
              <div className="text-sm text-gray-400">Sea level rise accelerating</div>
            </div>
            <div className="bg-gray-800/50 border border-red-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-400 mb-2">1000+</div>
              <div className="text-sm text-gray-400">Species facing extinction risk</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Back to Homepage */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Homepage
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
