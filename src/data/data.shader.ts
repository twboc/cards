import { AbstractShineShader } from "../assets/shader/AbstractShineShader";
import { AuroraWaveShader } from "../assets/shader/AuroraWaveShader";
import { ColdStrandsShader } from "../assets/shader/ColdStrandsShader";
import { CrystalBloomShader } from "../assets/shader/CrystalBloomShader";
import { FracturePolyShader } from "../assets/shader/FracturePolyShader";
import { HoloCosmicGalaxyShader } from "../assets/shader/HoloCosmicGalaxyShader";
import { HoloPrismBurstShader } from "../assets/shader/HoloPrismBurstShader";
import { HoloRainbowFoilShader } from "../assets/shader/HoloRainbowFoilShader";
import { HoloSilverScanShader } from "../assets/shader/HoloSilverScanShader";
import { InkCloudDenseShader } from "../assets/shader/InkCloudDenseShader";
import { InkCloudSmoothShader } from "../assets/shader/InkCloudSmooth";
import { InkCloudShader } from "../assets/shader/InkCloudShader";
import { KanagawaWaveShader } from "../assets/shader/KanagawaWaveShader";
import { LiquidMetalShader } from "../assets/shader/LiquidMetalShader";
import { LiquidMetalColourShader } from "../assets/shader/LiquidMetalColourShader";
import { LogoWaveShaderCentered } from "../assets/shader/LogoWaveShader";
import { LSDShader } from "../assets/shader/LSDShader";
import { RainRipplesShader } from "../assets/shader/RainRippleShader";
import { PinkWarpShader } from "../assets/shader/PinkWarpShader";
import { SmokeShader } from "../assets/shader/SmokeShader";
import { SynthwaveSunGridShader } from "../assets/shader/SynthWaveSunGrid";
import { SynthwaveTerrainShader } from "../assets/shader/SynthWaveTerrainShader";
import { TronGridHorizonShader } from "../assets/shader/TronGridHorizonShader";

export const SHADER_OPTIONS = [
  { label: "Abstract Shine", value: AbstractShineShader },
  { label: "Aurora Wave", value: AuroraWaveShader },
  { label: "Cold Strands", value: ColdStrandsShader },
  { label: "Crystal Bloom", value: CrystalBloomShader },
  { label: "Fracture Poly", value: FracturePolyShader },
  { label: "Holo Cosmic Galaxy", value: HoloCosmicGalaxyShader },
  { label: "Holo Prism Burst", value: HoloPrismBurstShader },
  { label: "Holo Rainbow Foil", value: HoloRainbowFoilShader },
  { label: "Holo Silver Scan", value: HoloSilverScanShader },
  { label: "Ink Cloud Dense", value: InkCloudDenseShader },
  { label: "Ink Cloud Smooth", value: InkCloudSmoothShader },
  { label: "Ink Cloud", value: InkCloudShader },
  { label: "Kanagawa Wave", value: KanagawaWaveShader },
  { label: "Liquid Metal", value: LiquidMetalShader },
  { label: "Liquid Metal Colour", value: LiquidMetalColourShader },
  { label: "Logo Wave", value: LogoWaveShaderCentered },
  { label: "LSD", value: LSDShader },
  { label: "Rain Ripples", value: RainRipplesShader },
  { label: "Pink Warp", value: PinkWarpShader },
  { label: "Smoke", value: SmokeShader },
  { label: "Synthwave Sun Grid", value: SynthwaveSunGridShader },
  { label: "Synthwave Terrain", value: SynthwaveTerrainShader },
  { label: "Tron Grid Horizon", value: TronGridHorizonShader },
] as const;

export const SHADERS = SHADER_OPTIONS.map((item) => item.value);

export const getRandomShader = () =>
  SHADERS[Math.floor(Math.random() * SHADERS.length)];
