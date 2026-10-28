// ─────────────────────────────────────────────────────────────────────────────
// A11 — Lahore minority-faith keyword sections (final30).
//
// ONE PAGE, THREE KEYWORDS: the Lahore prayer-times page is the single
// target page for 'churches in lahore' (880, Low), 'gurdwara in lahore'
// (1K, Low) and 'hindu temple in lahore' (480, Low). Each keyword gets
// exactly one H2 section on that page — no separate pages are created,
// and no other city's page is touched (the renderer gates on
// city_slug === 'lahore').
//
// POPULATION ORDER: sections follow the 2023 Census figures already
// carried by lib/data/faith-profiles.ts (PR #100): Christianity first
// (602,431 in Lahore District, the largest Christian count of any Punjab
// district), then Hinduism (2,487 in the city table), then Sikhism (715).
// The majority faith (Islam) is NOT repeated here — it is covered in
// full across the page already, per the PR #100 population rule; these
// three sections are the lighter minority-faith coverage (places,
// timings, major festivals).
//
// NO INVENTED FACTS: every place, time and figure below is copied from
// faith-profiles.ts (PR #100, with its sources) or from the repo's own
// festival lists (lib/apis/faiths.ts: getChurchCalendar seasons,
// GURPURABS names, HINDU_FESTIVALS names). Festival DATES are
// deliberately NOT carried over: the repo's GURPURABS / HINDU_FESTIVALS
// dates are from 2025 and are stale, and no Lahore-specific festival
// dates appear in the sourced data — so festivals are named only, with
// no dates. Likewise, no service times are given for the gurdwara or the
// temples, because none appear in the sourced data; the sections say so
// instead of inventing times. The generic DENOMINATIONS mass times in
// faiths.ts are NOT Lahore-specific and are never used here.
//
// AEO: each section carries H3 questions with a direct answer of 50–70
// words right underneath (word counts verified from this file at build
// time, same pattern as the PR #117 prayer AEO card).
// ─────────────────────────────────────────────────────────────────────────────

export interface LahoreFaithPlace {
  name: string;
  detail: string;
}

export interface LahoreFaithQuestion {
  /** H3 text. */
  question: string;
  /** Direct answer — always 50–70 words. */
  answer: string;
}

export interface LahoreFaithSection {
  /** H2 text — exactly the target keyword. */
  h2: string;
  intro: string;
  places: LahoreFaithPlace[];
  /** Timings line: sourced times where they exist, an explicit gap note otherwise. */
  timings: string;
  /** Major festivals, named only — never dated (see header note). */
  festivals: string;
  questions: LahoreFaithQuestion[];
  source: string;
}

export const LAHORE_FAITH_SECTIONS: LahoreFaithSection[] = [
  {
    h2: 'churches in lahore',
    intro:
      'Lahore District is home to 602,431 Christians (2023 Census) — the largest Christian community of any district in Punjab — so churches in Lahore are covered here in medium depth, after the majority faith. The two cathedrals below are the city’s principal churches.',
    places: [
      {
        name: 'Sacred Heart Cathedral, Lawrence Road',
        detail:
          'Seat of the Roman Catholic Archdiocese of Lahore, consecrated 19 November 1907. Sunday Masses listed at 9:30 AM and 11:30 AM.',
      },
      {
        name: 'Cathedral Church of the Resurrection, Mall Road',
        detail:
          'Anglican cathedral, seat of the Diocese of Lahore (Church of Pakistan), opened 1887. Sunday English Communion services listed at 8:00 AM and 5:00 PM.',
      },
      {
        name: 'St. Andrew’s Church, Nabha Road; St. Anthony’s Church; St. Joseph’s Church',
        detail:
          'Historic Lahore churches named alongside the two cathedrals in the city’s Easter coverage and church surveys.',
      },
    ],
    timings:
      'Sunday service times are published schedules, not guarantees; times vary on feast days, so check ahead before travelling. Sacred Heart Cathedral lists Sunday Masses at 9:30 AM and 11:30 AM; the Cathedral Church of the Resurrection lists Sunday English Communion at 8:00 AM and 5:00 PM.',
    festivals:
      'The Christian calendar’s major festivals are Christmas and Easter. No dates are given here, because no Lahore-specific festival dates appear in this page’s sourced data.',
    questions: [
      {
        question: 'Where are the main churches in Lahore?',
        answer:
          'The main churches in Lahore are Sacred Heart Cathedral on Lawrence Road and the Cathedral Church of the Resurrection on Mall Road. Sacred Heart Cathedral is the seat of the Roman Catholic Archdiocese of Lahore, while the Resurrection Cathedral is the Anglican cathedral and seat of the Diocese of Lahore. Other historic churches include St. Andrew’s Church on Nabha Road, St. Anthony’s Church and St. Joseph’s Church.',
      },
      {
        question: 'What time is Sunday Mass in Lahore?',
        answer:
          'Sunday Mass times in Lahore depend on the church. Sacred Heart Cathedral lists Sunday Masses at 9:30 AM and 11:30 AM, while the Cathedral Church of the Resurrection lists Sunday English Communion services at 8:00 AM and 5:00 PM. These are published schedules, not guarantees, and times can vary on feast days, so check ahead before travelling to a service.',
      },
    ],
    source:
      '2023 Census of Pakistan; Wikipedia (Sacred Heart Cathedral, Lahore); audiala.com Lahore cathedral listing; wanderlog / apnaorg Lahore church survey.',
  },
  {
    h2: 'hindu temple in lahore',
    intro:
      'A small community in Lahore today (2,487 Hindus in the 2023 city table) with two functional temples, covered here in light depth.',
    places: [
      {
        name: 'Krishna Mandir, Ravi Road',
        detail:
          'Hindu temple dedicated to Krishna, opposite Timber Market; one of only two functional Hindu temples in Lahore, governed by the Pakistan Hindu Council.',
      },
      {
        name: 'Valmiki Mandir (Neela Gumbad Mandir)',
        detail: 'The other functional Hindu temple in Lahore.',
      },
    ],
    timings:
      'No published service times for Lahore’s temples appear in this page’s sourced data, so none are listed here; visitors should check ahead before travelling.',
    festivals:
      'Major Hindu festivals include Diwali, Holi and Navaratri. No dates are given here, because no Lahore-specific festival dates appear in this page’s sourced data.',
    questions: [
      {
        question: 'How many Hindu temples are in Lahore?',
        answer:
          'Lahore has two functional Hindu temples, according to the sourced profile on this page. They are Krishna Mandir on Ravi Road and Valmiki Mandir, also known as Neela Gumbad Mandir. Krishna Mandir is dedicated to Krishna and is governed by the Pakistan Hindu Council. Lahore’s Hindu community is small, with 2,487 Hindus recorded in the 2023 city census table.',
      },
      {
        question: 'Where is Krishna Mandir in Lahore?',
        answer:
          'Krishna Mandir is on Ravi Road in Lahore, opposite Timber Market. It is a Hindu temple dedicated to Krishna and one of only two functional Hindu temples in the city, the other being Valmiki Mandir. The temple is governed by the Pakistan Hindu Council. No published service times for Krishna Mandir appear in this page’s sourced data, so visitors should check ahead before travelling.',
      },
    ],
    source: 'Wikipedia (Krishna Mandir, Lahore; List of temples in Lahore); 2023 Census city table.',
  },
  {
    h2: 'gurdwara in lahore',
    intro:
      'A small community in Lahore today (715 Sikhs in the 2023 city table) with one of Sikhism’s most significant shrines in the city, covered here in light depth.',
    places: [
      {
        name: 'Gurdwara Dera Sahib',
        detail:
          'Beside Badshahi Mosque and Lahore Fort. Commemorates the spot where Guru Arjan Dev, the 5th Sikh Guru, was martyred in 1606.',
      },
    ],
    timings:
      'No published service times for Gurdwara Dera Sahib appear in this page’s sourced data, so none are listed here; visitors should check ahead before travelling.',
    festivals:
      'Major Sikh festivals include Baisakhi, Guru Nanak Dev Ji’s Birthday and Guru Gobind Singh Ji’s Birthday. No dates are given here, because no Lahore-specific festival dates appear in this page’s sourced data.',
    questions: [
      {
        question: 'Which gurdwara is in Lahore?',
        answer:
          'The main gurdwara in Lahore is Gurdwara Dera Sahib, beside Badshahi Mosque and Lahore Fort in the Walled City area. It commemorates the spot where Guru Arjan Dev, the fifth Sikh Guru, was martyred in 1606, making it one of Sikhism’s most significant shrines. Lahore’s Sikh community is small today, with 715 Sikhs recorded in the 2023 city census table.',
      },
      {
        question: 'Why is Gurdwara Dera Sahib important?',
        answer:
          'Gurdwara Dera Sahib is important because it marks the spot where Guru Arjan Dev, the fifth Sikh Guru, was martyred in 1606. That martyrdom is a defining event in Sikh history, and the shrine beside Badshahi Mosque and Lahore Fort is counted among Sikhism’s most significant shrines. It is Lahore’s principal Sikh shrine, even though the city’s Sikh community today numbers only 715 people.',
      },
    ],
    source: 'Wikipedia (Gurdwara Dera Sahib); 2023 Census city table.',
  },
];
