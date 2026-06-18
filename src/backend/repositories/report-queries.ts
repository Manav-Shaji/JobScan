import 'server-only';

export const INSERT_REPORT = `
  INSERT INTO scam_reports (scan_id, reported_by, reason) 
  VALUES ($1, $2, $3) 
  RETURNING *
`;
