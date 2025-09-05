"use client";
import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { useDroppedMoviesStore } from "@/Stores/Stale/FilterState/Dropped/useDroppedMoviesStore";
import { useDroppedTvshowsStore } from "@/Stores/Stale/FilterState/Dropped/useDroppedTvshowsStore";
import { useDroppedAnimesStore } from "@/Stores/Stale/FilterState/Dropped/useDroppedAnimesStore";

const useDroppedData = () => {
  const movieState = useStore(useDroppedMoviesStore);
  const tvState = useStore(useDroppedTvshowsStore);
  const animeState = useStore(useDroppedAnimesStore);

  useEffect(() => {
    if (!movieState.isDroppedMoviesFetched) {
      useDroppedMoviesStore.getState().fetchDroppedMovies();
    }
    if (!tvState.isDroppedTvshowsFetched) {
      useDroppedTvshowsStore.getState().fetchDroppedTvshows();
    }
    if (!animeState.isDroppedAnimesFetched) {
      useDroppedAnimesStore.getState().fetchDroppedAnimes();
    }
  }, []);

  return useMemo(
    () => ({
      droppedMovies: movieState.droppedMovies,
      droppedTvshows: tvState.droppedTvshows,
      droppedAnimes: animeState.droppedAnimes,
    }),
    [movieState.droppedMovies, tvState.droppedTvshows, animeState.droppedAnimes]
  );
};

export default useDroppedData;
