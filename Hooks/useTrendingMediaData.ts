"use client";
import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { useTrendingAnimes } from "@/Stores/Cache/useTrendingAnime";
import { useTrendingMovies } from "@/Stores/Cache/useTrendingMovies";
import { useTrendingTvshows } from "@/Stores/Cache/useTrendingTvshows";

const useTrendingMediaData = () => {
  const animeState = useStore(useTrendingAnimes);
  const movieState = useStore(useTrendingMovies);
  const tvState = useStore(useTrendingTvshows);

  // * fetching trending movies, TV shows, and animes
  useEffect(() => {
    if (!animeState.isTrendingAnimesFetched) {
      useTrendingAnimes.getState().fetchTrendingAnimes();
    }
    if (!movieState.isTrendingMoviesFetched) {
      useTrendingMovies.getState().fetchTrendingMovies();
    }
    if (!tvState.isTrendingTvshowsFetched) {
      useTrendingTvshows.getState().fetchTrendingTvshows();
    }
  }, [animeState, movieState, tvState]);

  // * Combine data and return
  const combined = useMemo(() => {
    return {
      trendingMovies: movieState.trendingMovies,
      trendingTvshows: tvState.trendingTvshows,
      trendingAnimes: animeState.trendingAnimes,
    };
  }, [
    movieState.trendingMovies,
    tvState.trendingTvshows,
    animeState.trendingAnimes,
  ]);

  return combined;
};

export default useTrendingMediaData;
