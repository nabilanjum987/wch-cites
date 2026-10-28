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

// Live personalities + places pages (final28 B11). Every slug below was
// verified live before listing (200 + real content + self-canonical).
// Deliberately NOT listed: the /personalities and /places index pages
// (200 but "Check back soon" fallbacks with 0 links) and the 4
// unpublished place slugs (Shalimar Gardens, Data Darbar, Walled City,
// Lahore Museum — all 404 live); sibling item D18 carries those entries
// when it builds the pages.
const PROFILE_SLUGS = [
  'abdul-qadeer-khan', 'abdul-sattar-edhi', 'abdus-salam',
  'allama-iqbal', 'ameer-haider-khan-hoti', 'amrita-pritam',
  'ashfaq-ahmed', 'azam-khan-hoti', 'bahawal-khan-i', 'bano-qudsia',
  'benazir-bhutto', 'dr-abdus-salam', 'faiz-ahmed-faiz', 'fatima-jinnah',
  'feroz-khan-noon', 'habib-jalib', 'haider-zaman-khan', 'imran-khan',
  'james-abbott', 'khurshid-ahmed-shah', 'malala-yousafzai',
  'mehdi-hasan', 'mir-muhammad-masum', 'mohammad-hafeez',
  'muhammad-ali-jinnah', 'mushaf-ali-mir', 'nasir-hussain-shah',
  'noor-jehan', 'nusrat-fateh-ali-khan', 'pervez-musharraf',
  'quaid-e-azam-jinnah', 'sadequain', 'sadiq-muhammad-khan-iv',
  'sadiq-muhammad-khan-v', 'sardar-mehtab-abbasi',
  'wasim-akram', 'younis-khan',
] as const

const PLACE_SLUGS = [
  'badshahi-mosque',
  'lahore-fort',
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
    // P7: the bare ICT province page returns 200 with full content live
    // (its 8 Islamabad city URLs were already in the sitemap via the
    // Supabase merge) but was missing as a province entry, unlike
    // Punjab/Sindh above. Verified: 200, 1 self-canonical, title 58,
    // description 114.
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

  const profilePages: MetadataRoute.Sitemap = [
    ...PROFILE_SLUGS.map((slug) => ({
      url: `${baseUrl}/personalities/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...PLACE_SLUGS.map((slug) => ({
      url: `${baseUrl}/places/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]

  const pages: MetadataRoute.Sitemap = [...staticPages, ...horoscopePages, ...cityPages, ...profilePages]
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
