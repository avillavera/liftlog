import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
};

export default function ScreenHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0B1530",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#5E687D",
  },
});