import { View, Image, Text, StyleSheet } from "react-native";

type Props = {
  subtitle?: string;
};

export default function BrandHeader({ subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/brand/logo-mark.png")}
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
    width: 200,
    height: 200,
    marginBottom: 8,
    opacity: 0.95,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: 0.3,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#334155",
  },
});

