import { StyleSheet, Platform} from "react-native";

export const authStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 64 : 36,
    paddingBottom: 40,
  },

  inner: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },

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
    height: 56,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    color: "#111827",
    fontSize: 16,
    marginBottom: 12,
  },

  primaryButton: {
    backgroundColor: "#1F3A3D",
    height: 56,
    borderRadius: 16,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonDisabled: {
    opacity: 0.7,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
  },

  linkStrong: {
    color: "#1F2933",
    fontWeight: "700",
  },

  errorText: {
    color: "crimson",
    textAlign: "center",
    marginBottom: 12,
  },

  headerBlock: {
    alignItems: "center",
    marginBottom: 24,
  },

  appTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0B132B",
    marginTop: 8,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#5C6670",
    textAlign: "center",
  },

  footerText: {
    fontSize: 16,
    color: "#6B7280",
  },

  footerLink: {
    color: "#0F172A",
    fontWeight: "700",
  },
});