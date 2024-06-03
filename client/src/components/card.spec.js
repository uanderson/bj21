import { registerCustomElement } from '../utils/elements.js';
import { CardComponent } from './card';

describe('CardComponent', () => {
  let component;

  beforeAll(() => {
    registerCustomElement('bj21-card', CardComponent, []);
  });

  beforeEach(() => {
    component = document.createElement('bj21-card');
  });

  it('should initialize with the default template', () => {
    const img = component.shadowRoot.querySelector('img');
    expect(img).toBeTruthy();
  });

  it('should update the img src when rank and suit attributes change', () => {
    component.setAttribute('rank', '10');
    component.setAttribute('suit', 'hearts');

    const img = component.shadowRoot.querySelector('img');
    expect(img.src).toContain('/cards/hearts-10.svg');
  });

  it('should only update img src when attributes actually change', () => {
    component.setAttribute('rank', '5');
    component.setAttribute('suit', 'diamonds');

    const img = component.shadowRoot.querySelector('img');
    const initialSrc = img.src;

    component.setAttribute('rank', '5');
    component.setAttribute('suit', 'diamonds');
    expect(img.src).toBe(initialSrc);

    component.setAttribute('rank', '7');
    expect(img.src).toContain('/cards/diamonds-7.svg');
  });

  it('should display face-hidden card when face-hidden attribute is true', () => {
    component.setAttribute('face-hidden', 'true');

    const img = component.shadowRoot.querySelector('img');
    expect(img.src).toContain('/cards/face-hidden.svg');
  });

  it('should display normal card when face-hidden attribute is false', () => {
    component.setAttribute('rank', '10');
    component.setAttribute('suit', 'hearts');
    component.setAttribute('face-hidden', 'false');

    const img = component.shadowRoot.querySelector('img');
    expect(img.src).toContain('/cards/hearts-10.svg');
  });
});
