import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LineChart } from "react-native-chart-kit";
import { AppStackParamList } from "../navigation/AppNavigator";
import { getExercise1RM } from "../api/analytics";
import { markPRs } from "../utils/analytics";
import type { Exercise1RMPointWithPR } from "../utils/analytics";

import AppBackground from "../components/AppBackground";
import SafeAreaViewStack from "../components/SafeAreaViewStack";
import ScreenHeader from "../components/ScreenHeader";
import { exerciseProgressStyles as styles } from "../styles/exerciseProgress.styles";

type Props = NativeStackScreenProps<AppStackParamList, "ExerciseProgress">;

const chartWidth = Dimensions.get("window").width - 48;

export default function ExerciseProgressScreen({ route }: Props) {
  const { exerciseId, exerciseName } = route.params;

  const [points, setPoints] = useState<Exercise1RMPointWithPR[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getExercise1RM(exerciseId);
      setPoints(markPRs(data.points));
    } catch (err) {
      console.log("analytics error", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AppBackground>
        <SafeAreaViewStack>
          <ScreenHeader
            title={exerciseName}
            subtitle="Your progress over time"
          />
          <View style={styles.centerWrap}>
            <ActivityIndicator />
            <Text style={styles.mutedText}>Loading progress...</Text>
          </View>
        </SafeAreaViewStack>
      </AppBackground>
    );
  }

  if (points.length === 0) {
    return (
      <AppBackground>
        <SafeAreaViewStack>
          <ScreenHeader
            title={exerciseName}
            subtitle="Your progress over time"
          />
          <View style={styles.centerWrap}>
            <Text style={styles.mutedText}>No progress data yet.</Text>
          </View>
        </SafeAreaViewStack>
      </AppBackground>
    );
  }

  const latest = points[points.length - 1];

  const recentPoints = points.slice(-5);

  const chartData = {
    labels: recentPoints.map((item, index) =>
      index % 2 === 0
        ? new Date(item.date).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
          })
        : ""
    ),
    datasets: [
      {
        data: recentPoints.map((item) => item.estimated1RM),
      },
    ],
  };

  return (
    <AppBackground>
      <SafeAreaViewStack>
        <FlatList
          data={points}
          keyExtractor={(item) => item.sessionId}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <>
              <ScreenHeader
                title={exerciseName}
                subtitle="Your progress over time"
              />

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Latest Estimated 1RM</Text>
                <Text style={styles.statValue}>
                  {latest.estimated1RM.toFixed(1)}
                </Text>
              </View>

              <View style={styles.chartCard}>
                <LineChart
                  data={chartData}
                  width={chartWidth}
                  height={220}
                  bezier
                  withInnerLines={false}
                  withOuterLines={false}
                  withShadow={false}
                  yLabelsOffset={8}
                  chartConfig={{
                    backgroundGradientFrom: "#F7F5F8",
                    backgroundGradientTo: "#F7F5F8",
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(11, 21, 48, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(125, 132, 150, ${opacity})`,
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                      stroke: "#0B1530",
                    },
                  }}
                  style={styles.chart}
                />
              </View>

              <Text style={styles.historyTitle}>History</Text>
            </>
          }
          renderItem={({ item }) => (
            <View style={styles.historyRow}>
              <Text style={styles.historyDate}>
                {new Date(item.date).toLocaleDateString()}
              </Text>

              <Text style={styles.historyValue}>
                {item.estimated1RM.toFixed(1)}
                {item.isPR ? " PR" : ""}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </SafeAreaViewStack>
    </AppBackground>
  );
}