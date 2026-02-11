import { View, Image, Text, StyleSheet } from "react-native";

type Props = {
  subtitle?: string;
};

export default function BrandHeader({ subtitle }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.logoBadge}>
        <Image
          source={require("../../assets/brand/logo-mark.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>LiftLog</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 28,
  },

  // BIG presence even with thin lines
  logoBadge: {
    width: 176,
    height: 176,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",

    // subtle “badge” that still matches your gradient theme
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
    marginBottom: 10,
  },

  // logo stays transparent; we scale it up inside the badge
  logo: {
    width: 150,
    height: 150,
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

