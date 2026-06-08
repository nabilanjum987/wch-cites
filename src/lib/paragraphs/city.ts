// lib/paragraphs/city.ts
// SEO paragraph generators for City Main Page
// Each paragraph: 200–300 words, city name in first 10 words
// Includes month + year naturally, Urdu keywords where relevant

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── 1. CITY INTRO ────────────────────────────────────────────────────────────
export function generateCityIntro(
  city: string,
  country: string,
  province: string,
  population: string,
  wikiExtract: string
): string {
  const { month, year } = now();
  const fallback = `${city} stands as one of the most culturally rich and historically significant cities in ${country}, with a legacy stretching back over a thousand years. Located in the heart of ${province}, ${city} has evolved from an ancient settlement into a modern metropolitan hub that balances its Mughal-era heritage with contemporary urban life. In ${month} ${year}, ${city} continues to attract scholars, travelers, and business visitors from across Pakistan and around the world.`;
  const extract = wikiExtract
    ? wikiExtract.split('. ').slice(0, 4).join('. ') + '.'
    : fallback;
  return `${city} — known locally as لاہور — is ${extract} As of ${month} ${year}, the city serves as the capital of ${province} and remains a cornerstone of ${country}'s cultural, economic, and intellectual identity. Home to world-class universities, centuries-old mosques, and a food scene celebrated across South Asia, ${city} offers visitors and residents an experience unlike any other city on the subcontinent. This page provides live, real-time information for ${city} including current weather conditions, today's prayer times (اوقات نماز), gold and currency rates, breaking news, upcoming events, and much more — all updated continuously to serve the people of ${city} and those planning to visit.`;
}

// ─── 2. WEATHER ───────────────────────────────────────────────────────────────
export function generateWeatherParagraph(
  city: string,
  temp: number | null,
  feelsLike: number | null,
  humidity: number | null,
  description: string | null,
  windSpeed: number | null
): string {
  const { month, year } = now();
  if (!temp) {
    return `${city}'s weather in ${month} ${year} reflects the seasonal patterns typical of the Punjab region. The city experiences a semi-arid climate with hot summers, mild winters, and a monsoon season that brings much-needed relief from June through September. Residents of ${city} should check current conditions using the live weather widget above for the most accurate and up-to-date forecast. Planning outdoor activities in ${city} — whether visiting Badshahi Mosque, strolling through Liberty Market, or attending an event at Gaddafi Stadium — always requires awareness of the day's weather conditions, UV index, and air quality levels.`;
  }
  return `${city}'s current weather in ${month} ${year} shows a temperature of ${Math.round(temp)}°C, feeling like ${Math.round(feelsLike ?? temp)}°C with ${description ?? 'partly cloudy conditions'}. Humidity levels are at ${humidity ?? '--'}%, with winds moving at ${Math.round(windSpeed ?? 0)} km/h. For residents and visitors in ${city}, these conditions are ${temp > 35 ? 'quite hot — staying hydrated and limiting midday sun exposure is strongly advised' : temp < 15 ? 'cool — a light jacket is recommended, especially in the mornings and evenings' : 'comfortable for most outdoor activities'}. ${city}'s climate (موسم) during ${month} follows the pattern of the Upper Indus Plain — the city's position in the Punjab heartland means temperatures can vary significantly between morning and afternoon. Locals heading to Anarkali Bazaar, Model Town, or DHA are advised to check the hourly forecast above for the best time to travel. The weather data on this page is sourced live from OpenWeatherMap and updates every hour.`;
}

// ─── 3. PRAYER TIMES ──────────────────────────────────────────────────────────
export function generatePrayerParagraph(
  city: string,
  timings: Record<string, string> | null
): string {
  const { month, year } = now();
  if (!timings) {
    return `Prayer times (اوقات نماز) in ${city} for ${month} ${year} are calculated based on the Karachi method, the standard adopted by the religious authorities of Pakistan. ${city}'s geographic coordinates determine the precise timing of Fajr, Zuhr, Asr, Maghrib, and Isha prayers, which shift by a few minutes each day as the sun's position changes throughout the year. For the most accurate prayer timetable in ${city}, see the live countdown above. The full monthly and yearly prayer timetable for ${city} is available on the dedicated Prayer Times page.`;
  }
  const { Fajr, Dhuhr, Asr, Maghrib, Isha } = timings;
  return `Today's prayer times (نماز کے اوقات) in ${city} for ${month} ${year}: Fajr at ${Fajr}, Dhuhr at ${Dhuhr}, Asr at ${Asr}, Maghrib at ${Maghrib}, and Isha at ${Isha}. These timings are calculated using the Karachi method (University of Islamic Sciences), which is the standard reference for prayer times across Pakistan. ${city}'s latitude and longitude place it in a position where Fajr and Isha times shift noticeably between summer and winter — in June, Fajr begins as early as 3:30 AM, while in December it may be closer to 5:30 AM. Residents of ${city} can set browser reminders using the Prayer Times page, which also provides a Qibla compass, monthly timetable PDF download, and Ramadan sehri/iftar schedule. For Hanafi Asr timing — the majority madhab followed in ${city} — the shadow length calculation differs from the Shafi'i method; both are provided on the full prayer page.`;
}

// ─── 4. GOLD RATES ────────────────────────────────────────────────────────────
export function generateGoldParagraph(
  city: string,
  pricePerGram: number | null,
  currency: string = 'PKR'
): string {
  const { month, year } = now();
  if (!pricePerGram) {
    return `Gold rates (سونے کی قیمت) in ${city} today reflect the international spot price translated into Pakistani Rupees at the current interbank exchange rate. ${city}'s gold market — centred around Shalimar, Anarkali, and the traditional jewellery bazaars — tracks global prices closely, though local premiums for making charges and purity verification can add 3–8% to the final purchase price. The 24-karat, 22-karat, and 18-karat rates for ${city} in ${month} ${year} are displayed live in the rates section above, updated daily from international market data.`;
  }
  const tola = Math.round(pricePerGram * 11.664);
  return `Gold rates in ${city} today (${month} ${year}): 24-karat gold is trading at approximately ${currency} ${Math.round(pricePerGram).toLocaleString()} per gram, which translates to ${currency} ${tola.toLocaleString()} per tola — the traditional unit used in Pakistan's jewellery markets. ${city}'s gold bazaars, particularly those in Anarkali and Shah Alam Market, are among the busiest in Punjab, with daily trading volumes reflecting both local demand and investment sentiment. Gold prices (سونے کی قیمت) in Pakistan are pegged to the international London Bullion Market Association (LBMA) fixing, converted to PKR at the State Bank of Pakistan's reference rate. For investors and jewellery buyers in ${city}, the current Nisab threshold for Zakat — calculated at 87.48 grams of gold — is also shown in the Rates section. Silver rates, copper prices, and fuel costs for ${city} are all available on the full Rates page.`;
}

// ─── 5. NEWS INTRO ────────────────────────────────────────────────────────────
export function generateNewsParagraph(city: string, topHeadline: string | null): string {
  const { month, year } = now();
  return `${city} news today (${month} ${year}): ${topHeadline ? `The top story making headlines is: "${topHeadline}". Beyond this, ` : ''}${city} continues to generate significant coverage across government, business, culture, sports, and education sectors. Major Pakistani news sources covering ${city} include Dawn, Geo News, The News International, Tribune, ARY News, Jang, Express Urdu, and City42 — all of which maintain dedicated bureaus in the city. The news feed on this page aggregates the most relevant ${city} stories from across these outlets, refreshing every 15 minutes to ensure you have the latest information. Stories are categorised into 12 tabs: Government, Finance, Sports, Culture, Religion, Health, Education, Environment, Transport, Business, Entertainment, and World News affecting ${city}. For the complete news archive and the ability to browse by date, visit the dedicated News page for ${city}.`;
}

// ─── 6. EVENTS INTRO ──────────────────────────────────────────────────────────
export function generateEventsParagraph(city: string): string {
  const { month, year } = now();
  return `${city} events in ${month} ${year} span a remarkable range of cultural, religious, sporting, and commercial gatherings that reflect the city's status as Pakistan's cultural capital. From the weekly Thursday-night celebrations at Data Darbar — one of South Asia's most visited Sufi shrines — to the Friday Jumu'ah prayers at Badshahi Mosque that draw thousands of worshippers, ${city}'s event calendar is never empty. This month, look out for events at Alhamra Arts Council, exhibitions at the Lahore Museum, cricket matches at Gaddafi Stadium, and the regular food festivals that have made ${city}'s culinary scene (کھانا) famous across the country. Business events, tech meetups, and educational conferences are also growing rapidly in ${city}, driven by the city's expanding startup ecosystem in areas like Johar Town and DHA. The full events map with colour-coded pins by category is available on the Events page — you can also submit your own event for free listing.`;
}

// ─── 7. ECONOMY ───────────────────────────────────────────────────────────────
export function generateEconomyParagraph(
  city: string,
  country: string,
  gdpPerCapita: number | null,
  inflation: number | null,
  unemployment: number | null
): string {
  const { month, year } = now();
  return `${city}'s economy in ${month} ${year} is one of the most dynamic in ${country}, contributing an estimated 13% of Pakistan's total GDP despite covering less than 1% of the country's land area. The city's economic engine runs on a diverse mix of manufacturing (textiles, leather goods, surgical instruments), services (banking, IT, retail), and the informal economy that employs millions across its 13 administrative towns. ${country}'s GDP per capita currently stands at approximately USD ${gdpPerCapita ? Math.round(gdpPerCapita).toLocaleString() : '1,600'}, with annual inflation running at ${inflation ? Math.round(inflation) : '--'}% — figures that have a direct impact on the daily purchasing power of ${city}'s residents. Unemployment (${unemployment ? Math.round(unemployment) + '%' : 'officially reported at single digits'}) masks a significant rate of underemployment, particularly among the city's large youth population. ${city}'s fastest-growing sectors include IT services, e-commerce, and food delivery — industries that are reshaping the employment landscape and creating new opportunities alongside traditional industries. For a full economic health score, sector breakdown, and decade-long growth charts, visit the Economy page for ${city}.`;
}

// ─── 8. SPORTS ────────────────────────────────────────────────────────────────
export function generateSportsParagraph(city: string): string {
  const { month, year } = now();
  return `${city} is the heartbeat of Pakistani cricket and one of South Asia's most passionate sporting cities. In ${month} ${year}, ${city}'s Gaddafi Stadium — named after the Libyan leader who visited in 1974 — remains the premier cricket venue in Pakistan, hosting international Test matches, ODIs, T20s, and Pakistan Super League (PSL) games. The ${city}-based PSL franchise, Lahore Qalandars, has built one of the most loyal fanbases in the competition since the league's inception in 2016. Beyond cricket, ${city} has a rich tradition in field hockey — Pakistan's national sport — as well as squash, football, and kabaddi. The city produced legendary squash players including the Khans of Peshawar and Jansher Khan, whose coaching academies continue to train the next generation. For live scores, upcoming match schedules, and PSL standings, see the Sports section above and the full Sports page for ${city} and Pakistan.`;
}

// ─── 9. HERITAGE ──────────────────────────────────────────────────────────────
export function generateHeritageParagraph(city: string): string {
  const { month, year } = now();
  return `${city}'s heritage products (دستکاری) represent centuries of craftsmanship that have survived empires, partitions, and modernisation. In ${month} ${year}, artisans across the city's historic mohallas continue to produce the hand-embroidered phulkari shawls, Kashmiri shawls, hand-knotted rugs, lacquerware, and the intricate woodwork that made Mughal-era ${city} the envy of the known world. The iconic Lahori chappals — sturdy leather sandals handmade in the walled city's cobbler lanes — remain a symbol of the city's identity worn by everyone from daily labourers to fashion-conscious youth. ${city}'s craftspeople sell their work through the heritage bazaars of Anarkali, Shah Alam Market, and the newer Lahore Crafts Council outlets, as well as internationally through platforms like Amazon, Etsy, and 1stDibs. The Heritage Products section above features rotating monthly spotlights on individual artisans and product categories, with links to purchase authentic items directly.`;
}

// ─── 10. STREET FOOD ──────────────────────────────────────────────────────────
export function generateStreetFoodParagraph(city: string): string {
  const { month, year } = now();
  return `${city}'s street food (لاہوری کھانا) is internationally recognised as some of the finest in South Asia, and in ${month} ${year} the city's food street culture continues to draw visitors from across Pakistan and abroad. No visit to ${city} is complete without a breakfast of paye (slow-cooked trotters) at Waris Nihari on Lakshmi Chowk, a lunch of slow-roasted mutton karahi in the Data Darbar lanes, or the legendary evening experience of Food Street near the Badshahi Mosque — where dozens of vendors compete to offer the finest seekh kebabs, brain masala, and the city's signature murgh cholay. The sweet shops of ${city}, particularly Shezan and Gourmet, produce the halwa puri, jalebi, and gulab jamun that set the standard across Pakistan. In ${month} ${year}, ${city}'s restaurant scene has expanded dramatically beyond traditional Punjabi fare to include Japanese, Italian, and Korean cuisines — especially in the Defence Housing Authority and Gulberg neighbourhoods — but the street food of the walled city remains the soul of ${city}'s culinary identity.`;
}

// ─── 11. EMERGENCY ────────────────────────────────────────────────────────────
export function generateEmergencyParagraph(
  city: string,
  police: string | null,
  ambulance: string | null,
  fire: string | null
): string {
  return `Emergency contacts in ${city}: Police (پولیس) can be reached at ${police ?? '15'}, Rescue/Ambulance at ${ambulance ?? '1122'}, and the Fire Brigade at ${fire ?? '16'}. The Rescue 1122 service in ${city} is one of the most professionally run emergency response services in Pakistan, with average response times of under 7 minutes across most of the city. The Edhi Foundation, reachable at 115, also operates ambulance services throughout ${city} and is available 24/7. For women in distress, the Punjab Women Helpline is 1043. Child protection services can be reached at 1121. These numbers are available free of charge from any mobile or landline in ${city}, and operators are available in Urdu, Punjabi, and English. In a medical emergency, heading to the nearest major hospital — Mayo Hospital, Services Hospital, or Jinnah Hospital — is advised; all three have 24-hour emergency departments. Keep these numbers saved in your phone before venturing out in ${city}.`;
}

// ─── 12. NEARBY CITIES ────────────────────────────────────────────────────────
export function generateNearbyCitiesParagraph(city: string): string {
  const { month, year } = now();
  return `${city}'s strategic location in central Punjab places it within easy reach of several major Pakistani cities in ${month} ${year}. Islamabad and Rawalpindi — Pakistan's capital twin cities — are just 280 km north via the M-2 Motorway, a journey of approximately 3.5 hours by car or under 4 hours by Daewoo Express bus. Gujranwala, Pakistan's fourth-largest city and a major industrial centre, is only 80 km northeast of ${city}. Faisalabad, the country's textile capital, lies 130 km to the west. Sialkot, renowned for its sports goods manufacturing, is 130 km east. Multan, the City of Saints, is 340 km south — a roughly 4-hour drive. This central position makes ${city} a natural hub for trade, travel, and cultural exchange across Punjab. The Lahore-Islamabad Motorway (M-2), the Ring Road, and the expanding Orange Line Metro system have all dramatically improved connectivity in and around ${city} in recent years.`;
}

// ─── 13. CITY AT A GLANCE ─────────────────────────────────────────────────────
export function generateCityGlanceParagraph(
  city: string,
  country: string,
  province: string
): string {
  const { month, year } = now();
  return `${city} at a glance in ${month} ${year}: With a population exceeding 13 million in the metropolitan area, ${city} is ${country}'s second-largest city and one of the fastest-growing urban centres in Asia. The city covers approximately 1,772 square kilometres across the ${province} province, sitting at an elevation of 217 metres (712 feet) above sea level on the Ravi River plain. Official languages include Urdu (the national language) and Punjabi — the mother tongue of the vast majority of ${city}'s residents. The city is administered by the ${city} Metropolitan Corporation (LMC), divided into four administrative districts and further subdivided into towns and union councils. ${city}'s literacy rate of approximately 74% is among the highest in Pakistan, supported by world-class institutions including the University of the Punjab (established 1882), Lahore University of Management Sciences (LUMS), and over 3,000 schools across the metropolitan area. The city operates in the PKT timezone (UTC+5), with the call to prayer heard from thousands of mosques across the city five times daily.`;
}
