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

// Request interceptor (silent - no sensitive data logging)
api.interceptors.request.use((config) => config);

// Response interceptor (silent - no sensitive data logging)
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
