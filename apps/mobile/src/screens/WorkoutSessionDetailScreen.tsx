import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
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
import { workoutSessionDetailStyles as styles } from "../styles/workoutSessionDetail.styles";

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

  async function deleteWorkout() {
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

  function handleDelete() {
    if (!session || deleting) return;

    Alert.alert(
      "Delete workout?",
      "This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: deleteWorkout },
      ]
    );
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