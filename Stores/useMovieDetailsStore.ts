import { createStore } from "zustand";

type MovieDetailsStore = {
  movieDetails: any;
  isMovieDetailsFetched: boolean;
  fetchMovieDetails: () => Promise<void>;
};

export const useMovieDetailsStore = createStore<MovieDetailsStore>((set) => ({
  movieDetails: {},
  isMovieDetailsFetched: false,
  fetchMovieDetails: async () => {
    const response = await fetch("/api/movies");
    const data = await response.json();
    set({ movieDetails: data, isMovieDetailsFetched: true });
  },
}));
