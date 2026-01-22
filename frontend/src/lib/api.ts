import axios from "axios";

// Normalize base URL and ensure single /api prefix
const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const base = rawBase.replace(/\/$/, "");
const baseWithApi = base.endsWith("/api") ? base : `${base}/api`;

export const api = axios.create({
  baseURL: baseWithApi,
  withCredentials: true, // MUST be true to send session cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Log outgoing requests for debugging session/cookie issues
api.interceptors.request.use((config) => {
  console.log("API Request:", {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    withCredentials: config.withCredentials,
    headers: config.headers,
    cookies: typeof document !== "undefined" ? document.cookie : "server-side",
  });
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("API Success:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Error Details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });
    return Promise.reject(error);
  }
);
