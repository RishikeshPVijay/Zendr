import express, { Router } from 'express';
import path from 'node:path';
import { appConfig } from '../config.js';

export const webRouter = Router();

const webIndexHtml = path.join(appConfig.webRoot, 'index.html');

webRouter.use(express.static(appConfig.webRoot));

webRouter.use((_, res) => {
  res.sendFile(webIndexHtml);
});
