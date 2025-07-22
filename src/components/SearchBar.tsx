import React, { type KeyboardEvent } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void; // optional explicit callback when Enter or icon clicked
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  label = 'Search Pokémon',
  value,
  onChange,
  onSubmit,
  autoFocus,
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit?.();
    }
  };
  return (
    <TextField
      sx={{ mt: 6 }}
      label={label}
      variant='outlined'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      margin='normal'
      autoFocus={autoFocus}
      onKeyDown={handleKeyDown}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton aria-label='search' onClick={onSubmit} edge='end'>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
