import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://worldcityhub.com'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/compare`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/my-location`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/rates`, changeFrequency: 'hourly', priority: 0.7 },
  ]

  // Dynamic city pages from Supabase
  try {
    const { data: cities } = await supabase
      .from('cities')
      .select('country_slug, province_slug, city_slug')
      .eq('is_active', true)

    if (!cities) return staticPages

    const cityPages: MetadataRoute.Sitemap = cities.flatMap(city => [
      {
        url: `${baseUrl}/${city.country_slug}/${city.province_slug}/${city.city_slug}`,
        changeFrequency: 'daily' as const,
        priority: 0.8,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/${city.country_slug}/${city.province_slug}/${city.city_slug}/weather`,
        changeFrequency: 'hourly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/${city.country_slug}/${city.province_slug}/${city.city_slug}/prayer-times`,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${city.country_slug}/${city.province_slug}/${city.city_slug}/rates`,
        changeFrequency: 'hourly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/${city.country_slug}/${city.province_slug}/${city.city_slug}/news`,
        changeFrequency: 'hourly' as const,
        priority: 0.6,
      },
    ])

    return [...staticPages, ...cityPages]
  } catch {
    return staticPages
  }
}
