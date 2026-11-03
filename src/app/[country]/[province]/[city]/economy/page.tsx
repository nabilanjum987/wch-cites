import type { Metadata } from 'next';
import { getCityData } from '@/lib/getCityData';
import EconomyPageClient from '@/components/economy/EconomyPageClient';
import CityPageImage from '@/components/city/CityPageImage';

import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, cityJsonLd, citySubpageCrumbs, titleCaseSlug } from '@/lib/seo/breadcrumbs';
import { getCountryEconomy, resolveIso2, type WBValues } from '@/lib/apis/worldbank';

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);
  const cityName = cityData?.name ?? city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const countryName = cityData?.country ?? country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const isPakistan = countryName === 'Pakistan';
  return {
    title: isPakistan
      ? `${cityName} Economy & Pakistan GDP Data | WorldCityHub`
      : `${cityName} Economy & ${countryName} GDP Data | WorldCityHub`,
    description: isPakistan
      ? `Pakistan's national World Bank indicators, each labelled with its data year, for readers in ${cityName}: GDP, inflation, jobs and trade.`
      : `${countryName}'s national World Bank indicators, each labelled with its data year, for readers in ${cityName}: GDP, inflation, jobs and trade.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/${country}/${province}/${city}/economy` },
  };
}

export default async function EconomyPage({ params }: PageProps) {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);

  // Real indicators from the World Bank (Batch 3b), replaces the static
  // COUNTRY_ECONOMY snapshot table. PC1 fix: the ISO2 code is resolved
  // canonically from the country slug (the explicit map wins over any
  // stored/fallback record's country_code, the pre-fix order let a
  // generated "PA" (Panama) code through for Islamabad), and the page's
  // values AND its Misery table come from ONE cached dataset
  // (getCountryEconomy), so the meter can never contradict the table.
  const iso2 = resolveIso2(country, cityData?.country_code as string | undefined);
  let wb: WBValues | null = null;
  let miseryData = null as Awaited<ReturnType<typeof getCountryEconomy>>['misery'] | null;
  try {
    const eco = await getCountryEconomy(iso2);
    wb = Object.keys(eco.values).length > 0 ? eco.values : null;
    miseryData = eco.misery.length > 0 ? eco.misery : null;
  } catch { /* WB unavailable, client shows an honest reduced page */ }

  const cityName = cityData?.name ?? titleCaseSlug(city);
  const provinceName = cityData?.province ?? titleCaseSlug(province);
  const countryName = cityData?.country ?? titleCaseSlug(country);

  // EC1/EC3 (subpages fix B): honest labelling + AEO. Every figure on
  // this page is a NATIONAL World Bank indicator for the country as a
  // whole; there are no city-level GDP or inflation figures, and none
  // are invented. The Q&A below is composed only from the World Bank
  // values the server just fetched (each with its data year) plus that
  // labelling fact, and the same array feeds the FAQPage schema.
  const fmtBn = (v: number) => `$${Math.round(v / 1e9)} billion`;
  const qa: { q: string; a: string }[] = [
    {
      q: `Are these ${cityName} economy figures or ${countryName} national figures?`,
      a: `They are ${countryName} national figures from the World Bank, presented for readers in ${cityName}. The World Bank publishes these indicators for the country as a whole, so this page does not invent city-level GDP, inflation or jobs figures for ${cityName}; every figure is shown with its World Bank data year.`,
    },
    ...(wb?.gdpUsd
      ? [{
          q: `What is ${countryName}'s GDP?`,
          a: `${countryName}'s GDP was ${fmtBn(wb.gdpUsd.value)} in ${wb.gdpUsd.year} (World Bank). That is the national total for ${countryName} as a whole, not a ${cityName} only figure, and it is the same value shown in the indicators on this page.`,
        }]
      : []),
    ...(wb?.inflation
      ? [{
          q: `What is ${countryName}'s inflation rate?`,
          a: `${countryName}'s inflation rate was ${Math.round(wb.inflation.value * 10) / 10}% in ${wb.inflation.year} (World Bank, annual consumer price change). It is a national figure for ${countryName} as a whole, presented here for readers in ${cityName}.`,
        }]
      : []),
  ];
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(citySubpageCrumbs(countryName, country, provinceName, province, cityName, city, 'Economy', 'economy'))} />
      <JsonLd data={cityJsonLd(cityName, city, provinceName, province, countryName, country)} />
      <JsonLd data={faqJsonLd} />
      <CityPageImage citySlug={city} variant="economy" />
      <section style={{ backgroundColor: '#0a0f1e' }}>
        <div className="max-w-5xl mx-auto px-4 pt-6">
          <h2 className="text-lg font-bold text-white">{cityName} Economy: Quick Answers</h2>
          <p className="text-xs text-gray-400 mt-1">{countryName} national data (World Bank)</p>
          {qa.map((item) => (
            <div key={item.q} className="mt-4">
              <h3 className="text-base font-bold text-white">{item.q}</h3>
              <p className="text-sm text-gray-300 leading-relaxed mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
      <EconomyPageClient
        country={country}
        province={province}
        citySlug={city}
        cityData={cityData}
        wb={wb}
        miseryData={miseryData}
      />
    </>
  );
}
