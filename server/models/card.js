import { ACE_CARD, ACE_CARD_VALUE, COURT_CARD_VALUE, COURT_CARDS } from './card.const.js';

export class Card {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  /**
   * Checks if the card is an ace.
   *
   * @returns true if the card is an ace, otherwise false.
   */
  isAce() {
    return this.rank === ACE_CARD;
  }

  /**
   * Retrieves the value of the card based on its rank.
   *
   * If the card is a court card, returns the predefined value for court cards.
   * If the card is an ace, returns the predefined value for aces.
   * Otherwise, returns the numeric value corresponding to the card's rank.
   *
   * @returns the value of the card.
   */
  getValue() {
    if (COURT_CARDS.includes(this.rank)) {
      return COURT_CARD_VALUE;
    }

    if (this.isAce()) {
      return ACE_CARD_VALUE;
    }

    return Number(this.rank);
  }

  /**
   * Retrieves the state of the card, including its rank and suit.
   *
   * @returns the state of the card.
   */
  getState() {
    return {
      rank: this.rank,
      suit: this.suit
    };
  }
}
