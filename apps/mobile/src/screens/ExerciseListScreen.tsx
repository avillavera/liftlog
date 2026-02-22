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
  const debouncedQuery = useDebouncedValue(query, 350);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorMsg(null);

      try {
        const data = await getExercises({ 
          limit: 20,
          q: debouncedQuery.trim() ? debouncedQuery.trim() : undefined,
        });
        if (cancelled) return;
        setItems(data.items);
      } catch {
        if (cancelled) return;
        setErrorMsg("Could not load exercises. Check server connection.");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    load();

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