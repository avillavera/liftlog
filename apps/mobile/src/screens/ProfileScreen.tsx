import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authStore";
import { profileStyles as styles } from "../styles/profile.styles";
import AppBackground from "../components/AppBackground";
import ScreenHeader from "../components/ScreenHeader";

export default function ProfileScreen() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    Alert.alert(
        "Log out",
        "Are you sure you want to log out?",
        [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Log out",
                style: "destructive",
                onPress: clearSession,
            },
        ],
        { cancelable: true }
    );
  };

  return (
    <AppBackground>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.container}>
          <ScreenHeader
            title="Profile"
            subtitle="Manage your account settings"
          />

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Settings</Text>

            <View style={styles.settingList}>
              <View style={styles.settingRow}>
                <View style={styles.settingTextBlock}>
                  <Text style={styles.settingLabel}>Email</Text>
                  <Text style={styles.settingValue}>
                    {user?.email ?? "Coming soon"}
                  </Text>
                </View>
                <Text style={styles.settingStatus}>Read only</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingTextBlock}>
                  <Text style={styles.settingLabel}>Units</Text>
                  <Text style={styles.settingValue}>Coming soon</Text>
                </View>
                <Text style={styles.settingStatus}>Soon</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingTextBlock}>
                  <Text style={styles.settingLabel}>Notifications</Text>
                  <Text style={styles.settingValue}>Coming soon</Text>
                </View>
                <Text style={styles.settingStatus}>Soon</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingTextBlock}>
                  <Text style={styles.settingLabel}>Language</Text>
                  <Text style={styles.settingValue}>Coming soon</Text>
                </View>
                <Text style={styles.settingStatus}>Soon</Text>
              </View>
            </View>
          </View>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </AppBackground>
  );
}