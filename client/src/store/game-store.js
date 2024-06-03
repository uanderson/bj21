import { acquirePlayerId } from '../utils/player.js';

export class GameStore {
  constructor() {
    this.state = {
      chipValue: 50,
      isReady: false
    };

    this.subscribers = [];
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
    this.notify();
  }

  setServerState(state) {
    const game = state.game;
    const playerId = acquirePlayerId();
    const seat = game.seats.find(seat => seat.player?.id === playerId);
    const isMyTurn = game.playerTurnId === playerId;

    const player = seat?.player ? {
      ...seat.player,
      seatPosition: seat.position,
      isPlaying: isMyTurn
    } : 0;

    const updatedState = {
      ...state,
      player,
      controls: {
        canDeal: !game.usersReady.includes(playerId) && seat?.player?.bet > 0,
        canHit: isMyTurn,
        canStand: isMyTurn,
        canClearBet: game.state === 'initial' && seat?.player?.bet > 0,
        canLeave: game.state === 'initial' && player
      }
    };

    this.setState(updatedState);
  }

  getState() {
    return this.state;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    callback(this.state);
  }

  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter(cb => cb !== callback);
  }

  notify() {
    this.subscribers.forEach(subscriber => subscriber(this.state));
  }
}
