import { getToken, deleteToken } from "../storage/authStorage";
import authApi from "../api/auth";
import { useAuthStore } from "../stores/authStore";

export async function restoreSession() {
  const setHydrating = useAuthStore.getState().setHydrating;
  const setSession = useAuthStore.getState().setSession;
  const clearSession = useAuthStore.getState().clearSession;

  setHydrating(true);

  try {
    const token = await getToken();
    if (!token) {
      clearSession();
      return;
    }

    // Put token in memory so axios interceptor attaches it for /auth/me
    // ( Not marking signed-in yet—only after /me succeeds)
    useAuthStore.setState({ token });

    const data = await authApi.me(); // expects { user }
    setSession({ token, user: data.user });
  } catch {
    // Token invalid/expired/etc.
    await deleteToken();
    clearSession();
  } finally {
    setHydrating(false);
  }
}
