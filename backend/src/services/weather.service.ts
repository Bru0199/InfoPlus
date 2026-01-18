// src/services/weatherService.ts
import axios from "axios";
import { env } from "../env.ts";

export async function getWeather(location: string): Promise<any> {
  const weatherKey = env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${weatherKey}`;

  try {
    const { data } = await axios.get(url);

    // Return the raw JSON directly
    return data;
  } catch (error: any) {
    console.error("Weather API Error:", error.message);
    return { error: "Location not found or API error" };
  }
}
