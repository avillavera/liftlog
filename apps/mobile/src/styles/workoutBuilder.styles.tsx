import { StyleSheet } from "react-native";

export const workoutBuilderStyles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#F7F5F8",
    borderWidth: 1,
    borderColor: "#E3E0E6",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 12,
  },

  label: {
    color: "#7D8496",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "600",
  },

  input: {
    height: 54,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    color: "#0B1530",
    borderWidth: 1,
    borderColor: "#E3E0E6",
    fontSize: 16,
    fontWeight: "500",
  },

  rowHeader: {
    marginBottom: 12,
  },

  rowHeaderTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 6,
  },

  sectionTitle: {
    color: "#0B1530",
    fontSize: 18,
    fontWeight: "700",
    flexShrink: 1,
  },

  sectionSubtitle: {
    color: "#7D8496",
    fontSize: 13,
    fontWeight: "500",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },

  count: {
    color: "#7D8496",
    fontSize: 14,
    fontWeight: "700",
  },

  countText: {
    marginTop: 8,
    color: "#7D8496",
    fontSize: 13,
    fontWeight: "600",
  },

  emptyState: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E5EA",
    backgroundColor: "#FCFBFD",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  emptyTitle: {
    color: "#0B1530",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },

  emptyText: {
    color: "#7D8496",
    fontSize: 14,
    lineHeight: 20,
  },

  separator: {
    height: 12,
  },

  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E0E6",
  },

  exerciseTextWrap: {
    flex: 1,
  },

  exerciseName: {
    color: "#0B1530",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 3,
  },

  exerciseMeta: {
    color: "#7D8496",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 6,
  },

  exerciseSets: {
    color: "#8A90A3",
    fontSize: 13,
    fontWeight: "600",
  },

  secondaryBtn: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#D7E5FF",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryBtnText: {
    color: "#2454A6",
    fontWeight: "700",
    fontSize: 13,
  },

  removeBtn: {
    minHeight: 36,
    paddingHorizontal: 14,
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
    fontSize: 13,
  },

  primaryBtn: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: "#163C43",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  primaryBtnDisabled: {
    backgroundColor: "#AAB5B8",
  },

  primaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  helperText: {
    color: "#7D8496",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },

  errorText: {
    color: "#C65B68",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
});