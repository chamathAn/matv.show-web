"use client";
import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { useRecentlyWatchedMoviesStore } from "@/Stores/Stale/RecentlyWatched/useRecentlyWatchedMoviesStore";
import { useRecentlyWatchedTvshowsStore } from "@/Stores/Stale/RecentlyWatched/useRecentlyWatchedTvshowsStore";
import { useRecentlyWatchedAnimesStore } from "@/Stores/Stale/RecentlyWatched/useRecentlyWatchedAnimeStore";
import { OneMovieDetailsType } from "@/Shared/Types/movie-api.types";
import { OneTvshowDetailsType } from "@/Shared/Types/tvshows-api.types";
import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";

type UseRecentlyWatchedReturn = {
  recenltyWatchedMovies: OneMovieDetailsType[];
  recenltyWatchedTvShows: OneTvshowDetailsType[];
  recentlyWatchedAnimes: AnimeFullDetailsType[];
};

export function useRecentlyWatched(): UseRecentlyWatchedReturn {
  //   recently watched movies
  const recenltyWatchedMovies = useStore(
    useRecentlyWatchedMoviesStore,
    (s) => s.recentlyWatchedMovies
  );
  const isMoviesFetched =
    useRecentlyWatchedMoviesStore.getState().isRecentlyWatchedMoviesFetched;

  //   recently watched tv shows
  const recenltyWatchedTvShows = useStore(
    useRecentlyWatchedTvshowsStore,
    (s) => s.recentlyWatchedTvshows
  );
  const isTvFetched =
    useRecentlyWatchedTvshowsStore.getState().isRecentlyWatchedTvshowsFetched;

  //   recently watched animes
  const recentlyWatchedAnimes = useStore(
    useRecentlyWatchedAnimesStore,
    (s) => s.recentlyWatchedAnimes
  );
  const isAnimesFetched =
    useRecentlyWatchedAnimesStore.getState().isRecentlyWatchedAnimesFetched;

  // * Fetch data only if not yet fetched
  useEffect(() => {
    if (!isMoviesFetched) {
      useRecentlyWatchedMoviesStore.getState().fetchRecentlyWatchedMovies();
    }
    if (!isTvFetched) {
      useRecentlyWatchedTvshowsStore.getState().fetchRecentlyWatchedTvshows();
    }
    if (!isAnimesFetched) {
      useRecentlyWatchedAnimesStore.getState().fetchRecentlyWatchedAnimes();
    }
  }, []);

  // * Combine data and return
  const combined = useMemo(() => {
    return {
      recenltyWatchedMovies: recenltyWatchedMovies,
      recenltyWatchedTvShows: recenltyWatchedTvShows,
      recentlyWatchedAnimes: recentlyWatchedAnimes,
    };
  }, [recenltyWatchedMovies, recenltyWatchedTvShows, recentlyWatchedAnimes]);

  return combined;
}
