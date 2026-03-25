import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Card from "../container/card.tsx";
import Controls from "../container/controls.tsx";
import {
  getRandomCardList,
  HOLO_BACKGROUND_OPTIONS,
  POKEMON_OPTIONS,
  SHADER_OPTIONS,
} from "../data/data.ts";

export interface ICardData {
  source: number;
  hologram: number;
  shader: string;
}

const SLIDER_ITEM_WIDTH = 86;
const SLIDER_ITEM_HEIGHT = 118;
const SLIDER_GAP = 12;

const Cards = () => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const WIDTH = SCREEN_WIDTH * 0.9;
  const HEIGHT = WIDTH * 1.4;
  const MAX_ANGLE = 10;

  const [showShaderBack, setShowShaderBack] = useState(true);
  const [showImage, setShowImage] = useState(true);
  const [showHologram, setShowHologram] = useState(true);
  const [showGloss, setShowGloss] = useState(true);

  const [showBackground, setShowBackground] = useState(true);
  const [showOutline, setShowOutline] = useState(true);
  const [showOutlineMask, setShowOutlineMask] = useState(false);
  const [showRGBSplit, setShowRGBSplit] = useState(true);
  const [showHoloMask, setShowHoloMask] = useState(false);
  const [showHoloBackground, setShowHoloBackground] = useState(false);

  const [controlsVisible, setControlsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [cards, setCards] = useState<ICardData[]>(() => getRandomCardList(25));

  const sliderRef = useRef<FlatList<ICardData> | null>(null);

  const activeCard = useMemo(() => {
    return cards[activeIndex] ?? cards[0];
  }, [cards, activeIndex]);

  const hologramRef = useMemo(
    () => ({ current: activeCard.hologram }),
    [activeCard.hologram],
  );

  const shaderRef = useMemo(
    () => ({ current: activeCard.shader }),
    [activeCard.shader],
  );

  const toggleShowShaderBack = () =>
    setShowShaderBack((previousState) => !previousState);
  const toggleShowImage = () => setShowImage((previousState) => !previousState);
  const toggleShowHologram = () =>
    setShowHologram((previousState) => !previousState);
  const toggleShowGloss = () => setShowGloss((previousState) => !previousState);

  const handleSelectCard = useCallback((index: number) => {
    setActiveIndex(index);

    sliderRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  }, []);

  const updateActiveCard = useCallback(
    (patch: Partial<ICardData>) => {
      setCards((previousState) =>
        previousState.map((item, index) => {
          if (index !== activeIndex) {
            return item;
          }

          return {
            ...item,
            ...patch,
          };
        }),
      );
    },
    [activeIndex],
  );

  const handleSelectImage = useCallback(
    (source: number) => {
      updateActiveCard({ source });
    },
    [updateActiveCard],
  );

  const handleSelectHologram = useCallback(
    (hologram: number) => {
      updateActiveCard({ hologram });
    },
    [updateActiveCard],
  );

  const handleSelectShader = useCallback(
    (shader: string) => {
      updateActiveCard({ shader });
    },
    [updateActiveCard],
  );

  const renderSliderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ICardData>) => {
      const isSelected = index === activeIndex;

      return (
        <Pressable
          style={[styles.sliderItem, isSelected && styles.sliderItemActive]}
          onPress={() => handleSelectCard(index)}
        >
          <Image source={item.source} style={styles.sliderImage} />
          <Image source={item.hologram} style={styles.sliderHolo} />
        </Pressable>
      );
    },
    [activeIndex, handleSelectCard],
  );

  const keyExtractor = useCallback(
    (_item: ICardData, index: number) => `card-${index}`,
    [],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<ICardData> | null | undefined, index: number) => ({
      length: SLIDER_ITEM_WIDTH + SLIDER_GAP,
      offset: (SLIDER_ITEM_WIDTH + SLIDER_GAP) * index,
      index,
    }),
    [],
  );

  const imageValueLabel = useMemo(() => {
    return (
      POKEMON_OPTIONS.find((item) => item.value === activeCard.source)?.label ??
      "Select image"
    );
  }, [activeCard.source]);

  const hologramValueLabel = useMemo(() => {
    return (
      HOLO_BACKGROUND_OPTIONS.find((item) => item.value === activeCard.hologram)
        ?.label ?? "Select hologram"
    );
  }, [activeCard.hologram]);

  const shaderValueLabel = useMemo(() => {
    return (
      SHADER_OPTIONS.find((item) => item.value === activeCard.shader)?.label ??
      "Select shader"
    );
  }, [activeCard.shader]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Card
          key={`full-card-${activeIndex}-${activeCard.shader}-${activeCard.hologram}-${activeCard.source}`}
          showShaderBack={showShaderBack}
          showImage={showImage}
          showHologram={showHologram}
          showGloss={showGloss}
          showBackground={showBackground}
          showOutline={showOutline}
          showOutlineMask={showOutlineMask}
          showRGBSplit={showRGBSplit}
          showHoloMask={showHoloMask}
          showHoloBackground={showHoloBackground}
          source={activeCard.source}
          hologram={hologramRef}
          shader={shaderRef}
          screen_width={SCREEN_WIDTH}
          width={WIDTH}
          height={HEIGHT}
          max_angle={MAX_ANGLE}
        />
        <View style={styles.bottomPanel}>
          <View style={styles.sliderWrap}>
            <FlatList
              ref={sliderRef}
              data={cards}
              horizontal
              keyExtractor={keyExtractor}
              renderItem={renderSliderItem}
              extraData={activeIndex}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sliderContent}
              snapToInterval={SLIDER_ITEM_WIDTH + SLIDER_GAP}
              decelerationRate="fast"
              getItemLayout={getItemLayout}
            />
          </View>
        </View>

        <Pressable style={styles.fab} onPress={() => setControlsVisible(true)}>
          <Text style={styles.fabIcon}>⚙</Text>
        </Pressable>

        <Controls
          visible={controlsVisible}
          onClose={() => setControlsVisible(false)}
          showImage={showImage}
          showShaderBack={showShaderBack}
          showHologram={showHologram}
          showGloss={showGloss}
          onToggleImage={toggleShowImage}
          onToggleShaderBack={toggleShowShaderBack}
          onToggleHologram={toggleShowHologram}
          onToggleGloss={toggleShowGloss}
          imageValueLabel={imageValueLabel}
          hologramValueLabel={hologramValueLabel}
          shaderValueLabel={shaderValueLabel}
          imageOptions={POKEMON_OPTIONS}
          hologramOptions={HOLO_BACKGROUND_OPTIONS}
          shaderOptions={SHADER_OPTIONS}
          onSelectImage={handleSelectImage}
          onSelectHologram={handleSelectHologram}
          onSelectShader={handleSelectShader}
        />
      </View>
    </SafeAreaView>
  );
};

export default Cards;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },

  wrapper: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },

  bottomPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 72,
    backgroundColor: "rgba(8,8,12,0.32)",
  },

  sliderWrap: {},

  sliderContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  sliderItem: {
    width: SLIDER_ITEM_WIDTH,
    height: SLIDER_ITEM_HEIGHT,
    marginRight: SLIDER_GAP,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(20,20,24,0.88)",
  },

  sliderItemActive: {
    borderColor: "#ffffff",
    transform: [{ scale: 1.04 }],
  },

  sliderImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  sliderHolo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },

  fab: {
    position: "absolute",
    right: 24,
    bottom: 4,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(20,20,24,0.92)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    zIndex: 20,
  },

  fabIcon: {
    fontSize: 22,
    color: "#ffffff",
    fontWeight: "700",
  },
});
