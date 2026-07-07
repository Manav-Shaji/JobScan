import 'server-only';
import { query } from '@/core/db/client';

const CHECK_USER_EXISTS = `
  SELECT id FROM users WHERE email = $1
`;

const INSERT_USER = `
  INSERT INTO users (email, name, password_hash) 
  VALUES ($1, $2, $3) 
  RETURNING id, email, name
`;

const UPDATE_USER_NAME_EMAIL = `
  UPDATE users SET name = $1, email = $2 WHERE id = $3
`;

const UPDATE_USER_NAME = `
  UPDATE users SET name = $1 WHERE id = $2
`;

const UPDATE_USER_PASSWORD = `
  UPDATE users SET password_hash = $1 WHERE id = $2
`;

const GET_USER_STATS = `
  SELECT 
    COUNT(*) as total_scans, 
    COUNT(*) FILTER (WHERE risk_level = 'CRITICAL' OR trust_score < 45) as scams_detected, 
    AVG(trust_score) as avg_trust_score 
  FROM job_scans 
  WHERE user_id = $1
`;

const GET_USER_HISTORY = `
  SELECT id, content, trust_score, risk_level, created_at 
  FROM job_scans 
  WHERE user_id = $1 
  ORDER BY created_at DESC 
  LIMIT $2 OFFSET $3
`;

const UPDATE_RETENTION_DAYS = `
  UPDATE users SET retention_days = $1 WHERE id = $2
`;

const DELETE_USER_SCANS = `
  DELETE FROM job_scans WHERE user_id = $1
`;

const DELETE_USER = `
  DELETE FROM users WHERE id = $1
`;

const CREDENTIALS_LOOKUP = `
  SELECT id, email, name, password_hash 
  FROM users 
  WHERE email = $1
`;

const GET_USER_PASSWORD_HASH = `
  SELECT password_hash FROM users WHERE id = $1
`;

// Repository access functions
export async function findUserByEmail(email: string, client: any = query) {
  const res = await client.query(CHECK_USER_EXISTS, [email]);
  return res.rows;
}

export async function findPasswordHashById(userId: string) {
  const res = await query(GET_USER_PASSWORD_HASH, [userId]);
  return res.rows[0]?.password_hash;
}

export async function createUser(email: string, name: string, passwordHash: string, client: any = query) {
  const res = await client.query(INSERT_USER, [email, name, passwordHash]);
  return res.rows[0];
}

export async function updateUserNameAndEmail(userId: string, name: string, email?: string) {
  if (email) {
    await query(UPDATE_USER_NAME_EMAIL, [name, email, userId]);
  } else {
    await query(UPDATE_USER_NAME, [name, userId]);
  }
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  await query(UPDATE_USER_PASSWORD, [passwordHash, userId]);
}

export async function fetchUserStats(userId: string) {
  const res = await query(GET_USER_STATS, [userId]);
  return res.rows[0];
}

export async function fetchUserHistory(userId: string, limit: number, offset: number) {
  const res = await query(GET_USER_HISTORY, [userId, limit, offset]);
  return res.rows;
}

export async function updateUserRetentionDays(userId: string, days: number) {
  await query(UPDATE_RETENTION_DAYS, [days, userId]);
}

export async function deleteUserAccount(userId: string) {
  await query(DELETE_USER, [userId]);
}
