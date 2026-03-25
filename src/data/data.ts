import { getRandomPokemon, POKEMON_OPTIONS } from "./data.pokemon";
import { getRandomHoloBackground, HOLO_BACKGROUND_OPTIONS } from "./data.holo";
import { getRandomShader, SHADER_OPTIONS } from "./data.shader";

export interface ICardData {
  source: number;
  hologram: number;
  shader: string;
}

export const getCardList = (count: number = 10): ICardData[] => {
  const result: ICardData[] = new Array(count);

  const pokemonLen = POKEMON_OPTIONS.length;
  const holoLen = HOLO_BACKGROUND_OPTIONS.length;
  const shaderLen = SHADER_OPTIONS.length;

  for (let i = 0; i < count; i++) {
    result[i] = {
      source: i < pokemonLen ? POKEMON_OPTIONS[i].value : getRandomPokemon(),

      hologram:
        i < holoLen
          ? HOLO_BACKGROUND_OPTIONS[i].value
          : getRandomHoloBackground(),

      shader: i < shaderLen ? SHADER_OPTIONS[i].value : getRandomShader(),
    };
  }

  return result;
};
