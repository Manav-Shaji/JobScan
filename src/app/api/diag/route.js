import { query } from '@/core/db/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const email = 'john007@gmail.com';
    const password = '@john#007';

    // Generate new hash
    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(password, salt);

    // Update the database
    const updateResult = await query('UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email', [newHash, email]);
    const updatedUser = updateResult.rows[0];

    // Verify the update
    const verifyResult = await query('SELECT password_hash FROM users WHERE email = $1', [email]);
    const verifiedUser = verifyResult.rows[0];
    const isValid = verifiedUser ? await bcrypt.compare(password, verifiedUser.password_hash) : false;

    return NextResponse.json({
      email,
      updated: !!updatedUser,
      verifiedMatchesNewHash: isValid,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
