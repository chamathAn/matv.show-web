import { MovieRecommendationType } from "@/Shared/Types/movie-api.types";
import axios from "axios";
import { createStore } from "zustand";

type MovieRecommendationStore = {
  movieRecommendation: MovieRecommendationType[];
  isMovieRecommendationFetched: boolean;
  fetchMovieRecommendation: () => Promise<void>;
};

export const useMovieRecommendationStore =
  createStore<MovieRecommendationStore>((set) => ({
    movieRecommendation: [],
    isMovieRecommendationFetched: false,
    fetchMovieRecommendation: async () => {
      try {
        const res = await axios.get(
          "https://api.themoviedb.org/3/movie/597/recommendations",
          {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer " + process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
            },
          }
        );

        set({
          movieRecommendation: res.data.results.slice(0, 2),
          isMovieRecommendationFetched: true,
        });
      } catch (error) {
        console.error("Error fetching movie recommendation:", error);
      }
    },
  }));
