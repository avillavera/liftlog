import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../navigation/AppNavigator";
import { getSessionById } from "../api/workouts";
import { getErrorMessage } from "../utils/apiError";

type Props = NativeStackScreenProps<AppStackParamList, "WorkoutSummary">;

type SessionDetail = Awaited<ReturnType<typeof getSessionById>>;

export default function WorkoutSummaryScreen({ route }: Props) {
  const { logId } = route.params;

  const [session, setSession] = React.useState<SessionDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadSession = React.useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const data = await getSessionById(logId);
      setSession(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [logId]);

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

  if (error) {
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
      <Text style={styles.title}>Saved ✅</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{workoutName}</Text>
        <Text style={styles.meta}>
          {session.entries.length} exercises • {totalSets} sets
        </Text>
      </View>

      <FlatList
        data={session.entries}
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

  centerWrap: { flex: 1, alignItems: "center", justifyContent: "center" },

  muted: { color: "#a7a7b3" },

  errorText: { color: "#ff7b7b", fontSize: 13, fontWeight: "600", textAlign: "center" },
});