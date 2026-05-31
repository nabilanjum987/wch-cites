import WeatherPageClient from '@/components/weather/WeatherPageClient'

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>
}

export default async function WeatherPage({ params }: PageProps) {
  const p = await params
  return (
    <WeatherPageClient
      cityName={p.city.charAt(0).toUpperCase() + p.city.slice(1)}
      country={p.country}
      province={p.province}
      lat={31.5497}
      lng={74.3436}
      timezone="Asia/Karachi"
      primaryColor="#01411C"
      citySlug={p.city}
    />
  )
}