import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
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
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search any city, country or place..."
          className="w-full pl-14 pr-12 py-4 text-lg rounded-full bg-white shadow-xl border-2 border-gray-100 focus:border-blue-400 focus:outline-none transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="inline-block w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {results.map((city, index) => (
                <button
                  key={city.city_slug}
                  onClick={() => handleSelectCity(city)}
                  className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors ${
                    index === selectedIndex
                      ? 'bg-blue-50 border-l-4 border-blue-400'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCountryFlag(city.country_code)}</span>
                    <div>
                      <span className="font-semibold text-gray-800">{city.name}</span>
                      <span className="text-gray-400 mx-2">·</span>
                      <span className="text-gray-600">{city.country}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {formatPopulation(city.population)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleUseLocation}
        className="flex items-center justify-center space-x-2 mt-4 mx-auto text-gray-200 hover:text-white transition-colors"
      >
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-medium">Use My Location</span>
      </button>
    </div>
  );
}
