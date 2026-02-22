import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import type { Exercise } from "../types/exercise";

const MOCK_EXERCISES: Exercise[] = [
  { id: "1", name: "Back Squat", muscleGroup: "LEGS", equipment: "BARBELL" },
  { id: "2", name: "Bench Press", muscleGroup: "CHEST", equipment: "BARBELL" },
  { id: "3", name: "Bicep Curl", muscleGroup: "ARMS", equipment: "DUMBBELL" },
];

export default function ExerciseListScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Exercises</Text>

      {/* Search UI scaffold only (no logic yet) */}
      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Search exercises"
          placeholderTextColor="#8b8b8b"
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={MOCK_EXERCISES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
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
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No exercises found.</Text>
          </View>
        }
      />
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
  emptyWrap: { paddingTop: 24, alignItems: "center" },
  emptyText: { color: "#a7a7b3" },
});