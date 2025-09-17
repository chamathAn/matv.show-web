import { OneMovieDetailsType } from "@/Shared/Types/movie-api.types";
import axios from "axios";
import { createStore } from "zustand";
import { useUserAllMoviesStore } from "../../UserAll/useUserAllMATStore";

type PlanToWatchMoviesStore = {
  planToWatchMovies: OneMovieDetailsType[];
  isPlanToWatchMoviesFetched: boolean;
  fetchPlanToWatchMovies: () => void;
};

export const usePlanToWatchMoviesStore = createStore<PlanToWatchMoviesStore>()(
  (set) => ({
    planToWatchMovies: [],
    isPlanToWatchMoviesFetched: false,

    fetchPlanToWatchMovies: async () => {
      try {
        await useUserAllMoviesStore.getState().fetchUserMovies();

        const completedDBmovies = useUserAllMoviesStore
          .getState()
          .userAllMovies.filter((movie) => movie.movieStates === "planToWatch");

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
          planToWatchMovies: movieData,
          isPlanToWatchMoviesFetched: true,
        });
      } catch (error) {
        console.error("Error fetching plan to watch movies:", error);
      }
    },
  })
);
