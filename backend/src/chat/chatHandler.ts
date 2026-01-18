// import { ChatService } from "../services/chatService.ts";

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export const chatHandler = async (req: Request, res: Response) => {
//   try {
//     console.log("request received at chat handler");

//     const { messages, conversationId, userId } = await req.body();

//     if (!messages || !conversationId || !userId) {
//       console.log("❌ Missing fields:", {
//         messages: !!messages,
//         conversationId,
//         userId,
//       });
//       return new Response("Missing required fields", { status: 400 });
//     }

//     console.log("2. Calling ChatService...");

//     // 2. Call the ChatService orchestrator
//     const result = await ChatService.processRequest(
//       userId,
//       conversationId,
//       messages,
//     );

//     console.log("3. Starting Stream...");

//     // 3. Return the result as a data stream
//     // This helper automatically handles the headers and chunking for the browser
//     return result.toTextStreamResponse();
//   } catch (error) {
//     console.error("Chat API Error:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// };

import { ChatService } from "../services/chatService.ts";
import { type Request, type Response } from "express";

export const maxDuration = 30;

export const chatHandler = async (req: Request, res: Response) => {
  try {
    console.log("1. Request received at chat handler");

    // FIX: Remove parentheses and await. Just access the object.
    const { messages, conversationId } = req.body;

    // Use the ID from passport session (req.user)
    const userId = (req.user as any)?.id;

    if (!messages || !conversationId || !userId) {
      console.log("❌ Missing fields:", {
        messages: !!messages,
        conversationId,
        userId,
      });
      // FIX: Use Express res.status().json()
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("2. Calling ChatService...");

    const result = await ChatService.processRequest(
      userId,
      conversationId,
      messages,
    );

    console.log("3. Starting Stream...");

    // 3. Pipe the AI SDK stream to the Express response
    const streamResponse = result.toTextStreamResponse();

    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");

    const reader = streamResponse.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value); // Send chunk to client
      }
    }

    res.end(); // Close the stream
  } catch (error) {
    console.error("Chat API Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
