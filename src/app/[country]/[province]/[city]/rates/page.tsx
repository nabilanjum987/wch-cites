'use client';

import { useParams } from 'next/navigation';
import CountryRatesPage from '../../../components/rates/RatesPageClient';

export default function RatesPage() {
  const params = useParams<{ country: string; province: string; city: string }>();
  return <CountryRatesPage countrySlug={params.country} />;
}