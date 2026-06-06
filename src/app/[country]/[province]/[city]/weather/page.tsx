'use server';

import WeatherPageClient from "@/components/weather/WeatherPageClient"
import { getCityData } from "@/lib/getCityData"

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>
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
