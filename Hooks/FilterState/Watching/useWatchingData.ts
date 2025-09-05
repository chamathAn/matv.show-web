"use client";
import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { useWatchingMoviesStore } from "@/Stores/Stale/FilterState/Watching/useWatchingMoviesStore";
import { useWatchingTvshowsStore } from "@/Stores/Stale/FilterState/Watching/useWatchingTvshowsStore";
import { useWatchingAnimesStore } from "@/Stores/Stale/FilterState/Watching/useWatchingAnimesStore";

const useWatchingData = () => {
  const movieState = useStore(useWatchingMoviesStore);
  const tvState = useStore(useWatchingTvshowsStore);
  const animeState = useStore(useWatchingAnimesStore);

  useEffect(() => {
    if (!movieState.isWatchingMoviesFetched) {
      useWatchingMoviesStore.getState().fetchWatchingMovies();
    }
    if (!tvState.isWatchingTvshowsFetched) {
      useWatchingTvshowsStore.getState().fetchWatchingTvshows();
    }
    if (!animeState.isWatchingAnimesFetched) {
      useWatchingAnimesStore.getState().fetchWatchingAnimes();
    }
  }, []);

  return useMemo(
    () => ({
      watchingMovies: movieState.watchingMovies,
      watchingTvshows: tvState.watchingTvshows,
      watchingAnimes: animeState.watchingAnimes,
    }),
    [
      movieState.watchingMovies,
      tvState.watchingTvshows,
      animeState.watchingAnimes,
    ]
  );
};

export default useWatchingData;
