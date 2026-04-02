import React from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../navigation/AppNavigator";
import { deleteSession, getSessionById } from "../api/workouts";
import { getErrorMessage } from "../utils/apiError";

type Props = NativeStackScreenProps<AppStackParamList, "WorkoutSessionDetail">;

type SessionDetail = Awaited<ReturnType<typeof getSessionById>>;

function formatDate(value: string){
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
      <SafeAreaView style={styles.container}>
        <View style={styles.centerWrap}>
          <ActivityIndicator />
          <View style={{ height: 10 }} />
          <Text style={styles.muted}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerWrap}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.muted}>Workout not found.</Text>
      </SafeAreaView>
    );
  }

  const totalSets = session.entries.reduce((acc, entry) => acc + entry.sets.length, 0);
  const workoutName = session.notes?.trim() ? session.notes.trim() : "Workout";

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={session.entries}
        keyExtractor={(x) => x.id}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Workout Details</Text>

            <View style={styles.card}>
              <Text style={styles.name}>{workoutName}</Text>
              <Text style={styles.meta}>
                {session.entries.length} exercises • {totalSets} sets
              </Text>
              <Text style={styles.meta}>{formatDate(session.createdAt)}</Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </>
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{item.exercise.name}</Text>
            <Text style={styles.rowMeta}>
              {item.exercise.muscleGroup} • {item.exercise.equipment}
            </Text>

            <View style={{ height: 10 }} />

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
            <View style={{ height: 12 }} />

            <Pressable
              onPress={() =>
                navigation.navigate("ExerciseProgress", {
                  exerciseId: item.exercise.id,
                  exerciseName: item.exercise.name,
                })
              }
              style={({ pressed }) => [
                styles.progressBtn,
                pressed ? { opacity: 0.7 } : null,
              ]}
            >
              <Text style={styles.progressBtnText}>View Progress</Text>
            </Pressable>
          </View>
        )}
        ListFooterComponent={
          <>
            <View style={{ height: 16 }} />

            <Pressable
              onPress={handleDelete}
              disabled={deleting}
              style={({ pressed }) => [
                styles.deleteBtn,
                (pressed || deleting) ? { opacity: 0.7 } : null,
              ]}
            >
              <Text style={styles.deleteBtnText}>
                {deleting ? "Deleting..." : "Delete Workout"}
              </Text>
            </Pressable>
          </>
        }
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

  setRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#1f1f2a",
  },

  setLabel: { color: "#ffffff", fontSize: 13, fontWeight: "700" },
  setValue: { color: "#a7a7b3", fontSize: 13, fontWeight: "600" },

  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#2a1414",
    borderWidth: 1,
    borderColor: "#4a2020",
    alignItems: "center",
  },

  deleteBtnText: { color: "#ff8d8d", fontWeight: "700", fontSize: 13 },

  centerWrap: { flex: 1, alignItems: "center", justifyContent: "center" },

  muted: { color: "#a7a7b3" },

  errorText: {
    color: "#ff7b7b",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },

  progressBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#141c2a",
    borderWidth: 1,
    borderColor: "#22314d",
    alignItems: "center",
  },

progressBtnText: {
    color: "#9ec5ff",
    fontWeight: "700",
    fontSize: 13,
  },
});