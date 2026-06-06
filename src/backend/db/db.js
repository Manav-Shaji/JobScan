import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const isNextBuild = process.env.NEXT_PHASE === 'phase-production-build';

// Enforce required database variables checks in production at runtime
if (isProduction && !isNextBuild) {
  const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missing = requiredEnv.filter(key => !process.env[key]);

  if (missing.length > 0) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      level: 'fatal',
      service: 'database',
      message: `Missing database environment variables: ${missing.join(', ')}`
    };

    try {
      const logsDir = path.resolve('logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      fs.appendFileSync(
        path.join(logsDir, 'error.log'),
        JSON.stringify(errorEntry) + '\n',
        'utf-8'
      );
    } catch (e) {
      console.error('[Database Setup] Failed to write error log file:', e);
    }

    throw new Error(`FATAL: Missing required PostgreSQL environment variables in production: ${missing.join(', ')}`);
  }
}

let pool;
if (!global.pgPool) {
  global.pgPool = new Pool({
    user: process.env.DB_USER || 'devuser',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'jobscan',
    password: process.env.DB_PASSWORD || 'devpass',
    port: parseInt(process.env.DB_PORT || '5432'),
  });
}
pool = global.pgPool;

export const query = (text, params) => pool.query(text, params);
export { pool };
