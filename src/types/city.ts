export interface City {
  name: string;
  city_slug: string;
  country: string;
  country_code: string;
  country_slug: string;
  province: string;
  province_slug: string;
  lat: number;
  lng: number;
  population: number;
  timezone: string;
  major_religion: string;
  religion_percent: number;
  primary_color: string;
  secondary_color: string;
  famous_for: string;
  famous_products: string;
  emergency_police: string;
  emergency_ambulance: string;
  emergency_fire: string;
  region: string;
  is_active: boolean;
}

export interface GoldRate {
  date: string;
  price_usd_per_oz: number;
  open: number;
  high: number;
  low: number;
  change_percent: number;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  rate_to_usd: number;
  flag: string;
}

export const COUNTRY_CURRENCIES: Record<string, CurrencyInfo> = {
  pakistan: { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', rate_to_usd: 278.5, flag: '🇵🇰' },
  india: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate_to_usd: 83.2, flag: '🇮🇳' },
  'saudi-arabia': { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', rate_to_usd: 3.75, flag: '🇸🇦' },
  uae: { code: 'AED', name: 'UAE Dirham', symbol: 'AED', rate_to_usd: 3.67, flag: '🇦🇪' },
  turkey: { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate_to_usd: 32.5, flag: '🇹🇷' },
  uk: { code: 'GBP', name: 'British Pound', symbol: '£', rate_to_usd: 0.79, flag: '🇬🇧' },
  usa: { code: 'USD', name: 'US Dollar', symbol: '$', rate_to_usd: 1, flag: '🇺🇸' },
  france: { code: 'EUR', name: 'Euro', symbol: '€', rate_to_usd: 0.92, flag: '🇫🇷' },
  germany: { code: 'EUR', name: 'Euro', symbol: '€', rate_to_usd: 0.92, flag: '🇩🇪' },
  japan: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate_to_usd: 149.5, flag: '🇯🇵' },
  china: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate_to_usd: 7.24, flag: '🇨🇳' },
  iran: { code: 'IRR', name: 'Iranian Rial', symbol: '﷼', rate_to_usd: 42000, flag: '🇮🇷' },
  egypt: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', rate_to_usd: 30.9, flag: '🇪🇬' },
  bangladesh: { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', rate_to_usd: 110.0, flag: '🇧🇩' },
  malaysia: { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rate_to_usd: 4.72, flag: '🇲🇾' },
  indonesia: { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate_to_usd: 15750, flag: '🇮🇩' },
  nigeria: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate_to_usd: 1550, flag: '🇳🇬' },
  canada: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate_to_usd: 1.36, flag: '🇨🇦' },
  australia: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate_to_usd: 1.53, flag: '🇦🇺' },
};

export const FLAG_COLORS: Record<string, string> = {
  pakistan: '#01411C',
  india: '#FF9933',
  uae: '#00732F',
  'saudi-arabia': '#006C35',
  turkey: '#E30A17',
  uk: '#012169',
  usa: '#B22234',
  france: '#002395',
  germany: '#000000',
  japan: '#BC002D',
  china: '#DE2910',
  iran: '#239F40',
};
