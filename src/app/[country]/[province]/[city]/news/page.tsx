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
  return {
    title: `${cityName} News Today | WorldCityHub`,
    description: `${cityName} news today: the latest ${cityName} headlines and local updates, aggregated from published sources and updated through the day.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/${country}/${province}/${city}/news` },
  };
}

export default async function NewsPage({ params }: PageProps) {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);

  const cityName = cityData?.name ?? titleCaseSlug(city);
  const provinceName = cityData?.province ?? titleCaseSlug(province);
  const countryName = cityData?.country ?? titleCaseSlug(country);

  // AEO (subpages fix B): server-rendered question headings with direct
  // answers, composed only from this page's own data: the city's record
  // (name, province, country, famous_for) and what this page's feed
  // actually does (published-source headlines, category tabs, a live
  // feed that refreshes every 15 minutes, and the News Sources section
  // at the foot of the page). No facts are invented. The same array
  // feeds the FAQPage schema below, so visible text and schema agree.
  const qa: { q: string; a: string }[] = [
    {
      q: `What is the latest news in ${cityName}?`,
      a: `The latest news in ${cityName} is the set of published headlines gathered on this page for ${cityName}, ${provinceName}, ${countryName}. Stories are shown newest first in the Top Stories and Live Feed sections, every headline links to its original publisher, and the live feed refreshes every 15 minutes while the page is open.`,
    },
    ...(cityData?.famous_for
      ? [{
          q: `What is ${cityName} known for?`,
          a: `${cityName} is known for ${cityData.famous_for}. Coverage of the city on this page can be filtered with the category tabs above the feed, which cover government, finance, sports, culture, religion, health, education, environment, transport, entertainment and world news.`,
        }]
      : []),
    {
      q: `Where does the news on this page come from?`,
      a: `News on this page is aggregated from published news sources, and every story links back to the outlet that published it. The News Sources section at the foot of this page lists the local, international and Urdu sources used for ${cityName}, so readers can see exactly where the coverage comes from.`,
    },
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
      <JsonLd data={breadcrumbJsonLd(citySubpageCrumbs(countryName, country, provinceName, province, cityName, city, 'News', 'news'))} />
      <JsonLd data={cityJsonLd(cityName, city, provinceName, province, countryName, country)} />
      <JsonLd data={faqJsonLd} />
      <CityPageImage citySlug={city} variant="news" />
      <section style={{ backgroundColor: '#0a0f1e' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <h2 className="text-lg font-bold text-white">{cityName} News Today: Quick Answers</h2>
          {qa.map((item) => (
            <div key={item.q} className="mt-4">
              <h3 className="text-base font-bold text-white">{item.q}</h3>
              <p className="text-sm text-gray-300 leading-relaxed mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
      <NewsPageWrapper
        country={country}
        province={province}
        city={city}
        cityData={cityData}
      />
    </>
  );
}
