import { Router } from "express";
import { isAuthenticated } from "../auth/middleware.ts"; // Your gatekeeper
import { chatHandler } from "../chat/chathandler.ts"; // Your logic

const router = Router();

// When a POST request hits /message:
// 1. Run isAuthenticated (Middleware)
// 2. If pass, run chatHandler (Handler)
router.post("/message", isAuthenticated, chatHandler);

export default router;
