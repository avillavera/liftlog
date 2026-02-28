import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuthStore } from "../stores/authStore";
import ExerciseListScreen from "../screens/ExerciseListScreen";
import HomeScreen from "../screens/HomeScreen";
import WorkoutBuilderScreen from "../screens/WorkoutBuilderScreen";

export type AppStackParamList = {
  Home: undefined;
  ExerciseList: undefined;
  WorkoutBuilder: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

/* function HomeScreen() {
  const clearSession = useAuthStore((s) => s.clearSession);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You’re signed in ✅</Text>
      <Pressable style={styles.button} onPress={clearSession}>
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>
    </View>
  );
} */

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "LiftLog" }} />
      <Stack.Screen name="ExerciseList" component={ExerciseListScreen} options={{ title: "Exercises" }} />
      <Stack.Screen name="WorkoutBuilder" component={WorkoutBuilderScreen} options={{ title: "Workout Builder" }} />
    </Stack.Navigator>
  );
}

// I will move later just want to see if it works.
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  button: { backgroundColor: "#1F2933", padding: 14, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "600" },
});
