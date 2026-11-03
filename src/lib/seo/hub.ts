// Hub-level JSON-LD builders (hubs family fix, 3 Nov 2026).
// The hub/index pages (/countries, /cities, /rates, /news, /conflicts,
// /improve, /places, /events) carried either no schema at all or only a
// single typed block. These builders give every hub the same baseline
// pair, a WebPage block and a BreadcrumbList (Home, then the hub), built
// through the shared breadcrumb builder so the format matches the city
// cluster exactly. Figure-free: name, URL and the page's own published
// description only, so this schema can never drift from page figures.

import { breadcrumbJsonLd, SITE_URL, type Crumb } from './breadcrumbs';

export function hubWebPageJsonLd(name: string, path: string, description: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url: `${SITE_URL}${path}`,
    description,
    isPartOf: { '@type': 'WebSite', name: 'WorldCityHub', url: SITE_URL },
  };
}

export function hubBreadcrumbJsonLd(name: string, path: string): object {
  const crumbs: Crumb[] = [
    { name: 'WorldCityHub', path: '/' },
    { name, path },
  ];
  return breadcrumbJsonLd(crumbs);
}
