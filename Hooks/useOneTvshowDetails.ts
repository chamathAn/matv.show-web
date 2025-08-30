"use client";
import { useOneTvshowDetailsStore } from "@/Stores/Stale/Content/useOneTvshowDetailStore";
import { useEffect } from "react";
import { useStore } from "zustand";

export default function useOneTvshowDetails() {
  const tvState = useStore(useOneTvshowDetailsStore);
  useEffect(() => {
    if (!tvState.isOneTvshowDetialsFetched) {
      useOneTvshowDetailsStore.getState().fetchOneTvshowDetails();
    }
  }, []);

  return {
    OneTvshowDetails: tvState.oneTvshowdetails,
    isLoading: tvState.loading,
    allSeasons: tvState.allSeasons,
  };
}
