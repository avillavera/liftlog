import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../navigation/AppNavigator";
import { useWorkoutLogStore } from "../stores/workoutLogStore";

type Props = NativeStackScreenProps<AppStackParamList, "WorkoutHistory">;

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString();
}

export default function WorkoutHistoryScreen({ navigation }: Props) {
  const logs = useWorkoutLogStore((s) => s.logs);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Workout History</Text>

      {logs.length === 0 ? (
        <View style={styles.centerWrap}>
          <Text style={styles.muted}>No workouts yet. Finish one to see it here.</Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(x) => x.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => {
            const totalSets = item.workout.exercises.reduce((acc, we) => acc + we.sets.length, 0);

            return (
              <Pressable
                onPress={() => navigation.navigate("WorkoutSummary", { logId: item.id })}
                style={({ pressed }) => [styles.row, pressed ? { opacity: 0.7 } : null]}
              >
                <Text style={styles.rowTitle}>{item.workout.name}</Text>
                <Text style={styles.rowMeta}>
                  {formatDate(item.createdAt)} • {item.workout.exercises.length} exercises • {totalSets} sets
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0f", paddingHorizontal: 16, paddingTop: 8 },
  title: { color: "#ffffff", fontSize: 28, fontWeight: "800", marginBottom: 12 },

  row: {
    backgroundColor: "#111118",
    borderWidth: 1,
    borderColor: "#1f1f2a",
    borderRadius: 12,
    padding: 12,
  },
  rowTitle: { color: "#ffffff", fontWeight: "800", marginBottom: 4 },
  rowMeta: { color: "#a7a7b3", fontSize: 12, fontWeight: "600" },

  centerWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  muted: { color: "#a7a7b3" },
});