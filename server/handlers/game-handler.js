import { body } from 'express-validator';
import { validateWithRequiredHeaders } from '../utils/validation.js';

export class GameHandler {
  constructor(app, game, sse) {
    this.app = app;
    this.game = game;
    this.sse = sse;
  }

  serve() {
    this.app.post('/api/bet',
      validateWithRequiredHeaders(
        body('amount').isNumeric(),
        body('seat').isNumeric()
      ),
      this.bet.bind(this));

    this.app.post('/api/deal', validateWithRequiredHeaders(), this.deal.bind(this));
    this.app.post('/api/leave', validateWithRequiredHeaders(), this.leave.bind(this));
    this.app.post('/api/clear-bet', validateWithRequiredHeaders(), this.clearBet.bind(this));
    this.app.post('/api/hit', validateWithRequiredHeaders(), this.hit.bind(this));
    this.app.post('/api/stand', validateWithRequiredHeaders(), this.stand.bind(this));

    this.listenToEvents();
  }

  listenToEvents() {
    this.game.whenStateIs('initial', () => this.sse.notify());
  }

  deal(req, res) {
    const playerId = this.getPlayerId(req);

    this.game.deal(playerId);
    this.sse.notify();

    res.status(204).send();
  }

  leave(req, res) {
    const playerId = this.getPlayerId(req);

    this.game.removePlayer(playerId);
    this.sse.notify();

    res.status(204).send();
  }

  bet(req, res) {
    const playerId = this.getPlayerId(req);
    const { amount, seat } = req.body;

    this.game.placeBet(playerId, Number(seat), Number(amount));

    setTimeout(() => this.sse.notify());

    res.status(204).send();
  }

  clearBet(req, res) {
    const playerId = this.getPlayerId(req);

    this.game.clearBet(playerId);
    this.sse.notify();

    res.status(204).send();
  }

  hit(req, res) {
    const playerId = this.getPlayerId(req);

    this.game.hit(playerId);
    this.sse.notify();

    res.status(204).send();
  }

  stand(req, res) {
    const playerId = this.getPlayerId(req);

    this.game.stand(playerId);
    this.sse.notify();

    res.status(204).send();
  }

  getPlayerId(req) {
    return req.headers['x-player-id'];
  }
}
