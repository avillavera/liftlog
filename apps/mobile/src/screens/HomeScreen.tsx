import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuthStore } from "../stores/authStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<AppStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const clearSession = useAuthStore((s) => s.clearSession);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You’re signed in ✅</Text>

      <Pressable style={[styles.button, { marginBottom: 12 }]} onPress={() => navigation.navigate("ExerciseList")} >
        <Text style={styles.buttonText}>Open Exercise Library</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={clearSession}>
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>

      <Pressable style={[styles.button, { marginBottom: 12 }]} onPress={() => navigation.navigate("WorkoutBuilder")} >
        <Text style={styles.buttonText}>Start Workout</Text>
      </Pressable>

      <Pressable style={[styles.button, { marginBottom: 12 }]} onPress={() => navigation.navigate("WorkoutHistory")} >
        <Text style={styles.buttonText}>Workout History</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  button: { backgroundColor: "#1F2933", padding: 14, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "600" },
});