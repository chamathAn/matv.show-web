import { OneMovieDetailsType } from "@/Shared/Types/movie-api.types";
import axios from "axios";
import { createStore } from "zustand";

type WatchingMoviesStore = {
  watchingMovies: OneMovieDetailsType[];
  isWatchingMoviesFetched: boolean;
  fetchWatchingMovies: () => void;
};

export const useWatchingMoviesStore = createStore<WatchingMoviesStore>()(
  (set) => ({
    watchingMovies: [],
    isWatchingMoviesFetched: false,

    fetchWatchingMovies: async () => {
      try {
        // * Sample watching movie IDs
        const movieIds = [299536, 603, 157336, 272]; // Avengers, Matrix, Interstellar, Batman Begins

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

        set({ watchingMovies: movieData, isWatchingMoviesFetched: true });
      } catch (error) {
        console.error("Error fetching watching movies:", error);
      }
    },
  })
);
