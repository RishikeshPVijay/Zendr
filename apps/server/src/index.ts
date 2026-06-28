import { appConfig } from './config.js';
import { logger } from './logger.js';
import { registerMiddleware } from './middleware.js';
import { registerRoutes } from './routes/index.js';
import { SignalServer } from './signal-server.js';

async function main(): Promise<void> {
  const signalServer = new SignalServer({ port: appConfig.port });

  registerMiddleware(signalServer.app);
  registerRoutes(signalServer.app);

  try {
    await signalServer.start();
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
