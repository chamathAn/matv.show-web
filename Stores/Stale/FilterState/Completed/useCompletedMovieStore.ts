import { OneMovieDetailsType } from "@/Shared/Types/movie-api.types";
import axios from "axios";
import { createStore } from "zustand";

type CompletedMoviesStore = {
  completedMovies: OneMovieDetailsType[];
  isCompletedMoviesFetched: boolean;
  fetchCompletedMovies: () => void;
};

export const useCompletedMoviesStore = createStore<CompletedMoviesStore>()(
  (set) => ({
    completedMovies: [],
    isCompletedMoviesFetched: false,

    fetchCompletedMovies: async () => {
      try {
        // * Sample Ids for completed movies
        const movieIds = [157336, 278, 238, 680]; // Interstellar, Shawshank, Godfather, Pulp Fiction

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
          completedMovies: movieData,
          isCompletedMoviesFetched: true,
        });
      } catch (error) {
        console.error("Error fetching completed movies:", error);
      }
    },
  })
);
