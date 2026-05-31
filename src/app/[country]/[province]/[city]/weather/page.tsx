'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function WeatherPage() {
  const params = useParams() as {
    country?: string;
    province?: string;
    city?: string;
  };

  const city = params.city ? decodeURIComponent(params.city) : 'City';

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{city}</h1>
      <p>Weather data loading...</p>
      <p>
        <Link href={`/${params.country}/${params.province}/${params.city}`}>
          Back to city page
        </Link>
      </p>
    </div>
  );
}
