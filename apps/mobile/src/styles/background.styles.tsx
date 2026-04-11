import { StyleSheet } from "react-native";

export const backgroundStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topGlow: {
    position: "absolute",
    top: -140,
    alignSelf: "center",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  bottomGlow: {
    position: "absolute",
    bottom: -100,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(159,190,196,0.10)",
  },
});