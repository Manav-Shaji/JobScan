import { createRouteHandler } from '@/backend/api/route-utils';
import { chatSchema } from '@/backend/modules/chat/chat-schema';
import { getChatHistory, processChatMessage } from '@/backend/modules/chat/chat-service';

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
