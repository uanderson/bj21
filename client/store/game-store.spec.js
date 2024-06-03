import { GameStore } from './game-store.js';

describe('GameStore', () => {
  let gameStore;

  beforeEach(() => {
    gameStore = new GameStore();
  });

  it('should initialize with default state', () => {
    expect(gameStore.getState()).toEqual({ chipValue: 50, isReady: false });
  });

  it('should update state correctly', () => {
    gameStore.setState({ chipValue: 100, isReady: true });
    expect(gameStore.getState()).toEqual({ chipValue: 100, isReady: true });
  });

  it('should notify subscribers when state changes', () => {
    const mockCallback = vi.fn();
    gameStore.subscribe(mockCallback);
    gameStore.setState({ chipValue: 100 });
    expect(mockCallback).toHaveBeenCalledWith(gameStore.getState());
  });
});
