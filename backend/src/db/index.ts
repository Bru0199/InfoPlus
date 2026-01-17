// // src/db/index.ts
// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import { env } from "../env";

// // Create a Postgres connection pool
// const pool = new Pool({
//   connectionString: env.DATABASE_URL,
// });

// // Create Drizzle ORM client
// export const db = drizzle(pool);

// // Optional: Test connection at startup
// pool
//   .connect()
//   .then((client) => {
//     console.log("✅ Database connected successfully");
//     client.release();
//   })
//   .catch((err) => {
//     console.error("❌ Database connection failed:", err);
//     process.exit(1);
//   });
