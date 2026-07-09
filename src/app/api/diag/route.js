import { query } from '@/core/db/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await query('SELECT id, email, password_hash, length(password_hash) as len FROM users WHERE email = $1', ['john007@gmail.com']);
    const user = result.rows[0];
    
    return NextResponse.json({
      env: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
      },
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
