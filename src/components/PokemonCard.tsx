import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import type { Pokemon } from '../types';
import { capitalize } from '../utils/capitalize';

interface PokemonCardProps {
  pokemon: Pokemon;
  favoritedPokemons: Pokemon[];
  toggleFavorite: (pokemon: Pokemon) => void;
  handleSelectPokemon: (pokemon: string) => void;
  spriteUrl?: string; // optional thumbnail for list view (if cached)
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  favoritedPokemons,
  toggleFavorite,
  handleSelectPokemon,
  spriteUrl,
}) => {
  const isFavorite = favoritedPokemons.some((fav) => fav.name === pokemon.name);

  return (
    <Card sx={{ width: 160, textAlign: 'center' }}>
      <CardActionArea onClick={() => handleSelectPokemon(pokemon.name)}>
        <CardContent>
          {spriteUrl ? (
            <Box
              component='img'
              src={spriteUrl}
              alt={pokemon.name}
              sx={{ width: 72, height: 72, objectFit: 'contain' }}
            />
          ) : null}
          <Typography variant='subtitle1' noWrap>
            {capitalize(pokemon.name)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: 'center', pb: 1 }}>
        <IconButton
          aria-label={isFavorite ? 'remove from favorites' : 'add to favorites'}
          onClick={() => toggleFavorite(pokemon)}
        >
          {isFavorite ? <GoHeartFill /> : <GoHeart />}
        </IconButton>
      </CardActions>
    </Card>
  );
};
