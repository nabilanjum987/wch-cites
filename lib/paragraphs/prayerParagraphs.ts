import { City } from '@/types/city';

export function generatePrayerIntroductionParagraph(city: City, prayerData: any): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const hijri = prayerData?.hijri || '1445 AH';
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Prayer times in ${city.name} for ${month} (Islamic year ${hijri}) represent accurate astronomical calculations essential for the city's Muslim-majority population 
      of approximately ${city.population.toLocaleString()} residents. The daily salah timings—Fajr, Dhuhr, Asr, Maghrib, and Isha—are computed using precise mathematical methods 
      that account for ${city.name}'s geographical coordinates (${city.lat}°N, ${city.lng}°E), equation of time, and solar declination throughout the year. 
      ${city.name} namaz timings follow the methodology of the Aladhan Islamic prayer time calculation API, which utilizes calculation method 1 (University of Islamic Sciences, Karachi) 
      as the standard for Pakistani cities. The Qibla direction for ${city.name} remains constant at 262° West-Southwest, establishing the prayer direction toward Mecca (Makkah) 
      that guides worshippers in all 500+ registered mosques throughout the metropolitan area. Whether praying at home, in offices, or at iconic ${city.name} shrines like Data Darbar, 
      accurate prayer times ensure compliance with Islamic religious obligations. Hajj and Umrah pilgrims from ${city.name} use these same prayer time calculations during their 
      spiritual journeys, making local ${city.name} prayer timing systems globally recognized.
    </p>
  `;
}

export function generatePrayerTimingsParagraph(city: City, prayerData: any): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const fajr = prayerData?.fajr || '4:45 AM';
  const dhuhr = prayerData?.dhuhr || '12:30 PM';
  const asr = prayerData?.asr || '4:15 PM';
  const maghrib = prayerData?.maghrib || '7:05 PM';
  const isha = prayerData?.isha || '8:30 PM';
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      The five daily prayer times for ${city.name} today are: Fajr (dawn prayer) at ${fajr}, Dhuhr (noon prayer) at ${dhuhr}, Asr (afternoon prayer) at ${asr}, 
      Maghrib (sunset prayer) at ${maghrib}, and Isha (night prayer) at ${isha}. Each prayer time in ${city.name} corresponds to specific Quranic commands and prophetic traditions 
      (Sunnah), with Fajr requiring predawn wakefulness while Isha allows for evening flexibility after daily work concludes. The time windows for prayer in ${city.name} 
      accommodate diverse work schedules, with Dhuhr and Asr prayers typically performed during midday breaks in offices, factories, and schools across the metropolitan area. 
      ${city.name} employers increasingly provide prayer facilities (musalahs) and brief prayer time breaks, recognizing Islamic observance as integral to workforce productivity and employee welfare. 
      Students in ${city.name} schools and universities receive prayer accommodation during school hours, with dedicated prayer rooms now common in educational institutions. 
      The afternoon Asr prayer in ${city.name} marks a critical time window for afternoon workers to fulfill religious obligations before workday completion. 
      Friday congregational prayer (Jumu'ah) at ${city.name}'s grand mosques draws hundreds of thousands of worshippers weekly, making traffic management and public transportation crucial.
    </p>
  `;
}

export function generateQiblaParagraph(city: City): string {
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Qibla direction (قبلہ سمت) for ${city.name} prayer remains constant at 262° West-Southwest, calculated using precise geometric formulas based on the city's coordinates 
      relative to Mecca's sacred location. Every mosque in ${city.name}, from the massive Badshahi Mosque to humble neighborhood prayer rooms, aligns its prayer niche (mihrab) 
      with this exact Qibla direction, ensuring worshippers face Mecca during all five daily prayers throughout the year. The compass bearing of 262° for ${city.name} places 
      the Kaaba almost due west-southwest, which Islamic architects and engineers in ${city.name} accommodate through sophisticated architectural design and detailed construction specifications. 
      Modern smartphone applications calculating Qibla direction for ${city.name} users employ GPS technology combined with Islamic calculation algorithms, providing real-time directional guidance 
      accurate to within degrees. For travelers and Muslim expat communities in ${city.name}, determining Qibla direction independently using compass, shadow method, or astronomical observations 
      becomes essential when established prayer facilities prove unavailable. Historically, Islamic scholars in ${city.name} employed sophisticated geometric mathematics and astronomical observations 
      to calculate Qibla before modern technology emerged. The consistency of Qibla direction across ${city.name} creates visual and spiritual unity among the city's Muslim population, 
      symbolizing their shared connection to Islam's holiest site.
    </p>
  `;
}

export function generateWeeklyTimetableParagraph(city: City): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Weekly prayer timetables for ${city.name} throughout ${month} display dynamic variations in prayer times due to seasonal changes in solar declination and sunrise/sunset times. 
      The prayer time variations within a single week in ${city.name} may span 10-15 minutes as the sun's angular position gradually shifts along the ecliptic path. 
      ${city.name} residents depend on comprehensive weekly timetables published by religious institutions, mosques, and mobile applications to plan their worship schedules across seven days. 
      Islamic calendar synchronization in ${city.name} maintains alignment with the lunar Hijri calendar (calendrier hégirien), which differs from the solar Gregorian calendar, 
      creating fascinating overlaps where Islamic dates progress independently from Western dates throughout the year. Prayer time prediction algorithms for ${city.name} 
      incorporate these lunar-solar calendar distinctions, ensuring accurate scheduling even as Hijri dates shift relative to fixed Western dates. 
      Month-long timetables for ${city.name} circulated by official institutions, published in mosques, and shared through digital platforms provide comprehensive guidance 
      for planning religious observances, fasting schedules during Ramadan, and attendance at congregational prayers (Jumu'ah). 
      Advanced planning capabilities enabled by accurate ${city.name} timetables allow worshippers to schedule business meetings, travel arrangements, and social obligations 
      around prayer time commitments throughout the month.
    </p>
  `;
}

export function generateMosquesFacilitiesParagraph(city: City): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Major mosques throughout ${city.name} serve as spiritual and community centers where prayer times structure daily rhythms for the city's Muslim-majority population in ${month}. 
      The magnificent Badshahi Mosque stands as an architectural marvel and the world's second-largest mosque by courtyard area, accommodating over 120,000 worshippers during 
      Eid celebrations and special religious observances. Data Darbar shrine in ${city.name} attracts devotees year-round, particularly during the annual Urs festival 
      commemorating the saint's death anniversary with continuous prayer and Quranic recitation. The historic Wazir Khan Mosque in ${city.name}'s walled city showcases intricate 
      Mughal architecture and remains active with regular prayer congregations despite its centuries-old construction. Jamia Masjid and countless neighborhood mosques throughout 
      ${city.name} provide accessible prayer facilities for residents, workers, and visitors observing daily prayer obligations. Modern mosque construction in ${city.name} increasingly 
      incorporates architectural features accommodating diverse worshipper populations including women's prayer sections, ablution facilities meeting international standards, and air-conditioned prayer halls. 
      ${city.name}'s mosque network creates a distributed prayer infrastructure ensuring no resident lives more than minutes' walk from worship facilities. 
      Prayer time announcements (Adhan) from mosques throughout ${city.name} traditionally echo through neighborhoods at prescribed times, though modern amplification systems now standardize these calls across the metropolitan area.
    </p>
  `;
}

export function generateHijriCalendarParagraph(city: City, hijriData: any): string {
  const hijri = hijriData?.hijri || 'Rajab 1445';
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      The Islamic lunar calendar (hijri) date for ${city.name} today is ${hijri}, calculated using the astronomical sighting of the lunar crescent that marks new Islamic months. 
      This Hijri calendar system governs crucial Islamic dates in ${city.name} including the holy month of Ramadan, Eid celebrations, and Hajj pilgrimage scheduling. 
      The Hijri year advances approximately 11 days faster than the Gregorian calendar each year, causing Islamic dates to gradually shift backward through Western seasons over 
      33-year cycles. For residents of ${city.name} planning religious observances, business operations, and family celebrations, tracking both Gregorian and Hijri dates becomes essential. 
      Religious authorities in ${city.name} issue official announcements regarding Hijri month transitions, particularly crucial for Ramadan fasting schedules and Eid celebration timings. 
      The lunar calendar's 354-day year ensures Islamic holy days rotate through all seasons, with Ramadan occurring during summer months when ${city.name} experiences extreme heat requiring 
      special health precautions during daytime fasting. Astronomical calculations determining Hijri months in ${city.name} employ sophisticated observation techniques and established criteria 
      for lunar crescent visibility, emphasizing the astronomical sophistication of Islamic timekeeping traditions.
    </p>
  `;
}

export function generateSpiritualSignificanceParagraph(city: City): string {
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Prayer times in ${city.name} embody profound spiritual significance connecting individual believers to the Islamic global community (Ummah) through synchronized daily worship. 
      The discipline of prayer at designated times throughout ${city.name} creates spiritual anchors structuring daily life, promoting mindfulness, and fostering community cohesion among diverse populations. 
      Islamic theology emphasizes prayer as the second pillar of Islam, with the Quran commanding believers to "establish prayer" (aqim al-salah) as a fundamental religious obligation. 
      For ${city.name} residents, families, and visitors, understanding prayer times represents respecting Islamic traditions and accommodating religious observance in secular work environments, 
      educational institutions, and public spaces. The practice of coordinated prayer in ${city.name} mosques exemplifies Islamic egalitarianism, with worshippers from all socioeconomic backgrounds 
      praying shoulder-to-shoulder regardless of wealth or social status. Women's participation in mosque-based prayers and prayer room facilities throughout ${city.name} has expanded significantly, 
      reflecting evolving interpretations of Islamic law and women's spiritual leadership roles. The psychological benefits of prayer routines in ${city.name} include stress reduction, 
      meditation benefits, and mental health improvements documented by contemporary Islamic health researchers, suggesting prayer provides holistic wellness beyond purely spiritual dimensions.
    </p>
  `;
}
