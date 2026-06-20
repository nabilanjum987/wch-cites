/**
 * SEO paragraph generators — WorldCityHub Horoscope Sign Page (/horoscope/[sign])
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 5 sections × ~180 words × 2 = 1,800+ words per sign page.
 * Each of the 12 sign pages gets genuinely unique copy using name/dates/element/ruling planet.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

const ELEMENT_TRAITS: Record<string, string> = {
  fire: 'passionate, energetic, and bold, often acting on instinct and leading with confidence',
  earth: 'grounded, practical, and reliable, valuing stability and tangible results',
  air: 'intellectual, communicative, and sociable, drawn to ideas and connection',
  water: 'intuitive, emotional, and deeply empathetic, navigating life through feeling',
};

// ─── 1. SIGN OVERVIEW (SignDetailPage) ──────────────────────────────────────

export function generateSignOverviewParagraph(name: string, dates: string, element: string, rulingPlanet: string): string {
  const { month, year } = now();
  const traits = ELEMENT_TRAITS[element] || 'distinctive and complex';
  return `${name}, spanning ${dates} on the zodiac calendar, is ruled by ${rulingPlanet} and belongs to the ${element} element — a grouping traditionally associated with being ${traits}. This combination of ruling planet and elemental nature forms the foundation of ${name}'s traditional personality archetype within Western astrology, shaping everything from communication style to how the sign approaches relationships and challenges. Through ${month} ${year}, the detailed reading above translates these traditional associations into today's specific astrological outlook for anyone born under ${name}.`;
}

export function generateSignOverviewAfter(name: string, element: string): string {
  const { month, year } = now();
  return `${name}'s placement among the ${element} signs connects it most closely with the other two signs sharing that same element, a grouping astrologers traditionally consider to share underlying compatibility and similar core motivations despite their individual differences. The daily reading above is generated fresh based on current planetary positions relative to ${name}'s traditional ruling influences, meaning it reflects this specific moment in ${month} ${year} rather than a generic, unchanging description. For a fuller view beyond ${name}'s sun sign alone, the birth chart calculator further down this page offers considerably more individualized detail.`;
}

// ─── 2. MOON CALENDAR (sign-specific framing) ───────────────────────────────

export function generateMoonParagraph(name: string): string {
  const { month, year } = now();
  return `The moon calendar above tracks lunar phases relevant to ${name}'s astrological reading, since the moon's position relative to your sun sign is traditionally considered to influence emotional rhythm and timing for important decisions throughout ${month} ${year}. For ${name} specifically, certain lunar phases are traditionally considered more favourable than others depending on the moon's relationship to ${name}'s ruling planet and elemental nature. This forward-looking calendar extends beyond today's single reading into the coming days and weeks.`;
}

export function generateMoonAfter(name: string): string {
  const { month, year } = now();
  return `Many ${name} practitioners of astrology find it useful to track lunar phases specifically alongside their sun sign reading, since the moon's monthly cycle interacts with sun sign traits in ways that shift the overall astrological picture day by day. Full and new moons carry particular significance for ${name} in traditional astrological practice, often associated with heightened energy for either release or new beginnings depending on the specific lunar relationship to ${name}'s chart. Through ${month} ${year}, this calendar remains grounded in genuine astronomical lunar calculation.`;
}

// ─── 3. COMPATIBILITY FINDER (sign-specific framing) ────────────────────────

export function generateCompatibilityParagraph(name: string, element: string): string {
  const { month, year } = now();
  return `The compatibility finder above lets you explore how ${name} pairs with any other zodiac sign, drawing on traditional astrological theory around elemental harmony, ruling planet relationships, and established sign-pair dynamics built up over centuries of astrological practice. As a ${element} sign, ${name} traditionally shares natural affinity with the other ${element} signs, while relationships with signs from other elements carry their own distinct dynamics worth exploring individually. Through ${month} ${year}, this tool generates compatibility insight on demand for ${name} paired with any sign you select.`;
}

export function generateCompatibilityAfter(name: string): string {
  const { month, year } = now();
  return `Compatibility readings for ${name} above are offered as a lighthearted lens for thinking through relationship dynamics rather than a definitive predictor of relationship success, since real compatibility depends on far more than sun sign alone. ${name}'s compatibility profile considers not just elemental harmony but ${name}'s specific traditional traits and how they traditionally interact with each other sign's own established characteristics. Through ${month} ${year}, exploring different pairings here offers genuine astrological context for anyone curious about ${name}'s relationship dynamics specifically.`;
}

// ─── 4. BIRTH CHART CALCULATOR (sign-specific framing) ──────────────────────

export function generateBirthChartParagraph(name: string): string {
  const { month, year } = now();
  return `While this page focuses on ${name} as a sun sign, the birth chart calculator above reveals considerably more — your moon sign, rising sign, and full planetary placements at your exact birth moment, building a complete astrological profile that goes well beyond sun sign alone. Many practitioners consider ${name} as sun sign to represent only one layer of a fuller picture, with moon sign often shaping emotional nature and rising sign shaping outward presentation in ways that can meaningfully complement or contrast with core ${name} traits. Through ${month} ${year}, this calculator generates your full chart on demand.`;
}

export function generateBirthChartAfter(name: string): string {
  const { month, year } = now();
  return `If your moon sign or rising sign differs from ${name}, your full astrological profile likely reflects a blend of traits rather than ${name}'s characteristics alone — a nuance traditional astrology has always recognised even while popular culture often simplifies down to sun sign. This calculator requires a precise birth time for full accuracy, since rising sign in particular shifts roughly every two hours throughout the day. Through ${month} ${year}, generating your full chart offers a considerably richer companion to the ${name}-specific reading found elsewhere on this page.`;
}

// ─── 5. NUMEROLOGY (sign-specific framing) ──────────────────────────────────

export function generateNumerologyParagraph(name: string): string {
  const { month, year } = now();
  return `Numerology above offers a complementary lens to ${name}'s astrological profile, exploring the symbolic significance of numbers derived from your birth date or name rather than celestial positions, within a divinatory tradition with its own centuries-long history distinct from astrology. Some practitioners enjoy combining numerology insight with their ${name} sun sign reading, treating the two systems as complementary rather than competing frameworks for self-reflection. Through ${month} ${year}, this calculator generates your personal numerology figures on demand based on the details you provide.`;
}

export function generateNumerologyAfter(name: string): string {
  const { month, year } = now();
  return `Numerology's life path and destiny numbers offer a different kind of insight than ${name}'s zodiac traits — calculated from numbers rather than celestial timing — giving some practitioners a fuller, layered sense of personal pattern when combined with the astrological reading found elsewhere on this page. As with the rest of this page, numerology is offered for entertainment and personal reflection rather than as scientifically validated insight. Through ${month} ${year}, revisiting this calculator periodically offers a fresh angle alongside ${name}'s ongoing daily astrological reading.`;
}
