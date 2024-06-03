const template = document.createElement('template');
template.innerHTML = `
  <style>
    .button {
      display: inline-block;
      padding: 1rem 1rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      text-transform: uppercase;
      color: #ffffff;
      background: linear-gradient(to bottom, #4caf50 0%, #45a049 100%);
    }

    .button:hover,
    .button:focus {
      background: linear-gradient(to bottom, #45a049 0%, #4caf50 100%);
    }

    .button:active {
      transform: translateY(1px);
    }

    .button:disabled {
      background-color: #bfbfbf;
      opacity: 0.5;
      pointer-events: none;
      box-shadow: none;
    }
  </style>

  <!-- Initial markup -->
  <button class="button" id="deal">Deal</button>
  <button class="button" id="hit">Hit</button>
  <button class="button" id="stand">Stand</button>
  <button class="button" id="clear-bet">Clear bets</button>
  <button class="button" id="leave">Leave table</button>
`;

export class ControlsComponent extends HTMLElement {
  constructor(gameStore, gameService) {
    super();

    this.gameStore = gameStore;
    this.gameService = gameService;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const [ dealButtonEl, hitButtonEl, standButtonEl, clearBetButtonEl, leaveButtonEl ] =
      this.shadowRoot.querySelectorAll('#deal, #hit, #stand, #clear-bet, #leave');

    dealButtonEl.addEventListener('click', this.deal.bind(this));
    hitButtonEl.addEventListener('click', this.hit.bind(this));
    standButtonEl.addEventListener('click', this.stand.bind(this));
    clearBetButtonEl.addEventListener('click', this.clearBet.bind(this));
    leaveButtonEl.addEventListener('click', this.leave.bind(this));

    this.gameStore.subscribe(this.onStateChange);
  }

  disconnectedCallback() {
    this.gameStore.unsubscribe(this.onStateChange);
  }

  onStateChange = ({ controls }) => {
    const [ dealButtonEl, hitButtonEl, standButtonEl, clearBetButtonEl, leaveButtonEl ] =
      this.shadowRoot.querySelectorAll('#deal, #hit, #stand, #clear-bet, #leave');

    dealButtonEl.disabled = !controls.canDeal;
    hitButtonEl.disabled = !controls.canHit;
    standButtonEl.disabled = !controls.canStand;
    clearBetButtonEl.disabled = !controls.canClearBet;
    leaveButtonEl.disabled = !controls.canLeave;
  }

  deal() {
    this.gameService.deal();
  }

  clearBet() {
    this.gameService.clearBet();
  }

  hit() {
    this.gameService.hit();
  }

  stand() {
    this.gameService.stand();
  }

  leave() {
    this.gameService.leave();
  }
}
