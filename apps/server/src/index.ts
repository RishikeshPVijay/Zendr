import { appConfig } from './config.js';
import { DiscoveryHandler } from './discovery/discovery-handler.js';
import { logger } from './logger.js';
import { MessageRouter } from './messaging/message-router.js';
import { registerMiddleware } from './middleware.js';
import { PeerRegistry } from './peer/peer-registry.js';
import { registerRoutes } from './routes/index.js';
import { SignalServer } from './signal-server.js';
import { SignalWebSocketServer } from './signal-websocket-server.js';
import { WebSocketSessionRegistry } from './websocket/websocket-session-registry.js';

async function main(): Promise<void> {
  const signalServer = new SignalServer({ port: appConfig.port });

  registerMiddleware(signalServer.app);
  registerRoutes(signalServer.app);

  const sessionRegistry = new WebSocketSessionRegistry();
  const peerRegistry = new PeerRegistry();
  const discoveryHandler = new DiscoveryHandler(peerRegistry);
  const messageRouter = new MessageRouter([discoveryHandler]);

  const signalWebSocketServer = new SignalWebSocketServer(
    signalServer.httpServer,
    sessionRegistry,
    messageRouter,
    [discoveryHandler],
  );

  try {
    await signalServer.start();
    logger.info({ port: appConfig.port, transports: ['websocket'] }, 'Signal server started');
  } catch (err) {
    logger.fatal({ err }, 'Failed to start signal server');
    process.exitCode = 1;
    return;
  }

  let isShuttingDown = false;

  async function shutdown(signal: NodeJS.Signals): Promise<void> {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;

    logger.info({ signal }, 'Shutting down');

    try {
      await signalWebSocketServer.stop();
    } catch (err) {
      logger.error({ err }, 'Failed to stop web socket server');
    }

    try {
      await signalServer.stop();

      logger.info('Shutdown complete');

      process.exitCode = 0;
    } catch (err) {
      logger.error({ err }, 'Failed to stop signal server');
      process.exitCode = 1;
    }
  }

  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('uncaughtException', async (error, origin) => {
    logger.fatal({ err: error, origin }, 'Uncaught exception');
    await shutdown('SIGTERM');
  });

  process.on('unhandledRejection', async (reason, promise) => {
    logger.fatal({ reason, promise }, 'Unhandled promise rejection');
    await shutdown('SIGTERM');
  });
}

void main();
