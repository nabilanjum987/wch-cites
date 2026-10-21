import type { Metadata } from 'next';
import { getCityData } from '@/lib/getCityData';
import NewsPageWrapper from '@/components/city/NewsPageWrapper';

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);
  const cityName = cityData?.name ?? city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const countryName = cityData?.country ?? country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${cityName} News — Headlines, Urdu News & Updates | WorldCityHub`,
    description: `Latest ${cityName} news: breaking stories, local headlines, Urdu news and the global events affecting ${cityName}, ${countryName}.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/${country}/${province}/${city}/news` },
  };
}

export default async function NewsPage({ params }: PageProps) {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);

  return (
    <NewsPageWrapper
      country={country}
      province={province}
      city={city}
      cityData={cityData}
    />
  );
}
