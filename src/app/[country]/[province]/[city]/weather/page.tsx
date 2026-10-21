import type { Metadata } from "next"
import WeatherPageClient from "@/components/weather/WeatherPageClient"
import { getCityData } from "@/lib/getCityData"

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>
}

const titleCase = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params
  const city = titleCase(p.city), province = titleCase(p.province), country = titleCase(p.country)
  const title = `${city} Weather Today & 7-Day Forecast | WorldCityHub`
  const description = `${city} weather today: live conditions, hourly & 7-day forecast, sunrise and sunset, air quality and what to wear — ${city}, ${province}, ${country}.`
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
    
    return (
      <WeatherPageClient
        cityName={cityName}
        country={p.country}
        province={p.province}
        citySlug={p.city}
        lat={cityData.lat}
        lng={cityData.lng}
        timezone={cityData.timezone}
      />
    )
  } catch (error) {
    console.error('Weather page error:', error)
    return <div className="p-8 text-center">Error loading weather page</div>
  }
}
