import axios from "axios";
import { ENV } from "../config/env";
import { useAuthStore } from "../stores/authStore";

export const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 15000,
});

// Attach JWT if present
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});