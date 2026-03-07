import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { authLoadingStyles as styles } from "../styles/authloading.styles";
import { useAuthStore } from "../stores/authStore";
import { useWorkoutLogStore } from "../stores/workoutLogStore";
import { getToken } from "../storage/authStorage";

export default function AuthLoadingScreen({ navigation }: any) {
  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await getToken();

        // hydrate workout history
        await useWorkoutLogStore.getState().hydrate();

        if (token) {
          // restore auth state
          useAuthStore.setState({
            status: "signedIn",
            token,
          });

          navigation.replace("App");
        } else {
          navigation.replace("Auth");
        }
      } catch (err) {
        console.error("Bootstrap error:", err);
        navigation.replace("Auth");
      }
    }

    bootstrap();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}