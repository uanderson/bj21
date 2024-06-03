import { registerCustomElement } from '../utils/elements.js';
import { HandComponent } from './hand.js';

describe('HandComponent', () => {
  let component;

  beforeAll(() => {
    registerCustomElement('bj21-hand', HandComponent, []);
  });

  beforeEach(() => {
    component = document.createElement('bj21-hand');
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.remove();
  });

  it('correctly handles slot change', () => {
    const card1 = document.createElement('bj21-card');
    const card2 = document.createElement('bj21-card');
    component.appendChild(card1);
    component.appendChild(card2);

    const slot = component.shadowRoot.querySelector('slot');
    expect(slot.assignedNodes().length).toBe(2);
  });
});
