import { Color } from "@shopify/react-native-skia";
import React, { memo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SelectorOption<T> = {
  label: string;
  value: T;
};

type ControlsModalProps = {
  visible: boolean;
  onClose: () => void;

  perfMonitor: boolean;
  showImage: boolean;
  showShaderBack: boolean;
  showHologram: boolean;
  showGloss: boolean;
  showBackground: boolean;
  showOutline: boolean;
  showOutlineMask: boolean;
  showOutlineHolo: boolean;
  showRGBSplit: boolean;
  showHoloMask: boolean;
  showHoloBackground: boolean;

  onTogglePerfMonitor: () => void;
  onToggleImage: () => void;
  onToggleShaderBack: () => void;
  onToggleHologram: () => void;
  onToggleGloss: () => void;
  onToggleBackground: () => void;
  onToggleOutline: () => void;
  onToggleOutlineMask: () => void;
  onToggleOutlineHolo: () => void;
  onToggleRGBSplit: () => void;
  onToggleHoloMask: () => void;
  onToggleHoloBackground: () => void;

  imageValueLabel: string;
  hologramValueLabel: string;
  shaderValueLabel: string;
  holoColorsValueLabel: string;

  imageOptions: readonly SelectorOption<number>[];
  hologramOptions: readonly SelectorOption<number>[];
  shaderOptions: readonly SelectorOption<string>[];
  holoColorOptions: readonly SelectorOption<readonly Color[]>[];

  onSelectImage: (value: number) => void;
  onSelectHologram: (value: number) => void;
  onSelectShader: (value: string) => void;
  onSelectHoloColors: (value: readonly Color[]) => void;
};

type ControlRowProps = {
  label: string;
  value: boolean;
  onValueChange: () => void;
};

type SelectorDropdownProps<T> = {
  label: string;
  valueLabel: string;
  options: readonly SelectorOption<T>[];
  visible: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (value: SelectorOption<T>) => void;
};

const MODAL_HEIGHT = "50%";
const MODAL_BOTTOM_PADDING = 60;

const ControlRow = memo((props: ControlRowProps) => {
  return (
    <View style={styles.controlRow}>
      <Text style={styles.controlLabel}>{props.label}</Text>

      <Switch
        trackColor={{ false: "#d1d1d6", true: "#34C759" }}
        thumbColor={props.value ? "#ffffff" : "#f4f4f4"}
        ios_backgroundColor="#d1d1d6"
        onValueChange={props.onValueChange}
        value={props.value}
      />
    </View>
  );
});

ControlRow.displayName = "ControlRow";

const SelectorDropdown = <T,>(props: SelectorDropdownProps<T>) => {
  return (
    <>
      <Text style={styles.dropdownLabel}>{props.label}</Text>

      <Pressable style={styles.dropdownTrigger} onPress={props.onOpen}>
        <Text numberOfLines={1} style={styles.dropdownTriggerText}>
          {props.valueLabel}
        </Text>
        <Text style={styles.dropdownChevron}>⌄</Text>
      </Pressable>

      <Modal
        visible={props.visible}
        transparent
        animationType="fade"
        onRequestClose={props.onClose}
      >
        <View style={styles.dropdownModalBackdrop}>
          <Pressable style={styles.dropdownBackdrop} onPress={props.onClose} />

          <View style={styles.dropdownSheet}>
            <View style={styles.dropdownSheetHeader}>
              <Text style={styles.dropdownSheetTitle}>{props.label}</Text>
              <Pressable onPress={props.onClose}>
                <Text style={styles.dropdownCloseText}>Close</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.dropdownList}
              contentContainerStyle={styles.dropdownListContent}
              showsVerticalScrollIndicator={false}
            >
              {props.options.map((option) => (
                <Pressable
                  key={option.label}
                  style={styles.dropdownOption}
                  onPress={() => {
                    props.onSelect(option);
                    props.onClose();
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{option.label}</Text>
                </Pressable>
              ))}

              <View style={styles.modalBottomSpacer} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const ControlsModal = (props: ControlsModalProps) => {
  const [imageDropdownVisible, setImageDropdownVisible] = useState(false);
  const [hologramDropdownVisible, setHologramDropdownVisible] = useState(false);
  const [shaderDropdownVisible, setShaderDropdownVisible] = useState(false);
  const [holoColorsDropdownVisible, setHoloColorsDropdownVisible] =
    useState(false);

  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="slide"
      onRequestClose={props.onClose}
    >
      <View style={styles.modalBackdrop}>
        <Pressable style={styles.backdropPressable} onPress={props.onClose} />

        <SafeAreaView edges={["bottom"]} style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Card Controls</Text>

            <Pressable style={styles.closeButton} onPress={props.onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <ControlRow
              label="Performance Monitor"
              value={props.perfMonitor}
              onValueChange={props.onTogglePerfMonitor}
            />

            <SelectorDropdown
              label="Image"
              valueLabel={props.imageValueLabel}
              options={props.imageOptions}
              visible={imageDropdownVisible}
              onOpen={() => setImageDropdownVisible(true)}
              onClose={() => setImageDropdownVisible(false)}
              onSelect={(option) => props.onSelectImage(option.value)}
            />

            <SelectorDropdown
              label="Hologram"
              valueLabel={props.hologramValueLabel}
              options={props.hologramOptions}
              visible={hologramDropdownVisible}
              onOpen={() => setHologramDropdownVisible(true)}
              onClose={() => setHologramDropdownVisible(false)}
              onSelect={(option) => props.onSelectHologram(option.value)}
            />

            <SelectorDropdown
              label="Shader"
              valueLabel={props.shaderValueLabel}
              options={props.shaderOptions}
              visible={shaderDropdownVisible}
              onOpen={() => setShaderDropdownVisible(true)}
              onClose={() => setShaderDropdownVisible(false)}
              onSelect={(option) => props.onSelectShader(option.value)}
            />

            <SelectorDropdown
              label="Holo Colors"
              valueLabel={props.holoColorsValueLabel}
              options={props.holoColorOptions}
              visible={holoColorsDropdownVisible}
              onOpen={() => setHoloColorsDropdownVisible(true)}
              onClose={() => setHoloColorsDropdownVisible(false)}
              onSelect={(option) => props.onSelectHoloColors(option.value)}
            />

            <ControlRow
              label="Image"
              value={props.showImage}
              onValueChange={props.onToggleImage}
            />

            <ControlRow
              label="Shader Back"
              value={props.showShaderBack}
              onValueChange={props.onToggleShaderBack}
            />

            <ControlRow
              label="Hologram"
              value={props.showHologram}
              onValueChange={props.onToggleHologram}
            />

            <ControlRow
              label="Gloss"
              value={props.showGloss}
              onValueChange={props.onToggleGloss}
            />

            <ControlRow
              label="Background"
              value={props.showBackground}
              onValueChange={props.onToggleBackground}
            />

            <ControlRow
              label="Outline"
              value={props.showOutline}
              onValueChange={props.onToggleOutline}
            />

            <ControlRow
              label="Outline Mask"
              value={props.showOutlineMask}
              onValueChange={props.onToggleOutlineMask}
            />

            <ControlRow
              label="Outline Holo"
              value={props.showOutlineHolo}
              onValueChange={props.onToggleOutlineHolo}
            />

            <ControlRow
              label="RGB Split"
              value={props.showRGBSplit}
              onValueChange={props.onToggleRGBSplit}
            />

            <ControlRow
              label="Holo Mask"
              value={props.showHoloMask}
              onValueChange={props.onToggleHoloMask}
            />

            <ControlRow
              label="Holo Background"
              value={props.showHoloBackground}
              onValueChange={props.onToggleHoloBackground}
            />

            <View style={styles.modalBottomSpacer} />
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default memo(ControlsModal);

const styles = StyleSheet.create({
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
