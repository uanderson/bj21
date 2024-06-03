import { validateWithRequiredParams } from '../utils/validation.js';

export class SSEHandler {
  constructor(app, game) {
    this.app = app;
    this.game = game;
    this.playerSessions = {};
  }

  /**
   * Sets up a Server-Sent Events (SSE) endpoint at '/sse'. This endpoint is used to push updates to the client.
   * The endpoint validates the incoming request with required parameters.
   */
  serve() {
    this.app.get('/sse', validateWithRequiredParams(), (req, res) => {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const { playerId } = req.query;

      this.storeConnection(playerId, res);
      this.notify();
    });
  }

  storeConnection(sessionId, res) {
    this.playerSessions[sessionId] = res;

    res.on('close', () => {
      delete this.playerSessions[sessionId];
    });
  }

  notify() {
    for (const [ _, client ] of Object.entries(this.playerSessions)) {
      const state = this.game.getState()

      client.write(`id: ${Date.now()}\n`)
      client.write(`data: ${JSON.stringify(state)}\n\n`);
    }
  }
}
