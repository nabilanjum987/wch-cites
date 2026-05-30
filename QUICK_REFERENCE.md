# 🚀 Quick Reference - WorldCityHub Design System

## Import Cheat Sheet

### Themed Sections
```tsx
import {
  WeatherSection,
  PrayerSection,
  RatesSection,
  NewsSection,
  EventsSection,
  SportsSection,
  EconomySection,
  PlacesSection,
  PersonalitiesSection,
} from '@/components/city';
```

### UI Components
```tsx
import { GlassCard, DataCard, CounterCard } from '@/components/ui/GlassCard';
```

### Page Builders
```tsx
import { CityPageTheme } from '@/components/city/CityPageTheme';
import {
  PageTransition,
  SectionReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/shared/PageTransitions';
```

### Animations & Utilities
```tsx
import { SkeletonLoader, SkeletonCard } from '@/components/city/SkeletonLoader';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { COLORS, ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';
```

---

## Color Reference

### Theme Colors
```
🌤️ Weather:     #06b6d4 (cyan)
🕌 Prayer:       #8b5cf6 (purple)
💰 Rates:        #f59e0b (amber)
📰 News:         #ef4444 (red)
🎉 Events:       #10b981 (green)
⚽ Sports:       #3b82f6 (blue)
💹 Economy:      #ec4899 (pink)
📍 Places:       #14b8a6 (teal)
👤 Personalities: #f97316 (orange)
```

### Country Colors
```
🇵🇰 Pakistan:     #01411C / #FFFFFF
🇦🇪 UAE:          #00732F / #FFFFFF
🇸🇦 Saudi Arabia: #006C35 / #FFFFFF
```

### Utility
```
🎨 Background:  #030712
🌊 Glassmorphism: rgba(255,255,255,0.08)
🔆 Text:        #ffffff
📝 Text Light:  #a0aec0
```

---

## Glassmorphism Classes

### Base
```css
backdrop-blur-xl bg-white/8 border border-white/20 rounded-2xl
```

### Premium
```css
backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 
border border-white/30 rounded-2xl shadow-xl
```

### With Glow
```css
hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300
```

---

## Common Patterns

### Create a Themed Page
```tsx
import { CityPageTheme, WeatherSection } from '@/components/city';

export default function WeatherPage() {
  return (
    <CityPageTheme
      theme="weather"
      title="Weather"
      description="Real-time weather data"
    >
      <WeatherSection />
    </CityPageTheme>
  );
}
```

### Create a Glass Card
```tsx
<GlassCard variant="premium" glowColor="cyan">
  <h3>Title</h3>
  <p>Content</p>
</GlassCard>
```

### Add Data Card
```tsx
<DataCard
  icon={<Cloud className="w-6 h-6" />}
  title="Temperature"
  value="28°C"
  subtitle="Feels like 32°C"
  glowColor="cyan"
/>
```

### Animate on Scroll
```tsx
<motion.div
  initial="initial"
  whileInView="animate"
  viewport={{ once: true, margin: '-100px' }}
  variants={STAGGER_CONTAINER}
>
  {items.map(item => (
    <motion.div key={item.id} variants={ANIMATIONS.scaleIn}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

### Skeleton Loading
```tsx
{isLoading ? (
  <SkeletonCard />
) : (
  <DataCard {...data} />
)}
```

### Animated Counter
```tsx
<AnimatedCounter to={5000} duration={2} prefix="$" />
```

---

## Theme Property Values

| Property | Type | Options |
|----------|------|---------|
| `theme` | string | weather, prayer, rates, news, events, sports, economy, places, personalities |
| `variant` | string | default, premium, highlight |
| `glowColor` | string | cyan, purple, pink, amber |

---

## Responsive Grid

```
Mobile:  1 column
Tablet:  2-3 columns  (md: breakpoint)
Desktop: 3-4 columns  (lg: breakpoint)
```

All grids use: `gap-4 md:gap-6`

---

## Animation Timings

| Animation | Duration | Easing |
|-----------|----------|--------|
| Page Enter | 0.6s | [0.23, 1, 0.82, 1] |
| Card Scale | 0.4s | [0.23, 1, 0.82, 1] |
| Slide Up | 0.5s | [0.23, 1, 0.82, 1] |
| Counter | 2s | easel-out |
| Stagger | 0.15s | per item |
| Orb Motion | 12-19s | easeInOut |

---

## Components at a Glance

### Display Components
- `WeatherSection` - 7-day forecast, conditions
- `PrayerSection` - 5 prayer times, qibla, guidelines
- `RatesSection` - Gold/metal prices, trends
- `NewsSection` - Breaking news, categories
- `EventsSection` - Events calendar, listings
- `SportsSection` - League standings, matches
- `EconomySection` - GDP, sectors, trends
- `PlacesSection` - Famous places, categories
- `PersonalitiesSection` - Notable people, timeline

### UI Components
- `GlassCard` - Base card with 3 variants
- `DataCard` - Card with icon, metrics, progress
- `CounterCard` - Auto-incrementing counter
- `SkeletonLoader` - Shimmer loading state
- `SkeletonCard` - Card placeholder

### Animation Components
- `PageTransition` - Page entry animation
- `SectionReveal` - Scroll-triggered reveal
- `StaggerContainer` - Animate children with delay
- `StaggerItem` - Individual item in stagger
- `AnimatedCounter` - Scroll-triggered counter

---

## Performance Tips

✅ Use `viewport={{ once: true }}` for scroll animations  
✅ Add `margin: '-100px'` to trigger earlier  
✅ Use skeleton loaders for UX  
✅ Memoize heavy components  
✅ Lazy load images  
✅ Test on real devices  

---

## Support Utilities

| Function | Purpose |
|----------|---------|
| `ANIMATIONS.heroWord` | Word animation |
| `ANIMATIONS.slideUp` | Slide up effect |
| `ANIMATIONS.scaleIn` | Scale from 0.95 to 1 |
| `STAGGER_CONTAINER` | Container for staggered items |
| `GLASSMORPHISM` | Utility class string |

---

## Deployment Ready ✅

- All components tested
- Responsive on all devices
- Optimized for performance
- Accessibility considered
- Production-ready code

---

**Last Updated**: May 28, 2026  
**Status**: Complete & Production Ready  
**Design Style**: Linear.app × Apple.com
