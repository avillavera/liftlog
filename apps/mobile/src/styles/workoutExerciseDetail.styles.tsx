import { StyleSheet } from "react-native";

export const exerciseDetailStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  headerCard: {
    backgroundColor: "#F7F5F8",
    borderWidth: 1,
    borderColor: "#E3E0E6",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 14,
  },

  exerciseName: {
    color: "#0B1530",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },

  exerciseMeta: {
    color: "#7D8496",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },

  sectionTitle: {
    color: "#0B1530",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },

  sectionSubtitle: {
    color: "#7D8496",
    fontSize: 13,
    fontWeight: "500",
  },

  addBtn: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#D7E5FF",
    alignItems: "center",
    justifyContent: "center",
  },

  addBtnText: {
    color: "#2454A6",
    fontWeight: "700",
    fontSize: 13,
  },

  listContent: {
    paddingBottom: 40,
  },

  emptyContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },

  separator: {
    height: 12,
  },

  emptyState: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E5EA",
    backgroundColor: "#FCFBFD",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },

  emptyTitle: {
    color: "#0B1530",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  emptyText: {
    color: "#7D8496",
    fontSize: 14,
    lineHeight: 20,
  },

  setCard: {
    backgroundColor: "#F7F5F8",
    borderWidth: 1,
    borderColor: "#E3E0E6",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  setHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  setTitle: {
    color: "#0B1530",
    fontSize: 16,
    fontWeight: "700",
  },

  inputsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },

  inputWrap: {
    flex: 1,
  },

  inputLabel: {
    color: "#7D8496",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },

  input: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    color: "#0B1530",
    borderWidth: 1,
    borderColor: "#E3E0E6",
    fontSize: 16,
    fontWeight: "600",
  },

  removeBtn: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#FCEDEE",
    borderWidth: 1,
    borderColor: "#F3D4D8",
    alignItems: "center",
    justifyContent: "center",
  },

  removeBtnText: {
    color: "#B5475A",
    fontWeight: "700",
    fontSize: 12,
  },

  muted: {
    color: "#7D8496",
    fontSize: 16,
    textAlign: "center",
  },
});