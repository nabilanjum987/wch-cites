// lib/seo/breadcrumbs.ts
// Template-level JSON-LD for the city cluster (P6, 28 Oct final sitting).
//
// Defect fixed: only the 3 city main pages carried JSON-LD; the country
// page, the province pages and all 7 city subpage templates carried none
// at all — not even a BreadcrumbList. These builders give every template
// in the cluster the same two blocks:
//
//   1. BreadcrumbList — the page's own canonical trail (home → country →
//      province → city → subpage, truncated to the page's own depth).
//   2. One typed block for the page's subject, name-and-URL only:
//      Country (country page), AdministrativeArea (province pages),
//      City (city subpages; url = the city main page).
//
// Deliberately figure-free: no population, rate, weather or FAQ text is
// emitted here, so this diff cannot drift from page figures and the
// later population-single-source card (F3) applies cleanly on top.
// Names come from the page's own data where the template already fetches
// it (cityData.name / .province / .country) and otherwise from the URL
// slug in title case — exactly the derivation the templates already use
// for their <title> metadata. Nothing is invented: a slug-derived name
// is the page's own route segment, formatted the way the page titles it.

export const SITE_URL = 'https://worldcityhub.vercel.app';

export function titleCaseSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');
}

export interface Crumb {
  name: string;
  /** Site-relative path, e.g. '/pakistan/punjab/lahore/weather'. */
  path: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

/** Home → country. */
export function countryCrumbs(countryName: string, countrySlug: string): Crumb[] {
  return [
    { name: 'WorldCityHub', path: '/' },
    { name: countryName, path: `/${countrySlug}` },
  ];
}

/** Home → country → province. */
export function provinceCrumbs(
  countryName: string,
  countrySlug: string,
  provinceName: string,
  provinceSlug: string,
): Crumb[] {
  return [
    ...countryCrumbs(countryName, countrySlug),
    { name: provinceName, path: `/${countrySlug}/${provinceSlug}` },
  ];
}

/** Home → country → province → city. */
export function cityCrumbs(
  countryName: string,
  countrySlug: string,
  provinceName: string,
  provinceSlug: string,
  cityName: string,
  citySlug: string,
): Crumb[] {
  return [
    ...provinceCrumbs(countryName, countrySlug, provinceName, provinceSlug),
    { name: cityName, path: `/${countrySlug}/${provinceSlug}/${citySlug}` },
  ];
}

/** Home → country → province → city → subpage. */
export function citySubpageCrumbs(
  countryName: string,
  countrySlug: string,
  provinceName: string,
  provinceSlug: string,
  cityName: string,
  citySlug: string,
  subpageLabel: string,
  subpageSlug: string,
): Crumb[] {
  return [
    ...cityCrumbs(countryName, countrySlug, provinceName, provinceSlug, cityName, citySlug),
    {
      name: subpageLabel,
      path: `/${countrySlug}/${provinceSlug}/${citySlug}/${subpageSlug}`,
    },
  ];
}

export function countryJsonLd(countryName: string, countrySlug: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Country',
    name: countryName,
    url: `${SITE_URL}/${countrySlug}`,
  };
}

export function provinceJsonLd(
  provinceName: string,
  provinceSlug: string,
  countryName: string,
  countrySlug: string,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'AdministrativeArea',
    name: provinceName,
    url: `${SITE_URL}/${countrySlug}/${provinceSlug}`,
    containedInPlace: {
      '@type': 'Country',
      name: countryName,
      url: `${SITE_URL}/${countrySlug}`,
    },
  };
}

export function cityJsonLd(
  cityName: string,
  citySlug: string,
  provinceName: string,
  provinceSlug: string,
  countryName: string,
  countrySlug: string,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: cityName,
    url: `${SITE_URL}/${countrySlug}/${provinceSlug}/${citySlug}`,
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: provinceName,
      url: `${SITE_URL}/${countrySlug}/${provinceSlug}`,
      containedInPlace: {
        '@type': 'Country',
        name: countryName,
        url: `${SITE_URL}/${countrySlug}`,
      },
    },
  };
}
