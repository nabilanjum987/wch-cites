import type { Metadata } from 'next';
import { getCityData } from '@/lib/getCityData';
import NewsPageWrapper from '@/components/city/NewsPageWrapper';
import CityPageImage from '@/components/city/CityPageImage';

import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, cityJsonLd, citySubpageCrumbs, titleCaseSlug } from '@/lib/seo/breadcrumbs';

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);
  const cityName = cityData?.name ?? city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const countryName = cityData?.country ?? country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  // A12 (final30, folded into A3): Lahore only targets "lahore news today".
  // Every other city keeps the generic title/meta below.
  const isLahore = city === 'lahore';
  return {
    title: isLahore ? 'Lahore News Today | WorldCityHub' : `${cityName} News — Latest Headlines | WorldCityHub`,
    description: isLahore
      ? 'Lahore news today: the latest Lahore headlines, breaking stories and local updates, aggregated from published sources and updated through the day.'
      : `Latest ${cityName} news: breaking stories, local headlines and the global events affecting ${cityName}, ${countryName}.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/${country}/${province}/${city}/news` },
  };
}

export default async function NewsPage({ params }: PageProps) {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);

  // P6: subpages had no JSON-LD — BreadcrumbList + City (name/URL only).
  const cityName = cityData?.name ?? titleCaseSlug(city);
  const provinceName = cityData?.province ?? titleCaseSlug(province);
  const countryName = cityData?.country ?? titleCaseSlug(country);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(citySubpageCrumbs(countryName, country, provinceName, province, cityName, city, 'News', 'news'))} />
      <JsonLd data={cityJsonLd(cityName, city, provinceName, province, countryName, country)} />
      <CityPageImage citySlug={city} variant="news" />
      <NewsPageWrapper
        country={country}
        province={province}
        city={city}
        cityData={cityData}
      />
    </>
  );
}
