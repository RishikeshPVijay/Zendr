import type { Express } from 'express';
import { appConfig } from '../config.js';
import { healthRouter } from './health.js';
import { webRouter } from './web.js';

export function registerRoutes(app: Express): void {
  app.use('/health', healthRouter);

  if (appConfig.nodeEnv === 'production') {
    app.use(webRouter);
  }
}
