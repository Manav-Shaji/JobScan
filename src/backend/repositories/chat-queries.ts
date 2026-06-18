import 'server-only';

export const GET_CHAT_HISTORY = `
  SELECT role, content, created_at 
  FROM chat_messages 
  WHERE user_id = $1 
  ORDER BY created_at ASC
`;

export const INSERT_CHAT_MESSAGE = `
  INSERT INTO chat_messages (id, user_id, role, content) 
  VALUES ($1, $2, $3, $4)
  RETURNING *
`;
