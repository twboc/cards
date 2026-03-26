import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 9999,
    minWidth: 220,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.72)",
  },
  title: {
    color: "#00ff90",
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 12,
  },
  line: {
    color: "#ffffff",
    fontSize: 11,
    lineHeight: 15,
  },
  canvasLine: {
    color: "#8fd3ff",
    fontSize: 11,
    lineHeight: 15,
  },
});
