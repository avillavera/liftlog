import React from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../navigation/AppNavigator";
import { useWorkoutStore } from "../stores/workoutStore";
import { exerciseDetailStyles as styles } from "../styles/workoutExerciseDetail.styles";
import AppBackground from "../components/AppBackground";
import SafeAreaViewStack from "../components/SafeAreaViewStack";

type Props = NativeStackScreenProps<AppStackParamList, "WorkoutExerciseDetail">;

function toNumber(input: string): number {
  if (input.trim() === "") return 0;
  const n = Number(input);
  return Number.isFinite(n) ? n : 0;
}

export default function WorkoutExerciseDetailScreen({ route }: Props) {
  const { workoutExerciseId } = route.params;

  const workoutExercise = useWorkoutStore((s) =>
    s.draft.exercises.find((x) => x.id === workoutExerciseId)
  );

  const addSet = useWorkoutStore((s) => s.addSet);
  const updateSet = useWorkoutStore((s) => s.updateSet);
  const removeSet = useWorkoutStore((s) => s.removeSet);

  if (!workoutExercise) {
    return (
      <AppBackground>
        <SafeAreaViewStack>
          <View style={styles.centerWrap}>
            <Text style={styles.muted}>Exercise not found.</Text>
          </View>
        </SafeAreaViewStack>
      </AppBackground>
    );
  }

  return (
    <AppBackground>
      <SafeAreaViewStack>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.flex}>
              <View style={styles.headerCard}>
                <Text style={styles.exerciseName}>
                  {workoutExercise.exercise.name}
                </Text>
                <Text style={styles.exerciseMeta}>
                  {workoutExercise.exercise.muscleGroup} •{" "}
                  {workoutExercise.exercise.equipment}
                </Text>
              </View>

              <View style={styles.topRow}>
                <View>
                  <Text style={styles.sectionTitle}>Sets</Text>
                  <Text style={styles.sectionSubtitle}>
                    Log the weight and reps for each set
                  </Text>
                </View>

                <Pressable
                  onPress={() => addSet(workoutExerciseId)}
                  style={({ pressed }) => [
                    styles.addBtn,
                    pressed ? { opacity: 0.82 } : null,
                  ]}
                >
                  <Text style={styles.addBtnText}>Add set</Text>
                </Pressable>
              </View>

              <FlatList
                keyboardShouldPersistTaps="handled"
                data={workoutExercise.sets}
                keyExtractor={(s) => s.id}
                contentContainerStyle={
                  workoutExercise.sets.length === 0
                    ? styles.emptyContent
                    : styles.listContent
                }
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No sets yet</Text>
                    <Text style={styles.emptyText}>
                      Add your first set to start logging.
                    </Text>
                  </View>
                }
                renderItem={({ item, index }) => (
                  <View style={styles.setCard}>
                    <View style={styles.setHeader}>
                      <Text style={styles.setTitle}>Set {index + 1}</Text>

                      <Pressable
                        onPress={() =>
                          removeSet({
                            workoutExerciseId,
                            setId: item.id,
                          })
                        }
                        style={({ pressed }) => [
                          styles.removeBtn,
                          pressed ? { opacity: 0.82 } : null,
                        ]}
                      >
                        <Text style={styles.removeBtnText}>Remove</Text>
                      </Pressable>
                    </View>

                    <View style={styles.inputsRow}>
                      <View style={styles.inputWrap}>
                        <Text style={styles.inputLabel}>Weight</Text>
                        <TextInput
                          value={String(item.weight)}
                          onChangeText={(v) =>
                            updateSet({
                              workoutExerciseId,
                              setId: item.id,
                              weight: toNumber(v),
                              reps: item.reps,
                            })
                          }
                          keyboardType="numeric"
                          returnKeyType="done"
                          placeholder="0"
                          placeholderTextColor="#8A90A3"
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
                              reps: toNumber(v),
                              weight: item.weight,
                            })
                          }
                          keyboardType="numeric"
                          returnKeyType="done"
                          placeholder="0"
                          placeholderTextColor="#8A90A3"
                          style={styles.input}
                        />
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaViewStack>
    </AppBackground>
  );
}