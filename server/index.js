import cors from 'cors';
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { GameHandler } from './handlers/game-handler.js';
import { SSEHandler } from './handlers/sse-handler.js';
import { errorHandlerMiddleware } from './middleware/error-handler.js';
import { Dealer } from './models/dealer.js';
import { Deck } from './models/deck.js';
import { Game } from './models/game.js';

const app = express();
const PORT = process.env.PORT || 8021;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json())

// Game objects
const deck = new Deck();
const dealer = new Dealer(deck);
const game = new Game(dealer);

// Handlers
const sseHandler = new SSEHandler(app, game);
const gameHandler = new GameHandler(app, game, sseHandler);

sseHandler.serve();
gameHandler.serve();

// Centralized error handling
app.use(errorHandlerMiddleware);

// Start listening
app.listen(PORT, () => console.log(`Server is running on ::${PORT}`));
