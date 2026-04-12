import React from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useWorkoutStore } from "../stores/workoutStore";
import { createEntry, createSession, createSet } from "../api/workouts";
import { getErrorMessage } from "../utils/apiError";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type {
  AppTabParamList,
  AppStackParamList,
  StartWorkoutStackParamList,
} from "../navigation/AppNavigator";
import { workoutBuilderStyles as styles } from "../styles/workoutBuilder.styles";
import AppBackground from "../components/AppBackground";
import ScreenHeader from "../components/ScreenHeader";
import SafeAreaViewTab from "../components/SafeAreaViewTab";

type Props = CompositeScreenProps<
  NativeStackScreenProps<StartWorkoutStackParamList, "WorkoutBuilderHome">,
  CompositeScreenProps<
    BottomTabScreenProps<AppTabParamList, "StartWorkoutTab">,
    NativeStackScreenProps<AppStackParamList>
  >
>;

export default function WorkoutBuilderScreen({ navigation }: Props) {
  const draft = useWorkoutStore((s) => s.draft);
  const setName = useWorkoutStore((s) => s.setName);
  const removeExercise = useWorkoutStore((s) => s.removeExercise);
  const resetDraft = useWorkoutStore((s) => s.resetDraft);

  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  async function saveWorkout() {
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

      resetDraft();
      navigation.navigate("WorkoutSessionDetail", { sessionId: session.id });
    } catch (err) {
      setSaveError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function handleFinishWorkout() {
    if (saving) return;
    if (draft.exercises.length === 0) return;

    Alert.alert(
      "Finish workout?",
      "This will save your workout and move you to the summary screen.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Finish", onPress: saveWorkout },
      ]
    );
  }

  return (
    <AppBackground>
      <SafeAreaViewTab>
        <ScreenHeader
          title="Workout Builder"
          subtitle="Start your workout"
        />
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.card}>
            <Text style={styles.label}>Workout name</Text>
            <TextInput
              value={draft.name}
              onChangeText={setName}
              placeholder="New Workout"
              placeholderTextColor="#8A90A3"
              style={styles.input}
              autoCorrect={false}
            />
          </View>

          <View style={styles.card}>
            <View style={styles.rowHeader}>
              <View style={styles.rowHeaderTop}>
                <Text style={styles.sectionTitle}>Exercises</Text>

                <Pressable
                  onPress={() => navigation.navigate("ExerciseList", { mode: "Select" })}
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    pressed ? { opacity: 0.82 } : null,
                  ]}
                >
                  <Text style={styles.secondaryBtnText}>Add</Text>
                </Pressable>
              </View>

              <Text style={styles.sectionSubtitle}>
                Add and edit the exercises in this workout
              </Text>

              {draft.exercises.length > 0 ? (
                <Text style={styles.countText}>
                  {draft.exercises.length} {draft.exercises.length === 1 ? "exercise" : "exercises"}
                </Text>
              ) : null}
            </View>

            {draft.exercises.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No exercises yet</Text>
                <Text style={styles.emptyText}>
                  Add exercises from your library to start building this workout.
                </Text>
              </View>
            ) : (
              <FlatList
                data={draft.exercises}
                keyExtractor={(x) => x.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() =>
                      navigation.navigate("WorkoutExerciseDetail", {
                        workoutExerciseId: item.id,
                      })
                    }
                    style={({ pressed }) => [
                      styles.exerciseRow,
                      pressed ? { opacity: 0.82 } : null,
                    ]}
                  >
                    <View style={styles.exerciseTextWrap}>
                      <Text style={styles.exerciseName}>
                        {item.exercise.name}
                      </Text>
                      <Text style={styles.exerciseMeta}>
                        {item.exercise.muscleGroup} • {item.exercise.equipment}
                      </Text>
                      <Text style={styles.exerciseSets}>
                        {item.sets.length} {item.sets.length === 1 ? "set" : "sets"}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => removeExercise(item.id)}
                      style={({ pressed }) => [
                        styles.removeBtn,
                        pressed ? { opacity: 0.82 } : null,
                      ]}
                    >
                      <Text style={styles.removeBtnText}>Remove</Text>
                    </Pressable>
                  </Pressable>
                )}
              />
            )}
          </View>

          {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              (pressed || saving || draft.exercises.length === 0) ? { opacity: 0.82 } : null,
              draft.exercises.length === 0 ? styles.primaryBtnDisabled : null,
            ]}
            onPress={handleFinishWorkout}
            disabled={saving || draft.exercises.length === 0}
          >
            <Text style={styles.primaryBtnText}>
              {saving ? "Saving..." : "Finish Workout"}
            </Text>
          </Pressable>

          <Text style={styles.helperText}>
            Add exercises, log your sets, and save the session when you're done.
          </Text>
        </ScrollView>
      </SafeAreaViewTab>
    </AppBackground>
  );
}