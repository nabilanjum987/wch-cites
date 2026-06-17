'use client';
import type { City } from '@/types/city';
import NewsPage from './NewsPage';

interface Props {
  country: string;
  province: string;
  city: string;
  cityData: City | null;
}

export default function NewsPageWrapper({ country, province, city, cityData }: Props) {
  return (
    <NewsPage
      country={country}
      province={province}
      city={city}
      cityData={cityData}
    />
  );
}
