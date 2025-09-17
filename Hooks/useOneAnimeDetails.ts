"use client";
import { useOneAnimeDetailsStore } from "@/Stores/Stale/Content/useOneAnimeDetailsStore";
import { useEffect } from "react";
import { useStore } from "zustand";

export default function useOneAnimeDetails() {
  const animeState = useStore(useOneAnimeDetailsStore);

  useEffect(() => {
    if (!animeState.isOneAnimeDetailsFetched) {
      useOneAnimeDetailsStore.getState().fetchOneAnimeDetails();
    }
  }, []);

  return {
    oneAnimeDetails: animeState.oneAnimeDetails,
    isLoading: animeState.loading,
    allEpisodes: animeState.allEpisodes,
  };
}
