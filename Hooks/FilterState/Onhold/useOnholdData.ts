"use client";
import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { useOnholdMoviesStore } from "@/Stores/Stale/FilterState/Onhold/useOnholdMoviesStore";
import { useOnholdTvshowsStore } from "@/Stores/Stale/FilterState/Onhold/useOnholdTvshowsStore";
import { useOnholdAnimesStore } from "@/Stores/Stale/FilterState/Onhold/useOnholdAnimesStore";

const useOnholdData = () => {
  const movieState = useStore(useOnholdMoviesStore);
  const tvState = useStore(useOnholdTvshowsStore);
  const animeState = useStore(useOnholdAnimesStore);

  useEffect(() => {
    if (!movieState.isOnholdMoviesFetched) {
      useOnholdMoviesStore.getState().fetchOnholdMovies();
    }
    if (!tvState.isOnholdTvshowsFetched) {
      useOnholdTvshowsStore.getState().fetchOnholdTvshows();
    }
    if (!animeState.isOnholdAnimesFetched) {
      useOnholdAnimesStore.getState().fetchOnholdAnimes();
    }
  }, []);

  return useMemo(
    () => ({
      onholdMovies: movieState.onholdMovies,
      onholdTvshows: tvState.onholdTvshows,
      onholdAnimes: animeState.onholdAnimes,
    }),
    [movieState.onholdMovies, tvState.onholdTvshows, animeState.onholdAnimes]
  );
};

export default useOnholdData;
