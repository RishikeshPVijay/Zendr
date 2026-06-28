import type { Express } from 'express';
import { pinoHttp } from 'pino-http';
import { logger } from './logger.js';

export function registerMiddleware(app: Express): void {
  app.use(pinoHttp({ logger }));
}
