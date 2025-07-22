import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { PokemonDetails } from '../types';
import { capitalize } from '../utils/capitalize';

interface PokemonModalProps {
  open: boolean;
  pokemon: PokemonDetails | null;
  onClose: () => void;
}

export const PokemonModal: React.FC<PokemonModalProps> = ({
  open,
  pokemon,
  onClose,
}) => {
  if (!pokemon) return null;
  return (
    <Modal open={open} onClose={onClose} aria-labelledby='pokemon-modal-title'>
      <Box
        sx={{
          p: 3,
          maxWidth: 400,
          margin: '10% auto',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          outline: 'none',
          position: 'relative',
        }}
      >
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        {pokemon.spriteUrl ? (
          <Box
            component='img'
            src={pokemon.spriteUrl}
            alt={pokemon.name}
            sx={{ width: 96, height: 96, objectFit: 'contain', mb: 1 }}
          />
        ) : null}
        <Typography id='pokemon-modal-title' variant='h6' gutterBottom>
          {capitalize(pokemon.name)}
        </Typography>
        <Typography variant='body1'>Type: {pokemon.type.join(', ')}</Typography>
        <Typography variant='body1'>Height: {pokemon.height / 10} m</Typography>
        <Typography variant='body1'>
          Weight: {pokemon.weight / 10} kg
        </Typography>
        <Typography variant='body1'>
          Abilities: {pokemon.abilities.join(', ') || 'None'}
        </Typography>
        <Typography variant='body1'>
          Held Items: {pokemon.heldItems.join(', ') || 'None'}
        </Typography>
      </Box>
    </Modal>
  );
};
