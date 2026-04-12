import { StyleSheet } from "react-native";

export const workoutSessionDetailStyles = StyleSheet.create({
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

  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  summaryCard: {
    backgroundColor: "#F7F5F8",
    borderWidth: 1,
    borderColor: "#E3E0E6",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 14,
  },

  summaryName: {
    color: "#0B1530",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },

  summaryMeta: {
    color: "#7D8496",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  summaryDate: {
    color: "#8A90A3",
    fontSize: 14,
    fontWeight: "500",
  },

  exerciseCard: {
    backgroundColor: "#F7F5F8",
    borderWidth: 1,
    borderColor: "#E3E0E6",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  exerciseName: {
    color: "#0B1530",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 3,
  },

  exerciseMeta: {
    color: "#7D8496",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  setRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E7E3E9",
  },

  setLabel: {
    color: "#0B1530",
    fontSize: 14,
    fontWeight: "700",
  },

  setValue: {
    color: "#7D8496",
    fontSize: 14,
    fontWeight: "600",
  },

  progressBtn: {
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#D7E5FF",
    alignItems: "center",
    justifyContent: "center",
  },

  progressBtnText: {
    color: "#2454A6",
    fontWeight: "700",
    fontSize: 14,
  },

  deleteBtn: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#FCEDEE",
    borderWidth: 1,
    borderColor: "#F3D4D8",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteBtnText: {
    color: "#B5475A",
    fontWeight: "700",
    fontSize: 14,
  },

  secondaryBtn: {
    minHeight: 46,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: "#0B1530",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
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
    marginBottom: 8,
  },

  spacer10: {
    height: 10,
  },

  spacer12: {
    height: 12,
  },

  spacer14: {
    height: 14,
  },

  spacer18: {
    height: 18,
  },
});