import React from 'react';
import { Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import type { Pokemon } from '../types';

interface PokemonCardProps {
  pokemon: Pokemon;
  favoritedPokemons: Pokemon[];
  toggleFavorite: (pokemon: Pokemon) => void;
  handleSelectPokemon: (pokemon: string) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  favoritedPokemons,
  toggleFavorite,
  handleSelectPokemon,
}) => {
  const isFavorite = favoritedPokemons.some((fav) => fav.name === pokemon.name);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Typography
        onClick={() => {
          handleSelectPokemon(pokemon.name);
        }}
        variant='h6'
      >
        {pokemon.name}
      </Typography>
      <IconButton onClick={() => toggleFavorite(pokemon)}>
        {isFavorite ? <GoHeartFill /> : <GoHeart />}
      </IconButton>
    </Box>
  );
};

export default PokemonCard;
