/**
 * SEO paragraph generators — WorldCityHub Horoscope Index Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 10 sections × ~180 words × 2 = 3,000+ words on this page.
 * This page is global/non-localized, so paragraphs reference the date rather than a city.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── 1. SKY RIGHT NOW ────────────────────────────────────────────────────────

export function generateSkyParagraph(): string {
  const { month, year } = now();
  return `The sky panel above tracks what's actually visible overhead right now — moon phase, visible planets, and any notable celestial events worth stepping outside for — calculated for this exact moment rather than a generic seasonal description. This kind of real-time astronomical snapshot connects directly to the astrology readings further down this page, since traditional horoscope practice has always drawn on the genuine positions of celestial bodies rather than abstract symbolism alone. Through ${month} ${year}, this panel updates continuously, so the sky described here is always current rather than a static seasonal approximation.`;
}

export function generateSkyAfter(): string {
  const { month, year } = now();
  return `Moon phase in particular carries significance well beyond astrology — it's referenced throughout the religious and cultural calendars covered elsewhere on this site, from Islamic lunar months to Hindu festival timing, making this panel a genuinely useful astronomical reference regardless of one's interest in horoscopes specifically. Visible planets and notable events shown above are calculated using standard astronomical formulas, the same underlying science used for the Sun & Moon data found on this site's city weather pages. Through ${month} ${year}, checking this panel before stepping outside on a clear night adds context to whatever you happen to see in the sky.`;
}

// ─── 2. ZODIAC SIGNS GRID ────────────────────────────────────────────────────

export function generateZodiacGridParagraph(): string {
  const { month, year } = now();
  return `The twelve zodiac signs above each carry their own distinct personality archetype, ruling planet, and elemental association within Western astrology, a system with roots stretching back over two millennia to ancient Babylonian and Greek astronomy. Tapping any sign above leads through to a fuller daily reading for that sign specifically, covering today's outlook in more depth than this grid view allows. Through ${month} ${year}, each sign's reading updates daily, reflecting the current positions of the sun, moon, and planets relative to that sign's traditional ruling influences.`;
}

export function generateZodiacGridAfter(): string {
  const { month, year } = now();
  return `Sun sign — determined simply by birth date — is the most commonly known entry point into astrology, though many practitioners consider a full birth chart, covered in the calculator further down this page, to offer considerably more nuanced insight than sun sign alone. The grid above groups all twelve signs together specifically so visitors can compare readings across multiple signs at once, useful for understanding how today's astrological climate is being interpreted differently across the zodiac. Through ${month} ${year}, this grid remains the fastest entry point into the more detailed astrology content found throughout the rest of this page.`;
}

// ─── 3. NUMEROLOGY ───────────────────────────────────────────────────────────

export function generateNumerologyParagraph(): string {
  const { month, year } = now();
  return `Numerology above explores the symbolic significance attributed to numbers — derived from a birth date or name — within a divinatory tradition that, like astrology, has been practiced across many cultures for centuries in various forms. This section offers a different lens than the zodiac signs above, focused on numerical patterns rather than celestial positions, appealing to those drawn to the structured, calculable nature of number-based readings. Through ${month} ${year}, this tool calculates your personal numerology figures on demand based on whatever details you provide.`;
}

export function generateNumerologyAfter(): string {
  const { month, year } = now();
  return `Numerology's core numbers — life path, destiny, and personal year, among others depending on the specific tradition — each carry their own interpretive meaning, offering a framework some find genuinely insightful for self-reflection regardless of one's broader views on divinatory practices. This section, like the rest of the page, is offered for entertainment and personal exploration rather than as a scientifically validated practice. Through ${month} ${year}, revisiting this calculator periodically — particularly around a birthday, when personal year numbers shift — offers a fresh angle on the same underlying birth data.`;
}

// ─── 4. TAROT CARD OF THE DAY ────────────────────────────────────────────────

export function generateTarotParagraph(): string {
  const { month, year } = now();
  return `Today's featured tarot card above draws from the traditional 78-card tarot deck, each card carrying its own established symbolism and interpretive meaning within a divinatory practice with roots in 15th-century playing cards later adapted for esoteric and fortune-telling purposes. A single daily card, refreshed each day through ${month} ${year}, offers a focused point of reflection rather than the more involved multi-card spreads used in fuller tarot readings. This kind of daily ritual draw is one of the more accessible ways people engage with tarot without needing deep familiarity with the entire deck.`;
}

export function generateTarotAfter(): string {
  const { month, year } = now();
  return `The card shown above includes its traditional meaning and symbolism, giving context for newcomers unfamiliar with tarot's established card-by-card interpretive system built up over centuries of practice. Many who draw a daily card use it as a loose prompt for reflection on the day ahead rather than a literal prediction, treating the practice more as a mindfulness exercise than fortune-telling in the strict sense. Through ${month} ${year}, this card refreshes daily, offering a new symbolic touchpoint each time you return to this page.`;
}

// ─── 5. CHINESE ZODIAC ───────────────────────────────────────────────────────

export function generateChineseZodiacParagraph(): string {
  const { month, year } = now();
  return `The Chinese zodiac above operates on an entirely different system than the Western zodiac covered earlier on this page — a twelve-year cycle of animal signs rather than a twelve-month cycle of star signs, rooted in Chinese astrology and the lunar calendar rather than Western astronomical tradition. Each animal sign carries its own personality archetype and is paired with one of five elements across a sixty-year combined cycle, adding further nuance beyond the animal alone. Through ${month} ${year}, this section offers a genuinely distinct astrological tradition for those interested in comparing different cultural approaches to character and fortune.`;
}

export function generateChineseZodiacAfter(): string {
  const { month, year } = now();
  return `Unlike the Western zodiac determined by birth month, Chinese zodiac sign is determined by birth year, following the lunar calendar's own yearly transitions rather than the fixed Gregorian calendar dates used for Western sun signs. This system remains deeply embedded in cultural practice across East Asia and its diaspora communities, particularly around Lunar New Year celebrations each year. Through ${month} ${year}, exploring this alongside the Western zodiac grid earlier on this page offers two genuinely different astrological lenses on personality and fortune.`;
}

// ─── 6. VEDIC PANCHANG ───────────────────────────────────────────────────────

export function generatePanchangParagraph(): string {
  const { month, year } = now();
  return `The Vedic Panchang above provides the traditional Hindu astrological calendar reading for today, combining five key elements — lunar day, weekday, lunar mansion, yoga, and karana — that together determine auspicious and inauspicious timings within Vedic astrological tradition. This system, rooted in ancient Indian astronomy and astrology, remains widely consulted across South Asia for timing significant life events, from weddings to business launches to religious observances. Through ${month} ${year}, this reading updates daily to reflect the current lunar and planetary positions relevant to Vedic calculation.`;
}

export function generatePanchangAfter(): string {
  const { month, year } = now();
  return `Each Panchang element above carries its own traditional significance — certain combinations are considered favourable for new beginnings, while others call for caution or patience according to Vedic astrological principles passed down through generations. This section connects to the broader Hindu festival and religious calendar found elsewhere on this site, since many observance dates are themselves determined using Panchang-based lunar calculations. Through ${month} ${year}, this daily reading offers a genuine window into a centuries-old astrological tradition still actively consulted today.`;
}

// ─── 7. MOON CALENDAR ────────────────────────────────────────────────────────

export function generateMoonCalendarParagraph(): string {
  const { month, year } = now();
  return `The moon calendar above maps out lunar phases across the coming days and weeks, extending the single-moment snapshot from the Sky Right Now section at the top of this page into a fuller forward-looking view. Tracking the moon's cycle from new to full and back again has practical applications well beyond astrology — agricultural timing, tidal prediction, and religious calendar calculation across multiple traditions all draw on the same underlying lunar cycle shown here. Through ${month} ${year}, this calendar updates to reflect the current and upcoming lunar phases with astronomical accuracy.`;
}

export function generateMoonCalendarAfter(): string {
  const { month, year } = now();
  return `Full moons and new moons in particular carry specific significance across many astrological and spiritual traditions, often associated with heightened energy for release, reflection, or new intentions depending on the specific practice. This calendar's forward-looking view makes it useful for planning around a specific desired phase — some practitioners prefer to time certain rituals or decisions around particular lunar moments. Through ${month} ${year}, this calendar remains grounded in genuine astronomical calculation regardless of the symbolic meaning individual visitors choose to draw from it.`;
}

// ─── 8. BIRTH CHART CALCULATOR ──────────────────────────────────────────────

export function generateBirthChartParagraph(): string {
  const { month, year } = now();
  return `The birth chart calculator above goes considerably deeper than sun sign alone, mapping the position of the sun, moon, and planets at your exact birth date, time, and location to generate a fuller astrological profile than the simplified Western zodiac grid covered earlier on this page. This is the tool serious astrology practitioners consider the genuine foundation of personalized astrological reading, since sun sign alone captures only one of many placements that together form a complete birth chart. Through ${month} ${year}, this calculator generates your chart on demand using the birth details you provide.`;
}

export function generateBirthChartAfter(): string {
  const { month, year } = now();
  return `A full birth chart includes placements like moon sign, rising sign, and the position of each visible planet at the moment of birth, each carrying its own traditional interpretive significance within astrological practice that goes well beyond the simplified daily horoscope format. Accuracy depends heavily on having a precise birth time, since the rising sign in particular shifts roughly every two hours throughout the day. Through ${month} ${year}, this tool offers a genuinely more detailed entry point into personal astrology than the daily sun-sign readings found elsewhere on this page.`;
}

// ─── 9. COMPATIBILITY FINDER ─────────────────────────────────────────────────

export function generateCompatibilityParagraph(): string {
  const { month, year } = now();
  return `The compatibility finder above explores astrological compatibility between two zodiac signs, drawing on traditional associations between elements, ruling planets, and sign qualities to generate insight into relationship dynamics from an astrological perspective. This kind of comparison has remained one of the most enduringly popular applications of astrology, appealing to anyone curious how their own sign interacts with a partner's, friend's, or family member's according to traditional astrological theory. Through ${month} ${year}, this tool generates compatibility insight on demand for any pair of signs you select.`;
}

export function generateCompatibilityAfter(): string {
  const { month, year } = now();
  return `Compatibility readings above draw on traditional elemental theory — fire, earth, air, and water signs each interacting with the others in established patterns — alongside specific sign-pair dynamics built up over centuries of astrological tradition. As with the rest of this page, this tool is offered for entertainment and reflection rather than as a scientifically validated predictor of relationship success. Through ${month} ${year}, exploring different sign combinations here offers a lighthearted way to think through relationship dynamics from an astrological lens.`;
}

// ─── 10. SHOP & EXPLORE (AFFILIATES) ────────────────────────────────────────

export function generateAffiliatesParagraph(): string {
  const { month, year } = now();
  return `For anyone wanting to go deeper into astrology, tarot, or related practices beyond what's covered on this page, the options above connect to relevant books, tools, and resources for further exploration. Whether picking up a tarot deck to practice readings yourself, finding a deeper astrology reference book, or exploring related apps and tools, these curated options save the time of searching independently. Through ${month} ${year}, this section rounds out the page with practical next steps for visitors wanting to engage more deeply with the practices covered above.`;
}

export function generateAffiliatesAfter(): string {
  const { month, year } = now();
  return `These options connect to established resources and platforms rather than obscure or unverified sources, prioritising quality and reliability for anyone genuinely interested in deepening their engagement with astrology and related practices. As with everything on this page, these tools are offered in the spirit of entertainment, reflection, and personal exploration rather than as scientifically validated instruments. Through ${month} ${year}, whichever resource appeals, each is intended as a genuine next step for visitors already engaged with the content above.`;
}
