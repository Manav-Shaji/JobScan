import { query } from '@/core/db/client';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  try {
    const result = await query('SELECT id, email, password_hash, length(password_hash) as len FROM users WHERE email = $1', ['john007@gmail.com']);
    const user = result.rows[0];

    let hashSha256 = null;
    if (user && user.password_hash) {
      hashSha256 = crypto.createHash('sha256').update(user.password_hash).digest('hex');
    }
    
    return NextResponse.json({
      dbResult: user ? {
        id: user.id,
        email: user.email,
        hashLength: user.len,
        hashPrefix: user.password_hash ? user.password_hash.substring(0, 4) : null,
        hashSha256: hashSha256
      } : null
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
