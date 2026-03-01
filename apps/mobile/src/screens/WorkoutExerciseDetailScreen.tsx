import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../navigation/AppNavigator";
import { useWorkoutStore } from "../stores/workoutStore";

type Props = NativeStackScreenProps<AppStackParamList, "WorkoutExerciseDetail">;

export default function WorkoutExerciseDetailScreen({ route }: Props) {
  const workoutExerciseId = route.params.workoutExerciseId;

  const workoutExercise = useWorkoutStore((s) =>
    s.draft.exercises.find((x) => x.id === workoutExerciseId)
  );

  const addSet = useWorkoutStore((s) => s.addSet);
  const updateSet = useWorkoutStore((s) => s.updateSet);
  const removeSet = useWorkoutStore((s) => s.removeSet);

  const header = useMemo(() => {
    if (!workoutExercise) return null;
    return (
      <View style={styles.headerCard}>
        <Text style={styles.exerciseName}>{workoutExercise.exercise.name}</Text>
        <Text style={styles.exerciseMeta}>
          {workoutExercise.exercise.muscleGroup} • {workoutExercise.exercise.equipment}
        </Text>
      </View>
    );
  }, [workoutExercise]);

  if (!workoutExercise) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.mutedText}>Exercise not found in workout.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {header}

      <View style={styles.rowHeader}>
        <Text style={styles.sectionTitle}>Sets</Text>

        <Pressable onPress={() => addSet(workoutExerciseId)} style={styles.addBtn}>
          <Text style={styles.addBtnText}>Add set</Text>
        </Pressable>
      </View>

      <FlatList
        data={workoutExercise.sets}
        keyExtractor={(s) => s.id}
        contentContainerStyle={workoutExercise.sets.length === 0 ? styles.emptyContent : styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={<Text style={styles.mutedText}>No sets yet. Add your first set.</Text>}
        renderItem={({ item, index }) => (
          <View style={styles.setRow}>
            <Text style={styles.setIndex}>Set {index + 1}</Text>

            <View style={styles.inputsRow}>
              <View style={styles.inputWrap}>
                <Text style={styles.inputLabel}>Weight</Text>
                <TextInput
                  value={String(item.weight)}
                  onChangeText={(v) =>
                    updateSet({
                      workoutExerciseId,
                      setId: item.id,
                      weight: Number(v || 0),
                      reps: item.reps,
                    })
                  }
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#8b8b8b"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputWrap}>
                <Text style={styles.inputLabel}>Reps</Text>
                <TextInput
                  value={String(item.reps)}
                  onChangeText={(v) =>
                    updateSet({
                      workoutExerciseId,
                      setId: item.id,
                      reps: Number(v || 0),
                      weight: item.weight,
                    })
                  }
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#8b8b8b"
                  style={styles.input}
                />
              </View>

              <Pressable
                onPress={() => removeSet({ workoutExerciseId, setId: item.id })}
                style={styles.removeBtn}
              >
                <Text style={styles.removeBtnText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0f", paddingHorizontal: 16, paddingTop: 8 },

  headerCard: {
    backgroundColor: "#111118",
    borderWidth: 1,
    borderColor: "#1f1f2a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  exerciseName: { color: "#ffffff", fontSize: 18, fontWeight: "700", marginBottom: 4 },
  exerciseMeta: { color: "#a7a7b3", fontSize: 12, fontWeight: "600" },

  rowHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  sectionTitle: { color: "#ffffff", fontSize: 16, fontWeight: "700" },

  addBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: "#1f1f2a" },
  addBtnText: { color: "#ffffff", fontWeight: "700", fontSize: 12 },

  listContent: { paddingBottom: 20 },
  emptyContent: { paddingBottom: 20, flexGrow: 1 },

  setRow: {
    backgroundColor: "#111118",
    borderWidth: 1,
    borderColor: "#1f1f2a",
    borderRadius: 12,
    padding: 12,
  },
  setIndex: { color: "#ffffff", fontWeight: "700", marginBottom: 10 },

  inputsRow: { flexDirection: "row", alignItems: "flex-end", gap: 10 },
  inputWrap: { flex: 1 },
  inputLabel: { color: "#a7a7b3", fontSize: 12, fontWeight: "600", marginBottom: 6 },
  input: {
    height: 42,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#15151d",
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#232330",
  },

  removeBtn: { paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, backgroundColor: "#1f1f2a" },
  removeBtnText: { color: "#ffffff", fontWeight: "700", fontSize: 12 },

  mutedText: { color: "#a7a7b3" },
});