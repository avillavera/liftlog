import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../navigation/AppNavigator";
import { deleteSession, getSessionById } from "../api/workouts";
import { getErrorMessage } from "../utils/apiError";
import AppBackground from "../components/AppBackground";
import ScreenHeader from "../components/ScreenHeader";
import SafeAreaViewStack from "../components/SafeAreaViewStack";
import SafeAreaViewTab from "../components/SafeAreaViewTab";

type Props = NativeStackScreenProps<AppStackParamList, "WorkoutSessionDetail">;

type SessionDetail = Awaited<ReturnType<typeof getSessionById>>;

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export default function WorkoutSessionDetailScreen({ navigation, route }: Props) {
  const { sessionId } = route.params;

  const [session, setSession] = React.useState<SessionDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const loadSession = React.useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const data = await getSessionById(sessionId);
      setSession(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  async function handleDelete() {
    if (!session || deleting) return;

    try {
      setDeleting(true);
      setError(null);

      await deleteSession(session.id);
      navigation.goBack();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  React.useEffect(() => {
    loadSession();
  }, [loadSession]);

  if (loading) {
    return (
      <AppBackground>
        <SafeAreaViewTab>
          <ScreenHeader
            title="Workout Details"
            subtitle="Review your completed workout"
          />

          <View style={styles.centerWrap}>
            <ActivityIndicator />
            <View style={styles.spacer10} />
            <Text style={styles.muted}>Loading workout...</Text>
          </View>
        </SafeAreaViewTab>
      </AppBackground>
    );
  }

  if (error && !session) {
    return (
      <AppBackground>
        <SafeAreaViewTab>
          <ScreenHeader
            title="Workout Details"
            subtitle="Review your completed workout"
          />

          <View style={styles.centerWrap}>
            <Text style={styles.errorText}>{error}</Text>

            <View style={styles.spacer12} />

            <Pressable
              onPress={loadSession}
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed ? { opacity: 0.82 } : null,
              ]}
            >
              <Text style={styles.secondaryBtnText}>Retry</Text>
            </Pressable>
          </View>
        </SafeAreaViewTab>
      </AppBackground>
    );
  }

  if (!session) {
    return (
      <AppBackground>
        <SafeAreaViewTab>
          <ScreenHeader
            title="Workout Details"
            subtitle="Review your completed workout"
          />

          <View style={styles.centerWrap}>
            <Text style={styles.muted}>Workout not found.</Text>
          </View>
        </SafeAreaViewTab>
      </AppBackground>
    );
  }

  const totalSets = session.entries.reduce((acc, entry) => acc + entry.sets.length, 0);
  const workoutName = session.notes?.trim() ? session.notes.trim() : "Workout";

  return (
    <AppBackground>
      <SafeAreaViewStack>
        <ScreenHeader
                title="Workout Details"
                subtitle="Review your completed workout"
        />
        <View style={styles.summaryCard}>
                <Text style={styles.summaryName}>{workoutName}</Text>
                <Text style={styles.summaryMeta}>
                  {session.entries.length} exercises • {totalSets} sets
                </Text>
                <Text style={styles.summaryDate}>{formatDate(session.createdAt)}</Text>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <FlatList
          data={session.entries}
          keyExtractor={(x) => x.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{item.exercise.name}</Text>
              <Text style={styles.exerciseMeta}>
                {item.exercise.muscleGroup} • {item.exercise.equipment}
              </Text>

              <View style={styles.spacer12} />

              {item.sets.length === 0 ? (
                <Text style={styles.muted}>No sets recorded.</Text>
              ) : (
                item.sets
                  .slice()
                  .sort((a, b) => a.setNumber - b.setNumber)
                  .map((set) => (
                    <View key={set.id} style={styles.setRow}>
                      <Text style={styles.setLabel}>Set {set.setNumber}</Text>
                      <Text style={styles.setValue}>
                        {set.weight} lb × {set.reps}
                      </Text>
                    </View>
                  ))
              )}

              <View style={styles.spacer14} />

              <Pressable
                onPress={() =>
                  navigation.navigate("ExerciseProgress", {
                    exerciseId: item.exercise.id,
                    exerciseName: item.exercise.name,
                  })
                }
                style={({ pressed }) => [
                  styles.progressBtn,
                  pressed ? { opacity: 0.82 } : null,
                ]}
              >
                <Text style={styles.progressBtnText}>View Progress</Text>
              </Pressable>
            </View>
          )}
        />
        <>
          <View style={styles.spacer18} />

          <Pressable
            onPress={handleDelete}
            disabled={deleting}
            style={({ pressed }) => [
              styles.deleteBtn,
              (pressed || deleting) ? { opacity: 0.82 } : null,
            ]}
          >
            <Text style={styles.deleteBtnText}>
              {deleting ? "Deleting..." : "Delete Workout"}
            </Text>
          </Pressable>
        </>
      </SafeAreaViewStack>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },

  listContent: {
    paddingBottom: 140,
  },

  separator: {
    height: 14,
  },

  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  summaryCard: {
    backgroundColor: "#F7F5F8",
    borderWidth: 1,
    borderColor: "#E3E0E6",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 14,
  },

  summaryName: {
    color: "#0B1530",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },

  summaryMeta: {
    color: "#7D8496",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  summaryDate: {
    color: "#8A90A3",
    fontSize: 14,
    fontWeight: "500",
  },

  exerciseCard: {
    backgroundColor: "#F7F5F8",
    borderWidth: 1,
    borderColor: "#E3E0E6",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  exerciseName: {
    color: "#0B1530",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 3,
  },

  exerciseMeta: {
    color: "#7D8496",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  setRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E7E3E9",
  },

  setLabel: {
    color: "#0B1530",
    fontSize: 14,
    fontWeight: "700",
  },

  setValue: {
    color: "#7D8496",
    fontSize: 14,
    fontWeight: "600",
  },

  progressBtn: {
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#D7E5FF",
    alignItems: "center",
    justifyContent: "center",
  },

  progressBtnText: {
    color: "#2454A6",
    fontWeight: "700",
    fontSize: 14,
  },

  deleteBtn: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#FCEDEE",
    borderWidth: 1,
    borderColor: "#F3D4D8",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteBtnText: {
    color: "#B5475A",
    fontWeight: "700",
    fontSize: 14,
  },

  secondaryBtn: {
    minHeight: 46,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: "#0B1530",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  muted: {
    color: "#7D8496",
    fontSize: 16,
    textAlign: "center",
  },

  errorText: {
    color: "#C65B68",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },

  spacer10: {
    height: 10,
  },

  spacer12: {
    height: 12,
  },

  spacer14: {
    height: 14,
  },

  spacer18: {
    height: 18,
  },
});