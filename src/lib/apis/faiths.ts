// Christian APIs
export interface BibleVerse {
  text: string;
  reference: string;
  translation: string;
}

export async function fetchBibleVerse(reference: string = 'john+3:16'): Promise<BibleVerse | null> {
  try {
    const res = await fetch(`https://bible-api.com/${reference}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      text: data.verses?.[0]?.text || data.text || '',
      reference: data.reference || reference,
      translation: data.translation_name || 'WEB',
    };
  } catch {
    return null;
  }
}

export interface ChurchCalendar {
  season: string;
  seasonWeek: number;
  color: string;
  description: string;
}

export function getChurchCalendar(): ChurchCalendar {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  if (month === 11 && day >= 25) return { season: 'Christmas', seasonWeek: 1, color: 'white', description: 'Celebrating the birth of Jesus Christ' };
  if (month === 11 && day >= 1 && day < 25) return { season: 'Advent', seasonWeek: Math.ceil(day / 7), color: 'purple', description: 'Preparing for the coming of Christ' };
  if (month >= 0 && month <= 2) return { season: 'Lent / Easter Season', seasonWeek: 1, color: 'purple', description: 'Penitential season preparing for Easter' };
  if (month >= 3 && month <= 4) return { season: 'Easter', seasonWeek: 1, color: 'white', description: 'Celebrating the Resurrection' };
  if (month >= 5 && month <= 7) return { season: 'Ordinary Time', seasonWeek: 1, color: 'green', description: 'Growing in faith and discipleship' };
  return { season: 'Ordinary Time', seasonWeek: 1, color: 'green', description: 'Growing in faith and discipleship' };
}

export const DENOMINATIONS = [
  { name: 'Catholic', masses: ['6:00 AM', '8:00 AM', '10:00 AM', '6:00 PM'] },
  { name: 'Protestant', masses: ['9:00 AM', '11:00 AM'] },
  { name: 'Orthodox', masses: ['8:00 AM', '10:30 AM'] },
  { name: 'Anglican', masses: ['8:00 AM', '10:00 AM', '6:00 PM'] },
];

// Hindu APIs
export interface PanchangData {
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  var: string;
}

export function calculatePanchang(): PanchangData {
  const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Amavasya'];
  const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
  const yogas = ['Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
  const karanas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);

  return {
    tithi: tithis[dayOfYear % tithis.length],
    nakshatra: nakshatras[dayOfYear % nakshatras.length],
    yoga: yogas[dayOfYear % yogas.length],
    karana: karanas[dayOfYear % karanas.length],
    var: days[today.getDay()],
  };
}

export function getRahuKaal(): { start: string; end: string } {
  const today = new Date().getDay();
  const rahuTimes: Record<number, { start: string; end: string }> = {
    0: { start: '4:30 PM', end: '6:00 PM' },
    1: { start: '7:30 AM', end: '9:00 AM' },
    2: { start: '3:00 PM', end: '4:30 PM' },
    3: { start: '12:00 PM', end: '1:30 PM' },
    4: { start: '1:30 PM', end: '3:00 PM' },
    5: { start: '10:30 AM', end: '12:00 PM' },
    6: { start: '9:00 AM', end: '10:30 AM' },
  };
  return rahuTimes[today] || { start: '12:00 PM', end: '1:30 PM' };
}

export const HINDU_FESTIVALS = [
  { name: 'Diwali', date: '2025-10-20', icon: 'lamp' },
  { name: 'Holi', date: '2025-03-14', icon: 'colors' },
  { name: 'Navaratri', date: '2025-09-22', icon: 'lotus' },
];

export const DEITIES = [
  { name: 'Lord Ganesha', icon: 'elephant', puja: 'Morning Ganesha worship removes obstacles' },
  { name: 'Lord Shiva', icon: 'trident', puja: 'Monday - Abhishekam with milk and water' },
  { name: 'Goddess Lakshmi', icon: 'lotus', puja: 'Friday - Lakshmi Puja for prosperity' },
  { name: 'Lord Vishnu', icon: 'peacock', puja: 'Thursday - Vishnu Sahasranama recitation' },
  { name: 'Goddess Durga', icon: 'tiger', puja: 'Tuesday - Durga Chalisa for strength' },
];

// Jewish APIs
export interface ShabbatTimes {
  candleLighting: string;
  havdalah: string;
  parsha: string;
  hebrewDate: string;
}

export async function fetchShabbatTimes(lat: number, lng: number): Promise<ShabbatTimes | null> {
  try {
    const today = new Date();
    const friday = new Date(today);
    friday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7 || 7));
    const dateStr = friday.toISOString().split('T')[0];

    const res = await fetch(
      `https://www.hebcal.com/shabbat?cfg=json&lat=${lat}&lon=${lng}&date=${dateStr}`
    );
    if (!res.ok) return null;
    const data = await res.json();

    const items = data.items || [];
    const candleLightingItem = items.find((i: { category: string }) => i.category === 'candles');
    const havdalahItem = items.find((i: { category: string }) => i.category === 'havdalah');
    const parshaItem = items.find((i: { category: string }) => i.category === 'parashat');

    return {
      candleLighting: candleLightingItem?.title?.match(/\d{1,2}:\d{2}/)?.[0] || '6:00 PM',
      havdalah: havdalahItem?.title?.match(/\d{1,2}:\d{2}/)?.[0] || '7:30 PM',
      parsha: parshaItem?.title?.replace('Parashat ', '') || 'Weekly Portion',
      hebrewDate: data.date || 'Nisan 1, 5785',
    };
  } catch {
    return null;
  }
}

export async function fetchHebrewDate(): Promise<string> {
  try {
    const today = new Date();
    const res = await fetch(
      `https://www.hebcal.com/converter?cfg=json&date=${today.toISOString().split('T')[0]}&g2h=1`
    );
    if (!res.ok) return 'Nisan 1, 5785';
    const data = await res.json();
    return `${data.hm} ${data.hd}, ${data.hy}` || 'Nisan 1, 5785';
  } catch {
    return 'Nisan 1, 5785';
  }
}

export const JEWISH_HOLIDAYS = [
  { name: 'Passover', date: '2025-04-12', icon: 'wine' },
  { name: 'Rosh Hashanah', date: '2025-09-22', icon: 'honey' },
  { name: 'Yom Kippur', date: '2025-10-01', icon: 'candle' },
  { name: 'Hanukkah', date: '2025-12-14', icon: 'menorah' },
];

// Sikh APIs
export interface Hukamnama {
  shabad: string;
  ang: number;
  source: string;
  english?: string;
}

export async function fetchHukamnama(): Promise<Hukamnama | null> {
  try {
    const res = await fetch('https://api.sikhnet.com/hukamnama/today');
    if (!res.ok) return null;
    const data = await res.json();
    return {
      shabad: data.shabad?.gurmukhi || data.hukamnama || '',
      ang: data.shabad?.ang || 1,
      source: 'Sri Guru Granth Sahib',
      english: data.shabad?.english || '',
    };
  } catch {
    return null;
  }
}

export const GURPURABS = [
  { name: 'Guru Gobind Singh Ji Birthday', date: '2025-01-05', icon: 'sword' },
  { name: 'Baisakhi', date: '2025-04-14', icon: 'wheat' },
  { name: 'Guru Nanak Dev Ji Birthday', date: '2025-11-04', icon: 'star' },
];

// Mindfulness / No Religion
export const MINDFULNESS_QUOTES = [
  { text: 'The present moment is filled with joy and happiness. If you are attentive, you will see it.', author: 'Thich Nhat Hanh' },
  { text: 'Mindfulness is a way of befriending ourselves and our experience.', author: 'Jon Kabat-Zinn' },
  { text: 'The little things? The little moments? They are not little.', author: 'Jon Kabat-Zinn' },
  { text: 'Be where you are, not where you think you should be.', author: 'Unknown' },
  { text: 'Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.', author: 'Thich Nhat Hanh' },
];

export function getDailyQuote() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return MINDFULNESS_QUOTES[dayOfYear % MINDFULNESS_QUOTES.length];
}

// Prayer Learning Guides
export const PRAYER_GUIDES = {
  islam: {
    name: 'Islamic Prayer Guide',
    steps: [
      { title: 'Perform Wudu (Ablution)', description: 'Wash face, hands, arms to elbows, wipe head, wash feet' },
      { title: 'Face the Qibla', description: 'Stand facing Mecca, approximately northeast from most locations' },
      { title: 'Make Niyyah (Intention)', description: 'In your heart, intend which prayer you are performing' },
      { title: 'Say Allahu Akbar', description: 'Raise hands to ears, say "Allah is Greatest"' },
      { title: 'Recite Fatiha', description: 'Recite the opening chapter of the Quran' },
      { title: 'Perform Ruku', description: 'Bow, hands on knees, recite Subhana Rabbi al-Azeem' },
      { title: 'Stand and Prostrate', description: 'Return to standing, then prostrate (sujood) twice' },
      { title: 'Complete the Rakah', description: 'Repeat cycle for required number of units (rakat)' },
    ],
    resources: [
      { title: 'How to Pray Salah', url: 'https://www.islamicrelief.org.uk/what-we-do/supplications/how-to-pray-salah/' },
      { title: 'New Muslim Guide', url: 'https://www.newmuslim.net/' },
    ],
  },
  christian: {
    name: 'Christian Prayer Guide',
    steps: [
      { title: 'Find a Quiet Space', description: 'Choose a place free from distractions' },
      { title: 'Prepare Your Heart', description: 'Take a few deep breaths, calm your mind' },
      { title: 'Open with Praise', description: 'Begin by praising God for who He is' },
      { title: 'Confess and Repent', description: 'Acknowledge your sins and ask forgiveness' },
      { title: 'Give Thanks', description: 'Express gratitude for God\'s blessings' },
      { title: 'Present Your Requests', description: 'Share your needs and intercede for others' },
      { title: 'Listen and Meditate', description: 'Spend time listening in silence' },
      { title: 'Close in Jesus Name', description: 'End your prayer in the name of Jesus' },
    ],
    resources: [
      { title: 'How to Pray', url: 'https://www.navigators.org/resource/how-to-pray/' },
      { title: 'Lords Prayer Guide', url: 'https://www.bible.com/' },
    ],
  },
  hindu: {
    name: 'Hindu Puja Guide',
    steps: [
      { title: 'Purify Yourself', description: 'Take a bath and wear clean clothes' },
      { title: 'Prepare the Altar', description: 'Set up idols, pictures, and puja items' },
      { title: 'Light the Lamp', description: 'Light an oil lamp or incense' },
      { title: 'Invoke the Deity', description: 'Chant mantras to invite the divine presence' },
      { title: 'Offer Items', description: 'Offer flowers, fruits, water, and food' },
      { title: 'Recite Mantras', description: 'Chant sacred verses like Gayatri Mantra' },
      { title: 'Perform Aarti', description: 'Wave lighted lamp in circular motion' },
      { title: 'Seek Blessings', description: 'Ask for blessings and express gratitude' },
    ],
    resources: [
      { title: 'How to Do Puja', url: 'https://www.hinduismtoday.com/' },
      { title: 'Sanskrit Mantras', url: 'https://www.sacred-texts.com/hin/' },
    ],
  },
  jewish: {
    name: 'Jewish Prayer Guide',
    steps: [
      { title: 'Prepare with Kavanah', description: 'Set your intention and focus your mind' },
      { title: 'Put on Tallit and Tefillin', description: 'Wear prayer shawl and phylacteries (for men)' },
      { title: 'Morning Blessings', description: 'Recite Birchot HaShachar (morning blessings)' },
      { title: 'Shema and Amidah', description: 'Recite the central prayers of Jewish liturgy' },
      { title: 'Torah Study', description: 'Read from the weekly Torah portion' },
      { title: 'Closing Prayers', description: 'Say Aleinu and other concluding prayers' },
      { title: 'Kaddish', description: 'Recite sanctification prayer if in a minyan' },
      { title: 'Reflect', description: 'Take time for personal meditation' },
    ],
    resources: [
      { title: 'How to Pray', url: 'https://www.chabad.org/library/article_cdo/aid/3922407/jewish/How-to-Pray.htm' },
      { title: 'Siddur Guide', url: 'https://www.sefaria.org/siddur' },
    ],
  },
  sikh: {
    name: 'Sikh Nitnem Guide',
    steps: [
      { title: 'Wake Early (Amrit Vela)', description: 'Rise before dawn for Japji Sahib' },
      { title: 'Perform Isnaan', description: 'Take a bath and wear clean clothes' },
      { title: 'Recite Japji Sahib', description: 'Morning prayer by Guru Nanak Dev Ji' },
      { title: 'Jaap Sahib', description: 'Recite the prayer praising God\'s attributes' },
      { title: 'Anand Sahib', description: 'Recite the song of bliss' },
      { title: 'Rehras Sahib', description: 'Evening prayer at sunset' },
      { title: 'Kirtan Sohila', description: 'Bedtime prayer before sleep' },
      { title: 'Simran', description: 'Meditate on Waheguru throughout the day' },
    ],
    resources: [
      { title: 'Nitnem Guide', url: 'https://www.sikhnet.com/nitnem' },
      { title: 'Learn Gurmukhi', url: 'https://www.sikhnet.com/pages/learn-gurmukhi' },
    ],
  },
  none: {
    name: 'Mindfulness Practice Guide',
    steps: [
      { title: 'Find a Quiet Space', description: 'Choose a calm environment free from distractions' },
      { title: 'Sit Comfortably', description: 'Sit with spine straight, hands resting on knees' },
      { title: 'Set a Timer', description: 'Start with 5-10 minutes, increase gradually' },
      { title: 'Focus on Breath', description: 'Notice the natural rhythm of breathing' },
      { title: 'Observe Thoughts', description: 'Watch thoughts without judgment, let them pass' },
      { title: 'Body Scan', description: 'Notice sensations from head to toe' },
      { title: 'Loving-Kindness', description: 'Send wishes of peace to self and others' },
      { title: 'Gently Return', description: 'Slowly open eyes, carry mindfulness into day' },
    ],
    resources: [
      { title: 'Insight Timer', url: 'https://insighttimer.com/' },
      { title: 'Headspace Guide', url: 'https://www.headspace.com/' },
    ],
  },
};
