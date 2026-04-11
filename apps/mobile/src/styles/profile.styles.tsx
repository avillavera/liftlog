import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },

  card: {
    backgroundColor: "#F8F8FA",
    borderRadius: 28,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#7A8599",
    marginBottom: 12,
  },

  settingList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E7EAF0",
    overflow: "hidden",
  },

  settingRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  settingTextBlock: {
    flex: 1,
  },

  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0B1530",
    marginBottom: 4,
  },

  settingValue: {
    fontSize: 15,
    color: "#667085",
  },

  settingStatus: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8B93A6",
  },

  divider: {
    height: 1,
    backgroundColor: "#E7EAF0",
    marginLeft: 16,
  },

  logoutButton: {
    marginTop: 28,
    backgroundColor: "#1F2933",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});