import { create } from "zustand";
import type { AuthState } from "../types/auth";
import { saveToken, deleteToken } from "../storage/authStorage";

export const useAuthStore = create<AuthState>((set) => ({
  status: "signedOut",
  token: null,
  user: null,
  isHydrating: false,

  setSession: ({ token, user }) => {
    saveToken(token); // fire-and-forget is OK here
    set({
      status: "signedIn",
      token,
      user,
    });
  },

  clearSession: () => {
    deleteToken();
    set({
      status: "signedOut",
      token: null,
      user: null,
    });
  },

  setHydrating: (value) => set({ isHydrating: value }),
}));