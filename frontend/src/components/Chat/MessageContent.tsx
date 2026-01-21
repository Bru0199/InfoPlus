"use client";

import React, { useState, useEffect } from "react";
import { WeatherCard, StockCard, F1Card } from "./ToolCards";

const normalizeToolName = (name: string | undefined) => {
  if (!name) return "";
  const cleaned = name.replace(/[-_]/g, "").toLowerCase();
  if (cleaned.includes("weather")) return "getWeather";
  if (cleaned.includes("stock")) return "getStockPrice";
  if (cleaned.includes("f1") || cleaned.includes("race")) return "getF1Matches";
  return name;
};

const extractToolData = (item: any) => {
  if (item?.output?.value !== undefined) return item.output.value;
  if (item?.output !== undefined) return item.output;
  if (item?.content !== undefined) return item.content;
  return null;
};

export const MessageContent = ({ content, isLast }: { content: any; isLast?: boolean }) => {
  // Parse content if it's a string, handle if it's undefined
  let parsedContent: any[] = [];
  
  try {
    if (!content) {
      parsedContent = [];
    } else if (typeof content === "string") {
      parsedContent = JSON.parse(content);
    } else if (Array.isArray(content)) {
      parsedContent = content;
    } else {
      parsedContent = [];
    }
  } catch (e) {
    console.error("Failed to parse content:", e);
    parsedContent = [];
  }

  // Filter: Ignore the "tool-call" type entirely
  const displayItems = parsedContent.filter((item: any) => item && item.type !== "tool-call");

  return (
    <div className="flex flex-col gap-5 w-full">
      {displayItems.map((item: any, index: number) => {
        // Loading placeholder (typing dots)
        if (item.type === "loading") {
          return (
            <div key={index} className="flex gap-1 items-center text-zinc-400">
              <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></span>
            </div>
          );
        }

        // Handle Normal Text with streaming effect
        if (item.type === "text" && item.text) {
          return <StreamingText key={index} text={item.text} isLast={isLast} />;
        }

        // Handle Tool Results
        if (item.type === "tool-result") {
          const toolName = normalizeToolName(item.toolName);
          const toolData = extractToolData(item);

          if (!toolData) return null;

          switch (toolName) {
            case "getWeather":
              return <WeatherCard key={index} data={toolData} />;
            case "getStockPrice":
              return <StockCard key={index} data={toolData} />;
            case "getF1Matches":
              return <F1Card key={index} data={toolData} />;
            default:
              return null;
          }
        }
        return null;
      })}
    </div>
  );
};

const StreamingText = ({ text, isLast }: { text: string; isLast?: boolean }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // If not the last message, show instantly
    if (!isLast) {
      setDisplayedText(text);
      return;
    }

    // If it's the last message, type it out
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 10); // Speed of text appearance
    return () => clearInterval(interval);
  }, [text, isLast]);

  return <div className="text-inherit">{displayedText}</div>;
};
