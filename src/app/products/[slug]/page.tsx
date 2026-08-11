'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Award, BookOpen, Users, ShoppingCart, Globe, ExternalLink, Check, X, Star, Heart, Calendar, Video, Package, Store } from 'lucide-react';
import {
  generateStoryParagraph, generateStoryAfter,
  generateMakingParagraph, generateMakingAfter,
  generateTypesParagraph, generateTypesAfter,
  generateAuthenticParagraph, generateAuthenticAfter,
  generateBuyParagraph, generateBuyAfter,
  generateSimilarParagraph, generateSimilarAfter,
} from '@/lib/paragraphs/products';

import { getProductBySlug, type Product } from '@/lib/data/products';

function ProductComingSoon({ slug }: { slug: string }) {
  const name = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return (
    <div
      style={{ backgroundColor: '#0a0f1e', minHeight: '100vh' }}
      className="flex flex-col items-center justify-center text-white px-6 text-center"
    >
      <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wide mb-3">
        Heritage Product
      </p>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{name}</h1>
      <p className="text-white/60 text-lg mb-8 max-w-md">
        The full guide for {name} is coming soon.
      </p>
      <a
        href="/products/lahori-khussa"
        className="inline-block px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-colors"
      >
        See Lahori Khussa guide
      </a>
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const match = getProductBySlug(slug);
      if (match) {
        setProduct(match);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 600);
  }, [slug]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (notFound || !product) {
    return <ProductComingSoon slug={slug} />;
  }

  return (
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", position: "relative" }}>
      {/* Breadcrumb Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ backgroundColor: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }} className=""
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <span className="text-gray-500">Home</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-500">Products</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">{product.name}</span>
          </nav>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-80 lg:h-96">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.unescoStatus && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-lg">
                  <Award className="w-4 h-4" />
                  UNESCO Heritage
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-8 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span>{product.origin.city}, {product.origin.country}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>{product.age} years old tradition</span>
                </div>
              </div>

              {product.unescoStatus && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-amber-900">{product.unescoStatus}</span>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-4 py-3 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Annual Exports</span>
                  </div>
                  <span className="text-xl font-bold text-green-700">
                    ${(product.annualExports / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>
          </div>
        </motion.section>

        {/* The Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            The Story
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateStoryParagraph(product.name, product.origin.city)}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Cultural History</h3>
              <div className="space-y-3">
                <div style={{ backgroundColor: "rgba(255,255,255,0.04)" }} className="rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">When it Started</div>
                  <div className="font-semibold text-gray-900">{product.history.started}</div>
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.04)" }} className="rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Who Made It</div>
                  <div className="font-semibold text-gray-900">{product.history.founders}</div>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mt-6 mb-4">How It Evolved</h3>
              <div className="space-y-2">
                {product.history.evolution.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Historical Timeline</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-200"></div>
                <div className="space-y-4">
                  {product.timeline.map((item, index) => (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="relative flex items-center gap-4"
                    >
                      <div className="relative z-10 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{item.year.slice(-2)}</span>
                      </div>
                      <div className="flex-1 bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                        <div className="text-xs text-indigo-600 font-semibold mb-1">{item.year}</div>
                        <div className="text-gray-800 text-sm">{item.event}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            {generateStoryAfter(product.name, product.origin.city)}
          </p>
        </motion.section>

        {/* How It Is Made */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Package className="w-7 h-7 text-orange-600" />
            How It Is Made
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateMakingParagraph(product.name)}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-700 mb-2">Materials Used</div>
              <ul className="space-y-1">
                {product.making.materials.map((material, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-800 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    {material}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-green-700 mb-2">Time to Make</div>
              <div className="text-xl font-bold text-green-800 mb-3">{product.making.timeToMake}</div>
              <div className="text-sm text-green-700 mb-2">Skills Required</div>
              <ul className="space-y-1">
                {product.making.skills.map((skill, index) => (
                  <li key={index} className="text-gray-800 text-sm">{skill}</li>
                ))}
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-center">
              <motion.a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(product.making.videoSearch)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Watch the Process</div>
                  <div className="text-sm text-gray-600">YouTube Videos</div>
                </div>
              </motion.a>
            </div>
          </div>

          {/* Step by Step Process */}
          <h3 className="font-semibold text-gray-900 mb-4">Step-by-Step Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.making.steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <h4 className="font-semibold text-gray-900">{step.title}</h4>
                </div>
                <p className="text-gray-700 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* SVG Illustration */}
          <div className="mt-8 flex justify-center">
            <svg width="600" height="80" viewBox="0 0 600 80" className="text-gray-300">
              <circle cx="50" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="75" y1="40" x2="125" y2="40" stroke="currentColor" strokeWidth="2" />
              <rect x="150" y="25" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="180" y1="40" x2="230" y2="40" stroke="currentColor" strokeWidth="2" />
              <path d="M 255 40 A 20 20 0 0 1 295 40" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="295" y1="40" x2="345" y2="40" stroke="currentColor" strokeWidth="2" />
              <circle cx="370" cy="40" r="15" fill="currentColor" />
              <line x1="385" y1="40" x2="435" y2="40" stroke="currentColor" strokeWidth="2" />
              <rect x="450" y="20" width="40" height="40" rx="20" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="490" y1="40" x2="540" y2="40" stroke="currentColor" strokeWidth="2" />
              <path d="M 550 25 L 570 40 L 550 55 Z" fill="currentColor" />
            </svg>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateMakingAfter(product.name)}
          </p>
        </motion.section>

        {/* Product Types & Prices */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-green-600" />
            Product Types & Prices
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateTypesParagraph(product.name)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.productTypes.map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + index * 0.1 }}
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-xl overflow-hidden"
              >
                <div className="h-40 relative">
                  <img src={item.image} alt={item.category} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-sm font-semibold text-gray-700">{item.size}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.category}</h3>
                  <div className="text-2xl font-bold text-green-600 mb-4">{item.priceRange}</div>
                  <motion.a
                    href={item.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateTypesAfter(product.name)}
          </p>
        </motion.section>

        {/* Buy Authentic */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
            <Award className="w-7 h-7 text-amber-600" />
            Buy Authentic - How to Identify Real vs Fake
          </h2>
          <p className="text-amber-900 leading-relaxed text-sm mb-6">
            {generateAuthenticParagraph(product.name)}
          </p>

          <div style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Physical Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.authenticity.checklist.map((item, index) => (
                <div key={index} style={{ backgroundColor: "rgba(255,255,255,0.04)" }} className="rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-3">{item.feature}</div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-gray-600">Authentic:</span>
                        <span className="text-sm text-gray-900 ml-1">{item.authentic}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-gray-600">Fake:</span>
                        <span className="text-sm text-gray-900 ml-1">{item.fake}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Pro Tips</h3>
            <ul className="space-y-2">
              {product.authenticity.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <Star className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-amber-800 leading-relaxed text-sm mt-6">
            {generateAuthenticAfter(product.name)}
          </p>
        </motion.section>

        {/* Where to Buy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Store className="w-7 h-7 text-blue-600" />
            Where to Buy
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateBuyParagraph(product.name, product.origin.city)}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* In Person */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                In Person
              </h3>
              <div className="space-y-4">
                {product.whereToBuy.inPerson.map((store, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + index * 0.1 }}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <div className="font-semibold text-gray-900 mb-2">{store.name}</div>
                    <div className="text-sm text-gray-600 mb-1">{store.address}</div>
                    <div className="text-sm text-gray-600 mb-2">{store.hours}</div>
                    <motion.a
                      href={store.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Map
                    </motion.a>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Online */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Online (Ships Worldwide)
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {product.whereToBuy.online.map((store, index) => (
                  <motion.a
                    key={index}
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="font-semibold text-gray-900 mb-1">{store.platform}</div>
                    <div className="text-xs text-gray-600">Shop Now</div>
                  </motion.a>
                ))}
              </div>

              {/* Price Guide */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Price Guide</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Small items:</span>
                    <span className="font-bold text-gray-900">${product.whereToBuy.priceGuide.small.min}-${product.whereToBuy.priceGuide.small.max}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Medium items:</span>
                    <span className="font-bold text-gray-900">${product.whereToBuy.priceGuide.medium.min}-${product.whereToBuy.priceGuide.medium.max}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Large/Premium:</span>
                    <span className="font-bold text-gray-900">${product.whereToBuy.priceGuide.large.min}-${product.whereToBuy.priceGuide.large.max}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Artisan Spotlight */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Artisan Photo */}
            <div className="h-64 lg:h-auto">
              <img
                src={product.artisan.photo}
                alt={product.artisan.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Artisan Info */}
            <div className="lg:col-span-2 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-red-600" />
                <span className="text-sm text-red-600 font-semibold uppercase tracking-wide">Artisan Spotlight</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.artisan.name}</h3>
              <div className="text-gray-600 mb-6 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {product.artisan.generation}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {product.artisan.experience} years experience
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600 mb-1">Specialty</div>
                <div className="text-gray-900">{product.artisan.specialty}</div>
              </div>

              <blockquote className="border-l-4 border-red-600 pl-4 italic text-gray-700 text-lg">
                "{product.artisan.quote}"
              </blockquote>

              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 inline-block">
                <div className="flex items-center gap-2 text-red-900">
                  <Heart className="w-5 h-5" />
                  <span className="font-semibold">Every purchase supports artisan families</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateBuyAfter(product.name, product.origin.city)}
          </p>
        </motion.section>

        {/* Similar Products Worldwide */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Globe className="w-7 h-7 text-indigo-600" />
            Similar Products Worldwide
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateSimilarParagraph(product.name)}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {product.similarProducts.map((item, index) => (
              <motion.a
                key={item.slug}
                href={`/products/${item.slug}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 + index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="group"
              >
                <div style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-xl overflow-hidden">
                  <div className="h-32">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{item.name}</div>
                    <div className="text-xs text-gray-600">{item.origin}</div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateSimilarAfter(product.name)}
          </p>
        </motion.section>

      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", position: "relative" }}>
      <div className="bg-white border-b border-gray-200 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="bg-gray-100 rounded-lg p-5 h-32"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
