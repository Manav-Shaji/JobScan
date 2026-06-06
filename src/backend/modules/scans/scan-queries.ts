import 'server-only';

export const FIND_CACHED_SCAN = `
  SELECT s.*, 
         (SELECT COALESCE(COUNT(*), 0) FROM scam_reports WHERE scan_id = s.id) AS community_reports
  FROM job_scans s
  WHERE s.content_hash = $1 AND s.created_at > NOW() - INTERVAL '24 hours'
  LIMIT 1
`;

export const INSERT_SCAN_RESULT = `
  INSERT INTO job_scans (
    id, user_id, content, content_hash, scan_type, trust_score, risk_level,
    pattern_name, pattern_confidence, poster_url, poster_text, red_flags, positive_signals, analysis
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *
`;
