import express from "express";
import cors from "cors";
import session from "express-session";
import pgSession from "connect-pg-simple";
import passport from "../src/auth/passport.ts";
import authRouter from "./auth/routes.ts";
import chatRouter from "./chat/routes.ts";
import { pool } from "./db/index.ts"; // Ensure you export 'pool' from your db file
import { env } from "./env.ts";
import { isAuthenticated } from "./auth/middleware.ts";

// import helmet from "helmet"; // 1. Import Helmet

const app = express();
const PostgresStore = pgSession(session);

// app.use(
//   helmet({
//     contentSecurityPolicy: false, // Disabling CSP temporarily so your fetch() works in console
//   }),
// );

// 1. Session Configuration (Neon DB persistence)
app.use(
  session({
    store: new PostgresStore({
      pool: pool,
      tableName: "session", // Ensure you ran the SQL to create this table
    }),
    secret: env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  }),
);

// 2. Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// 3. Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// 4. Routes
app.use("/api/auth", authRouter);
app.use("/api/chat", isAuthenticated, chatRouter); // Protected!

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", user: req.user });
});

export default app;
