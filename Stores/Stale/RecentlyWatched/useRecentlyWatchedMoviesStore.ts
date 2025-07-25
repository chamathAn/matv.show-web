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
        // * sample ids
        const movieIds = [550, 299536, 603, 424];

        const movieRequests = movieIds.map((id) =>
          axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer " + process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
            },
          })
        );

        const responses = await Promise.all(movieRequests);

        const movieData = responses.map((res) => res.data);

        set({
          recentlyWatchedMovies: movieData,
          isRecentlyWatchedMoviesFetched: true,
        });
      } catch (error) {
        console.error("Error fetching recently watched movies:", error);
      }
    },
  }));
