"use client";
import { useUserAllTvShowsStore } from "@/Stores/Stale/UserAll/useUserAllMATStore";
import { useEffect } from "react";
import { useStore } from "zustand";

export default function useUserAllTvShows() {
  const tvShowsState = useStore(useUserAllTvShowsStore);

  useEffect(() => {
    if (!tvShowsState.isUserTvShowsFetched) {
      useUserAllTvShowsStore.getState().fetchUserTvShows();
    }
  }, [tvShowsState.isUserTvShowsFetched]);

  return {
    userAllTvShows: tvShowsState.userAllTvShows,
    isLoadingUserTvShows: tvShowsState.loading,
  };
}
