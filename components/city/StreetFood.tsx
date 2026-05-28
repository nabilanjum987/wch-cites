'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

interface FoodItem {
  name: string;
  description: string;
  image?: string;
  bestArea: string;
}

const DEFAULT_FOODS: Record<string, FoodItem[]> = {
  lahore: [
    { name: 'Nihari', description: 'Slow-cooked meat stew, a traditional breakfast dish', bestArea: 'Lahori Food Street, MM Alam Road' },
    { name: 'Lahori Paye', description: 'Brazen goat trotter curry, breakfast delicacy', bestArea: 'Lakshmi Chowk, Mazang' },
    { name: 'Seekh Kabab', description: 'Spiced minced meat grilled on skewers', bestArea: 'Fort Road Food Street' },
    { name: 'Kulcha Chana', description: 'Chickpea curry served with traditional bread', bestArea: 'Anarkali Bazaar' },
    { name: 'Halwa Puri', description: 'Sweet semolina with deep-fried bread, Sunday breakfast', bestArea: 'Liberty Market' },
    { name: 'Lassi', description: 'Sweet yogurt drink, famous Lahore specialty', bestArea: 'Mozang Chungi' },
  ],
  karachi: [
    { name: 'Biryani', description: 'Aromatic rice layered with spiced meat, Karachi special', bestArea: 'Burns Road, Boat Basin' },
    { name: 'Karahi', description: 'Wok-cooked meat with tomatoes and green chilies', bestArea: 'Zamzama, DHA' },
    { name: 'Haleem', description: 'Slow-cooked wheat and meat porridge', bestArea: 'Burns Road' },
    { name: 'Gola Kebab', description: 'Small round minced meat kebabs', bestArea: 'Jama Cloth Market' },
    { name: 'Papri Chat', description: 'Crispy wafers with yogurt and chutneys', bestArea: 'Clifton Beach' },
    { name: 'Parsi Samosa', description: 'Unique samosa with minced meat filling', bestArea: 'Parsi Colony' },
  ],
  islamabad: [
    { name: 'Chapli Kabab', description: 'Flat beef kebab, Peshawari style', bestArea: 'F-7 Markaz, Melody Food Street' },
    { name: 'Siri Paye', description: 'Head and trotters curry', bestArea: 'Melody Market' },
    { name: 'Chana Chat', description: 'Spiced chickpea salad', bestArea: 'F-6 Super Market' },
    { name: 'Namkeen Tikka', description: 'Salted grilled chicken pieces', bestArea: 'Blue Area' },
    { name: 'Lamb Karahi', description: 'Fresh lamb cooked in tomato base', bestArea: 'Saidpur Village' },
    { name: 'Gola Ganda', description: 'Shaved ice with flavored syrups', bestArea: 'Lake View Park' },
  ],
  peshawar: [
    { name: 'Peshawari Chappal Kebab', description: 'Large flat beef kebab', bestArea: 'Qissa Khwani Bazaar' },
    { name: 'Afghani Pulao', description: 'Rice with carrots and raisins', bestArea: 'Cantt Area' },
    { name: 'Mantu', description: 'Steamed dumplings with meat filling', bestArea: 'University Town' },
    { name: 'Kabuli Naan', description: 'Bread stuffed with nuts and raisins', bestArea: 'Hashtnagri' },
    { name: 'Shinwari Tikka', description: 'Charcoal-grilled lamb chunks', bestArea: 'Jama Bazaar' },
    { name: 'Qahwa', description: 'Traditional green tea', bestArea: 'Khyber Bazaar' },
  ],
  multan: [
    { name: 'Sohan Halwa', description: 'Traditional sweet confection made with milk and ghee', bestArea: 'Hussain Agahi Bazaar' },
    { name: 'Mango Lassi', description: 'Creamy mango yogurt drink', bestArea: 'Chungi No. 9' },
    { name: 'Doodh Jalebi', description: 'Hot jalebis served in warm milk', bestArea: 'Chowk Bazaar' },
    { name: 'Chakki', description: 'Coarse wheat flour bread with meat', bestArea: 'Bohar Gate' },
    { name: 'Kheer', description: 'Creamy rice pudding', bestArea: 'Darbar Hazrat Bahauddin Zakariya' },
    { name: 'Falsa Sharbat', description: 'Sweet berry juice', bestArea: 'Cantt Area' },
  ],
};

const FOOD_STREETS: Record<string, Array<{ name: string; description: string }>> = {
  lahore: [
    { name: 'MM Alam Road', description: 'Modern dining with rooftop restaurants and cafes' },
    { name: 'Fort Road Food Street', description: 'Heritage dining near Badshahi Mosque' },
    { name: 'Lakshmi Chowk', description: 'Traditional breakfast haven' },
  ],
  karachi: [
    { name: 'Burns Road', description: 'Historic food street with legendary biryani spots' },
    { name: 'Boat Basin', description: 'Late night food hub by the sea' },
    { name: 'Zamzama', description: 'Upscale dining and international cuisine' },
  ],
  islamabad: [
    { name: 'Melody Food Street', description: 'Central food market with diverse options' },
    { name: 'Saidpur Village', description: 'Heritage dining with hillside views' },
    { name: 'F-7 Markaz', description: 'Traditional Afghan and Pakistani cuisine' },
  ],
};

async function fetchWikipediaImage(term: string): Promise<string | null> {
  try {
    const encoded = encodeURIComponent(term.replace(/\s+/g, '_'));
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`
    );

    if (!response.ok) return null;
    const data = await response.json();
    return data.thumbnail?.source || null;
  } catch {
    return null;
  }
}

function FoodCard({ food, index }: { food: FoodItem; index: number }) {
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <div className="h-32 bg-gray-100 relative">
        {food.image ? (
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-orange-50 to-amber-100">
            🍽️
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
          Local Favorite
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1">{food.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{food.description}</p>

        <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
          <span>📍</span>
          <span className="font-medium">Best at:</span>
          <span>{food.bestArea}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function StreetFood({ city }: { city: City }) {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [foodStreets, setFoodStreets] = useState<Array<{ name: string; description: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const cityKey = city.city_slug || city.name.toLowerCase();
      const foodItems = DEFAULT_FOODS[cityKey] || [
        { name: 'Local Cuisine', description: 'Traditional local dishes', bestArea: 'City Center' },
        { name: 'Street Food', description: 'Popular street food items', bestArea: 'Main Bazaar' },
        { name: 'Traditional Sweet', description: 'Famous local dessert', bestArea: 'Old City' },
        { name: 'Breakfast Specialty', description: 'Morning delicacy', bestArea: 'Downtown' },
        { name: 'Evening Snack', description: 'Popular evening treat', bestArea: 'Food Street' },
        { name: 'Local Beverage', description: 'Traditional drink', bestArea: 'Market Area' },
      ];

      const enrichedFoods = await Promise.all(
        foodItems.map(async (food) => {
          const image = await fetchWikipediaImage(`${food.name} food`);
          return { ...food, image: image || undefined };
        })
      );

      setFoods(enrichedFoods);
      setFoodStreets(FOOD_STREETS[cityKey] || []);
      setLoading(false);
    }

    load();
  }, [city.city_slug, city.name]);

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${city.lng - 0.05}%2C${city.lat - 0.05}%2C${city.lng + 0.05}%2C${city.lat + 0.05}&layer=mapnik`;

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">🍜</span>
        Street Food & Local Cuisine
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-xl overflow-hidden animate-pulse">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {foods.map((food, idx) => (
              <FoodCard key={food.name + idx} food={food} index={idx} />
            ))}
          </div>

          {foodStreets.length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🛣️</span>
                Best Food Streets
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {foodStreets.map((street, idx) => (
                  <motion.div
                    key={street.name}
                    className="bg-amber-50 rounded-lg p-4 border border-amber-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                  >
                    <p className="font-bold text-amber-900">{street.name}</p>
                    <p className="text-sm text-amber-700 mt-1">{street.description}</p>
                  </motion.div>
                ))}
              </div>

              <a
                href={`https://www.openstreetmap.org/?mlat=${city.lat}&mlon=${city.lng}#map=15/${city.lat}/${city.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
              >
                <span>🗺️</span>
                <span>View Food Streets on Map</span>
                <span>→</span>
              </a>
            </div>
          )}
        </>
      )}

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
}
