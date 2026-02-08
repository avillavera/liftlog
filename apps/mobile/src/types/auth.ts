export type AuthUser = {
    id: string;
    email: string;
};

export type AuthStatus = "signedOut" | "signedIn";

// for store
export type AuthState = {
    status: AuthStatus;
    token: string | null;
    user: AuthUser | null;

    // Helps with flicker
    isHydrating: boolean

    setSession: (session: { token: string; user: AuthUser }) => void;
    clearSession: () => void;
    setHydrating: (value: boolean) => void;
};