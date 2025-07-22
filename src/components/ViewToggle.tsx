import React from 'react';
import { Box, Button } from '@mui/material';

type ViewKey = 'viewAll' | 'viewFavorite';

interface ViewToggleProps {
  value: ViewKey;
  onChange: (val: ViewKey) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ value, onChange }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', sm: 'row-reverse' },
        gap: 1,
        mb: 2,
      }}
    >
      <Button
        variant={value === 'viewFavorite' ? 'contained' : 'text'}
        onClick={() => onChange('viewFavorite')}
      >
        View Favorites
      </Button>
      <Button
        variant={value === 'viewAll' ? 'contained' : 'text'}
        onClick={() => onChange('viewAll')}
      >
        View All
      </Button>
    </Box>
  );
};
