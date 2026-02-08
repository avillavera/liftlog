import { create } from "zustand";
import type { AuthState } from "../types/auth";

export const useAuthStore = create<AuthState>()((set) => ({
  status: "signedOut",
  token: null,
  user: null,
  isHydrating: false,

  setSession: ({ token, user }) =>
    set({
      status: "signedIn",
      token,
      user,
    }),

  clearSession: () =>
    set({
      status: "signedOut",
      token: null,
      user: null,
    }),

  setHydrating: (value) =>
    set({
      isHydrating: value,
    }),
}));