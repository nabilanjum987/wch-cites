import { City } from '@/types/city';

export function generateNewsIntroductionParagraph(city: string): string {
  return `${city} news today covers the latest breaking stories from across the city, Pakistan, and the world. Updated every 15 minutes from Dawn, Geo, ARY, Tribune, and City42.`
}

export function generateLocalNewsCategoriesParagraph(city: string): string {
  return `Local news categories in ${city} today include government, business, sports, culture, religion, health, education, environment, and transport — reflecting the city's complexity.`
}

export function generateMediaOutletsParagraph(city: string): string {
  return `${city} is served by Pakistan's most competitive media market including Dawn, Geo TV, ARY News, The News, Tribune, Jang, Express Urdu, and City42 for hyperlocal coverage.`
}

export function generateSocialMediaNewsParagraph(city: string): string {
  return `Social media pulse in ${city} today shows trending topics on Twitter/X and Facebook reflecting real-time public sentiment across Punjab and Pakistan.`
}

export function generateEventsCulturalParagraph(city: string): string {
  return `Cultural events in ${city} this week span religious gatherings, arts festivals, sports matches, and community celebrations reflecting the city's vibrant social calendar.`
}

export function generateBreakingnewsParagraph(city: string): string {
  return `Breaking news from ${city} is monitored 24/7. Any developing story affecting ${city}'s 14 million residents is updated immediately on this page.`
}

export function generateNewsArchiveParagraph(city: string): string {
  return `${city} news archive allows browsing historical coverage by date, helping researchers, journalists, and residents track how stories developed over time.`
}