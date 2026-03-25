import { Color } from "@shopify/react-native-skia";

export type SelectorOption<T> = {
  label: string;
  value: T;
};

export type ControlsModalProps = {
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

export type ControlRowProps = {
  label: string;
  value: boolean;
  onValueChange: () => void;
};

export type SelectorDropdownProps<T> = {
  label: string;
  valueLabel: string;
  options: readonly SelectorOption<T>[];
  visible: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (value: SelectorOption<T>) => void;
};
