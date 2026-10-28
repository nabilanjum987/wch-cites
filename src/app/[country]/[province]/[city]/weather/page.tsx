import type { Metadata } from "next"
import WeatherPageClient from "@/components/weather/WeatherPageClient"
import CityPageImage from "@/components/city/CityPageImage"
import { getCityData } from "@/lib/getCityData"
import JsonLd from "@/components/seo/JsonLd"
import { breadcrumbJsonLd, cityJsonLd, citySubpageCrumbs, titleCaseSlug } from "@/lib/seo/breadcrumbs"
import { fetchWeatherData, fetchSunMoonData, fetchAQIData } from "@/lib/apis/weather"

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>
}

const titleCase = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

// A3 (final30): keyword-targeted title/meta for the three in-scope cities
// only. Every other city keeps the generic title/meta below; no other
// city's weather keyword is targeted here.
const WEATHER_TODAY_META: Record<string, { title: string; description: string }> = {
  lahore: {
    title: 'Lahore Weather Today | WorldCityHub',
    description: 'Lahore weather today: live conditions, hourly and 7-day forecast, air quality, sunrise and sunset, and what to wear in Lahore, Punjab, Pakistan.',
  },
  multan: {
    title: 'Multan Weather Today | WorldCityHub',
    description: 'Multan weather today: live conditions, hourly and 7-day forecast, air quality, sunrise and sunset, and what to wear in Multan, Punjab, Pakistan.',
  },
  islamabad: {
    title: 'Islamabad Weather Today | WorldCityHub',
    description: 'Islamabad weather today: live conditions, hourly and 7-day forecast, air quality, sunrise and sunset, and what to wear in Islamabad, Pakistan.',
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params
  const city = titleCase(p.city), province = titleCase(p.province), country = titleCase(p.country)
  const targeted = WEATHER_TODAY_META[p.city]
  const title = targeted?.title ?? `${city} Weather & 7-Day Forecast | WorldCityHub`
  const description = targeted?.description ?? `${city} weather today: conditions, hourly & 7-day forecast, air quality & what to wear — ${city}, ${province}, ${country}.`
  const canonical = `https://worldcityhub.vercel.app/${p.country}/${p.province}/${p.city}/weather`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: 'WorldCityHub', type: 'website' },
  }
}

export default async function WeatherPage({ params }: PageProps) {
  try {
    const p = await params
    const cityName = p.city.charAt(0).toUpperCase() + p.city.slice(1)
    
    // Fetch actual city data to get coordinates and timezone
    const cityData = await getCityData(p.country, p.province, p.city)
    
    if (!cityData) {
      return <div className="p-8 text-center">City not found</div>
    }

    // Fetch the headline data on the server so the raw HTML contains the
    // real current weather, sun/moon and air quality — the client still
    // refreshes everything on mount and loads the remaining sections.
    const [initialWeather, initialSunMoon, initialAqi] = await Promise.all([
      fetchWeatherData(cityData.lat, cityData.lng),
      fetchSunMoonData(cityData.lat, cityData.lng, cityData.timezone),
      fetchAQIData(cityData.lat, cityData.lng, cityName),
    ])

    // P6: subpages had no JSON-LD — BreadcrumbList + City (name/URL only).
    // Emitted only on the success path; the not-found/error fallbacks
    // below stay schema-free, as they are not the city weather page.
    const schemaCityName = cityData.name ?? titleCaseSlug(p.city)
    const schemaProvinceName = cityData.province ?? titleCaseSlug(p.province)
    const schemaCountryName = cityData.country ?? titleCaseSlug(p.country)
    return (
      <>
        <JsonLd data={breadcrumbJsonLd(citySubpageCrumbs(schemaCountryName, p.country, schemaProvinceName, p.province, schemaCityName, p.city, 'Weather', 'weather'))} />
        <JsonLd data={cityJsonLd(schemaCityName, p.city, schemaProvinceName, p.province, schemaCountryName, p.country)} />
        <CityPageImage citySlug={p.city} variant="weather" />
        <WeatherPageClient
          cityName={cityName}
          country={p.country}
          province={p.province}
          citySlug={p.city}
          lat={cityData.lat}
          lng={cityData.lng}
          timezone={cityData.timezone}
          initialWeather={initialWeather}
          initialSunMoon={initialSunMoon}
          initialAqi={initialAqi}
        />
      </>
    )
  } catch (error) {
    console.error('Weather page error:', error)
    return <div className="p-8 text-center">Error loading weather page</div>
  }
}
