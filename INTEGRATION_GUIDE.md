# 📱 Integration Guide - Applying Design System to City Pages

## Quick Start

### Step 1: Update City Page Structure

Replace your existing city page with this pattern:

```tsx
'use client';

import { CityPageTheme, WeatherSection, SkeletonLoader } from '@/components/city';
import { useEffect, useState } from 'react';

export default function CityWeatherPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Fetch data
    fetchWeather().then(data => {
      setWeatherData(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <CityPageTheme
      theme="weather"
      title="Weather & Climate"
      description="Real-time weather data, forecasts, and climate information"
    >
      {isLoading ? <SkeletonLoader count={3} /> : <WeatherSection {...weatherData} />}
    </CityPageTheme>
  );
}
```

---

## For Each City Section

### 🌤️ Weather Page
```tsx
import { CityPageTheme, WeatherSection } from '@/components/city';

export default function WeatherPage() {
  return (
    <CityPageTheme theme="weather" title="Weather" description="...">
      <WeatherSection 
        temperature={temp}
        condition={condition}
        humidity={humidity}
        windSpeed={windSpeed}
        visibility={visibility}
      />
    </CityPageTheme>
  );
}
```

### 🕌 Prayer Page
```tsx
import { CityPageTheme, PrayerSection } from '@/components/city';

export default function PrayerPage() {
  return (
    <CityPageTheme theme="prayer" title="Prayer Times" description="...">
      <PrayerSection 
        prayerTimes={prayerTimes}
        nextPrayer={nextPrayer}
      />
    </CityPageTheme>
  );
}
```

### 💰 Rates Page
```tsx
import { CityPageTheme, RatesSection } from '@/components/city';

export default function RatesPage() {
  return (
    <CityPageTheme theme="rates" title="Gold & Metal Rates" description="...">
      <RatesSection rates={metalRates} />
    </CityPageTheme>
  );
}
```

### 📰 News Page
```tsx
import { CityPageTheme, NewsSection } from '@/components/city';

export default function NewsPage() {
  return (
    <CityPageTheme theme="news" title="Local News" description="...">
      <NewsSection news={newsItems} />
    </CityPageTheme>
  );
}
```

### 🎉 Events Page
```tsx
import { CityPageTheme, EventsSection } from '@/components/city';

export default function EventsPage() {
  return (
    <CityPageTheme theme="events" title="Events & Gatherings" description="...">
      <EventsSection events={events} />
    </CityPageTheme>
  );
}
```

### ⚽ Sports Page
```tsx
import { CityPageTheme, SportsSection } from '@/components/city';

export default function SportsPage() {
  return (
    <CityPageTheme theme="sports" title="Sports & Recreation" description="...">
      <SportsSection teams={teams} sport={sport} />
    </CityPageTheme>
  );
}
```

### 💹 Economy Page
```tsx
import { CityPageTheme, EconomySection } from '@/components/city';

export default function EconomyPage() {
  return (
    <CityPageTheme theme="economy" title="Economy & Business" description="...">
      <EconomySection sectors={sectors} />
    </CityPageTheme>
  );
}
```

### 📍 Places Page
```tsx
import { CityPageTheme, PlacesSection } from '@/components/city';

export default function PlacesPage() {
  return (
    <CityPageTheme theme="places" title="Famous Places" description="...">
      <PlacesSection places={places} />
    </CityPageTheme>
  );
}
```

### 👤 Personalities Page
```tsx
import { CityPageTheme, PersonalitiesSection } from '@/components/city';

export default function PersonalitiesPage() {
  return (
    <CityPageTheme theme="personalities" title="Notable People" description="...">
      <PersonalitiesSection personalities={personalities} />
    </CityPageTheme>
  );
}
```

---

## Step 2: Data Props

### Weather Props
```tsx
interface WeatherSectionProps {
  temperature?: number;        // e.g., 28
  condition?: string;           // e.g., "Partly Cloudy"
  humidity?: number;            // e.g., 65
  windSpeed?: number;           // e.g., 12 (km/h)
  visibility?: number;          // e.g., 10 (km)
}
```

### Prayer Props
```tsx
interface PrayerTime {
  name: string;    // Fajr, Zuhr, Asr, Maghrib, Isha
  time: string;    // HH:MM format
  icon?: ReactNode;
}

interface PrayerSectionProps {
  prayerTimes?: PrayerTime[];
  nextPrayer?: string;  // "Zuhr in 2 hours"
}
```

### Rates Props
```tsx
interface RateData {
  metal: string;      // "Gold (1g)"
  price: number;      // 8500
  change: number;     // 2.5
  trend: 'up' | 'down';
}

interface RatesSectionProps {
  rates?: RateData[];
}
```

### News Props
```tsx
interface NewsItem {
  title: string;
  time: string;       // "30 mins ago"
  category: string;   // "Development"
  urgency: 'critical' | 'high' | 'normal';
}

interface NewsSectionProps {
  news?: NewsItem[];
}
```

### Events Props
```tsx
interface Event {
  name: string;
  date: string;       // "Dec 15"
  time: string;       // "18:00"
  location: string;
  attendees: number;
  rating: number;     // 4.8
}

interface EventsSectionProps {
  events?: Event[];
}
```

### Sports Props
```tsx
interface SportsTeam {
  name: string;
  wins: number;
  losses: number;
  points: number;
  position: number;
}

interface SportsSectionProps {
  teams?: SportsTeam[];
  sport?: string;     // "Football"
}
```

### Economy Props
```tsx
interface EconomySector {
  name: string;
  gdp: number;       // e.g., 450 (billions)
  growth: number;    // e.g., 12.5 (percent)
  employment: number; // e.g., 28000
}

interface EconomySectionProps {
  sectors?: EconomySector[];
}
```

### Places Props
```tsx
interface Place {
  name: string;
  type: string;       // "Historic Site"
  distance: string;   // "2.5 km"
  rating: number;     // 4.9
  visitors: string;   // "50K+/month"
}

interface PlacesSectionProps {
  places?: Place[];
}
```

### Personalities Props
```tsx
interface Personality {
  name: string;
  title: string;      // "Nobel Prize Winner"
  achievements: number;
  field: string;      // "Physics"
  bio: string;
}

interface PersonalitiesSectionProps {
  personalities?: Personality[];
}
```

---

## Step 3: Add Loading States

Always use skeleton loaders while fetching:

```tsx
import { SkeletonLoader, SkeletonCard } from '@/components/city';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <CityPageTheme theme="weather" title="Weather" description="...">
      {isLoading ? (
        <>
          <SkeletonCard />
          <SkeletonLoader count={4} height="h-24" />
        </>
      ) : (
        <WeatherSection {...data} />
      )}
    </CityPageTheme>
  );
}
```

---

## Step 4: Add Data Fetching

Example with async data loading:

```tsx
'use client';

import { CityPageTheme, WeatherSection, SkeletonLoader } from '@/components/city';
import { useEffect, useState } from 'react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
}

export default function WeatherPage({
  params: { country, province, city },
}: {
  params: { country: string; province: string; city: string };
}) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch(
          `/api/city/${country}/${province}/${city}/weather`
        );
        const weatherData = await response.json();
        setData(weatherData);
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [country, province, city]);

  return (
    <CityPageTheme
      theme="weather"
      title="Weather & Climate"
      description={`Real-time weather data for ${city}`}
    >
      {isLoading ? <SkeletonLoader count={3} /> : <WeatherSection {...data} />}
    </CityPageTheme>
  );
}
```

---

## Step 5: Customize Colors (Optional)

To override theme colors, modify `lib/design-system.ts`:

```tsx
export const COLORS = {
  // ... existing colors
  customTheme: '#your-color',
};
```

---

## Best Practices

✅ **Always use loading states**  
✅ **Fetch data server-side when possible**  
✅ **Use proper TypeScript types**  
✅ **Handle errors gracefully**  
✅ **Test on mobile devices**  
✅ **Monitor animation performance**  

---

## Troubleshooting

### Components Not Animating?
- Check if `'use client'` is at top of file
- Verify viewport margin in animations
- Check for CSS conflicts

### Colors Wrong?
- Verify theme prop matches enum
- Check `tailwind.config.js` has colors
- Clear Tailwind cache: `npx tailwindcss purge`

### Performance Issues?
- Use `React.memo()` for heavy components
- Add `once: true` to viewport animations
- Lazy load images

---

## Example: Complete Page

```tsx
'use client';

import { motion } from 'framer-motion';
import { CityPageTheme, WeatherSection, SkeletonLoader } from '@/components/city';
import { useEffect, useState } from 'react';

export default function CityWeatherPage() {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setWeather({
        temperature: 28,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        visibility: 10,
      });
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <CityPageTheme
      theme="weather"
      title="Weather Forecast"
      description="Real-time conditions and 7-day outlook"
    >
      {isLoading ? (
        <SkeletonLoader count={3} />
      ) : (
        <WeatherSection {...weather} />
      )}
    </CityPageTheme>
  );
}
```

---

**Ready to implement?** Start with one page and copy the pattern for others!

**Questions?** Check `DESIGN_GUIDE.md` for more details.

**Need help?** Review QUICK_REFERENCE.md for common patterns.
