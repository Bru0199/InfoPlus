import { pgTable, text, timestamp, uuid, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// 1. Enum for message roles to ensure data integrity
export const roleEnum = pgEnum('role', ['system', 'user', 'assistant', 'tool']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  // To handle multiple OAuth providers
  provider: text('provider').$type<'google' | 'github'>(), 
  providerId: text('provider_id').unique(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').default('New Chat'), // Will be auto-updated by AI later
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }).notNull(),
  role: roleEnum('role').notNull(),
  content: text('content').notNull(),
  
  /** * TOOL CALLING SUPPORT
   * toolCalls: Stores the request from the AI (e.g., "call getWeather for London")
   * toolResult: Stores the data returned from your service
   */
  toolCalls: jsonb('tool_calls'), 
  toolResult: jsonb('tool_result'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});