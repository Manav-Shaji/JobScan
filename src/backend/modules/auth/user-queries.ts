import 'server-only';

export const CHECK_USER_EXISTS = `
  SELECT id FROM users WHERE email = $1
`;

export const INSERT_USER = `
  INSERT INTO users (email, name, password_hash) 
  VALUES ($1, $2, $3) 
  RETURNING id, email, name
`;

export const UPDATE_USER_NAME_EMAIL = `
  UPDATE users SET name = $1, email = $2 WHERE id = $3
`;

export const UPDATE_USER_NAME = `
  UPDATE users SET name = $1 WHERE id = $2
`;

export const UPDATE_USER_PASSWORD = `
  UPDATE users SET password_hash = $1 WHERE id = $2
`;

export const GET_USER_STATS = `
  SELECT 
    COUNT(*) as total_scans, 
    COUNT(*) FILTER (WHERE risk_level = 'CRITICAL' OR trust_score < 45) as scams_detected, 
    AVG(trust_score) as avg_trust_score 
  FROM job_scans 
  WHERE user_id = $1
`;

export const GET_USER_HISTORY = `
  SELECT id, content, trust_score, risk_level, created_at 
  FROM job_scans 
  WHERE user_id = $1 
  ORDER BY created_at DESC 
  LIMIT $2 OFFSET $3
`;

export const UPDATE_RETENTION_DAYS = `
  UPDATE users SET retention_days = $1 WHERE id = $2
`;

export const DELETE_USER_SCANS = `
  DELETE FROM job_scans WHERE user_id = $1
`;

export const DELETE_USER = `
  DELETE FROM users WHERE id = $1
`;

export const CREDENTIALS_LOOKUP = `
  SELECT id, email, name, password_hash 
  FROM users 
  WHERE email = $1
`;
