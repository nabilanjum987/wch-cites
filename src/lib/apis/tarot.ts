import { ALL_TAROT_CARDS, MAJOR_ARCANA, SUIT_COLORS } from '../../types/tarot';
import type { TarotCard } from '../../types/tarot';

const CARD_CYCLE_DAYS = 78;
const KNOWN_EPOCH = new Date('2025-01-01T00:00:00Z');

export function getTarotCardForToday(): TarotCard {
  const now = new Date();
  const daysSinceEpoch = Math.floor((now.getTime() - KNOWN_EPOCH.getTime()) / 86400000);
  const cardIndex = ((daysSinceEpoch % CARD_CYCLE_DAYS) + CARD_CYCLE_DAYS) % CARD_CYCLE_DAYS;
  return ALL_TAROT_CARDS[cardIndex];
}

export function getTarotCardByIndex(index: number): TarotCard {
  return ALL_TAROT_CARDS[index % CARD_CYCLE_DAYS];
}

export function getShareText(card: TarotCard): string {
  if (card.arcana === 'major') {
    return `Today's tarot card is ${card.name} — ${card.keywords.join(', ')} `;
  }
  const suit = card.suit;
  const emoji = suit === 'wands' ? '\uD83D\uDD2B' : suit === 'cups' ? '\uD83C\uDF76' : suit === 'swords' ? '\uD83D\uDDE1' : '\uD83D\uDCB0';
  return `Today's tarot card is ${card.name} ${emoji}`;
}

export { ALL_TAROT_CARDS, MAJOR_ARCANA, SUIT_COLORS };
