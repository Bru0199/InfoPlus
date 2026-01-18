// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import * as schema from './schema';
// import { env } from '../env';

// // For edge environments or standard node environments
// const queryClient = postgres(env.DATABASE_URL);
// export const db = drizzle(queryClient, { schema });
// export { sql } from 'drizzle-orm';

// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import * as schema from './schema.ts';
// import { env } from '../env.ts'

// // PostgreSQL connection
// const queryClient = postgres(env.DATABASE_URL);

// export const db = drizzle(queryClient, { schema });
// export { sql } from 'drizzle-orm';

import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import { env } from "../env.ts";

// Required for Neon serverless to work in a Node.js environment
neonConfig.webSocketConstructor = ws;

export const pool = new Pool({ connectionString: env.DATABASE_URL });

export const db = drizzle(pool);
