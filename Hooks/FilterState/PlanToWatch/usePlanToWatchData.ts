"use client";
import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { usePlanToWatchMoviesStore } from "@/Stores/Stale/FilterState/PlanToWatch/usePlanToWatchMovieStore";
import { usePlanToWatchTvshowsStore } from "@/Stores/Stale/FilterState/PlanToWatch/usePlanToWatchTvshowsStore";
import { usePlanToWatchAnimesStore } from "@/Stores/Stale/FilterState/PlanToWatch/usePlanToWatchAnimes";

const usePlanToWatchData = () => {
  const movieState = useStore(usePlanToWatchMoviesStore);
  const tvState = useStore(usePlanToWatchTvshowsStore);
  const animeState = useStore(usePlanToWatchAnimesStore);

  // * Fetch data only if not yet fetched
  useEffect(() => {
    if (!movieState.isPlanToWatchMoviesFetched) {
      usePlanToWatchMoviesStore.getState().fetchPlanToWatchMovies();
    }
    if (!tvState.isPlanToWatchTvshowsFetched) {
      usePlanToWatchTvshowsStore.getState().fetchPlanToWatchTvshows();
    }
    if (!animeState.isPlanToWatchAnimesFetched) {
      usePlanToWatchAnimesStore.getState().fetchPlanToWatchAnimes();
    }
  }, []);

  // * Combine data and return
  const combined = useMemo(() => {
    return {
      planToWatchMovies: movieState.planToWatchMovies,
      planToWatchTvshows: tvState.planToWatchTvshows,
      planToWatchAnimes: animeState.planToWatchAnimes,
    };
  }, [
    movieState.planToWatchMovies,
    tvState.planToWatchTvshows,
    animeState.planToWatchAnimes,
  ]);

  return combined;
};

export default usePlanToWatchData;
