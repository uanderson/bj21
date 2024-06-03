export class GameService {
  constructor(playerId) {
    this.playerId = playerId;
  }

  /**
   * Performs a POST request to the specified API endpoint.
   *
   * @param endpoint - The API endpoint to which the request will be sent.
   * @param body - The request body to be sent along with the POST request. Defaults to an empty object.
   * @param options - Additional options to configure the fetch request. Defaults to an empty object.
   */
  post(endpoint, body = {}, options = {}) {
    // Prepare the headers
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Player-Id', this.playerId);

    const fetchOptions = {
      body: JSON.stringify(body),
      method: 'POST',
      ...options,
      headers,
    };

    const url = import.meta.env.DEV
      ? import.meta.env.VITE_SERVER_URL ?? ''
      : '';

    return fetch(`${url}/api/${endpoint}`, fetchOptions);
  }

  deal() {
    return this.post('deal');
  }

  bet(seat, amount) {
    return this.post('bet', { seat, amount });
  }

  hit() {
    return this.post('hit');
  }

  stand() {
    return this.post('stand');
  }

  clearBet() {
    return this.post('clear-bet');
  }

  leave() {
    return this.post('leave');
  }
}
