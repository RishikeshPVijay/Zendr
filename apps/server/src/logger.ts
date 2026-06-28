import pino, { type LoggerOptions } from 'pino';
import { appConfig } from './config.js';

const options: LoggerOptions = {
  level: appConfig.logLevel ?? 'info',
};

if (appConfig.nodeEnv === 'development') {
  options.transport = { target: 'pino-pretty' };
}

export const logger = pino(options);
