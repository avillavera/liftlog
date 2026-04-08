import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthBackground from "../components/AuthBackground";

export default function ProfileScreen() {
  return (
    <AuthBackground>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Coming soon.</Text>
          </View>
        </View>
      </SafeAreaView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#F8F8FA",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0B1530",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#5E687D",
  },
});