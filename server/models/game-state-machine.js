import { EventEmitter } from 'events';
import { throwModelError } from '../utils/errors.js';
import { WAIT_BEFORE_RESTART_IN_MS } from './game-state-machine.const.js';

export class GameStateMachine {
  constructor(game) {
    this.game = game;
    this.eventEmitter = new EventEmitter();
    this.currentState = 'initial';

    this.initializeStates();
  }

  /**
   * Initializes the states and transitions for the game state machine.
   */
  initializeStates() {
    this.states = {
      initial: {
        onEnter: (game) => game.restart(),
        transitions: {
          allPlayersBet: 'cards-dealt',
        },
      },
      'cards-dealt': {
        onEnter: (game) => game.dealInitialCards(),
        transitions: {
          dealerBlackjack: 'settle-bets',
          allPlayersDecided: 'round-robin',
        },
      },
      'round-robin': {
        onEnter: (game) => game.startRoundRobin(),
        transitions: {
          noPlayersLeft: 'dealer-turn'
        },
      },
      'dealer-turn': {
        onEnter: (game) => game.dealerTurn(),
        transitions: {
          dealerPlayed: 'settle-bets'
        },
      },
      'settle-bets': {
        onEnter: (game) => game.settleBets(),
        transitions: {
          betsSettled: 'finished',
        },
      },
      finished: {
        onEnter: () => setTimeout(() => this.transitionTo('delayedResult'), WAIT_BEFORE_RESTART_IN_MS),
        transitions: {
          delayedResult: 'initial'
        },
      },
    };
  }

  /**
   * Transitions the game to a new state based on the specified event.
   *
   * @param {string} event - The event triggering the state transition.
   * @throws {Error} If the transition event is invalid or not defined in the current state.
   */
  transitionTo(event) {
    const currentStateDefinition = this.states[this.currentState];
    const nextState = currentStateDefinition.transitions[event];

    if (!nextState) {
      throwModelError(`Invalid transition: ${event} from ${this.currentState}`);
    }

    this.currentState = nextState;
    this.states[this.currentState].onEnter(this.game);
    this.eventEmitter.emit(this.currentState, this.game);
  }

  /**
   * Registers a callback to be executed when the game state matches the specified state.
   *
   * @param {string} state - The target state to listen for.
   * @param {Function} callback - The callback function to be executed when the game state matches the specified state.
   */
  whenStateIs(state, callback) {
    this.eventEmitter.on(state, callback);
  }
}
