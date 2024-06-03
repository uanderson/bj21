import { ChipComponent } from './chip';

describe('ChipComponent', () => {
  let component;

  beforeAll(() => {
    customElements.define('bj21-chip', ChipComponent);
  });

  beforeEach(() => {
    component = document.createElement('bj21-chip');
  });

  it('should initialize with the default template', () => {
    const chip = component.shadowRoot.querySelector('.chip');
    expect(chip).toBeTruthy();
  });

  it('should render with the default template when connected', () => {
    document.body.appendChild(component);
    const chip = component.shadowRoot.querySelector('.chip');
    expect(chip).toBeTruthy();
  });

  it('should update the chip background and text when value attribute is set', () => {
    component.setAttribute('value', '25');
    const chip = component.shadowRoot.querySelector('.chip');
    expect(chip.style.background).toContain('/chips/25.svg');
    expect(chip.innerText).toBe('25');
  });

  it('should not update the chip background and text when value attribute is set to the same value', () => {
    component.setAttribute('value', '100');
    const chip = component.shadowRoot.querySelector('.chip');
    const initialBackground = chip.style.background;
    const initialText = chip.innerText;

    component.setAttribute('value', '100');
    expect(chip.style.background).toBe(initialBackground);
    expect(chip.innerText).toBe(initialText);
  });

  it('should update the chip background and text when value attribute is changed', () => {
    component.setAttribute('value', '100');
    component.setAttribute('value', '500');
    const chip = component.shadowRoot.querySelector('.chip');
    expect(chip.style.background).toContain('/chips/500.svg');
    expect(chip.innerText).toBe('500');
  });
});
