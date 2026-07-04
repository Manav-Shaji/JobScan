import 'server-only';
import crypto from 'crypto';
import { query } from '@/database/connection/db';
import { logger } from '@/backend/logging/logger';
const GET_CHAT_HISTORY = `
  SELECT role, content, created_at 
  FROM chat_messages 
  WHERE user_id = $1 
  ORDER BY created_at ASC
`;

const INSERT_CHAT_MESSAGE = `
  INSERT INTO chat_messages (id, user_id, role, content) 
  VALUES ($1, $2, $3, $4)
  RETURNING *
`;

export async function getChatHistory(userId: string) {
  try {
    const res = await query(GET_CHAT_HISTORY, [userId]);
    return res.rows;
  } catch (error) {
    logger.error('Database error in getChatHistory', error, { userId });
    throw error;
  }
}

export async function saveChatMessage(userId: string, role: string, content: string) {
  try {
    const id = crypto.randomUUID();
    const res = await query(INSERT_CHAT_MESSAGE, [id, userId, role, content]);
    return res.rows[0];
  } catch (error) {
    logger.error('Database error in saveChatMessage', error, { userId, role });
    throw error;
  }
}
