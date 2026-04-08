import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { AppTabParamList } from "../navigation/AppNavigator";
import AuthBackground from "../components/AuthBackground";
import BrandHeader from "../components/BrandHeader";
import { homeStyles as styles } from "../styles/home.styles";

type Props = BottomTabScreenProps <AppTabParamList, "HomeTab">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <AuthBackground>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.container}>
          <BrandHeader
            subtitle="Stay consistent. Track your progress."
          />

          <View style={styles.card}>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.subheading}>Ready for your next session?</Text>

            <Pressable
              style={styles.primaryButton}
              onPress={() => navigation.navigate("StartWorkoutTab")}
            >
              <Text style={styles.primaryButtonText}>Start Workout</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("ExerciseLibraryTab")}
            >
              <Text style={styles.secondaryButtonText}>Exercise Library</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("HistoryTab")}
            >
              <Text style={styles.secondaryButtonText}>Workout History</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </AuthBackground>
  );
}