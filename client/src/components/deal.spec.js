import { registerCustomElement } from '../utils/elements.js';
import { DealerComponent } from './dealer.js';

describe('DealerComponent', () => {
  let component;
  let gameStoreMock = {};

  beforeAll(() => {
    registerCustomElement('bj21-dealer', DealerComponent, [ gameStoreMock ]);
  });

  beforeEach(() => {
    gameStoreMock.subscribe = vi.fn();
    gameStoreMock.unsubscribe = vi.fn();
    gameStoreMock.setState = vi.fn();

    component = document.createElement('bj21-dealer');
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.remove();
  });

  it('subscribes to gameStore on connectedCallback', () => {
    expect(gameStoreMock.subscribe).toHaveBeenCalled();
  });

  it('unsubscribes from gameStore on disconnectedCallback', () => {
    component.disconnectedCallback();
    expect(gameStoreMock.unsubscribe).toHaveBeenCalled();
  });

  it('updates dealer hand based on game state finished', () => {
    const gameState = {
      game: {
        state: 'finished',
        dealer: {
          cards: [
            { suit: 'hearts', rank: 'A' },
            { suit: 'diamonds', rank: '10' }
          ],
          total: 21,
        }
      },
    };

    component.onStateChange(gameState);

    const dealerHand = component.shadowRoot.querySelector('#hand');
    expect(dealerHand.getAttribute('count')).toBe('21');
    expect(dealerHand.getAttribute('count-hidden')).toBe('false');

    const cards = dealerHand.querySelectorAll('bj21-card');
    expect(cards.length).toBe(2);

    const firstCard = cards[0];
    expect(firstCard.getAttribute('suit')).toBe('hearts');
    expect(firstCard.getAttribute('rank')).toBe('A');
    expect(firstCard.getAttribute('face-hidden')).toBeNull();

    const secondCard = cards[1];
    expect(secondCard.getAttribute('suit')).toBe('diamonds');
    expect(secondCard.getAttribute('rank')).toBe('10');
    expect(secondCard.getAttribute('face-hidden')).toBeNull();
  });

  it('updates dealer hand based on game state round robin', () => {
    const gameState = {
      game: {
        state: 'round-robin',
        dealer: {
          cards: [
            { suit: 'hearts', rank: 'A' },
            { suit: 'diamonds', rank: '10' }
          ],
          total: 21,
        }
      },
    };

    component.onStateChange(gameState);

    const dealerHand = component.shadowRoot.querySelector('#hand');
    expect(dealerHand.getAttribute('count')).toBe('21');
    expect(dealerHand.getAttribute('count-hidden')).toBe('true');

    const cards = dealerHand.querySelectorAll('bj21-card');
    expect(cards.length).toBe(2);

    const firstCard = cards[0];
    expect(firstCard.getAttribute('suit')).toBe('hearts');
    expect(firstCard.getAttribute('rank')).toBe('A');
    expect(firstCard.getAttribute('face-hidden')).toEqual('true');

    const secondCard = cards[1];
    expect(secondCard.getAttribute('suit')).toBe('diamonds');
    expect(secondCard.getAttribute('rank')).toBe('10');
    expect(secondCard.getAttribute('face-hidden')).toBeNull();
  });
});
