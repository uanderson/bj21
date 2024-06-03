import { registerCustomElement } from '../utils/elements.js';
import { ChipsComponent } from './chips.js';
import { AVAILABLE_CHIP_VALUES } from './chips.const.js';

describe('ChipsComponent', () => {
  let component;
  let gameStoreMock = {};

  beforeAll(() => {
    registerCustomElement('bj21-chips', ChipsComponent, [gameStoreMock]);
  });

  beforeEach(() => {
    gameStoreMock.subscribe = vi.fn();
    gameStoreMock.unsubscribe = vi.fn();
    gameStoreMock.setState = vi.fn();

    component = document.createElement('bj21-chips');
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.remove();
  });

  it('renders chips correctly', () => {
    const chipElements = component.shadowRoot.querySelectorAll('bj21-chip');
    expect(chipElements.length).toBe(AVAILABLE_CHIP_VALUES.length);

    chipElements.forEach((chipEl, index) => {
      expect(chipEl.getAttribute('value')).toBe(`${AVAILABLE_CHIP_VALUES[index]}`);
    });
  });

  it('updates chip selection on state change', () => {
    const chipValue = AVAILABLE_CHIP_VALUES[1];
    component.onStateChange({ chipValue });

    const selectedChip = component.shadowRoot.querySelector('bj21-chip.selected');
    expect(selectedChip.getAttribute('value')).toBe(`${chipValue}`);
  });
});
