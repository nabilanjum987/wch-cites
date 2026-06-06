import { City } from '@/types/city';

export function generateBreadcrumbSchema(
  city: City,
  page?: 'weather' | 'prayer-times' | 'rates' | 'news' | 'sports' | 'economy'
) {
  const baseItems = [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'World',
      'item': 'https://worldcityhub.com',
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': city.country,
      'item': `https://worldcityhub.com/pakistan`,
    },
    {
      '@type': 'ListItem',
      'position': 3,
      'name': city.province,
      'item': `https://worldcityhub.com/pakistan/${city.province.toLowerCase().replace(/\s+/g, '-')}`,
    },
    {
      '@type': 'ListItem',
      'position': 4,
      'name': city.name,
      'item': `https://worldcityhub.com/pakistan/${city.province.toLowerCase().replace(/\s+/g, '-')}/${city.city_slug}`,
    },
  ];

  if (page) {
    baseItems.push({
      '@type': 'ListItem',
      'position': 5,
      'name': page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' '),
      'item': `https://worldcityhub.com/pakistan/${city.province.toLowerCase().replace(/\s+/g, '-')}/${city.city_slug}/${page}`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': baseItems,
  };
}

export function generateCitySchema(city: City, weatherData?: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    'name': city.name,
    'alternateName': [`${city.name} Pakistan`, `Sheher-e-Qadeem`, `Ancient City of ${city.name}`],
    'containedInPlace': {
      '@type': 'State',
      'name': city.province,
      'containedInPlace': {
        '@type': 'Country',
        'name': city.country,
        'sameAs': 'https://en.wikipedia.org/wiki/Pakistan',
      },
    },
    'population': city.population,
    'area': '1772 square kilometers',
    'elevation': '217 meters',
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': city.lat,
      'longitude': city.lng,
    },
    'timezone': city.timezone,
    'url': `https://worldcityhub.com/pakistan/${city.province.toLowerCase().replace(/\s+/g, '-')}/${city.city_slug}`,
    'areaServed': city.province,
    'description': `${city.name} is the capital of ${city.province} province in Pakistan, a historic city with rich cultural heritage and modern infrastructure.`,
    'image': [
      `https://worldcityhub.com/images/${city.city_slug}-badshahi-mosque.jpg`,
      `https://worldcityhub.com/images/${city.city_slug}-shalimar-gardens.jpg`,
      `https://worldcityhub.com/images/${city.city_slug}-fort.jpg`,
    ],
  };
}

export function generateFAQSchema(city: City, data?: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': `What is the weather in ${city.name} today?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${city.name} weather today: Temperature around ${data?.temp || '34'}°C with ${data?.condition || 'sunny'} conditions. Humidity ${data?.humidity || '52'}%, AQI ${data?.aqi || '95'}.`,
        },
      },
      {
        '@type': 'Question',
        'name': `What are prayer times in ${city.name} today?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${city.name} prayer times: Fajr ${data?.fajr || '4:45 AM'}, Dhuhr 12:30 PM, Asr 4:15 PM, Maghrib ${data?.maghrib || '7:05 PM'}, Isha 8:30 PM. Qibla direction: 262° West-Southwest.`,
        },
      },
      {
        '@type': 'Question',
        'name': `What is the gold rate in ${city.name} today?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Gold rate in ${city.name}: 24K PKR ${data?.gold24k || '21,500'}/gram, 22K PKR ${data?.gold22k || '19,708'}/gram, 21K PKR ${data?.gold21k || '18,812'}/gram.`,
        },
      },
      {
        '@type': 'Question',
        'name': `What is the population of ${city.name}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${city.name} population in 2026 is approximately ${city.population.toLocaleString()}, making it the second-largest city in Pakistan after Karachi.`,
        },
      },
      {
        '@type': 'Question',
        'name': `What is the USD to PKR exchange rate in ${city.name}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `USD to PKR exchange rate in ${city.name} is approximately ${data?.usdPkr || '277.50'} PKR per USD. This rate applies across all cities in Pakistan.`,
        },
      },
      {
        '@type': 'Question',
        'name': `What are the famous places to visit in ${city.name}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Famous places in ${city.name}: Badshahi Mosque, ${city.name} Fort, Data Darbar shrine, Shalimar Gardens (UNESCO World Heritage Site), and Wagah Border.`,
        },
      },
      {
        '@type': 'Question',
        'name': `What language is spoken in ${city.name}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Languages spoken in ${city.name}: Urdu (national), Punjabi (regional), with English widely used in business and education.`,
        },
      },
      {
        '@type': 'Question',
        'name': `What is the major religion in ${city.name}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `The major religion in ${city.name} is Islam, followed by approximately ${city.religion_percent}% of the population.`,
        },
      },
    ],
  };
}

export function generateWeatherSchema(city: City, weatherData: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WeatherForecast',
    'location': {
      '@type': 'Place',
      'name': city.name,
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': city.lat,
        'longitude': city.lng,
      },
    },
    'forecastDate': new Date().toISOString(),
    'currWeather': {
      '@type': 'WeatherObservation',
      'temperature': `${weatherData?.temp || '34'}°C`,
      'weatherCondition': weatherData?.condition || 'Sunny',
      'windSpeed': `${weatherData?.wind_speed || '15'} km/h`,
      'relativeHumidity': `${weatherData?.humidity || '52'}%`,
    },
    'forecast': [
      {
        '@type': 'DayForecast',
        'date': new Date(Date.now() + 86400000).toISOString().split('T')[0],
        'highTemp': `${(parseInt(weatherData?.temp || '34') + 2).toString()}°C`,
        'lowTemp': `${(parseInt(weatherData?.temp || '34') - 8).toString()}°C`,
      },
    ],
  };
}

export function generatePrayerSchema(city: City, prayerData: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    'name': `${city.name} Daily Prayers Schedule`,
    'description': `Daily Islamic prayer times for ${city.name}`,
    'location': {
      '@type': 'Place',
      'name': city.name,
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': city.lat,
        'longitude': city.lng,
      },
    },
    'organizer': {
      '@type': 'Organization',
      'name': 'Islamic Timekeeping',
      'sameAs': 'https://aladhan.com',
    },
    'eventSchedule': [
      {
        '@type': 'Schedule',
        '@id': '#fajr',
        'repeatFrequency': 'P1D',
        'startTime': prayerData?.fajr || '04:45',
      },
      {
        '@type': 'Schedule',
        '@id': '#dhuhr',
        'repeatFrequency': 'P1D',
        'startTime': prayerData?.dhuhr || '12:30',
      },
      {
        '@type': 'Schedule',
        '@id': '#asr',
        'repeatFrequency': 'P1D',
        'startTime': prayerData?.asr || '16:15',
      },
      {
        '@type': 'Schedule',
        '@id': '#maghrib',
        'repeatFrequency': 'P1D',
        'startTime': prayerData?.maghrib || '19:05',
      },
      {
        '@type': 'Schedule',
        '@id': '#isha',
        'repeatFrequency': 'P1D',
        'startTime': prayerData?.isha || '20:30',
      },
    ],
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'WorldCityHub',
    'url': 'https://worldcityhub.com',
    'logo': 'https://worldcityhub.com/logo.png',
    'description': 'Real-time city information platform providing weather, prayer times, gold rates, and news for cities worldwide.',
    'sameAs': [
      'https://twitter.com/worldcityhub',
      'https://facebook.com/worldcityhub',
      'https://instagram.com/worldcityhub',
    ],
    'contact': {
      '@type': 'ContactPoint',
      'contactType': 'Customer Service',
      'email': 'info@worldcityhub.com',
    },
  };
}

export function generateLocalBusinessSchema(city: City) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': `${city.name} Information Center`,
    'image': `https://worldcityhub.com/images/${city.city_slug}-hero.jpg`,
    'description': `Official information portal for ${city.name}, ${city.province}, Pakistan.`,
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': city.country,
      'addressRegion': city.province,
      'addressLocality': city.name,
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': city.lat,
      'longitude': city.lng,
    },
    'url': `https://worldcityhub.com/pakistan/${city.province.toLowerCase().replace(/\s+/g, '-')}/${city.city_slug}`,
  };
}

export function generateNewsArticleSchema(city: City, article: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'description': article.summary,
    'image': article.image || `https://worldcityhub.com/images/${city.city_slug}-news.jpg`,
    'datePublished': article.date || new Date().toISOString(),
    'dateModified': article.updatedDate || new Date().toISOString(),
    'author': {
      '@type': 'Organization',
      'name': article.source || 'WorldCityHub',
    },
    'articleBody': article.content,
    'isAccessibleForFree': true,
  };
}
