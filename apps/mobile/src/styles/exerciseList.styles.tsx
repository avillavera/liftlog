import { StyleSheet } from "react-native";

export const exerciseListStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },

  containerSelect: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
  },

  searchWrap: {
    marginTop: 4,
    marginBottom: 12,
  },

  searchInput: {
    height: 58,
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor: "#F7F5F8",
    color: "#0B1530",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#E3E0E6",
  },

  searchingText: {
    color: "#8A90A3",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 14,
  },

  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  mutedText: {
    color: "#7D8496",
    fontSize: 16,
    textAlign: "center",
  },

  retryBtn: {
    color: "#0B1530",
    fontSize: 16,
    fontWeight: "700",
  },

  spacer12: {
    height: 12,
  },

  listContent: {
    paddingBottom: 140,
  },

  emptyContent: {
    flexGrow: 1,
    paddingBottom: 140,
  },

  separator: {
    height: 14,
  },

  row: {
    backgroundColor: "#F7F5F8",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E3E0E6",
  },

  rowInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  rowText: {
    flex: 1,
  },

  name: {
    color: "#0B1530",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 3,
  },

  meta: {
    color: "#7D8496",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  addedPill: {
    color: "#6C7285",
    fontSize: 14,
    fontWeight: "700",
    backgroundColor: "#ECE9EF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
});