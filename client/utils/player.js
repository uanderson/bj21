const KEY_ID = '@blackjack/player-id';

/**
 * Acquires a unique player identifier using the browser's sessionStorage. If a player identifier is already
 * stored in the sessionStorage, retrieves and returns it. Otherwise, generates a new unique player identifier,
 * stores it in the sessionStorage, and returns it.
 *
 * @returns A unique player identifier.
 */
export const acquirePlayerId = () => {
  const storedId = sessionStorage.getItem(KEY_ID);

  if (storedId) {
    return storedId;
  }

  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substring(2);
  const randomId = `${dateString}${randomness}`;

  sessionStorage.setItem(KEY_ID, randomId);

  return randomId;
}
