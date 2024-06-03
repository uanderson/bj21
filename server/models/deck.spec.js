import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { CARD_RANKS, CARD_SUITS } from './card.const.js';
import { Deck } from './deck.js';

describe('Deck', () => {
  let deck;

  beforeEach(() => {
    deck = new Deck();
  });

  it('should initialize with a full deck of cards', () => {
    assert.strictEqual(deck.getCards().length, CARD_RANKS.length * CARD_SUITS.length);
  });

  it('should draw a card reducing the deck size', () => {
    const initialDeckSize = deck.getCards().length;

    deck.drawCard();

    assert.strictEqual(deck.getCards().length, initialDeckSize - 1);
  });

  it('should set reshuffle flag when deck size is at threshold', () => {

    while (deck.getCards().length >= deck.getReshuffleThreshold()) {
      deck.drawCard();
    }

    assert.strictEqual(deck.isNeedReshuffle(), true);
  });

  it('should reshuffle the deck', () => {
    deck.reshuffle();
    assert.strictEqual(deck.getCards().length, CARD_RANKS.length * CARD_SUITS.length);
    assert.strictEqual(deck.isNeedReshuffle(), false);
  });
});
