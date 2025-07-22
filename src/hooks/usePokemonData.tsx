import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Pokemon, PokemonDetails, TypeCount } from '../types';
import {
  fetchPokemonList,
  fetchPokemonDetails as apiFetchDetails,
} from '../api/pokeapi';
import { buildTypeCounts } from '../utils/typeCounts';

export interface UsePokemonDataOptions {
  pageSize?: number; // default 30
  initialLimit?: number; // default 150
}

export function usePokemonData(options: UsePokemonDataOptions = {}) {
  const { pageSize = 30, initialLimit = 150 } = options;

  // master list
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<string | null>(null);

  // favorites (subset of pokemons)
  const [favorites, setFavorites] = useState<Pokemon[]>([]);

  // selected pokemon details
  const [selected, setSelected] = useState<string>('');
  const [selectedDetails, setSelectedDetails] = useState<PokemonDetails | null>(
    null
  );

  // pagination
  const [currentPage, setCurrentPage] = useState<number>(0);

  // local search text (controlled externally in App)
  // kept outside hook – we just expose helpers.

  // detail cache; name -> PokemonDetails
  const detailCache = useRef<Record<string, PokemonDetails>>({});

  // --- list fetch ---
  const loadList = useCallback(async () => {
    setLoadingList(true);
    setErrorList(null);
    try {
      const list = await fetchPokemonList(initialLimit, 0);
      setPokemons(list);
    } catch (err: any) {
      setErrorList(err?.message ?? 'Failed to load Pokémon list');
    } finally {
      setLoadingList(false);
    }
  }, [initialLimit]);

  // initial load
  useEffect(() => {
    loadList();
  }, [loadList]);

  // --- detail fetch (with cache) ---
  const getDetails = useCallback(
    async (
      name: string,
      { force = false }: { force?: boolean } = {}
    ): Promise<PokemonDetails | null> => {
      if (!force && detailCache.current[name]) {
        return detailCache.current[name];
      }
      try {
        const d = await apiFetchDetails(name);
        detailCache.current[name] = d;
        return d;
      } catch (err) {
        console.error('Failed to fetch details for', name, err);
        return null;
      }
    },
    []
  );

  // selecting a pokemon loads details for modal
  const selectPokemon = useCallback(
    async (name: string) => {
      setSelected(name);
      const d = await getDetails(name);
      setSelectedDetails(d);
    },
    [getDetails]
  );

  const clearSelection = useCallback(() => {
    setSelected('');
    setSelectedDetails(null);
  }, []);

  // toggle favorite
  const toggleFavorite = useCallback((pokemon: Pokemon) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.name === pokemon.name);
      return exists
        ? prev.filter((f) => f.name !== pokemon.name)
        : [...prev, pokemon];
    });
  }, []);

  // recompute type counts from favorites (using cache; fetch details if needed)
  const [typeCounts, setTypeCounts] = useState<TypeCount[]>([]);
  const [loadingFavTypes, setLoadingFavTypes] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!favorites.length) {
        setTypeCounts([]);
        return;
      }
      setLoadingFavTypes(true);
      // ensure all favorites are cached
      await Promise.all(
        favorites.map(async (f) => {
          if (!detailCache.current[f.name]) {
            await getDetails(f.name);
          }
        })
      );
      if (cancelled) return;
      const allTypeNames: string[] = [];
      favorites.forEach((f) => {
        const d = detailCache.current[f.name];
        if (d?.type) allTypeNames.push(...d.type);
      });
      setTypeCounts(buildTypeCounts(allTypeNames));
      setLoadingFavTypes(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [favorites, getDetails]);

  // pagination helpers
  const loadMore = useCallback(() => {
    setCurrentPage((p) => p + 1);
  }, []);

  const maxShown = useMemo(
    () => (currentPage + 1) * pageSize,
    [currentPage, pageSize]
  );
  const shownPokemons = useMemo(
    () => pokemons.slice(0, maxShown),
    [pokemons, maxShown]
  );
  const allShown = shownPokemons.length >= pokemons.length; // all loaded?

  return {
    // data
    pokemons,
    shownPokemons,
    favorites,
    typeCounts,
    selected,
    selectedDetails,

    // loading flags
    loadingList,
    loadingFavTypes,
    errorList,

    // actions
    loadList,
    loadMore,
    toggleFavorite,
    selectPokemon,
    clearSelection,
    getDetails,

    // status helpers
    allShown,
    pageSize,
  };
}
