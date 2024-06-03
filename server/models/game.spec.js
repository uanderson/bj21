import get from 'lodash/get.js';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import sinon from 'sinon';
import { Dealer } from './dealer.js';
import { Deck } from './deck.js';
import { GameStateMachine } from './game-state-machine.js';
import { Game } from './game.js';

describe('Game', () => {
  let deck;
  let dealer;
  let game;
  let gameStateMachine;

  beforeEach(() => {
    gameStateMachine = new GameStateMachine();
    gameStateMachine.setGame = sinon.spy();
    gameStateMachine.transitionTo = sinon.spy();
    gameStateMachine.whenStateIs = sinon.spy();

    sinon.stub(gameStateMachine, 'getCurrentState').returns('initial');

    deck = new Deck();
    dealer = new Dealer(deck);
    game = new Game(dealer, gameStateMachine);
  });

  describe('placeBet', () => {
    it('should throw an error if seat is not found', () => {
      assert.throws(() => game.placeBet('playerId', null, 100), { message: 'Seat not found' });
      assert.throws(() => game.placeBet('playerId', 10, 100), { message: 'Seat not found' });
    });

    it('should throw an error if player is seated in another seat', () => {
      game.placeBet('playerId', 0, 100);

      assert.throws(() => game.placeBet('playerId', 1, 100), { message: 'Player is seated in another seat' });
    });

    it('should throw an error if player is seated and has a bet placed', () => {
      game.placeBet('playerId', 0, 100);

      assert.throws(() => game.placeBet('playerId', 0, 100), { message: 'Player need to clear the bet first' });
    });

    it('should place a bet if the user is seated and has not placed a bet', () => {
      game.placeBet('playerId', 0, 100);

      let actualBet = get(game.getState(), 'seats[0].player.bet');
      assert.equal(actualBet, 100);

      game.clearBet('playerId');
      game.placeBet('playerId', 0, 50);

      actualBet = get(game.getState(), 'seats[0].player.bet');
      assert.equal(actualBet, 50);
    });

    it('should throw an error if seat is occupied', () => {
      game.placeBet('playerId', 0, 100);

      assert.throws(() => game.placeBet('newPlayerId', 0, 100), { message: 'Seat is occupied' });
    });

    it('should assign player if seat is available', () => {
      let actualSeatedPlayer = get(game.getState(), 'seats[0].player');
      assert.equal(actualSeatedPlayer, null);
      game.placeBet('playerId', 0, 50);

      actualSeatedPlayer = get(game.getState(), 'seats[0].player');
      assert.notEqual(actualSeatedPlayer, null);
      assert.equal(actualSeatedPlayer.id, 'playerId');
    });
  });

  describe('removePlayer', () => {
    it('should throw an error if player is not seated', () => {
      assert.throws(() => game.removePlayer('playerId'), { message: 'Player is not here' });
    });

    it('should remove player from seats and players ready if seated', () => {
      game.removePlayerReady = sinon.spy();
      game.placeBet('playerId', 0, 100);

      let actualSeatedPlayer = get(game.getState(), 'seats[0].player');
      assert.notEqual(actualSeatedPlayer, null);

      game.removePlayer('playerId');

      actualSeatedPlayer = get(game.getState(), 'seats[0].player');

      assert.equal(actualSeatedPlayer, null);
      assert(game.removePlayerReady.calledOnce);
      assert(game.removePlayerReady.calledWithMatch({ id: 'playerId' }));
    });
  });

  describe('deal', () => {
    it('should throw an error if player has not placed a bet', () => {
      assert.throws(() => game.deal('playerId'), { message: 'Player has not placed a bet yet' });
    });

    it('should throw an error if player already asked to be dealt', () => {
      game.placeBet('playerId', 1, 100);
      game.deal('playerId');

      assert.throws(() => game.deal('playerId'), { message: 'Player has already requested to deal' });
    });

    it('should deal cards if all seated players have asked to be dealt', () => {
      game.placeBet('playerId1', 0, 50);
      game.placeBet('playerId2', 1, 100);

      game.deal('playerId1');
      game.deal('playerId2');

      assert(gameStateMachine.transitionTo.calledOnce);
      assert(gameStateMachine.transitionTo.calledWith('allPlayersBet'));
    });

    it('should not deal cards if some of the seated players have asked to be dealt only', () => {
      game.placeBet('playerId1', 0, 50);
      game.placeBet('playerId2', 1, 100);

      game.deal('playerId1');

      assert(gameStateMachine.transitionTo.notCalled);
    });

    it('should deduct players balance when cards are dealt', () => {
      game.placeBet('playerId1', 0, 50);
      game.placeBet('playerId2', 1, 100);

      game.deal('playerId1');
      game.deal('playerId2');

      const actualPlayerOne = get(game.getState(), 'seats[0].player');
      const actualPlayerTwo = get(game.getState(), 'seats[1].player');

      assert.equal(actualPlayerOne.balance, 950);
      assert.equal(actualPlayerTwo.balance, 900);

    });
  });

  describe('clearBet', () => {
    it('should throw an error if player is not seated', () => {
      assert.throws(() => game.removePlayer('playerId'), { message: 'Player is not here' });
    });

    it('should clear bet and remove player from players ready if seated', () => {
      game.removePlayerReady = sinon.spy();
      game.placeBet('playerId', 0, 100);

      let actualSeatedPlayer = get(game.getState(), 'seats[0].player');
      assert.notEqual(actualSeatedPlayer, null);
      assert.strictEqual(actualSeatedPlayer.bet, 100);

      game.clearBet('playerId');

      actualSeatedPlayer = get(game.getState(), 'seats[0].player');

      assert.equal(actualSeatedPlayer.bet, 0);
      assert(game.removePlayerReady.calledOnce);
      assert(game.removePlayerReady.calledWithMatch({ id: 'playerId' }));
    });
  });

  describe('hit', () => {
    beforeEach(() => {
      gameStateMachine.getCurrentState.returns('round-robin');
    })

    it('should throw an error if it is not the player turn', () => {
      assert.throws(() => game.hit('playerId'), { message: 'It is not your turn' });
    });

    it('should throw an error if player is not seated', () => {
      game.isPlayerTurn = sinon.stub().returns(true);
      assert.throws(() => game.hit('playerId'), { message: 'Player is not here' });
    });

    it('should deal cards to player', () => {
      gameStateMachine.getCurrentState.returns('initial');
      game.placeBet('playerId', 0, 100);

      game.isPlayerTurn = sinon.stub().returns(true);
      dealer.dealCardToPlayer = sinon.spy();

      gameStateMachine.getCurrentState.returns('round-robin');
      game.hit('playerId');

      assert(dealer.dealCardToPlayer.calledOnce);
    });
  });

  describe('stand', () => {
    beforeEach(() => {
      gameStateMachine.getCurrentState.returns('round-robin');
    });

    it('should throw an error if it is not the player turn', () => {
      assert.throws(() => game.stand('playerId'), { message: 'It is not your turn' });
    });

    it('should progress the round-robin if it is the player turn', () => {
      game.isPlayerTurn = sinon.stub().returns(true);
      game.progressRoundRobin = sinon.spy();

      game.stand('playerId');

      assert(game.progressRoundRobin.calledOnce);
    });
  });

});
