import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import sinon from 'sinon';
import { EventEmitter } from 'events';
import { WAIT_BEFORE_RESTART_IN_MS } from './game-state-machine.const.js';
import { GameStateMachine } from './game-state-machine.js';

describe('GameStateMachine', () => {
  let game;
  let gameStateMachine;

  beforeEach(() => {
    game = {
      restart: sinon.spy(),
      dealInitialCards: sinon.spy(),
      startRoundRobin: sinon.spy(),
      dealerTurn: sinon.spy(),
      settleBets: sinon.spy(),
    };

    gameStateMachine = new GameStateMachine();
    gameStateMachine.setGame(game);
  });

  describe('setGame', () => {
    it('should throw an error if game instance is not provided', () => {
      assert.throws(() => gameStateMachine.setGame(null), { message: 'Game instance not provided' });
    });

    it('should set the game instance', () => {
      const newGame = {};
      gameStateMachine.setGame(newGame);
      assert.equal(gameStateMachine.game, newGame);
    });
  });

  describe('transitionTo', () => {
    it('should throw an error if game instance is not set', () => {
      gameStateMachine.game = null;
      assert.throws(() => gameStateMachine.transitionTo('allPlayersBet'), { message: 'Game not set in the state machine' });
    });

    it('should throw an error for an invalid transition', () => {
      assert.throws(() => gameStateMachine.transitionTo('invalidEvent'), { message: 'Invalid transition: invalidEvent from initial' });
    });

    it('should transition to the next state and call the onEnter method', () => {
      gameStateMachine.transitionTo('allPlayersBet');
      assert.equal(gameStateMachine.getCurrentState(), 'cards-dealt');
      assert(game.dealInitialCards.calledOnce);
    });
  });

  describe('whenStateIs', () => {
    it('should throw an error if game instance is not set', () => {
      gameStateMachine.game = null;
      assert.throws(() => gameStateMachine.whenStateIs('cards-dealt', () => {}), { message: 'Game not set in the state machine' });
    });
  });

  describe('state transitions', () => {
    it('should transition through all states correctly', () => {
      gameStateMachine.transitionTo('allPlayersBet');
      assert.equal(gameStateMachine.getCurrentState(), 'cards-dealt');
      assert(game.dealInitialCards.calledOnce);

      gameStateMachine.transitionTo('allPlayersDecided');
      assert.equal(gameStateMachine.getCurrentState(), 'round-robin');
      assert(game.startRoundRobin.calledOnce);

      gameStateMachine.transitionTo('noPlayersLeft');
      assert.equal(gameStateMachine.getCurrentState(), 'dealer-turn');
      assert(game.dealerTurn.calledOnce);

      gameStateMachine.transitionTo('dealerPlayed');
      assert.equal(gameStateMachine.getCurrentState(), 'settle-bets');
      assert(game.settleBets.calledOnce);

      gameStateMachine.transitionTo('betsSettled');
      assert.equal(gameStateMachine.getCurrentState(), 'finished');
    });
  });
});
