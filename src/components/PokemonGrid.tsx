import React, { type ReactNode } from 'react';
import { Box } from '@mui/material';

interface PokemonGridProps {
  children: ReactNode;
  minWidth?: number; // card min width breakpoint
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({
  children,
  minWidth = 160,
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: `repeat(auto-fill, minmax(${minWidth - 20}px, 1fr))`,
          sm: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
          md: `repeat(auto-fill, minmax(${minWidth + 40}px, 1fr))`,
        },
        gap: 2,
        justifyItems: 'center',
        alignItems: 'stretch',
      }}
    >
      {children}
    </Box>
  );
};
