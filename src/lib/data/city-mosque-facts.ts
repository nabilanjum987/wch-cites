// ─────────────────────────────────────────────────────────────────────────────
// Per-city mosque + prayer-statistics facts for prayer-times pages.
//
// WHY THIS FILE EXISTS (defect found live 2026-10-29): the Mosque Finder
// and Prayer Statistics cards in PrayerTimesClient.tsx carried HARD-CODED
// Lahore content (Badshahi Mosque paragraph, Lahore landmark cards,
// "13,160,000 Muslim residents / 94%", "1,772 km²") rendered for EVERY
// city — Multan and Peshawar pages presented Lahore's landmarks and
// Lahore's figures as their own. Rule, same as faith-profiles.ts: a city
// shows only its OWN sourced facts; a city with no entry here renders a
// generic, figure-free version of both cards — never another city's data.
//
// SOURCES (nothing invented; capacities only where widely published):
//   Lahore — 2023 Census via faith-profiles.ts censusNote: Islam 95.07%
//     of Lahore city; Lahore District total 13,004,135 (F3, PBS Census
//     2023) → ≈12.36M Muslim residents. District area 1,772 km².
//     Badshahi Mosque: built 1673, capacity 100,000 (Wikidata P1083,
//     verified in the F1 findings fix). Data Darbar / Masjid Shuhada /
//     Jamia Masjid Garhi Shahu: the page's long-standing Lahore entries.
//   Karachi — 2023 Census via faith-profiles.ts censusNote: Islam 96.52%
//     of Karachi city; Karachi Division total 20,382,881 (F3) → ≈19.67M
//     Muslim residents. Division area 3,527 km². Masjid-e-Tooba (Defence,
//     1969) is one of the world's largest single-dome mosques, capacity
//     ≈5,000. Grand Jamia Mosque (Bahria Town, opened 2015) reported
//     capacity 800,000 including grounds. New Memon Masjid (1949).
//   Islamabad — PBS Census 2023 Table 9 via faith-profiles.ts censusNote:
//     Muslims 2,181,663 of 2,283,244 responses (95.55%); ICT total
//     2,363,863 (F3); ICT area 906 km². Faisal Mosque (completed 1986)
//     capacity 300,000 including grounds (widely published). Lal Masjid
//     (Aabpara, built 1965).
//   Multan — District population 5,362,305, area 3,720 km² (PBS Census
//     2023 via migration 0020). Shahi Eidgah Mosque built 1735 (Nawab
//     Abdul Samad Khan). Shah Rukn-e-Alam shrine 1320s; Bahauddin
//     Zakariya shrine 13th century. No district religion split is
//     published in the repo's sources, so NO Muslim share is claimed.
//   Peshawar — District population 4,758,762, area 1,518 km² (PBS Census
//     2023 via migration 0020). Mahabat Khan Mosque built in the 1630s
//     under Mughal governor Mahabat Khan; Sunehri Masjid (Saddar) 1892;
//     Qasim Ali Khan Mosque 1847. No Muslim share claimed (same reason).
// ─────────────────────────────────────────────────────────────────────────────

export interface CityMosqueEntry {
  name: string;
  area: string;
  built: string;
  icon: string;
  /** Only where a capacity is widely published; omitted otherwise. */
  capacity?: string;
}

export interface CityMosqueFacts {
  /** Mosque Finder card paragraph — this city's own landmarks only. */
  intro: string;
  mosques: CityMosqueEntry[];
  /** Prayer Statistics lead paragraph (sourced part; the component
   *  appends the live Fajr→Isha window sentence itself). */
  statsLead: string;
  stats: { value: string; label: string; icon: string }[];
}

const FACTS: Record<string, CityMosqueFacts> = {
  lahore: {
    intro:
      "Lahore's mosques range from the iconic Badshahi Mosque in the Walled City to neighbourhood mosques in every district. The Badshahi Mosque, built by Emperor Aurangzeb in 1673, can accommodate 100,000 worshippers simultaneously and remains one of the world's most magnificent religious structures. Data Darbar, the shrine of Sufi saint Hazrat Data Ganj Bakhsh, is open 24 hours and draws pilgrims from across Pakistan and the Muslim world.",
    mosques: [
      { name: 'Badshahi Mosque', area: 'Walled City', capacity: '100,000', built: '1673 AD', icon: '🕌' },
      { name: 'Data Darbar Shrine', area: 'Bhati Gate', capacity: 'Open 24hrs', built: '11th Century', icon: '⭐' },
      { name: 'Masjid Shuhada', area: 'Mall Road', capacity: '5,000', built: '1960s', icon: '🕌' },
      { name: 'Jamia Masjid Garhi Shahu', area: 'Garhi Shahu', capacity: '3,000', built: 'Historic', icon: '🕌' },
    ],
    statsLead:
      "Lahore is one of South Asia's most religiously vibrant cities, with an estimated 12.36 million Muslim residents — Islam is 95.07% of the city in the 2023 Census (Lahore District total 13,004,135). The city's mosques accommodate the five daily prayers, with the Badshahi Mosque alone capable of hosting 100,000 worshippers simultaneously. Friday prayers in Lahore draw particularly large congregations at the major mosques.",
    stats: [
      { value: '12.36M', label: 'Muslim population', icon: '👥' },
      { value: '95.07%', label: 'Muslim majority', icon: '☪️' },
      { value: '1,772 km²', label: 'District area', icon: '🗺️' },
      { value: '100,000', label: 'Badshahi capacity', icon: '⭐' },
    ],
  },
  karachi: {
    intro:
      "Karachi's mosques range from the white-marble Masjid-e-Tooba in Defence — one of the world's largest single-dome mosques — to the Grand Jamia Mosque in Bahria Town, among the largest mosques in the world, and neighbourhood mosques in every district of the city.",
    mosques: [
      { name: 'Grand Jamia Mosque', area: 'Bahria Town', capacity: '800,000 incl. grounds', built: '2015', icon: '🕌' },
      { name: 'Masjid-e-Tooba', area: 'Defence', capacity: '5,000', built: '1969', icon: '🕌' },
      { name: 'New Memon Masjid', area: 'M. A. Jinnah Road', built: '1949', icon: '🕌' },
    ],
    statsLead:
      "Karachi is Pakistan's largest city, with an estimated 19.67 million Muslim residents — Islam is 96.52% of the city in the 2023 Census (Karachi Division total 20,382,881). Its mosques accommodate the five daily prayers across the city's districts, and Friday prayers draw particularly large congregations at the major Jamia mosques.",
    stats: [
      { value: '19.67M', label: 'Muslim population', icon: '👥' },
      { value: '96.52%', label: 'Muslim majority', icon: '☪️' },
      { value: '20,382,881', label: 'Population (Census 2023)', icon: '🏙️' },
      { value: '3,527 km²', label: 'Division area', icon: '🗺️' },
    ],
  },
  islamabad: {
    intro:
      "Islamabad's landmark mosque is the Faisal Mosque at the foot of the Margalla Hills — its folded concrete shell is the symbol of the capital — alongside the historic Lal Masjid in Aabpara and a mosque in every sector of the city.",
    mosques: [
      { name: 'Faisal Mosque', area: 'Margalla Hills', capacity: '300,000 incl. grounds', built: '1986', icon: '🕌' },
      { name: 'Lal Masjid', area: 'Aabpara', built: '1965', icon: '🕌' },
    ],
    statsLead:
      "Islamabad's Muslim residents number 2,181,663 in the 2023 Census (PBS Table 9; Islamabad Capital Territory total 2,363,863). The Faisal Mosque alone can host 300,000 worshippers including its grounds, and mosques across the capital's sectors accommodate the five daily prayers.",
    stats: [
      { value: '2,181,663', label: 'Muslim residents (Census 2023)', icon: '👥' },
      { value: '95.55%', label: 'Muslim share (PBS Table 9)', icon: '☪️' },
      { value: '2,363,863', label: 'Population (Census 2023)', icon: '🏙️' },
      { value: '906 km²', label: 'Territory area', icon: '🗺️' },
    ],
  },
  multan: {
    intro:
      'Multan — the City of Saints — is known above all for its Sufi shrines, and its mosques include the Shahi Eidgah Mosque, built in 1735, alongside Jamia mosques in every neighbourhood of the old city.',
    mosques: [
      { name: 'Shahi Eidgah Mosque', area: 'Eidgah', built: '1735', icon: '🕌' },
      { name: 'Shah Rukn-e-Alam Shrine', area: 'Qilla Kohna', built: '1320s', icon: '⭐' },
      { name: 'Bahauddin Zakariya Shrine', area: 'Qilla Kohna', built: '13th Century', icon: '⭐' },
      { name: 'Sawi Masjid', area: 'Kotla Tolay Khan', built: 'Historic', icon: '🕌' },
    ],
    statsLead:
      "Multan District's population is 5,362,305 in the 2023 Census. The city's mosques and shrines accommodate the five daily prayers, with the largest congregations at Friday prayers in the old city.",
    stats: [
      { value: '5,362,305', label: 'Population (Census 2023)', icon: '🏙️' },
      { value: '3,720 km²', label: 'District area', icon: '🗺️' },
    ],
  },
  peshawar: {
    intro:
      "Peshawar's landmark mosque is the Mahabat Khan Mosque in the old city, built in the 1630s under the Mughal governor Mahabat Khan — its white marble facade and twin minarets rise over the bazaars around Chowk Yadgar — alongside the Sunehri Masjid in Saddar and neighbourhood mosques across the city.",
    mosques: [
      { name: 'Mahabat Khan Mosque', area: 'Old City · Chowk Yadgar', built: '1630s', icon: '🕌' },
      { name: 'Sunehri Masjid', area: 'Saddar', built: '1892', icon: '🕌' },
      { name: 'Qasim Ali Khan Mosque', area: 'Qissa Khwani', built: '1847', icon: '🕌' },
    ],
    statsLead:
      "Peshawar District's population is 4,758,762 in the 2023 Census. The city's mosques accommodate the five daily prayers, with the largest congregations at Friday prayers in the old city.",
    stats: [
      { value: '4,758,762', label: 'Population (Census 2023)', icon: '🏙️' },
      { value: '1,518 km²', label: 'District area', icon: '🗺️' },
    ],
  },
};

export function getCityMosqueFacts(citySlug: string): CityMosqueFacts | null {
  return FACTS[citySlug] ?? null;
}
