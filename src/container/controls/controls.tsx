import React, { memo, useState } from "react";
import { Modal, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ControlRowProps,
  ControlsModalProps,
  SelectorDropdownProps,
} from "./controls.type";
import { styles } from "./controls.style";

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
