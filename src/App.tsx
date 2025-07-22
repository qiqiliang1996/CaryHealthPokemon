import React, { useMemo, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import pokemonLogo from './assets/pokeapi-logo.png';
import type { Pokemon } from './types';
import { usePokemonData } from './hooks/usePokemonData';
import {
  SearchBar,
  ViewToggle,
  PokemonCard,
  PokemonGrid,
  TypePie,
  PokemonModal,
} from './components';

function App() {
  const [viewPage, setViewPage] = useState<'viewAll' | 'viewFavorite'>(
    'viewAll'
  );
  const [search, setSearch] = useState<string>('');

  const {
    pokemons,
    shownPokemons,
    favorites,
    typeCounts,
    selectedDetails,
    loadingList,
    loadingFavTypes,
    errorList,
    loadMore,
    toggleFavorite,
    selectPokemon,
    clearSelection,
    allShown,
  } = usePokemonData();

  // filter after pagination to match your original behavior; change if desired
  const filtered = useMemo(() => {
    const base = shownPokemons;
    if (!search.trim()) return base;
    const s = search.trim().toLowerCase();
    return base.filter((p) => p.name.toLowerCase().includes(s));
  }, [shownPokemons, search]);

  // Map spriteUrl from cached details? For simplicity we skip; would require exposing cache.
  // (Extension: expose getDetails + detailCache via hook, fetch in visible list to show sprites.)

  const renderAllView = () => {
    if (loadingList) {
      return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 1 }}>Loading Pokémon…</Typography>
        </Box>
      );
    }
    if (errorList) {
      return (
        <Typography color='error' align='center' sx={{ mt: 4 }}>
          {errorList}
        </Typography>
      );
    }
    if (!filtered.length) {
      return (
        <Typography align='center' sx={{ mt: 4 }}>
          No Pokémon match your search.
        </Typography>
      );
    }
    return (
      <PokemonGrid>
        {filtered.map((pokemon: Pokemon) => (
          <PokemonCard
            key={pokemon.name}
            pokemon={pokemon}
            favoritedPokemons={favorites}
            toggleFavorite={toggleFavorite}
            handleSelectPokemon={selectPokemon}
          />
        ))}
        {/* Load More tile only when not searching */}
        {!search && !allShown && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: 80,
            }}
          >
            <Button variant='contained' onClick={loadMore}>
              Load More Pokémon
            </Button>
          </Box>
        )}
        {!search && allShown && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: 80,
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              All Pokémon are shown.
            </Typography>
          </Box>
        )}
      </PokemonGrid>
    );
  };

  const renderFavoritesView = () => {
    if (!favorites.length) {
      return (
        <Typography align='center' sx={{ mt: 4 }}>
          No favorites yet.
        </Typography>
      );
    }
    return (
      <>
        <PokemonGrid>
          {favorites.map((pokemon: Pokemon) => (
            <PokemonCard
              key={pokemon.name}
              pokemon={pokemon}
              favoritedPokemons={favorites}
              toggleFavorite={toggleFavorite}
              handleSelectPokemon={selectPokemon}
            />
          ))}
        </PokemonGrid>
        {loadingFavTypes ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress size={20} />
          </Box>
        ) : (
          <TypePie data={typeCounts} />
        )}
      </>
    );
  };

  return (
    <>
      <PokemonModal
        open={!!selectedDetails}
        pokemon={selectedDetails}
        onClose={clearSelection}
      />
      <Box
        sx={{
          maxWidth: '100%',
          mx: '100px',
          p: 2,
          my: 20,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#EDEEF7',
            borderRadius: 3,
            minHeight: 300,
            p: 3,
            textAlign: 'center',
          }}
        >
          <Box component='img' src={pokemonLogo} alt='PokéAPI' width={300} />
          <Typography sx={{ mt: 1 }}>
            Search the first 150 Pokémon and mark your favorites!
          </Typography>
          <SearchBar
            value={search}
            onChange={setSearch}
            onSubmit={() => {
              /* no-op; search is reactive */
            }}
          />
          <ViewToggle value={viewPage} onChange={setViewPage} />
        </Box>

        {/* Content */}
        <Box sx={{ mt: 10 }}>
          {viewPage === 'viewAll' ? renderAllView() : renderFavoritesView()}
        </Box>
      </Box>
    </>
  );
}

export default App;
