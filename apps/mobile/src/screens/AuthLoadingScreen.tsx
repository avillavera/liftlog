import { View, ActivityIndicator } from "react-native";
import { authLoadingStyles as styles } from "../styles/authloading.styles";

export default function AuthLoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}