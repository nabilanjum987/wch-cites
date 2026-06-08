'use client';
import { useState, useEffect } from 'react';
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

const dailyFacts = [
  {
    fact: "Dubai's Gold Souk has 300+ retailers — most per square meter on earth",
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    slug: 'dubai'
  },
  {
    fact: "Istanbul is the only city spanning two continents — Europe and Asia",
    city: 'Istanbul',
    country: 'Turkey',
    countryCode: 'TR',
    slug: 'istanbul'
  },
  {
    fact: "Lahore's Badshahi Mosque was the world's largest for 313 years until 1986",
    city: 'Lahore',
    country: 'Pakistan',
    countryCode: 'PK',
    slug: 'lahore'
  },
  {
    fact: "Tokyo has more Michelin stars than any other city — over 230 restaurants",
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    slug: 'tokyo'
  },
  {
    fact: "New York's Central Park is larger than Monaco — 843 acres vs 484 acres",
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    slug: 'new-york'
  },
  {
    fact: "Mumbai's Dabbawalas deliver 200,000 lunches daily with 99.9% accuracy",
    city: 'Mumbai',
    country: 'India',
    countryCode: 'IN',
    slug: 'mumbai'
  },
  {
    fact: "London's Underground is the oldest metro system — opened in 1863",
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    slug: 'london'
  }
];

const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default function DidYouKnow() {
  const [currentFact, setCurrentFact] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setCurrentFact(dayOfYear % dailyFacts.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentFact((prev) => (prev + 1) % dailyFacts.length);
        setFade(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fact = dailyFacts[currentFact];

  return (
    <div className="mb-12">
      <div className="bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-yellow-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
        <div className="flex items-start space-x-4">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Did You Know?</h2>
            </div>

            <p 
              className="text-gray-200 text-lg leading-relaxed mb-4 transition-opacity duration-300"
              style={{ opacity: fade ? 1 : 0 }}
            >
              {fact.fact}
            </p>

            <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors">
              <span className="text-xl">{getCountryFlag(fact.countryCode)}</span>
              <span className="text-white font-medium">Explore {fact.city}</span>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
