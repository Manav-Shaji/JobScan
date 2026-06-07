import 'server-only';
import { geminiService } from '@/backend/ai/gemini-provider';
import {
  getChatHistory as fetchHistory,
  saveChatMessage,
} from './chat-repository';
import { logger } from '@/backend/logging/logger';

/**
 * Service orchestrating chatbot messaging. Connects message history,
 * context, and user input to Gemini AI, saves exchanges to postgres, and logs activities.
 */
export async function getChatHistory(userId: string) {
  logger.logApp('Fetching chat messages history for user', { userId });
  return fetchHistory(userId);
}

export async function processChatMessage(userId: string, message: string, context: any) {
  try {
    logger.logApp('Processing chatbot incoming message request...', { userId });
    
    // Fetch user's previous chat history
    const rawHistory = await fetchHistory(userId);
    
    // Map db format to what Gemini expectations require: [{role: 'user'|'model', parts: [{text: content}]}]
    const history = rawHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    logger.logApp('Generating AI chatbot conversation response...');
    const resp = await geminiService.generateChatResponse(history, message, context);

    // Save user's message
    await saveChatMessage(userId, 'user', message);
    
    // Save AI response
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
