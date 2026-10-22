// ── Personalities seed data (WP9 / marathon Q14) ────────────────────────────
// Extracted VERBATIM from the hard-coded profiles that used to live in
// src/app/personalities/[slug]/page.tsx — no facts added, removed or
// embellished. This is the fallback dataset used while migration
// 0005_personalities.sql is unapplied, and the source the migration's
// seed rows were generated from. Dubious entries (flagged in the Q14
// evidence pack) are preserved as-is pending human verification.


export interface PersonalityProfile {
  slug: string;
  name: string;
  title: string;
  imageUrl?: string;
  birthDate?: string;
  deathDate?: string;
  nationality: string;
  city: string;
  citySlug: string;
  country: string;
  countrySlug: string;
  province: string;
  provinceSlug: string;
  description: string;
  primaryColor: string;
  timeline: { year: string; title: string; description: string }[];
  achievements: { icon: string; title: string; description: string }[];
  works: { title: string; year?: string; description: string; type?: string }[];
  quotes: { text: string; context?: string }[];
  descriptionSections: { title: string; content: string }[];
  wikiUrl?: string;
  amazonSearch?: string;
}

export const PERSONALITIES_SEED: Record<string, PersonalityProfile> = {
  'allama-iqbal': {
    slug: 'allama-iqbal',
    name: 'Allama Iqbal',
    title: 'Poet-Philosopher & Spiritual Father of Pakistan',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Allama_Iqbal.jpg',
    birthDate: '9 November 1877',
    deathDate: '21 April 1938',
    nationality: 'British Indian (Pakistani)',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    description: 'Sir Muhammad Iqbal, known as Allama Iqbal, was one of the most significant Muslim poets and philosophers of the 20th century. His poetry in Urdu and Persian revived Islamic spiritual and political thought and laid the philosophical foundation for Pakistan.',
    primaryColor: '#01411C',
    timeline: [
      { year: '1877', title: 'Born in Sialkot', description: 'Born into a Kashmiri family of artisans in Sialkot, Punjab.' },
      { year: '1905', title: 'Studies in Europe', description: 'Travels to Europe to study philosophy at Cambridge and Munich, earning his doctorate.' },
      { year: '1915', title: 'Asrar-e-Khudi Published', description: 'Publishes his landmark Persian poem on the philosophy of the self (ego).' },
      { year: '1930', title: 'Allahabad Address', description: 'Delivers his historic presidential address envisioning a separate Muslim state in the northwest of India.' },
      { year: '1938', title: 'Passes Away in Lahore', description: 'Dies in Lahore at age 60. His mausoleum is at the entrance of Badshahi Mosque.' },
    ],
    achievements: [
      { icon: '🖊️', title: 'National Poet of Pakistan', description: 'Declared Shair-e-Mashriq (Poet of the East) and national poet of Pakistan.' },
      { icon: '🎓', title: 'PhD from Munich', description: 'First Muslim to earn a doctorate in philosophy from Ludwig Maximilian University of Munich.' },
      { icon: '🏛️', title: 'Knighthood', description: 'Knighted by the British Crown in 1922 for his literary contributions.' },
      { icon: '🌍', title: 'Pan-Islamic Philosopher', description: 'His poetry inspired Muslim intellectuals from Egypt to Indonesia.' },
    ],
    works: [
      { title: 'Asrar-e-Khudi (Secrets of the Self)', year: '1915', description: 'Persian poetry on self-realisation and ego development.', type: 'Poetry' },
      { title: 'Bang-e-Dra (The Call of the Marching Bell)', year: '1924', description: 'First Urdu collection spanning three phases of his life.', type: 'Poetry' },
      { title: 'Bal-e-Jibril (Gabriel\'s Wing)', year: '1935', description: 'Considered his most mature Urdu poetry.', type: 'Poetry' },
      { title: 'Javid Nama (Book of Eternity)', year: '1932', description: 'Persian epic inspired by Dante\'s Divine Comedy.', type: 'Poetry' },
      { title: 'The Reconstruction of Religious Thought in Islam', year: '1930', description: 'His most important philosophical prose work in English.', type: 'Philosophy' },
    ],
    quotes: [
      { text: 'Khudi ko kar buland itna ke har taqdeer se pehle, Khuda bande se khud pooche bata teri raza kya hai.', context: 'From Bang-e-Dra — on elevating the self' },
      { text: 'Nations are born in the hearts of poets, they prosper and die in the hands of politicians.', context: 'Political philosophy' },
      { text: 'Rise above sectional interests and private ambitions... Pass from matter to spirit.', context: 'Allahabad Address, 1930' },
    ],
    descriptionSections: [
      { title: 'Early Life & Education', content: 'Born in Sialkot in 1877, Iqbal showed early aptitude for Persian and Urdu poetry. He studied at Government College Lahore under Sir Thomas Arnold, who encouraged him to study Western philosophy. He later studied at Cambridge, then earned a doctorate in Munich with his thesis on Persian metaphysics.' },
      { title: 'Philosophy of Khudi (Self)', content: 'Iqbal\'s central philosophical concept is Khudi — the development of the individual self through action, love and creative power. Drawing on Rumi, Nietzsche and Bergson, he argued that spiritual vitality begins with self-affirmation, not self-negation. This philosophy became the intellectual foundation for Muslim political awakening in South Asia.' },
      { title: 'Legacy in Pakistan', content: 'Iqbal\'s Allahabad Address of 1930 is considered the intellectual seed of Pakistan. He is buried at the entrance of Lahore\'s Badshahi Mosque. His birthday (9 November) is a national holiday. His image appears on all Pakistani currency.' },
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Muhammad_Iqbal',
    amazonSearch: 'https://www.amazon.com/s?k=allama+iqbal+books',
  },
  'imran-khan': {
    slug: 'imran-khan',
    name: 'Imran Khan',
    title: 'Cricketer, Philanthropist & Former Prime Minister',
    birthDate: '5 October 1952',
    nationality: 'Pakistani',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    description: 'Imran Khan is one of the greatest all-round cricketers in history, leading Pakistan to its only ICC Cricket World Cup title in 1992. He later founded Shaukat Khanum Cancer Hospital and PTI political party, becoming Pakistan\'s 22nd Prime Minister in 2018.',
    primaryColor: '#006400',
    timeline: [
      { year: '1971', title: 'Test debut', description: 'Made Test cricket debut for Pakistan at Edgbaston, Birmingham.' },
      { year: '1992', title: 'World Cup victory', description: 'Led Pakistan to its only Cricket World Cup title at the Melbourne Cricket Ground.' },
      { year: '1996', title: 'Founded PTI', description: 'Founded Pakistan Tehreek-e-Insaf political party with an anti-corruption platform.' },
      { year: '1994', title: 'Shaukat Khanum Hospital', description: 'Opened first cancer hospital in Pakistan offering 75% subsidised treatment.' },
      { year: '2018', title: 'Prime Minister', description: 'Elected as Pakistan\'s 22nd Prime Minister after PTI\'s election victory.' },
    ],
    achievements: [
      { icon: '🏆', title: 'World Cup Champion', description: 'Led Pakistan to the 1992 Cricket World Cup — the team\'s only World Cup win.' },
      { icon: '🏥', title: 'Cancer Hospital Founder', description: 'Founded Shaukat Khanum Memorial Cancer Hospital treating thousands annually.' },
      { icon: '📿', title: '362 Test Wickets', description: 'One of only eight players to have scored 3,000 runs and taken 300 wickets in Tests.' },
      { icon: '🎓', title: 'Namal University', description: 'Founded Namal University in Mianwali to provide higher education to rural Pakistan.' },
    ],
    works: [
      { title: 'Pakistan: A Personal History', year: '2011', description: 'Memoir and political manifesto outlining his vision for Pakistan.', type: 'Book' },
      { title: 'All Round View', year: '1988', description: 'Autobiography of his cricket career.', type: 'Book' },
    ],
    quotes: [
      { text: 'When you\'ve won the World Cup, you know that anything is possible if you believe.', context: 'Post-1992 World Cup speech' },
      { text: 'I am not a politician by nature. I came into politics because I saw the direction in which the country was heading.', context: 'Interview, 2013' },
    ],
    descriptionSections: [
      { title: 'Cricket Career', content: 'Imran Khan played international cricket for Pakistan from 1971 to 1992, captaining the side for much of that period. His all-round ability — combining 362 Test wickets with 3,807 Test runs — placed him among the greatest all-rounders of the 20th century.' },
      { title: 'Humanitarian Work', content: 'After retiring from cricket, Imran devoted himself to philanthropy. Shaukat Khanum Memorial Cancer Hospital, which he built in memory of his mother, now treats over 60% of patients free of charge and is the largest cancer hospital in Pakistan.' },
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Imran_Khan',
    amazonSearch: 'https://www.amazon.com/s?k=imran+khan+books',
  },
};

