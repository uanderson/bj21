import { GameStateMachine } from './game-state-machine.js';
import { throwModelError } from '../utils/errors.js';
import { AVAILABLE_NUMBER_OF_SEATS } from './game.const.js';
import { Player } from './player.js';
import { Seat } from './seat.js';

export class Game {
  constructor(dealer) {
    this.dealer = dealer;
    this.roundRobin = [];
    this.usersReady = [];
    this.stateMachine = new GameStateMachine(this);
    this.createSeats();
  }

  /**
   * Creates seats for players at the table.
   */
  createSeats() {
    this.seats = Array.from({ length: AVAILABLE_NUMBER_OF_SEATS }, (_, index) => new Seat(index))
  }

  /**
   * Asserts that the game is in a specific state before allowing certain actions to be performed.
   *
   * @param state - The state that the game should be in.
   * @throws {ModelError} Throws an error if the game state does not match the specified state.
   */
  assertGameState(state) {
    const { currentState } = this.stateMachine;

    if (currentState !== state) {
      throwModelError(`Action unavailable when the game is on the state ${currentState}`);
    }
  }

  /**
   * Places a bet for a player in a specified seat.
   *
   * @param playerId - The player's id.
   * @param seatPosition - The position of the seat.
   * @param amount - The amount of the bet.
   * @throws {ModelError} Throws an error if the game state is not 'initial'.
   * @throws {ModelError} Throws an error if the seat is not found.
   * @throws {ModelError} Throws an error if the player cannot sit in the seat.
   * @throws {ModelError} Throws an error if the player is already seated elsewhere.
   */
  placeBet(playerId, seatPosition, amount) {
    this.assertGameState('initial');

    const seat = this.seats.find(seat => seat.getPosition() === seatPosition);

    if (!seat) {
      throwModelError('Seat not found');
    }

    const isPlayerSeatedElsewhere = Array.from(this.seats.values())
      .filter(seat => seat.getPosition() !== seatPosition)
      .some(seat => seat.hasPlayer(playerId));

    if (isPlayerSeatedElsewhere) {
      throwModelError('Player is seated in another seat');
    }

    if (seat.hasPlayer(playerId)) {
      if (seat.getPlayer().hasBet()) {
        throwModelError('Player need to clear the bet first');
      } else {
        seat.getPlayer().placeBet(amount);
      }

      return;
    }

    if (seat.isOccupied()) {
      throwModelError('Seat is occupied');
    }

    const player = new Player(playerId);
    player.placeBet(amount);

    seat.assignPlayer(player);
  }

  /**
   * Removes a player from their seat.
   *
   * @param playerId - The player's id.
   * @throws {ModelError} Throws an error if the game state is not 'initial'.
   * @throws {ModelError} Throws an error if the player is not seated.
   */
  removePlayer(playerId) {
    this.assertGameState('initial');

    const seat = this.seats.find(seat => seat.hasPlayer(playerId));

    if (!seat) {
      throwModelError('Player is not here');
    }

    seat.removePlayer();
  }

  /**
   * Initiates the dealing phase for the player. If all players have requested to deal, the game
   * will start.
   *
   * @param playerId - The player's id.
   * @throws {ModelError} Throws an error if the game state is not 'initial'.
   * @throws {ModelError} Throws an error if the player has already requested to deal.
   * @throws {ModelError} Throws an error if the player has not placed a bet yet.
   */
  deal(playerId) {
    this.assertGameState('initial');

    if (this.usersReady.includes(playerId)) {
      throwModelError('Player has already requested to deal');
    }

    const seat = this.seats.find(seat => seat.hasPlayer(playerId));

    if (!seat?.getPlayer().hasBet()) {
      throwModelError('Player has not placed a bet yet');
    }

    this.usersReady.push(playerId);

    const every = this.seats
      .filter(seat => seat.getPlayer())
      .every(seat => this.usersReady.includes(seat.getPlayer().id));

    if (every) {
      this.seats.forEach(seat => seat.getPlayer()?.deductBet());
      this.stateMachine.transitionTo('allPlayersBet');
    }
  }

  /**
   * Clears the bet for a player.
   *
   * @param playerId - The player's id.
   * @throws {ModelError} Throws an error if the game state is not 'initial'.
   * @throws {ModelError} Throws an error if the player is not seated.
   */
  clearBet(playerId) {
    this.assertGameState('initial');

    const seat = this.seats.find(seat => seat.hasPlayer(playerId));

    if (!seat) {
      throwModelError('Player is not here');
    }

    const player = seat.getPlayer();
    player.clearBet();
  }

  /**
   * Deals a card to the player requesting a hit.
   *
   * @param playerId - The player's id.
   * @throws {ModelError} Throws an error if the game state is not 'round-robin'.
   * @throws {ModelError} Throws an error if it's not the player's turn.
   * @throws {ModelError} Throws an error if the player is not seated.
   */
  hit(playerId) {
    this.assertGameState('round-robin');

    if (this.playerTurn.id !== playerId) {
      throwModelError('It is not your turn');
    }

    const seat = this.seats.find(seat => seat.hasPlayer(playerId));

    if (!seat) {
      throwModelError('Player is not here');
    }

    const player = seat.getPlayer();
    this.dealer.dealCardToPlayer(player);

    if (player.hand.isBust()) {
      this.progressRoundRobin();
    }
  }

  /**
   * Allows the player to stand, ending their turn.
   *
   * @param playerId - The player's id.
   * @throws {ModelError} Throws an error if the game state is not 'round-robin'.
   * @throws {ModelError} Throws an error if it's not the player's turn.
   */
  stand(playerId) {
    this.assertGameState('round-robin');

    if (this.playerTurn.id !== playerId) {
      throwModelError('It is not your turn');
    }

    this.progressRoundRobin();
  }

  /**
   * Settles bets for all players seated at the table.
   * Restarts the dealer's deck if needed and transitions the game state to 'betsSettled'.
   */
  settleBets() {
    this.seats.forEach(seat => {
      if (seat.player) {
        seat.player.settleBets(this.dealer);
      }
    });

    this.dealer.reshuffleDeckIfNeeded();
    this.stateMachine.transitionTo('betsSettled');
  }

  /**
   * Deals initial cards to players seated at the table.
   * Checks if the dealer has blackjack and transitions the game state accordingly.
   * If the dealer does not have blackjack, transitions the game state to 'allPlayersDecided'.
   */
  dealInitialCards() {
    const players = this.seats.filter(seat => seat.isOccupied())
      .map(seat => seat.getPlayer())
      .reverse()

    this.dealer.dealCardsToPlayers(players);

    if (this.dealer.hand.isBlackjack()) {
      this.stateMachine.transitionTo('dealerBlackjack');
    } else {
      this.stateMachine.transitionTo('allPlayersDecided');
    }
  }

  /**
   * Starts the round robin process for player turns.
   * Players are selected in a round robin fashion from the occupied seats,
   * excluding those who already have a blackjack hand.
   * If there are no eligible players left, transitions the state machine to 'noPlayersLeft',
   * otherwise assigns the turn to the next player in the round robin sequence.
   */
  startRoundRobin() {
    this.roundRobin = this.seats
      .filter(seat => seat.player && !seat.player.hand.isBlackjack())
      .map(seat => seat.player);

    if (this.roundRobin.length === 0) {
      this.stateMachine.transitionTo('noPlayersLeft');
    } else {
      this.playerTurn = this.roundRobin.pop();
    }
  }

  /**
   * Progresses the game to the next player's turn in a round-robin fashion.
   * If there are no more players left, transitions the game state accordingly.
   */
  progressRoundRobin() {
    if (this.roundRobin.length === 0) {
      this.playerTurn = null;
      this.stateMachine.transitionTo('noPlayersLeft');
    } else {
      this.playerTurn = this.roundRobin.pop();
    }
  }

  /**
   * Initializes the round-robin turn order for players who are eligible to play.
   * If no eligible players are found, transitions the game state to 'noPlayersLeft'.
   * Otherwise, sets the player turn to the first player in the round-robin order.
   */
  dealerTurn() {
    this.dealer.takeTurn();
    this.stateMachine.transitionTo('dealerPlayed');
  }

  /**
   * Restarts the game state and all player-related data to prepare for a new round.
   * Clears the current player turn, restarts player hands and bets, restarts the dealer's hand,
   * and clears the round-robin turn order and player readiness status.
   */
  restart() {
    this.playerTurn = null;
    this.seats.forEach(seat => seat.player?.restart());
    this.dealer.restart();
    this.roundRobin = [];
    this.usersReady = [];
  }

  /**
   * Registers a callback function to be executed when the game state matches the specified state.
   *
   * @param state - The state to listen for.
   * @param callback - The callback function to execute when the specified state is reached.
   */
  whenStateIs(state, callback) {
    this.stateMachine.whenStateIs(state, callback);
  }

  /**
   * Retrieves the current state of the game, including the game state, players' readiness status,
   * seat states, dealer state, and optionally the ID of the player whose turn it is.
   */
  getState() {
    const state = {
      state: this.stateMachine.currentState,
      usersReady: this.usersReady,
      seats: this.seats.map(seat => seat.getState()),
      dealer: this.dealer.getState(),
    }

    if (this.playerTurn) {
      state.playerTurnId = this.playerTurn.id;
    }

    return state;
  }
}
