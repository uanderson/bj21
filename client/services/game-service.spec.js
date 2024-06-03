import { GameService } from './game-service.js';


describe('GameService', () => {
  let gameService;

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: 'mockedData' }),
      })
    );

    gameService = new GameService('foo');
  });

  it('should initialize with a player id', () => {
    expect(gameService.playerId).toBe('foo');
  });

  it('should make a POST request with correct parameters', async () => {
    const endpoint = 'deal';
    const body = { seat: 1, amount: 100 };
    const expectedUrl = '/api/deal';
    const expectedOptions = {
      body: JSON.stringify(body),
      method: 'POST'
    };

    await gameService.post(endpoint, body);

    expect(fetch).toHaveBeenCalledWith(expectedUrl, expect.objectContaining(expectedOptions));
  });

  it('should handle deal request', async () => {
    await gameService.deal();
    expect(fetch).toHaveBeenCalledWith('/api/deal', expect.anything());
  });

  it('should handle bet request', async () => {
    const seat = 1;
    const amount = 100;
    await gameService.bet(seat, amount);
    expect(fetch).toHaveBeenCalledWith('/api/bet', expect.anything());
  });

  it('should handle hit request', async () => {
    await gameService.hit();
    expect(fetch).toHaveBeenCalledWith('/api/hit', expect.anything());
  });

  it('should handle stand request', async () => {
    await gameService.stand();
    expect(fetch).toHaveBeenCalledWith('/api/stand', expect.anything());
  });

  it('should handle clear bet request', async () => {
    await gameService.clearBet();
    expect(fetch).toHaveBeenCalledWith('/api/clear-bet', expect.anything());
  });

  it('should handle leave request', async () => {
    await gameService.leave();
    expect(fetch).toHaveBeenCalledWith('/api/leave', expect.anything());
  });
});
