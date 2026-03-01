import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getExercises } from "../api/exercises";
import type { Exercise } from "../types/exercise";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../navigation/AppNavigator";
import { useWorkoutStore } from "../stores/workoutStore";
import useDebouncedValue from "../hooks/useDebouncedValue";

type Props = NativeStackScreenProps<AppStackParamList, "ExerciseList">;

export default function ExerciseListScreen({ navigation, route }: Props) {
  const [items, setItems] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const searchingStartRef = useRef<number | null>(null);
  const searchingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedOnceRef = useRef(false);
  const requestIdRef = useRef(0);
  const mode = route.params?.mode ?? "Browse";
  const addExercise = useWorkoutStore((s) => s.addExercise);

  const debouncedQuery = useDebouncedValue(query, 350);

  async function handleEndReached() {
    if (loading) return;
    if (loadingMore) return;
    if (!nextCursor) return;

    setLoadingMore(true);
    setErrorMsg(null);

    try {
      const requestId = ++requestIdRef.current;
      const data = await getExercises({
        limit: 10,
        cursor: nextCursor,
        q: debouncedQuery.trim() ? debouncedQuery.trim() : undefined,
      });
      if (requestId !== requestIdRef.current) return;
      setNextCursor(data.nextCursor);
      setItems((prev) => {
        const seen = new Set(prev.map((x) => x.id));
        const merged = [...prev];
        for (const item of data.items) {
          if (!seen.has(item.id)) merged.push(item);
        }
        return merged;
      });
    } catch {
      setErrorMsg("Could not load more exercises.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    setErrorMsg(null);
    setLoadingMore(false);
    setNextCursor(null);

    try {
      const requestId = ++requestIdRef.current;

      const data = await getExercises({
        limit: 10,
        q: debouncedQuery.trim() ? debouncedQuery.trim() : undefined,
      });

      if (requestId !== requestIdRef.current) return;

      setItems(data.items);
      setNextCursor(data.nextCursor);
    } catch {
      setErrorMsg("Could not refresh exercises.");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleRetry() {
    setErrorMsg(null);
    setLoading(true);

    try {
      const requestId = ++requestIdRef.current;
      setLoadingMore(false);
      setNextCursor(null);
      setSearching(false);
      const data = await getExercises({
        limit: 10,
        q: debouncedQuery.trim() ? debouncedQuery.trim() : undefined,
      });

      if (requestId !== requestIdRef.current) return;

      setItems(data.items);
      setNextCursor(data.nextCursor);
      hasLoadedOnceRef.current = true;
    } catch {
      setErrorMsg("Still cannot reach server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadFirstPage() {
      const isInitialLoad = !hasLoadedOnceRef.current;

      if (isInitialLoad){ 
        searchingStartRef.current = null;
        setLoading(true);
      }
      else {
        setSearching(true);
        searchingStartRef.current = Date.now();
      }

      setLoadingMore(false);
      setErrorMsg(null);
      setNextCursor(null);

      try {

        const requestId = ++requestIdRef.current;

        const data = await getExercises({ 
          limit: 10,
          q: debouncedQuery.trim() ? debouncedQuery.trim() : undefined,
        });

        if (cancelled) return;
        if (requestId === requestIdRef.current) {
          setItems(data.items);
          setNextCursor(data.nextCursor);
          hasLoadedOnceRef.current = true;
        }
      } catch {
        if (cancelled) return;
        setErrorMsg("Could not load exercises. Check server connection.");
      } finally {
        if (cancelled) return;
        setLoading(false);
        const startedAt = searchingStartRef.current;
        if (!startedAt) {
          setSearching(false);
        } else {
          const elapsed = Date.now() - startedAt;
          const minMs = 500;
          const remaining = Math.max(0, minMs - elapsed);

          if (searchingTimeoutRef.current) clearTimeout(searchingTimeoutRef.current);

          searchingTimeoutRef.current = setTimeout(() => {
            setSearching(false);
            searchingStartRef.current = null;
            searchingTimeoutRef.current = null;
          }, remaining);
        }
      }
    }

    loadFirstPage();

    return () => {
      cancelled = true;
      if (searchingTimeoutRef.current) clearTimeout(searchingTimeoutRef.current);
    };
  }, [debouncedQuery]);

  useEffect(() => {
    if (mode !== "Select") return;
    setSelectedIds(new Set());
  }, [mode, debouncedQuery]);

  useLayoutEffect(() => {
    if (mode !== "Select") return;

    navigation.setOptions({
      title: "Select Exercises",
      headerRight: () => (
        <Pressable onPress={() => navigation.goBack()} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text style={{ color: "#ffffff", fontWeight: "700" }}>Done</Text>
        </Pressable>
      ),
    });
  }, [mode, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Exercises</Text>

      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search exercises"
          placeholderTextColor="#8b8b8b"
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      {searching ? <Text style={styles.searchingText}>Searching…</Text> : null}
      {mode === "Select" ? <Text style={styles.searchingText}>Tap an exercise to add</Text> : null}
      {loading ? (
        <View style={styles.centerWrap}>
          <Text style={styles.mutedText}>Loading…</Text>
        </View>
      ) : errorMsg && items.length === 0 ? (
        <View style={styles.centerWrap}>
          <Text style={styles.mutedText}>{errorMsg}</Text>

          <View style={{ height: 12 }} />

          <Text onPress={handleRetry} style={styles.retryBtn}>
            Retry
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={items.length === 0 ? styles.emptyContent : styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.6}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 16, alignItems: "center" }}>
                <Text style={styles.mutedText}>Loading more…</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (mode !== "Select") return;

              addExercise(item);
              setSelectedIds((prev) => {
                const next = new Set(prev);
                next.add(item.id);
                return next;
              });
            }}
            disabled={mode !== "Select"}
            style={({ pressed }) => [
              styles.row,
              mode === "Select" && pressed ? { opacity: 0.7 } : null,
            ]}
          >
            <View style={styles.rowInner}>
              <View style={styles.rowText}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.muscleGroup} • {item.equipment}
                </Text>
              </View>

              {mode === "Select" && selectedIds.has(item.id) ? (
                <Text style={styles.addedPill}>Added</Text>
              ) : null}
            </View>
          </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.centerWrap}>
              <Text style={styles.mutedText}>No exercises found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0f", paddingHorizontal: 16, paddingTop: 8 },
  title: { color: "#ffffff", fontSize: 28, fontWeight: "700", marginBottom: 12 },

  searchWrap: { marginBottom: 12 },
  searchInput: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#15151d",
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#232330",
  },

  listContent: { paddingBottom: 20 },
  emptyContent: { paddingBottom: 20, flexGrow: 1 },
  
  row: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#111118",
    borderWidth: 1,
    borderColor: "#1f1f2a",
  },
  rowText: { gap: 4 },
  name: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  meta: { color: "#a7a7b3", fontSize: 12, fontWeight: "500" },
  
  separator: { height: 10 },
  searchingText: { color: "#a7a7b3", marginBottom: 8 },
  centerWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 12 },
  mutedText: { color: "#a7a7b3" },
  retryBtn: {
    color: "#fff",
    fontWeight: "600",
    backgroundColor: "#1f1f2a",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },

  rowInner: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  addedPill: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    backgroundColor: "#1f1f2a",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
});