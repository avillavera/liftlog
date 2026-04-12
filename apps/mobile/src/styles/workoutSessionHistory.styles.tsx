import { StyleSheet } from "react-native";

export const workoutSessionHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },

  listContent: {
    paddingBottom: 140,
  },

  separator: {
    height: 14,
  },

  row: {
    backgroundColor: "#F7F5F8",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#E3E0E6",
  },

  rowTitle: {
    color: "#0B1530",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },

  rowMeta: {
    color: "#7D8496",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },

  rowSummary: {
    color: "#8A90A3",
    fontSize: 14,
    fontWeight: "600",
  },

  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  muted: {
    color: "#7D8496",
    fontSize: 16,
    textAlign: "center",
  },

  errorText: {
    color: "#C65B68",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },

  retryBtn: {
    minHeight: 46,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: "#0B1530",
  },

  retryBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  spacer10: {
    height: 10,
  },

  spacer12: {
    height: 12,
  },
});