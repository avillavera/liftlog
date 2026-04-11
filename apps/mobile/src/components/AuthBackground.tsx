import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { backgroundStyles as styles} from "../styles/background.styles"

type Props = {
  children: ReactNode;
};

export default function AuthBackground({ children }: Props) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#9FBEC4", "#DDEBED", "#F8FAFC"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />

      {children}
    </View>
  );
}
