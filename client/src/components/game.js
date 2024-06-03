const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      color: #ffffff;
      position: relative;
      width: 100%;
      height: 50rem;
      min-height: 50rem;
      padding: 2rem;
      background: radial-gradient(circle, #006400, #004d00);
      background-blend-mode: multiply;
      background-size: cover;
      border-radius: 0.5rem;
      box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.3);
    }

    :host(.connected) .connecting-overlay {
      display: none;
    }

    :host(:not(.connected)) .connecting-overlay {
      display: flex;
    }

    .connecting-overlay {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border-radius: 0.5rem;
      background-color: rgba(0, 0, 0, 0.6);
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(0.5rem);
    }

    .connecting-overlay .connecting-message {
      color: white;
      font-size: 1.5rem;
    }

    .top-row {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

     .game-info,
    .rule-info {
      width: 250px;
      max-width: 250px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: absolute;
      top: 0;
    }

    .rule-info {
      right: 0;
    }

    .game-info {
      left: 0;
    }

    .info-box {
      background-color: #004d00;
      color: white;
      font-size: 1.125rem;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.3);
    }

    .info-box p {
      margin: 0 0;
    }

    .info-box .highlight {
      color: #ffd700;
    }

    .seats {
      display: flex;
      box-sizing: border-box;
      justify-content: space-between;
      width: 100%;
      margin: 0 0 3rem;
    }

    .control-panel {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: rgba(0, 0, 0, 0.3);
      padding: 1rem;
      border-radius: 0.5rem;
    }
  </style>

  <!-- Initial markup -->
  <div class="connecting-overlay">
    <span class="connecting-message">
      Connecting ...
    </span>
  </div>

  <div class="top-row">
    <div class="rule-info">
      <div class="info-box">
        <p>All seated users need to click deal to start a game</p>
      </div>
      <div class="info-box">
        <p>User with negative balance will be in debt with the "casino" 🔥</p>
      </div>
    </div>

    <div class="game-info">
      <div class="info-box">
        <p>Blackjack pays <span class="highlight">3 to 2</span></p>
        <p>Dealer stands on 17</p>
      </div>

      <div class="info-box">
        <p>Balance</p>
        <p><span class="highlight" id="balance"></span></p>
      </div>
    </div>

    <slot name="dealer"></slot>
  </div>

  <div class="bottom-row">
    <div class="seats" id="seats"></div>
    <div class="control-panel">
      <slot name="chips" ></slot>
      <slot name="controls"></slot>
    </div>
  </div>
`;

export class GameComponent extends HTMLElement {
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
    this.gameStore.unsubscribe(this.onStateChange);
  }

  onStateChange = (state) => {
    this.assignStateClass(state);
    this.renderSeats(state);
    this.renderBalance(state);

    this.shadowRoot.host.classList.toggle('connected', state.connected);
  }

  assignStateClass({ game }) {
    const classList = this.shadowRoot.host.classList;
    const stateClassPrefix = 'state-';

    classList.forEach((className) => {
      if (className.startsWith(stateClassPrefix)) {
        classList.remove(className);
      }
    });

    classList.add(`${stateClassPrefix}${game.state}`);
  }

  renderSeats({ game }) {
    const seatsEl = this.shadowRoot.querySelector('#seats');
    seatsEl.innerHTML = '';

    game?.seats?.forEach(seat => {
      const seatEl = document.createElement('bj21-seat');
      seatEl.setAttribute('position', `${seat.position}`);
      seatEl.seat = seat;

      seatsEl.appendChild(seatEl);
    });
  }

  renderBalance({ player }) {
    const playerBalance = player?.balance ?? 0.00;

    const balanceEl = this.shadowRoot.querySelector('#balance');
    balanceEl.innerText = new Intl.NumberFormat().format(playerBalance);
  }
}
