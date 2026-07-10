import type { Server } from 'node:http';
import { WebSocketServer } from 'ws';
import { logger } from './logger.js';
import { DisconnectHandler } from './messaging/disconnect-handler.js';
import { MessageRouter } from './messaging/message-router.js';
import { ProtocolError } from './messaging/protocol-error.js';
import { WebSocketCloseCode } from './websocket/websocket-close-code.js';
import { WebSocketSessionRegistry } from './websocket/websocket-session-registry.js';
import { WebSocketSession } from './websocket/websocket-session.js';

export class SignalWebSocketServer {
  readonly wsServer: WebSocketServer;

  constructor(
    private readonly httpServer: Server,
    private readonly sessionRegistry: WebSocketSessionRegistry,
    private readonly messageRouter: MessageRouter,
    private readonly disconnectHandlers: readonly DisconnectHandler[],
  ) {
    this.wsServer = new WebSocketServer({ server: this.httpServer });
    this.registerEvents();
  }

  private registerEvents(): void {
    this.wsServer.on('connection', (ws) => {
      const session = new WebSocketSession(ws);
      this.sessionRegistry.add(session);

      ws.on('message', (data) => {
        try {
          this.messageRouter.route(session, data);
        } catch (err) {
          logger.error({ err }, 'Websocket message handling failed');

          if (err instanceof ProtocolError) {
            session.close(WebSocketCloseCode.PROTOCOL_ERROR, err.message);
            return;
          }

          session.close(WebSocketCloseCode.INTERNAL_ERROR, 'Internal server error');
        }
      });

      ws.on('close', () => {
        logger.info({ sessionId: session.id }, 'WS connection closed');

        this.sessionRegistry.remove(session.id);

        for (const handler of this.disconnectHandlers) {
          try {
            handler.onDisconnect(session);
          } catch (err) {
            logger.error({ err }, 'Websocket disconnect lifecycle failed');
          }
        }
      });

      ws.on('error', (err) => {
        logger.error({ err });
      });
    });
  }

  async stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.wsServer.close((err) => {
        if (err) {
          reject(err);
          return;
        }

        logger.info('Websocket server stopped');
        resolve();
      });

      for (const client of this.wsServer.clients) {
        client.close(WebSocketCloseCode.GOING_AWAY, 'Server shutting down');
      }
    });
  }
}
