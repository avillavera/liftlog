import { useEffect } from "react";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import { useAuthStore } from "../stores/authStore";
import { restoreSession } from "../auth/restoreSession";

export default function RootNavigator() {
  const status = useAuthStore((s) => s.status);
  const isHydrating = useAuthStore((s) => s.isHydrating);

  useEffect(() => { restoreSession(); }, []);

  if (isHydrating) {
    return <AuthLoadingScreen />;
  }

  return status === "signedIn" ? <AppNavigator /> : <AuthNavigator />;
}
