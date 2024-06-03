const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    .chip {
      display: flex;
      justify-content: center;
      align-items: center;
      width: var(--width, 3.75rem);
      height: var(--height, 3.75rem);
      background-size: cover;
    }
  </style>

  <!-- Initial markup -->
  <div class="chip" id="chip"></div>
`;

export class ChipComponent extends HTMLElement {
  static get observedAttributes() {
    return [ 'value' ];
  }

  get value() {
    return this.getAttribute('value');
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const chipValue = this.getAttribute('value');

    const chipEl = this.shadowRoot.querySelector('#chip');
    chipEl.style.background = `url(/chips/${chipValue}.svg)`;
    chipEl.innerText = `${chipValue}`;
  }
}
