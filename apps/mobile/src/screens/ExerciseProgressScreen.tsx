import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../navigation/AppNavigator";
import { getExercise1RM } from "../api/analytics";
import type { Exercise1RMPoint } from "../types/analytics";

type Props = NativeStackScreenProps<AppStackParamList, "ExerciseProgress">;

export default function ExerciseProgressScreen({ route }: Props) {
  const { exerciseId, exerciseName } = route.params;

  const [points, setPoints] = useState<Exercise1RMPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getExercise1RM(exerciseId);
      setPoints(data.points);
    } catch (err) {
      console.log("analytics error", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  if (points.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Text>No progress data yet.</Text>
      </View>
    );
  }

  const latest = points[points.length - 1];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>
        {exerciseName}
      </Text>

      <Text style={{ marginTop: 20, fontSize: 18 }}>
        Latest Estimated 1RM
      </Text>

      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        {latest.estimated1RM.toFixed(1)}
      </Text>

      <FlatList
        style={{ marginTop: 30 }}
        data={points}
        keyExtractor={(item) => item.sessionId}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 10 }}>
            <Text>
              {new Date(item.date).toLocaleDateString()} —{" "}
              {item.estimated1RM.toFixed(1)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}