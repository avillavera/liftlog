import React from "react";
import {ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../navigation/AppNavigator";
import { getSessions } from "../api/workouts";
import { getErrorMessage } from "../utils/apiError";

type Props = NativeStackScreenProps<AppStackParamList, "WorkoutHistory">;

type SessionListItem = Awaited<ReturnType<typeof getSessions>>["items"][number];

function formatDate(ts: string): string {
  return new Date(ts).toLocaleString();
}

export default function WorkoutHistoryScreen({ navigation }: Props) {
  const [sessions, setSessions] = React.useState<SessionListItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadSessions = React.useCallback(async (mode: "initial" | "refresh" = "initial") => {
    try {
      setError(null);


      if (mode === "initial") {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const data = await getSessions();
      setSessions(data.items);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      if (mode === "initial") {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadSessions("initial");
    }, [loadSessions])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerWrap}>
          <ActivityIndicator />
          <View style={{ height: 10 }} />
          <Text style={styles.muted}>Loading workouts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && sessions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerWrap}>
          <Text style={styles.errorText}>{error}</Text>

          <View style={{ height: 12 }} />

          <Pressable onPress={() => loadSessions("initial")} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Workout History</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {sessions.length === 0 ? (
        <View style={styles.centerWrap}>
          <Text style={styles.muted}>No workouts yet. Finish one to see it here.</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(x) => x.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          refreshing={refreshing}
          onRefresh={() => loadSessions("refresh")}
          renderItem={({ item }) => {
            const totalSets = item.entries.reduce((acc, entry) => acc + entry.sets.length, 0);
            const workoutName = item.notes?.trim() ? item.notes.trim() : "Workout";

            return (
              <Pressable
                onPress={() => navigation.navigate("WorkoutSummary", { logId: item.id })}
                style={({ pressed }) => [styles.row, pressed ? { opacity: 0.7 } : null]}
              >
                <Text style={styles.rowTitle}>{workoutName}</Text>
                <Text style={styles.rowMeta}>
                  {formatDate(item.createdAt)} • {item.entries.length} exercises • {totalSets} sets
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

  errorText: {
    color: "#ff7b7b",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  retryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#1f1f2a",
  },
  retryBtnText: { color: "#ffffff", fontWeight: "700", fontSize: 12 },
});