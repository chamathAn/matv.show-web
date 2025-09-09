"use client";
import { useUserAllAnimesStore } from "@/Stores/Stale/UserAll/useUserAllMATStore";
import { useEffect } from "react";
import { useStore } from "zustand";

export default function useUserAllAnimes() {
  const animeState = useStore(useUserAllAnimesStore);

  useEffect(() => {
    if (!animeState.isUserAnimesFetched) {
      useUserAllAnimesStore.getState().fetchUserAnimes();
    }
  }, [animeState.isUserAnimesFetched]);

  return {
    userAllAnimes: animeState.userAllAnimes,
    isLoadingUserTvShows: animeState.loading,
  };
}
