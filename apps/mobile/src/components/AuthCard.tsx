import { ReactNode } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";

type Props = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthCard({ title, children, footer }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.content}>{children}</View>

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: Platform.OS === "android" ? "#F8FAFC" : "rgba(255,255,255,0.82)",
    borderRadius: 22,
    padding: 20,

    borderWidth: Platform.OS === "android" ? 0 : 1,
    borderColor: "rgba(255,255,255,0.65)",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 0,
      },
    }),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 20,
  },
  content: {
    gap: 14,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
});