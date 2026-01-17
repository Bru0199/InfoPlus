// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import * as schema from './schema';
// import { env } from '../env';

// // For edge environments or standard node environments
// const queryClient = postgres(env.DATABASE_URL);
// export const db = drizzle(queryClient, { schema });
// export { sql } from 'drizzle-orm';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.ts';
import { env } from '../env.ts'

// PostgreSQL connection
const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, { schema });
export { sql } from 'drizzle-orm';
