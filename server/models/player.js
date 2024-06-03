import { Hand } from './hand.js';
import { INITIAL_BALANCE } from './player.const.js';

export class Player {
  constructor(id) {
    this.id = id;
    this.balance = INITIAL_BALANCE;
    this.hand = new Hand();
  }

  getId() {
    return this.id;
  }

  getHand() {
    return this.hand;
  }

  /**
   * Places a bet with the specified amount from the player's balance.
   *
   * @param amount - The amount to be bet by the player.
   */
  placeBet(amount) {
    this.hand.placeBet(amount);
  }

  /**
   * Deducts the bet amount from the player's balance.
   */
  deductBet() {
    this.balance -= this.hand.getBet();
  }

  /**
   * Clears the bet.
   */
  clearBet() {
    this.hand.clearBet();
  }

  /**
   * Checks if the player has placed a bet.
   */
  hasBet() {
    return this.hand.getBet() > 0;
  }

  /**
   * Restarts the player's hand by clearing all cards.
   */
  restart() {
    this.hand.restart();
  }

  /**
   * Receives a card and adds it to the player's hand.

   * @param card - The card to be received and added to the player's hand.
   */
  receiveCard(card) {
    this.hand.addCard(card);
  }

  /**
   * Compares the player's hand with the dealer's hand to determine the outcome of the round. Based on the comparison result,
   * adjusts the player's balance accordingly. If the player wins, the player's balance is increased by double the bet amount.
   * If the result is a push (tie), the player's balance is increased by the original bet amount.
   *
   * @param dealer - The dealer's hand to compare against.
   */
  settleBets(dealer) {
    if (this.hand.isBlackjack()) {
      this.balance += this.hand.getBet() * 2.5;

      return;
    }

    const result = this.hand.compareTo(dealer.getHand());

    if (result === 'win') {
      this.balance += this.hand.getBet() * 2;
    } else if (result === 'push') {
      this.balance += this.hand.getBet();
    }

    // lose is already accounted for
  }

  /**
   * Retrieves the current state of the player.
   *
   * @returns an object with the state of the player.
   */
  getState() {
    return {
      id: this.id,
      balance: this.balance,
      ...this.hand.getState()
    };
  }
}
