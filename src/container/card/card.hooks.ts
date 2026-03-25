import { useMemo } from "react";
import { Skia } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";

export const useCardMemoValues = (params: {
  shaderSource: string;
  screenWidth: number;
  height: number;
}) => {
  const shaderEffect = useMemo(
    () => Skia.RuntimeEffect.Make(params.shaderSource),
    [params.shaderSource],
  );

  const shaderEffectRef = useMemo(
    () => ({ current: shaderEffect }),
    [shaderEffect],
  );

  const containerStyle = useMemo(
    () => [
      styles.centeredView,
      {
        width: params.screenWidth,
        height: params.height,
      },
    ],
    [params.screenWidth, params.height],
  );

  return {
    shaderEffect,
    shaderEffectRef,
    containerStyle,
  };
};

const styles = StyleSheet.create({
  centeredView: {
    paddingTop: 30,
    alignItems: "center",
  },
});
