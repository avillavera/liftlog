import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 120,
    justifyContent: "center",
  },

  card: {
    marginTop: 24,
    backgroundColor: "#F8F8FA",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0B1530",
    textAlign: "center",
  },

  subheading: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 16,
    color: "#5E687D",
    textAlign: "center",
  },

  primaryButton: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: "#163C43",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  secondaryButton: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8DEE8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  secondaryButtonText: {
    color: "#0B1530",
    fontSize: 17,
    fontWeight: "600",
  },
});