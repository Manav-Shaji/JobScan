/**
 * ------------------------------------------------------------
 * API Route: route.ts
 * 
 * Purpose:
 * Manages chat session operations including retrieving history, processing new messages, and clearing threads.
 * 
 * Responsibilities:
 * • Authenticates and authorizes user requests for chat interactions.
 * • Orchestrates message processing, history retrieval, and session cleanup.
 * 
 * Used By:
 * • Chat Features Module
 * ------------------------------------------------------------
 */

import { createRouteHandler } from '@/core/api/route-utils';
import { chatSchema } from '@/features/chat/service';
import { getChatHistory, processChatMessage, clearChatHistory } from '@/features/chat/service';

export const GET = createRouteHandler({
  auth: 'user',
  async handler({ user }) {
    return await getChatHistory(user.id);
  }
});

export const POST = createRouteHandler({
  auth: 'user',
  rateLimit: { key: 'chat', limit: 20, windowMs: 60 * 1000 },
  schema: chatSchema,
  async handler({ body, user }) {
    return await processChatMessage(user.id, body.message, body.context);
  }
});

export const DELETE = createRouteHandler({
  auth: 'user',
  async handler({ user }) {
    await clearChatHistory(user.id);
    return { success: true };
  }
});
