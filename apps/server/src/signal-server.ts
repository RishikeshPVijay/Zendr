import express from 'express';
import http from 'node:http';
import { logger } from './logger.js';

export interface SignalServerConfig {
  port: number;
}

export class SignalServer {
  readonly app = express();
  readonly httpServer = http.createServer(this.app);

  constructor(private readonly config: SignalServerConfig) {}

  async start(): Promise<void> {
    if (this.httpServer.listening) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.httpServer.once('error', reject);
      this.httpServer.listen(this.config.port, () => {
        this.httpServer.off('error', reject);

        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    if (!this.httpServer.listening) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
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
