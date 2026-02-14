import { api } from "./client";
import type { AuthUser } from "../types/auth";

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export async function login(payload: { email: string; password: string }) {
  const res = await api.post<AuthResponse>("/auth/login", payload);
  return res.data;
}

export async function register(payload: { email: string; password: string }) {
  const res = await api.post<AuthResponse>("/auth/register", payload);
  return res.data;
}

export async function me() {
  const res = await api.get<{ user: AuthUser }>("/auth/me");
  return res.data;
}

const authApi = { login, register, me };
export default authApi;