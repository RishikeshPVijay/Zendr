import express, { type Express } from 'express';
import http from 'node:http';
import { logger } from './logger.js';

export interface SignalServerConfig {
  port: number;
}

export class SignalServer {
  readonly app: Express;
  readonly httpServer: http.Server;

  constructor(readonly config: SignalServerConfig) {
    this.app = express();
    this.httpServer = http.createServer(this.app);
  }

  async start(): Promise<void> {
    if (this.httpServer.listening) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.httpServer.once('error', reject);
      this.httpServer.listen(this.config.port, () => {
        this.httpServer.off('error', reject);

        logger.info({ port: this.config.port }, 'Signal server started');

        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    if (!this.httpServer.listening) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.httpServer.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        logger.info('Signal server stopped');
        resolve();
      });
    });
  }
}
