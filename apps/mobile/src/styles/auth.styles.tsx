import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
  },

  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1F2933",
    marginBottom: 24,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    color: "#111827",
  },

  primaryButton: {
    backgroundColor: "#1F3A3D",
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#6B7280",
  },

  linkStrong: {
    color: "#1F2933",
    fontWeight: "600",
  },

  errorText: {
    color: "crimson",
    textAlign: "center",
    marginBottom: 12,
  },
});