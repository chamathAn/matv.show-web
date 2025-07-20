import { OneMovieDetailsType } from "@/Shared/Types/movie-api.types";
import axios from "axios";
import { createStore } from "zustand";

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
        // * Sample Ids
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
          planToWatchMovies: movieData,
          isPlanToWatchMoviesFetched: true,
        });
      } catch (error) {
        console.error("Error fetching plan to watch movies:", error);
      }
    },
  })
);
