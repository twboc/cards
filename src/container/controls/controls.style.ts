import { StyleSheet } from "react-native";
import { MODAL_BOTTOM_PADDING, MODAL_HEIGHT } from "../../const/const";

export const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdropPressable: {
    flex: 1,
  },

  modalSheet: {
    height: MODAL_HEIGHT,
    minHeight: 320,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    paddingBottom: MODAL_BOTTOM_PADDING,
  },

  modalHeader: {
    minHeight: 60,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5ea",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
  },

  closeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  closeButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#007AFF",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: MODAL_BOTTOM_PADDING,
  },

  controlRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ececec",
  },

  controlLabel: {
    fontSize: 16,
    color: "#111111",
    fontWeight: "500",
    paddingRight: 12,
  },

  dropdownLabel: {
    marginBottom: 4,
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
    color: "#111111",
  },

  dropdownTrigger: {
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f7",
    borderWidth: 1,
    borderColor: "#e5e5ea",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownTriggerText: {
    flex: 1,
    paddingRight: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#111111",
  },

  dropdownChevron: {
    fontSize: 16,
    color: "#111111",
    fontWeight: "700",
  },

  dropdownModalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.42)",
  },

  dropdownBackdrop: {
    flex: 1,
  },

  dropdownSheet: {
    height: MODAL_HEIGHT,
    minHeight: 320,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    paddingBottom: MODAL_BOTTOM_PADDING,
  },

  dropdownSheetHeader: {
    minHeight: 60,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5ea",
  },

  dropdownSheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
  },

  dropdownCloseText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#007AFF",
  },

  dropdownList: {
    flex: 1,
  },

  dropdownListContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: MODAL_BOTTOM_PADDING,
  },

  dropdownOption: {
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: "center",
    backgroundColor: "#f5f5f7",
    marginBottom: 8,
  },

  dropdownOptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
  },

  modalBottomSpacer: {
    height: MODAL_BOTTOM_PADDING,
  },
});
