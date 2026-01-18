// import { GoogleGenAI, type Content } from "@google/genai"; //
// import { env } from "../env.ts";
// import { aiTools } from "./tools.ts";
// import { getWeather } from "../services/weather.service.ts";
// import { getStockPrice } from "../services/stock.service.ts";
// import { getF1Matches } from "../services/f1.service.ts";

// // 1. Initialize the new Unified Client
// const client = new GoogleGenAI({
//   apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
// });

// export async function processChat(
//   userMessage: string,
//   history: Content[] = [],
// ) {
//   // 2. Models are accessed through client.models.generateContent
//   // In the SDK, tools are passed in the configuration object.
//   const modelId = "gemini-2.0-flash"; // Recommended model

//   // Note: Modern chat handling often uses client.models.generateContent
//   // with a cumulative 'contents' array to maintain state
//   const contents: Content[] = [
//     ...history,
//     { role: "user", parts: [{ text: userMessage }] },
//   ];

//   const result = await client.models.generateContent({
//     model: modelId,
//     contents,
//     config: {
//       tools: [{ functionDeclarations: aiTools }],
//     },
//   });

//   const response = result.response;
//   // Accessing function calls from the first candidate's parts
//   const functionCalls = response.candidates?.[0].content.parts
//     ?.filter((part) => part.functionCall)
//     .map((part) => part.functionCall);

//   // 3. If no tool is needed, return text
//   if (!functionCalls || functionCalls.length === 0) {
//     return { text: response.text(), data: null, toolCalls: null };
//   }

//   // 4. Handle Tool/Function Calls
//   const toolResponsesParts = [];
//   let lastApiResult = null;

//   for (const call of functionCalls) {
//     if (!call) continue;
//     const { name, args } = call;
//     let apiResult;

//     if (name === "getWeather") {
//       apiResult = await getWeather(args.location as string);
//     } else if (name === "getStockPrice") {
//       apiResult = await getStockPrice(args.symbol as string);
//     } else if (name === "getF1Matches") {
//       apiResult = await getF1Matches();
//     }

//     lastApiResult = apiResult;

//     // Build the function response part correctly
//     toolResponsesParts.push({
//       functionResponse: {
//         name,
//         response: { content: apiResult },
//       },
//     });
//   }

//   // 5. Provide the model's call and your response back for final text
//   const finalContents: Content[] = [
//     ...contents,
//     response.candidates![0].content, // The model's functionCall message
//     { role: "user", parts: toolResponsesParts }, // Your functionResponse message
//   ];

//   const finalResult = await client.models.generateContent({
//     model: modelId,
//     contents: finalContents,
//   });

//   return {
//     text: finalResult.response.text(),
//     data: lastApiResult,
//     toolCalls: functionCalls,
//     toolUsed: functionCalls[0]?.name,
//   };
// }

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "../env.ts";

export const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const geminiModel = google("gemini-1.5-flash");
