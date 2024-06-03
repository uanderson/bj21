const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
    }

    :host .chip,
    :host .bet-button,
    :host .person {
      display: none;
    }

    .seat {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      position: relative;
      background: rgba(255, 215, 0, 0.6);
    }

    .container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .bet-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 90%;
      height: 90%;
      border: none;
      border-radius: 50%;
      background: linear-gradient(to bottom, #4CAF50 0%, #45a049 100%);
      color: white;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s, box-shadow 0.3s, transform 0.1s;
    }

    .bet-button:hover,
    .bet-button:focus {
      background: linear-gradient(to bottom, #45a049 0%, #4CAF50 100%);
    }

    .status-badge {
      visibility: hidden;
      display: inline-block;
      padding: 10px 15px;
      color: white;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      border-radius: 50px;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
      margin-top: 1rem;
    }

    img {
      width: 1.5rem;
    }

    bj21-hand {
      margin-bottom: 1rem;
    }
  </style>

  <!-- Initial markup -->
  <div class="container">
    <bj21-hand></bj21-hand>

    <div class="seat">
      <bj21-chip class="chip" value="5"></bj21-chip>
      <img class="person" src="/person.svg">
      <img class="locked" src="/locked.svg">
      <button type="button" class="bet-button" id="bet-button">
        Place Bet
      </button>
    </div>

    <div class="status-badge" id="status-badge">
      Blackjack
    </div>
  </div>
`;

export class SeatComponent extends HTMLElement {
  constructor(gameStore, gameService) {
    super();

    this.gameStore = gameStore;
    this.gameService = gameService;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
    this.renderStatusBadge();

    this.gameStore.subscribe(this.onStateChange);
  }

  disconnectedCallback() {
    this.gameStore.unsubscribe(this.onStateChange);
  }

  render() {
    this.shadowRoot.querySelector('#bet-button').addEventListener('click', this.handleBet.bind(this));
    const handEl = this.shadowRoot.querySelector('bj21-hand');
    handEl.innerHTML = ``;

    this.seat.player?.cards.forEach(card => {
      const cardEl = document.createElement('bj21-card');
      cardEl.setAttribute('suit', card.suit);
      cardEl.setAttribute('rank', card.rank);

      handEl.appendChild(cardEl);
      handEl.setAttribute('count', `${this.seat.player.total}`);
    });
  }

  onStateChange = ({ player, game }) => {
    const isMySeat = player && player?.id === this.seat.player?.id;
    const elements = this.shadowRoot.querySelectorAll('.chip, .person, .locked, .bet-button');
    const [ chip, person, locked, betButton ] = elements;

    elements.forEach(el => el.style.display = 'none');

    if (isMySeat) {
      if (player?.bet > 0) {
        chip.setAttribute('value', player?.bet);
        chip.style.display = 'block';
      }

      if (player?.bet === 0) {
        betButton.style.display = 'block';
      }

      return;
    }

    if (this.seat.isOccupied) {
      person.style.display = 'block';
    } else if (!player && game.state === 'initial') {
      betButton.style.display = 'block';
    } else {
      locked.style.display = 'block';
    }

    this.renderStatusBadge();
  }

  renderStatusBadge() {
    const { game } = this.gameStore.getState();
    const statusBadge = this.shadowRoot.querySelector('#status-badge');
    let statusBadgeText = `None`;

    if (this.seat.player?.isBlackjack) {
      statusBadgeText = 'Blackjack'
    } else if (this.seat.player?.isBust) {
      statusBadgeText = 'Bust'
    } else if (this.seat.player && game.state === 'finished') {
      statusBadgeText = this.getGameResultText(this.seat.player, game.dealer);
    }

    statusBadge.innerText = statusBadgeText;
    statusBadge.style.visibility = statusBadgeText === 'None' ? 'hidden' : 'visible';
  }

  getGameResultText(player, dealer) {
    if (player.isBust) {
      return 'Lose';
    }

    if (dealer.isBust) {
      return 'Win';
    }

    if (player.total > dealer.total) {
      return 'Win';
    }

    if (player.total < dealer.total) {
      return 'Lose';
    }

    return 'Push';
  }

  handleBet() {
    const { chipValue } = this.gameStore.getState();
    const seatPosition = Number(this.getAttribute('position'));

    this.gameService.bet(seatPosition, chipValue);
  }
}
