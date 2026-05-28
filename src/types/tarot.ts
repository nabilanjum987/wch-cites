export type TarotArcana = 'major' | 'minor';

export type TarotSuit = 'wands' | 'cups' | 'swords' | 'pentacles';

export interface TarotCard {
  id: number;
  name: string;
  arcana: TarotArcana;
  suit?: TarotSuit;
  number?: number;
  keywords: string[];
  upright: string;
  reversed: string;
  description: string;
  svgSymbol: string;
}

export const MAJOR_ARCANA: TarotCard[] = [
  { id: 0,  name: 'The Fool',      arcana: 'major', keywords: ['Beginnings', 'Innocence', 'Spontaneity'], upright: 'New beginnings, innocence, spontaneity, a free spirit', reversed: 'Recklessness, risk-taking, foolishness', description: 'A figure stands at the edge of a cliff, ready to step into the unknown with a small white dog as companion.', svgSymbol: 'fool' },
  { id: 1,  name: 'The Magician',  arcana: 'major', keywords: ['Manifestation', 'Willpower', 'Creation'], upright: 'Manifestation, resourcefulness, power, inspired action', reversed: 'Manipulation, poor planning, latent talents', description: 'A magician stands before a table with elemental tools, one hand reaching to the sky.', svgSymbol: 'magician' },
  { id: 2,  name: 'The High Priestess', arcana: 'major', keywords: ['Intuition', 'Mystery', 'Subconscious'], upright: 'Intuition, sacred knowledge, divine feminine, the subconscious mind', reversed: 'Secrets, disconnection from intuition', description: 'A robed woman sits between two pillars, a scroll partially hidden beneath her veil.', svgSymbol: 'priestess' },
  { id: 3,  name: 'The Empress',   arcana: 'major', keywords: ['Fertility', 'Nature', 'Abundance'], upright: 'Femininity, beauty, nature, nurturing, abundance', reversed: 'Dependence, smothering, emptiness', description: 'A fertile woman sits on a throne in a field of wheat, wearing a crown of stars.', svgSymbol: 'empress' },
  { id: 4,  name: 'The Emperor',  arcana: 'major', keywords: ['Authority', 'Structure', 'Control'], upright: 'Authority, establishment, structure, a father figure', reversed: 'Tyranny, rigidity, coldness', description: 'A bearded ruler sits on a stone throne decorated with rams\' heads.', svgSymbol: 'emperor' },
  { id: 5,  name: 'The Hierophant', arcana: 'major', keywords: ['Tradition', 'Conformity', 'Morality'], upright: 'Spiritual wisdom, religious knowledge, conformity, tradition', reversed: 'New approaches, nonconformity, scandal', description: 'A religious figure in ornate robes sits between two pillars, giving a blessing.', svgSymbol: 'hierophant' },
  { id: 6,  name: 'The Lovers',   arcana: 'major', keywords: ['Love', 'Harmony', 'Relationships'], upright: 'Love, harmony, relationships, values alignment, choices', reversed: 'Self-discrepancy, disharmony, imbalance', description: 'A man and woman stand beneath an angel, fruits and a snake in the garden.', svgSymbol: 'lovers' },
  { id: 7,  name: 'The Chariot',  arcana: 'major', keywords: ['Determination', 'Willpower', 'Success'], upright: 'Control, willpower, success, action, determination', reversed: 'Self-discipline, opposition, lack of control', description: 'A warrior rides a chariot pulled by two sphinxes, one black, one white.', svgSymbol: 'chariot' },
  { id: 8,  name: 'Strength',    arcana: 'major', keywords: ['Strength', 'Courage', 'Patience'], upright: 'Strength, courage, persuasion, influence, compassion', reversed: 'Self-doubt, weakness, insecurity', description: 'A woman gently opens a lion\'s jaws, a wreath of flowers around them both.', svgSymbol: 'strength' },
  { id: 9,  name: 'The Hermit',  arcana: 'major', keywords: ['Soul-searching', 'Introspection', 'Contemplation'], upright: 'Soul-searching, introspection, being alone, inner guidance', reversed: 'Isolation, loneliness, withdrawal', description: 'An old man with a lantern walks through snow, staff in hand.', svgSymbol: 'hermit' },
  { id: 10, name: 'Wheel of Fortune', arcana: 'major', keywords: ['Change', 'Cycles', 'Destiny'], upright: 'Good luck, karma, life cycles, destiny, a turning point', reversed: 'Bad luck, resistance to change, breaking cycles', description: 'A great wheel turns, with creatures rising and falling, a sphinx at top.', svgSymbol: 'wheel' },
  { id: 11, name: 'Justice',     arcana: 'major', keywords: ['Justice', 'Fairness', 'Truth'], upright: 'Justice, fairness, truth, cause and effect, law', reversed: 'Unfairness, lack of accountability, dishonesty', description: 'A woman sits on a throne holding scales and a sword, between pillars.', svgSymbol: 'justice' },
  { id: 12, name: 'The Hanged Man', arcana: 'major', keywords: ['Pause', 'Surrender', 'New Perspective'], upright: 'Pause, surrender, letting go, new perspectives', reversed: 'Stalling, resistance, indecision', description: 'A man hangs by one foot from a tree, his expression serene.', svgSymbol: 'hanged' },
  { id: 13, name: 'Death',       arcana: 'major', keywords: ['Endings', 'Change', 'Transformation'], upright: 'Endings, change, transformation, transition', reversed: 'Resistance to change, holding on, stagnation', description: 'A skeleton in armor rides a white horse, others bow before it.', svgSymbol: 'death' },
  { id: 14, name: 'Temperance',  arcana: 'major', keywords: ['Balance', 'Moderation', 'Patience'], upright: 'Balance, moderation, patience, purpose, meaning', reversed: 'Imbalance, excess, self-healing', description: 'An angel pours water between two cups, one foot on land, one in water.', svgSymbol: 'temperance' },
  { id: 15, name: 'The Devil',   arcana: 'major', keywords: ['Shadow Self', 'Attachment', 'Addiction'], upright: 'Shadow self, attachment, addiction, restriction', reversed: 'Releasing limiting beliefs, exploring dark thoughts', description: 'A horned devil stands over chained figures, who sit on a black pedestal.', svgSymbol: 'devil' },
  { id: 16, name: 'The Tower',  arcana: 'major', keywords: ['Sudden Change', 'Upheaval', 'Chaos'], upright: 'Sudden change, upheaval, chaos, revelation, awakening', reversed: 'Personal transformation, fear of change', description: 'A tower struck by lightning crumbles, figures falling from it.', svgSymbol: 'tower' },
  { id: 17, name: 'The Star',   arcana: 'major', keywords: ['Hope', 'Faith', 'Renewal'], upright: 'Hope, faith, purpose, renewal, spirituality', reversed: 'Lack of faith, despair, disconnection', description: 'A naked woman kneels by a pool, pouring water, stars shine above.', svgSymbol: 'star' },
  { id: 18, name: 'The Moon',  arcana: 'major', keywords: ['Illusion', 'Fear', 'Anxiety'], upright: 'Illusion, fear, anxiety, subconscious, intuition', reversed: 'Release of fear, repressed emotions', description: 'A moon hangs between two towers, a crayfish crawls from a pool, wolf and dog howl.', svgSymbol: 'moon' },
  { id: 19, name: 'The Sun',   arcana: 'major', keywords: ['Joy', 'Success', 'Celebration'], upright: 'Positivity, fun, warmth, success, vitality', reversed: 'Inner child, feeling down, overly optimistic', description: 'A bright sun shines on a child riding a horse, sunflowers behind walls.', svgSymbol: 'sun' },
  { id: 20, name: 'Judgement', arcana: 'major', keywords: ['Reckoning', 'Awakening', 'Absolution'], upright: 'Judgement, rebirth, inner calling, absolution', reversed: 'Self-doubt, refusal of self-examination', description: 'Trumpeting angels rise from clouds, the dead rise from coffins.', svgSymbol: 'judgement' },
  { id: 21, name: 'The World', arcana: 'major', keywords: ['Completion', 'Integration', 'Accomplishment'], upright: 'Completion, integration, accomplishment, travel', reversed: 'Seeking personal closure, short-cuts', description: 'A woman dances in a wreath, creatures of the four elements at corners.', svgSymbol: 'world' },
];

const SUITS_DATA = {
  wands: { element: 'Fire', symbol: 'staff', keywords: ['Passion', 'Energy', 'Creativity'] },
  cups: { element: 'Water', symbol: 'chalice', keywords: ['Emotions', 'Relationships', 'Intuition'] },
  swords: { element: 'Air', symbol: 'blade', keywords: ['Intellect', 'Conflict', 'Truth'] },
  pentacles: { element: 'Earth', symbol: 'coin', keywords: ['Material', 'Resources', 'Stability'] },
};

const COURT_NAMES = ['Page', 'Knight', 'Queen', 'King'];

function createMinorArcana(): TarotCard[] {
  const cards: TarotCard[] = [];
  const suits: TarotSuit[] = ['wands', 'cups', 'swords', 'pentacles'];

  const numberMeanings: Record<number, { upright: string; reversed: string; desc: string }> = {
    1: { upright: 'New beginnings, potential, opportunity', reversed: 'Missed opportunity, lack of initiative', desc: 'A hand emerges from a cloud holding the suit symbol.' },
    2: { upright: 'Balance, decisions, partnerships', reversed: 'Imbalance, difficult choices', desc: 'Two symbols balanced or in opposition.' },
    3: { upright: 'Growth, progress, collaboration', reversed: 'Setbacks, lack of direction', desc: 'Three symbols arranged in formation.' },
    4: { upright: 'Stability, celebration, structure', reversed: 'Lack of harmony, transitions', desc: 'Four symbols creating a foundation.' },
    5: { upright: 'Challenge, instability, adversity', reversed: 'Recovery, acceptance', desc: 'Five symbols in conflict or scattered.' },
    6: { upright: 'Harmony, abundance, sharing', reversed: 'Imbalance, selfishness', desc: 'Six symbols in harmonious arrangement.' },
    7: { upright: 'Evaluation, perseverance, vision', reversed: 'Confusion, overwhelmed', desc: 'Seven symbols requiring discernment.' },
    8: { upright: 'Movement, swiftness, mastery', reversed: 'Delays, hesitation', desc: 'Eight symbols in motion.' },
    9: { upright: 'Fulfillment, nearing completion', reversed: 'Incomplete, delays', desc: 'Nine symbols almost arranged.' },
    10: { upright: 'Completion, culmination, legacy', reversed: 'Burden, unresolved issues', desc: 'Ten symbols complete the cycle.' },
  };

  const courtMeanings: Record<string, { upright: string; reversed: string; desc: string }> = {
    Page: { upright: 'Message, new ideas, curiosity', reversed: 'Immaturity, lack of progress', desc: 'A youthful figure holds the symbol aloft.' },
    Knight: { upright: 'Action, pursuit, adventure', reversed: 'Hasty, reckless, unfocused', desc: 'A mounted figure charges bearing the symbol.' },
    Queen: { upright: 'Mastery, confidence, nurturing', reversed: 'Insecurity, dependence', desc: 'A seated woman holds the symbol.' },
    King: { upright: 'Authority, control, leadership', reversed: 'Dominance, manipulation', desc: 'A man on a throne commands the suit\'s element.' },
  };

  let id = 22;
  suits.forEach(suit => {
    const suitData = SUITS_DATA[suit];
    const element = suitData.element;

    // Ace through 10
    for (let num = 1; num <= 10; num++) {
      const numMeaning = numberMeanings[num];
      const cardName = num === 1 ? `Ace of ${suit.charAt(0).toUpperCase() + suit.slice(1)}` : `${num} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`;
      cards.push({
        id: id++,
        name: cardName,
        arcana: 'minor',
        suit,
        number: num,
        keywords: suitData.keywords,
        upright: `${numMeaning.upright} (${element.toLowerCase()} energy)`,
        reversed: `${numMeaning.reversed} (${element.toLowerCase()} blocked)`,
        description: numMeaning.desc.replace('suit symbol', suitData.symbol),
        svgSymbol: `${suit}_${num === 1 ? 'ace' : num}`,
      });
    }

    // Court cards
    COURT_NAMES.forEach((courtName) => {
      const courtMeaning = courtMeanings[courtName];
      cards.push({
        id: id++,
        name: `${courtName} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
        arcana: 'minor',
        suit,
        number: COURT_NAMES.indexOf(courtName) + 11,
        keywords: suitData.keywords,
        upright: `${courtMeaning.upright} (${element})`,
        reversed: `${courtMeaning.reversed} (${element} blocked)`,
        description: courtMeaning.desc.replace('symbol', suitData.symbol),
        svgSymbol: `${suit}_${courtName.toLowerCase()}`,
      });
    });
  });

  return cards;
}

export const MINOR_ARCANA: TarotCard[] = createMinorArcana();
export const ALL_TAROT_CARDS: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

export const SUIT_COLORS: Record<TarotSuit, string> = {
  wands: '#EF4444',
  cups: '#3B82F6',
  swords: '#64748B',
  pentacles: '#EAB308',
};
