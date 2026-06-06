import { City } from '@/types/city';

export function generateWeatherIntroductionParagraph(city: City, weatherData: Record<string, unknown> = {}): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const temp = weatherData?.temp || '34';
  const condition = weatherData?.condition || 'Sunny';
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      ${city.name} weather today in ${month} brings ${condition} conditions with temperatures reaching approximately ${temp}°C, 
      reflecting the subtropical climate characteristic of northern Punjab, Pakistan. Understanding current weather in ${city.name} 
      is essential for residents, tourists, and business travelers planning daily activities across this metropolitan city. 
      The meteorological patterns affecting ${city.name}'s climate are influenced by seasonal monsoons, latitude-longitude position 
      (${city.lat}°N, ${city.lng}°E), and elevation of 217 meters. Live weather updates for ${city.name} provide hourly forecasts, 
      precipitation chances, wind speed measurements, and humidity levels crucial for agricultural planning in surrounding Punjab regions. 
      Weather warnings and alerts specific to ${city.name} help residents prepare for extreme conditions including heat waves or unexpected rainfall. 
      Whether you're checking ${city.name} mausam (موسم) for daily commute planning or long-term agricultural decisions, accurate weather information 
      remains vital for this city of ${city.population.toLocaleString()} inhabitants.
    </p>
  `;
}

export function generateWeatherForecastParagraph(city: City, weatherData: Record<string, unknown> = {}): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const humidity = weatherData?.humidity || '52';
  const feelsLike = weatherData?.feelsLike || '37';
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Seven-day weather forecast for ${city.name} in ${month} indicates variable atmospheric conditions with significant implications for outdoor activities, 
      transportation planning, and public health. Humidity levels in ${city.name} currently stand at approximately ${humidity}%, creating a "feels like" 
      temperature of around ${feelsLike}°C, which is noticeably higher than actual temperature readings. The extended forecast for ${city.name} shows 
      alternating patterns of sunny and cloudy conditions, with potential for scattered rainfall affecting the city's traffic and daily routines. 
      Wind speed measurements for ${city.name} help meteorologists predict dust storms and air quality fluctuations common to Punjab during certain seasons. 
      ${city.name} residents and tourists should monitor hourly weather updates, as conditions can change rapidly from clear skies to overcast conditions 
      with precipitation. UV index information for ${city.name} guides sun safety recommendations, particularly for outdoor workers, children, and elderly populations. 
      Air quality index (AQI) readings for ${city.name} frequently indicate moderate to poor conditions, especially during post-monsoon seasons when dust particles accumulate.
    </p>
  `;
}

export function generateWeatherApparelParagraph(city: City): string {
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      What to wear in ${city.name} today depends significantly on current weather conditions, time of day, and planned activities across the metropolitan area. 
      Morning hours in ${city.name} typically require light sweaters or jackets as temperatures hover in the low-to-mid 20s°C range. Afternoon conditions 
      in ${city.name} demand lightweight, breathable fabrics in neutral colors that reflect rather than absorb heat, making cotton and linen ideal choices 
      for residents navigating busy markets, offices, and street markets. Evening temperature drops in ${city.name} necessitate having an additional layer 
      available, as outdoor gatherings and religious observances often occur during cooler twilight hours. Night conditions in ${city.name} can be surprisingly 
      cool, especially in winter months, prompting many residents to wear cardigans or light jackets even during warmer seasons. Seasonal clothing recommendations 
      for ${city.name} emphasize modest dress appropriate to Islamic cultural norms, with loose-fitting garments that accommodate the city's conservative values. 
      Footwear in ${city.name} should be sturdy and weather-appropriate, as monsoon rains can flood certain low-lying neighborhoods with poor drainage infrastructure.
    </p>
  `;
}

export function generateAirQualityParagraph(city: City, aqiData: Record<string, unknown> = {}): string {
  const aqi = aqiData?.aqi || '95';
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Air quality index (AQI) readings for ${city.name} in ${month} currently measure ${aqi}, indicating moderate to unhealthy conditions requiring careful monitoring. 
      The air pollution in ${city.name} stems from multiple sources including vehicular emissions from heavy traffic congestion, industrial operations in manufacturing zones, 
      and seasonal dust storms affecting Punjab region. PM2.5 (fine particulate matter) concentrations in ${city.name} frequently exceed WHO safe levels, particularly 
      affecting vulnerable populations including children, elderly residents, and individuals with respiratory conditions. ${city.name}'s geographical location in 
      the Punjab plains, combined with temperature inversions during winter months, traps pollutants creating hazardous air quality situations that trigger 
      government health advisories. Real-time AQI monitoring for ${city.name} helps residents with asthma, allergies, and other respiratory issues make informed 
      decisions about outdoor activities, sports participation, and school attendance. Pollution control measures implemented in ${city.name} by environmental authorities 
      target vehicle emissions, factory smoke, and construction dust, though effectiveness remains limited. Health guidelines for ${city.name} recommend staying indoors 
      when AQI exceeds 200, using air purifiers indoors, and wearing N95 masks during outdoor exposure in severely polluted conditions.
    </p>
  `;
}

export function generateHourlyForecastParagraph(city: City): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Hourly weather forecasts for ${city.name} provide granular meteorological data essential for commuters, outdoor workers, and event planners operating throughout 
      the city. Each hour's weather snapshot includes temperature fluctuations, precipitation probability, wind gusts, and AQI measurements updating continuously as 
      atmospheric conditions change across ${city.name}'s sprawling metropolitan area. The next 24 hours in ${city.name} typically display cyclical patterns with 
      cooler morning temperatures rising sharply through midday hours before declining again in evening. Sunrise times in ${city.name} during ${month} occur around 
      5:15 AM, while sunset approaches 7:00 PM, significantly influencing prayer time calculations and daylight availability for outdoor activities. Weather warnings 
      specific to upcoming hours in ${city.name} alert residents to sudden thunderstorms, heat waves, or other meteorological hazards. Transportation authorities 
      in ${city.name} adjust traffic management strategies based on hourly weather updates, reducing speed limits during heavy rainfall and managing dust storm emergencies. 
      Workers in ${city.name}'s construction industry, agriculture, and tourism sector rely on precise hourly forecasts to schedule operations avoiding peak heat hours.
    </p>
  `;
}

export function generateSunsetSunriseParagraph(city: City, sunData: Record<string, unknown> = {}): string {
  const sunrise = sunData?.sunrise || '5:15 AM';
  const sunset = sunData?.sunset || '7:00 PM';
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Sunrise and sunset timings in ${city.name} today—with sunrise at ${sunrise} and sunset at ${sunset}—structure the daily rhythm of this Islamic city's 
      religious observances, work schedules, and social activities. These solar events determine prayer timing calculations, particularly for Fajr (pre-dawn prayer) 
      and Maghrib (sunset prayer), which are determined astronomically based on the sun's geometric position relative to ${city.name}'s latitude and longitude coordinates. 
      The duration of daylight in ${city.name} varies seasonally, with maximum daylight hours occurring around June summer solstice and minimum hours during December winter solstice. 
      Twilight periods in ${city.name}—the intervals between sunrise and actual full daylight, and between sunset and complete darkness—influence commuting patterns, 
      business hours, and meal timing during Islamic holy month of Ramadan. ${city.name} residents traditionally plan outdoor markets, shopping, and social gatherings 
      around these solar events, with many preferring to conduct business during daylight hours. Photography enthusiasts in ${city.name} chase "golden hour" conditions 
      near sunrise and sunset for optimal lighting at Badshahi Mosque, Shalimar Gardens, and other heritage sites. Astronomical calculations for ${city.name} continue 
      to employ precise formulas developed centuries ago by Islamic scholars studying celestial mechanics.
    </p>
  `;
}
