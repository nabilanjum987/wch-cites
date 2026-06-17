'use client';
import { useParams } from 'next/navigation';
import RatesPageClient from '@/components/rates/RatesPageClient';

export default function CountryRatesPage() {
  const params = useParams<{ country: string }>();
  return <RatesPageClient countrySlug={params?.country ?? 'pakistan'} />;
}
