"use client";
import { useUserAllMoviesStore } from "@/Stores/Stale/UserAll/useUserAllMATStore";
import { useEffect } from "react";
import { useStore } from "zustand";

export default function useUserAllMovies() {
  const moviesState = useStore(useUserAllMoviesStore);

  useEffect(() => {
    if (!moviesState.isUserMoviesFetched) {
      useUserAllMoviesStore.getState().fetchUserMovies();
    }
  }, [moviesState.isUserMoviesFetched]);

  return {
    userAllMovies: moviesState.userAllMovies,
    isLoadingUserMovies: moviesState.loading,
  };
}
