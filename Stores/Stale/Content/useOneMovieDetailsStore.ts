import { OneMovieDetailsType } from "@/Shared/Types/movie-api.types";
import axios from "axios";
import { createStore } from "zustand";

type OneMovieDetails = {
  loading: boolean;
  movieId: string;
  oneMovieDetails: OneMovieDetailsType;
  isOneMovieDetailsFetched: boolean;
  fetchOneMovieDetails: () => Promise<void>;
};

export const useOneMovieDetailsStore = createStore<OneMovieDetails>((set) => ({
  loading: false,
  movieId: "",
  oneMovieDetails: Object.create(null),
  isOneMovieDetailsFetched: false,

  fetchOneMovieDetails: async () => {
    try {
      set({ loading: true });

      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${
          useOneMovieDetailsStore.getState().movieId
        }`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer " + process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
          },
        }
      );

      set({
        oneMovieDetails: res.data,
        isOneMovieDetailsFetched: true,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching one movie details:", error);
      set({ loading: false });
    }
  },
}));
