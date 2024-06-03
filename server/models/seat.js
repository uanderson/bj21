export class Seat {
  constructor(position) {
    this.position = position;
    this.player = null;
  }

  getPosition() {
    return this.position;
  }

  getPlayer() {
    return this.player;
  }

  /**
   * Assigns a player to the seat.

   * @param player - The player to be assigned to the seat.
   */
  assignPlayer(player) {
    this.player = player;
  }

  /**
   * Removes the player currently seated in the seat.
   */
  removePlayer() {
    this.player = null;
  }

  /**
   * Checks if the seat is currently occupied by a specific player.
   *
   * @param playerId - The player's id.
   */
  hasPlayer(playerId) {
    return this.player && this.player.id === playerId;
  }

  /**
   * Checks if the seat is currently occupied by a player.
   */
  isOccupied() {
    return this.player !== null;
  }

  /**
   * Retrieves the current state of the seat.
   *
   * @returns an object with the state of the seat.
   */
  getState() {
    const state = {
      position: this.position,
      isOccupied: this.isOccupied()
    };

    if (this.isOccupied()) {
      state.player = this.player.getState();
    }

    return state;
  }
}
