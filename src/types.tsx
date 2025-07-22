export type Pokemon = {
  name: string;
  url: string;
};

export type TypeCount = { name: string; value: number };

export interface PokemonDetails {
  name: string;
  type: string[];
  height: number;
  weight: number;
  abilities: string[];
  heldItems: string[];
  spriteUrl?: string;
}
