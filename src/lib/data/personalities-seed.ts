// ── Personalities seed data (WP9 / marathon Q14) ────────────────────────────
// Extracted VERBATIM from the hard-coded profiles that used to live in
// src/app/personalities/[slug]/page.tsx — no facts added, removed or
// embellished. This is the fallback dataset used while migration
// 0005_personalities.sql is unapplied, and the source the migration's
// seed rows were generated from.
//
// R6 AMENDMENT (Round 2, 2026-10-22): the seven entries Agent D flagged in
// PR #8 were verified against checkable sources and corrected in place
// (disposition per entry in the R6 evidence pack), and fifteen verified
// profiles were added across the Lahore, Karachi and Islamabad pools.
// Migration 0006 is generated from this file, as 0005 was.


export interface PersonalityProfile {
  slug: string;
  name: string;
  title: string;
  imageUrl?: string;
  // P9: licence-recorded photo credit, rendered as a caption by
  // PersonalityHero. Full source records: docs/personality-photos-p9.md.
  imageCredit?: string;
  imageLicence?: string;
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Allama_Iqbal.jpg',
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
      { icon: '🎓', title: 'PhD from Munich (1908)', description: 'Earned his doctorate in philosophy from Ludwig Maximilian University of Munich in 1908; his thesis examined the development of metaphysics in Persia.' },
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
      { text: 'Nations are born in the hearts of poets, they prosper and die in the hands of politicians.', context: 'Widely attributed to Iqbal (attributed saying, not verbatim-sourced)' },
      { text: 'Rise above sectional interests and private ambitions... Pass from matter to spirit.', context: 'Allahabad Address, 1930' },
    ],
    descriptionSections: [
      { title: 'Early Life & Education', content: 'Born in Sialkot in 1877, Iqbal showed early aptitude for Persian and Urdu poetry. He studied at Government College Lahore under Sir Thomas Arnold, who encouraged him to study Western philosophy. He later studied at Cambridge, then earned a doctorate in Munich with his thesis on Persian metaphysics.' },
      { title: 'Philosophy of Khudi (Self)', content: 'Iqbal\'s central philosophical concept is Khudi — the development of the individual self through action, love and creative power. Drawing on Rumi, Nietzsche and Bergson, he argued that spiritual vitality begins with self-affirmation, not self-negation. This philosophy became the intellectual foundation for Muslim political awakening in South Asia.' },
      { title: 'Legacy in Pakistan', content: 'Iqbal\'s Allahabad Address of 1930 is considered the intellectual seed of Pakistan. He is buried at the entrance of Lahore\'s Badshahi Mosque. His birthday, 9 November (Iqbal Day), is a public holiday in Pakistan — restored by federal notification in 2022 after a suspension that began in 2015.' },
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Muhammad_Iqbal',
    amazonSearch: 'https://www.amazon.com/s?k=allama+iqbal+books',
  },
  'imran-khan': {
    slug: 'imran-khan',
    name: 'Imran Khan',
    title: 'Cricketer, Philanthropist & Former Prime Minister',
    // P9: local WebP from Wikimedia Commons "Imran Khan 2012.jpg"
    // (World Economic Forum, CC BY-SA 2.0) — see docs/personality-photos-p9.md.
    imageUrl: '/images/personalities/imran-khan.webp',
    imageCredit: 'World Economic Forum, via Wikimedia Commons',
    imageLicence: 'CC BY-SA 2.0',
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
      { year: '1994', title: 'Shaukat Khanum Hospital', description: 'Opened Pakistan\'s first dedicated cancer hospital, where — by the hospital\'s own published figures — more than 75% of patients are treated free of charge or with financial support.' },
      { year: '1996', title: 'Founded PTI', description: 'Founded Pakistan Tehreek-e-Insaf political party with an anti-corruption platform.' },
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
      { title: 'Humanitarian Work', content: 'After retiring from cricket, Imran devoted himself to philanthropy. Shaukat Khanum Memorial Cancer Hospital, which he built in memory of his mother, now treats more than 75% of its patients free of charge or with financial support (the hospital\'s own published figure) and is the largest cancer-care network in Pakistan.' },
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Imran_Khan',
    amazonSearch: 'https://www.amazon.com/s?k=imran+khan+books',
  },

  'faiz-ahmed-faiz': {
    slug: 'faiz-ahmed-faiz',
    name: 'Faiz Ahmed Faiz',
    title: 'Poet of Resistance & Romance',
    // P9: local WebP from Wikimedia Commons "Faiz, London 1983.jpg"
    // (Amarjit Chandan, CC BY-SA 4.0) — see docs/personality-photos-p9.md.
    imageUrl: '/images/personalities/faiz-ahmed-faiz.webp',
    imageCredit: 'Amarjit Chandan, via Wikimedia Commons',
    imageLicence: 'CC BY-SA 4.0',
    birthDate: '13 February 1911',
    deathDate: '20 November 1984',
    nationality: 'Pakistani',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    description: 'Faiz Ahmed Faiz, born in Narowal district and formed by Lahore, fused romance and revolution in Urdu poetry like no one before him. Editor, trade unionist and exile, he spent his last years in Lahore, where he died in 1984 and where his verse remains part of the city’s air.',
    primaryColor: '#7A1F1F',
    timeline: [
      { year: '1911', title: 'Born near Sialkot', description: 'Born in Kala Qader village, Sialkot district (now Narowal).' },
      { year: '1935', title: 'First collection', description: 'Begins publishing the poetry that becomes Naqsh-e-Faryadi (1941).' },
      { year: '1947', title: 'Editor in Lahore', description: 'Becomes the first editor of the Pakistan Times in Lahore.' },
      { year: '1979', title: 'Lenin Peace Prize', description: 'Receives the Lenin Peace Prize for his poetry and activism.' },
      { year: '1984', title: 'Dies in Lahore', description: 'Passes away in Lahore; his funeral draws the city’s literary world.' },
    ],
    achievements: [
      { icon: '🖊️', title: 'Voice of a Generation', description: 'His ghazals and nazms made political longing singable across South Asia.' },
      { icon: '🕊️', title: 'Lenin Peace Prize (1962)', description: 'Awarded the international peace prize for literature and activism.' },
      { icon: '📰', title: 'Founding Editor', description: 'First editor of the Pakistan Times, shaping post-Partition journalism.' },
    ],
    works: [
      { title: 'Naqsh-e-Faryadi', year: '1941', description: 'First major collection, blending love and social conscience.', type: 'Poetry' },
      { title: 'Nuskha Haye Wafa', description: 'The collected works (kulliyat) of his poetry.', type: 'Poetry' },
      { title: 'Mujh Se Pehli Si Mohabbat', description: 'His most quoted poem — a turn from private love to public sorrow.', type: 'Poem' },
    ],
    quotes: [
      { text: 'Mujh se pehli si mohabbat mere mehboob na maang', context: 'From his poem "Mujh Se Pehli Si Mohabbat" — Do not ask of me, my love, the love I once had for you' },
      { text: 'Bol ke lab azaad hain tere', context: 'From his poem "Bol" — Speak, for your lips are free' },
    ],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Faiz_Ahmed_Faiz',
  },
  'habib-jalib': {
    slug: 'habib-jalib',
    name: 'Habib Jalib',
    title: 'The People’s Poet',
    birthDate: '24 March 1928',
    deathDate: '13 March 1993',
    nationality: 'Pakistani',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    description: 'Habib Jalib, born in Hoshiarpur and settled in Lahore, was Pakistan’s street-corner revolutionary poet — jailed by successive regimes, he recited defiance to crowds in plain, unforgettable language. Lahore was his stage and his home until his death in 1993.',
    primaryColor: '#5B3A1E',
    timeline: [
      { year: '1928', title: 'Born in Hoshiarpur', description: 'Born in British Punjab; migrates to Pakistan after Partition.' },
      { year: '1950s', title: 'Voice of the Streets', description: 'Rises as a public poet of protest in Lahore’s gatherings.' },
      { year: '1970s', title: 'Defies Martial Law', description: 'Imprisoned under Zia-ul-Haq for refusing silence.' },
      { year: '1993', title: 'Dies in Lahore', description: 'Passes away in Lahore, mourned as the people’s poet.' },
    ],
    achievements: [
      { icon: '✊', title: 'Poet of Protest', description: 'His verses became slogans of democratic movements.' },
      { icon: '⛓️', title: 'Jailed, Not Silenced', description: 'Imprisoned repeatedly rather than stop reciting.' },
      { icon: '🎤', title: 'Public Mushaira Legend', description: 'Drew vast crowds with direct, musical Urdu.' },
    ],
    works: [
      { title: 'Dastoor', description: 'His signature poem of defiance against unjust rule — "Main nahin manta" (I refuse to accept).', type: 'Poem' },
      { title: 'Kuliyat-e-Habib Jalib', description: 'Collected works of his poetry.', type: 'Poetry' },
    ],
    quotes: [
      { text: 'Main nahin manta, main nahin janta.', context: 'From his poem "Dastoor" — I do not accept, I do not acknowledge (this unjust order).' },
    ],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Habib_Jalib',
  },
  'ashfaq-ahmed': {
    slug: 'ashfaq-ahmed',
    name: 'Ashfaq Ahmed',
    title: 'Writer, Playwright & Sage of the Airwaves',
    birthDate: '22 August 1925',
    deathDate: '7 September 2004',
    nationality: 'Pakistani',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    description: 'Ashfaq Ahmed, born in Muktsar and based in Lahore, wrote fiction and drama steeped in Punjabi soil and Sufi reflection. His radio and television presence — above all the storytelling persona of Baba Sahib in "Zavia" — made him a household sage across Pakistan.',
    primaryColor: '#33523B',
    timeline: [
      { year: '1925', title: 'Born in Muktsar', description: 'Born in Punjab’s Muktsar; educated at Government College Lahore.' },
      { year: '1950s', title: 'Radio Pakistan', description: 'Begins the broadcasting career that defines his public voice.' },
      { year: '1960s', title: '"Aik Mohabbat Sau Afsanay"', description: 'His celebrated short-story collection appears.' },
      { year: '2004', title: 'Dies in Lahore', description: 'Passes away in Lahore, where he had lived and worked for decades.' },
    ],
    achievements: [
      { icon: '📚', title: 'Master Storyteller', description: 'Among Urdu’s most loved short-story writers.' },
      { icon: '📻', title: 'Voice of Radio & PTV', description: '"Talqeen Shah" and "Zavia" reached millions.' },
      { icon: '🏅', title: 'Pride of Performance', description: 'Received Pakistan’s Pride of Performance and Sitara-e-Imtiaz.' },
    ],
    works: [
      { title: 'Aik Mohabbat Sau Afsanay', description: 'One love, a hundred tales — his signature story collection.', type: 'Stories' },
      { title: 'Gaddarya', year: '1948', description: 'Early novel of Partition-era Punjab.', type: 'Novel' },
      { title: 'Zavia', description: 'Television talks in the voice of the wise elder.', type: 'TV' },
    ],
    quotes: [],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Ashfaq_Ahmed',
  },
  'bano-qudsia': {
    slug: 'bano-qudsia',
    name: 'Bano Qudsia',
    title: 'Novelist of the Inner Life',
    birthDate: '28 November 1928',
    deathDate: '4 February 2017',
    nationality: 'Pakistani',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    description: 'Bano Qudsia, born in Amritsar and settled in Lahore after Partition, wrote "Raja Gidh" — among the most debated Urdu novels of the twentieth century. Wife of Ashfaq Ahmed, she built her own towering reputation in fiction and drama from Lahore.',
    primaryColor: '#6E3B5C',
    timeline: [
      { year: '1928', title: 'Born in Amritsar', description: 'Born in British Punjab; migrates to Lahore in 1947.' },
      { year: '1981', title: '"Raja Gidh" Published', description: 'Her landmark novel on morality and heredity appears.' },
      { year: '2017', title: 'Dies in Lahore', description: 'Passes away in Lahore at 88.' },
    ],
    achievements: [
      { icon: '📖', title: '"Raja Gidh"', description: 'A canonical Urdu novel, still argued over in classrooms.' },
      { icon: '🎭', title: 'Drama Writer', description: 'Her plays were staples of Pakistani television.' },
      { icon: '🏅', title: 'Hilal-e-Imtiaz', description: 'Received one of Pakistan’s highest civil awards.' },
    ],
    works: [
      { title: 'Raja Gidh', year: '1981', description: 'The vulture king — a novel of sin, heredity and society.', type: 'Novel' },
      { title: 'Aatish-e-Zer-e-Paa', description: 'Stories of women and inner conflict.', type: 'Stories' },
    ],
    quotes: [],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Bano_Qudsia',
  },
  'abdus-salam': {
    slug: 'abdus-salam',
    name: 'Abdus Salam',
    title: 'Nobel Laureate Theoretical Physicist',
    birthDate: '29 January 1926',
    deathDate: '21 November 1996',
    nationality: 'Pakistani',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    description: 'Abdus Salam, born in Jhang and educated at Government College Lahore, shared the 1979 Nobel Prize in Physics for electroweak unification — the first Pakistani and first Muslim Nobel laureate in science. He founded the ICTP in Trieste so scientists from the developing world could work at the frontier.',
    primaryColor: '#1F3A5F',
    timeline: [
      { year: '1926', title: 'Born in Jhang', description: 'Born in Punjab; a prodigy at Government College Lahore and Cambridge.' },
      { year: '1951', title: 'Professor at Lahore', description: 'Returns to head mathematics at Government College Lahore.' },
      { year: '1964', title: 'Founds the ICTP', description: 'Establishes the International Centre for Theoretical Physics in Trieste.' },
      { year: '1979', title: 'Nobel Prize in Physics', description: 'Shares the Nobel for the electroweak theory.' },
      { year: '1996', title: 'Dies in Oxford', description: 'Passes away in Oxford; buried in Rabwah, Pakistan.' },
    ],
    achievements: [
      { icon: '🏆', title: 'Nobel Prize (1979)', description: 'First Pakistani Nobel laureate; shared the Physics prize.' },
      { icon: '🔬', title: 'Electroweak Unification', description: 'Unified two fundamental forces on paper before experiment confirmed it.' },
      { icon: '🌍', title: 'ICTP Founder', description: 'Built a home for developing-world physicists in Trieste.' },
    ],
    works: [
      { title: 'Gauge Unification of Fundamental Forces', year: '1979', description: 'His Nobel lecture and summation of the electroweak work.', type: 'Physics' },
      { title: 'Ideals and Realities', description: 'Essays on science, faith and the developing world.', type: 'Essays' },
    ],
    quotes: [],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Abdus_Salam',
  },
  'noor-jehan': {
    slug: 'noor-jehan',
    name: 'Noor Jehan',
    title: 'Malika-e-Tarannum — Queen of Melody',
    birthDate: '21 September 1926',
    deathDate: '23 December 2000',
    nationality: 'Pakistani',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    description: 'Noor Jehan, born Allah Rakhi Wasai in Kasur, became the defining voice of South Asian film music — first in Lahore’s studios and Bombay, then as the grande dame of Pakistan’s own cinema. Her wartime anthem singing in 1965 made her a national institution.',
    primaryColor: '#7A5B12',
    timeline: [
      { year: '1926', title: 'Born in Kasur', description: 'Born into a family of musicians in Kasur, Punjab.' },
      { year: '1940s', title: 'Bombay Stardom', description: 'Child star turned leading singer-actress of Indian cinema.' },
      { year: '1947', title: 'Chooses Pakistan', description: 'Migrates to Lahore and helps build its film industry.' },
      { year: '1965', title: 'Voice of a Nation', description: 'Her patriotic songs during the 1965 war become immortal.' },
      { year: '2000', title: 'Dies in Karachi', description: 'Passes away in Karachi; mourned across South Asia.' },
    ],
    achievements: [
      { icon: '👑', title: 'Malika-e-Tarannum', description: 'The title "Queen of Melody" was conferred by a grateful industry.' },
      { icon: '🎙️', title: 'Thousands of Songs', description: 'Recorded an estimated ten thousand songs across languages and decades.' },
      { icon: '🇵🇰', title: 'National Icon', description: 'Awarded the Pride of Performance; her 1965 anthems are canon.' },
    ],
    works: [
      { title: 'Anmol Ghadi', year: '1946', description: 'Her breakthrough Bombay film as singer-actress.', type: 'Film' },
      { title: 'Chanway', year: '1951', description: 'The first film she directed in Pakistan.', type: 'Film' },
      { title: 'Ae Watan Ke Sajiley Jawano', year: '1965', description: 'The patriotic anthem of the 1965 war.', type: 'Song' },
    ],
    quotes: [],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Noor_Jehan',
  },
  'amrita-pritam': {
    slug: 'amrita-pritam',
    name: 'Amrita Pritam',
    title: 'Punjabi Poet of Love and Partition',
    birthDate: '31 August 1919',
    deathDate: '31 October 2005',
    nationality: 'Pakistani',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    description: 'Amrita Pritam, born in Gujranwala and formed in Lahore’s literary circles, became the foremost woman’s voice in Punjabi letters. Her elegy "Ajj Aakhaan Waris Shah Nu" — addressed to Punjab’s great Sufi poet amid Partition’s violence — is recited on both sides of the border.',
    primaryColor: '#8A3324',
    timeline: [
      { year: '1919', title: 'Born in Gujranwala', description: 'Born in Punjab; begins publishing poetry as a teenager.' },
      { year: '1930s–40s', title: 'Lahore’s Literary World', description: 'Rises in the Progressive Writers’ circle in Lahore.' },
      { year: '1947', title: 'Partition Elegy', description: 'Writes "Ajj Aakhaan Waris Shah Nu" as Punjab burns.' },
      { year: '2005', title: 'Dies in Delhi', description: 'Passes away in Delhi, honoured in both India and Pakistan.' },
    ],
    achievements: [
      { icon: '🖊️', title: 'First Woman of Punjabi Letters', description: 'The dominant female voice of modern Punjabi poetry.' },
      { icon: '📜', title: '"Ajj Aakhaan Waris Shah Nu"', description: 'Partition’s most famous elegy.' },
      { icon: '🏅', title: 'Jnanpith Award (1982)', description: 'India’s highest literary honour, among many awards.' },
    ],
    works: [
      { title: 'Ajj Aakhaan Waris Shah Nu', year: '1947', description: 'Ode to Waris Shah over a wounded Punjab.', type: 'Poem' },
      { title: 'Pinjar', year: '1950', description: 'Novel of a woman abducted in Partition’s chaos; later a film.', type: 'Novel' },
      { title: 'Rasidi Ticket', year: '1976', description: 'Her candid autobiography — "The Revenue Stamp".', type: 'Memoir' },
    ],
    quotes: [
      { text: 'Ajj aakhaan Waris Shah nu, kiton qabran vichon bol.', context: 'Opening of her 1947 elegy: "Today I call on Waris Shah — speak, from among the graves."' },
    ],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Amrita_Pritam',
  },
  'muhammad-ali-jinnah': {
    slug: 'muhammad-ali-jinnah',
    name: 'Muhammad Ali Jinnah',
    title: 'Quaid-e-Azam — Founder of Pakistan',
    birthDate: '25 December 1876',
    deathDate: '11 September 1948',
    nationality: 'Pakistani',
    city: 'Karachi', citySlug: 'karachi',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Sindh', provinceSlug: 'sindh',
    description: 'Muhammad Ali Jinnah, born in Karachi, was the barrister who led the Pakistan Movement and became the country’s first Governor-General in 1947. Karachi is his birthplace, his political cradle and his burial place — the mausoleum Mazar-e-Quaid stands at the city’s heart.',
    primaryColor: '#01411C',
    timeline: [
      { year: '1876', title: 'Born in Karachi', description: 'Born in Wazir Mansion, Karachi, to a Khoja merchant family.' },
      { year: '1890s', title: 'Called to the Bar', description: 'Qualifies at Lincoln’s Inn, London; builds a Bombay practice.' },
      { year: '1940', title: 'Lahore Resolution', description: 'Presides over the Muslim League session that demands separate states.' },
      { year: '1947', title: 'Governor-General of Pakistan', description: 'Leads the new dominion; Karachi is its first capital.' },
      { year: '1948', title: 'Dies in Karachi', description: 'Passes away in Karachi a year after independence.' },
    ],
    achievements: [
      { icon: '🇵🇰', title: 'Founder of Pakistan', description: 'Negotiated a sovereign state into being through constitutional politics.' },
      { icon: '⚖️', title: 'Ambassador of Hindu-Muslim Unity', description: 'Gokhale’s famous tribute to his early bridge-building career.' },
      { icon: '🏛️', title: 'First Governor-General', description: 'Head of state of the new Pakistan, 1947–48.' },
    ],
    works: [
      { title: 'Lahore Resolution', year: '1940', description: 'The session he presided over that set Pakistan’s course.', type: 'Politics' },
      { title: '11 August 1947 Address', description: 'His founding speech on citizenship and equal rights.', type: 'Speech' },
    ],
    quotes: [
      { text: 'Unity, Faith, Discipline.', context: 'His guiding motto for the new nation.' },
      { text: 'No power on earth can undo Pakistan.', context: 'From his public addresses in the movement’s final years.' },
    ],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Muhammad_Ali_Jinnah',
  },
  'fatima-jinnah': {
    slug: 'fatima-jinnah',
    name: 'Fatima Jinnah',
    title: 'Madar-e-Millat — Mother of the Nation',
    birthDate: '31 July 1893',
    deathDate: '9 July 1967',
    nationality: 'Pakistani',
    city: 'Karachi', citySlug: 'karachi',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Sindh', provinceSlug: 'sindh',
    description: 'Fatima Jinnah, born in Karachi, was a dental surgeon who left her practice to stand beside her brother Muhammad Ali Jinnah through the Pakistan Movement. In 1965 she contested the presidency itself, and Pakistan remembers her as Madar-e-Millat — Mother of the Nation.',
    primaryColor: '#2E5E4E',
    timeline: [
      { year: '1893', title: 'Born in Karachi', description: 'Born in Karachi, youngest of the Jinnah siblings.' },
      { year: '1923', title: 'Dental Surgeon', description: 'Qualifies and opens a dental clinic in Bombay.' },
      { year: '1947', title: 'First Lady of the Movement', description: 'At the Quaid’s side through independence; settles in Karachi.' },
      { year: '1965', title: 'Runs for President', description: 'Contests the presidential election against Ayub Khan.' },
      { year: '1967', title: 'Dies in Karachi', description: 'Passes away in Karachi; buried beside her brother.' },
    ],
    achievements: [
      { icon: '🦷', title: 'Pioneer Professional', description: 'Among the first Muslim women dental surgeons of the subcontinent.' },
      { icon: '🗳️', title: 'Presidential Candidate (1965)', description: 'Her campaign electrified the country’s politics.' },
      { icon: '🇵🇰', title: 'Madar-e-Millat', description: 'Honoured as Mother of the Nation for her role in the movement.' },
    ],
    works: [
      { title: 'My Brother', year: '1987', description: 'Her biography of Muhammad Ali Jinnah, published posthumously.', type: 'Biography' },
    ],
    quotes: [],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Fatima_Jinnah',
  },
  'abdul-sattar-edhi': {
    slug: 'abdul-sattar-edhi',
    name: 'Abdul Sattar Edhi',
    title: 'Humanitarian — Founder of the Edhi Foundation',
    birthDate: '28 February 1928',
    deathDate: '8 July 2016',
    nationality: 'Pakistani',
    city: 'Karachi', citySlug: 'karachi',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Sindh', provinceSlug: 'sindh',
    description: 'Abdul Sattar Edhi, born in Bantva, Gujarat and settled in Karachi, built from one small dispensary the largest volunteer ambulance and welfare network in Pakistan — orphanages, shelters, morgues and homes for the abandoned, run on donations and radical simplicity. Karachi was his base for seven decades.',
    primaryColor: '#3E5C50',
    timeline: [
      { year: '1928', title: 'Born in Bantva', description: 'Born in Gujarat; migrates to Karachi at Partition.' },
      { year: '1951', title: 'First Dispensary', description: 'Opens a small free dispensary in Karachi’s Mithadar.' },
      { year: '1970s–90s', title: 'A National Network', description: 'Edhi ambulances, centres and shelters spread across Pakistan.' },
      { year: '2016', title: 'Dies in Karachi', description: 'Passes away in Karachi; given a state funeral.' },
    ],
    achievements: [
      { icon: '🚑', title: 'Largest Volunteer Ambulance Service', description: 'The Edhi fleet became the world’s largest volunteer ambulance network.' },
      { icon: '🏠', title: 'Homes for the Abandoned', description: 'Orphanages, women’s shelters and the famous jhoolas (baby cradles).' },
      { icon: '🕊️', title: 'State Funeral', description: 'One of very few civilians accorded a full state funeral in Pakistan.' },
    ],
    works: [
      { title: 'Edhi Foundation', year: '1951', description: 'The welfare organisation he founded and ran until his death.', type: 'Institution' },
    ],
    quotes: [
      { text: 'No religion is higher than humanity.', context: 'His oft-stated guiding principle, recorded across his interviews and the Foundation’s materials.' },
    ],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Abdul_Sattar_Edhi',
  },
  'sadequain': {
    slug: 'sadequain',
    name: 'Sadequain',
    title: 'Painter & Calligrapher',
    birthDate: '30 June 1923',
    deathDate: '10 February 1987',
    nationality: 'Pakistani',
    city: 'Karachi', citySlug: 'karachi',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Sindh', provinceSlug: 'sindh',
    description: 'Sadequain, born Syed Ahmed Ali in Amroha and based in Karachi, fused calligraphy and modern painting into a style recognised worldwide — giant murals, cactus-thorn figures and Quranic calligraphy panels, most of them given away rather than sold. He died in Karachi in 1987.',
    primaryColor: '#4A2E5C',
    timeline: [
      { year: '1923', title: 'Born in Amroha', description: 'Born in British India; trains as a calligrapher-copyist.' },
      { year: '1940s–50s', title: 'Karachi Canvas', description: 'Settles in Karachi after Partition; fame grows through the 1950s.' },
      { year: '1960s', title: 'Murals & Calligraphy', description: 'Paints monumental works for public buildings across Pakistan.' },
      { year: '1987', title: 'Dies in Karachi', description: 'Passes away in Karachi, leaving thousands of works.' },
    ],
    achievements: [
      { icon: '🎨', title: 'Calligraphy-Modernist', description: 'Merged Islamic calligraphy with modernist figuration.' },
      { icon: '🖼️', title: 'Public Murals', description: 'His ceiling and wall works anchor major Pakistani institutions.' },
      { icon: '🎁', title: 'Art Given Away', description: 'Donated the bulk of his enormous output to institutions and friends.' },
    ],
    works: [
      { title: 'Frere Hall Ceiling, Karachi', description: 'His vast calligraphic ceiling mural — a Karachi landmark.', type: 'Mural' },
      { title: 'Rubaiyat Illustrations', description: 'Illustrated editions of Omar Khayyam’s quatrains in his own hand.', type: 'Illustration' },
    ],
    quotes: [],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Sadequain',
  },
  'mehdi-hasan': {
    slug: 'mehdi-hasan',
    name: 'Mehdi Hasan',
    title: 'Shahenshah-e-Ghazal — King of Ghazal',
    birthDate: '18 July 1927',
    deathDate: '13 June 2012',
    nationality: 'Pakistani',
    city: 'Karachi', citySlug: 'karachi',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Sindh', provinceSlug: 'sindh',
    description: 'Mehdi Hasan, born in Luna, Rajasthan and settled in Karachi, gave the Urdu ghazal its modern concert voice — a classically trained, velvet delivery that made poets from Ghalib to Faiz beloved of millions. Pakistan named him Shahenshah-e-Ghazal, the Emperor of Ghazal.',
    primaryColor: '#274156',
    timeline: [
      { year: '1927', title: 'Born in Luna', description: 'Born into a family of court musicians in Rajasthan.' },
      { year: '1947', title: 'Settles in Karachi', description: 'Migrates to Pakistan; works briefly as a mechanic before music claims him.' },
      { year: '1950s–60s', title: 'Radio to Playback', description: 'Rises on Radio Pakistan, then dominates film playback.' },
      { year: '2012', title: 'Dies in Karachi', description: 'Passes away in Karachi after a long illness.' },
    ],
    achievements: [
      { icon: '👑', title: 'Shahenshah-e-Ghazal', description: 'The undisputed emperor of the sung ghazal.' },
      { icon: '🎼', title: 'Classical Foundation', description: 'Brought raga discipline to popular singing.' },
      { icon: '🏅', title: 'Pride of Performance', description: 'Among many national honours for a six-decade career.' },
    ],
    works: [
      { title: 'Ranjish Hi Sahi', description: 'His signature ghazal — longing rendered in velvet.', type: 'Song' },
      { title: 'Ab Ke Hum Bichde', description: 'The farewell ghazal generations know by heart.', type: 'Song' },
    ],
    quotes: [],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Mehdi_Hasan',
  },
  'abdul-qadeer-khan': {
    slug: 'abdul-qadeer-khan',
    name: 'Abdul Qadeer Khan',
    title: 'Nuclear Scientist',
    birthDate: '1 April 1936',
    deathDate: '10 October 2021',
    nationality: 'Pakistani',
    city: 'Islamabad', citySlug: 'islamabad',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Islamabad Capital Territory', provinceSlug: 'islamabad-capital-territory',
    description: 'Abdul Qadeer Khan, born in Bhopal and settled in Pakistan, was the metallurgist who built and led the Khan Research Laboratories at Kahuta, near Islamabad — the centre of Pakistan’s uranium enrichment programme. The capital was his home and workplace for the decisive decades of his career.',
    primaryColor: '#31456B',
    timeline: [
      { year: '1936', title: 'Born in Bhopal', description: 'Born in British India; migrates to Pakistan in 1952.' },
      { year: '1976', title: 'Founds KRL', description: 'Returns to lead the enrichment project that becomes Khan Research Laboratories.' },
      { year: '1998', title: 'Nuclear Tests', description: 'Pakistan conducts its nuclear tests; Khan is the programme’s public face.' },
      { year: '2021', title: 'Dies in Islamabad', description: 'Passes away in Islamabad; buried in the capital with state honours.' },
    ],
    achievements: [
      { icon: '🔬', title: 'Built KRL', description: 'Founded and led the laboratories at the heart of the enrichment programme.' },
      { icon: '🏅', title: 'Nishan-e-Imtiaz (twice)', description: 'Received Pakistan’s highest civil award twice — a rare distinction.' },
      { icon: '🎓', title: 'Metallurgist', description: 'Trained in Berlin, Delft and Leuven in physical metallurgy.' },
    ],
    works: [
      { title: 'Khan Research Laboratories', year: '1976', description: 'The research institution he founded at Kahuta.', type: 'Institution' },
    ],
    quotes: [],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Abdul_Qadeer_Khan',
  },
  'benazir-bhutto': {
    slug: 'benazir-bhutto',
    name: 'Benazir Bhutto',
    title: 'Twice Prime Minister of Pakistan',
    birthDate: '21 June 1953',
    deathDate: '27 December 2007',
    nationality: 'Pakistani',
    city: 'Islamabad', citySlug: 'islamabad',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Islamabad Capital Territory', provinceSlug: 'islamabad-capital-territory',
    description: 'Benazir Bhutto, born in Karachi, led the Pakistan Peoples Party from exile to power and twice governed from Islamabad as prime minister — the first woman to lead a Muslim-majority country. She was assassinated in Rawalpindi in 2007 while campaigning for a third term.',
    primaryColor: '#7A2040',
    timeline: [
      { year: '1953', title: 'Born in Karachi', description: 'Born to Zulfikar Ali Bhutto and Begum Nusrat Bhutto.' },
      { year: '1988', title: 'Prime Minister', description: 'Wins the 1988 election; governs from Islamabad at 35.' },
      { year: '1993', title: 'Second Term', description: 'Returns as prime minister after the 1993 election.' },
      { year: '2007', title: 'Assassinated', description: 'Killed in an attack after a rally in Rawalpindi’s Liaquat Bagh.' },
    ],
    achievements: [
      { icon: '🗳️', title: 'First Woman PM of a Muslim-Majority State', description: 'Her 1988 victory broke a global barrier.' },
      { icon: '📚', title: 'Oxford & Harvard', description: 'President of the Oxford Union before politics claimed her.' },
      { icon: '✊', title: 'Democracy’s Martyr', description: 'Her assassination reshaped Pakistan’s politics.' },
    ],
    works: [
      { title: 'Daughter of the East', year: '1988', description: 'Her autobiography, written in exile.', type: 'Book' },
      { title: 'Reconciliation', year: '2008', description: 'Posthumous book on Islam, democracy and the West.', type: 'Book' },
    ],
    quotes: [],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Benazir_Bhutto',
  },
  'pervez-musharraf': {
    slug: 'pervez-musharraf',
    name: 'Pervez Musharraf',
    title: 'Army Chief & President of Pakistan',
    birthDate: '11 August 1943',
    deathDate: '5 February 2023',
    nationality: 'Pakistani',
    city: 'Islamabad', citySlug: 'islamabad',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Islamabad Capital Territory', provinceSlug: 'islamabad-capital-territory',
    description: 'Pervez Musharraf, born in Delhi and raised in Karachi and Ankara, rose to Chief of Army Staff and in 1999 took power in Islamabad, ruling Pakistan as chief executive and then president until 2008. The capital was the seat of his government for nine years.',
    primaryColor: '#3F4A3A',
    timeline: [
      { year: '1943', title: 'Born in Delhi', description: 'Born in British India; family migrates to Karachi in 1947.' },
      { year: '1998', title: 'Army Chief', description: 'Appointed Chief of Army Staff.' },
      { year: '1999–2008', title: 'Rules from Islamabad', description: 'Takes power in October 1999; president 2001–2008.' },
      { year: '2023', title: 'Dies in Dubai', description: 'Passes away in Dubai; buried in Karachi.' },
    ],
    achievements: [
      { icon: '🎖️', title: 'Four-Star General', description: 'Rose through the artillery and special forces to lead the army.' },
      { icon: '🏛️', title: 'President 2001–2008', description: 'Head of state through the post-2001 realignments.' },
      { icon: '📖', title: '"In the Line of Fire"', description: 'His memoir became an international bestseller.' },
    ],
    works: [
      { title: 'In the Line of Fire', year: '2006', description: 'Memoir of his life and presidency.', type: 'Book' },
    ],
    quotes: [],
    descriptionSections: [],
    wikiUrl: 'https://en.wikipedia.org/wiki/Pervez_Musharraf',
  },
  // ── P3 (final28, 2026-10-28): two profiles that were live stubs ─────────
  // Their production database rows carried only the old-shape fields
  // (profession, birth/death year, birth city), so the detail template
  // rendered an empty title, an empty summary and empty sections, plus
  // the template's short-answer fallback claim. These records fill every
  // field from the sources listed in the migration (0016) and in the PR
  // evidence pack. No image: no portrait URL was verified this pass, and
  // the hero renders its no-image panel rather than a guessed URL.
  // Titles are kept short on purpose: the page title formula is
  // `${name} — ${title} | WorldCityHub`, so these two stay within the
  // 60-character title gate even before the P4 meta-generator fix.
  'nusrat-fateh-ali-khan': {
    slug: 'nusrat-fateh-ali-khan',
    name: 'Nusrat Fateh Ali Khan',
    title: 'Shahenshah-e-Qawwali',
    birthDate: '13 October 1948',
    deathDate: '16 August 1997',
    nationality: 'Pakistani',
    city: 'Faisalabad', citySlug: 'faisalabad',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    description: 'Nusrat Fateh Ali Khan (1948–1997) was Pakistan\'s Shahenshah-e-Qawwali, whose voice carried Sufi music from Faisalabad to audiences worldwide.',
    primaryColor: '#7A2E1F',
    timeline: [
      { year: '1948', title: 'Born in Lyallpur', description: 'Born on 13 October 1948 in Lyallpur, now Faisalabad, into a family of qawwals led by his father, Fateh Ali Khan.' },
      { year: '1964', title: 'First performance at father\'s chehlum', description: 'Following his father\'s death in 1964, sings at his father\'s chehlum — his first public performance, at age 15 — and trains with his uncles Mubarak Ali Khan and Salamat Ali Khan.' },
      { year: '1965', title: 'First performance as leader', description: 'His first performance as leader of the family qawwali party comes in March 1965, at a studio recording broadcast as part of Radio Pakistan\'s Jashn-e-Baharan festival; he had become lead singer alongside his uncle Mubarak Ali Khan in 1964.' },
      { year: '1971', title: 'Leads the family party', description: 'Becomes head of the family qawwali party after the death of his uncle Mubarak Ali Khan.' },
      { year: '1980s', title: 'Signed in Britain', description: 'Signed by Oriental Star Agencies in Birmingham in the early 1980s and begins taking qawwali to audiences beyond Pakistan.' },
      { year: '1990', title: 'Mustt Mustt', description: 'Releases Mustt Mustt with Canadian guitarist Michael Brook; its Massive Attack remix carries qawwali to a British crossover audience.' },
      { year: '1995', title: 'UNESCO Music Prize', description: 'Receives the UNESCO Music Prize for his contribution to music.' },
      { year: '1997', title: 'Dies in London', description: 'Dies in London on 16 August 1997, aged 48, in a year that also brings two Grammy nominations; he is buried in Faisalabad.' },
    ],
    achievements: [
      { icon: '👑', title: 'Shahenshah-e-Qawwali', description: 'Known as the King of Kings of Qawwali, the title by which audiences around the world knew him.' },
      { icon: '🎙️', title: '125+ Qawwali Albums', description: 'Recorded more than 125 qawwali albums, a Guinness World Record for the most qawwali recordings (as of 2001).' },
      { icon: '🏅', title: 'UNESCO Music Prize (1995)', description: 'Received the UNESCO Music Prize in 1995, after Pakistan\'s Pride of Performance award in 1987.' },
      { icon: '🌍', title: 'Qawwali Goes Global', description: 'Toured in more than 40 countries and recorded with Peter Gabriel, Michael Brook and Eddie Vedder.' },
    ],
    works: [
      { title: 'Mustt Mustt', year: '1990', description: 'Fusion album with Michael Brook on Real World; its title track, remixed by Massive Attack, carried qawwali to a British crossover audience.', type: 'Album' },
      { title: 'Night Song', year: '1996', description: 'Second collaboration with Michael Brook, nominated for a Grammy Award.', type: 'Album' },
      { title: 'Shahen-Shah', description: 'His Real World album introducing his qawwali party\'s sound to international listeners.', type: 'Album' },
      { title: 'Allah Hoo', description: 'A signature traditional qawwali recording, sung in praise of God.', type: 'Song' },
      { title: 'Dama Dam Mast Qalandar', description: 'A signature devotional song honouring Lal Shahbaz Qalandar, a staple of his concerts.', type: 'Song' },
    ],
    quotes: [
      { text: 'To be a qawwal is more than being a performer, more than being an artist. One must be willing to release one\'s mind and soul from one\'s body to achieve ecstasy through music. Qawwali is enlightenment itself.', context: 'Interview, Chicago, 1993' },
      { text: 'Sufi music tries to banish the hatred living within all human beings. It does not belong to any one culture, but to all of us.', context: 'Outlook interview, January 1996' },
      { text: 'A man learns all his life, and dies the day he thinks that he has learnt everything.', context: 'Rediff interview, 1997' },
    ],
    descriptionSections: [
      { title: 'The Qawwali Tradition', content: 'Nusrat was born into a family that had sung qawwali for generations. His father, Fateh Ali Khan, was a noted qawwal, and after his father\'s death in 1964 Nusrat trained with his uncles Mubarak Ali Khan and Salamat Ali Khan before taking over the family party in 1971. He sang mainly in Urdu and Punjabi, and occasionally in Persian, building a style of extraordinary range, stamina and improvisation.' },
      { title: 'Going Global', content: 'From the 1980s Nusrat carried qawwali to more than 40 countries, recording for Peter Gabriel\'s Real World label and collaborating with Michael Brook and Eddie Vedder, while also composing and singing for Indian films. His musical legacy is carried forward by his nephews Rahat Fateh Ali Khan and Rizwan-Muazzam.' },
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Nusrat_Fateh_Ali_Khan',
  },
  'wasim-akram': {
    slug: 'wasim-akram',
    name: 'Wasim Akram',
    title: 'Sultan of Swing',
    birthDate: '3 June 1966',
    nationality: 'Pakistani',
    city: 'Lahore', citySlug: 'lahore',
    country: 'Pakistan', countrySlug: 'pakistan',
    province: 'Punjab', provinceSlug: 'punjab',
    description: 'Wasim Akram (born 1966) is Pakistan\'s Sultan of Swing, whose 916 international wickets include a man-of-the-match turn in the 1992 World Cup final.',
    primaryColor: '#14532D',
    timeline: [
      { year: '1966', title: 'Born in Lahore', description: 'Born on 3 June 1966 in Lahore, where he grows up playing street and club cricket.' },
      { year: '1984', title: 'Spotted at Lahore trials', description: 'An unknown club cricketer, he is spotted by Javed Miandad at trials at Lahore\'s Gaddafi Stadium and fast-tracked into the national side.' },
      { year: '1984', title: 'ODI debut', description: 'Makes his one-day international debut for Pakistan against New Zealand.' },
      { year: '1985', title: 'Test debut', description: 'Makes his Test debut against New Zealand; in his second Test he takes 10 wickets in the match.' },
      { year: '1988', title: 'Signs for Lancashire', description: 'Signs for Lancashire County Cricket Club in England, beginning a ten-year county career.' },
      { year: '1992', title: 'World Cup winner', description: 'Stars in Pakistan\'s World Cup final win over England at Melbourne: a quick 33 with the bat and 3 for 49 with the ball, earning man of the match.' },
      { year: '1996', title: '257 not out', description: 'Scores 257 not out against Zimbabwe at Sheikhupura, including 12 sixes.' },
      { year: '1999', title: 'World Cup final as captain', description: 'Captains Pakistan to the World Cup final, where Australia win at Lord\'s.' },
      { year: '2003', title: 'Retires', description: 'Retires from international cricket after the 2003 World Cup, with 414 Test wickets and 502 ODI wickets — the first bowler to 500 ODI wickets.' },
      { year: '2009', title: 'ICC Hall of Fame', description: 'Inducted into the ICC Cricket Hall of Fame.' },
      { year: '2022', title: 'Sultan: A Memoir', description: 'Publishes his memoir Sultan, written with Gideon Haigh.' },
    ],
    achievements: [
      { icon: '🏏', title: '916 International Wickets', description: '414 wickets in 104 Tests and 502 in 356 one-day internationals — the first bowler to reach 500 ODI wickets.' },
      { icon: '🏆', title: 'World Cup Winner (1992)', description: 'Man of the match in the 1992 World Cup final, with 33 runs and 3 for 49 against England at Melbourne.' },
      { icon: '🎯', title: 'Sultan of Swing', description: 'Master of swing in both directions and of reverse swing with the old ball, plus a lethal yorker.' },
      { icon: '🏅', title: 'ICC Hall of Fame (2009)', description: 'Inducted into the ICC Cricket Hall of Fame in 2009; named a Wisden Cricketer of the Year in 1993.' },
    ],
    works: [
      { title: 'Wasim', year: '1998', description: 'His first autobiography, written with Patrick Murphy.', type: 'Book' },
      { title: 'Sultan: A Memoir', year: '2022', description: 'His memoir, written with Gideon Haigh, covering his career and his life after cricket.', type: 'Book' },
    ],
    quotes: [
      { text: 'When Pakistan make the old ball swing it\'s called ball-tampering, but when everyone else does it, it\'s called reverse swing.', context: 'Daily Mirror interview, 2006' },
      { text: 'We were artists and we learnt the art from Imran.', context: 'Wisden interview, 2020' },
    ],
    descriptionSections: [
      { title: 'The Sultan of Swing', content: 'Wasim was a left-arm fast bowler who could swing the new ball both ways and, as it aged, make it reverse — a skill he and Waqar Younis turned into Pakistan\'s signature weapon in the 1990s. His yorker at the death and his control at pace made him dangerous in every phase of a one-day innings, and his batting — crowned by 257 not out against Zimbabwe — made him a genuine all-rounder.' },
      { title: 'After Playing', content: 'After retiring in 2003 Wasim stayed in the game as a coach and commentator, including a long association with Kolkata Knight Riders in the Indian Premier League, and in 2022 he published Sultan: A Memoir with Gideon Haigh. He remains one of the most recognisable voices in world cricket commentary.' },
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Wasim_Akram',
  },
};

