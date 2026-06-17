'use client';
import { useMemo } from 'react';
import { fetchSkyRightNow } from '@/lib/apis/astro';
import SkyRightNow from './SkyRightNow';

interface Props {
  primaryColor?: string;
}

export default function SkyRightNowWrapper({ primaryColor = '#7c3aed' }: Props) {
  const data = useMemo(() => fetchSkyRightNow(), []);
  return <SkyRightNow data={data} primaryColor={primaryColor} />;
}
