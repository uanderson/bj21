import { registerCustomElement } from '../utils/elements.js';
import { GameComponent } from './game.js';

describe('GameComponent', () => {
  let component;
  let gameStoreMock = {};

  beforeAll(() => {
    registerCustomElement('bj21-game', GameComponent, [ gameStoreMock ]);
  });

  beforeEach(() => {
    gameStoreMock.subscribe = vi.fn();
    gameStoreMock.unsubscribe = vi.fn();
    gameStoreMock.setState = vi.fn();

    component = document.createElement('bj21-game');
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

  it('renders initial state correctly', () => {
    const gameInfo = component.shadowRoot.querySelector('.game-info');
    const dealerSlot = component.shadowRoot.querySelector('slot[name="dealer"]');
    const seats = component.shadowRoot.querySelector('#seats');
    const controlPanel = component.shadowRoot.querySelector('.control-panel');

    expect(gameInfo).toBeTruthy();
    expect(dealerSlot).toBeTruthy();
    expect(seats).toBeTruthy();
    expect(controlPanel).toBeTruthy();

    const connectingOverlay = component.shadowRoot.querySelector('.connecting-overlay');
    expect(connectingOverlay).toBeTruthy();
  });
});
