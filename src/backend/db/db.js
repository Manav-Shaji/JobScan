import { Pool } from 'pg';

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

    // Log to console only — Vercel's file system is read-only
    console.error(JSON.stringify(errorEntry));

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
    // SSL required in production (Vercel serverless environment)
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  });
}
pool = global.pgPool;

export const query = (text, params) => pool.query(text, params);
export { pool };
