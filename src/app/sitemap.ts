import { MetadataRoute } from 'next'
import { getSupabase } from '@/lib/supabase'

// The sitemap merges live Supabase cities, so it must be generated per
// request — a static build-time sitemap kept serving stale city URLs
// after the underlying data changed.
export const dynamic = 'force-dynamic'

const baseUrl = 'https://worldcityhub.vercel.app'

// Cities with full, real content today. Every other city route renders a
// "Coming Soon" placeholder and must NOT be in the sitemap until it has
// real data. Add a city here only when its pages render full content.
const LIVE_CITIES = [
  { country: 'pakistan', province: 'punjab', city: 'lahore' },
  { country: 'pakistan', province: 'sindh', city: 'karachi' },
  // R9 audit (2026-10-22): Islamabad, Faisalabad and Rawalpindi render the
  // full city template with real data on production (verified page-by-page
  // against Lahore's byte class) but were missing here — Islamabad reached
  // the sitemap only via the Supabase merge, Faisalabad and Rawalpindi not
  // at all. The dedupe set below keeps the merge from double-listing them.
  { country: 'pakistan', province: 'islamabad-capital-territory', city: 'islamabad' },
  { country: 'pakistan', province: 'punjab', city: 'faisalabad' },
  { country: 'pakistan', province: 'punjab', city: 'rawalpindi' },
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
    { url: `${baseUrl}/compare`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/improve`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/sources`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/conflicts`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${baseUrl}/compare/lahore-vs-karachi`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${baseUrl}/compare/lahore-vs-islamabad`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${baseUrl}/compare/karachi-vs-islamabad`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${baseUrl}/compare/faisalabad-vs-lahore`, changeFrequency: 'daily', priority: 0.5 },
    { url: `${baseUrl}/compare/rawalpindi-vs-islamabad`, changeFrequency: 'daily', priority: 0.5 },
    { url: `${baseUrl}/my-location`, changeFrequency: 'weekly', priority: 0.5 },
    // Golden templates (marathon Q9/Q10): a route enters the sitemap
    // only when its page is fully server-rendered with real data.
    { url: `${baseUrl}/wonders`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/wonders/taj-mahal`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/oceans`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/oceans/arabian-sea`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/pakistan`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/pakistan/punjab`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/pakistan/sindh`, changeFrequency: 'daily', priority: 0.7 },
    // R9 audit: the other three province pages render the same full
    // template on production (verified) but were absent from the sitemap.
    { url: `${baseUrl}/pakistan/khyber-pakhtunkhwa`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/pakistan/balochistan`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/pakistan/islamabad-capital-territory`, changeFrequency: 'daily', priority: 0.7 },
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
      .select('country_slug, province_slug, city_slug:slug')

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
