"use client";
import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { useCompletedMoviesStore } from "@/Stores/Stale/FilterState/Completed/useCompletedMovieStore";
import { useCompletedTvshowsStore } from "@/Stores/Stale/FilterState/Completed/useCompletedTvshowsStore";
import { useCompletedAnimesStore } from "@/Stores/Stale/FilterState/Completed/useCompletedAnimes";

const useCompletedData = () => {
  const movieState = useStore(useCompletedMoviesStore);
  const tvState = useStore(useCompletedTvshowsStore);
  const animeState = useStore(useCompletedAnimesStore);

  // * Fetch data only if not yet fetched
  useEffect(() => {
    if (!movieState.isCompletedMoviesFetched) {
      useCompletedMoviesStore.getState().fetchCompletedMovies();
    }
    if (!tvState.isCompletedTvshowsFetched) {
      useCompletedTvshowsStore.getState().fetchCompletedTvshows();
    }
    if (!animeState.isCompletedAnimesFetched) {
      useCompletedAnimesStore.getState().fetchCompletedAnimes();
    }
  }, []);

  // * Combine data and return
  const combined = useMemo(() => {
    return {
      completedMovies: movieState.completedMovies,
      completedTvshows: tvState.completedTvshows,
      completedAnimes: animeState.completedAnimes,
    };
  }, [
    movieState.completedMovies,
    tvState.completedTvshows,
    animeState.completedAnimes,
  ]);

  return combined;
};

export default useCompletedData;
