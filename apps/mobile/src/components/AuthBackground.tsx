import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AuthBackground({ children }: Props) {
  return (
    <LinearGradient
      colors={[
        "#9FBEC4", // matches logo background
        "#DDEBED", // soft fade
        "#F8FAFC", // clean bottom
      ]}
      locations={[0, 0.45, 1]}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
