"use client";
import { useOneMovieDetailsStore } from "@/Stores/Stale/Content/useOneMovieDetailsStore";
import { useEffect } from "react";
import { useStore } from "zustand";

export default function useOneMovieDetails() {
  const movieState = useStore(useOneMovieDetailsStore);

  useEffect(() => {
    if (!movieState.isOneMovieDetailsFetched) {
      useOneMovieDetailsStore.getState().fetchOneMovieDetails();
    }
  }, []);

  return {
    oneMovieDetails: movieState.oneMovieDetails,
    isLoading: movieState.loading,
  };
}
