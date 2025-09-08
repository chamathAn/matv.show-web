import { OneMovieDetailsType } from "@/Shared/Types/movie-api.types";
import axios from "axios";
import { createStore } from "zustand";
import { useUserAllMoviesStore } from "../../UserAll/useUserAllMATStore";

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
        // fetch user tv shows from backend
        await useUserAllMoviesStore.getState().fetchUserMovies();

        const completedDBmovies = useUserAllMoviesStore
          .getState()
          .userAllMovies.filter((movie) => movie.movieStates === "complete");

        const movieIds = completedDBmovies.map((movie) => movie.movieId);
        if (movieIds.length === 0) return; // if user has no movies, return

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
