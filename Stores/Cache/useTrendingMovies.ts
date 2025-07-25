import { TrendingMoviesType } from "@/Shared/Types/movie-api.types";
import axios from "axios";
import { createStore } from "zustand";

type TrendingMoviesStore = {
  trendingMovies: TrendingMoviesType[];
  isTrendingMoviesFetched: boolean;
  fetchTrendingMovies: () => void;
};

export const useTrendingMovies = createStore<TrendingMoviesStore>()((set) => ({
  trendingMovies: [],
  isTrendingMoviesFetched: false,

  fetchTrendingMovies: async () => {
    try {
      const res = await axios.get(
        "https://api.themoviedb.org/3/trending/movie/day",
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer " + process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
          },
        }
      );

      set({
        trendingMovies: res.data.results,
        isTrendingMoviesFetched: true,
      });
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  },
}));
