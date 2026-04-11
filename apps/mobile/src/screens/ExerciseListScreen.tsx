import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompositeScreenProps, RouteProp } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { getExercises } from "../api/exercises";
import type { Exercise } from "../types/exercise";
import type {
  AppTabParamList,
  AppStackParamList,
  StartWorkoutStackParamList,
} from "../navigation/AppNavigator";
import { useWorkoutStore } from "../stores/workoutStore";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { exerciseListStyles as styles } from "../styles/exerciseList.styles";
import ScreenHeader from "../components/ScreenHeader";
import AppBackground from "../components/AppBackground";

type ExerciseLibraryTabProps = BottomTabScreenProps<
  AppTabParamList,
  "ExerciseLibraryTab"
>;

type SelectExerciseStackProps = CompositeScreenProps<
  NativeStackScreenProps<StartWorkoutStackParamList, "ExerciseList">,
  NativeStackScreenProps<AppStackParamList>
>;

type Props = {
  navigation: ExerciseLibraryTabProps["navigation"] | SelectExerciseStackProps["navigation"];
  route:
    | RouteProp<AppTabParamList, "ExerciseLibraryTab">
    | RouteProp<StartWorkoutStackParamList, "ExerciseList">;
};

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
          if (!seen.has(item.id)) {
            merged.push(item);
          }
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
    setLoadingMore(false);
    setNextCursor(null);
    setSearching(false);

    try {
      const requestId = ++requestIdRef.current;

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

      if (isInitialLoad) {
        searchingStartRef.current = null;
        setLoading(true);
      } else {
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
        if (requestId !== requestIdRef.current) return;

        setItems(data.items);
        setNextCursor(data.nextCursor);
        hasLoadedOnceRef.current = true;
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

          if (searchingTimeoutRef.current) {
            clearTimeout(searchingTimeoutRef.current);
          }

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

      if (searchingTimeoutRef.current) {
        clearTimeout(searchingTimeoutRef.current);
      }
    };
  }, [debouncedQuery]);

  useEffect(() => {
    if (mode !== "Select") return;
    setSelectedIds(new Set());
  }, [mode, debouncedQuery]);

useLayoutEffect(() => {
  if (mode !== "Select") return;

  navigation.setOptions({
    headerTitle: "",
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: "#F7F8FA",
    },
    headerTintColor: "#111827",
    headerBackButtonDisplayMode: "minimal",
    headerRight: () => (
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={10}
        style={{
          paddingHorizontal: 4,
          paddingVertical: 4,
        }}
      >
        <Text
          style={{
            color: "#0B1530",
            fontWeight: "700",
            fontSize: 17,
          }}
        >
          Done
        </Text>
      </Pressable>
    ),
  });
}, [mode, navigation]);

  return (
    <AppBackground>
      <SafeAreaView edges={ mode === "Select" ? ["left", "right", "bottom"] : undefined} style={styles.container}>
        {mode === "Browse" ? (
          <ScreenHeader
            title="Exercises"
            subtitle="Browse your exercise library"
          />
        ) :<ScreenHeader
            title="Exercises"
            subtitle="Select exercises"
          />
          }

        <View style={styles.searchWrap}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search exercises"
            placeholderTextColor="#8A90A3"
            style={styles.searchInput}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        {searching ? (
          <Text style={styles.searchingText}>Searching…</Text>
        ) : null}

        {mode === "Select" ? (
          <Text style={styles.searchingText}>Tap an exercise to add</Text>
        ) : null}

        {loading ? (
          <View style={styles.centerWrap}>
            <Text style={styles.mutedText}>Loading…</Text>
          </View>
        ) : errorMsg && items.length === 0 ? (
          <View style={styles.centerWrap}>
            <Text style={styles.mutedText}>{errorMsg}</Text>

            <View style={styles.spacer12} />

            <Text onPress={handleRetry} style={styles.retryBtn}>
              Retry
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "#F3F1F4",
              borderRadius: 28,
              padding: 16,
              marginTop: 6,
              flex: 1,
            }}
          >
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              contentContainerStyle={
                items.length === 0 ? styles.emptyContent : styles.listContent
              }
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
              renderItem={({ item }) => {
                const isAdded = selectedIds.has(item.id);

                return (
                  <Pressable
                    onPress={() => {
                      if (mode !== "Select") return;
                      if (isAdded) return;

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
                      mode === "Select" && pressed ? { opacity: 0.82 } : null,
                    ]}
                  >
                    <View style={styles.rowInner}>
                      <View style={styles.rowText}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.meta}>
                          {item.muscleGroup} • {item.equipment}
                        </Text>
                      </View>

                      {mode === "Select" && isAdded ? (
                        <Text style={styles.addedPill}>Added</Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={
                <View style={styles.centerWrap}>
                  <Text style={styles.mutedText}>No exercises found.</Text>
                </View>
              }
            />
          </View>
        )}
      </SafeAreaView>
    </AppBackground>
  );
}