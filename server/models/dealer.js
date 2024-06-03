import { DEALER_STANDS_THRESHOLD } from './dealer.const.js';
import { Hand } from './hand.js';

export class Dealer {
  constructor(deck) {
    this.hand = new Hand();
    this.deck = deck;
  }

  getHand() {
    return this.hand;
  }

  /**
   * Deals initial cards to all players at the table, including the dealer.
   *
   * Two initial cards are dealt to each player and the dealer, following the standard rules of Blackjack.
   * After dealing cards, attempts to settle any Blackjack-related bets for each player.
   *
   * @param players - An array containing all players at the table.
   */
  dealCardsToPlayers(players) {
    for (let index = 0; index < 2; index++) {
      players.forEach(player => this.dealCardToPlayer(player));
      this.dealCardToSelf();
    }
  }

  /**
   * Clears the dealer's hand.
   */
  restart() {
    this.hand.restart();
  }

  /**
   * Deals a card from the deck to a specified player.
   *
   * @param player - The player to whom the card will be dealt.
   */
  dealCardToPlayer(player) {
    const card = this.deck.drawCard();
    player.receiveCard(card);
  }

  /**
   * Draws a card from the deck and adds it to the dealer's hand.
   */
  dealCardToSelf() {
    const card = this.deck.drawCard();
    this.hand.addCard(card);
  }

  /**
   * Continuously draws cards from the deck and adds them to the dealer's hand until the total value of the hand
   * reaches or exceeds the predefined dealer stands threshold.
   */
  takeTurn() {
    while (this.hand.getTotal() < DEALER_STANDS_THRESHOLD) {
      this.dealCardToSelf();
    }
  }

  /**
   * Checks if the deck needs to be reshuffled, and reshuffles the deck if necessary.
   */
  reshuffleDeckIfNeeded() {
    if (this.deck.isNeedReshuffle()) {
      this.deck.reshuffle();
    }
  }

  /**
   * Retrieves the state of the dealer's hand.
   *
   * @returns {Object} The state of the dealer's hand.
   */
  getState() {
    return { ...this.hand.getState() };
  }
}
