import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { Card } from './card.js';
import { Hand } from './hand.js';

describe('Hand', () => {
  let hand;

  beforeEach(() => {
    hand = new Hand();
  });

  it('should initialize with empty cards and zero bet', () => {
    assert.strictEqual(hand.getBet(), 0);
    assert.deepStrictEqual(hand.getCards(), []);
  });

  it('should add card to hand', () => {
    const card = new Card('10', 'hearts');
    hand.addCard(card);

    assert.deepStrictEqual(hand.getCards(), [card]);
  });

  it('should place and clear bet', () => {
    hand.placeBet(100);
    assert.strictEqual(hand.getBet(), 100);
    hand.clearBet();
    assert.strictEqual(hand.getBet(), 0);
  });

  it('should restart hand', () => {
    const card = new Card('10', 'hearts');
    hand.addCard(card);
    hand.placeBet(100);
    hand.restart();
    assert.deepStrictEqual(hand.getCards(), []);
  });

  it('should calculate total value of hand', () => {
    hand.addCard(new Card('10', 'hearts'));
    hand.addCard(new Card('J', 'hearts'));

    assert.strictEqual(hand.getTotal(), 20);
  });

  it('should check if hand is bust', () => {
    hand.addCard(new Card('10', 'hearts'));
    hand.addCard(new Card('J', 'hearts'));
    hand.addCard(new Card('2', 'hearts'));

    assert.strictEqual(hand.isBust(), true);
  });

  it('should check if hand is blackjack', () => {
    const card1 = new Card('A', 'hearts');
    const card2 = new Card('J', 'hearts');
    hand.addCard(card1);
    hand.addCard(card2);
    assert.strictEqual(hand.isBlackjack(), true);
  });

  it('should compare to another hand', () => {
    hand.addCard(new Card('10', 'hearts'));
    hand.addCard(new Card('J', 'hearts'));

    const anotherHand = new Hand();
    anotherHand.addCard(new Card('9', 'hearts'));
    anotherHand.addCard(new Card('J', 'hearts'));

    assert.strictEqual(hand.compareTo(anotherHand), 'win');
  });

  it('should return correct state', () => {
    const card = new Card('10', 'hearts');
    hand.addCard(card);
    hand.placeBet(100);
    assert.deepStrictEqual(hand.getState(), {
      bet: 100,
      cards: [card.getState()],
      total: 10,
      isBust: false,
      isBlackjack: false
    });
  });
});
