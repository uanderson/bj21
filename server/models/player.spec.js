import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { Card } from './card.js';
import { Player } from './player.js';

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player('player1');
  });

  it('should initialize with id, balance, and empty hand', () => {
    assert.strictEqual(player.getId(), 'player1');
    assert.strictEqual(player.getHand().getCards().length, 0);
  });

  it('should place and clear bet', () => {
    player.placeBet(100);
    assert.strictEqual(player.getHand().getBet(), 100);
    player.clearBet();
    assert.strictEqual(player.getHand().getBet(), 0);
  });

  it('should deduct bet from balance', () => {
    player.placeBet(100);
    player.deductBet();
    assert.strictEqual(player.balance, 900);
  });

  it('should restart hand', () => {
    const card = new Card('10', 'hearts');
    player.receiveCard(card);
    player.placeBet(100);
    player.restart();
    assert.deepStrictEqual(player.getHand().getCards(), []);
  });

  it('should receive card and add to hand', () => {
    const card = new Card('10', 'hearts');
    player.receiveCard(card);
    assert.deepStrictEqual(player.getHand().getCards(), [card]);
  });

  it('should settle blackjack bet', () => {
    const card1 = new Card('A', 'hearts');
    const card2 = new Card('J', 'hearts');
    player.receiveCard(card1);
    player.receiveCard(card2);
    player.placeBet(100);
    player.trySettleBlackjackBet();
    assert.strictEqual(player.balance, 1250);
  });

  it('should settle bets based on outcome', () => {
    const dealer = new Player('dealer');
    const card1 = new Card('10', 'hearts');
    const card2 = new Card('J', 'hearts');
    player.receiveCard(card1);
    player.receiveCard(card2);
    player.placeBet(100);
    dealer.receiveCard(card1);
    dealer.receiveCard(card2);
    player.settleBets(dealer);
    assert.strictEqual(player.balance, 1100);
  });

  it('should return correct state', () => {
    const card = new Card('10', 'hearts');
    player.receiveCard(card);
    player.placeBet(100);
    assert.deepStrictEqual(player.getState(), {
      id: 'player1',
      balance: 1000,
      bet: 100,
      cards: [card.getState()],
      total: 10,
      isBust: false,
      isBlackjack: false
    });
  });
});
