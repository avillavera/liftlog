import React from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkoutStore } from "../stores/workoutStore";
import { useWorkoutLogStore } from "../stores/workoutLogStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../navigation/AppNavigator";
import { createEntry, createSession, createSet } from "../api/workout";
import { getErrorMessage } from "../utils/apiError";

type Props = NativeStackScreenProps<AppStackParamList, "WorkoutBuilder">;

export default function WorkoutBuilderScreen({ navigation }: Props) {
  const draft = useWorkoutStore((s) => s.draft);
  const setName = useWorkoutStore((s) => s.setName);
  const removeExercise = useWorkoutStore((s) => s.removeExercise);
  const addLog = useWorkoutLogStore((s) => s.addLog);
  const resetDraft = useWorkoutStore((s) => s.resetDraft);

  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  async function handleFinishWorkout() {
    if (saving) return;
    if (draft.exercises.length === 0) return;

    setSaving(true);
    setSaveError(null);

    try {
      const startedAt = new Date().toISOString();

      const session = await createSession({
        startedAt,
        notes: draft.name.trim() ? draft.name.trim() : null,
      });

      for (const workoutExercise of draft.exercises) {
        const entry = await createEntry(session.id, {
          exerciseId: workoutExercise.exercise.id,
        });

        for (let index = 0; index < workoutExercise.sets.length; index += 1) {
          const set = workoutExercise.sets[index];

          await createSet(entry.id, {
            setNumber: index + 1,
            weight: set.weight,
            reps: set.reps,
          });
        }
      }

      // Temporary: keep local log so current summary/history screens still work
      const log = await addLog(draft);

      resetDraft();
      navigation.navigate("WorkoutSummary", { logId: log.id });
    } catch (err) {
      setSaveError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Workout Builder</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Workout name</Text>
        <TextInput
          value={draft.name}
          onChangeText={setName}
          placeholder="New Workout"
          placeholderTextColor="#8b8b8b"
          style={styles.input}
          autoCorrect={false}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Exercises</Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Text style={styles.count}>{draft.exercises.length}</Text>

              <Pressable onPress={() => navigation.navigate("ExerciseList", { mode: "Select" })} style={styles.addBtn}>
                <Text style={styles.addBtnText}>Add</Text>
              </Pressable>
          </View>
        </View>

        {draft.exercises.length === 0 ? (
          <Text style={styles.muted}>No exercises yet. Add from the library next.</Text>
        ) : (
          <FlatList
            data={draft.exercises}
            keyExtractor={(x) => x.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => navigation.navigate("WorkoutExerciseDetail", { workoutExerciseId: item.id })}
                style={({ pressed }) => [styles.exerciseRow, pressed ? { opacity: 0.7 } : null]}
              >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exerciseName}>{item.exercise.name}</Text>
                    <Text style={styles.exerciseMeta}>
                      {item.exercise.muscleGroup} • {item.exercise.equipment}
                    </Text>
                  </View>

                  <Pressable onPress={() => removeExercise(item.id)} style={styles.removeBtn}>
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </Pressable>
              </Pressable>
            )}
          />
        )}
      </View>

      {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}

      {/* Next task: "Add exercises" via navigation from ExerciseList */}
      <View style={{ height: 12 }} />
      <Pressable
        style={[styles.addBtn, { alignSelf: "flex-start" }]}
        onPress={handleFinishWorkout}
      >
        <Text style={styles.addBtnText}>Finish Workout</Text>
      </Pressable>
      <Text style={styles.muted}>
        Next: choose exercises from the library and add them to this draft.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#1f1f2a",
  },
  addBtnText: { color: "#ffffff", fontWeight: "700", fontSize: 12 },

  container: { flex: 1, backgroundColor: "#0b0b0f", paddingHorizontal: 16, paddingTop: 8 },

  title: { color: "#ffffff", fontSize: 28, fontWeight: "700", marginBottom: 12 },

  card: {
    backgroundColor: "#111118",
    borderWidth: 1,
    borderColor: "#1f1f2a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  label: { color: "#a7a7b3", marginBottom: 6, fontSize: 12, fontWeight: "600" },
  input: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#15151d",
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#232330",
  },

  rowHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  count: { color: "#a7a7b3", fontSize: 14, fontWeight: "700" },

  muted: { color: "#a7a7b3" },

  errorText: {
    color: "#ff7b7b",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },

  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#0f0f15",
    borderWidth: 1,
    borderColor: "#1f1f2a",
  },
  exerciseName: { color: "#ffffff", fontSize: 15, fontWeight: "600" },
  exerciseMeta: { color: "#a7a7b3", fontSize: 12, fontWeight: "500" },

  removeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#1f1f2a",
  },
  removeBtnText: { color: "#ffffff", fontWeight: "700", fontSize: 12 },
});