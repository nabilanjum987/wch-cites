import { City } from '@/types/city';

export function generateCityOverviewParagraph(city: City): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      ${city.name}, located in ${city.province}, Pakistan, stands as one of the country's most vibrant and historically rich urban centers. 
      In ${month}, this metropolitan hub continues to serve as the cultural, economic, and educational heartbeat of the region, with a population 
      exceeding ${city.population.toLocaleString()}. Known locally as "شہر قدیم" (Sheher-e-Qadeem, the Ancient City), ${city.name} represents a 
      seamless blend of Mughal architecture, modern infrastructure, and contemporary lifestyle. The city's strategic location in ${city.province} 
      makes it a crucial gateway for business, tourism, and pilgrimage to Islamic heritage sites including the iconic Badshahi Mosque and Data Darbar shrine.
    </p>
  `;
}

export function generateWeatherCityParagraph(city: City, weatherData: any): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Weather conditions in ${city.name} during ${month} reflect the transition period typical of northern Punjab, Pakistan. 
      With temperatures averaging around ${weatherData?.temp || '34'}°C, ${city.name} experiences subtropical climate patterns characterized 
      by varying humidity levels and monsoon influences. Residents planning outdoor activities in ${city.name} should monitor the hourly 
      weather forecasts, as conditions can shift from sunny to rainy within hours during this season. The air quality in ${city.name} 
      is tracked daily, with AQI (Air Quality Index) readings providing crucial health information for the city's ${city.population.toLocaleString()} inhabitants. 
      Understanding ${city.name} weather patterns is essential for daily planning, whether for business activities, tourism, or religious observances 
      at ${city.name}'s famous mosques and shrines. The annual monsoon season significantly impacts transportation and outdoor services throughout ${city.name}.
    </p>
  `;
}

export function generatePrayerTimingsParagraph(city: City, prayerData: any): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Prayer times in ${city.name} hold immense spiritual significance for the city's Muslim-majority population of approximately ${city.population.toLocaleString()} residents. 
      In ${month}, accurate namaz timings become crucial for daily worship at ${city.name}'s over 500 registered mosques, including the world-renowned Badshahi Mosque 
      and the ancient Data Darbar. The five daily prayers—Fajr, Dhuhr, Asr, Maghrib, and Isha—are meticulously calculated based on ${city.name}'s geographical coordinates 
      (${city.lat}°N, ${city.lng}°E) and the Islamic lunar calendar. Qibla direction for ${city.name} remains constant at 262° West-Southwest, guiding millions of worshippers 
      toward the Kaaba in Mecca. The Aladhan API provides real-time prayer schedules for ${city.name}, accounting for seasonal variations and Hijri date adjustments. 
      Whether you're a resident of ${city.name} or a visitor exploring the city's religious heritage sites, understanding prayer times enhances your experience 
      of ${city.name}'s profound Islamic culture.
    </p>
  `;
}

export function generateGoldRatesParagraph(city: City, goldData: any): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Gold rates in ${city.name} on ${date} reflect the dynamic precious metals market across Pakistan, with 24-karat gold trading at PKR ${goldData?.gold24k || '21,500'} per gram. 
      The sona rate (سونا ریٹ) in ${city.name} is significantly influenced by international gold prices, currency fluctuations, and local demand from the city's jewelry market 
      concentrated in the historic Anarkali Bazaar. Investors and jewelry buyers in ${city.name} monitor daily gold price movements, as they determine the cost of ornaments, 
      investment pieces, and ceremonial jewelry for weddings and festivals throughout the year. Silver rates (چاندی کی قیمت) in ${city.name} also fluctuate in tandem with 
      global commodity markets. The zakat nisab calculation for ${city.name} residents, traditionally based on 85 grams of gold or 595 grams of silver, varies with these price 
      changes. Cryptocurrency prices including Bitcoin and Ethereum exchange rates for PKR are equally important for tech-savvy investors in ${city.name}'s growing fintech sector.
    </p>
  `;
}

export function generateEconomyParagraph(city: City): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      ${city.name}'s economy in ${month} represents approximately 13% of Pakistan's GDP, making it the second-largest economic hub after Karachi. 
      The city's economic diversification spans textiles, manufacturing, IT services, healthcare, and finance, employing hundreds of thousands of workers 
      and generating substantial tax revenue for the provincial government. Inflation in ${city.name} and across Pakistan currently hovers around 23.4%, 
      impacting purchasing power, cost of living, and business operations throughout the metropolitan area. Economic growth in ${city.name} faces headwinds 
      from broader Pakistan economic challenges including currency devaluation and interest rate hikes. However, the city remains an attractive destination 
      for foreign direct investment, with special economic zones and SEZ-like developments promising new job creation. The unemployment rate in ${city.name} 
      stands at 6.2%, reflecting challenges in job market absorption despite the city's large working-age population. Misery index calculations for ${city.name} 
      residents combine inflation and unemployment data to measure overall economic hardship and cost-of-living pressures.
    </p>
  `;
}

export function generateLocationParagraph(city: City): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      ${city.name} is strategically positioned in ${city.province}, Pakistan, serving as the provincial capital and a crucial regional hub. 
      Located at coordinates ${city.lat}°N, ${city.lng}°E, the city sits in the fertile Punjab plains, approximately 375 kilometers south of Islamabad 
      and 275 kilometers northeast of Multan. Major nearby cities include Gujranwala (80 kilometers away), Faisalabad (128 kilometers), and Sialkot 
      (115 kilometers), creating a densely populated urban corridor. The city's elevation of 217 meters above sea level and its position along the Ravi River 
      historically made ${city.name} a crucial trading post along ancient Silk Road routes. In modern ${month}, ${city.name} remains supremely connected via 
      the M-11 motorway to northern Pakistan and the M-2 motorway linking provincial centers. International accessibility is provided through Allama Iqbal 
      International Airport, facilitating business travel and tourism. The timezone in ${city.name} is Pakistan Standard Time (PST), UTC+5, uniform across 
      the country.
    </p>
  `;
}

export function generateCultureHeritageParagraph(city: City): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      ${city.name}'s cultural heritage in ${month} continues to captivate visitors and scholars exploring South Asian Islamic civilization. 
      The city boasts UNESCO World Heritage sites including the magnificent Shalimar Gardens (laid out in 1641 by Mughal Emperor Shah Jahan) and 
      the imposing ${city.name} Fort, which dates back to medieval times and showcases centuries of architectural evolution. Religious heritage sites 
      dominate ${city.name}'s tourism narrative, with Data Darbar shrine attracting hundreds of thousands of devotees annually, while Badshahi Mosque 
      stands as an iconic symbol of Islamic architecture. The city's famous personalities include the legendary poet Allama Iqbal, cricket icon Wasim Akram, 
      and Sufi music master Nusrat Fateh Ali Khan, all contributing to ${city.name}'s reputation as a cultural capital. Heritage products like Phulkari embroidery, 
      traditional Khussa footwear, blue pottery, and intricate Chikankari needlework represent centuries-old artisan traditions of ${city.name}. Street food 
      culture in ${city.name}—from Lahori Chargha to Nihari—reflects the city's unique culinary heritage, with Gawalmandi and Anarkali serving as iconic food destinations.
    </p>
  `;
}

export function generateSportsAndLeisureParagraph(city: City): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Sports and recreation in ${city.name} during ${month} reflect Pakistan's cricket-obsessed culture and growing sporting infrastructure. 
      ${city.name} Qalandars, the city's Pakistan Super League (PSL) franchise, generates passionate fan engagement and contributes significantly to 
      local sports entertainment. Gaddafi Stadium in ${city.name} has hosted international cricket matches, IPL games, and domestic tournaments, making 
      it one of South Asia's premier cricket venues. Beyond cricket, ${city.name} produces athletes excelling in squash (legendary Jahangir Khan), tennis, 
      and field hockey, sports in which Pakistan maintains competitive international rankings. The city's sports culture extends to football, with 
      ${city.name} United representing the city in domestic leagues and continental competitions. Recreational facilities including golf clubs, 
      swimming complexes, and fitness centers serve ${city.name}'s affluent and middle-class populations. The annual sports calendar in ${city.name} 
      includes amateur tournaments, university championships, and corporate sporting events that engage thousands of participants and millions of fans.
    </p>
  `;
}
