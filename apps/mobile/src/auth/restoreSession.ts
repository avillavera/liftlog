import { getToken, deleteToken } from "../storage/authStorage";
import authApi from "../api/auth";
import { useAuthStore } from "../stores/authStore";

export async function restoreSession() {
  const { setHydrating, setSession, clearSession } = useAuthStore.getState();

  setHydrating(true);

  try {
    const token = await getToken();

    if (!token) {
      clearSession();
      return;
    }

    // Make token available to API layer (axios interceptor reads it from the store)
    useAuthStore.setState({ token });

    // Validate token with backend
    const { user } = await authApi.me();

    setSession({ token, user });
  } catch {
    try {
      await deleteToken();
    } catch {}
    clearSession();
  } finally {
    setHydrating(false);
  }
}
