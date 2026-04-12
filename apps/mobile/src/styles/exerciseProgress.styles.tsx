import { StyleSheet, Platform} from "react-native";

export const exerciseProgressStyles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  mutedText: {
    color: "#7D8496",
    fontSize: 16,
  },
  statCard: {
    backgroundColor: "#F7F5F8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3E0E6",
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginTop: 5,
  },
  statLabel: {
    color: "#7D8496",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  statValue: {
    color: "#0B1530",
    fontSize: 32,
    fontWeight: "700",
  },
  chartCard: {
    marginTop: 16,
    backgroundColor: "#F7F5F8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3E0E6",
    paddingVertical: 12,
    overflow: "hidden",
  },
  chart: {
    borderRadius: 10,
  },
  historyTitle: {
    marginTop: 20,
    marginBottom: 12,
    color: "#0B1530",
    fontSize: 18,
    fontWeight: "700",
  },
  historyRow: {
    backgroundColor: "#F7F5F8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3E0E6",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historyDate: {
    color: "#0B1530",
    fontSize: 15,
    fontWeight: "600",
  },
  historyValue: {
    color: "#7D8496",
    fontSize: 15,
    fontWeight: "700",
  },
    historyList: {
    paddingBottom: 40,
  },
});