import { cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const webDist = path.resolve(__dirname, '../../web/dist');
const serverWeb = path.resolve(__dirname, '../dist/web');

try {
  await cp(webDist, serverWeb, { recursive: true, force: true });
} catch (err) {
  if (err && typeof err === 'object' && 'code' in err && err.code === 'ENOENT') {
    throw new Error('Web application not found. Build @zendr/web before building @zendr/server.', {
      cause: err,
    });
  }

  throw err;
}
