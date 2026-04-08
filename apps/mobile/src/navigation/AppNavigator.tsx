import { Pressable, StyleSheet, View, type PressableProps } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ExerciseListScreen from "../screens/ExerciseListScreen";
import WorkoutBuilderScreen from "../screens/WorkoutBuilderScreen";
import WorkoutExerciseDetailScreen from "../screens/WorkoutExerciseDetailScreen";
import WorkoutSessionDetailScreen from "../screens/WorkoutSessionDetailScreen";
import WorkoutHistoryScreen from "../screens/WorkoutHistoryScreen";
import ExerciseProgressScreen from "../screens/ExerciseProgressScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type AppTabParamList = {
  HomeTab: undefined;
  HistoryTab: undefined;
  StartWorkoutTab: undefined;
  ExerciseLibraryTab: { mode?: "Browse" | "Select" } | undefined;
  ProfileTab: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  WorkoutExerciseDetail: { workoutExerciseId: string };
  WorkoutSessionDetail: { sessionId: string };
  ExerciseProgress: { exerciseId: string; exerciseName: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

function StartWorkoutTabButton({ onPress }: { onPress?: PressableProps["onPress"] }) {
  return (
    <Pressable onPress={onPress} style={styles.fabWrapper}>
      <View style={styles.fab}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#0B1530",
        tabBarInactiveTintColor: "#6B7280",
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="HistoryTab"
        component={WorkoutHistoryScreen}
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="StartWorkoutTab"
        component={WorkoutBuilderScreen}
        options={{
          title: "",
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <StartWorkoutTabButton onPress={props.onPress} />
          ),
        }}
      />

      <Tab.Screen
        name="ExerciseLibraryTab"
        component={ExerciseListScreen}
        initialParams={{ mode: "Browse" }}
        options={{
          title: "Exercises",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="WorkoutExerciseDetail"
        component={WorkoutExerciseDetailScreen}
        options={{ title: "Edit Exercise" }}
      />

      <Stack.Screen
        name="WorkoutSessionDetail"
        component={WorkoutSessionDetailScreen}
        options={{ title: "Workout Saved" }}
      />

      <Stack.Screen
        name="ExerciseProgress"
        component={ExerciseProgressScreen}
        options={{ title: "Exercise Progress" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    height: 86,
    borderTopWidth: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingBottom: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },

  tabBarLabel: {
    fontSize: 12,
    fontWeight: "600",
  },

  fabWrapper: {
    top: -26,
    justifyContent: "center",
    alignItems: "center",
  },

  fab: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#163C43",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: "#EAF3F5",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});