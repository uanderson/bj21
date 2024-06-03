import { acquirePlayerId } from './player.js';

describe('acquirePlayerId', () => {
  const originalSessionStorage = global.sessionStorage;

  beforeEach(() => {
    global.sessionStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };
  });

  afterEach(() => {
    global.sessionStorage = originalSessionStorage;
  });

  it('should return existing session id if it exists', () => {
    const existingId = 'existingId';
    global.sessionStorage.getItem.mockReturnValue(existingId);

    const id = acquirePlayerId();

    expect(id).toBe(existingId);
    expect(global.sessionStorage.setItem).not.toHaveBeenCalled();
  });

  it('should generate and store a new session id if it does not exist', () => {
    global.sessionStorage.getItem.mockReturnValue(null);

    const id = acquirePlayerId();

    expect(id).toBeTruthy();
    expect(global.sessionStorage.setItem).toHaveBeenCalledWith('@blackjack/player-id', id);
  });
});
