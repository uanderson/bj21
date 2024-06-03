import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { Seat } from './seat.js';

describe('Seat', () => {
  let seat;

  beforeEach(() => {
    seat = new Seat('front');
  });

  it('should have correct initial state', () => {
    assert.strictEqual(seat.getPosition(), 'front');
    assert.strictEqual(seat.getPlayer(), null);
    assert.strictEqual(seat.isOccupied(), false);
  });

  it('should assign a player to the seat', () => {
    const player = { id: 'player1' };
    seat.assignPlayer(player);
    assert.strictEqual(seat.getPlayer(), player);
    assert.strictEqual(seat.isOccupied(), true);
  });

  it('should remove the player from the seat', () => {
    const player = { id: 'player1' };
    seat.assignPlayer(player);
    seat.removePlayer();
    assert.strictEqual(seat.getPlayer(), null);
    assert.strictEqual(seat.isOccupied(), false);
  });

  it('should correctly check if it has a specific player', () => {
    const player = { id: 'player1' };
    seat.assignPlayer(player);
    assert.strictEqual(seat.hasPlayer('player1'), true);
    assert.strictEqual(seat.hasPlayer('player2'), false);
  });

  it('should return correct state', () => {
    const player = { id: 'player1', getState: () => ({ id: 'player1' }) };
    seat.assignPlayer(player);
    const state = seat.getState();
    assert.strictEqual(state.position, 'front');
    assert.strictEqual(state.isOccupied, true);
    assert.deepStrictEqual(state.player, { id: 'player1' });
  });
});
