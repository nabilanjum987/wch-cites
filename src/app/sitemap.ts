import { MetadataRoute } from 'next'
import { getSupabase } from '@/lib/supabase'

const baseUrl = 'https://worldcityhub.vercel.app'

// Cities with full, real content today. Every other city route renders a
// "Coming Soon" placeholder and must NOT be in the sitemap until it has
// real data. Add a city here only when its pages render full content.
const LIVE_CITIES = [
  { country: 'pakistan', province: 'punjab', city: 'lahore' },
  { country: 'pakistan', province: 'sindh', city: 'karachi' },
] as const

const CITY_SUBPAGES = [
  '',
  '/weather',
  '/prayer-times',
  '/rates',
  '/news',
  '/sports',
  '/economy',
  '/events',
] as const

const HOROSCOPE_SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/countries`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/rates`, changeFrequency: 'hourly', priority: 0.7 },
    { url: `${baseUrl}/news`, changeFrequency: 'hourly', priority: 0.6 },
    { url: `${baseUrl}/horoscope`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/compare`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/conflicts`, changeFrequency: 'daily', priority: 0.5 },
    { url: `${baseUrl}/my-location`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/pakistan`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/pakistan/punjab`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/pakistan/sindh`, changeFrequency: 'daily', priority: 0.7 },
  ]

  const horoscopePages: MetadataRoute.Sitemap = HOROSCOPE_SIGNS.map((sign) => ({
    url: `${baseUrl}/horoscope/${sign}`,
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  const cityPages: MetadataRoute.Sitemap = LIVE_CITIES.flatMap(({ country, province, city }) =>
    CITY_SUBPAGES.map((sub) => ({
      url: `${baseUrl}/${country}/${province}/${city}${sub}`,
      changeFrequency: (sub === '/rates' || sub === '/weather' ? 'hourly' : 'daily') as 'hourly' | 'daily',
      priority: sub === '' ? 0.9 : 0.7,
    }))
  )

  const pages: MetadataRoute.Sitemap = [...staticPages, ...horoscopePages, ...cityPages]
  const seen = new Set(pages.map((p) => p.url))

  // Bonus: any additional active cities that appear in Supabase later are
  // merged in automatically. A Supabase failure must never shrink the
  // sitemap back to a stub again (that is how it ended up with 4 URLs).
  try {
    const supabase = getSupabase()
    const { data: cities } = await supabase
      .from('cities')
      .select('country_slug, province_slug, city_slug')
      .eq('is_active', true)

    if (cities) {
      for (const city of cities) {
        for (const sub of CITY_SUBPAGES) {
          const url = `${baseUrl}/${city.country_slug}/${city.province_slug}/${city.city_slug}${sub}`
          if (!seen.has(url)) {
            seen.add(url)
            pages.push({ url, changeFrequency: 'daily', priority: sub === '' ? 0.8 : 0.6 })
          }
        }
      }
    }
  } catch {
    // Keep the static + live-city sitemap above; never fall back to a stub.
  }

  return pages
}
