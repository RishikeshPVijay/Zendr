import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface AppConfig {
  nodeEnv: 'development' | 'production';
  port: number;
  logLevel: string | undefined;
  webRoot: string;
}

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error('Invalid PORT');
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const appConfig: AppConfig = {
  nodeEnv: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  port,
  logLevel: process.env.LOG_LEVEL,
  webRoot: path.resolve(__dirname, 'web'),
};
