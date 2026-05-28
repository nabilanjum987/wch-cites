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

export interface EconomicData {
  gdp: {
    total: number;
    perCapita: number;
    growth: number;
    bySector: { sector: string; value: number }[];
    tenYearGrowth: { year: number; value: number }[];
    projection: { year: number; value: number }[];
  };
  inflation: {
    current: number;
    oneYearAgo: number;
    byCategory: { category: string; rate: number }[];
    purchasingPower: {
      valueToday: number;
      valueOneYearAgo: number;
      monthlyImpact: number;
    };
  };
  employment: {
    unemploymentRate: number;
    youthUnemployment: number;
    femaleUnemployment: number;
    laborForce: number;
  };
  healthScore: {
    current: number;
    oneYearAgo: number;
    trend: 'improving' | 'declining' | 'stable';
    status: string;
  };
  debt: {
    debtToGdp: number;
    total: number;
  };
}
