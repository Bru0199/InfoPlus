// import { FunctionDeclaration } from "@google/genai";

// export const aiTools: FunctionDeclaration[] = [
//   {
//     name: "getWeather",
//     description: "Get the current weather report for a specific city.",
//     parameters: {
//       type: SchemaType.OBJECT,
//       properties: {
//         location: {
//           type: SchemaType.STRING,
//           description: "The city name, e.g., 'London' or 'New York'.",
//         },
//       },
//       required: ["location"],
//     },
//   },
//   {
//     name: "getStockPrice",
//     description:
//       "Get the real-time (delayed) stock price and market metrics for a ticker symbol.",
//     parameters: {
//       type: SchemaType.OBJECT,
//       properties: {
//         symbol: {
//           type: SchemaType.STRING,
//           description:
//             "The stock ticker symbol with exchange suffix, e.g., 'AAPL.US' or 'TSLA.US'.",
//         },
//       },
//       required: ["symbol"],
//     },
//   },
//   {
//     name: "getF1Matches",
//     description:
//       "Fetch the schedule and details for the next upcoming Formula 1 race.",
//     parameters: {
//       type: SchemaType.OBJECT,
//       properties: {}, // No parameters needed for 'next race'
//     },
//   },
// ];

// import { Type } from "@google/genai";

// export const aiTools = [
//   {
//     name: "getWeather",
//     description: "Get the current weather report for a specific city.",
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         location: {
//           type: Type.STRING,
//           description: "The city name, e.g., 'London' or 'New York'.",
//         },
//       },
//       required: ["location"],
//     },
//   },
//   {
//     name: "getStockPrice",
//     description:
//       "Get the real-time (delayed) stock price and market metrics for a ticker symbol.",
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         symbol: {
//           type: Type.STRING,
//           description:
//             "The stock ticker symbol with exchange suffix, e.g., 'AAPL.US' or 'TSLA.US'.",
//         },
//       },
//       required: ["symbol"],
//     },
//   },
//   {
//     name: "getF1Matches",
//     description:
//       "Fetch the schedule and details for the next upcoming Formula 1 race.",
//     parameters: {
//       type: Type.OBJECT,
//       properties: {},
//     },
//   },
// ];

import { tool } from "ai";
import { z } from "zod";
import { getWeather } from "../services/weather.service.ts";
import { getStockPrice } from "../services/stock.service.ts";
import { getF1Matches } from "../services/f1.service.ts";

export const allTools = {
  // 1. Weather Tool
  getWeather: tool({
    description: "Get the current weather for a specific city.",
    parameters: z.object({
      location: z.string().describe("The location to get the weather for"),
    }),
    execute: async ({ location }: { location: string }) => {
      return await getWeather(location);
    },
  }),

  // 2. Stock Tool
  getStockPrice: tool({
    description: "Get the real-time stock price for a ticker symbol.",
    parameters: z.object({
      symbol: z.string().describe("The stock ticker symbol, e.g. AAPL, TSLA"),
    }),
    execute: async ({ symbol }: { symbol: string }) => {
      return await getStockPrice(symbol);
    },
  }),

  // 3. F1 Tool
  getF1Matches: tool({
    description: "Get information about the next upcoming Formula 1 race.",
    parameters: z.object({}), // No parameters needed for "next race"
    execute: async () => {
      return await getF1Matches();
    },
  }),
};
