import {
  streamText,
  convertToModelMessages,
  type StreamTextResult,
  type CoreMessage,
} from "ai";
import { geminiModel } from "../chat/ai.ts";
import { allTools } from "../chat/tools.ts";
import { db } from "../db/index.ts";
import {
  conversations as conversationsTable,
  messages as messagesTable,
} from "../db/schema.ts";
import { eq } from "drizzle-orm";

export const ChatService = {
  async processRequest(
    userId: string,
    conversationId: string,
    messages: any[],
  ): Promise<StreamTextResult<any, any>> {
    // 1. Check if this is the "First Time" for this ID
    const existingConvo = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, conversationId))
      .limit(1);

    // If it doesn't exist, it's a NEW chat. We make it "EXISTING" by inserting it.
    if (existingConvo.length === 0) {
      console.log("🆕 State: NEW. Initializing conversation in DB...");

      await db.insert(conversationsTable).values({
        id: conversationId,
        userId: userId,
        title: messages[0]?.content?.substring(0, 40) || "New Chat",
      });
    } else {
      // If it exists, it is already an EXISTING chat.
      console.log("🔄 State: EXISTING. Appending to history...");

      // We just update the 'updatedAt' to keep it fresh
      await db
        .update(conversationsTable)
        .set({ updatedAt: new Date() })
        .where(eq(conversationsTable.id, conversationId));
    }

    // 2. Add this explicit return type
    // Save User Message logic...
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role === "user") {
      await db.insert(messagesTable).values({
        conversationId,
        userId,
        role: "user",

        content: lastUserMessage.content,
      });
    }

    // const modelMessages = await convertToModelMessages(messages);

    const coreMessages: CoreMessage[] = safeMessages.map((m) => ({
      role: m.role ?? "user", // Fallback role
      content: m.content
        ? typeof m.content === "string"
          ? m.content
          : JSON.stringify(m.content)
        : "",
    }));

    return streamText({
      model: geminiModel,
      messages: modelMessages,
      tools: allTools,
      maxSteps: 5,
      onFinish: async ({ response }) => {
        for (const msg of response.messages) {
          if (msg.role !== "user") {
            await db.insert(messagesTable).values({
              conversationId,
              userId,
              role: msg.role as any,
              content:
                typeof msg.content === "string"
                  ? msg.content
                  : JSON.stringify(msg.content),
              toolCalls: "toolCalls" in msg ? (msg.toolCalls as any) : null,
              toolResult:
                "toolResults" in msg ? (msg.toolResults as any) : null,
            });
          }
        }
      },
    });
  },
};
