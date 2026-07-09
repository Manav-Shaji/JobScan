import { query, pool } from '@/core/db/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await query('SELECT id, email, password_hash, length(password_hash) as len FROM users WHERE email = $1', ['john007@gmail.com']);
    const user = result.rows[0];
    
    // Inspect global.pgPool if it exists
    const poolOptions = global.pgPool ? {
      host: global.pgPool.options?.host,
      database: global.pgPool.options?.database,
      user: global.pgPool.options?.user,
      port: global.pgPool.options?.port,
    } : null;

    return NextResponse.json({
      env: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
      },
      pool: poolOptions,
      dbResult: user ? {
        id: user.id,
        email: user.email,
        hashLength: user.len,
        hashPrefix: user.password_hash ? user.password_hash.substring(0, 4) : null
      } : null
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
