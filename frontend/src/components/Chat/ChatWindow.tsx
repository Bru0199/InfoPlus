"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  Sun,
  Activity,
  DollarSign,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

import { TextMessage, hasTextType } from "./TextMessage";
import { ToolMessage, hasToolResult } from "./ToolMessage";
import { MessageContent } from "./MessageContent";

export default function ChatWindow() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params?.id as string | undefined;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestMessages = useRef<any[]>([]);
  const skipNextFetch = useRef(false);
  const lastConversationId = useRef<string | undefined>(undefined);
  // Ensure we always have a reachable API base (fallback to localhost:4000 for dev)
  const apiBase = (
    api.defaults.baseURL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000"
  ).replace(/\/$/, "");

  useEffect(() => {
    latestMessages.current = messages;
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      lastConversationId.current = undefined;
      return;
    }

    // If we already have messages for this conversation, don't refetch
    // This happens when we navigate from /chat to /chat/{id} after sending a message
    if (latestMessages.current.length > 0 && lastConversationId.current === conversationId) {
      console.log("✅ Messages already loaded for conversation", conversationId);
      return;
    }

    // Skip fetch if we just navigated after streaming (messages already in state)
    if (skipNextFetch.current) {
      console.log("⏭️ Skipping fetch - messages already loaded from stream");
      skipNextFetch.current = false;
      lastConversationId.current = conversationId;
      return;
    }

    // New conversation ID - fetch from backend
    console.log("🔄 Fetching conversation", conversationId);
    lastConversationId.current = conversationId;
    
    setIsLoading(true);
    api
      .get(`/chat/conversation/${conversationId}`, {
        validateStatus: (s) => (s >= 200 && s < 300) || s === 404,
      })
      .then((res) => {
        console.log(`📥 Loaded conversation ${conversationId}:`, res.status);
        if (res.status === 404) {
          console.log("⚠️ Conversation not found (404), keeping local messages");
          return;
        }
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        }
      })
      .catch((err) => console.error("Error loading conversation:", err))
      .finally(() => setIsLoading(false));
  }, [conversationId]);

  const updateAssistantText = (text: string) => {
    setMessages((prev) => {
      const current = prev.length > 0 ? prev : latestMessages.current;
      if (current.length === 0) return current;
      const updated = [...current];
      const lastIdx = updated.length - 1;
      const last = updated[lastIdx];
      if (!last || last.role !== "assistant") return current;
      const contentArray = Array.isArray(last.content)
        ? [...last.content].filter((c: any) => c?.type !== "loading")
        : [];
      const textIndex = contentArray.findIndex((c: any) => c?.type === "text");
      if (textIndex >= 0) {
        contentArray[textIndex] = { ...contentArray[textIndex], type: "text", text };
      } else {
        contentArray.push({ type: "text", text });
      }

      updated[lastIdx] = { ...last, content: contentArray };
      return updated;
    });
  };

  const appendAssistantToolResult = (item: any) => {
    console.log("🔧 Appending tool result:", item);
    setMessages((prev) => {
      const current = prev.length > 0 ? prev : latestMessages.current;
      if (current.length === 0) return current;
      const updated = [...current];
      const lastIdx = updated.length - 1;
      const last = updated[lastIdx];
      if (!last || last.role !== "assistant") return current;

      const contentArray = Array.isArray(last.content)
        ? [...last.content].filter((c: any) => c?.type !== "loading")
        : [];
      contentArray.push({ type: "tool-result", ...item });
      updated[lastIdx] = { ...last, content: contentArray };
      console.log("✅ Updated assistant message:", updated[lastIdx]);
      return updated;
    });
  };

  const replaceLastAssistant = (replacement: any) => {
    console.log("🔄 Replacing last assistant with:", replacement);
    
    // If replacement is a raw tool result (has raceName, season, etc.), wrap it
    const isRawToolResult = replacement && !replacement.role && !Array.isArray(replacement.content);
    
    let payload;
    if (isRawToolResult) {
      // Wrap tool result in proper message format
      payload = {
        role: "assistant",
        content: [{ type: "tool-result", ...replacement }]
      };
    } else {
      payload = replacement?.role
        ? replacement
        : { role: "assistant", content: replacement?.content ?? replacement };
    }
    
    console.log("📤 Final payload:", payload);

    setMessages((prev) => {
      if (prev.length === 0) return [payload];
      const updated = [...prev];
      for (let i = updated.length - 1; i >= 0; i -= 1) {
        if (updated[i].role === "assistant") {
          updated[i] = payload;
          return updated;
        }
      }
      const next = [...prev, payload];
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const isNewChat = !conversationId;
    const activeId = conversationId || uuidv4();
    const userMessage = input.trim();

    // Add user message immediately
    setMessages((prev) => {
      const next = [...prev, { role: "user", content: userMessage }];
      latestMessages.current = next;
      return next;
    });
    // Add streaming placeholder for assistant (shows dots)
    setMessages((prev) => {
      const next = [
        ...prev,
        { role: "assistant", content: [{ type: "loading" }, { type: "text", text: "" }] },
      ];
      latestMessages.current = next;
      return next;
    });

    setInput("");
    setIsLoading(true);
    setIsStreaming(true);

    const payload = {
      conversationId: activeId,
      messages: [{ role: "user", content: userMessage }],
      stream: true,
    };

    try {
      const url = `${apiBase}/chat/message`;
      console.log("➡️ POST", url);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") || "";

      if (!res.ok && !res.body) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      // STREAMING MODE: SSE/NDJSON/plain text chunks
      if (
        res.body &&
        (contentType.includes("text/event-stream") ||
          contentType.includes("application/x-ndjson") ||
          contentType.includes("text/plain"))
      ) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let aggregatedText = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          const events = chunk.split(/\n\n+/);
          for (const evt of events) {
            const line = evt.trim();
            if (!line) continue;

            const dataLine = line.replace(/^data:\s*/, "");
            let parsed: any = null;
            try {
              parsed = JSON.parse(dataLine);
              console.log("📦 Parsed event:", parsed);
            } catch {
              aggregatedText += dataLine;
              updateAssistantText(aggregatedText);
              continue;
            }

            if (parsed?.type === "text" && typeof parsed.text === "string") {
              aggregatedText += parsed.text;
              updateAssistantText(aggregatedText);
            } else if (parsed?.type === "tool-result") {
              console.log("🛠️ Received tool-result:", parsed);
              appendAssistantToolResult(parsed);
            }
          }
        }

        // Streaming complete - backend already saved from /chat/message
        console.log("✅ Streaming complete. Final messages:", latestMessages.current);
        setIsStreaming(false);

        if (isNewChat) {
          skipNextFetch.current = true;
          router.push(`/chat/${activeId}`);
        }
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Request failed: ${res.status} ${errorText}`);
      }

      // NON-STREAMING FALLBACK
      const json = await res.json();
      console.log("📦 Non-streaming response received:", json);
      replaceLastAssistant(json);
      
      // Backend already saved from /chat/message
      console.log("✅ Response complete. Final messages:", latestMessages.current);
      setIsStreaming(false);
      
      if (isNewChat) {
        skipNextFetch.current = true;
        router.push(`/chat/${activeId}`);
      }
    } catch (err: any) {
      console.error("❌ Error sending message:", err);
      replaceLastAssistant({
        role: "assistant",
        content: "Sorry, an error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[var(--bg-main)] overflow-hidden">
      {/* 1. SCROLLABLE AREA: Responsive Padding */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-8 lg:px-12 py-6 pb-60 scroll-smooth"
      >
        {/* Dynamic Width: Wider on large screens, full on mobile */}

        <div className="max-w-5xl mx-auto w-full space-y-6">
          {/* EMPTY STATE */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center mt-20 text-center gap-4 animate-fade-in">
              <Avatar className="h-14 w-14 shadow-lg">
                <AvatarFallback className="bg-[var(--brand-blue)] text-white">
                  <Bot size={28} />
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)]">
                Welcome to InfoPlus
              </h2>
              <p className="text-[var(--text-muted)] max-w-md">
                Ask me anything! I can help you with:
              </p>
              <ul className="flex flex-col gap-2 text-[var(--text-main)] font-medium">
                <li className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-400" />
                  Weather information for any location
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  Next Formula 1 race details
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Stock prices for any symbol
                </li>
              </ul>
              <p className="text-[var(--text-muted)] mt-4 italic">
                Start by typing your question below!
              </p>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isLast = idx === messages.length - 1;
            // FILTER LOGIC: Check if assistant message has renderable content
            const isAssistant = msg.role === "assistant";
            const hasLoading = (() => {
              try {
                const parsed = typeof msg.content === "string" ? JSON.parse(msg.content) : msg.content;
                return Array.isArray(parsed) && parsed.some((i: any) => i?.type === "loading");
              } catch {
                return false;
              }
            })();
            const shouldShow =
              !isAssistant ||
              hasTextType(msg.content) ||
              hasToolResult(msg.content) ||
              hasLoading;

            // Skip rendering if it's just a raw tool-call (prevents empty bubbles)
            if (!shouldShow) return null;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 md:gap-4 w-full ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-8 w-8 md:h-9 md:w-9 shrink-0 shadow-sm">
                  <AvatarFallback
                    className={
                      msg.role === "user"
                        ? "bg-[var(--brand-blue)] text-white"
                        : "bg-muted border border-[var(--border)]"
                    }
                  >
                    {msg.role === "user" ? (
                      <User size={14} />
                    ) : (
                      <Bot size={18} />
                    )}
                  </AvatarFallback>
                </Avatar>

                {/* REPLY BUBBLE */}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap shadow-sm border ${
                    msg.role === "user"
                      ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)] rounded-tr-none max-w-[85%] md:max-w-[65%]"
                      : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 rounded-tl-none max-w-[85%] md:max-w-[75%]"
                  }`}
                >
                  {msg.role === "user" ? (
                    // User content is a plain string
                    msg.content
                  ) : (
                    // Assistant content is a JSON array - use MessageContent for unified handling
                    <MessageContent content={msg.content} isLast={isLast} isStreaming={isStreaming && isLast} />
                  )}
                </div>
              </div>
            );
          })}

          {/* {isLoading && (
            <div className="flex items-center gap-3 p-2 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="h-10 w-24 bg-muted rounded-2xl rounded-tl-none" />
            </div>
          )} */}

          {/* Loading dots removed; streaming placeholder already renders live text */}
        </div>
      </div>

      {/* 2. PREMIUM FLOATING INPUT: Mobile & Desktop optimized */}
      {/* <footer className="w-full pb-6 pt-2 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={onSubmit}
            className="flex items-center bg-white dark:bg-zinc-900 border border-[var(--border)] rounded-2xl px-2 py-1.5 shadow-md focus-within:ring-2 focus-within:ring-[var(--brand-blue)]/20 transition-all"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask InfoPlus anything..."
              disabled={isLoading}
              className="flex-1 h-10 md:h-12 bg-transparent border-none shadow-none focus-visible:ring-0 text-sm md:text-base px-3"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-[var(--brand-blue)] hover:opacity-90 shrink-0 transition-transform active:scale-95"
            >
              <Send size={16} className="text-white" />
            </Button>
          </form>
          <p className="mt-2.5 text-center text-[10px] text-[var(--text-muted)] font-medium tracking-wide opacity-50">
            INFOPLUS INTELLIGENCE • 2026
          </p>
        </div>
      </footer> */}

      <footer className="w-full absolute bottom-0 left-0 right-0 pb-10 pt-2 px-4 md:px-8 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)] to-transparent pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <form
            onSubmit={onSubmit}
            className="flex items-center bg-white dark:bg-zinc-900 border border-[var(--border)] rounded-2xl px-2 py-2 shadow-2xl focus-within:ring-2 focus-within:ring-[var(--brand-blue)]/20 transition-all mb-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask InfoPlus anything..."
              disabled={isLoading}
              className="flex-1 h-11 md:h-12 bg-transparent border-none shadow-none focus-visible:ring-0 text-sm md:text-base px-3"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-10 w-10 md:h-11 md:w-11 rounded-xl bg-[var(--brand-blue)] hover:opacity-90 shrink-0 transition-transform active:scale-95 shadow-md"
            >
              <Send size={18} className="text-white" />
            </Button>
          </form>
          <p className="text-center text-[10px] text-[var(--text-muted)] font-bold tracking-widest opacity-40">
            INFOPLUS INTELLIGENCE
          </p>
        </div>
      </footer>
    </div>
  );
}
