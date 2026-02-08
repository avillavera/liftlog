import { View, Text, Image, StyleSheet } from "react-native";

type Props = {
  subtitle?: string;
};

export default function BrandHeader({ subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/brand/logo-icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>LiftLog</Text>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    height: 84,
    width: 84,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2933",
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});