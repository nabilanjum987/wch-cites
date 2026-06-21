/**
 * SEO paragraph generators — WorldCityHub Heritage Products Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 6 sections × ~180 words × 2 = 2,100+ words per product page.
 * Each product gets genuinely unique copy using name/city/country.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

// ─── 1. THE STORY ────────────────────────────────────────────────────────────

export function generateStoryParagraph(name: string, city: string): string {
  return `${name}'s history above traces the craft's origins and evolution in ${city}, the kind of background that turns a product from a simple purchase into something with genuine cultural weight and context. Understanding where ${name} comes from and how the craft developed over generations adds meaning to anything made using this tradition, whether you're buying a piece, researching the craft, or simply curious about ${city}'s heritage industries.`;
}

export function generateStoryAfter(name: string, city: string): string {
  return `This story behind ${name} connects directly to the production process covered in the next section, since understanding the craft's history makes the specific techniques and materials used today considerably more meaningful. ${name} remains one of ${city}'s most recognisable heritage products precisely because this history has been preserved and passed down rather than lost to modernisation, a continuity worth appreciating in an era when many traditional crafts struggle to survive.`;
}

// ─── 2. HOW IT IS MADE ───────────────────────────────────────────────────────

export function generateMakingParagraph(name: string): string {
  return `The production process above breaks down exactly how ${name} is traditionally made, from raw materials through each step of skilled craftsmanship to the finished product. This level of process detail matters for anyone wanting to genuinely understand what they're purchasing — the materials, the skill required, and the time investment that goes into producing authentic ${name} rather than a mass-manufactured imitation.`;
}

export function generateMakingAfter(name: string): string {
  return `Each step in producing ${name} typically requires specific skills passed down through apprenticeship or family tradition rather than something easily learned from a manual, which is part of what gives genuinely handmade ${name} its value over factory alternatives. Watching the linked video process is one of the most direct ways to appreciate the skill involved, often revealing details about craftsmanship that a written description alone can't fully convey. This production knowledge directly informs the authenticity section further down this page, where genuine ${name} can be distinguished from imitations.`;
}

// ─── 3. PRODUCT TYPES & PRICES ───────────────────────────────────────────────

export function generateTypesParagraph(name: string): string {
  return `${name} comes in several distinct categories above, each with its own size, characteristics, and price range reflecting differences in materials, craftsmanship time, and intended use. Understanding these variations matters before purchasing, since the right choice depends heavily on what you're actually looking for — a smaller decorative piece versus a larger, more substantial item carries very different price expectations and practical considerations.`;
}

export function generateTypesAfter(name: string): string {
  return `Price ranges shown above for ${name} reflect genuine market rates rather than inflated tourist pricing, though prices for any handmade traditional product can vary based on the specific maker, exact materials, and level of detail in the individual piece. Comparing these categories against the authenticity guidance further down this page helps ensure that whichever type of ${name} you choose, you're getting genuine value for the price paid.`;
}

// ─── 4. BUY AUTHENTIC ────────────────────────────────────────────────────────

export function generateAuthenticParagraph(name: string): string {
  return `Distinguishing authentic ${name} from imitations above matters considerably given how popular heritage products often attract mass-produced copies that look similar at a glance but lack the genuine materials, technique, and durability of the real craft. The checklist above translates expert knowledge into practical, checkable details anyone can use, even without specialist background in evaluating ${name} specifically.`;
}

export function generateAuthenticAfter(name: string): string {
  return `These authenticity markers for ${name} come from genuine expert and artisan knowledge rather than generic advice, reflecting the specific ways imitations typically fall short of the real craft. Taking the time to verify these details before purchasing protects both your investment and the livelihoods of the genuine artisans whose skilled work keeps the tradition of ${name} alive. Combined with purchasing from the reputable sources covered in the next section, this checklist gives genuine confidence in what you're buying.`;
}

// ─── 5. WHERE TO BUY ──────────────────────────────────────────────────────────

export function generateBuyParagraph(name: string, city: string): string {
  return `The purchasing options above cover both in-person sources in ${city} and reliable online options for buying authentic ${name} from wherever you happen to be. Buying directly from established sources, whether physical shops in ${city} or vetted online sellers, significantly reduces the risk of ending up with an imitation rather than the genuine craft covered earlier on this page.`;
}

export function generateBuyAfter(name: string, city: string): string {
  return `Purchasing ${name} directly from ${city}, where the craft tradition actually originates, often offers both better authenticity assurance and more competitive pricing than buying through intermediary retailers elsewhere. For visitors to ${city}, seeking out these sources in person adds the additional value of seeing the craft and its makers directly, connecting the purchase to the fuller story covered throughout this page rather than treating it as a disconnected transaction.`;
}

// ─── 6. SIMILAR PRODUCTS WORLDWIDE ───────────────────────────────────────────

export function generateSimilarParagraph(name: string): string {
  return `The similar products above represent comparable craft traditions from other parts of the world, each with its own distinct character but sharing some conceptual or technical kinship with ${name}. Exploring these parallels offers useful context for understanding ${name} within a broader global tradition of similar craftsmanship, revealing both what makes ${name} distinctive and what connects it to comparable traditions elsewhere.`;
}

export function generateSimilarAfter(name: string): string {
  return `Comparing ${name} against these similar global products often highlights what's genuinely unique about the specific local techniques, materials, or designs that distinguish it from superficially similar crafts elsewhere. For collectors or enthusiasts interested in traditional craftsmanship more broadly, this comparative view offers a natural next step beyond ${name} alone, connecting to other dedicated product pages covering each tradition in similar depth.`;
}
