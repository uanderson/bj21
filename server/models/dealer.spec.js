import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { Dealer } from './dealer.js';
import { Deck } from './deck.js';
import { Player } from './player.js';

describe('Dealer', () => {
  let dealer;
  let deck;
  let player;

  beforeEach(() => {
    deck = new Deck();
    dealer = new Dealer(deck);
    player = new Player('Player1');
  });

  it('should initialize with a hand and deck', () => {
    assert.strictEqual(dealer.getHand().getCards().length, 0);
  });

  it('should deal cards to players', () => {
    dealer.dealCardsToPlayers([ player ]);
    assert.strictEqual(player.getHand().getCards().length, 2);
    assert.strictEqual(dealer.getHand().getCards().length, 2);
  });

  it('should deal card to player', () => {
    dealer.dealCardToPlayer(player);
    assert.strictEqual(player.getHand().getCards().length, 1);
  });

  it('should deal card to self', () => {
    dealer.dealCardToSelf();
    assert.strictEqual(dealer.getHand().getCards().length, 1);
  });

  it('should take turn correctly', () => {
    dealer.takeTurn();
    assert.strictEqual(dealer.getHand().getTotal() >= 17, true);
  });

  it('should reshuffle deck if needed', () => {
    deck.needReshuffle = true;
    dealer.reshuffleDeckIfNeeded();
    assert.strictEqual(deck.needReshuffle, false);
  });

  it('should return correct state', () => {
    const state = dealer.getState();
    assert.deepStrictEqual(state, {
      bet: 0,
      cards: [],
      isBlackjack: false,
      isBust: false,
      total: 0
    });
  });
});
