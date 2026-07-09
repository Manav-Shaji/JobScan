import { query } from '@/core/db/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const result = await query('SELECT id, email, password_hash FROM users WHERE email = $1', ['john007@gmail.com']);
    const user = result.rows[0];

    let isValid = false;
    if (user && user.password_hash) {
      isValid = await bcrypt.compare('@john#007', user.password_hash);
    }
    
    return NextResponse.json({
      email: 'john007@gmail.com',
      userFound: !!user,
      passwordMatchesHashInProd: isValid,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
