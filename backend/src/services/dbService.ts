import { db } from "../db/index.ts";
import { messages } from "../db/schema.ts";
import { eq, asc } from "drizzle-orm";

export const getChatHistory = async (chatId: string) => {
  if (!chatId) return [];

  const results = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, chatId))
    .orderBy(asc(messages.createdAt));

  // Map database roles to Gemini roles
  return results.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));
};

export const saveMessageToDb = async (
  chatId: string,
  role: "user" | "model" | "tool",
  content: string,
  toolCalls?: any,
  toolData?: any,
) => {
  return await db.insert(messages).values({
    conversationId: chatId,
    // Use 'as any' or the specific inferred type to bypass the strict enum check
    role:
      role === "model" ? "assistant" : (role as "user" | "assistant" | "tool"),
    content: content,
    // Store the intent/calls
    toolCalls: toolCalls ?? null,
    // Store the actual API results
    toolResult: toolData ?? null,

    // toolResult: toolData ? { tool: toolName, data: toolData } : null,
  } as typeof messages.$inferInsert); // Explicitly cast the whole object to the Insert type
};
