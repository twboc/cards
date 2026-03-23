import holo_01 from "./../assets/holo/holo_01.png";
import holo_02 from "./../assets/holo/holo_02.png";
import holo_03 from "./../assets/holo/holo_03.png";
import holo_04 from "./../assets/holo/holo_04.png";

export const HOLO_BACKGROUND_OPTIONS = [
  { label: "Holo 01", value: holo_01 },
  { label: "Holo 02", value: holo_02 },
  { label: "Holo 03", value: holo_03 },
  { label: "Holo 04", value: holo_04 },
] as const;

export const HOLO_BACKGROUNDS = HOLO_BACKGROUND_OPTIONS.map(
  (item) => item.value,
);

export const getRandomHoloBackground = () =>
  HOLO_BACKGROUNDS[Math.floor(Math.random() * HOLO_BACKGROUNDS.length)];

import { AuroraWaveShader } from "../assets/shader/AuroraWaveShader";
import { CrystalBloomShader } from "../assets/shader/CrystalBloomShader";
import { HoloCosmicGalaxyShader } from "../assets/shader/HoloCosmicGalaxyShader";
import { HoloPrismBurstShader } from "../assets/shader/HoloPrismBurstShader";
import { HoloRainbowFoilShader } from "../assets/shader/HoloRainbowFoilShader";
import { HoloSilverScanShader } from "../assets/shader/HoloSilverScanShader";
import { InkCloudDenseShader } from "../assets/shader/InkCloudDenseShader";
import { InkCloudSmoothShader } from "../assets/shader/InkCloudSmooth";
import { InkCloudShader } from "../assets/shader/InkCloudShader";
import { LiquidMetalShader } from "../assets/shader/LiquidMetalShader";
import { LiquidMetalColourShader } from "../assets/shader/LiquidMetalColourShader";
import { LSDShader } from "../assets/shader/LSDShader";
import { RainRipplesShader } from "../assets/shader/RainRippleShader";
import { SmokeShader } from "../assets/shader/SmokeShader";
import { SynthwaveSunGridShader } from "../assets/shader/SynthWaveSunGrid";
import { TronGridHorizonShader } from "../assets/shader/TronGridHorizonShader";

export const SHADER_OPTIONS = [
  { label: "Aurora Wave", value: AuroraWaveShader },
  { label: "Crystal Bloom", value: CrystalBloomShader },
  { label: "Holo Cosmic Galaxy", value: HoloCosmicGalaxyShader },
  { label: "Holo Prism Burst", value: HoloPrismBurstShader },
  { label: "Holo Rainbow Foil", value: HoloRainbowFoilShader },
  { label: "Holo Silver Scan", value: HoloSilverScanShader },
  { label: "Ink Cloud Dense", value: InkCloudDenseShader },
  { label: "Ink Cloud Smooth", value: InkCloudSmoothShader },
  { label: "Ink Cloud", value: InkCloudShader },
  { label: "Liquid Metal", value: LiquidMetalShader },
  { label: "Liquid Metal Colour", value: LiquidMetalColourShader },
  { label: "LSD", value: LSDShader },
  { label: "Rain Ripples", value: RainRipplesShader },
  { label: "Smoke", value: SmokeShader },
  { label: "Synthwave Sun Grid", value: SynthwaveSunGridShader },
  { label: "Tron Grid Horizon", value: TronGridHorizonShader },
] as const;

export const SHADERS = SHADER_OPTIONS.map((item) => item.value);

export const getRandomShader = () =>
  SHADERS[Math.floor(Math.random() * SHADERS.length)];

import bulbasaur from "./../assets/pokemon/bulbasaur.png";
import caterpie from "./../assets/pokemon/caterpie.png";
import charizard_big from "./../assets/pokemon/charizard_big.png";
import charizard_medium from "./../assets/pokemon/charizard_medium.png";
import charizard_small from "./../assets/pokemon/charizard_small.png";
import flareon from "./../assets/pokemon/flareon.png";
import jolteon from "./../assets/pokemon/jolteon.png";
import marill from "./../assets/pokemon/marill.png";
import mew from "./../assets/pokemon/mew.png";
import pikachu from "./../assets/pokemon/pikachu.png";
import squirtle from "./../assets/pokemon/squirtle.png";
import totodile from "./../assets/pokemon/totodile.png";
import vaporeon from "./../assets/pokemon/vaporeon.png";

export const POKEMON_OPTIONS = [
  { label: "Bulbasaur", value: bulbasaur },
  { label: "Caterpie", value: caterpie },
  { label: "Charizard Big", value: charizard_big },
  { label: "Charizard Medium", value: charizard_medium },
  { label: "Charizard Small", value: charizard_small },
  { label: "Flareon", value: flareon },
  { label: "Jolteon", value: jolteon },
  { label: "Marill", value: marill },
  { label: "Mew", value: mew },
  { label: "Pikachu", value: pikachu },
  { label: "Squirtle", value: squirtle },
  { label: "Totodile", value: totodile },
  { label: "Vaporeon", value: vaporeon },
] as const;

export const POKEMONS = POKEMON_OPTIONS.map((item) => item.value);

export const getRandomPokemon = () =>
  POKEMONS[Math.floor(Math.random() * POKEMONS.length)];

export interface ICardData {
  source: number;
  hologram: number;
  shader: string;
}

export const getRandomCardList = (value: number = 10): ICardData[] => {
  return Array.from(Array(value).keys()).map(() => {
    return {
      source: getRandomPokemon(),
      hologram: getRandomHoloBackground(),
      shader: getRandomShader(),
    };
  });
};
