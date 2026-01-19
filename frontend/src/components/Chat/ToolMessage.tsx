"use client";

import React from "react";
import { WeatherCard, StockCard, F1Card } from "./ToolCards";

export const hasToolResult = (content: any) => {
  try {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;
    return (
      Array.isArray(parsed) &&
      parsed.some((item: any) => item.type === "tool-result")
    );
  } catch {
    return false;
  }
};

export const ToolMessage = ({ content }: { content: any }) => {
  try {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;

    if (!Array.isArray(parsed)) return null;

    // Filter for tool-results only
    const toolResults = parsed.filter(
      (item: any) => item.type === "tool-result",
    );

    return (
      <div className="flex flex-col gap-4 mt-2">
        {toolResults.map((item, index) => {
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
        })}
      </div>
    );
  } catch (e) {
    return null;
  }
};
