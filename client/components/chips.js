import { AVAILABLE_CHIP_VALUES } from './chips.const.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    .chips {
      display: flex;
      gap: 1rem;
    }

    bj21-chip.selected {
      transform: scale(1.2);
    }

    bj21-chip:not(.selected):hover {
      transform: scale(1.1);
    }
  </style>

  <!-- Initial markup -->
  <div class="chips"></div>
`;

export class ChipsComponent extends HTMLElement {
  constructor(gameStore) {
    super();

    this.gameStore = gameStore;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
    this.listenEvents();

    this.gameStore.subscribe(this.onStateChange);
  }

  disconnectedCallback() {
    this.gameStore.unsubscribe(this.onStateChange);
  }

  listenEvents() {
    const chipsEl = this.shadowRoot.querySelector('.chips');
    chipsEl.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(event) {
    this.gameStore.setState({ chipValue: Number(event.target.value) });
  }

  onStateChange = ({ chipValue }) => {
    const selectedChipEl = this.shadowRoot.querySelector('bj21-chip.selected');
    const targetChipEl = this.shadowRoot.querySelector(`bj21-chip[value="${chipValue}"]`);

    selectedChipEl?.classList.remove('selected')
    targetChipEl?.classList.add('selected');
  }

  render() {
    const chipsEl = this.shadowRoot.querySelector('.chips');

    AVAILABLE_CHIP_VALUES.forEach(chip => {
      const chipEl = document.createElement('bj21-chip');
      chipEl.setAttribute('value', `${chip}`);
      chipsEl.append(chipEl);
    });
  }
}
