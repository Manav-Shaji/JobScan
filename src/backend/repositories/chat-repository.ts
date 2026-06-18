import 'server-only';
import crypto from 'crypto';
import { query } from '@/backend/db/db';
import { logger } from '@/backend/logging/logger';
import { GET_CHAT_HISTORY, INSERT_CHAT_MESSAGE } from './chat-queries';

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
