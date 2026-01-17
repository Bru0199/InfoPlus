import { defineConfig } from 'drizzle-kit';
import { env } from './src/env.ts';

export default defineConfig({
  // Database dialect (PostgreSQL for NeonDB)
  dialect: 'postgresql',

  // Path to your Drizzle ORM schema file(s)
  schema: './src/db/schema.ts',

  // Where to generate migrations (SQL files)
  out: './drizzle/migrations',

  // Database credentials from environment variable
  dbCredentials: {
    url: env.DATABASE_URL,
  },

});
