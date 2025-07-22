import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from '@mui/material';
import pokemonLogo from './assets/pokeapi-logo.png';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import type { Pokemon, PokemonDetails, TypeCount } from './types';
import PokemonCard from './components/PokemonCard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import PokemonModal from './components/PokemonModal';
const COLORS = [
  '#ff6384',
  '#36a2eb',
  '#ffce56',
  '#4bc0c0',
  '#9966ff',
  '#ff9f40',
  '#8dd1e1',
  '#a4de6c',
  '#d0ed57',
];
function App() {
  const [types, setTypes] = useState<TypeCount[]>([]); // live counts (favorites only)
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState<string>('');
  const [viewPage, setViewPage] = useState<'viewAll' | 'viewFavorite'>(
    'viewAll'
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedPokemon, setSelectedPokemon] = useState<string>('');
  const [favorites, setFavorites] = useState<Pokemon[]>([]);
  const [selectedPokemonDetails, setSelectedPokemonDetails] =
    useState<PokemonDetails | null>(null);

  // Cache: pokemonName -> string[] of type names
  const detailsCache = useRef<Record<string, string[]>>({});

  const handleSearch = () => {
    console.log('qq search', search);
  };

  /** Fetch list of 150. */
  const fetchPokemons = async () => {
    const pokemonApi = 'https://pokeapi.co/api/v2/pokemon?limit=150&offset=0';

    try {
      const { data } = await axios.get(pokemonApi);
      setPokemons(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  /** Fetch *detail* for one Pokémon; parse full details; cache its types. */
  const fetchPokemonDetails = useCallback(async (name: string) => {
    if (!name) return null;
    try {
      const pokemonDetailApi = `https://pokeapi.co/api/v2/pokemon/${name}`;
      const { data } = await axios.get(pokemonDetailApi);

      // Parse details
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

      const details: PokemonDetails = {
        name,
        abilities,
        type,
        height,
        heldItems,
        weight,
        spriteUrl,
      };

      // Cache types specifically for counts
      detailsCache.current[name] = type;

      // If this fetch was triggered by selecting the Pokémon, update modal data
      setSelectedPokemonDetails(details);

      return details;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);
  /** Build sorted counts array from a flat list of type names. */
  function buildTypeCounts(typeNames: string[]): TypeCount[] {
    const map: Record<string, number> = {};
    typeNames.forEach((n) => {
      map[n] = (map[n] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Recompute type counts from *current* favorites using cache. */
  const recomputeTypeCounts = useCallback(() => {
    const all: string[] = [];
    favorites.forEach((f) => {
      const t = detailsCache.current[f.name];
      if (t) all.push(...t);
    });
    setTypes(buildTypeCounts(all));
  }, [favorites]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await Promise.all(
        favorites.map(async (f) => {
          if (!detailsCache.current[f.name]) {
            const d = await fetchPokemonDetails(f.name);
            if (cancelled) return;
            if (d) detailsCache.current[f.name] = d.type;
          }
        })
      );
      if (cancelled) return;
      recomputeTypeCounts();
    };
    if (favorites.length) {
      run();
    } else {
      setTypes([]);
    }
    return () => {
      cancelled = true;
    };
  }, [favorites, fetchPokemonDetails, recomputeTypeCounts]);

  // Initial fetch
  useEffect(() => {
    fetchPokemons();
  }, []);
  // Fetch details when selectedPokemon changes (for modal)
  useEffect(() => {
    if (!selectedPokemon) return;
    fetchPokemonDetails(selectedPokemon);
  }, [selectedPokemon, fetchPokemonDetails]);

  const handleSelectPokemon = (pokemonName: string) => {
    setSelectedPokemon(pokemonName);
    setOpenModal(true);
  };
  const toggleFavorite = (pokemon: Pokemon) => {
    setFavorites((prev) => {
      const isFav = prev.some((f) => f.name === pokemon.name);
      return isFav
        ? prev.filter((f) => f.name !== pokemon.name)
        : [...prev, pokemon];
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const convertPercentage = (name: string, data: TypeCount[]) => {
    const total = data.reduce((sum: number, item) => sum + item.value, 0);
    const target = data.find((item) => item.name === name);

    return target ? ((target.value / total) * 100).toFixed(2) + '%' : 0;
  };

  const visibleData = pokemons.slice(0, currentPage * 30 + 30);
  const filterPokemons = visibleData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <Box
        sx={{
          maxWidth: '100%', // prevents overflow
          mx: '100px', // centers horizontally
          p: 2,
          my: 20,
        }}
      >
        {/* //Modal */}
        <PokemonModal
          open={openModal}
          pokemon={selectedPokemonDetails}
          onClose={handleCloseModal}
        />
        {/* //header */}
        <Box
          sx={{
            backgroundColor: '#EDEEF7',
            borderRadius: 3,
            height: 300,
            p: 3,
          }}
        >
          <img src={pokemonLogo} width='300' />
          <Typography>
            Search the first 150 Pokemon and mark your favorites!
          </Typography>
          <TextField
            sx={{ mt: 6 }}
            label='Search Pokémon'
            variant='outlined'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            fullWidth
            margin='normal'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={() => handleSearch()}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column-reverse', sm: 'row-reverse' },
              gap: 1,
              mb: 2,
            }}
          >
            <Button onClick={() => setViewPage('viewFavorite')}>
              View Favorites
            </Button>
            <Button onClick={() => setViewPage('viewAll')}>View All</Button>
          </Box>
        </Box>

        {/* // all content */}
        <Box sx={{ mt: 10 }}>
          {viewPage === 'viewAll' &&
            (filterPokemons.length === 0 ? (
              'No Data Available'
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row', // Force row direction
                  flexWrap: 'wrap',
                  gap: 2,
                  justifyContent: 'center',
                }}
              >
                <>
                  {filterPokemons.map((pokemon) => (
                    <Box key={pokemon.name}>
                      <PokemonCard
                        handleSelectPokemon={handleSelectPokemon}
                        pokemon={pokemon}
                        favoritedPokemons={favorites}
                        toggleFavorite={toggleFavorite}
                      />
                    </Box>
                  ))}
                  {search ? null : (
                    <Box>
                      <Button
                        variant='contained'
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={visibleData.length === 150}
                        sx={{ height: '100%' }}
                      >
                        {visibleData.length === 150
                          ? 'All Pokémons are shown'
                          : 'Load More Pokémons'}
                      </Button>
                    </Box>
                  )}
                </>
              </Box>
            ))}
        </Box>

        {/* // favrorite content */}
        <Box sx={{ mt: 10 }}>
          {viewPage === 'viewFavorite' && (
            <Box sx={{ mt: 4 }}>
              {favorites.length === 0 ? (
                <Typography align='center'>No favorites yet.</Typography>
              ) : (
                <>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: 'repeat(auto-fill,minmax(140px,1fr))',
                        sm: 'repeat(auto-fill,minmax(160px,1fr))',
                        md: 'repeat(auto-fill,minmax(200px,1fr))',
                      },
                      gap: 2,
                      justifyItems: 'center',
                    }}
                  >
                    {favorites.map((pokemon) => (
                      <PokemonCard
                        key={pokemon.name}
                        handleSelectPokemon={handleSelectPokemon}
                        pokemon={pokemon}
                        favoritedPokemons={favorites}
                        toggleFavorite={toggleFavorite}
                      />
                    ))}
                  </Box>

                  <Box
                    sx={{
                      width: '30%',
                      height: 400,
                      mt: 4,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      // backgroundColor: 'pink',
                    }}
                  >
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={types}
                          dataKey='value'
                          nameKey='name'
                          outerRadius={100}
                          label
                        >
                          {types.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <Box>
                      {types.map((type, index) => (
                        <Typography>
                          {type.name}:{convertPercentage(type.name, types)}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

export default App;
