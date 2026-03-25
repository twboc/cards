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
