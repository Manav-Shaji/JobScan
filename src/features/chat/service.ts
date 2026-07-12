import 'server-only';
import crypto from 'crypto';
import { z } from 'zod';
import { query } from '@/core/db/client';
import { geminiService } from '@/core/lib/gemini';
import { logger } from '@/core/lib/logger';

// --- Validation ---

export const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({
      text: z.string()
    }))
  })).optional(),
  context: z.any().optional()
});

// --- Repository ---

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

const DELETE_CHAT_HISTORY = `
  DELETE FROM chat_messages 
  WHERE user_id = $1
`;

async function fetchHistory(userId: string) {
  try {
    const res = await query(GET_CHAT_HISTORY, [userId]);
    return res.rows;
  } catch (error) {
    logger.error('Database error in getChatHistory', error, { userId });
    throw error;
  }
}

async function deleteHistory(userId: string) {
  try {
    await query(DELETE_CHAT_HISTORY, [userId]);
    return true;
  } catch (error) {
    logger.error('Database error in deleteHistory', error, { userId });
    throw error;
  }
}

async function saveChatMessage(userId: string, role: string, content: string) {
  try {
    const id = crypto.randomUUID();
    const res = await query(INSERT_CHAT_MESSAGE, [id, userId, role, content]);
    return res.rows[0];
  } catch (error) {
    logger.error('Database error in saveChatMessage', error, { userId, role });
    throw error;
  }
}

// --- Service ---

export async function clearChatHistory(userId: string) {
  logger.logApp('Clearing chat messages history for user', { userId });
  return deleteHistory(userId);
}

export async function getChatHistory(userId: string) {
  logger.logApp('Fetching chat messages history for user', { userId });
  return fetchHistory(userId);
}

export async function processChatMessage(userId: string, message: string, context: any) {
  try {
    logger.logApp('Processing chatbot incoming message request...', { userId });
    
    const rawHistory = await fetchHistory(userId);
    
    logger.logApp('Generating AI chatbot conversation response...');
    const resp = await geminiService.generateChatResponse(rawHistory, message, context);

    await saveChatMessage(userId, 'user', message);
    await saveChatMessage(userId, 'assistant', resp);
    
    logger.logApp('Chatbot conversation exchange saved in database', { userId });

    return {
      role: 'assistant',
      content: resp,
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error('Failed to process chatbot conversation message exchange', error, { userId });
    throw error;
  }
}
