import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import type { PokemonDetails } from '../types';

interface PokemonModalProps {
  open: boolean;
  pokemon: PokemonDetails | null;
  onClose: () => void;
}

const PokemonModal: React.FC<PokemonModalProps> = ({
  open,
  pokemon,
  onClose,
}) => {
  if (!pokemon) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{ p: 3, maxWidth: 400, margin: 'auto', backgroundColor: 'white' }}
      >
        <Typography variant='h6'>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Typography>
        <Typography variant='h6'>Type: {pokemon.type.join(',')}</Typography>
        <Typography variant='h6'>
          Height: {pokemon.height / 10 + 'm'}
        </Typography>
        <Typography variant='h6'>
          Weight: {pokemon.weight / 10 + 'kg'}
        </Typography>
        <Typography variant='h6'>
          Abilities: {pokemon.abilities.join(',')}
        </Typography>
        <Typography variant='h6'>
          Held Items: {pokemon?.heldItems.join(',') ?? 'Null'}
        </Typography>
      </Box>
    </Modal>
  );
};

export default PokemonModal;
