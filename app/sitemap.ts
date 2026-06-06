import { MetadataRoute } from 'next';
import { getAllCities } from '@/lib/getAllCities';

const BASE_URL = 'https://worldcityhub.com';

// Sub-page types with their priorities and change frequencies
const SUB_PAGES = [
  { slug: 'weather', priority: 0.7, changeFrequency: 'daily' as const },
  { slug: 'prayer-times', priority: 0.7, changeFrequency: 'daily' as const },
  { slug: 'rates', priority: 0.7, changeFrequency: 'hourly' as const }, // Rates update frequently
  { slug: 'news', priority: 0.7, changeFrequency: 'daily' as const },
  { slug: 'sports', priority: 0.65, changeFrequency: 'weekly' as const },
  { slug: 'economy', priority: 0.65, changeFrequency: 'monthly' as const },
  { slug: 'events', priority: 0.65, changeFrequency: 'weekly' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const cities = await getAllCities();

  // Homepage - highest priority
  entries.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  // Get unique countries
  const countries = [...new Set(cities.map(city => city.country))];

  // Country pages
  for (const country of countries) {
    entries.push({
      url: `${BASE_URL}/${country.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    });
  }

  // City pages and their sub-pages
  for (const city of cities) {
    const countrySlug = city.country.toLowerCase().replace(/\s+/g, '-');
    const provinceSlug = city.province.toLowerCase().replace(/\s+/g, '-');
    const citySlug = city.city_slug || city.name.toLowerCase().replace(/\s+/g, '-');

    // City main page
    const cityUrl = `${BASE_URL}/${countrySlug}/${provinceSlug}/${citySlug}`;
    entries.push({
      url: cityUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });

    // City sub-pages
    for (const subPage of SUB_PAGES) {
      entries.push({
        url: `${cityUrl}/${subPage.slug}`,
        lastModified: new Date(),
        changeFrequency: subPage.changeFrequency,
        priority: subPage.priority,
      });
    }
  }

  return entries;
}
