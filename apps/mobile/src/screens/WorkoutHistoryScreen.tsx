import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppTabParamList, AppStackParamList } from "../navigation/AppNavigator";
import { getSessions } from "../api/workouts";
import { getErrorMessage } from "../utils/apiError";
import AppBackground from "../components/AppBackground";
import ScreenHeader from "../components/ScreenHeader";
import SafeAreaViewTab from "../components/SafeAreaViewTab";

type Props = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, "HistoryTab">,
  NativeStackScreenProps<AppStackParamList>
>;

type SessionListItem = Awaited<ReturnType<typeof getSessions>>["items"][number];

function formatDate(ts: string): string {
  return new Date(ts).toLocaleString();
}

export default function WorkoutHistoryScreen({ navigation }: Props) {
  const [sessions, setSessions] = React.useState<SessionListItem[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [hasScrolled, setHasScrolled] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);

  const [error, setError] = React.useState<string | null>(null);

  const loadSessions = React.useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      try {
        setError(null);

        if (mode === "initial") {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        const data = await getSessions({ page: 1, limit: 10 });

        setSessions(data.items);
        setPage(data.page);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        if (mode === "initial") {
          setLoading(false);
        } else {
          setRefreshing(false);
        }
      }
    },
    []
  );

  const loadMore = React.useCallback(async () => {
    if (!hasScrolled || loading || refreshing || loadingMore || !hasMore) {
      return;
    }

    try {
      setLoadingMore(true);
      setError(null);

      const nextPage = page + 1;
      const data = await getSessions({ page: nextPage, limit: 10 });

      setSessions((current) => [...current, ...data.items]);
      setPage(data.page);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, hasScrolled, loading, loadingMore, page, refreshing]);

  useFocusEffect(
    React.useCallback(() => {
      loadSessions("initial");
    }, [loadSessions])
  );

  if (loading) {
    return (
      <AppBackground>
        <SafeAreaViewTab>
          <ScreenHeader
            title="Workout History"
            subtitle="Check your past workouts and track your progress"
          />

          <View style={styles.centerWrap}>
            <ActivityIndicator />
            <View style={styles.spacer10} />
            <Text style={styles.muted}>Loading workouts...</Text>
          </View>
        </SafeAreaViewTab>
      </AppBackground>
    );
  }

  if (error && sessions.length === 0) {
    return (
      <AppBackground>
        <SafeAreaViewTab>
          <ScreenHeader
            title="Workout History"
            subtitle="Check your past workouts and track your progress"
          />

          <View style={styles.centerWrap}>
            <Text style={styles.errorText}>{error}</Text>

            <View style={styles.spacer12} />

            <Pressable
              onPress={() => loadSessions("initial")}
              style={({ pressed }) => [
                styles.retryBtn,
                pressed ? { opacity: 0.82 } : null,
              ]}
            >
              <Text style={styles.retryBtnText}>Retry</Text>
            </Pressable>
          </View>
        </SafeAreaViewTab>
      </AppBackground>
    );
  }

  return (
    <AppBackground>
      <SafeAreaViewTab>
        <ScreenHeader
          title="Workout History"
          subtitle="Check your past workouts and track your progress"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {sessions.length === 0 ? (
          <View style={styles.centerWrap}>
            <Text style={styles.muted}>
              No workouts yet. Finish one to see it here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={sessions}
            keyExtractor={(x) => x.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshing={refreshing}
            onRefresh={() => loadSessions("refresh")}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            onScrollBeginDrag={() => setHasScrolled(true)}
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator />
                </View>
              ) : null
            }
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const totalSets = item.entries.reduce(
                (acc, entry) => acc + entry.sets.length,
                0
              );
              const workoutName = item.notes?.trim() ? item.notes.trim() : "Workout";

              return (
                <Pressable
                  onPress={() =>
                    navigation.navigate("WorkoutSessionDetail", {
                      sessionId: item.id,
                    })
                  }
                  style={({ pressed }) => [
                    styles.row,
                    pressed ? { opacity: 0.82 } : null,
                  ]}
                >
                  <Text style={styles.rowTitle}>{workoutName}</Text>
                  <Text style={styles.rowMeta}>
                    {formatDate(item.createdAt)}
                  </Text>
                  <Text style={styles.rowSummary}>
                    {item.entries.length} exercises • {totalSets} sets
                  </Text>
                </Pressable>
              );
            }}
          />
        )}
      </SafeAreaViewTab>
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

  row: {
    backgroundColor: "#F7F5F8",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#E3E0E6",
  },

  rowTitle: {
    color: "#0B1530",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },

  rowMeta: {
    color: "#7D8496",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },

  rowSummary: {
    color: "#8A90A3",
    fontSize: 14,
    fontWeight: "600",
  },

  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
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
  },

  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },

  retryBtn: {
    minHeight: 46,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: "#0B1530",
  },

  retryBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  spacer10: {
    height: 10,
  },

  spacer12: {
    height: 12,
  },
});