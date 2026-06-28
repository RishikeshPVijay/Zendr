interface AppConfig {
  nodeEnv: 'development' | 'production';
  port: number;
  logLevel: string | undefined;
}

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error('Invalid PORT');
}

export const appConfig: AppConfig = {
  nodeEnv: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  port,
  logLevel: process.env.LOG_LEVEL,
};
