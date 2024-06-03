import { CardComponent } from './components/card.js';
import { ChipComponent } from './components/chip.js';

import { ChipsComponent } from './components/chips.js';
import { ControlsComponent } from './components/controls.js';
import { DealerComponent } from './components/dealer.js';
import { GameComponent } from './components/game.js';
import { HandComponent } from './components/hand.js';
import { SeatComponent } from './components/seat.js';
import { GameService } from './services/game-service.js';
import { SSEListener } from './services/sse-listener.js';
import { GameStore } from './store/game-store.js';
import { registerCustomElement } from './utils/elements.js';
import { acquirePlayerId } from './utils/player.js';

const gameStore = new GameStore();
const gameService = new GameService(acquirePlayerId());

// Register all custom elements
registerCustomElement('bj21-card', CardComponent, []);
registerCustomElement('bj21-chip', ChipComponent, []);
registerCustomElement('bj21-chips', ChipsComponent, [ gameStore ]);
registerCustomElement('bj21-controls', ControlsComponent, [ gameStore, gameService ]);
registerCustomElement('bj21-dealer', DealerComponent, [ gameStore ]);
registerCustomElement('bj21-game', GameComponent, [ gameStore ]);
registerCustomElement('bj21-hand', HandComponent, [ gameStore ]);
registerCustomElement('bj21-seat', SeatComponent, [ gameStore, gameService ]);

// Start listening for SSE events
const sseListener = new SSEListener(gameStore);
sseListener.listen('/sse');

gameStore.subscribe(({ isReady }) => {
  if (!isReady) {
    return;
  }

  const gameEl = document.querySelector('#game');
  gameEl.innerHTML = `
    <bj21-game>
      <bj21-dealer slot="dealer"></bj21-dealer>
      <bj21-controls slot="controls"></bj21-controls>
      <bj21-chips slot="chips"></bj21-chips>
    </bj21-game>
  `;
});
