const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    .dealer {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    h1 {
      margin-top: 0;
    }
  </style>

  <!-- Initial markup -->
  <div class="dealer">
    <h1>DEALER</h1>
    <bj21-hand id="hand"></bj21-hand>
  </div>
`;

export class DealerComponent extends HTMLElement {
  constructor(gameStore) {
    super();

    this.gameStore = gameStore;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.gameStore.subscribe(this.onStateChange);
  }

  disconnectedCallback() {
    this.gameStore.unsubscribe(this.onStateChange)
  }

  onStateChange = ({ game }) => {
    const handEl = this.shadowRoot.querySelector('#hand');
    handEl.setAttribute('count', `${game.dealer.total}`);
    handEl.setAttribute('count-hidden', `${game.state !== 'finished'}`);
    handEl.innerHTML = ``;

    game.dealer.cards.forEach((card, index) => {
      const cardEl = document.createElement('bj21-card');
      cardEl.setAttribute('suit', card.suit);
      cardEl.setAttribute('rank', card.rank);

      if (index === 0 && game.state !== 'finished') {
        cardEl.setAttribute('face-hidden', 'true');
      }

      handEl.appendChild(cardEl);
    });
  }
}
