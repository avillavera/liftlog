import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getExercises } from "../api/exercises";
import type { Exercise } from "../types/exercise";
import useDebouncedValue from "../hooks/useDebouncedValue";

export default function ExerciseListScreen() {
  const [items, setItems] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 350);

  async function handleEndReached() {
    if (loading) return;
    if (loadingMore) return;
    if (!nextCursor) return;

    setLoadingMore(true);
    setErrorMsg(null);

    try {
      const data = await getExercises({
        limit: 10,
        cursor: nextCursor,
        q: debouncedQuery.trim() ? debouncedQuery.trim() : undefined,
      });
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

    try {
      const data = await getExercises({
        limit: 10,
        q: debouncedQuery.trim() ? debouncedQuery.trim() : undefined,
      });

      setItems(data.items);
      setNextCursor(data.nextCursor);
    } catch {
      setErrorMsg("Could not refresh exercises.");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadFirstPage() {
      setLoading(true);
      setLoadingMore(false);
      setErrorMsg(null);

      try {
        setItems([]);
        setNextCursor(null);
        const data = await getExercises({ 
          limit: 10,
          q: debouncedQuery.trim() ? debouncedQuery.trim() : undefined,
        });

        if (cancelled) return;

        setItems(data.items);
        setNextCursor(data.nextCursor);
      } catch {
        if (cancelled) return;
        setErrorMsg("Could not load exercises. Check server connection.");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    loadFirstPage();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

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

      {loading ? (
        <View style={styles.centerWrap}>
          <Text style={styles.mutedText}>Loading…</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.centerWrap}>
          <Text style={styles.mutedText}>{errorMsg}</Text>
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
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.muscleGroup} • {item.equipment}
                </Text>
              </View>
            </View>
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

  centerWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 12 },
  mutedText: { color: "#a7a7b3" },
});