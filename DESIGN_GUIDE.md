# WorldCityHub Design System - Usage Guide

## 🎨 Core Design Principles

### Colors
- **Primary Background**: #030712 (near-black)
- **Glassmorphism**: `backdrop-blur-xl bg-white/8 border border-white/20`
- **Theme Colors**:
  - Weather: #06b6d4 (cyan)
  - Prayer: #8b5cf6 (purple)
  - Rates: #f59e0b (amber)
  - News: #ef4444 (red)
  - Events: #10b981 (green)
  - Sports: #3b82f6 (blue)
  - Economy: #ec4899 (pink)
  - Places: #14b8a6 (teal)
  - Personalities: #f97316 (orange)

### Typography
- **Font**: Inter (Google Fonts)
- **Hero Text**: 6xl-8xl, gradient fill
- **Section Title**: 3xl-4xl, bold
- **Body**: 1rem, 75% opacity

## 📦 Component Usage

### GlassCard Components

```tsx
import { GlassCard, DataCard, CounterCard } from '@/components/ui/GlassCard';

// Basic Glass Card
<GlassCard variant="premium" glowColor="cyan">
  Content here
</GlassCard>

// Data Card with metrics
<DataCard
  icon={<Cloud className="w-6 h-6" />}
  title="Temperature"
  value="28°C"
  subtitle="Feels like 32°C"
  progress={75}
  glowColor="cyan"
/>

// Counter Card (animates on scroll)
<CounterCard
  icon={<Users className="w-6 h-6" />}
  title="Active Users"
  value={15000}
  glowColor="blue"
/>
```

### Themed Display Components

```tsx
// Weather Theme
import { WeatherSection } from '@/components/city/WeatherDisplay';
<WeatherSection temperature={28} condition="Partly Cloudy" />

// Prayer Theme
import { PrayerSection } from '@/components/city/PrayerDisplay';
<PrayerSection nextPrayer="Zuhr in 2 hours" />

// Rates Theme
import { RatesSection } from '@/components/city/RatesDisplay';
<RatesSection />

// News Theme
import { NewsSection } from '@/components/city/NewsDisplay';
<NewsSection />

// Events Theme
import { EventsSection } from '@/components/city/EventsDisplay';
<EventsSection />

// Sports Theme
import { SportsSection } from '@/components/city/SportsDisplay';
<SportsSection />

// Economy Theme
import { EconomySection } from '@/components/city/EconomyDisplay';
<EconomySection />

// Places Theme
import { PlacesSection } from '@/components/city/PlacesDisplay';
<PlacesSection />

// Personalities Theme
import { PersonalitiesSection } from '@/components/city/PersonalitiesDisplay';
<PersonalitiesSection />
```

### Page Wrapper

```tsx
import { CityPageTheme } from '@/components/city/CityPageTheme';

export default function WeatherPage() {
  return (
    <CityPageTheme
      theme="weather"
      title="Weather Forecast"
      description="Real-time weather data and forecast"
    >
      <WeatherSection />
    </CityPageTheme>
  );
}
```

### Animations & Transitions

```tsx
import { PageTransition, SectionReveal, StaggerContainer, StaggerItem } from '@/components/shared/PageTransitions';

// Animate entire page on mount
<PageTransition delay={0.2}>
  <Page />
</PageTransition>

// Reveal section on scroll
<SectionReveal delay={0.1}>
  <section>Content</section>
</SectionReveal>

// Stagger children items
<StaggerContainer delayChildren={0.1} staggerChildren={0.15}>
  <StaggerItem><Card 1 /></StaggerItem>
  <StaggerItem><Card 2 /></StaggerItem>
  <StaggerItem><Card 3 /></StaggerItem>
</StaggerContainer>
```

### Skeleton Loaders

```tsx
import { SkeletonLoader, SkeletonCard } from '@/components/city/SkeletonLoader';

// Line skeleton
<SkeletonLoader count={3} height="h-4" width="w-full" />

// Card skeleton
<SkeletonCard />
```

### Animated Counter

```tsx
import { AnimatedCounter, CountUpOnScroll } from '@/components/shared/AnimatedCounter';

// Basic counter (animates on mount)
<AnimatedCounter to={1000} duration={2} prefix="$" suffix="K" />

// Counter that animates on scroll into view
<CountUpOnScroll value={5000} delay={0.2} />
```

## 🎬 Animation Patterns

### Hero Text Animation
```tsx
{['Word', 'by', 'Word'].map((word, idx) => (
  <motion.span
    key={idx}
    variants={ANIMATIONS.heroWord}
    transition={{ delay: idx * 0.15 }}
  >
    {word}
  </motion.span>
))}
```

### Scroll-triggered Animation
```tsx
<motion.div
  initial="initial"
  whileInView="animate"
  viewport={{ once: true, margin: '-100px' }}
  variants={STAGGER_CONTAINER}
>
  Content
</motion.div>
```

### Staggered List Animation
```tsx
<motion.div
  variants={STAGGER_CONTAINER}
  initial="initial"
  animate="animate"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={ANIMATIONS.scaleIn}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

## 🎯 Styling Classes

### Glassmorphism
```css
/* Base glass effect */
backdrop-blur-xl bg-white/8 border border-white/20 rounded-2xl

/* Premium variant */
backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/30 rounded-2xl shadow-xl

/* With glow */
hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300
```

### Gradients
```css
/* Text gradient */
bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent

/* Background gradient */
bg-gradient-to-br from-white/12 to-white/6

/* Direction gradient (for trends) */
bg-gradient-to-t from-green-500 to-green-400
```

## 📱 Responsive Breakpoints
- Mobile: No breakpoint (mobile-first)
- Tablet: `md:` (768px)
- Desktop: `lg:` (1024px)

All components use responsive grids:
- 1 column on mobile
- 2-3 columns on tablet
- 3-4 columns on desktop

## ✨ Premium Effects

### Glow on Hover
```tsx
<GlassCard glowColor="cyan" />
```

### 3D Hover Lift
```tsx
whileHover={{ y: -4 }}
```

### Animated Background
```tsx
animate={{
  backgroundPosition: ['0% 0%', '100% 100%'],
}}
transition={{ duration: 20, repeat: Infinity }}
```

### Pulse Animation
```tsx
animate={{
  opacity: [0.5, 0.8, 0.5],
}}
transition={{ duration: 2, repeat: Infinity }}
```

## 🔧 Common Patterns

### Loading State
```tsx
{isLoading ? <SkeletonCard /> : <DataCard {...data} />}
```

### Conditional Theme
```tsx
<CityPageTheme theme={cityType}>
  {cityType === 'weather' && <WeatherSection />}
  {cityType === 'prayer' && <PrayerSection />}
</CityPageTheme>
```

### Data with Animation
```tsx
<motion.div variants={ANIMATIONS.scaleIn}>
  <motion.p className="text-3xl font-bold">
    {animateValue && <AnimatedCounter to={value} />}
  </motion.p>
</motion.div>
```

## 🚀 Performance Tips
1. Use `viewport={{ once: true }}` to animate once on scroll
2. Use `margin: '-100px'` for earlier animation trigger
3. Skeleton loaders reduce perceived loading time
4. Use `.map()` with `key` for lists
5. Memoize heavy components with `React.memo()`

---

**Note**: All components follow the Linear.app × Apple.com design aesthetic with premium glassmorphism effects and smooth micro-interactions.
