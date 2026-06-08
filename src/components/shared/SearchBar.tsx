'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { CitySearchResult } from '../../types/city';

interface SearchBarProps {
  onCitySelect?: (city: CitySearchResult) => void;
}

const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const formatPopulation = (population: number): string => {
  if (population >= 1000000) {
    return `${(population / 1000000).toFixed(1)}M`;
  }
  if (population >= 1000) {
    return `${(population / 1000).toFixed(0)}K`;
  }
  return population.toString();
};

export default function SearchBar({ onCitySelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchCities(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchCities = async (searchQuery: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('name, city_slug, country, country_code, population')
        .or(`name.ilike.%${searchQuery}%,country.ilike.%${searchQuery}%`)
        .eq('is_active', true)
        .order('population', { ascending: false })
        .limit(10);

      if (!error && data) {
        setResults(data);
        setIsOpen(data.length > 0);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectCity(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleSelectCity = (city: CitySearchResult) => {
    setQuery(city.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onCitySelect) {
      onCitySelect(city);
    }
  };

  const handleUseLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const { data } = await supabase
            .from('cities')
            .select('name, city_slug, country, country_code, population')
            .eq('is_active', true)
            .order('population', { ascending: false })
            .limit(1)
            .single();

          if (data) {
            handleSelectCity(data);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <motion.div className="relative group" whileFocus="focused" initial="unfocused">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search any city, country or place..."
          className="w-full pl-14 pr-12 py-4 text-lg rounded-full backdrop-blur-xl bg-white/15 border border-white/30 text-white placeholder-gray-300 focus:bg-white/25 focus:border-cyan-400/50 focus:outline-none transition-all shadow-lg focus:shadow-xl focus:shadow-cyan-500/20"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/70 hover:text-white" />
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-3 backdrop-blur-xl bg-[#030712]/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                <motion.div
                  className="inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            ) : (
              <motion.div className="max-h-96 overflow-y-auto">
                {results.map((city, index) => (
                  <motion.button
                    key={city.city_slug}
                    onClick={() => handleSelectCity(city)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-full flex items-center justify-between px-5 py-3 text-left transition-all ${
                      index === selectedIndex
                        ? 'bg-white/20 border-l-4 border-cyan-400'
                        : 'hover:bg-white/10'
                    }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getCountryFlag(city.country_code)}</span>
                        <div>
                          <span className="font-semibold text-white">{city.name}</span>
                          <span className="text-gray-400 mx-2">·</span>
                          <span className="text-gray-300">{city.country}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-400">
                        <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                          {formatPopulation(city.population)}
                        </span>
                      </div>
                    </motion.button>
                  ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleUseLocation}
        className="flex items-center justify-center space-x-2 mt-4 mx-auto text-gray-400 hover:text-cyan-400 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-medium">Use My Location</span>
      </motion.button>
    </div>
  );
}
