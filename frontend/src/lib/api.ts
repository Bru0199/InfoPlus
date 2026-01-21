import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // MUST be true to send session cookies
  headers: {
    "Content-Type": "application/json",
  },
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
