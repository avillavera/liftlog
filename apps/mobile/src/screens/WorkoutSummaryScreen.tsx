import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../navigation/AppNavigator";
import { useWorkoutLogStore } from "../stores/workoutLogStore";

type Props = NativeStackScreenProps<AppStackParamList, "WorkoutSummary">;

export default function WorkoutSummaryScreen({ route }: Props) {
  const { logId } = route.params;

  const log = useWorkoutLogStore((s) => s.logs.find((x) => x.id === logId));

  if (!log) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.muted}>Workout log not found.</Text>
      </SafeAreaView>
    );
  }

  const totalSets = log.workout.exercises.reduce((acc, we) => acc + we.sets.length, 0);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Saved ✅</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{log.workout.name}</Text>
        <Text style={styles.meta}>
          {log.workout.exercises.length} exercises • {totalSets} sets
        </Text>
      </View>

      <FlatList
        data={log.workout.exercises}
        keyExtractor={(x) => x.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{item.exercise.name}</Text>
            <Text style={styles.rowMeta}>
              {item.sets.length} set{item.sets.length === 1 ? "" : "s"}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0f", paddingHorizontal: 16, paddingTop: 8 },
  title: { color: "#ffffff", fontSize: 28, fontWeight: "800", marginBottom: 12 },

  card: {
    backgroundColor: "#111118",
    borderWidth: 1,
    borderColor: "#1f1f2a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  name: { color: "#ffffff", fontSize: 16, fontWeight: "800", marginBottom: 4 },
  meta: { color: "#a7a7b3", fontSize: 12, fontWeight: "600" },

  row: {
    backgroundColor: "#111118",
    borderWidth: 1,
    borderColor: "#1f1f2a",
    borderRadius: 12,
    padding: 12,
  },
  rowTitle: { color: "#ffffff", fontWeight: "800" },
  rowMeta: { color: "#a7a7b3", fontSize: 12, fontWeight: "600", marginTop: 4 },

  muted: { color: "#a7a7b3" },
});