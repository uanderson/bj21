import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ACE_CARD, ACE_CARD_VALUE, COURT_CARD_VALUE, COURT_CARDS } from './card.const.js';
import { Card } from './card.js';

describe('Card', () => {
  it('should initialize with rank and suit', () => {
    const card = new Card('10', 'hearts');
    assert.strictEqual(card.rank, '10');
    assert.strictEqual(card.suit, 'hearts');
  });

  it('should identify ace card correctly', () => {
    const card = new Card(ACE_CARD, 'hearts');
    assert.strictEqual(card.isAce(), true);
  });

  it('should not identify non-ace card as ace', () => {
    const card = new Card('10', 'hearts');
    assert.strictEqual(card.isAce(), false);
  });

  it('should return correct value for court card', () => {
    COURT_CARDS.forEach(courtCard => {
      const card = new Card(courtCard, 'hearts');
      assert.strictEqual(card.getValue(), COURT_CARD_VALUE);
    });
  });

  it('should return correct value for ace card', () => {
    const card = new Card(ACE_CARD, 'hearts');
    assert.strictEqual(card.getValue(), ACE_CARD_VALUE);
  });

  it('should return correct value for numeric card', () => {
    const card = new Card('10', 'hearts');
    assert.strictEqual(card.getValue(), 10);
  });

  it('should return correct state', () => {
    const card = new Card('10', 'hearts');
    assert.deepStrictEqual(card.getState(), { rank: '10', suit: 'hearts' });
  });
});
