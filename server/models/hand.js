export class Hand {
  constructor() {
    this.bet = 0;
    this.cards = [];
  }

  getBet() {
    return this.bet;
  }

  getCards() {
    return [...this.cards];
  }

  /**
   * Adds a card to the player's hand.
   *
   * @param card - The card to be added to the player's hand.
   */
  addCard(card) {
    this.cards.push(card);
  }

  /**
   * Places a bet for the player.
   *
   * @param amount - The amount to be bet by the player.
   */
  placeBet(amount) {
    this.bet = amount;
  }

  /**
   * Clears the player's current bet amount.
   */
  clearBet() {
    this.bet = 0;
  }

  /**
   * Clears the player's hand by removing all cards.
   */
  restart() {
    this.cards = [];
  }

  /**
   * Calculates the total value of the player's hand by summing up the individual values of each card.
   * Adjusts the total value to account for Aces, which can have a value of either 1 or 11 depending on the
   * current hand's total value. If the total value exceeds 21 and there are Aces present in the hand,
   * adjusts the total value by treating Aces as having a value of 1 to prevent busting.
   *
   * @returns the total value of the player's hand.
   */
  getTotal() {
    let total = 0;
    let aces = 0;

    this.cards.forEach(card => {
      if (card.isAce()) {
        aces += 1;
        total += card.getValue();
      } else {
        total += card.getValue();
      }
    });

    // Adjust for aces
    while (total > 21 && aces > 0) {
      total -= 10;
      aces -= 1;
    }

    return total;
  }

  /**
   * Checks if the player's hand is bust.
   *
   * @returns {boolean} True if the player's hand is bust, otherwise false.
   */
  isBust() {
    return this.getTotal() > 21;
  }

  /**
   * Checks if the player's hand has a Blackjack.

   * @returns true if the player's hand has a Blackjack, otherwise false.
   */
  isBlackjack() {
    return this.cards.length === 2 && this.getTotal() === 21;
  }

  /**
   * Compares the total value of the player's hand with the total value of another hand to determine the outcome
   * of the game round. Returns one of the following outcomes: 'win' if the player wins, 'lose' if the player loses,
   * or 'push' if it's a tie. The comparison considers bust hands and the total values of the hands.
   *
   * @param anotherHand - The hand to compare against.
   * @returns the outcome of the comparison: 'win', 'lose', or 'push'.
   */
  compareTo(anotherHand) {
    const playerTotal = this.getTotal();
    const anotherHandTotal = anotherHand.getTotal();

    if (this.isBust()) {
      return 'lose';
    }

    if (anotherHand.isBust()) {
      return 'win';
    }

    if (playerTotal > anotherHandTotal) {
      return 'win';
    }

    if (playerTotal < anotherHandTotal) {
      return 'lose';
    }

    return 'push';
  }

  /**
   * Retrieves the current state of the player's hand.
   *
   * @returns an object with the state of the player.
   */
  getState() {
    return {
      bet: this.bet,
      cards: this.cards.map(card => card.getState()),
      total: this.getTotal(),
      isBust: this.isBust(),
      isBlackjack: this.isBlackjack()
    };
  }
}
