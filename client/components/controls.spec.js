import { registerCustomElement } from '../utils/elements.js';
import { ControlsComponent } from './controls.js';

describe('ControlsComponent', () => {
  let component;
  let gameStoreMock = {};
  let gameServiceMock = {};

  beforeAll(() => {
    registerCustomElement('bj21-controls', ControlsComponent, [ gameStoreMock, gameServiceMock ]);
  });

  beforeEach(() => {
    gameStoreMock.subscribe = vi.fn();
    gameStoreMock.unsubscribe = vi.fn();
    gameStoreMock.setState = vi.fn();

    gameServiceMock.deal = vi.fn();
    gameServiceMock.hit = vi.fn();
    gameServiceMock.stand = vi.fn();
    gameServiceMock.clearBet = vi.fn();
    gameServiceMock.leave = vi.fn();

    component = document.createElement('bj21-controls');
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.remove()
  });

  it('subscribes to gameStore on connectedCallback', () => {
    expect(gameStoreMock.subscribe).toHaveBeenCalled();
  });

  it('unsubscribes from gameStore on disconnectedCallback', () => {
    component.disconnectedCallback();
    expect(gameStoreMock.unsubscribe).toHaveBeenCalled();
  });

  it('updates button states based on game state', () => {
    const controls = {
      canDeal: true,
      canHit: false,
      canStand: true,
      canClearBet: false,
      canLeave: true,
    };

    component.onStateChange({ controls });

    const dealButton = component.shadowRoot.querySelector('#deal');
    const hitButton = component.shadowRoot.querySelector('#hit');
    const standButton = component.shadowRoot.querySelector('#stand');
    const clearBetButton = component.shadowRoot.querySelector('#clear-bet');
    const leaveButton = component.shadowRoot.querySelector('#leave');

    expect(dealButton.disabled).toBeFalsy();
    expect(hitButton.disabled).toBeTruthy();
    expect(standButton.disabled).toBeFalsy();
    expect(clearBetButton.disabled).toBeTruthy();
    expect(leaveButton.disabled).toBeFalsy();
  });

  it('calls gameService methods when buttons are clicked', () => {
    const buttons = component.shadowRoot.querySelectorAll('.button');

    buttons.forEach(button => {
      button.click();
    });

    expect(gameServiceMock.deal).toHaveBeenCalled();
    expect(gameServiceMock.hit).toHaveBeenCalled();
    expect(gameServiceMock.stand).toHaveBeenCalled();
    expect(gameServiceMock.clearBet).toHaveBeenCalled();
    expect(gameServiceMock.leave).toHaveBeenCalled();
  });
});
