const template = document.createElement('template');
template.innerHTML = `
  <style>
    img {
      width: var(--width, 5rem);
      height: var(--height, auto);
    }
  </style>

  <!-- Initial markup -->
  <img id="image">
`;

export class CardComponent extends HTMLElement {
  static get observedAttributes() {
    return [ 'face-hidden', 'rank', 'suit' ];
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
    const rank = this.getAttribute('rank');
    const suit = this.getAttribute('suit');

    const imageEl = this.shadowRoot.querySelector('#image');
    imageEl.src = this.getAttribute('face-hidden') === 'true'
      ? `/cards/face-hidden.svg`
      : `/cards/${suit}-${rank}.svg`;
  }
}
