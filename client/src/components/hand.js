const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: auto;
    }

    :host(.no-slotted-cards) .badge,
    :host(.count-hidden) .badge {
      display: none;
    }

    ::slotted(bj21-card) {
      position: absolute;
    }

    .container,
    .card-deck {
      position: relative;
    }

    .card {
      position: absolute;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      transition: transform 0.3s, z-index 0.3s;
    }

    .badge {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      position: absolute;
      bottom: -1rem;
      left: -1rem;
      margin-top: 0.5rem;
      width: 2rem;
      height: 2rem;
      background: #4CAF50;
      z-index: 20;
    }

    .dealer {
      width: 80px;
      height: 120px;
      position: relative;
    }
  </style>

  <!-- Initial markup -->
  <div class="container">
    <div class="badge" id="badge">0</div>
    <div class="dealer">
      <slot></slot>
    </div>
  </div>
`;

export class HandComponent extends HTMLElement {
  static get observedAttributes() {
    return [ 'count-hidden', 'count' ];
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
    this.listenSlotChanges();
  }

  listenSlotChanges() {
    const slot = this.shadowRoot.querySelector('slot');
    this.checkAssignedNodes(slot);

    slot.addEventListener('slotchange', () => {
      this.checkAssignedNodes(slot);

      const nodes = slot.assignedNodes();
      const cards = nodes.filter(node => node.nodeType === Node.ELEMENT_NODE);

      if (!nodes.length === 0) {
        this.setAttribute('count-hidden', 'false');
      }

      let middleIndex = Math.floor(cards.length / 2);

      if (cards.length % 2 === 0) {
        middleIndex -= 0.5;
      }

      cards.forEach((card, index) => {
        const shift = (index - middleIndex) * 20;
        card.style.left = `${shift}px`;
      });
    });
  }

  checkAssignedNodes(slot) {
    const assignedNodes = slot.assignedNodes();

    this.shadowRoot.host.classList.toggle('no-slotted-cards', assignedNodes.length === 0);
  }

  render() {
    this.shadowRoot.host.classList.toggle('count-hidden', this.getAttribute('count-hidden') === 'true');
    this.shadowRoot.querySelector('#badge').innerText = this.getAttribute('count');
  }
}
