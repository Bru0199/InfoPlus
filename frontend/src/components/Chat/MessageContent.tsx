"use client";

import React, { useState, useEffect } from "react";
import { WeatherCard, StockCard, F1Card } from "./ToolCards";

export const MessageContent = ({ content }: { content: any[] }) => {
  // Filter: Ignore the "tool-call" type entirely
  const displayItems = content.filter((item) => item.type !== "tool-call");

  return (
    <div className="flex flex-col gap-5 w-full">
      {displayItems.map((item, index) => {
        // Handle Normal Text with streaming effect
        if (item.type === "text") {
          return <StreamingText key={index} text={item.text} />;
        }

        // Handle Tool Results
        if (item.type === "tool-result") {
          const toolData = item.output.value;
          
          switch (item.toolName) {
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

const StreamingText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 10); // Speed of text appearance
    return () => clearInterval(interval);
  }, [text]);

  return <div className="text-inherit">{displayedText}</div>;
};