import { acquirePlayerId } from '../utils/player.js';

export class SSEListener {
  constructor(gameStore) {
    this.gameStore = gameStore;
  }

  listen(pathname) {
    const url = import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : '';
    const playerId = acquirePlayerId();

    this.eventSource = new EventSource(`${url}${pathname}?playerId=${playerId}`);
    this.eventSource.addEventListener('error', this.handleError.bind(this));
    this.eventSource.addEventListener('message', this.handleMessage.bind(this));
  }

  handleError() {
    this.gameStore.setState({ connected: false });
  }

  handleMessage(event) {
    const gameState = JSON.parse(event.data);
    this.gameStore.setServerState({
      connected: true,
      isReady: true,
      game: gameState
    });
  }
}
