import { OneMovieDetailsType } from "@/Shared/Types/movie-api.types";
import axios from "axios";
import { createStore } from "zustand";

type RecentlyWatchedMoviesStore = {
  recentlyWatchedMovies: OneMovieDetailsType[];
  isRecentlyWatchedMoviesFetched: boolean;
  fetchRecentlyWatchedMovies: () => void;
};

export const useRecentlyWatchedMoviesStore =
  createStore<RecentlyWatchedMoviesStore>()((set) => ({
    recentlyWatchedMovies: [],
    isRecentlyWatchedMoviesFetched: false,
    fetchRecentlyWatchedMovies: async () => {
      try {
        const res = await axios.get("https://api.themoviedb.org/3/movie/1396", {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer " + process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
          },
        });
        set((state) => ({
          recentlyWatchedMovies: [...state.recentlyWatchedMovies, res.data],
          isRecentlyWatchedMoviesFetched: true,
        }));
      } catch (error) {
        console.error("Error fetching recently watched movies:", error);
      }
    },
  }));
