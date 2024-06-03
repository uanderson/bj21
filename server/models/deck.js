import { CARD_RANKS, CARD_SUITS } from './card.const.js';
import { Card } from './card.js';

export class Deck {
  constructor() {
    this.cards = this.initializeDeck();
    this.reshuffleThreshold = Math.floor(this.cards.length * 0.3);
    this.shuffle();
  }

  getCards() {
    return [...this.cards];
  }

  getReshuffleThreshold() {
    return this.reshuffleThreshold;
  }

  isNeedReshuffle() {
    return this.needReshuffle;
  }

  /**
   * Creates a standard deck of cards by iterating over each suit and rank combination,
   * and creating a card object for each combination. The resulting array contains all
   * possible cards in a standard deck.
   *
   * @returns {Card[]} An array containing all cards in the initialized deck.
   */
  initializeDeck() {
    let deck = [];

    CARD_SUITS.forEach(suit => {
      CARD_RANKS.forEach(rank => {
        deck.push(new Card(rank, suit));
      });
    });

    return deck;
  }

  /**
   * Rearranges the order of the cards in the deck randomly to achieve a shuffled deck.
   */
  shuffle() {
    for (let index = this.cards.length - 1; index > 0; index--) {
      const j = Math.floor(Math.random() * (index + 1));
      [ this.cards[index], this.cards[j] ] = [ this.cards[j], this.cards[index] ];
    }
  }

  /**
   * Draws a card from the top of the deck.
   *
   * Checks if the number of remaining cards in the deck is less than or equal to the reshuffle threshold.
   * If so, sets the reshuffle flag to true, indicating that the deck needs to be reshuffled.
   * Returns the card drawn from the top of the deck.
   *
   * @returns {Card} The card drawn from the top of the deck.
   */
  drawCard() {
    if (this.cards.length <= this.reshuffleThreshold) {
      this.needReshuffle = true;
    }

    return this.cards.pop();
  }

  /**
   * Reshuffles the deck by initializing it with a new set of cards, shuffling the new deck, and
   * resetting the reshuffle flag.
   */
  reshuffle() {
    this.cards = this.initializeDeck();
    this.shuffle();
    this.needReshuffle = false;
  }
}
