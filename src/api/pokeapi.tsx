import axios from 'axios';
import type { Pokemon, PokemonDetails } from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2';

/** Fetch the first N pokémon (default 150). */
export async function fetchPokemonList(
  limit = 150,
  offset = 0
): Promise<Pokemon[]> {
  const { data } = await axios.get(`${BASE_URL}/pokemon`, {
    params: { limit, offset },
  });
  return data.results as Pokemon[];
}

/** Fetch fully detailed information for a single pokémon name/id. */
export async function fetchPokemonDetails(
  name: string
): Promise<PokemonDetails> {
  const { data } = await axios.get(`${BASE_URL}/pokemon/${name}`);
  const abilities = data.abilities.map(
    (item: { ability: { name: string } }) => item.ability.name
  );
  const type = data.types.map(
    (item: { type: { name: string } }) => item.type.name
  );
  const height = data.height;
  const heldItems = data.held_items.map(
    (item: { item: { name: string } }) => item.item.name
  );
  const weight = data.weight;
  const spriteUrl = data.sprites?.front_default ?? undefined;
  return { name, abilities, type, height, heldItems, weight, spriteUrl };
}
