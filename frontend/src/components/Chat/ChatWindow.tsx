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

export default function ChatWindow() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params?.id as string | undefined;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setIsLoading(true);
    api
      .get(`/chat/conversation/${conversationId}`, {
        validateStatus: (s) => (s >= 200 && s < 300) || s === 404,
      })
      .then((res) => {
        if (res.status === 404) setMessages([]);
        else if (Array.isArray(res.data)) setMessages(res.data);
      })
      .finally(() => setIsLoading(false));
  }, [conversationId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const isNewChat = !conversationId;
    const activeId = conversationId || uuidv4();
    const currentInput = input;

    setMessages((p) => [
      ...p,
      { role: "user", content: currentInput, conversationId: activeId },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.post("/chat/message", {
        conversationId: activeId,
        messages: [{ role: "user", content: currentInput }],
      });

      if (isNewChat) {
        router.push(`/chat/${activeId}`);
      } else {
        setMessages((p) => [...p, response.data]);
      }
    } catch (err) {
      console.error("Database Error:", err);
    } finally {
      setIsLoading(false);
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
            const shouldShow =
              !isAssistant ||
              hasTextType(msg.content) ||
              hasToolResult(msg.content);

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
                    // Assistant content is a JSON array handled by components
                    <>
                      <TextMessage content={msg.content} isLast={isLast} />
                      <ToolMessage content={msg.content} />
                    </>
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

          {isLoading && (
            <div className="flex items-start gap-3 md:gap-4 w-full animate-in fade-in slide-in-from-bottom-2">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-muted border">
                  <Bot size={18} />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-[var(--border)] px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
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
